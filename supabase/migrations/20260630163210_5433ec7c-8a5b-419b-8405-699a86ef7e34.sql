
CREATE OR REPLACE FUNCTION public.email_por_cpf(_cpf text)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM public.clientes
  WHERE cpf = regexp_replace(_cpf, '\D', '', 'g')
  LIMIT 1
$$;

GRANT EXECUTE ON FUNCTION public.email_por_cpf(text) TO anon, authenticated;
