export type DataType = 'snapshot' | 'analysis' | 'metadata' | 'logs'

export interface RetentionPolicy {
  id: string
  user_id: string | null
  project_id: string | null
  data_type: DataType
  retention_days: number
  purge_on_expire: boolean
  created_at: string
  updated_at: string
}

export interface SetRetentionInput {
  target_id: string
  target_type: 'user' | 'project'
  data_type: DataType
  retention_days: number
  purge_on_expire?: boolean
}
