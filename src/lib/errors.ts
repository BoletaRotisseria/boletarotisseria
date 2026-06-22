/**
 * Maps raw Supabase/PostgREST/GoTrue errors to user-safe, localized messages.
 * Never expose raw error.message to the UI — log the original to the console
 * for debugging and return a generic friendly string.
 */
export function getSafeErrorMessage(error: unknown, fallback = "Algo deu errado. Tente novamente."): string {
  // Always log full error server/console-side for debugging
  if (error) console.error("[handled error]", error);

  const raw = (error && typeof error === "object" && "message" in error ? String((error as { message: unknown }).message) : "").toLowerCase();

  if (!raw) return fallback;

  // Auth errors
  if (raw.includes("invalid login credentials") || raw.includes("invalid_credentials")) {
    return "E-mail ou senha incorretos.";
  }
  if (raw.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar.";
  }
  if (raw.includes("user already registered") || raw.includes("already registered") || raw.includes("user_already_exists")) {
    return "Este e-mail já está cadastrado.";
  }
  if (raw.includes("password should be") || raw.includes("weak password")) {
    return "A senha não atende aos requisitos mínimos.";
  }
  if (raw.includes("rate limit") || raw.includes("too many requests")) {
    return "Muitas tentativas. Aguarde alguns instantes e tente novamente.";
  }
  if (raw.includes("token") && (raw.includes("expired") || raw.includes("invalid"))) {
    return "Link expirado ou inválido. Solicite um novo.";
  }

  // DB constraint errors — never leak table/constraint names
  if (raw.includes("duplicate key") || raw.includes("unique constraint") || raw.includes("already exists")) {
    if (raw.includes("cpf")) return "Este CPF já está cadastrado.";
    if (raw.includes("email")) return "Este e-mail já está cadastrado.";
    if (raw.includes("telefone") || raw.includes("phone")) return "Este telefone já está cadastrado.";
    return "Este registro já existe.";
  }
  if (raw.includes("violates") || raw.includes("constraint")) {
    return "Dados inválidos. Verifique as informações e tente novamente.";
  }
  if (raw.includes("network") || raw.includes("fetch")) {
    return "Falha de conexão. Verifique sua internet e tente novamente.";
  }

  return fallback;
}
