export type DataAuditAction =
  | 'purge'
  | 'retention_apply'
  | 'scrub'
  | 'data_access'
  | 'ingestion_start'
  | 'ingestion_complete'

export interface DataAuditLog {
  id: number
  user_id: string | null
  action: DataAuditAction
  resource_type: string
  resource_id: string | null
  timestamp: string
  details: Record<string, unknown>
}

export interface DataAuditLogsQuery {
  page?: number
  limit?: number
  action?: DataAuditAction
  resource_type?: string
  date_from?: string
  date_to?: string
}
