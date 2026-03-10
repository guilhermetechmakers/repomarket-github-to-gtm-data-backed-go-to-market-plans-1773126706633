/**
 * Edge Function: Purge processor.
 * Performs irreversible deletion and records audit trail.
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createSupabaseClient, createSupabaseAdminClient } from '../_shared/auth.ts'
import { corsHeaders } from '../_shared/cors.ts'

const targetTypes = ['snapshot', 'analysis', 'repository', 'project'] as const

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

  const supabase = createSupabaseClient(authHeader.slice(7))
  const admin = createSupabaseAdminClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = (await req.json()) as { target_type: string; target_id: string; reason?: string }
    const { target_type, target_id, reason } = body ?? {}
    if (!target_type || !target_id || !targetTypes.includes(target_type as (typeof targetTypes)[number])) {
      return new Response(JSON.stringify({ error: 'Invalid target_type or target_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: job, error: jobErr } = await admin
      .from('purge_jobs')
      .insert({
        user_id: user.id,
        target_type,
        target_id,
        reason: reason ?? null,
        status: 'running',
        started_at: new Date().toISOString(),
        audit_trail: [],
      })
      .select('id')
      .single()

    if (jobErr || !job) {
      return new Response(JSON.stringify({ error: 'Failed to create purge job' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const auditEntry = {
      at: new Date().toISOString(),
      action: 'delete',
      target_type,
      target_id,
      user_id: user.id,
    }

    if (target_type === 'snapshot') {
      const { error: delErr } = await admin.from('snapshots').delete().eq('id', target_id)
      if (delErr) {
        await admin.from('purge_jobs').update({ status: 'failed', completed_at: new Date().toISOString() }).eq('id', job.id)
        return new Response(JSON.stringify({ error: delErr.message, purge_job_id: job.id }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    } else if (target_type === 'analysis') {
      const { error: delErr } = await admin.from('analysis_results').delete().eq('id', target_id)
      if (delErr) {
        await admin.from('purge_jobs').update({ status: 'failed', completed_at: new Date().toISOString() }).eq('id', job.id)
        return new Response(JSON.stringify({ error: delErr.message, purge_job_id: job.id }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    } else if (target_type === 'repository') {
      const { error: delErr } = await admin.from('repositories').delete().eq('id', target_id)
      if (delErr) {
        await admin.from('purge_jobs').update({ status: 'failed', completed_at: new Date().toISOString() }).eq('id', job.id)
        return new Response(JSON.stringify({ error: delErr.message, purge_job_id: job.id }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    } else if (target_type === 'project') {
      const { error: delErr } = await admin.from('projects').delete().eq('id', target_id)
      if (delErr) {
        await admin.from('purge_jobs').update({ status: 'failed', completed_at: new Date().toISOString() }).eq('id', job.id)
        return new Response(JSON.stringify({ error: delErr.message, purge_job_id: job.id }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    await admin.from('purge_jobs').update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      audit_trail: [auditEntry],
    }).eq('id', job.id)

    await admin.from('data_audit_logs').insert({
      user_id: user.id,
      action: 'purge',
      resource_type: target_type,
      resource_id: target_id,
      details: { purge_job_id: job.id, reason: reason ?? null },
    })

    return new Response(
      JSON.stringify({ purge_job_id: job.id, status: 'completed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
