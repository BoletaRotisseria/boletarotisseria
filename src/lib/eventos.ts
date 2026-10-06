import { supabase } from "@/integrations/supabase/client";

export interface SolicitacaoEventos {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
}

export const FUNCAO_PROPOSTA_EVENTO = "enviar-proposta-evento";

/**
 * Envia a solicitação de orçamento da página de Eventos.
 * O servidor manda a proposta para a caixa fixa da loja
 * (vendas@boletarotisseria.com.br) e uma confirmação ao cliente.
 */
export async function enviarSolicitacaoEventos(
  dados: SolicitacaoEventos
): Promise<void> {
  const chave = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const { error } = await supabase.functions.invoke(FUNCAO_PROPOSTA_EVENTO, {
    body: { ...dados, chave },
  });
  if (error) throw error;
}
