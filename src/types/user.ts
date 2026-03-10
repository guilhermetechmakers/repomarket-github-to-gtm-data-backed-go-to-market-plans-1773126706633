export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  plan?: 'free' | 'solo' | 'team' | 'agency'
  created_at: string
  updated_at: string
  email_confirmed_at?: string | null
  two_fa_enabled?: boolean
  last_sign_in_at?: string | null
  is_admin?: boolean
}

export interface UserProfile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  plan: 'free' | 'solo' | 'team' | 'agency'
  created_at: string
  updated_at: string
  two_fa_enabled?: boolean
  last_sign_in_at?: string | null
  is_admin?: boolean
}

export interface UpdateUserInput {
  id: string
  full_name?: string
  avatar_url?: string
}

export interface UserPreferences {
  user_id: string
  privacy_retention_days: number | null
  email_notifications: boolean
  marketing_emails: boolean
  updated_at: string
}

export interface OAuthConnection {
  id: string
  user_id: string
  provider: 'github' | 'google'
  provider_user_id: string
  connected_at: string
  scopes: string[]
}
