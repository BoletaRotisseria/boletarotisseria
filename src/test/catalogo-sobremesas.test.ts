import { describe, expect, it } from "vitest";
import { CATALOGO_ATIVO } from "@/lib/catalogoAtivo";
import { handlesDaCategoria } from "@/lib/categoriasRotisseria";

describe("Grand Gateau de Chocolate", () => {
  it("is included in the active catalog", () => {
    expect(CATALOGO_ATIVO.has("grand-gateau-de-chocolate")).toBe(true);
  });

  it("is included in Sobremesas", () => {
    expect(handlesDaCategoria("sobremesas")).toContain("grand-gateau-de-chocolate");
  });
});