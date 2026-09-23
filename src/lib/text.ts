export function sentenceCase(value: string): string {
  const normalized = value.trim().toLocaleLowerCase("pt-BR");
  if (!normalized) return normalized;

  return normalized.charAt(0).toLocaleUpperCase("pt-BR") + normalized.slice(1);
}