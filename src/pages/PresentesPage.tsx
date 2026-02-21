import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, Gift } from "lucide-react";

const presentesCategories = ["Cestas", "Itens de Casa"];

export default function PresentesPage() {
  const { data: products, isLoading } = useShopifyProducts(50);

  return (
    <div className="container py-10 md:py-16">
      <div className="text-center mb-12">
        <Gift className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-4">Presentes</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Cestas gourmet e sugestões especiais para surpreender quem você ama.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {presentesCategories.map((cat) => (
          <span key={cat} className="px-4 py-1.5 rounded-full text-sm font-medium bg-secondary text-secondary-foreground">
            {cat}
          </span>
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
          <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-serif text-2xl mb-2">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground">Os presentes serão exibidos aqui.</p>
        </div>
      )}
    </div>
  );
}
