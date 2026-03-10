-- RepoMarket: Security & Data Privacy - repositories, ingestion, snapshots, purge, retention, secrets audit
-- Idempotent: IF NOT EXISTS. projects table already exists in initial_schema.

-- Repositories (linked to existing project, optional ingestion_config)
CREATE TABLE IF NOT EXISTS public.repositories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  github_id text,
  repo_full_name text NOT NULL,
  owner text NOT NULL,
  default_branch text NOT NULL DEFAULT 'main',
  ingestion_config_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_repositories_project_id ON public.repositories(project_id);
ALTER TABLE public.repositories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage repos via project" ON public.repositories;
CREATE POLICY "Users can manage repos via project" ON public.repositories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid())
  );

-- Ingestion configs (branch, depth, include private, schedule)
CREATE TABLE IF NOT EXISTS public.ingestion_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id uuid NOT NULL REFERENCES public.repositories(id) ON DELETE CASCADE,
  branches text[] NOT NULL DEFAULT ARRAY['main'],
  depth int NOT NULL DEFAULT 1 CHECK (depth >= 0 AND depth <= 100),
  include_private boolean NOT NULL DEFAULT false,
  schedule text,
  status text NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'completed', 'failed', 'paused')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ingestion_configs_repo_id ON public.ingestion_configs(repo_id);
ALTER TABLE public.ingestion_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage ingestion_configs via repo" ON public.ingestion_configs;
CREATE POLICY "Users can manage ingestion_configs via repo" ON public.ingestion_configs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.repositories r
      JOIN public.projects p ON p.id = r.project_id
      WHERE r.id = repo_id AND p.user_id = auth.uid()
    )
  );

-- Snapshots (stored in Supabase Storage; encryption at rest via Supabase)
CREATE TABLE IF NOT EXISTS public.snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id uuid NOT NULL REFERENCES public.repositories(id) ON DELETE CASCADE,
  storage_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  size_bytes bigint,
  encryption_details jsonb DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_snapshots_repo_id ON public.snapshots(repo_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_created_at ON public.snapshots(created_at DESC);
ALTER TABLE public.snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage snapshots via repo" ON public.snapshots;
CREATE POLICY "Users can manage snapshots via repo" ON public.snapshots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.repositories r
      JOIN public.projects p ON p.id = r.project_id
      WHERE r.id = repo_id AND p.user_id = auth.uid()
    )
  );

-- Analysis results (per snapshot)
CREATE TABLE IF NOT EXISTS public.analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id uuid NOT NULL REFERENCES public.snapshots(id) ON DELETE CASCADE,
  metrics_summary jsonb DEFAULT '{}',
  insights jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analysis_results_snapshot_id ON public.analysis_results(snapshot_id);
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage analysis_results via snapshot" ON public.analysis_results;
CREATE POLICY "Users can manage analysis_results via snapshot" ON public.analysis_results
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.snapshots s
      JOIN public.repositories r ON r.id = s.repo_id
      JOIN public.projects p ON p.id = r.project_id
      WHERE s.id = snapshot_id AND p.user_id = auth.uid()
    )
  );

-- Secrets audit (scrub trail)
CREATE TABLE IF NOT EXISTS public.secrets_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id uuid NOT NULL REFERENCES public.snapshots(id) ON DELETE CASCADE,
  detected_count int NOT NULL DEFAULT 0,
  scrubbed_count int NOT NULL DEFAULT 0,
  scrub_details jsonb DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_secrets_audit_snapshot_id ON public.secrets_audit(snapshot_id);
ALTER TABLE public.secrets_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view secrets_audit via snapshot" ON public.secrets_audit;
CREATE POLICY "Users can view secrets_audit via snapshot" ON public.secrets_audit
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.snapshots s
      JOIN public.repositories r ON r.id = s.repo_id
      JOIN public.projects p ON p.id = r.project_id
      WHERE s.id = snapshot_id AND p.user_id = auth.uid()
    )
  );

-- Purge jobs (irreversible delete with audit trail)
CREATE TABLE IF NOT EXISTS public.purge_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('snapshot', 'analysis', 'repository', 'project')),
  target_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  reason text,
  started_at timestamptz,
  completed_at timestamptz,
  audit_trail jsonb DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_purge_jobs_user_id ON public.purge_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_purge_jobs_status ON public.purge_jobs(status);
ALTER TABLE public.purge_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own purge_jobs" ON public.purge_jobs;
CREATE POLICY "Users can manage own purge_jobs" ON public.purge_jobs
  FOR ALL USING (auth.uid() = user_id);

-- Retention policies (per user or per project, per data type)
CREATE TABLE IF NOT EXISTS public.retention_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  data_type text NOT NULL CHECK (data_type IN ('snapshot', 'analysis', 'metadata', 'logs')),
  retention_days int NOT NULL CHECK (retention_days > 0),
  purge_on_expire boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT retention_scope CHECK (user_id IS NOT NULL OR project_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_retention_policies_user_id ON public.retention_policies(user_id);
CREATE INDEX IF NOT EXISTS idx_retention_policies_project_id ON public.retention_policies(project_id);
ALTER TABLE public.retention_policies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own retention_policies" ON public.retention_policies;
CREATE POLICY "Users can manage own retention_policies" ON public.retention_policies
  FOR ALL USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = auth.uid())
  );

-- Data audit logs (purges, retention actions, scrubs, data access)
CREATE TABLE IF NOT EXISTS public.data_audit_logs (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL CHECK (action IN (
    'purge', 'retention_apply', 'scrub', 'data_access', 'ingestion_start', 'ingestion_complete'
  )),
  resource_type text NOT NULL,
  resource_id uuid,
  timestamp timestamptz NOT NULL DEFAULT now(),
  details jsonb DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_data_audit_logs_user_id ON public.data_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_data_audit_logs_timestamp ON public.data_audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_data_audit_logs_action ON public.data_audit_logs(action);

ALTER TABLE public.data_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own data_audit_logs" ON public.data_audit_logs;
CREATE POLICY "Users can view own data_audit_logs" ON public.data_audit_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can insert data_audit_logs" ON public.data_audit_logs;
CREATE POLICY "Service role can insert data_audit_logs" ON public.data_audit_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Notifications (user-scoped alerts)
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own notifications" ON public.notifications;
CREATE POLICY "Users can manage own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- Link repositories.ingestion_config_id to ingestion_configs (FK added after tables exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'repositories_ingestion_config_id_fkey'
    AND table_name = 'repositories'
  ) THEN
    ALTER TABLE public.repositories
      ADD CONSTRAINT repositories_ingestion_config_id_fkey
      FOREIGN KEY (ingestion_config_id) REFERENCES public.ingestion_configs(id) ON DELETE SET NULL;
  END IF;
END $$;
