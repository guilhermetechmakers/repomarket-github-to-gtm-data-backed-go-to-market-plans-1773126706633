import { supabase } from '@/lib/supabase'
import type { IngestionConfig, CreateIngestionConfigInput, IngestionProgress } from '@/types/ingestion'

export const ingestionApi = {
  async getConfigsByRepo(repoId: string): Promise<IngestionConfig[]> {
    const { data, error } = await supabase
      .from('ingestion_configs')
      .select('*')
      .eq('repo_id', repoId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []) as IngestionConfig[]
  },

  async createConfig(input: CreateIngestionConfigInput): Promise<IngestionConfig> {
    const { data, error } = await supabase
      .from('ingestion_configs')
      .insert({
        repo_id: input.repo_id,
        branches: input.branches ?? ['main'],
        depth: input.depth ?? 1,
        include_private: input.include_private ?? false,
        schedule: input.schedule ?? null,
        status: 'idle',
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as IngestionConfig
  },

  async startIngestion(configId: string): Promise<IngestionProgress> {
    const { data, error } = await supabase.functions.invoke<{
      job_id: string
      status: string
      snapshot_id?: string
      secrets_detected?: number
      secrets_scrubbed?: number
      error?: string
    }>('ingest', {
      body: { config_id: configId },
    })
    if (error) throw new Error(error.message)
    if (data?.error) throw new Error(data.error)
    return {
      job_id: data?.job_id ?? configId,
      status: (data?.status ?? 'completed') as IngestionProgress['status'],
      step: 'analyze',
      progress_percent: 100,
      secrets_detected: data?.secrets_detected,
      secrets_scrubbed: data?.secrets_scrubbed,
      error: data?.error,
    }
  },
}
