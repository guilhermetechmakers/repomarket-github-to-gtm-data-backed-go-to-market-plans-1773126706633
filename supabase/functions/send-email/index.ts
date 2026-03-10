/**
 * Edge Function: Send transactional email via SendGrid.
 * Used for verification links, password reset links, onboarding.
 * Requires SENDGRID_API_KEY and optional FROM_EMAIL env.
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const SENDGRID_URL = 'https://api.sendgrid.com/v3/mail/send'

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

  const apiKey = Deno.env.get('SENDGRID_API_KEY')
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Email service not configured' }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const body = await req.json() as { to: string; subject: string; html?: string; text?: string; templateId?: string; dynamicTemplateData?: Record<string, unknown> }
    const { to, subject, html, text, templateId, dynamicTemplateData } = body ?? {}
    if (!to || (!subject && !templateId)) {
      return new Response(
        JSON.stringify({ error: 'Missing to and (subject or templateId)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const fromEmail = Deno.env.get('FROM_EMAIL') ?? 'noreply@repomarket.app'
    const payload: Record<string, unknown> = {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: fromEmail, name: 'RepoMarket' },
    }
    if (templateId) {
      payload.template_id = templateId
      if (dynamicTemplateData) payload.dynamic_template_data = dynamicTemplateData
    } else {
      payload.subject = subject
      if (html) payload.content = [{ type: 'text/html', value: html }]
      if (text) payload.content = [...((payload.content as unknown[]) ?? []), { type: 'text/plain', value: text }]
    }

    const res = await fetch(SENDGRID_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errText = await res.text()
      return new Response(
        JSON.stringify({ error: 'SendGrid error', details: errText }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
