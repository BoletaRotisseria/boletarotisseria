// Curated cross-sell mapping for "COMBINE COM..." section.
// Two layers:
// 1. Product-specific overrides (by Shopify product ID) — exact pairings.
// 2. Tag-based fallback rules — broader category combinations.
// Scope: only rotisseria-to-rotisseria. Empório/pães-e-torradas excluded.

export interface RecommendationRule {
  tags: string[];
  title: string;
}

export interface SpecificRecommendation {
  productIds: string[];
  title: string;
}

// Exact product pairings — highest priority.
export const SPECIFIC_RECOMMENDATIONS: Record<string, SpecificRecommendation> = {
  // Patê de Foie → Geleia de Frutas Vermelhas
  "gid://shopify/Product/8404950155309": {
    productIds: ["gid://shopify/Product/8404950220845"],
    title: "Combine com Geleia de Frutas Vermelhas",
  },
  // Terrine de Chèvre → Molho Pesto
  "gid://shopify/Product/8404950286381": {
    productIds: ["gid://shopify/Product/8404951695405"],
    title: "Combine com Molho Pesto",
  },
  // Queijo Brie Folhado → Mel Mini + Geleia de Damasco
  "gid://shopify/Product/8404949925933": {
    productIds: [
      "gid://shopify/Product/8404949991469",
      "gid://shopify/Product/8404950057005",
    ],
    title: "Combine com Mel Mini ou Geleia de Damasco",
  },
  // Capeletti de Carne Mini → Capeletti in Brodo (preparação em brodo)
  "gid://shopify/Product/8404951236653": {
    productIds: ["gid://shopify/Product/8404951269421"],
    title: "Combine com Brodo",
  },
  // Grand Gateau de Chocolate → Creme Anglaise
  "gid://shopify/Product/8404952645677": {
    productIds: ["gid://shopify/Product/8404952678445"],
    title: "Combine com Creme Anglaise",
  },
  // Dadinho de Tapioca → Melaço de Cana
  "gid://shopify/Product/8404949467181": {
    productIds: ["gid://shopify/Product/8404949893165"],
    title: "Combine com Melaço de Cana",
  },
};

// Tag-based fallback. Order matters: more specific tags first.
export const RECOMMENDATIONS: Record<string, RecommendationRule> = {
  "quiches-e-tortas": {
    tags: ["saladas"],
    title: "Combine com saladas",
  },
  "para-compartilhar": {
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
};

export function findSpecificRecommendation(productId: string): SpecificRecommendation | null {
  return SPECIFIC_RECOMMENDATIONS[productId] || null;
}

export function findRecommendationRule(productTags: string[]): RecommendationRule | null {
  const normalized = productTags.map(t => t.toLowerCase().trim());
  for (const sourceTag of Object.keys(RECOMMENDATIONS)) {
    if (normalized.includes(sourceTag)) return RECOMMENDATIONS[sourceTag];
  }
  return null;
}
