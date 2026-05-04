// Curated cross-sell mapping for "COMBINE COM..." section.
// Keys/values are real Shopify tags (lowercase, no accents).
// Scope: only rotisseria-to-rotisseria combinations. Empório/pães-e-torradas
// recommendations will be added later.

export interface RecommendationRule {
  tags: string[];
  title: string;
}

// Order matters: more specific tags first so they win over broad ones.
export const RECOMMENDATIONS: Record<string, RecommendationRule> = {
  "quiches-e-tortas": {
    tags: ["saladas"],
    title: "Combine com saladas",
  },
  "para-compartilhar": {
    // Empanadas in Shopify are tagged "para-compartilhar"
    tags: ["saladas"],
    title: "Combine com saladas",
  },
  "carnes-aves": {
    tags: ["acompanhamentos", "massas", "molhos"],
    title: "Combine com acompanhamentos, massas e molhos",
  },
  vegetariano: {
    tags: ["saladas"],
    title: "Combine com saladas",
  },
  saladas: {
    tags: ["quiches-e-tortas"],
    title: "Combine com quiches e tortas",
  },
  massas: {
    tags: ["molhos"],
    title: "Combine com molhos",
  },
  // Explicitly no recommendations: aperitivos, sobremesas, sopas, molhos,
  // acompanhamentos, pizza, tabuas, sanduiches, antipastos, pates-e-terrines.
};

/**
 * Find the first matching recommendation rule for a product's tags.
 * Iteration order = insertion order, so most specific tags win.
 */
export function findRecommendationRule(productTags: string[]): RecommendationRule | null {
  const normalized = productTags.map(t => t.toLowerCase().trim());
  for (const sourceTag of Object.keys(RECOMMENDATIONS)) {
    if (normalized.includes(sourceTag)) return RECOMMENDATIONS[sourceTag];
  }
  return null;
}
