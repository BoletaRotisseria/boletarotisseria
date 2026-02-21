
-- Create clientes table
CREATE TABLE public.clientes (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo text NOT NULL DEFAULT '',
  cpf text NOT NULL DEFAULT '' UNIQUE,
  email text NOT NULL DEFAULT '',
  telefone text NOT NULL DEFAULT '',
  data_nascimento date,
  cep text NOT NULL DEFAULT '',
  estado text NOT NULL DEFAULT '',
  cidade text NOT NULL DEFAULT '',
  bairro text NOT NULL DEFAULT '',
  rua text NOT NULL DEFAULT '',
  numero text NOT NULL DEFAULT '',
  complemento text,
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "clientes_select_own" ON public.clientes
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "clientes_insert_own" ON public.clientes
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "clientes_update_own" ON public.clientes
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Function to check if cliente profile is complete
CREATE OR REPLACE FUNCTION public.is_cliente_complete(cliente_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.clientes
    WHERE id = cliente_id
      AND nome_completo <> ''
      AND cpf <> ''
      AND telefone <> ''
      AND cep <> ''
      AND estado <> ''
      AND cidade <> ''
      AND bairro <> ''
      AND rua <> ''
      AND numero <> ''
      AND data_nascimento IS NOT NULL
  )
$$;
