import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

Object.defineProperty(window, "localStorage", {
  writable: true,
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
});

import CriarContaPage from "./CriarContaPage";

const fromMock = vi.fn();
const maybeSingleMock = vi.fn();
const signUpMock = vi.fn();
const invokeMock = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: fromMock,
    auth: { signUp: signUpMock },
    functions: { invoke: invokeMock },
  },
}));

describe("CriarContaPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fromMock.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: maybeSingleMock,
    });
  });

  it("shows existing account alert instead of redirecting when email is already registered", async () => {
    maybeSingleMock
      .mockResolvedValueOnce({ data: { id: "existing-user" } }) // email exists
      .mockResolvedValueOnce({ data: null }); // CPF check never reached

    render(
      <BrowserRouter>
        <CriarContaPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Seu nome completo"), {
      target: { value: "Roberto Teste" },
    });
    fireEvent.change(screen.getByPlaceholderText("000.000.000-00"), {
      target: { value: "529.982.247-25" },
    });
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "roberto@estacaosaopaulo.com.br" },
    });
    fireEvent.change(screen.getByPlaceholderText("(11) 99999-9999"), {
      target: { value: "(11) 99999-9999" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mínimo 8 caracteres"), {
      target: { value: "Senha1234!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repita a senha"), {
      target: { value: "Senha1234!" },
    });
    fireEvent.click(screen.getByLabelText(/Li e concordo/));

    fireEvent.click(screen.getByRole("button", { name: /Criar Conta/ }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/Já existe uma conta com esse e-mail/);
    });

    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Esqueci a senha" })).toBeInTheDocument();
    expect(signUpMock).not.toHaveBeenCalled();
  });
});
