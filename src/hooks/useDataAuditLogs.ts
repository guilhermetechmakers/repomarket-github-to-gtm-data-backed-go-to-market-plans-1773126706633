import { useQuery } from '@tanstack/react-query'
import { dataAuditApi } from '@/api/data-audit'
import type { DataAuditLogsQuery } from '@/types/data-audit'

const keys = {
  all: ['dataAuditLogs'] as const,
  list: (q: DataAuditLogsQuery) => [...keys.all, 'list', q] as const,
}

export function useDataAuditLogs(query: DataAuditLogsQuery = {}) {
  return useQuery({
    queryKey: keys.list(query),
    queryFn: () => dataAuditApi.getLogs(query),
  })
}
