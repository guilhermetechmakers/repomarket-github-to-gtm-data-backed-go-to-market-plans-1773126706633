import { useState, useCallback, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { REPORTS_SEARCH_DEBOUNCE_MS } from '@/hooks/useReportsSearch'

export interface SearchBarProps {
  value: string
  onQueryChange: (q: string) => void
  placeholder?: string
  className?: string
  'aria-label'?: string
}

/** Debounced search input; updates parent after REPORTS_SEARCH_DEBOUNCE_MS */
export function SearchBar({
  value,
  onQueryChange,
  placeholder = 'Search reports by keyword…',
  className,
  'aria-label': ariaLabel = 'Search reports',
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLocalValue((prev) => (prev !== value ? value : prev))
  }, [value])

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    onQueryChange(localValue)
  }, [localValue, onQueryChange])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value
      setLocalValue(next)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        onQueryChange(next)
        timerRef.current = null
      }, REPORTS_SEARCH_DEBOUNCE_MS)
    },
    [onQueryChange]
  )

  const handleClear = useCallback(() => {
    setLocalValue('')
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    onQueryChange('')
  }, [onQueryChange])

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
        aria-hidden
      />
      <Input
        type="search"
        value={localValue}
        onChange={handleChange}
        onBlur={flush}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="pl-9 pr-9 h-10 rounded-lg border-border bg-background transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring"
      />
      {localValue ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 h-8 w-8 rounded-md"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  )
}
