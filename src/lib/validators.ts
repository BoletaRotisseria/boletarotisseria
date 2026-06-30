import { z } from "zod";

// CPF validation
function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cleaned[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  return remainder === parseInt(cleaned[10]);
}

// Mask helpers
export function maskCPF(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function maskCEP(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function maskDate(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2");
}

// Zod schemas
export const cadastroSchema = z.object({
  nome_completo: z
    .string()
    .trim()
    .min(1, "Informe seu nome completo.")
    .refine((v) => v.trim().split(/\s+/).length >= 2, "Informe nome e sobrenome."),
  cpf: z
    .string()
    .min(1, "Informe seu CPF.")
    .refine((v) => isValidCPF(v), "CPF inválido."),
  email: z.string().trim().email("Informe um e-mail válido."),
  telefone: z
    .string()
    .min(1, "Informe seu telefone.")
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Telefone inválido. Inclua DDD + número."),
  data_nascimento: z.string().optional(),
  cep: z
    .string()
    .min(1, "Informe o CEP.")
    .refine((v) => v.replace(/\D/g, "").length === 8, "CEP inválido."),
  estado: z
    .string()
    .min(1, "Informe o estado.")
    .refine((v) => v.length === 2, "Informe a UF com 2 letras."),
  cidade: z.string().trim().min(1, "Informe a cidade."),
  bairro: z.string().trim().min(1, "Informe o bairro."),
  rua: z.string().trim().min(1, "Informe a rua."),
  numero: z.string().trim().min(1, "Informe o número."),
  complemento: z.string().optional(),
  senha: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
  confirmar_senha: z.string(),
  termos: z.literal(true, { errorMap: () => ({ message: "Você deve aceitar os termos." }) }),
}).refine((d) => d.senha === d.confirmar_senha, {
  message: "As senhas não coincidem.",
  path: ["confirmar_senha"],
});

export type CadastroFormData = z.infer<typeof cadastroSchema>;

export const completarCadastroSchema = z.object({
  nome_completo: z
    .string()
    .trim()
    .min(1, "Informe seu nome completo.")
    .refine((v) => v.trim().split(/\s+/).length >= 2, "Informe nome e sobrenome."),
  cpf: z
    .string()
    .min(1, "Informe seu CPF.")
    .refine((v) => isValidCPF(v), "CPF inválido."),
  telefone: z
    .string()
    .min(1, "Informe seu telefone.")
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Telefone inválido. Inclua DDD + número."),
});

export type CompletarCadastroFormData = z.infer<typeof completarCadastroSchema>;

// Convert dd/mm/yyyy to yyyy-mm-dd for DB
export function dateBrToIso(dateBr: string): string {
  const [d, m, y] = dateBr.split("/");
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

// Convert yyyy-mm-dd to dd/mm/yyyy for display
export function dateIsoToBr(dateIso: string): string {
  const [y, m, d] = dateIso.split("-");
  return `${d}/${m}/${y}`;
}
