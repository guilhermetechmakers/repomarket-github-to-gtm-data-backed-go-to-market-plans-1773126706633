import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '@/api/projects'
import { toast } from 'sonner'
import type { UpdateProjectInput } from '@/types/project'

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: string) => [...projectKeys.lists(), { filters }] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
}

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: projectsApi.getAll,
    staleTime: 1000 * 60 * 5,
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
      queryClient.setQueryData(projectKeys.detail(newProject.id), newProject)
      toast.success('Project created successfully!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create project: ${error.message}`)
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateProjectInput }) =>
      projectsApi.update(id, updates),
    onSuccess: (updated) => {
      queryClient.setQueryData(projectKeys.detail(updated.id), updated)
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
      toast.success('Project updated!')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update: ${error.message}`)
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: projectKeys.detail(deletedId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
      toast.success('Project deleted.')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete: ${error.message}`)
    },
  })
}
