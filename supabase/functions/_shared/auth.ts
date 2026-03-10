/**
 * Shared auth helpers for Edge Functions.
 * Uses Supabase client with anon key for sign-in/sign-up to obtain session.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

export function createSupabaseClient(bearerToken?: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {},
    },
  })
}

export function createSupabaseAdminClient() {
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  return createClient(supabaseUrl, serviceRoleKey)
}

export function getCookieOptions() {
  const isProd = Deno.env.get('DENO_ENV') === 'production'
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  }
}

export function buildSetCookieHeader(name: string, value: string, options: ReturnType<typeof getCookieOptions>) {
  const parts = [`${name}=${value}`, `Path=${options.path}`, `Max-Age=${options.maxAge}`, `SameSite=${options.sameSite}`]
  if (options.httpOnly) parts.push('HttpOnly')
  if (options.secure) parts.push('Secure')
  return parts.join('; ')
}
