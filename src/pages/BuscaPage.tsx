import { useSearchParams } from "react-router-dom";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, Search } from "lucide-react";

export default function BuscaPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  // Sanitize: strip Shopify query operators/special chars to prevent filter bypass
  const sanitizedQ = q.replace(/["\\]/g, "").replace(/\b(AND|OR|NOT)\b/gi, "").replace(/[:()*-]/g, " ").replace(/\s+/g, " ").trim();
  const { data: products, isLoading } = useShopifyProducts(250, sanitizedQ ? `title:"${sanitizedQ}" AND -tag:oculto` : undefined);

  return (
    <div className="container py-10 md:py-16">
      <div className="text-center mb-12">
        <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">
          {q ? `Resultados para "${q}"` : "Buscar"}
        </h1>
        {!q && (
          <p className="text-muted-foreground">Use a barra de pesquisa para encontrar produtos.</p>
        )}
      </div>

      {!q ? null : isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : products && products.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground text-center mb-8">
            {products.length} {products.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-serif text-2xl mb-2">Nenhum resultado</h3>
          <p className="text-muted-foreground">Tente buscar por outro termo.</p>
        </div>
      )}
    </div>
  );
}
