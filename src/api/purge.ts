import { supabase } from '@/lib/supabase'
import type { PurgeJob, InitiatePurgeInput } from '@/types/purge'

export const purgeApi = {
  async initiate(input: InitiatePurgeInput): Promise<{ purge_job_id: string }> {
    const { data, error } = await supabase.functions.invoke<{ purge_job_id: string; error?: string }>('purge', {
      body: {
        target_type: input.target_type,
        target_id: input.target_id,
        reason: input.reason,
      },
    })
    if (error) throw new Error(error.message)
    if (data?.error) throw new Error(data.error)
    const id = data?.purge_job_id
    if (!id) throw new Error('No purge job id returned')
    return { purge_job_id: id }
  },

  async getStatus(id: string): Promise<PurgeJob | null> {
    const { data, error } = await supabase.from('purge_jobs').select('*').eq('id', id).single()
    if (error) return null
    return data as PurgeJob
  },

  async listByUser(): Promise<PurgeJob[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    const { data, error } = await supabase
      .from('purge_jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) return []
    return (data ?? []) as PurgeJob[]
  },
}
