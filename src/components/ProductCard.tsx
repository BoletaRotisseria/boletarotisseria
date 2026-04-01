import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const variant = node.variants.edges[0]?.node;
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const currency = node.priceRange.minVariantPrice.currencyCode;

  const formatPrice = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(v);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Adicionado ao carrinho", { description: node.title });
  };

  return (
    <Link to={`/product/${node.handle}`} className="group flex flex-col h-full">
      <div className="overflow-hidden rounded-md bg-secondary/30 aspect-square mb-3">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ShoppingCart className="h-8 w-8" />
          </div>
        )}
      </div>
      <h3 className="font-serif text-lg leading-tight mb-1 font-bold">{node.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-2 flex-1">
        {node.description || "\u00A0"}
      </p>
      <div className="flex items-center justify-between gap-2 mt-auto">
        <span className="font-normal">{formatPrice(price)}</span>
        <Button size="sm" className="cta-text text-xs" onClick={handleAddToCart} disabled={isLoading || !variant?.availableForSale}>
          {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Adicionar"}
        </Button>
      </div>
    </Link>
  );
}
