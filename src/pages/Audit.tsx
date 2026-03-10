import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useDataAuditLogs } from '@/hooks/useDataAuditLogs'
import type { DataAuditAction } from '@/types/data-audit'

const ACTIONS: DataAuditAction[] = [
  'purge',
  'retention_apply',
  'scrub',
  'data_access',
  'ingestion_start',
  'ingestion_complete',
]

export default function Audit() {
  const [actionFilter, setActionFilter] = useState<string | undefined>(undefined)
  const { data, isLoading } = useDataAuditLogs({
    limit: 50,
    action: actionFilter as DataAuditAction | undefined,
  })
  const logs = data?.data ?? []
  const count = data?.count ?? 0

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar showAuth={true} />
      <main className="flex-1 mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6">
        <AnimatedPage>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Audit & compliance</h1>
              <p className="text-muted-foreground mt-1">
                View and export audit logs for purges, retention, and data access.
              </p>
            </div>
            <Button variant="outline" className="rounded-xl" asChild>
              <Link to="/settings">Settings</Link>
            </Button>
          </div>

          <Card className="rounded-2xl border-border shadow-card transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Data audit log
              </CardTitle>
              <CardDescription>
                Immutable log of data lifecycle events. Export for compliance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Select value={actionFilter ?? 'all'} onValueChange={(v) => setActionFilter(v === 'all' ? undefined : v)}>
                  <SelectTrigger className="w-[180px] rounded-xl">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All actions</SelectItem>
                    {ACTIONS.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>

              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-xl" />
                  ))}
                </div>
              ) : logs.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">No audit events match your filters.</p>
                </div>
              ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="text-left p-3 font-medium text-foreground">Action</th>
                          <th className="text-left p-3 font-medium text-foreground">Resource</th>
                          <th className="text-left p-3 font-medium text-foreground">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(logs ?? []).map((log) => (
                          <tr
                            key={log.id}
                            className="border-t border-border hover:bg-muted/30 transition-colors"
                          >
                            <td className="p-3 font-medium">{log.action}</td>
                            <td className="p-3 text-muted-foreground">
                              {log.resource_type}
                              {log.resource_id ? ` (${String(log.resource_id).slice(0, 8)}…)` : ''}
                            </td>
                            <td className="p-3 text-muted-foreground">
                              {log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {count > 0 && (
                <p className="text-xs text-muted-foreground">
                  Showing up to 50 of {count} entries.
                </p>
              )}
            </CardContent>
          </Card>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
