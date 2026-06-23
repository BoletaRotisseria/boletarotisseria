
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Tokens do Bling (1 linha)
CREATE TABLE public.bling_tokens (
  id boolean PRIMARY KEY DEFAULT true,
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  expires_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT bling_tokens_singleton CHECK (id = true)
);

GRANT ALL ON public.bling_tokens TO service_role;
ALTER TABLE public.bling_tokens ENABLE ROW LEVEL SECURITY;
-- Nenhuma policy: nada acessível via anon/authenticated.

-- Fila de jobs de sincronização
CREATE TABLE public.bling_sync_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_order_id text NOT NULL,
  shopify_order_number text NOT NULL,
  observacoes_text text NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending | done | failed
  attempts int NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  last_error text,
  bling_pedido_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (shopify_order_id)
);

CREATE INDEX bling_sync_jobs_status_next_attempt_idx
  ON public.bling_sync_jobs (status, next_attempt_at);

GRANT ALL ON public.bling_sync_jobs TO service_role;
ALTER TABLE public.bling_sync_jobs ENABLE ROW LEVEL SECURITY;
-- Nenhuma policy: nada acessível via anon/authenticated.

CREATE OR REPLACE FUNCTION public.bling_sync_jobs_touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER bling_sync_jobs_updated_at
  BEFORE UPDATE ON public.bling_sync_jobs
  FOR EACH ROW EXECUTE FUNCTION public.bling_sync_jobs_touch_updated_at();
