import { supabase } from '@/lib/supabase'
import type { RetentionPolicy, SetRetentionInput, DataType } from '@/types/retention'

export const retentionApi = {
  async getByUser(userId: string): Promise<RetentionPolicy[]> {
    const { data, error } = await supabase
      .from('retention_policies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []) as RetentionPolicy[]
  },

  async getByProject(projectId: string): Promise<RetentionPolicy[]> {
    const { data, error } = await supabase
      .from('retention_policies')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []) as RetentionPolicy[]
  },

  async set(input: SetRetentionInput): Promise<RetentionPolicy> {
    return this.create({
      user_id: input.target_type === 'user' ? input.target_id : null,
      project_id: input.target_type === 'project' ? input.target_id : null,
      data_type: input.data_type as DataType,
      retention_days: input.retention_days,
      purge_on_expire: input.purge_on_expire ?? true,
    })
  },

  async create(input: Omit<RetentionPolicy, 'id' | 'created_at' | 'updated_at'>): Promise<RetentionPolicy> {
    const { data, error } = await supabase
      .from('retention_policies')
      .insert(input)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as RetentionPolicy
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('retention_policies').delete().eq('id', id)
    if (error) throw new Error(error.message)
  },
}
