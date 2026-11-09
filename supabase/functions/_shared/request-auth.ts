import { createClient } from "npm:@supabase/supabase-js@2";
import { isServiceCredential } from "./security-policy.ts";

export async function authenticatedUser(req: Request) {
  const header = req.headers.get("Authorization");
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_ANON_KEY");
  if (!header?.startsWith("Bearer ") || !url || !key) return null;
  const client = createClient(url, key, { global: { headers: { Authorization: header } } });
  const { data, error } = await client.auth.getUser(header.slice(7));
  return error ? null : data.user;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return false;
  const client = createClient(url, key);
  const { data, error } = await client.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  return !error && data?.role === "admin";
}

export async function authorizedOperator(req: Request): Promise<boolean> {
  if (isServiceCredential(req.headers.get("Authorization"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"))) return true;
  const user = await authenticatedUser(req);
  return !!user && await isAdmin(user.id);
}