import type { AuditAction } from './auth'

export interface AuditLog {
  id: number
  user_id: string | null
  action: AuditAction
  timestamp: string
  ip_address: string | null
  device: string | null
  success: boolean
  metadata: Record<string, unknown>
}

export interface AuditLogsQuery {
  page?: number
  limit?: number
  action?: AuditAction
}

export interface AuditLogsResponse {
  data: AuditLog[]
  count: number
  page: number
  limit: number
}
