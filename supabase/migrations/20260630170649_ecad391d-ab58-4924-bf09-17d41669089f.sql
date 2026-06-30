CREATE OR REPLACE FUNCTION public.cliente_existe(_email text, _telefone text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.clientes
    WHERE (length(coalesce(_email,'')) > 0 AND lower(email) = lower(_email))
       OR (length(coalesce(_telefone,'')) > 0 AND telefone = regexp_replace(_telefone, '\D', '', 'g'))
  )
$$;

GRANT EXECUTE ON FUNCTION public.cliente_existe(text, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.upsert_cliente_servidor(
  _id uuid,
  _nome text,
  _cpf text,
  _email text,
  _telefone text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.clientes (id, nome_completo, cpf, email, telefone)
  VALUES (_id, coalesce(_nome,''), coalesce(_cpf,''), coalesce(_email,''), coalesce(_telefone,''))
  ON CONFLICT (id) DO UPDATE SET
    nome_completo = CASE WHEN length(EXCLUDED.nome_completo) > 0 THEN EXCLUDED.nome_completo ELSE public.clientes.nome_completo END,
    cpf = CASE WHEN length(EXCLUDED.cpf) > 0 THEN EXCLUDED.cpf ELSE public.clientes.cpf END,
    email = CASE WHEN length(EXCLUDED.email) > 0 THEN EXCLUDED.email ELSE public.clientes.email END,
    telefone = CASE WHEN length(EXCLUDED.telefone) > 0 THEN EXCLUDED.telefone ELSE public.clientes.telefone END,
    atualizado_em = now();
END;
$$;