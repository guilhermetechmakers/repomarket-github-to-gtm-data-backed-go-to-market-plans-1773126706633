export type IngestionStatus = 'idle' | 'running' | 'completed' | 'failed' | 'paused'

export interface IngestionConfig {
  id: string
  repo_id: string
  branches: string[]
  depth: number
  include_private: boolean
  schedule: string | null
  status: IngestionStatus
  created_at: string
  updated_at: string
}

export interface CreateIngestionConfigInput {
  repo_id: string
  branches?: string[]
  depth?: number
  include_private?: boolean
  schedule?: string
}

export interface IngestionProgress {
  job_id: string
  status: IngestionStatus
  step: 'authorize' | 'fetch' | 'scrub' | 'store' | 'analyze'
  progress_percent: number
  files_ingested?: number
  secrets_detected?: number
  secrets_scrubbed?: number
  error?: string
}
