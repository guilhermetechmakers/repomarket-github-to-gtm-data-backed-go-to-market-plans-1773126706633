import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { reportsApi } from '@/api/reports'
import type {
  ReportItem,
  ReportSearchParams,
  ReportStatusFilter,
  MaturityFilter,
} from '@/types/report'
import { toast } from 'sonner'

const DEBOUNCE_MS = 300
const DEFAULT_PAGE_SIZE = 20

export const reportKeys = {
  all: ['reports'] as const,
  lists: () => [...reportKeys.all, 'list'] as const,
  list: (params: ReportSearchParams) => [...reportKeys.lists(), params] as const,
  detail: (id: string) => [...reportKeys.all, 'detail', id] as const,
}

/** Parse URL search params into ReportSearchParams */
function paramsFromUrl(searchParams: URLSearchParams): ReportSearchParams {
  const q = searchParams.get('q') ?? ''
  const statusRaw = searchParams.get('status')
  const status = statusRaw
    ? (statusRaw.split(',').filter(Boolean) as ReportStatusFilter[])
    : undefined
  const language = searchParams.get('language') ?? undefined
  const maturity = (searchParams.get('maturity') as MaturityFilter) ?? undefined
  const date_from = searchParams.get('date_from') ?? undefined
  const date_to = searchParams.get('date_to') ?? undefined
  const tagsRaw = searchParams.get('tags')
  const tags = tagsRaw ? tagsRaw.split(',').filter(Boolean) : undefined
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE), 10)
  return {
    q: q || undefined,
    status: status?.length ? status : undefined,
    language: language || undefined,
    maturity: maturity || undefined,
    date_from: date_from || undefined,
    date_to: date_to || undefined,
    tags: tags?.length ? tags : undefined,
    page: Number.isFinite(page) ? page : 1,
    pageSize: Number.isFinite(pageSize) ? pageSize : DEFAULT_PAGE_SIZE,
  }
}

/** Serialize ReportSearchParams to URL search params */
function paramsToUrl(params: ReportSearchParams): URLSearchParams {
  const sp = new URLSearchParams()
  if (params.q) sp.set('q', params.q)
  if (params.status?.length) sp.set('status', params.status.join(','))
  if (params.language) sp.set('language', params.language)
  if (params.maturity) sp.set('maturity', params.maturity)
  if (params.date_from) sp.set('date_from', params.date_from)
  if (params.date_to) sp.set('date_to', params.date_to)
  if (params.tags?.length) sp.set('tags', params.tags.join(','))
  if (params.page && params.page > 1) sp.set('page', String(params.page))
  if (params.pageSize && params.pageSize !== DEFAULT_PAGE_SIZE)
    sp.set('pageSize', String(params.pageSize))
  return sp
}

export interface UseReportsSearchFilters {
  q: string
  status: ReportStatusFilter[]
  language: string
  maturity: MaturityFilter | ''
  date_from: string
  date_to: string
  tags: string[]
}

const defaultFilters: UseReportsSearchFilters = {
  q: '',
  status: [],
  language: '',
  maturity: '',
  date_from: '',
  date_to: '',
  tags: [],
}

export function useReportsSearch() {
  const [searchParams, setSearchParams] = useSearchParams()

  const urlParams = useMemo(() => paramsFromUrl(searchParams), [searchParams])

  const filters: UseReportsSearchFilters = useMemo(
    () => ({
      q: urlParams.q ?? '',
      status: urlParams.status ?? [],
      language: urlParams.language ?? '',
      maturity: urlParams.maturity ?? '',
      date_from: urlParams.date_from ?? '',
      date_to: urlParams.date_to ?? '',
      tags: urlParams.tags ?? [],
    }),
    [urlParams]
  )

  const page = urlParams.page ?? 1
  const pageSize = urlParams.pageSize ?? DEFAULT_PAGE_SIZE

  const queryParams: ReportSearchParams = useMemo(
    () => ({
      ...urlParams,
      page,
      pageSize,
    }),
    [urlParams, page, pageSize]
  )

  const updateUrl = useCallback(
    (next: Partial<ReportSearchParams>) => {
      const merged: ReportSearchParams = {
        ...urlParams,
        ...next,
      }
      setSearchParams(paramsToUrl(merged), { replace: true })
    },
    [urlParams, setSearchParams]
  )

  const setQuery = useCallback(
    (q: string) => updateUrl({ q: q || undefined, page: 1 }),
    [updateUrl]
  )

  const setFilters = useCallback(
    (next: Partial<UseReportsSearchFilters>) => {
      const merged = { ...filters, ...next }
      updateUrl({
        q: merged.q || undefined,
        status: merged.status?.length ? merged.status : undefined,
        language: merged.language || undefined,
        maturity: merged.maturity || undefined,
        date_from: merged.date_from || undefined,
        date_to: merged.date_to || undefined,
        tags: merged.tags?.length ? merged.tags : undefined,
        page: 1,
      })
    },
    [filters, updateUrl]
  )

  const setPage = useCallback(
    (p: number) => updateUrl({ page: p }),
    [updateUrl]
  )

  const setPageSize = useCallback(
    (size: number) => updateUrl({ pageSize: size, page: 1 }),
    [updateUrl]
  )

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: reportKeys.list(queryParams),
    queryFn: () => reportsApi.getList(queryParams),
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
  })

  const items: ReportItem[] = Array.isArray(data?.data) ? data.data : []
  const count = typeof data?.count === 'number' ? data.count : 0
  const totalPages = Math.max(1, Math.ceil(count / pageSize))

  return {
    items,
    count,
    isLoading,
    isFetching,
    error: error ?? null,
    filters,
    setQuery,
    setFilters,
    setPage,
    setPageSize,
    resetFilters,
    updateUrl,
    page,
    pageSize,
    totalPages,
    queryParams,
  }
}

/** Debounce delay (ms) for search input */
export const REPORTS_SEARCH_DEBOUNCE_MS = DEBOUNCE_MS

export function useReport(id: string | undefined) {
  return useQuery({
    queryKey: reportKeys.detail(id ?? ''),
    queryFn: () => (id ? reportsApi.getById(id) : Promise.resolve(null)),
    enabled: !!id,
  })
}

export function useDeleteReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => reportsApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: reportKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() })
      toast.success('Report archived.')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to delete report')
    },
  })
}
