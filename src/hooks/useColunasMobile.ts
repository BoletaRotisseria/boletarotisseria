import * as React from "react";

const STORAGE_KEY = "boleta-colunas-mobile";

export type ColunasMobile = 1 | 2;

const listeners = new Set<() => void>();

function lerDoNavegador(): ColunasMobile {
  try {
    if (typeof window === "undefined") return 1;
    return window.localStorage.getItem(STORAGE_KEY) === "2" ? 2 : 1;
  } catch {
    return 1;
  }
}

function gravarNoNavegador(valor: ColunasMobile) {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(valor));
  } catch {
    // navegador sem armazenamento: a escolha só vale para a visita atual
  }
}

let atual: ColunasMobile = lerDoNavegador();

export function definirColunasMobile(valor: ColunasMobile) {
  if (valor === atual) return;
  atual = valor;
  gravarNoNavegador(valor);
  listeners.forEach((aviso) => aviso());
}

/**
 * Quantidade de colunas dos produtos no celular (1 ou 2).
 * A escolha é guardada no aparelho e vale para todas as listas de produtos.
 */
export function useColunasMobile() {
  const [colunas, setColunas] = React.useState<ColunasMobile>(atual);

  React.useEffect(() => {
    const aviso = () => setColunas(atual);
    listeners.add(aviso);
    setColunas(atual);
    return () => {
      listeners.delete(aviso);
    };
  }, []);

  return [colunas, definirColunasMobile] as const;
}

/** Classe de colunas no celular; a partir de "sm" cada página define a sua. */
export function classeColunasMobile(colunas: ColunasMobile) {
  return colunas === 2 ? "grid-cols-2" : "grid-cols-1";
}
