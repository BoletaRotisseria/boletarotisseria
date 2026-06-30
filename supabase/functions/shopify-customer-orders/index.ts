// Lista pedidos do cliente autenticado (Shopify Admin API) por email/CPF
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SHOPIFY_STORE = "boleta-direct-8l7a1.myshopify.com";
const API_VERSION = "2025-07";

async function shopify(path: string) {
  const token = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
  if (!token) throw new Error("SHOPIFY_ACCESS_TOKEN ausente");
  const res = await fetch(`https://${SHOPIFY_STORE}/admin/api/${API_VERSION}${path}`, {
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const text = await res.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  return { ok: res.ok, status: res.status, body };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userRes, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userRes?.user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const user = userRes.user;

    // Buscar email/cpf no banco
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: cli } = await admin
      .from("clientes")
      .select("email, cpf")
      .eq("id", user.id)
      .maybeSingle();

    const email = (cli?.email || user.email || "").trim().toLowerCase();
    const cpf = (cli?.cpf || "").replace(/\D/g, "");

    // 1) Encontrar customer no Shopify (por CPF metafield/tag, depois por email)
    let customerId: string | null = null;
    if (cpf) {
      const r = await shopify(`/customers/search.json?query=${encodeURIComponent(`metafields.custom.cpf:${cpf} OR tag:cpf:${cpf}`)}&limit=1`);
      if (r.ok) customerId = r.body?.customers?.[0]?.id ? String(r.body.customers[0].id) : null;
    }
    if (!customerId && email) {
      const r = await shopify(`/customers/search.json?query=${encodeURIComponent(`email:${email}`)}&limit=1`);
      if (r.ok) customerId = r.body?.customers?.[0]?.id ? String(r.body.customers[0].id) : null;
    }

    // 2) Buscar pedidos: por customer_id (se achou) E também por email direto (cobre pedidos guest / customer recém-criado)
    const ordersMap = new Map<number, any>();

    const collect = (arr: any[]) => {
      for (const o of arr ?? []) {
        if (o?.id != null) ordersMap.set(Number(o.id), o);
      }
    };

    if (customerId) {
      const ord = await shopify(`/orders.json?customer_id=${customerId}&status=any&limit=100&order=created_at+desc`);
      if (ord.ok) collect(ord.body?.orders ?? []);
      else console.error("orders by customer_id failed", ord.status, ord.body);
    }

    if (email) {
      const ord = await shopify(`/orders.json?email=${encodeURIComponent(email)}&status=any&limit=100&order=created_at+desc`);
      if (ord.ok) collect(ord.body?.orders ?? []);
      else console.error("orders by email failed", ord.status, ord.body);
    }

    if (ordersMap.size === 0) {
      console.log("Nenhum pedido encontrado", { email, cpf: cpf ? cpf.slice(0, 3) + "***" : null, customerId });
      return new Response(JSON.stringify({ orders: [] }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }


    const orders = Array.from(ordersMap.values())
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((o: any) => ({
        id: o.id,
        name: o.name,
        created_at: o.created_at,
        financial_status: o.financial_status,
        fulfillment_status: o.fulfillment_status,
        cancelled_at: o.cancelled_at,
        total_price: o.total_price,
        currency: o.currency,
        order_status_url: o.order_status_url,
        line_items: (o.line_items ?? []).map((li: any) => ({
          title: li.title,
          quantity: li.quantity,
          variant_title: li.variant_title,
        })),
      }));

    return new Response(JSON.stringify({ orders }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("shopify-customer-orders error", e);
    return new Response(JSON.stringify({ error: String((e as any)?.message ?? e), orders: [] }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
