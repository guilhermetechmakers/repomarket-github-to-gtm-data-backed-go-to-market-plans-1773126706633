/**
 * Edge Function: Data retention evaluator.
 * Periodic check to apply retention policies and trigger purges for expired data.
 * Invoke via cron or HTTP. Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createSupabaseAdminClient } from '../_shared/auth.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
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

  const admin = createSupabaseAdminClient()
  const processed: { policy_id: string; purged: number }[] = []

  try {
    const { data: policies, error: polErr } = await admin
      .from('retention_policies')
      .select('id, user_id, project_id, data_type, retention_days, purge_on_expire')
      .eq('purge_on_expire', true)

    if (polErr || !policies?.length) {
      return new Response(
        JSON.stringify({ ok: true, message: 'No retention policies to evaluate', processed: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    for (const policy of policies) {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - policy.retention_days)
      const cutoffIso = cutoff.toISOString()
      let purged = 0

      if (policy.data_type === 'snapshot') {
        let query = admin.from('snapshots').select('id').lt('created_at', cutoffIso)
        if (policy.project_id) {
          const { data: repoIds } = await admin.from('repositories').select('id').eq('project_id', policy.project_id)
          const ids = (repoIds ?? []).map((r: { id: string }) => r.id)
          if (ids.length > 0) query = query.in('repo_id', ids)
        }
        const { data: expired } = await query
        const expiredList = Array.isArray(expired) ? expired : []
        for (const row of expiredList) {
          await admin.from('purge_jobs').insert({
            user_id: policy.user_id,
            target_type: 'snapshot',
            target_id: row.id,
            status: 'pending',
            audit_trail: [],
          })
          await admin.from('snapshots').delete().eq('id', row.id)
          purged++
        }
      }

      if (policy.data_type === 'analysis') {
        const { data: expired } = await admin
          .from('analysis_results')
          .select('id')
          .lt('created_at', cutoffIso)
        const expiredList = Array.isArray(expired) ? expired : []
        for (const row of expiredList) {
          await admin.from('purge_jobs').insert({
            user_id: policy.user_id,
            target_type: 'analysis',
            target_id: row.id,
            status: 'pending',
            audit_trail: [],
          })
          await admin.from('analysis_results').delete().eq('id', row.id)
          purged++
        }
      }

      if (policy.user_id) {
        await admin.from('data_audit_logs').insert({
          user_id: policy.user_id,
          action: 'retention_apply',
          resource_type: 'retention_policy',
          resource_id: policy.id,
          details: { data_type: policy.data_type, purged },
        })
      }
      processed.push({ policy_id: policy.id, purged })
    }

    return new Response(
      JSON.stringify({ ok: true, processed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
