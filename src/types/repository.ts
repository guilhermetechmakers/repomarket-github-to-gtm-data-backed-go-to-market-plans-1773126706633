export interface Repository {
  id: string
  project_id: string
  github_id: string | null
  repo_full_name: string
  owner: string
  default_branch: string
  ingestion_config_id: string | null
  created_at: string
  updated_at: string
}

export interface Snapshot {
  id: string
  repo_id: string
  storage_key: string
  created_at: string
  size_bytes: number | null
  encryption_details: Record<string, unknown>
}

export interface AnalysisResult {
  id: string
  snapshot_id: string
  metrics_summary: Record<string, unknown>
  insights: unknown
  created_at: string
}

export interface SecretsAudit {
  id: string
  snapshot_id: string
  detected_count: number
  scrubbed_count: number
  scrub_details: unknown[]
  created_at: string
}
