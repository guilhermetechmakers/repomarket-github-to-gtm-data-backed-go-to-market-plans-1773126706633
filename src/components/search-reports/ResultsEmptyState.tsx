import { Link } from 'react-router-dom'
import { FileSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface ResultsEmptyStateProps {
  hasFilters?: boolean
  onClearFilters?: () => void
  className?: string
}

/** Empty state when no reports match search/filters */
export function ResultsEmptyState({
  hasFilters = false,
  onClearFilters,
  className,
}: ResultsEmptyStateProps) {
  return (
    <Card
      className={cn(
        'rounded-[14px] border border-border shadow-card flex flex-col items-center justify-center py-16',
        className
      )}
    >
      <CardContent className="text-center max-w-md px-6">
        <FileSearch
          className="mx-auto h-12 w-12 text-muted-foreground"
          aria-hidden
        />
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          No reports found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {hasFilters
            ? 'Try adjusting your filters or search query to see more results.'
            : 'Connect a repository and run an analysis to generate your first GTM report.'}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          {hasFilters && onClearFilters ? (
            <Button variant="outline" onClick={onClearFilters}>
              Clear filters
            </Button>
          ) : null}
          <Button asChild>
            <Link to="/connect">Analyze a repository</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
