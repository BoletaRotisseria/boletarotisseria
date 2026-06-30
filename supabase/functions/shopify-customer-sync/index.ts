// Sincroniza cliente do site -> Shopify (cria ou atualiza customer com CPF metafield)
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SHOPIFY_STORE = "boleta-direct-8l7a1.myshopify.com";
const API_VERSION = "2025-07";

function normPhoneBR(raw: string): string | null {
  const d = (raw || "").replace(/\D/g, "");
  if (!d) return null;
  if (d.startsWith("55")) return `+${d}`;
  if (d.length === 10 || d.length === 11) return `+55${d}`;
  return `+${d}`;
}

async function shopify(path: string, init: RequestInit = {}) {
  const token = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
  if (!token) throw new Error("SHOPIFY_ACCESS_TOKEN ausente");
  const res = await fetch(`https://${SHOPIFY_STORE}/admin/api/${API_VERSION}${path}`, {
    ...init,
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  return { ok: res.ok, status: res.status, body };
}

async function findCustomerByQuery(query: string): Promise<any | null> {
  const r = await shopify(`/customers/search.json?query=${encodeURIComponent(query)}&limit=1`);
  if (!r.ok) return null;
  return r.body?.customers?.[0] ?? null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Autenticação opcional: durante o cadastro (com confirmação de e-mail)
    // ainda não há sessão. Aceitamos os dados do body nesse caso.
    let sessionEmail: string | null = null;
    const authHeader = req.headers.get("Authorization") ?? "";
    if (authHeader && !authHeader.endsWith(ANON)) {
      try {
        const userClient = createClient(SUPABASE_URL, ANON, {
          global: { headers: { Authorization: authHeader } },
        });
        const { data: userRes } = await userClient.auth.getUser();
        sessionEmail = userRes?.user?.email ?? null;
      } catch (_) {
        // ignora — segue como cadastro novo
      }
    }

    const body = await req.json().catch(() => ({}));
    const nome = String(body.nome_completo ?? "").trim();
    const cpfRaw = String(body.cpf ?? "").replace(/\D/g, "");
    const telefoneRaw = String(body.telefone ?? "").trim();
    const email = String(body.email ?? sessionEmail ?? "").trim().toLowerCase();

    if (!email) {
      return new Response(JSON.stringify({ error: "email obrigatório" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [firstName, ...rest] = nome.split(" ").filter(Boolean);
    const lastName = rest.join(" ");
    const phone = normPhoneBR(telefoneRaw);

    // Search Shopify: by metafield CPF first, then by email
    let existing: any | null = null;
    if (cpfRaw) {
      existing = await findCustomerByQuery(`metafields.custom.cpf:${cpfRaw} OR tag:cpf:${cpfRaw}`);
    }
    if (!existing) {
      existing = await findCustomerByQuery(`email:${email}`);
    }

    const metafields = cpfRaw
      ? [{ namespace: "custom", key: "cpf", type: "single_line_text_field", value: cpfRaw }]
      : [];
    const tagsArr: string[] = [];
    if (cpfRaw) tagsArr.push(`cpf:${cpfRaw}`);

    let shopifyCustomerId: string | null = existing?.id ? String(existing.id) : null;

    if (existing) {
      // Update existing
      const existingTags: string[] = (existing.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean);
      const mergedTags = Array.from(new Set([...existingTags, ...tagsArr])).join(", ");
      const updateBody: any = {
        customer: {
          id: existing.id,
          email,
          first_name: firstName || existing.first_name,
          last_name: lastName || existing.last_name,
          tags: mergedTags,
        },
      };
      if (phone) updateBody.customer.phone = phone;
      if (metafields.length) updateBody.customer.metafields = metafields;
      const upd = await shopify(`/customers/${existing.id}.json`, {
        method: "PUT",
        body: JSON.stringify(updateBody),
      });
      if (!upd.ok) {
        console.error("Shopify update failed", upd.status, upd.body);
      }
    } else {
      // Create new — no invite (passwordless)
      const createBody: any = {
        customer: {
          email,
          first_name: firstName || "",
          last_name: lastName || "",
          verified_email: true,
          tags: tagsArr.join(", "),
          send_email_invite: false,
          send_email_welcome: false,
        },
      };
      if (phone) createBody.customer.phone = phone;
      if (metafields.length) createBody.customer.metafields = metafields;
      const cr = await shopify(`/customers.json`, {
        method: "POST",
        body: JSON.stringify(createBody),
      });
      if (cr.ok && cr.body?.customer?.id) {
        shopifyCustomerId = String(cr.body.customer.id);
      } else {
        console.error("Shopify create failed", cr.status, cr.body);
      }
    }

    return new Response(JSON.stringify({ ok: true, shopify_customer_id: shopifyCustomerId }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("shopify-customer-sync error", e);
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
