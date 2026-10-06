import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke } },
}));

import { enviarSolicitacaoEventos, FUNCAO_PROPOSTA_EVENTO } from "@/lib/eventos";

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
  it("envia os dados do formulário para o servidor, sem destino escolhido pelo cliente", async () => {
    await enviarSolicitacaoEventos(solicitacao);
    const [nome, opts] = invoke.mock.calls[0];
    expect(nome).toBe(FUNCAO_PROPOSTA_EVENTO);
    expect(opts.body.email).toBe("ana@exemplo.com.br");
    expect(opts.body.recipientEmail).toBeUndefined();
    expect(opts.body.chave).toBeTruthy();
  });

  it("avisa erro quando o envio falha", async () => {
    invoke.mockResolvedValueOnce({ data: null, error: new Error("falhou") });
    await expect(enviarSolicitacaoEventos(solicitacao)).rejects.toThrow("falhou");
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
