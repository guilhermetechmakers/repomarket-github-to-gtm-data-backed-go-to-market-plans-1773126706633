import { api } from '@/lib/api'
import type { Project, CreateProjectInput, UpdateProjectInput } from '@/types/project'

export const projectsApi = {
  getAll: async (): Promise<Project[]> => api.get<Project[]>('/projects'),
  getById: async (id: string): Promise<Project> =>
    api.get<Project>(`/projects/${id}`),
  create: async (project: CreateProjectInput): Promise<Project> =>
    api.post<Project>('/projects', project),
  update: async (id: string, updates: UpdateProjectInput): Promise<Project> =>
    api.put<Project>(`/projects/${id}`, updates),
  delete: async (id: string): Promise<void> => api.delete(`/projects/${id}`),
  getByUserId: async (userId: string): Promise<Project[]> =>
    api.get<Project[]>(`/projects/user/${userId}`),
}
