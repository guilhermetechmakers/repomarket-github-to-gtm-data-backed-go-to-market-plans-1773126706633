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
