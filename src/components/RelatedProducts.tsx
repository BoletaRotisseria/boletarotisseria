import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { ProductCard } from "@/components/ProductCard";
import { findRecommendationRule } from "@/lib/recommendations";
import { Loader2 } from "lucide-react";

interface RelatedProductsProps {
  productTags: string[];
  currentProductId: string;
}

export function RelatedProducts({ productTags, currentProductId }: RelatedProductsProps) {
  const rule = findRecommendationRule(productTags || []);

  // No mapping for this category — render nothing.
  // Scope to Rotisseria so we never recommend empório items (e.g. Paccheri Rigati).
  const tagQuery = rule ? rule.tags.map(t => `tag:${t}`).join(" OR ") : null;
  const query = tagQuery ? `product_type:Rotisseria AND (${tagQuery})` : null;
  const includesMolhos = !!rule?.tags.includes("molhos");

  const { data: products, isLoading } = useShopifyProducts(includesMolhos ? 50 : 8, query || undefined);

  if (!rule) return null;

  const all = (products || []).filter(p => p.node.id !== currentProductId);
  const filtered = includesMolhos ? all : all.slice(0, 4);

  // Recommendations rely on categories that aren't live yet, and nothing matched.
  // Keep the section structurally prepared but hidden.
  if (!isLoading && filtered.length === 0) return null;

  return (
    <section className="border-t border-border/60 mt-16 md:mt-24 pt-12 md:pt-20">
      <div className="container">
        <div className="text-center mb-10 md:mb-14">
          <p className="font-serif tracking-[0.3em] text-xs md:text-sm text-muted-foreground uppercase mb-3">
            Combine com…
          </p>
          <h2 className="font-serif text-2xl md:text-4xl font-normal">
            {rule.title}
          </h2>
        </div>

        {isLoading ? (
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
