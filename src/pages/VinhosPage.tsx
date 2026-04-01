import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, Wine } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const wineCategories = [
  { label: "Todos", tag: "" },
  { label: "Branco", tag: "branco" },
  { label: "Tinto", tag: "tinto" },
  { label: "Rosé", tag: "rose" },
  { label: "Espumante", tag: "espumante" },
  { label: "Champagne", tag: "champagne" },
];

export default function VinhosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get("categoria") || "";

  const setActiveTag = (tag: string) => {
    if (tag) {
      setSearchParams({ categoria: tag });
    } else {
      setSearchParams({});
    }
  };

  const query = activeTag
    ? `product_type:Vinhos AND tag:${activeTag}`
    : "product_type:Vinhos";
  const { data: products, isLoading } = useShopifyProducts(50, query);

  return (
    <div className="container py-10 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-4">Vinhos</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Nossa seleção de vinhos para acompanhar cada momento.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {wineCategories.map((cat) => (
          <button
            key={cat.tag}
            onClick={() => setActiveTag(cat.tag)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTag === cat.tag
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.node.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Wine className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-serif text-2xl mb-2">Em breve</h3>
          <p className="text-muted-foreground">Os vinhos serão exibidos aqui em breve.</p>
        </div>
      )}
    </div>
  );
}
