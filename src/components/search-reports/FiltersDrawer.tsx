import { useState } from 'react'
import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FiltersPanel } from './FiltersPanel'
import type { UseReportsSearchFilters } from '@/hooks/useReportsSearch'

export interface FiltersDrawerProps {
  filters: UseReportsSearchFilters
  onFiltersChange: (next: Partial<UseReportsSearchFilters>) => void
  onReset: () => void
  hasActiveFilters: boolean
}

/** Mobile: drawer with filters. Desktop: render children (inline panel) instead. */
export function FiltersDrawer({
  filters,
  onFiltersChange,
  onReset,
  hasActiveFilters,
}: FiltersDrawerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="md:hidden inline-flex items-center gap-2"
          aria-label="Open filters"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters ? (
            <span className="ml-1 h-2 w-2 rounded-full bg-accent" aria-hidden />
          ) : null}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md max-h-[85vh] flex flex-col p-0 gap-0"
        showClose={true}
      >
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Filter reports</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6 pb-6">
          <FiltersPanel
            filters={filters}
            onFiltersChange={(next) => {
              onFiltersChange(next)
            }}
            onReset={() => {
              onReset()
              setOpen(false)
            }}
            hasActiveFilters={hasActiveFilters}
            compact
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
