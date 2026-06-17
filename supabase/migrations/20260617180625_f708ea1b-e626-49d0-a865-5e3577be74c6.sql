REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_own_profile(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_cliente_complete(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_own_profile(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_cliente_complete(uuid) TO authenticated, service_role;