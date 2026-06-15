import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, ShoppingCart } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const emporioCategories = [
  { label: "Todos", tag: "" },
  
  { label: "Antepastos & Conservas", tag: "antepastos-conservas" },
  { label: "Massas & Molhos", tag: "massas-molhos" },
  { label: "Doces & Chocolates", tag: "doces-chocolates" },
  { label: "Biscoitos & Snacks", tag: "biscoitos-snacks" },
  { label: "Azeites, Temperos & Especiais", tag: "azeites-temperos-especiais" },
];

export default function EmporioPage() {
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
    ? `tag:emporio AND tag:${activeTag}`
    : "tag:emporio";
  const { data: products, isLoading } = useShopifyProducts(250, query);

  return (
    <div className="container py-10 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-4">Empório</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Produtos especiais e itens artesanais selecionados para você.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {emporioCategories.map((cat) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.node.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-serif text-2xl mb-2">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground">Os produtos do empório serão exibidos aqui.</p>
        </div>
      )}
    </div>
  );
}
