import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

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
  // constant-time compare
  if (computed.length !== hmacHeader.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.length; i++) diff |= computed.charCodeAt(i) ^ hmacHeader.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const rawBody = await req.text();
  const hmacHeader = req.headers.get("X-Shopify-Hmac-Sha256") ?? "";
  const webhookSecret = Deno.env.get("SHOPIFY_WEBHOOK_SECRET");

  if (!webhookSecret) {
    console.error("SHOPIFY_WEBHOOK_SECRET ausente");
    return new Response("Server misconfigured", { status: 500 });
  }
  if (!hmacHeader || !(await verifyHmac(rawBody, hmacHeader, webhookSecret))) {
    console.warn("HMAC inválido");
    return new Response("Invalid signature", { status: 401 });
  }

  let payload: any;
  try { payload = JSON.parse(rawBody); }
  catch { return new Response("Invalid JSON", { status: 400 }); }

  const shopifyOrderId = String(payload?.id ?? "");
  const shopifyOrderNumber = String(payload?.order_number ?? payload?.number ?? "");
  if (!shopifyOrderId || !shopifyOrderNumber) {
    return new Response("Missing order id/number", { status: 400 });
  }

  const noteAttributes: Array<{ name: string; value: string }> = payload?.note_attributes ?? [];
  const attr = (name: string) =>
    noteAttributes.find((a) => a?.name === name)?.value?.toString().trim() ?? "";

  const metodo = attr("Método de Recebimento");
  const data = attr("Data de Entrega/Retirada");
  const horario = attr("Horário de Entrega/Retirada");
  const local = attr("Local");

  // Se for entrega, sobrescreve "Local" com o endereço do shipping_address
  let localFinal = local;
  if (metodo.toLowerCase().startsWith("entrega") && payload?.shipping_address) {
    const a = payload.shipping_address;
    const parts = [
      [a.address1, a.address2].filter(Boolean).join(", "),
      a.city, a.province_code || a.province, a.zip,
    ].filter(Boolean);
    localFinal = `Entrega: ${parts.join(" - ")}`;
  }

  // Cabeçalho compacto: AAAAMMDD | TIPO | HORÁRIO (para filtrar/imprimir etiquetas no Bling)
  // data vem como DD/MM/YYYY
  let dataCompacta = "00000000";
  const m = data.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) dataCompacta = `${m[3]}${m[2]}${m[1]}`;
  const tipo = metodo.toLowerCase().startsWith("entrega")
    ? "ENTREGA"
    : metodo.toLowerCase().startsWith("retirada")
      ? "RETIRADA"
      : (metodo || "-").toUpperCase();
  const horarioCompacto = (horario || "-").replace(/\s+/g, "");
  const header = `${dataCompacta} | ${tipo} | ${horarioCompacto}`;

  const observacoes_text = [
    header,
    "",
    `Método de Recebimento: ${metodo || "-"}`,
    `Data de Entrega/Retirada: ${data || "-"}`,
    `Horário de Entrega/Retirada: ${horario || "-"}`,
    `Local: ${localFinal || "-"}`,
  ].join("\n");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { error: upsertErr } = await supabase
    .from("bling_sync_jobs")
    .upsert(
      {
        shopify_order_id: shopifyOrderId,
        shopify_order_number: shopifyOrderNumber,
        observacoes_text,
        status: "pending",
        attempts: 0,
        next_attempt_at: new Date().toISOString(),
        last_error: null,
      },
      { onConflict: "shopify_order_id" },
    );

  // ===== Sincroniza endereço do cliente (quando for entrega com shipping_address) =====
  // Procura cliente pelo e-mail do pedido e atualiza os campos de endereço.
  try {
    const customerEmail = String(payload?.email ?? payload?.customer?.email ?? "").trim().toLowerCase();
    const ship = payload?.shipping_address;
    if (metodo.toLowerCase().startsWith("entrega") && customerEmail && ship) {
      const cepClean = String(ship.zip ?? "").replace(/\D/g, "");
      const updates: Record<string, string> = {
        cep: cepClean,
        estado: String(ship.province_code ?? ship.province ?? "").toUpperCase().slice(0, 2),
        cidade: String(ship.city ?? "").trim(),
        bairro: String(ship.neighborhood ?? ship.address2 ?? "").trim(),
        rua: String(ship.address1 ?? "").trim(),
        numero: String(ship.number ?? "").trim(),
        complemento: String(ship.company ?? "").trim(),
        atualizado_em: new Date().toISOString(),
      };
      // Só atualiza campos não-vazios para não sobrescrever dados existentes com vazio
      const filtered: Record<string, string> = {};
      for (const [k, v] of Object.entries(updates)) {
        if (v && v.length > 0) filtered[k] = v;
      }
      if (Object.keys(filtered).length > 1) {
        const { error: addrErr } = await supabase
          .from("clientes")
          .update(filtered)
          .eq("email", customerEmail);
        if (addrErr) console.error("Falha ao atualizar endereço do cliente", addrErr);
      }
    }
  } catch (e) {
    console.error("Erro ao sincronizar endereço do cliente", e);
  }


  // ===== Adicionar tags ao pedido na Shopify (ENTREGA/RETIRADA + AAAA-MM-DD) =====
  // Permite filtrar/organizar pedidos por data de entrega/retirada no admin Shopify.
  try {
    const adminToken = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
    const shopDomain = Deno.env.get("SHOPIFY_SHOP_DOMAIN") ?? "boleta-direct-8l7a1.myshopify.com";
    if (adminToken && shopifyOrderId) {
      const newTags: string[] = [];
      if (tipo === "ENTREGA" || tipo === "RETIRADA") newTags.push(tipo);
      // data vem como DD/MM/YYYY → tag em AAAA-MM-DD (ordenável)
      if (m) newTags.push(`${m[3]}-${m[2]}-${m[1]}`);
      // tag combinada útil para filtros operacionais (ex.: ENTREGA-2026-06-25)
      if ((tipo === "ENTREGA" || tipo === "RETIRADA") && m) {
        newTags.push(`${tipo}-${m[3]}-${m[2]}-${m[1]}`);
      }
      // horário compacto também ajuda a separar lotes do dia
      if (horarioCompacto && horarioCompacto !== "-") newTags.push(`HORARIO-${horarioCompacto}`);

      if (newTags.length > 0) {
        const existingTags = String(payload?.tags ?? "")
          .split(",").map((t) => t.trim()).filter(Boolean);
        const merged = Array.from(new Set([...existingTags, ...newTags]));
        const url = `https://${shopDomain}/admin/api/2025-07/orders/${shopifyOrderId}.json`;
        const resp = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": adminToken,
          },
          body: JSON.stringify({
            order: { id: Number(shopifyOrderId), tags: merged.join(", ") },
          }),
        });
        if (!resp.ok) {
          console.error("Falha ao adicionar tags na Shopify",
            resp.status, await resp.text().catch(() => ""));
        }
      }
    } else if (!adminToken) {
      console.warn("SHOPIFY_ACCESS_TOKEN ausente; tags não foram adicionadas");
    }
  } catch (e) {
    console.error("Erro ao adicionar tags na Shopify", e);
  }

  // ===== Dedup de cliente no Shopify por CPF =====
  // Mantém o customer mais antigo como canônico; os duplicados ganham tag "duplicado-cpf"
  // e uma nota apontando pro canônico. Também grava o CPF no metafield do canônico se faltar.
  try {
    const adminToken = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
    const shopDomain = Deno.env.get("SHOPIFY_SHOP_DOMAIN") ?? "boleta-direct-8l7a1.myshopify.com";
    const customerId = payload?.customer?.id ? String(payload.customer.id) : "";
    if (adminToken && customerId) {
      // 1) descobre CPF: prioridade note_attributes (CPF/CNPJ, CPF, Documento) > metafield custom.cpf
      let cpfRaw = "";
      for (const name of ["CPF/CNPJ", "CPF", "cpf", "Documento", "documento"]) {
        const v = noteAttributes.find((a) => a?.name === name)?.value;
        if (v) { cpfRaw = String(v); break; }
      }
      let cpf = cpfRaw.replace(/\D/g, "");

      const gql = async (query: string, variables: any) => {
        const r = await fetch(`https://${shopDomain}/admin/api/2025-07/graphql.json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": adminToken,
          },
          body: JSON.stringify({ query, variables }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || j.errors) throw new Error(`GraphQL ${r.status}: ${JSON.stringify(j.errors ?? j)}`);
        return j.data;
      };

      // Se não veio no note_attributes, lê metafield do customer do pedido
      if (!cpf) {
        const data = await gql(
          `query($id: ID!){ customer(id: $id){ metafield(namespace:"custom", key:"cpf"){ value } } }`,
          { id: `gid://shopify/Customer/${customerId}` },
        );
        const v = data?.customer?.metafield?.value;
        if (v) cpf = String(v).replace(/\D/g, "");
      }

      if (cpf && cpf.length >= 11) {
        // 2) busca todos os customers com esse CPF (metafield OU tag cpf:XXXX)
        const searchQ = `metafields.custom.cpf:${cpf} OR tag:cpf:${cpf}`;
        const found = await gql(
          `query($q:String!){ customers(first:50, query:$q){ edges{ node{ id legacyResourceId createdAt tags email } } } }`,
          { q: searchQ },
        );
        let matches: Array<{ id: string; legacyResourceId: string; createdAt: string; tags: string[]; email: string | null }> =
          (found?.customers?.edges ?? []).map((e: any) => e.node);

        // garante que o customer do pedido está na lista (mesmo que ainda não tenha metafield/tag)
        if (!matches.find((m) => String(m.legacyResourceId) === customerId)) {
          const cur = await gql(
            `query($id:ID!){ customer(id:$id){ id legacyResourceId createdAt tags email } }`,
            { id: `gid://shopify/Customer/${customerId}` },
          );
          if (cur?.customer) matches.push(cur.customer);
        }

        if (matches.length > 0) {
          // canônico = mais antigo
          matches.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          const canonical = matches[0];
          const duplicates = matches.slice(1);

          // 3) garante CPF gravado como metafield e tag no canônico
          const canonTags = new Set(canonical.tags ?? []);
          canonTags.add(`cpf:${cpf}`);
          await gql(
            `mutation($input: CustomerInput!){ customerUpdate(input:$input){ userErrors{ message } } }`,
            {
              input: {
                id: canonical.id,
                tags: Array.from(canonTags),
                metafields: [{ namespace: "custom", key: "cpf", type: "single_line_text_field", value: cpf }],
              },
            },
          );

          // 4) marca duplicados
          for (const dup of duplicates) {
            const dupTags = new Set(dup.tags ?? []);
            dupTags.add("duplicado-cpf");
            dupTags.add(`canonico:${canonical.legacyResourceId}`);
            dupTags.add(`cpf:${cpf}`);
            await gql(
              `mutation($input: CustomerInput!){ customerUpdate(input:$input){ userErrors{ message } } }`,
              {
                input: {
                  id: dup.id,
                  tags: Array.from(dupTags),
                  note: `Cadastro duplicado por CPF ${cpf}. Cliente canônico: ${canonical.legacyResourceId} (${canonical.email ?? "-"}).`,
                  metafields: [{ namespace: "custom", key: "cpf", type: "single_line_text_field", value: cpf }],
                },
              },
            );
          }

          // 5) se o pedido caiu num customer duplicado, deixa nota no pedido
          if (String(canonical.legacyResourceId) !== customerId) {
            const orderUrl = `https://${shopDomain}/admin/api/2025-07/orders/${shopifyOrderId}.json`;
            const existingNote = String(payload?.note ?? "").trim();
            const extra = `[CPF ${cpf}] Cliente canônico: ${canonical.legacyResourceId} (${canonical.email ?? "-"}). Este pedido caiu num customer duplicado (${customerId}).`;
            const newNote = existingNote ? `${existingNote}\n\n${extra}` : extra;
            await fetch(orderUrl, {
              method: "PUT",
              headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": adminToken },
              body: JSON.stringify({ order: { id: Number(shopifyOrderId), note: newNote } }),
            }).catch(() => {});
          }

          console.log(`Dedup CPF ${cpf}: canônico=${canonical.legacyResourceId}, duplicados=${duplicates.map(d => d.legacyResourceId).join(",") || "nenhum"}`);
        }
      }
    }
  } catch (e) {
    console.error("Erro na dedup de CPF no Shopify", e);
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});

