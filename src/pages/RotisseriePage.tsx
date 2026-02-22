import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, ShoppingCart } from "lucide-react";
import { useState } from "react";

const rotisserieCategories = [
  { label: "Todos", tag: "" },
  { label: "Para Compartilhar", tag: "para compartilhar" },
  { label: "Carnes & Aves", tag: "carnes" },
  { label: "Massas", tag: "massas" },
  { label: "Saladas", tag: "saladas" },
  { label: "Acompanhamentos", tag: "acompanhamentos" },
  { label: "Sopas", tag: "sopas" },
  { label: "Sobremesas", tag: "sobremesas" },
];

export default function RotisseriePage() {
  const [activeTag, setActiveTag] = useState("");
  const query = activeTag
    ? `product_type:Rotisseria AND tag:${activeTag}`
    : "product_type:Rotisseria";
  const { data: products, isLoading } = useShopifyProducts(250, query);

  return (
    <div className="container py-10 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-4">Rotisseria</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Clássicos da casa, preparados com carinho e ingredientes selecionados.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {rotisserieCategories.map((cat) => (
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
          <p className="text-muted-foreground">Os produtos da rotisseria serão exibidos aqui.</p>
        </div>
      )}
    </div>
  );
}
