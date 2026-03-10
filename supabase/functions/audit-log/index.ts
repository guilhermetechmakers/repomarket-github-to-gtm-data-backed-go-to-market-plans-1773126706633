/**
 * Edge Function: Append an audit log entry.
 * Called after sign-in, sign-out, password reset, etc.
 * Uses service role to insert into public.audit_logs.
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createSupabaseAdminClient } from '../_shared/auth.ts'
import { corsHeaders } from '../_shared/cors.ts'

type AuditAction = 'signin' | 'signout' | 'password_reset' | 'password_change' | 'impersonation_start' | 'impersonation_end' | '2fa_enabled' | '2fa_disabled'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const supabase = createSupabaseAdminClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.slice(7))
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = (await req.json()) as { action: AuditAction; ip_address?: string; device?: string; success?: boolean; metadata?: Record<string, unknown> }
    const { action, ip_address, device, success = true, metadata = {} } = body ?? {}
    if (!action) {
      return new Response(JSON.stringify({ error: 'Missing action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const validActions: AuditAction[] = ['signin', 'signout', 'password_reset', 'password_change', 'impersonation_start', 'impersonation_end', '2fa_enabled', '2fa_disabled']
    if (!validActions.includes(action)) {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { error: insertError } = await supabase.from('audit_logs').insert({
      user_id: user.id,
      action,
      ip_address: ip_address ?? null,
      device: device ?? null,
      success: success ?? true,
      metadata: metadata ?? {},
    })

    if (insertError) {
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
