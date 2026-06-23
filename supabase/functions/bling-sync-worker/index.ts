import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const BLING_API = "https://www.bling.com.br/Api/v3";
const TOKEN_URL = `${BLING_API}/oauth/token`;
const MAX_ATTEMPTS = 12;
const RETRY_DELAY_MIN = 5;

async function getAccessToken(supabase: any): Promise<string> {
  const { data: row, error } = await supabase
    .from("bling_tokens").select("*").eq("id", true).maybeSingle();
  if (error) throw new Error(`tokens read failed: ${error.message}`);
  if (!row) throw new Error("Bling não conectado (sem tokens).");

  const expiresAt = new Date(row.expires_at).getTime();
  if (expiresAt - Date.now() > 60_000) return row.access_token;

  // refresh
  const clientId = Deno.env.get("BLING_CLIENT_ID")!;
  const clientSecret = Deno.env.get("BLING_CLIENT_SECRET")!;
  const basic = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: row.refresh_token }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) {
    throw new Error(`refresh failed: ${res.status} ${JSON.stringify(json)}`);
  }
  const newExpires = new Date(Date.now() + (json.expires_in ?? 21600) * 1000).toISOString();
  await supabase.from("bling_tokens").upsert({
    id: true,
    access_token: json.access_token,
    refresh_token: json.refresh_token ?? row.refresh_token,
    expires_at: newExpires,
    updated_at: new Date().toISOString(),
  });
  return json.access_token;
}

async function findPedidoIdByNumeroLoja(token: string, numeroLoja: string): Promise<string | null> {
  const url = `${BLING_API}/pedidos/vendas?numeroLoja=${encodeURIComponent(numeroLoja)}`;
  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`GET pedidos/vendas ${res.status}: ${txt}`);
  }
  const json = await res.json();
  const list: any[] = json?.data ?? [];
  if (!list.length) return null;
  // se vier mais de um, pega o mais recente
  return String(list[0].id);
}

async function patchObservacoes(token: string, pedidoId: string, observacoes: string): Promise<void> {
  const url = `${BLING_API}/pedidos/vendas/${pedidoId}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      observacoes,
      observacoesInternas: observacoes,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`PATCH pedidos/vendas/${pedidoId} ${res.status}: ${txt}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: jobs, error } = await supabase
    .from("bling_sync_jobs")
    .select("*")
    .eq("status", "pending")
    .lte("next_attempt_at", new Date().toISOString())
    .order("next_attempt_at", { ascending: true })
    .limit(20);

  if (error) {
    console.error("Read jobs failed", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!jobs || jobs.length === 0) {
    return new Response(JSON.stringify({ processed: 0 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let token: string;
  try {
    token = await getAccessToken(supabase);
  } catch (e) {
    const msg = (e as Error).message;
    console.error("Token error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const results: any[] = [];

  for (const job of jobs) {
    try {
      const pedidoId = await findPedidoIdByNumeroLoja(token, job.shopify_order_number);
      if (!pedidoId) {
        const attempts = job.attempts + 1;
        const nextStatus = attempts >= MAX_ATTEMPTS ? "failed" : "pending";
        const nextAt = new Date(Date.now() + RETRY_DELAY_MIN * 60_000).toISOString();
        await supabase.from("bling_sync_jobs").update({
          attempts,
          status: nextStatus,
          next_attempt_at: nextAt,
          last_error: "Pedido ainda não encontrado no Bling",
        }).eq("id", job.id);
        results.push({ id: job.id, status: nextStatus, reason: "not_found_yet" });
        continue;
      }

      await patchObservacoes(token, pedidoId, job.observacoes_text);
      await supabase.from("bling_sync_jobs").update({
        status: "done",
        bling_pedido_id: pedidoId,
        last_error: null,
      }).eq("id", job.id);
      results.push({ id: job.id, status: "done", pedidoId });
    } catch (e) {
      const msg = (e as Error).message;
      console.error(`Job ${job.id} failed`, msg);
      const attempts = job.attempts + 1;
      const nextStatus = attempts >= MAX_ATTEMPTS ? "failed" : "pending";
      const nextAt = new Date(Date.now() + RETRY_DELAY_MIN * 60_000).toISOString();
      await supabase.from("bling_sync_jobs").update({
        attempts,
        status: nextStatus,
        next_attempt_at: nextAt,
        last_error: msg.slice(0, 2000),
      }).eq("id", job.id);
      results.push({ id: job.id, status: nextStatus, error: msg });
    }
  }

  return new Response(JSON.stringify({ processed: results.length, results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
