-- GTM Synthesis & Report: report_sections, evidence, competitors, icp, pricing, messaging_angles, next_steps, exports, report_versions
-- Idempotent: IF NOT EXISTS; references existing public.reports(id)

-- Add GTM status to reports if not present (draft/final/exported)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reports' AND column_name = 'gtm_status') THEN
    ALTER TABLE public.reports ADD COLUMN gtm_status text DEFAULT 'draft' CHECK (gtm_status IN ('draft', 'final', 'exported'));
  END IF;
END $$;

-- Report sections (execSummary, competitors, icp, positioning, pricing, messagingAngles, nextSteps)
CREATE TABLE IF NOT EXISTS public.report_sections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id uuid NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  key text NOT NULL CHECK (key IN ('execSummary', 'competitors', 'icp', 'positioning', 'pricing', 'messagingAngles', 'nextSteps')),
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  "order" smallint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(report_id, key)
);

CREATE INDEX IF NOT EXISTS idx_report_sections_report_id ON public.report_sections(report_id);

-- Evidence (statement, source, strength, notes)
CREATE TABLE IF NOT EXISTS public.report_evidence (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id uuid NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  statement text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT '',
  strength real NOT NULL DEFAULT 0.5 CHECK (strength >= 0 AND strength <= 1),
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_report_evidence_report_id ON public.report_evidence(report_id);

-- Competitors
CREATE TABLE IF NOT EXISTS public.report_competitors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id uuid NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  positioning text DEFAULT '',
  data_source text DEFAULT '',
  confidence real NOT NULL DEFAULT 0.5 CHECK (confidence >= 0 AND confidence <= 1),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_report_competitors_report_id ON public.report_competitors(report_id);

-- ICP (ideal customer profile)
CREATE TABLE IF NOT EXISTS public.report_icp (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id uuid NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  segment text NOT NULL DEFAULT '',
  persona text DEFAULT '',
  needs text DEFAULT '',
  evidence_refs jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_report_icp_report_id ON public.report_icp(report_id);

-- Pricing
CREATE TABLE IF NOT EXISTS public.report_pricing (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id uuid NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  patterns text DEFAULT '',
  guidance text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_report_pricing_report_id ON public.report_pricing(report_id);

-- Messaging angles
CREATE TABLE IF NOT EXISTS public.report_messaging_angles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id uuid NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  angle text NOT NULL DEFAULT '',
  copy text DEFAULT '',
  evidence_refs jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_report_messaging_angles_report_id ON public.report_messaging_angles(report_id);

-- Next steps
CREATE TABLE IF NOT EXISTS public.report_next_steps (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id uuid NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  step text NOT NULL DEFAULT '',
  priority text NOT NULL DEFAULT 'med' CHECK (priority IN ('low', 'med', 'high')),
  owner text DEFAULT '',
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_report_next_steps_report_id ON public.report_next_steps(report_id);

-- Exports (export jobs)
CREATE TABLE IF NOT EXISTS public.report_exports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id uuid NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  format text NOT NULL CHECK (format IN ('pdf', 'markdown', 'html', 'docx')),
  template text NOT NULL DEFAULT 'standard',
  access_control text NOT NULL DEFAULT 'private' CHECK (access_control IN ('public', 'private', 'password-protected')),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  file_url text,
  file_size_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_report_exports_report_id ON public.report_exports(report_id);
CREATE INDEX IF NOT EXISTS idx_report_exports_user_id ON public.report_exports(user_id);
CREATE INDEX IF NOT EXISTS idx_report_exports_status ON public.report_exports(status);

-- Report versions (for editor versioning)
CREATE TABLE IF NOT EXISTS public.report_versions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id uuid NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  version_number int NOT NULL,
  changes_summary text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_report_versions_report_id ON public.report_versions(report_id);

-- RLS: all GTM tables follow report ownership via projects
CREATE POLICY "Users can view own report_sections" ON public.report_sections
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_sections.report_id AND p.user_id = auth.uid())
  );
CREATE POLICY "Users can insert own report_sections" ON public.report_sections
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_sections.report_id AND p.user_id = auth.uid())
  );
CREATE POLICY "Users can update own report_sections" ON public.report_sections
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_sections.report_id AND p.user_id = auth.uid())
  );
CREATE POLICY "Users can delete own report_sections" ON public.report_sections
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_sections.report_id AND p.user_id = auth.uid())
  );

ALTER TABLE public.report_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_icp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_messaging_angles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_next_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_versions ENABLE ROW LEVEL SECURITY;

-- Evidence
CREATE POLICY "Users can view own report_evidence" ON public.report_evidence FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_evidence.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can insert own report_evidence" ON public.report_evidence FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_evidence.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can update own report_evidence" ON public.report_evidence FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_evidence.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can delete own report_evidence" ON public.report_evidence FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_evidence.report_id AND p.user_id = auth.uid())
);

-- Competitors
CREATE POLICY "Users can view own report_competitors" ON public.report_competitors FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_competitors.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can insert own report_competitors" ON public.report_competitors FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_competitors.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can update own report_competitors" ON public.report_competitors FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_competitors.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can delete own report_competitors" ON public.report_competitors FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_competitors.report_id AND p.user_id = auth.uid())
);

-- ICP
CREATE POLICY "Users can view own report_icp" ON public.report_icp FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_icp.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can insert own report_icp" ON public.report_icp FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_icp.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can update own report_icp" ON public.report_icp FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_icp.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can delete own report_icp" ON public.report_icp FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_icp.report_id AND p.user_id = auth.uid())
);

-- Pricing
CREATE POLICY "Users can view own report_pricing" ON public.report_pricing FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_pricing.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can insert own report_pricing" ON public.report_pricing FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_pricing.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can update own report_pricing" ON public.report_pricing FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_pricing.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can delete own report_pricing" ON public.report_pricing FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_pricing.report_id AND p.user_id = auth.uid())
);

-- Messaging angles
CREATE POLICY "Users can view own report_messaging_angles" ON public.report_messaging_angles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_messaging_angles.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can insert own report_messaging_angles" ON public.report_messaging_angles FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_messaging_angles.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can update own report_messaging_angles" ON public.report_messaging_angles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_messaging_angles.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can delete own report_messaging_angles" ON public.report_messaging_angles FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_messaging_angles.report_id AND p.user_id = auth.uid())
);

-- Next steps
CREATE POLICY "Users can view own report_next_steps" ON public.report_next_steps FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_next_steps.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can insert own report_next_steps" ON public.report_next_steps FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_next_steps.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can update own report_next_steps" ON public.report_next_steps FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_next_steps.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can delete own report_next_steps" ON public.report_next_steps FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_next_steps.report_id AND p.user_id = auth.uid())
);

-- Exports: user can only access own
CREATE POLICY "Users can view own report_exports" ON public.report_exports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own report_exports" ON public.report_exports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own report_exports" ON public.report_exports FOR UPDATE USING (auth.uid() = user_id);

-- Versions
CREATE POLICY "Users can view own report_versions" ON public.report_versions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_versions.report_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can insert own report_versions" ON public.report_versions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.reports r JOIN public.projects p ON p.id = r.project_id WHERE r.id = report_versions.report_id AND p.user_id = auth.uid())
);

-- Triggers for updated_at on report_sections
DROP TRIGGER IF EXISTS set_report_sections_updated_at ON public.report_sections;
CREATE TRIGGER set_report_sections_updated_at
  BEFORE UPDATE ON public.report_sections
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
