import { supabase } from '@/lib/supabase'
import type {
  ReportItem,
  ReportSearchParams,
  ReportsListResponse,
} from '@/types/report'

/** Normalize DB row + project to ReportItem (null-safe) */
function toReportItem(row: Record<string, unknown>): ReportItem {
  const project = row.projects as Record<string, unknown> | null | undefined
  const repoOwner = project && typeof project.repo_owner === 'string' ? project.repo_owner : undefined
  const repoName = project && typeof project.repo_name === 'string' ? project.repo_name : undefined
  const evidence = row.evidence as unknown[] | null | undefined
  const snippets = Array.isArray(evidence)
    ? evidence
        .map((e) => (typeof e === 'object' && e !== null && 'snippet' in e ? String((e as { snippet: unknown }).snippet) : null))
        .filter((s): s is string => typeof s === 'string')
    : []

  return {
    id: String(row.id ?? ''),
    repoName: repoOwner && repoName ? `${repoOwner}/${repoName}` : repoName ?? repoOwner ?? undefined,
    repo_owner: repoOwner,
    repo_name: repoName,
    title: typeof row.title === 'string' ? row.title : undefined,
    summary: typeof row.summary === 'string' ? row.summary : (typeof row.exec_summary === 'string' ? row.exec_summary : undefined),
    status: typeof row.status === 'string' ? row.status : undefined,
    createdAt: row.created_at != null ? new Date(row.created_at as string).toISOString() : undefined,
    updatedAt: row.updated_at != null ? new Date(row.updated_at as string).toISOString() : undefined,
    language: typeof row.language === 'string' ? row.language : undefined,
    maturity: typeof row.maturity === 'string' ? row.maturity : undefined,
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : undefined,
    evidenceSnippets: snippets.length > 0 ? snippets : undefined,
    next_steps: Array.isArray(row.next_steps) ? (row.next_steps as string[]) : undefined,
    maturity_score: typeof row.maturity_score === 'number' ? row.maturity_score : undefined,
    project_id: typeof row.project_id === 'string' ? row.project_id : undefined,
  }
}

/** Build filter query on reports; returns query with filters applied (no pagination) */
function applyFilters(
  query: ReturnType<typeof supabase.from<'reports'>>['select'],
  params: ReportSearchParams
) {
  let q = query

  if (params.status?.length) {
    q = q.in('status', params.status) as typeof q
  }
  if (params.language != null && params.language !== '') {
    q = q.eq('language', params.language) as typeof q
  }
  if (params.maturity != null && params.maturity !== '') {
    q = q.eq('maturity', params.maturity) as typeof q
  }
  if (params.date_from) {
    q = q.gte('created_at', params.date_from) as typeof q
  }
  if (params.date_to) {
    q = q.lte('created_at', params.date_to) as typeof q
  }
  if (Array.isArray(params.tags) && params.tags.length > 0) {
    q = q.overlaps('tags', params.tags) as typeof q
  }

  return q
}

/** Full-text-like search: ilike on title, summary, content, exec_summary */
function applySearch(
  query: ReturnType<typeof supabase.from<'reports'>>['select'],
  searchTerm: string
) {
  const term = `%${searchTerm.trim().replace(/%/g, '\\%')}%`
  return query.or(
    `title.ilike.${term},summary.ilike.${term},content.ilike.${term},exec_summary.ilike.${term}`
  )
}

export const reportsApi = {
  /**
   * Fetch reports with optional search and filters; paginated.
   * Uses Supabase with RLS; joins projects for repo_owner/repo_name.
   */
  async getList(params: ReportSearchParams = {}): Promise<ReportsListResponse> {
    const page = Math.max(1, params.page ?? 1)
    const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20))
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('reports')
      .select('*, projects!reports_project_id_fkey(repo_owner, repo_name)', { count: 'exact' })
      .order('updated_at', { ascending: false })

    const safeParams: ReportSearchParams = {
      ...params,
      status: Array.isArray(params.status) ? params.status : undefined,
      tags: Array.isArray(params.tags) ? params.tags : undefined,
    }

    query = applyFilters(query, safeParams) as typeof query

    if (params.q != null && String(params.q).trim() !== '') {
      query = applySearch(query, String(params.q)) as typeof query
    }

    const { data, error, count } = await query.range(from, to)

    if (error) {
      throw new Error(error.message ?? 'Failed to fetch reports')
    }

    const rawRows = Array.isArray(data) ? data : []
    const items = rawRows.map((row) => toReportItem(row as Record<string, unknown>))
    const total = typeof count === 'number' ? count : items.length

    return { data: items, count: total }
  },

  /** Fetch a single report by id; returns null if not found or no access */
  async getById(id: string): Promise<ReportItem | null> {
    const { data, error } = await supabase
      .from('reports')
      .select('*, projects!reports_project_id_fkey(repo_owner, repo_name)')
      .eq('id', id)
      .single()

    if (error || !data) return null
    return toReportItem(data as Record<string, unknown>)
  },

  /** Create report (minimal fields; caller can PATCH after) */
  async create(payload: {
    project_id: string
    title?: string
    summary?: string
    status?: string
  }): Promise<ReportItem> {
    const { data, error } = await supabase
      .from('reports')
      .insert({
        project_id: payload.project_id,
        title: payload.title ?? null,
        summary: payload.summary ?? payload.title ?? null,
        exec_summary: payload.summary ?? payload.title ?? null,
        status: payload.status ?? 'Draft',
      })
      .select('*, projects!reports_project_id_fkey(repo_owner, repo_name)')
      .single()

    if (error) throw new Error(error.message ?? 'Failed to create report')
    return toReportItem((data ?? {}) as Record<string, unknown>)
  },

  /** Update report fields */
  async update(
    id: string,
    updates: Partial<Pick<ReportItem, 'title' | 'summary' | 'status' | 'tags' | 'language' | 'maturity'>>
  ): Promise<ReportItem> {
    const row: Record<string, unknown> = {}
    if (updates.title !== undefined) row.title = updates.title
    if (updates.summary !== undefined) row.summary = updates.summary
    if (updates.status !== undefined) row.status = updates.status
    if (updates.tags !== undefined) row.tags = updates.tags
    if (updates.language !== undefined) row.language = updates.language
    if (updates.maturity !== undefined) row.maturity = updates.maturity

    const { data, error } = await supabase
      .from('reports')
      .update(row)
      .eq('id', id)
      .select('*, projects!reports_project_id_fkey(repo_owner, repo_name)')
      .single()

    if (error) throw new Error(error.message ?? 'Failed to update report')
    return toReportItem((data ?? {}) as Record<string, unknown>)
  },

  /** Soft delete / archive: set status or actually delete per policy */
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('reports').delete().eq('id', id)
    if (error) throw new Error(error.message ?? 'Failed to delete report')
  },
}
