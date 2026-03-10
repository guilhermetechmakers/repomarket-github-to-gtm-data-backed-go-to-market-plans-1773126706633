import { supabase } from '@/lib/supabase'
import type { DataAuditLog, DataAuditLogsQuery } from '@/types/data-audit'

export const dataAuditApi = {
  async getLogs(query: DataAuditLogsQuery = {}): Promise<{ data: DataAuditLog[]; count: number }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: [], count: 0 }

    let q = supabase
      .from('data_audit_logs')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })

    if (query.action) q = q.eq('action', query.action)
    if (query.resource_type) q = q.eq('resource_type', query.resource_type)
    if (query.date_from) q = q.gte('timestamp', query.date_from)
    if (query.date_to) q = q.lte('timestamp', query.date_to)

    const page = query.page ?? 1
    const limit = Math.min(query.limit ?? 50, 100)
    q = q.range((page - 1) * limit, page * limit - 1)

    const { data, error, count } = await q
    if (error) throw new Error(error.message)
    return { data: (data ?? []) as DataAuditLog[], count: count ?? 0 }
  },
}
