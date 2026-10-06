import { supabase } from "@/integrations/supabase/client";

export interface SolicitacaoEventos {
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
}

export const TEMPLATE_PROPOSTA_LOJA = "evento-proposta-loja";
export const TEMPLATE_CONFIRMACAO_CLIENTE = "evento-confirmacao-cliente";

/**
 * Envia a solicitação de orçamento da página de Eventos.
 * A cópia para a loja tem destino fixo no template (vendas@boletarotisseria.com.br),
 * então o endereço de destino não pode ser alterado por quem preenche o formulário.
 */
export async function enviarSolicitacaoEventos(
  dados: SolicitacaoEventos
): Promise<void> {
  const carimbo = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const enviadoEm = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  const { error: erroLoja } = await supabase.functions.invoke(
    "send-transactional-email",
    {
      body: {
        templateName: TEMPLATE_PROPOSTA_LOJA,
        idempotencyKey: `eventos-proposta-${carimbo}`,
        templateData: { ...dados, enviadoEm },
      },
    }
  );

  if (erroLoja) throw erroLoja;

  // A confirmação ao cliente é secundária: se falhar, a loja já recebeu a solicitação.
  await supabase.functions.invoke("send-transactional-email", {
    body: {
      templateName: TEMPLATE_CONFIRMACAO_CLIENTE,
      recipientEmail: dados.email,
      idempotencyKey: `eventos-confirmacao-${carimbo}`,
      templateData: {
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        mensagem: dados.mensagem,
      },
    },
  });
}
