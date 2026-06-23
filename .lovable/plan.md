## Objetivo

Quando um pedido é criado na Shopify, atualizar automaticamente o pedido correspondente no Bling (localizado pelo `numeroLoja` = número do pedido Shopify) preenchendo `observacoes` e `observacoesInternas` com Método de Recebimento, Data, Horário e Local/Endereço.

## Arquitetura

```text
Shopify (orders/create webhook)
        │
        ▼
Edge Function: shopify-order-webhook
  • valida HMAC do webhook Shopify
  • extrai note_attributes (Método, Data, Horário, Local)
  • insere job em tabela bling_sync_jobs (status=pending, attempts=0)
        │
        ▼
Edge Function: bling-sync-worker (cron a cada 2 min)
  • pega jobs pending/retry com next_attempt_at <= now()
  • garante access_token válido (refresh se expirado)
  • GET /pedidos/vendas?numeroLoja={shopify_order_number}
  • se achou → PATCH /pedidos/vendas/{id} com observacoes + observacoesInternas → status=done
  • se não achou → attempts++, next_attempt_at = now()+5min, max 12 tentativas (1h)
        │
        ▼
Edge Function: bling-oauth-callback
  • recebe ?code=... do Bling após o admin autorizar
  • troca por access_token + refresh_token
  • salva em tabela bling_tokens (linha única)
```

## Bling API v3 — o que você precisa fazer (uma vez)

1. Entrar em https://www.bling.com.br/ → Cadastro → Meus Aplicativos → "Criar novo aplicativo".
2. Tipo: **API v3**.
3. Link de redirecionamento (Callback URL): vou te passar a URL exata da edge function `bling-oauth-callback` depois que ela existir.
4. Escopos: marcar **Pedidos de Vendas (Leitura e Escrita)**.
5. Após criar, o Bling mostra **Client ID** e **Client Secret** — vou pedir via formulário seguro.
6. Você abre a URL de autorização que eu vou gerar (`/connect-bling`) **uma vez**, loga e autoriza. A partir daí a integração refresca o token sozinha.

## Banco (Lovable Cloud)

Tabelas novas:

- `bling_tokens` — 1 linha: `access_token`, `refresh_token`, `expires_at`. RLS bloqueada (só service_role).
- `bling_sync_jobs` — `id`, `shopify_order_number`, `shopify_order_id`, `observacoes_text`, `status` (pending/done/failed), `attempts`, `next_attempt_at`, `last_error`, timestamps. RLS bloqueada.

## Edge Functions

1. **`bling-oauth-callback`** — público, sem JWT. Troca `code` por tokens e salva.
2. **`shopify-order-webhook`** — público, sem JWT, valida HMAC com `SHOPIFY_WEBHOOK_SECRET`. Lê `note_attributes` do pedido e enfileira o job.
3. **`bling-sync-worker`** — agendado via `pg_cron` a cada 2 min. Processa jobs pending. Faz refresh de token quando faltar < 60s pra expirar. Busca por `numeroLoja`, dá PATCH em `observacoes` e `observacoesInternas`. Retry com backoff (5 min, até 12 tentativas = 1h total).

## Webhook Shopify

Após deploy, vou te passar:
- URL: `https://<projeto>.supabase.co/functions/v1/shopify-order-webhook`
- Evento: `Order creation`
- Format: JSON
- Webhook signing secret: você adiciona no app (já configurável) → eu uso pra validar HMAC.

Você cadastra em **Settings → Notifications → Webhooks** no admin da Shopify.

## Secrets necessários

- `BLING_CLIENT_ID` (você fornece)
- `BLING_CLIENT_SECRET` (você fornece)
- `SHOPIFY_WEBHOOK_SECRET` (você fornece — copiado da Shopify ao criar o webhook)

## Texto gravado no Bling

```
Método de Recebimento: Retirada
Data de Entrega/Retirada: 18/06/2026
Horário de Entrega/Retirada: 13h às 17h30
Local: Retirada na Boleta Rotisseria
```

Mesmo texto vai em `observacoes` e `observacoesInternas`.

## Próximos passos depois que aprovar

1. Crio as tabelas + edge functions + página `/connect-bling`.
2. Te peço os 3 secrets via formulário seguro.
3. Te passo a Callback URL pra colar no app do Bling.
4. Te passo a URL do webhook Shopify pra cadastrar.
5. Você clica em "Conectar Bling" uma vez → pronto, integração ativa.
