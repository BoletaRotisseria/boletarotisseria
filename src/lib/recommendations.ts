// Curated cross-sell mapping for "COMBINE COM..." section.
// Keys and values are Shopify product tags (lowercase, no accents).

export interface RecommendationRule {
  // Tags to query for recommendations (OR'd together in Shopify search)
  tags: string[];
  // Section heading shown to the user
  title: string;
  // If true, category isn't live yet — section stays hidden until products exist
  pendingCategories?: boolean;
}

// Categories not yet launched on the site. Recommendations referencing only
// these tags will be queried but the section gracefully hides if empty.
export const PENDING_CATEGORIES = ["paes-e-torradas", "emporio"];

// Source category tag -> recommendation rule
export const RECOMMENDATIONS: Record<string, RecommendationRule> = {
  antipastos: {
    tags: ["paes-e-torradas"],
    title: "Combine com pães e torradas",
    pendingCategories: true,
  },
  "pates-e-terrines": {
    tags: ["paes-e-torradas"],
    title: "Combine com pães e torradas",
    pendingCategories: true,
  },
  saladas: {
    tags: ["quiches-e-tortas"],
    title: "Combine com quiches e tortas",
  },
  "quiches-e-tortas": {
    tags: ["saladas"],
    title: "Combine com saladas",
  },
  vegetariano: {
    tags: ["saladas"],
    title: "Combine com saladas",
  },
  massas: {
    tags: ["molhos"],
    title: "Combine com molhos",
  },
  carnes: {
    tags: ["acompanhamentos", "massas", "molhos"],
    title: "Combine com acompanhamentos, massas e molhos",
  },
  pizza: {
    tags: ["molhos", "emporio"],
    title: "Combine com molhos e empório",
    pendingCategories: true,
  },
  empanadas: {
    tags: ["saladas"],
    title: "Combine com saladas",
  },
  sanduiches: {
    tags: ["emporio"],
    title: "Combine com mostardas e complementos do empório",
    pendingCategories: true,
  },
  tabuas: {
    tags: ["paes-e-torradas"],
    title: "Combine com pães e torradas",
    pendingCategories: true,
  },
  // Explicitly no recommendations: aperitivos, sobremesas
};

/**
 * Given a product's tags, find the first matching recommendation rule.
 */
export function findRecommendationRule(productTags: string[]): RecommendationRule | null {
  const normalized = productTags.map(t => t.toLowerCase().trim());
  for (const sourceTag of Object.keys(RECOMMENDATIONS)) {
    if (normalized.includes(sourceTag)) return RECOMMENDATIONS[sourceTag];
  }
  return null;
}
