export interface Project {
  id: string
  name: string
  description: string
  repo_url: string
  repo_owner: string
  repo_name: string
  user_id: string
  maturity_score?: number
  status: 'pending' | 'ingesting' | 'analyzing' | 'researching' | 'synthesizing' | 'complete' | 'failed'
  report_id?: string
  created_at: string
  updated_at: string
}

export interface CreateProjectInput {
  name: string
  repo_url: string
  repo_owner: string
  repo_name: string
  user_id: string
  branch?: string
  include_private?: boolean
}

export interface UpdateProjectInput {
  name?: string
  description?: string
  status?: Project['status']
  report_id?: string
}
