-- RepoMarket: Reports search & filter - add columns and indexes for full-text search and faceted filters
-- Idempotent: add columns only if not present; create indexes IF NOT EXISTS.

-- Add search/filter columns to reports (nullable for existing rows)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reports' AND column_name = 'title') THEN
    ALTER TABLE public.reports ADD COLUMN title text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reports' AND column_name = 'summary') THEN
    ALTER TABLE public.reports ADD COLUMN summary text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reports' AND column_name = 'content') THEN
    ALTER TABLE public.reports ADD COLUMN content text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reports' AND column_name = 'status') THEN
    ALTER TABLE public.reports ADD COLUMN status text DEFAULT 'Draft' CHECK (status IN ('Draft', 'In_Review', 'Published'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reports' AND column_name = 'language') THEN
    ALTER TABLE public.reports ADD COLUMN language text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reports' AND column_name = 'maturity') THEN
    ALTER TABLE public.reports ADD COLUMN maturity text CHECK (maturity IS NULL OR maturity IN ('Early', 'Growth', 'Established'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reports' AND column_name = 'tags') THEN
    ALTER TABLE public.reports ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reports' AND column_name = 'evidence') THEN
    ALTER TABLE public.reports ADD COLUMN evidence jsonb DEFAULT '[]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reports' AND column_name = 'next_steps') THEN
    ALTER TABLE public.reports ADD COLUMN next_steps text[] DEFAULT '{}';
  END IF;
END $$;

-- Full-text search index on content + title + summary
CREATE INDEX IF NOT EXISTS reports_content_fts_idx ON public.reports
  USING GIN (to_tsvector('simple', coalesce(content, '') || ' ' || coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(exec_summary, '')));

-- GIN index on tags for array containment / filter
CREATE INDEX IF NOT EXISTS reports_tags_idx ON public.reports USING GIN (tags);

-- B-tree indexes for filters and sort
CREATE INDEX IF NOT EXISTS reports_updated_at_idx ON public.reports (updated_at DESC);
CREATE INDEX IF NOT EXISTS reports_created_at_idx ON public.reports (created_at DESC);
CREATE INDEX IF NOT EXISTS reports_status_idx ON public.reports (status);
CREATE INDEX IF NOT EXISTS reports_language_idx ON public.reports (language);
CREATE INDEX IF NOT EXISTS reports_maturity_idx ON public.reports (maturity);
CREATE INDEX IF NOT EXISTS reports_project_id_idx ON public.reports (project_id);
