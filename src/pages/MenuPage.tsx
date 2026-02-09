import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, ShoppingCart } from "lucide-react";

const categories = [
  "Pratos e Terrines", "Tortas e Quiches", "Massas", "Molhos",
  "Vegetariano", "Peixes", "Sanduíches", "Sobremesas", "Saladas", "Carnes e Acompanhamentos",
];

export default function MenuPage() {
  const { data: products, isLoading } = useShopifyProducts(50);

  return (
    <div className="container py-10 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Menu</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Pratos frescos e congelados, feitos com carinho na nossa cozinha artesanal.
        </p>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.node.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-serif text-2xl mb-2">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground">Os produtos serão exibidos aqui assim que forem cadastrados na loja.</p>
        </div>
      )}
    </div>
  );
}
