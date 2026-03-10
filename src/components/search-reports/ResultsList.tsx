import { useMemo } from 'react'
import { ReportSummaryCard } from './ReportSummaryCard'
import { ResultsListSkeleton } from './ResultsListSkeleton'
import { ResultsEmptyState } from './ResultsEmptyState'
import { cn } from '@/lib/utils'
import type { ReportItem } from '@/types/report'

export interface ResultsListProps {
  items: ReportItem[]
  isLoading: boolean
  isFetching?: boolean
  hasActiveFilters: boolean
  onClearFilters?: () => void
  onArchive?: (id: string) => void
  onDuplicate?: (id: string) => void
  className?: string
}

/** Grid of report cards with loading and empty states */
export function ResultsList({
  items,
  isLoading,
  isFetching = false,
  hasActiveFilters,
  onClearFilters,
  onArchive,
  onDuplicate,
  className,
}: ResultsListProps) {
  const safeItems = useMemo(
    () => (Array.isArray(items) ? items : []),
    [items]
  )

  if (isLoading) {
    return <ResultsListSkeleton count={6} className={className} />
  }

  if (safeItems.length === 0) {
    return (
      <ResultsEmptyState
        hasFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        className={className}
      />
    )
  }

  return (
    <ul
      className={cn(
        'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0',
        isFetching && 'opacity-70 transition-opacity duration-200',
        className
      )}
      role="list"
      aria-busy={isFetching}
    >
      {safeItems.map((report) => (
        <li key={report.id}>
          <ReportSummaryCard
            report={report}
            onArchive={onArchive}
            onDuplicate={onDuplicate}
            showActions
          />
        </li>
      ))}
    </ul>
  )
}
