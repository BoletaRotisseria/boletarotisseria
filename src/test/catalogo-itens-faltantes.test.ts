import { describe, expect, it } from "vitest";
import { CATALOGO_ATIVO } from "@/lib/catalogoAtivo";
import { handlesDaCategoria } from "@/lib/categoriasRotisseria";

describe("Itens solicitados para publicação", () => {
  it.each([
    ["roastbeef", "carne-peixe-e-frango"],
    ["roastbeef-to-go", "carne-peixe-e-frango"],
    ["kit-carpaccio", "carne-peixe-e-frango"],
    ["brownie-no-pote-300g", "sobremesas"],
    ["melaco-de-cana-adicional", "aperitivos"],
  ])("includes %s in the active catalog and %s category", (handle, category) => {
    expect(CATALOGO_ATIVO.has(handle)).toBe(true);
    expect(handlesDaCategoria(category)).toContain(handle);
  });
});