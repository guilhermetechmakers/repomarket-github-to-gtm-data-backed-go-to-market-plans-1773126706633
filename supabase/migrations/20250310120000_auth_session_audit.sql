-- RepoMarket: Auth, session, audit, OAuth, API keys, plans
-- Idempotent: IF NOT EXISTS / CREATE OR REPLACE

-- Audit logs: sign-in, sign-out, password_reset, impersonation
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL CHECK (action IN (
    'signin', 'signout', 'password_reset', 'password_change',
    'impersonation_start', 'impersonation_end', '2fa_enabled', '2fa_disabled'
  )),
  timestamp timestamptz NOT NULL DEFAULT now(),
  ip_address inet,
  device text,
  success boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own audit logs" ON public.audit_logs;
CREATE POLICY "Users can view own audit logs" ON public.audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Password reset tokens (custom flow; Supabase also has built-in)
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  scope text NOT NULL DEFAULT 'password_reset',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON public.password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON public.password_reset_tokens(expires_at);

ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only for password_reset_tokens" ON public.password_reset_tokens;
CREATE POLICY "Service role only for password_reset_tokens" ON public.password_reset_tokens
  FOR ALL USING (auth.role() = 'service_role');

-- Email verification tokens (custom; Supabase has built-in email confirm)
CREATE TABLE IF NOT EXISTS public.email_verification_tokens (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON public.email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_expires_at ON public.email_verification_tokens(expires_at);

ALTER TABLE public.email_verification_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only for email_verification_tokens" ON public.email_verification_tokens;
CREATE POLICY "Service role only for email_verification_tokens" ON public.email_verification_tokens
  FOR ALL USING (auth.role() = 'service_role');

-- OAuth connections (link provider to user)
CREATE TABLE IF NOT EXISTS public.oauth_connections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('github', 'google')),
  provider_user_id text NOT NULL,
  connected_at timestamptz NOT NULL DEFAULT now(),
  scopes text[] DEFAULT '{}',
  UNIQUE(provider, provider_user_id)
);

CREATE INDEX IF NOT EXISTS idx_oauth_connections_user_id ON public.oauth_connections(user_id);

ALTER TABLE public.oauth_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own oauth_connections" ON public.oauth_connections;
CREATE POLICY "Users can view own oauth_connections" ON public.oauth_connections
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own oauth_connections" ON public.oauth_connections;
CREATE POLICY "Users can insert own oauth_connections" ON public.oauth_connections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own oauth_connections" ON public.oauth_connections;
CREATE POLICY "Users can delete own oauth_connections" ON public.oauth_connections
  FOR DELETE USING (auth.uid() = user_id);

-- API keys (hashed, per user)
CREATE TABLE IF NOT EXISTS public.api_keys (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_hash text NOT NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz,
  enabled boolean NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own api_keys" ON public.api_keys;
CREATE POLICY "Users can manage own api_keys" ON public.api_keys
  FOR ALL USING (auth.uid() = user_id);

-- Plans / subscription (user_id -> plan_id, status)
CREATE TABLE IF NOT EXISTS public.plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan_id text NOT NULL DEFAULT 'free' CHECK (plan_id IN ('free', 'solo', 'team', 'agency')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  auto_renew boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_plans_user_id ON public.plans(user_id);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own plan" ON public.plans;
CREATE POLICY "Users can view own plan" ON public.plans
  FOR SELECT USING (auth.uid() = user_id);

-- Extend profiles: 2FA placeholder, last_sign_in_at
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS two_fa_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_sign_in_at timestamptz,
  ADD COLUMN IF NOT EXISTS failed_signin_attempts smallint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- User preferences (privacy, notifications) - optional
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  privacy_retention_days int,
  email_notifications boolean NOT NULL DEFAULT true,
  marketing_emails boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own preferences" ON public.user_preferences;
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);
