import { useCallback } from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { UseReportsSearchFilters } from '@/hooks/useReportsSearch'
import type { ReportStatusFilter, MaturityFilter } from '@/types/report'

const STATUS_OPTIONS: ReportStatusFilter[] = ['Draft', 'In_Review', 'Published']
const MATURITY_OPTIONS: MaturityFilter[] = ['Early', 'Growth', 'Established']
const LANGUAGES = ['', 'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Ruby', 'Java', 'Other']

export interface FiltersPanelProps {
  filters: UseReportsSearchFilters
  onFiltersChange: (next: Partial<UseReportsSearchFilters>) => void
  onReset: () => void
  hasActiveFilters: boolean
  className?: string
  /** When true, render in compact layout for drawer */
  compact?: boolean
}

export function FiltersPanel({
  filters,
  onFiltersChange,
  onReset,
  hasActiveFilters,
  className,
  compact = false,
}: FiltersPanelProps) {
  const setStatus = useCallback(
    (value: string) => {
      const next = value ? [value as ReportStatusFilter] : []
      onFiltersChange({ status: next })
    },
    [onFiltersChange]
  )
  const statusValue = filters.status?.[0] ?? ''

  return (
    <div className={cn('space-y-4', className)} role="group" aria-label="Filter reports">
      {compact ? (
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="filter-status" className="text-sm font-medium">
            Status
          </Label>
          <Select value={statusValue} onValueChange={setStatus}>
            <SelectTrigger id="filter-status" className="w-full">
              <SelectValue placeholder="Any status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any status</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-language" className="text-sm font-medium">
            Language
          </Label>
          <Select
            value={filters.language || ''}
            onValueChange={(v) => onFiltersChange({ language: v })}
          >
            <SelectTrigger id="filter-language" className="w-full">
              <SelectValue placeholder="Any language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang || 'any'} value={lang}>
                  {lang || 'Any language'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-maturity" className="text-sm font-medium">
            Maturity
          </Label>
          <Select
            value={filters.maturity || ''}
            onValueChange={(v) => onFiltersChange({ maturity: v as MaturityFilter | '' })}
          >
            <SelectTrigger id="filter-maturity" className="w-full">
              <SelectValue placeholder="Any maturity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any maturity</SelectItem>
              {MATURITY_OPTIONS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="filter-date-from" className="text-sm font-medium">
            From date
          </Label>
          <Input
            id="filter-date-from"
            type="date"
            value={filters.date_from}
            onChange={(e) => onFiltersChange({ date_from: e.target.value })}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="filter-date-to" className="text-sm font-medium">
            To date
          </Label>
          <Input
            id="filter-date-to"
            type="date"
            value={filters.date_to}
            onChange={(e) => onFiltersChange({ date_to: e.target.value })}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-tags" className="text-sm font-medium">
          Tags (comma-separated)
        </Label>
        <Input
          id="filter-tags"
          type="text"
          placeholder="e.g. ICP, pricing, competitors"
          value={Array.isArray(filters.tags) ? filters.tags.join(', ') : ''}
          onChange={(e) => {
            const raw = e.target.value
            const tags = raw
              ? raw.split(',').map((t) => t.trim()).filter(Boolean)
              : []
            onFiltersChange({ tags })
          }}
          className="w-full"
        />
      </div>

      {!compact && hasActiveFilters ? (
        <Button variant="outline" size="sm" onClick={onReset} className="mt-2">
          <X className="h-4 w-4 mr-2" />
          Reset filters
        </Button>
      ) : null}
    </div>
  )
}
