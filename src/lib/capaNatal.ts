// Capa de Natal: data em que a foto de Natal sai do ar e a capa original volta sozinha.
// A checagem roda no navegador de quem visita o site, então a troca acontece sem ninguém mexer no código.
export const CAPA_NATAL_VOLTA_EM = "2026-12-26T00:00:00-03:00";

export function capaNatalAtiva(): boolean {
  const fim = new Date(CAPA_NATAL_VOLTA_EM).getTime();
  if (Number.isNaN(fim)) return false;
  return Date.now() < fim;
}
