import { Grid2x2, Rows3 } from "lucide-react";
import { useColunasMobile } from "@/hooks/useColunasMobile";
import { cn } from "@/lib/utils";

/**
 * Controle visível só no celular: mostra os produtos em 1 ou 2 colunas.
 * A escolha fica salva no aparelho e vale para todas as listas.
 */
export function ColunasToggle({ className }: { className?: string }) {
  const [colunas, definir] = useColunasMobile();

  const botao = (ativa: boolean) =>
    cn(
      "flex h-8 w-8 items-center justify-center transition-colors",
      ativa
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-secondary"
    );

  return (
    <div className={cn("md:hidden flex justify-end mb-4", className)}>
      <div
        role="group"
        aria-label="Quantidade de colunas"
        className="inline-flex items-center border border-border bg-background"
      >
        <button
          type="button"
          onClick={() => definir(1)}
          aria-label="Ver produtos em uma coluna"
          aria-pressed={colunas === 1}
          className={botao(colunas === 1)}
        >
          <Rows3 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => definir(2)}
          aria-label="Ver produtos em duas colunas"
          aria-pressed={colunas === 2}
          className={botao(colunas === 2)}
        >
          <Grid2x2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
