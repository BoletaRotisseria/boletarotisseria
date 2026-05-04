// Curated cross-sell mapping for "COMBINE COM..." section.
// Keys/values are real Shopify tags (lowercase, no accents).

export interface RecommendationRule {
  tags: string[];
  title: string;
}

// Categories that aren't fully launched on the website yet.
// Recommendations referencing only these tags stay hidden until products exist.
export const PENDING_CATEGORIES = ["paes-e-torradas", "emporio"];

// Order matters: more specific tags first so they win over broad ones (e.g. aperitivos).
export const RECOMMENDATIONS: Record<string, RecommendationRule> = {
  "pates-e-terrines": {
    tags: ["paes-e-torradas"],
    title: "Combine com pães e torradas",
  },
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
  pizza: {
    tags: ["molhos", "emporio"],
    title: "Combine com molhos e empório",
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
  tabuas: {
    tags: ["paes-e-torradas"],
    title: "Combine com pães e torradas",
  },
  sanduiches: {
    tags: ["emporio"],
    title: "Combine com mostardas e complementos do empório",
  },
  antipastos: {
    tags: ["paes-e-torradas"],
    title: "Combine com pães e torradas",
  },
  // Explicitly no recommendations: aperitivos, sobremesas, sopas, molhos,
  // paes-e-torradas, acompanhamentos, emporio (target-only categories).
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
