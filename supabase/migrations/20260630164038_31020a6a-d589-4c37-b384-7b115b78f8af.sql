
CREATE OR REPLACE FUNCTION public.is_cliente_complete(cliente_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.clientes
    WHERE id = cliente_id
      AND nome_completo <> ''
      AND cpf <> ''
      AND telefone <> ''
  )
$$;
