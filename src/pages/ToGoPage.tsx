import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, ShoppingCart } from "lucide-react";
import togoBg from "@/assets/togo-bg.jpg";

export default function ToGoPage() {
  const { data: products, isLoading } = useShopifyProducts(50, "product_type:'To Go' AND -tag:oculto");

  return (
    <div>
      {/* Hero banner com foto */}
      <div
        className="relative h-[50vh] md:h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${togoBg})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white">
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-3">Individual</h1>
          <p className="text-white/80 max-w-lg mx-auto text-sm md:text-base">
            Refeições prontas para levar. Praticidade sem abrir mão do sabor.
          </p>
        </div>
      </div>

      {/* Conteúdo com fundo original */}
      <div className="bg-background">
        <div className="container py-10 md:py-16">
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
              <h3 className="font-serif text-2xl mb-2">Em breve</h3>
              <p className="text-muted-foreground">Os pratos individuais serão exibidos aqui em breve.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
