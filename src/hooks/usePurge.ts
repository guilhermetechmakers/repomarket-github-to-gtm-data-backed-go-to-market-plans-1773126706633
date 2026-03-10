import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { purgeApi } from '@/api/purge'
import { toast } from 'sonner'
import type { InitiatePurgeInput } from '@/types/purge'

const keys = {
  all: ['purge'] as const,
  status: (id: string) => [...keys.all, 'status', id] as const,
  list: () => [...keys.all, 'list'] as const,
}

export function usePurgeStatus(id: string | null) {
  return useQuery({
    queryKey: keys.status(id ?? ''),
    queryFn: () => (id ? purgeApi.getStatus(id) : Promise.resolve(null)),
    enabled: !!id,
  })
}

export function usePurgeJobs() {
  return useQuery({
    queryKey: keys.list(),
    queryFn: () => purgeApi.listByUser(),
  })
}

export function useInitiatePurge() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: InitiatePurgeInput) => purgeApi.initiate(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
      toast.success('Purge completed.')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
