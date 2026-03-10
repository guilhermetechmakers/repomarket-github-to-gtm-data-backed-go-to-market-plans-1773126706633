import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { retentionApi } from '@/api/retention'
import { toast } from 'sonner'
import type { SetRetentionInput } from '@/types/retention'

const keys = {
  all: ['retention'] as const,
  user: (userId: string) => [...keys.all, 'user', userId] as const,
  project: (projectId: string) => [...keys.all, 'project', projectId] as const,
}

export function useRetentionByUser(userId: string | undefined) {
  return useQuery({
    queryKey: keys.user(userId ?? ''),
    queryFn: () => (userId ? retentionApi.getByUser(userId) : Promise.resolve([])),
    enabled: !!userId,
  })
}

export function useRetentionByProject(projectId: string | undefined) {
  return useQuery({
    queryKey: keys.project(projectId ?? ''),
    queryFn: () => (projectId ? retentionApi.getByProject(projectId) : Promise.resolve([])),
    enabled: !!projectId,
  })
}

export function useSetRetention() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SetRetentionInput) => retentionApi.set(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
      toast.success('Retention policy saved.')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useDeleteRetention() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => retentionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
      toast.success('Retention policy removed.')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
