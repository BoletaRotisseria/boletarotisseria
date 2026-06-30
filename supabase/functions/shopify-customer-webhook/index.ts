// Webhook Shopify -> site: customers/create + customers/update.
// Cria auth user no Supabase (envia convite por e-mail p/ a pessoa definir senha)
// e upserta na tabela clientes. CPF é lido do metafield custom.cpf.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SHOPIFY_STORE = "boleta-direct-8l7a1.myshopify.com";
const API_VERSION = "2025-07";

async function verifyHmac(rawBody: string, hmacHeader: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const computed = btoa(String.fromCharCode(...new Uint8Array(sig)));
  if (computed.length !== hmacHeader.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.length; i++) diff |= computed.charCodeAt(i) ^ hmacHeader.charCodeAt(i);
  return diff === 0;
}

async function fetchCpfMetafield(customerId: string | number): Promise<string> {
  const token = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
  if (!token) return "";
  try {
    const res = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/customers/${customerId}/metafields.json?namespace=custom&key=cpf`,
      { headers: { "X-Shopify-Access-Token": token, Accept: "application/json" } },
    );
    if (!res.ok) return "";
    const j = await res.json();
    const v = j?.metafields?.[0]?.value;
    return v ? String(v).replace(/\D/g, "") : "";
  } catch {
    return "";
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const rawBody = await req.text();
  const hmacHeader = req.headers.get("X-Shopify-Hmac-Sha256") ?? "";
  const webhookSecret = Deno.env.get("SHOPIFY_WEBHOOK_SECRET");
  if (!webhookSecret) return new Response("Server misconfigured", { status: 500 });
  if (!hmacHeader || !(await verifyHmac(rawBody, hmacHeader, webhookSecret))) {
    return new Response("Invalid signature", { status: 401 });
  }

  let payload: any;
  try { payload = JSON.parse(rawBody); } catch { return new Response("Invalid JSON", { status: 400 }); }

  const shopifyId = payload?.id;
  const email = String(payload?.email ?? "").trim().toLowerCase();
  const phoneRaw = String(payload?.phone ?? payload?.default_address?.phone ?? "");
  const telefone = phoneRaw.replace(/\D/g, "");
  const firstName = String(payload?.first_name ?? "");
  const lastName = String(payload?.last_name ?? "");
  const nome = [firstName, lastName].filter(Boolean).join(" ").trim();

  if (!email) return new Response("ok", { status: 200 }); // ignora customers sem email

  const cpf = await fetchCpfMetafield(shopifyId);

  const supa = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  try {
    // 1) Tenta achar cliente existente: por CPF (preferido), depois por email
    let clienteId: string | null = null;
    if (cpf) {
      const { data } = await supa.from("clientes").select("id").eq("cpf", cpf).maybeSingle();
      clienteId = data?.id ?? null;
    }
    if (!clienteId && email) {
      const { data } = await supa.from("clientes").select("id").eq("email", email).maybeSingle();
      clienteId = data?.id ?? null;
    }

    // 2) Se não existe cadastro no site, cria via convite (passwordless até definir senha)
    if (!clienteId) {
      // Verifica se já existe auth user com esse email
      const { data: existingAuth } = await supa.auth.admin.listUsers();
      const found = existingAuth?.users?.find((u) => u.email?.toLowerCase() === email);
      if (found) {
        clienteId = found.id;
      } else {
        const { data: invited, error: invErr } = await supa.auth.admin.inviteUserByEmail(email, {
          data: { full_name: nome, source: "shopify_sync" },
        });
        if (invErr) {
          console.error("inviteUserByEmail erro", invErr);
        }
        clienteId = invited?.user?.id ?? null;
      }
    }

    if (clienteId) {
      const { error: rpcErr } = await supa.rpc("upsert_cliente_servidor", {
        _id: clienteId,
        _nome: nome,
        _cpf: cpf,
        _email: email,
        _telefone: telefone,
      });
      if (rpcErr) console.error("upsert_cliente_servidor erro", rpcErr);
    }

    return new Response("ok", { status: 200 });
  } catch (e) {
    console.error("shopify-customer-webhook error", e);
    return new Response("ok", { status: 200 }); // 200 para Shopify não reenviar em loop
  }
});
