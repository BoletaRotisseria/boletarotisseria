
DROP FUNCTION IF EXISTS public.cliente_existe(text, text) CASCADE;
DROP FUNCTION IF EXISTS public.email_por_cpf(text) CASCADE;
DROP FUNCTION IF EXISTS public.upsert_cliente_servidor(uuid, text, text, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.is_cliente_complete(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.is_own_profile(uuid) CASCADE;
DROP TABLE IF EXISTS public.clientes CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
