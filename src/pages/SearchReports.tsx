import { useMemo } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedPage } from '@/components/AnimatedPage'
import {
  SearchBar,
  FiltersPanel,
  FiltersDrawer,
  ResultsList,
  PaginationControls,
} from '@/components/search-reports'
import { useReportsSearch, useDeleteReport } from '@/hooks/useReportsSearch'

function hasActiveFilters(filters: {
  q?: string
  status?: string[]
  language?: string
  maturity?: string
  date_from?: string
  date_to?: string
  tags?: string[]
}): boolean {
  if (filters.q?.trim()) return true
  if (Array.isArray(filters.status) && filters.status.length > 0) return true
  if (filters.language?.trim()) return true
  if (filters.maturity?.trim()) return true
  if (filters.date_from?.trim()) return true
  if (filters.date_to?.trim()) return true
  if (Array.isArray(filters.tags) && filters.tags.length > 0) return true
  return false
}

export default function SearchReports() {
  const {
    items,
    count,
    isLoading,
    isFetching,
    error,
    filters,
    setQuery,
    setFilters,
    setPage,
    setPageSize,
    resetFilters,
    page,
    pageSize,
    totalPages,
  } = useReportsSearch()

  const deleteReport = useDeleteReport()
  const hasFilters = useMemo(() => hasActiveFilters(filters), [filters])

  const handleArchive = (id: string) => {
    deleteReport.mutate(id)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar showAuth />
      <main className="flex-1 mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6">
        <AnimatedPage>
          <header className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground">
              Search & filter reports
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Find GTM reports by keyword, status, language, maturity, and tags.
            </p>
          </header>

          <section
            className="space-y-4 mb-8"
            aria-label="Search and filters"
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="flex-1 min-w-0">
                <SearchBar
                  value={filters.q}
                  onQueryChange={setQuery}
                  placeholder="Search reports by keyword…"
                  aria-label="Search reports"
                />
              </div>
              <FiltersDrawer
                filters={filters}
                onFiltersChange={setFilters}
                onReset={resetFilters}
                hasActiveFilters={hasFilters}
              />
            </div>

            <div className="hidden md:block rounded-[14px] border border-border bg-card/50 p-6 shadow-card">
              <FiltersPanel
                filters={filters}
                onFiltersChange={setFilters}
                onReset={resetFilters}
                hasActiveFilters={hasFilters}
              />
            </div>
          </section>

          {error ? (
            <div
              className="mb-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-4 text-sm text-red-800 dark:text-red-200"
              role="alert"
            >
              {error.message}
            </div>
          ) : null}

          <section className="space-y-6" aria-label="Results">
            <ResultsList
              items={items}
              isLoading={isLoading}
              isFetching={isFetching}
              hasActiveFilters={hasFilters}
              onClearFilters={resetFilters}
              onArchive={handleArchive}
            />

            {!isLoading && items.length > 0 && count > 0 ? (
              <PaginationControls
                page={page}
                pageSize={pageSize}
                totalCount={count}
                totalPages={totalPages}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            ) : null}
          </section>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
