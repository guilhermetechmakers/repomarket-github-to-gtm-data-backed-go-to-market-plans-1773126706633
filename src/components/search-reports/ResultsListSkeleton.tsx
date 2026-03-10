import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface ResultsListSkeletonProps {
  count?: number
  className?: string
}

/** Skeleton loaders for report cards in grid */
export function ResultsListSkeleton({
  count = 6,
  className,
}: ResultsListSkeletonProps) {
  const items = Array.from({ length: Math.min(count, 12) }, (_, i) => i)
  return (
    <ul
      className={cn(
        'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0',
        className
      )}
      aria-busy="true"
      aria-label="Loading reports"
    >
      {items.map((i) => (
        <li key={i}>
          <Card className="rounded-[14px] border border-border overflow-hidden">
            <CardHeader className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
              </div>
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-14 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-12 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
