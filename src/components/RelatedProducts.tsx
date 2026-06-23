import { useQuery } from "@tanstack/react-query";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { ProductCard } from "@/components/ProductCard";
import { findRecommendationRule, findSpecificRecommendation } from "@/lib/recommendations";
import { storefrontApiRequest } from "@/lib/shopify";
import { Loader2 } from "lucide-react";

interface RelatedProductsProps {
  productTags: string[];
  currentProductId: string;
}

const NODES_BY_IDS_QUERY = `
  query GetNodes($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        description
        handle
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 5) { edges { node { url altText } } }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price { amount currencyCode }
              availableForSale
              selectedOptions { name value }
            }
          }
        }
        options { name values }
      }
    }
  }
`;

export function RelatedProducts({ productTags, currentProductId }: RelatedProductsProps) {
  const specific = findSpecificRecommendation(currentProductId);
  const rule = !specific ? findRecommendationRule(productTags || []) : null;

  // Specific pairing — fetch by IDs
  const { data: specificProducts, isLoading: isLoadingSpecific } = useQuery({
    queryKey: ['specific-recs', currentProductId],
    queryFn: async () => {
      const data = await storefrontApiRequest(NODES_BY_IDS_QUERY, { ids: specific!.productIds });
      const nodes = (data?.data?.nodes || []).filter(Boolean);
      return nodes.map((node: { id: string }) => ({ node }));
    },
    enabled: !!specific,
  });

  // Tag-based fallback
  const tagQuery = rule ? rule.tags.map(t => `tag:${t}`).join(" OR ") : null;
  const query = tagQuery ? `product_type:Rotisseria AND (${tagQuery}) AND -tag:oculto` : null;
  const includesMolhos = !!rule?.tags.includes("molhos");
  const { data: tagProducts, isLoading: isLoadingTag } = useShopifyProducts(
    includesMolhos ? 50 : 8,
    query || undefined,
  );

  if (specific) {
    if (isLoadingSpecific) {
      return (
        <section className="border-t border-border/60 mt-16 md:mt-24 pt-12 md:pt-20">
          <div className="container flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </section>
      );
    }
    const list = (specificProducts || []).filter((p: { node: { id: string } }) => p.node.id !== currentProductId);
    if (list.length === 0) return null;
    return (
      <section className="border-t border-border/60 mt-16 md:mt-24 pt-12 md:pt-20">
        <div className="container">
          <div className="text-center mb-10 md:mb-14">
            <p className="font-serif tracking-[0.3em] text-xs md:text-sm text-muted-foreground uppercase mb-3">
              Combine com…
            </p>
            <h2 className="font-courier lowercase text-2xl md:text-4xl font-normal">{specific.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 justify-center">
            {list.map((product: { node: { id: string } }) => (
              <ProductCard key={product.node.id} product={product as Parameters<typeof ProductCard>[0]['product']} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!rule) return null;

  const all = (tagProducts || []).filter(p => p.node.id !== currentProductId);
  const filtered = includesMolhos ? all : all.slice(0, 4);
  if (!isLoadingTag && filtered.length === 0) return null;

  return (
    <section className="border-t border-border/60 mt-16 md:mt-24 pt-12 md:pt-20">
      <div className="container">
        <div className="text-center mb-10 md:mb-14">
          <p className="font-serif tracking-[0.3em] text-xs md:text-sm text-muted-foreground uppercase mb-3">
            Combine com…
          </p>
          <h2 className="font-serif text-2xl md:text-4xl font-normal">{rule.title}</h2>
        </div>

        {isLoadingTag ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {filtered.map(product => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
