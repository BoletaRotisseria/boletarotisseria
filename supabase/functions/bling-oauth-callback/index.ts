import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const BLING_TOKEN_URL = "https://www.bling.com.br/Api/v3/oauth/token";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return new Response(`<h1>Falha ao conectar Bling</h1><pre>${error}</pre>`, {
      status: 400, headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
  if (!code) {
    return new Response(`<h1>Faltou ?code</h1>`, {
      status: 400, headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const clientId = Deno.env.get("BLING_CLIENT_ID");
  const clientSecret = Deno.env.get("BLING_CLIENT_SECRET");
  if (!clientId || !clientSecret) {
    return new Response("BLING_CLIENT_ID/SECRET ausentes", { status: 500 });
  }

  const redirectUri = `${url.origin}${url.pathname}`;
  const basic = btoa(`${clientId}:${clientSecret}`);

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const tokenRes = await fetch(BLING_TOKEN_URL, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
    },
    body,
  });

  const tokenJson = await tokenRes.json().catch(() => ({}));
  if (!tokenRes.ok || !tokenJson.access_token) {
    console.error("Bling token exchange failed", tokenRes.status, tokenJson);
    return new Response(
      `<h1>Falha ao obter token</h1><pre>${JSON.stringify(tokenJson, null, 2)}</pre>`,
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const expiresAt = new Date(Date.now() + (tokenJson.expires_in ?? 21600) * 1000).toISOString();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { error: upsertErr } = await supabase
    .from("bling_tokens")
    .upsert({
      id: true,
      access_token: tokenJson.access_token,
      refresh_token: tokenJson.refresh_token,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    });

  if (upsertErr) {
    console.error("Failed to save bling tokens", upsertErr);
    return new Response(`Erro ao salvar tokens: ${upsertErr.message}`, { status: 500 });
  }

  return new Response(
    `<!doctype html><meta charset="utf-8"><title>Bling conectado</title>
     <body style="font-family:system-ui;padding:48px;text-align:center">
       <h1>✅ Bling conectado</h1>
       <p>Pode fechar esta aba. A integração já está ativa.</p>
     </body>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
});
