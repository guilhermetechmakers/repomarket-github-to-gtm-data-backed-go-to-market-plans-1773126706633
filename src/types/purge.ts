export type PurgeTargetType = 'snapshot' | 'analysis' | 'repository' | 'project'
export type PurgeJobStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface PurgeJob {
  id: string
  user_id: string
  target_type: PurgeTargetType
  target_id: string
  status: PurgeJobStatus
  reason: string | null
  started_at: string | null
  completed_at: string | null
  audit_trail: unknown[]
  created_at: string
}

export interface InitiatePurgeInput {
  target_type: PurgeTargetType
  target_id: string
  reason?: string
}
