import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ingestionApi } from '@/api/ingestion'
import { toast } from 'sonner'

const keys = {
  all: ['ingestion'] as const,
  byRepo: (repoId: string) => [...keys.all, 'repo', repoId] as const,
}

export function useStartIngestion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (configId: string) => ingestionApi.startIngestion(configId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: keys.all })
      const msg = data.secrets_scrubbed != null && data.secrets_scrubbed > 0
        ? `Ingestion complete. ${data.secrets_scrubbed} secret(s) scrubbed.`
        : 'Ingestion complete.'
      toast.success(msg)
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useIngestionConfigs(repoId: string | undefined) {
  return useQuery({
    queryKey: keys.byRepo(repoId ?? ''),
    queryFn: () => (repoId ? ingestionApi.getConfigsByRepo(repoId) : Promise.resolve([])),
    enabled: !!repoId,
  })
}
