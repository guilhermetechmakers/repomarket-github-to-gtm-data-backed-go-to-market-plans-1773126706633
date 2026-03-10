export interface ReportCompetitor {
  name: string
  snippet: string
  url?: string
  relevance?: number
}

export interface ReportICP {
  title: string
  description: string
  traits?: string[]
}

export interface ReportPositioning {
  headline: string
  differentiators: string[]
}

export interface ReportPricing {
  pattern: string
  notes?: string
  examples?: string[]
}

export interface ReportEvidence {
  id: string
  source: 'perplexity' | 'repo'
  url?: string
  snippet: string
  relevance?: number
}

export interface GTMReport {
  report_id: string
  repo_ref: string
  exec_summary: string
  maturity_score?: number
  competitors: ReportCompetitor[]
  icp: ReportICP[]
  positioning: ReportPositioning[]
  pricing: ReportPricing[]
  messaging: string[]
  next_steps: { title: string; description: string; priority?: number }[]
  evidence: ReportEvidence[]
  created_at: string
  updated_at: string
}

/** Search/filter list item for reports (null-safe fields) */
export interface ReportItem {
  id: string
  repoName?: string
  repo_owner?: string
  repo_name?: string
  title?: string
  summary?: string
  status?: string
  createdAt?: string
  updatedAt?: string
  language?: string
  maturity?: string
  tags?: string[]
  evidenceSnippets?: string[]
  next_steps?: string[]
  maturity_score?: number
  project_id?: string
}

/** Report status enum for filters */
export type ReportStatusFilter = 'Draft' | 'In_Review' | 'Published'

/** Maturity filter options */
export type MaturityFilter = 'Early' | 'Growth' | 'Established'

/** Query params for reports list/search */
export interface ReportSearchParams {
  q?: string
  status?: ReportStatusFilter[]
  language?: string
  maturity?: MaturityFilter
  date_from?: string
  date_to?: string
  tags?: string[]
  page?: number
  pageSize?: number
}

/** API response shape for reports list */
export interface ReportsListResponse {
  data: ReportItem[]
  count: number
}
