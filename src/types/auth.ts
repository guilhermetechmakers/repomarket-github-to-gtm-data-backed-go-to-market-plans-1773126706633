import type { User } from './user'

export interface AuthResponse {
  token?: string
  user?: User
  session?: { access_token: string; refresh_token?: string; expires_at?: number }
}

export interface SignInInput {
  email: string
  password: string
}

export interface SignUpInput {
  email: string
  password: string
  full_name?: string
}

export interface PasswordResetRequestInput {
  email: string
}

export interface PasswordResetInput {
  token: string
  new_password: string
}

export type AuditAction =
  | 'signin'
  | 'signout'
  | 'password_reset'
  | 'password_change'
  | 'impersonation_start'
  | 'impersonation_end'
  | '2fa_enabled'
  | '2fa_disabled'
