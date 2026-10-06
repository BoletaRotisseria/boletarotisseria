import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3.23.8'
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts'

const Body = z.object({
  nome: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(255),
  telefone: z.string().trim().max(50).default(''),
  mensagem: z.string().trim().max(5000).default(''),
  chave: z.string().trim().min(8).max(100).regex(/^[A-Za-z0-9-]+$/),
})

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

async function log(template: string, recipient: string, status: string, error_message?: string) {
  const { error } = await supabase.from('email_send_log').insert({
    message_id: null,
    template_name: template,
    recipient_email: recipient,
    status,
    error_message: error_message ?? null,
  })
  if (error) console.error('email_send_log insert failed', { code: error.code, message: error.message })
}

async function enviar(template: string, to: string, templateData: Record<string, unknown>, key: string) {
  try {
    const r = await sendTemplateEmail(template, to, { templateData, idempotencyKey: key })
    await log(template, to, r.sent ? 'sent' : 'suppressed')
    return r
  } catch (e) {
    await log(template, to, 'failed', e instanceof Error ? e.message : String(e))
    throw e
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let raw: unknown
  try { raw = await req.json() } catch { return json({ error: 'Invalid JSON' }, 400) }
  const parsed = Body.safeParse(raw)
  if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400)
  const { chave, ...dados } = parsed.data

  const enviadoEm = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })

  try {
    // Destino fixo definido no template (vendas@boletarotisseria.com.br).
    await enviar('evento-proposta-loja', 'vendas@boletarotisseria.com.br', { ...dados, enviadoEm }, `eventos-proposta-${chave}`)
  } catch (e) {
    console.error('Falha ao enviar proposta', e instanceof Error ? e.message : e)
    return json({ error: 'Falha ao enviar' }, 500)
  }

  // Confirmação ao cliente é secundária.
  try {
    await enviar('evento-confirmacao-cliente', dados.email, dados, `eventos-confirmacao-${chave}`)
  } catch (e) {
    console.error('Falha ao enviar confirmação', e instanceof Error ? e.message : e)
  }

  return json({ success: true })
})
