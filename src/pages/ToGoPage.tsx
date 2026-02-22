import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, ShoppingCart } from "lucide-react";
import togoBg from "@/assets/togo-bg.jpg";

export default function ToGoPage() {
  const { data: products, isLoading } = useShopifyProducts(50);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${togoBg})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 container py-10 md:py-16">
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-3 text-white">To Go</h1>
          <p className="text-white/80 max-w-lg mx-auto text-sm md:text-base">
            Refeições prontas para levar. Praticidade sem abrir mão do sabor.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ShoppingCart className="h-16 w-16 text-white/60 mx-auto mb-4" />
            <h3 className="font-serif text-2xl mb-2 text-white">Em breve</h3>
            <p className="text-white/70">Os pratos To Go serão exibidos aqui em breve.</p>
          </div>
        )}
      </div>
    </div>
  );
}
