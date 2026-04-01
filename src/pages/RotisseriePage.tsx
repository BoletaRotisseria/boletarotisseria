import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, ShoppingCart } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import rotisseriaBg from "@/assets/rotisseria-bg.jpg";

const rotisserieCategories = [
  { label: "Todos", tag: "" },
  { label: "Aperitivos", tag: "aperitivos" },
  { label: "Carnes & Aves", tag: "carnes" },
  { label: "Massas", tag: "massas" },
  { label: "Saladas", tag: "saladas" },
  { label: "Acompanhamentos", tag: "acompanhamentos" },
  { label: "Sopas", tag: "sopas" },
  { label: "Sobremesas", tag: "sobremesas" },
  { label: "Pizza", tag: "pizza" },
];

export default function RotisseriePage() {
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
    ? `product_type:Rotisseria AND tag:${activeTag}`
    : "product_type:Rotisseria";
  const { data: products, isLoading } = useShopifyProducts(250, query);

  return (
    <div>
      <div
        className="relative h-[50vh] md:h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${rotisseriaBg})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white">
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-3">Rotisseria</h1>
          <p className="text-white/80 max-w-lg mx-auto text-sm md:text-base">
            Clássicos da casa, preparados com carinho e ingredientes selecionados.
          </p>
        </div>
      </div>

      <div className="bg-background">
        <div className="container py-10 md:py-16">
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
      </div>
    </div>
  );
}
