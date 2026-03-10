-- RepoMarket initial schema: projects, reports, user profiles, analysis jobs
-- Idempotent: use IF NOT EXISTS / CREATE OR REPLACE where appropriate

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects (repo analyses)
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text DEFAULT '',
  repo_url text NOT NULL,
  repo_owner text NOT NULL,
  repo_name text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  maturity_score smallint,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'ingesting', 'analyzing', 'researching', 'synthesizing', 'complete', 'failed'
  )),
  report_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

-- Reports (GTM report JSON + metadata)
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  exec_summary text,
  maturity_score smallint,
  payload jsonb NOT NULL DEFAULT '{}',
  version int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_project_id ON public.reports(project_id);

-- User profiles (extend auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'solo', 'team', 'agency')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Projects: user can CRUD own
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Reports: via project ownership
DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;
CREATE POLICY "Users can view own reports" ON public.reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = reports.project_id AND p.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert reports for own projects" ON public.reports;
CREATE POLICY "Users can insert reports for own projects" ON public.reports
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = reports.project_id AND p.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update own reports" ON public.reports;
CREATE POLICY "Users can update own reports" ON public.reports
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = reports.project_id AND p.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can delete own reports" ON public.reports;
CREATE POLICY "Users can delete own reports" ON public.reports
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = reports.project_id AND p.user_id = auth.uid())
  );

-- Profiles: user can view/update own
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger: update projects.updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

DROP TRIGGER IF EXISTS set_reports_updated_at ON public.reports;
CREATE TRIGGER set_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
