import { Link } from 'react-router-dom'
import { FileText, MoreHorizontal, ExternalLink, Copy, Archive } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { ReportItem } from '@/types/report'
import { formatDistanceToNow } from 'date-fns'

export interface ReportSummaryCardProps {
  report: ReportItem
  onDuplicate?: (id: string) => void
  onArchive?: (id: string) => void
  showActions?: boolean
  className?: string
}

/** Compact card for a report in search results: summary, evidence snippet, next steps, actions */
export function ReportSummaryCard({
  report,
  onDuplicate,
  onArchive,
  showActions = true,
  className,
}: ReportSummaryCardProps) {
  const id = report.id ?? ''
  const title = report.title ?? report.repoName ?? 'Untitled report'
  const summary = report.summary ?? ''
  const status = report.status ?? 'Draft'
  const tags = Array.isArray(report.tags) ? report.tags : []
  const evidenceSnippets = Array.isArray(report.evidenceSnippets) ? report.evidenceSnippets : []
  const nextSteps = Array.isArray(report.next_steps) ? report.next_steps : []
  const updatedAt = report.updatedAt
    ? formatDistanceToNow(new Date(report.updatedAt), { addSuffix: true })
    : ''

  return (
    <Card
      className={cn(
        'rounded-[14px] border border-border bg-card shadow-card transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2 p-6 pb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <FileText className="h-5 w-5 shrink-0 text-accent" aria-hidden />
            <Link
              to={`/report/${id}`}
              className="font-semibold text-foreground hover:text-accent transition-colors truncate block"
            >
              {title}
            </Link>
          </div>
          {report.repoName && report.repoName !== title ? (
            <p className="text-sm text-muted-foreground mt-0.5 truncate">
              {report.repoName}
            </p>
          ) : null}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge
              variant={status === 'Published' ? 'accent' : status === 'In_Review' ? 'default' : 'secondary'}
              className="rounded-full text-xs"
            >
              {status.replace('_', ' ')}
            </Badge>
            {report.language ? (
              <Badge variant="outline" className="rounded-full text-xs font-normal">
                {report.language}
              </Badge>
            ) : null}
            {report.maturity ? (
              <span className="text-xs text-muted-foreground">{report.maturity}</span>
            ) : null}
            {updatedAt ? (
              <span className="text-xs text-muted-foreground">{updatedAt}</span>
            ) : null}
          </div>
        </div>
        {showActions ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0"
                aria-label="Report actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to={`/report/${id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open report
                </Link>
              </DropdownMenuItem>
              {onDuplicate ? (
                <DropdownMenuItem onClick={() => onDuplicate(id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
              ) : null}
              {onArchive ? (
                <DropdownMenuItem onClick={() => onArchive(id)} className="text-destructive">
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </CardHeader>
      <CardContent className="p-6 pt-2 space-y-3">
        {summary ? (
          <p className="text-sm text-muted-foreground line-clamp-3">{summary}</p>
        ) : null}
        {evidenceSnippets.length > 0 ? (
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
            <p className="text-xs font-medium text-foreground mb-1">Evidence</p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {evidenceSnippets[0]}
            </p>
          </div>
        ) : null}
        {nextSteps.length > 0 ? (
          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5">
            <li className="font-medium text-foreground">Next steps</li>
            {nextSteps.slice(0, 3).map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        ) : null}
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-accent/10 text-accent px-2 py-0.5 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
