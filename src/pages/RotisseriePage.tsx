import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, ShoppingCart } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import rotisseriaBg from "@/assets/rotisseria-bg.jpg";
import { CATEGORIAS_ROTISSERIA, handlesDaCategoria } from "@/lib/categoriasRotisseria";

const rotisserieCategories = [
  { label: "Todos", slug: "" },
  ...CATEGORIAS_ROTISSERIA.map((c) => ({ label: c.label, slug: c.slug })),
];

export default function RotisseriePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSlug = searchParams.get("categoria") || "";

  const setActiveSlug = (slug: string) => {
    if (slug) {
      setSearchParams({ categoria: slug });
    } else {
      setSearchParams({});
    }
  };

  const { data: allProducts, isLoading } = useShopifyProducts(250, "-tag:oculto");

  const handles = activeSlug ? handlesDaCategoria(activeSlug) : null;
  const products = handles
    ? (allProducts || []).filter((p) => handles.includes(p.node.handle))
    : allProducts;

  return (
    <div>
      <div
        className="relative h-[50vh] md:h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${rotisseriaBg})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white">
          <h1 className="font-courier lowercase text-5xl md:text-7xl lg:text-8xl font-normal mb-3">Rotisseria</h1>
          <p className="text-white/80 max-w-lg mx-auto text-sm md:text-base">
            Clássicos da casa, preparados com carinho e ingredientes selecionados.
          </p>
        </div>
      </div>

      <div className="bg-background">
        <div className="container py-10 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {rotisserieCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveSlug(cat.slug)}
                className={`text-left w-full px-6 py-5 md:px-8 md:py-6 rounded-lg border transition-all text-lg md:text-xl lg:text-2xl font-serif lowercase ${
                  activeSlug === cat.slug
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/40 text-foreground border-border hover:border-primary/60 hover:bg-secondary/60"
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
