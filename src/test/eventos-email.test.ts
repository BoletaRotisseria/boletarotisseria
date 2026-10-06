import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke } },
}));

import {
  enviarSolicitacaoEventos,
  TEMPLATE_PROPOSTA_LOJA,
  TEMPLATE_CONFIRMACAO_CLIENTE,
} from "@/lib/eventos";

const solicitacao = {
  nome: "Ana Souza",
  email: "ana@exemplo.com.br",
  telefone: "(11) 99999-0000",
  mensagem: "Jantar para 12 pessoas em 20/11, em Pinheiros.",
};

beforeEach(() => {
  invoke.mockReset();
  invoke.mockResolvedValue({ data: null, error: null });
});

describe("solicitações de orçamento da página de Eventos", () => {
  it("envia a proposta para a caixa fixa da loja, sem destino vindo do formulário", async () => {
    await enviarSolicitacaoEventos(solicitacao);

    const proposta = invoke.mock.calls[0];
    expect(proposta[0]).toBe("send-transactional-email");
    expect(proposta[1].body.templateName).toBe(TEMPLATE_PROPOSTA_LOJA);
    expect(proposta[1].body.recipientEmail).toBeUndefined();
    expect(proposta[1].body.templateData.mensagem).toBe(solicitacao.mensagem);
  });

  it("confirma ao cliente no e-mail que ele informou", async () => {
    await enviarSolicitacaoEventos(solicitacao);

    const confirmacao = invoke.mock.calls[1];
    expect(confirmacao[0]).toBe("send-transactional-email");
    expect(confirmacao[1].body.templateName).toBe(TEMPLATE_CONFIRMACAO_CLIENTE);
    expect(confirmacao[1].body.recipientEmail).toBe("ana@exemplo.com.br");
  });

  it("usa a mesma chave de evento nas duas cópias, para retries não duplicarem", async () => {
    await enviarSolicitacaoEventos(solicitacao);

    const [proposta, confirmacao] = invoke.mock.calls;
    const sufixo = (chave: string) =>
      chave.replace(/^eventos-(proposta|confirmacao)-/, "");
    expect(sufixo(proposta[1].body.idempotencyKey)).toBe(
      sufixo(confirmacao[1].body.idempotencyKey)
    );
  });

  it("não manda confirmação ao cliente quando a loja não recebeu", async () => {
    invoke.mockResolvedValueOnce({ data: null, error: new Error("falhou") });

    await expect(enviarSolicitacaoEventos(solicitacao)).rejects.toThrow(
      "falhou"
    );
    expect(invoke).toHaveBeenCalledTimes(1);
  });

  it("a proposta da loja tem como destino vendas@boletarotisseria.com.br", () => {
    const fonte = readFileSync(
      path.resolve(
        process.cwd(),
        "supabase/functions/_shared/transactional-email-templates/evento-proposta-loja.tsx"
      ),
      "utf8"
    );
    expect(fonte).toContain("vendas@boletarotisseria.com.br");
  });
});
