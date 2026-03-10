export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  plan?: 'free' | 'solo' | 'team' | 'agency'
  created_at: string
  updated_at: string
}

export interface UpdateUserInput {
  id: string
  full_name?: string
  avatar_url?: string
}
