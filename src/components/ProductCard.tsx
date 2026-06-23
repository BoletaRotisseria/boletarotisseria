import { Link } from "react-router-dom";
import { useState } from "react";
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
  const [isAdding, setIsAdding] = useState(false);
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const variant = node.variants.edges[0]?.node;
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const currency = node.priceRange.minVariantPrice.currencyCode;
  const variantPrices = node.variants.edges.map(v => parseFloat(v.node.price.amount));
  const hasMultiplePrices = variantPrices.length > 1 && new Set(variantPrices).size > 1;

  const formatPrice = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(v);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    setIsAdding(true);
    try {
      await addItem({
        product,
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions || [],
      });
      toast.success("Adicionado ao carrinho", { description: node.title });
    } finally {
      setIsAdding(false);
    }
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
      <h3 className="font-courier lowercase text-lg md:text-xl leading-snug font-normal mt-3 mb-3 line-clamp-2 min-h-[2.6em] flex items-center">{node.title}</h3>
      <div className="flex items-center justify-between gap-2">
        <span className="font-normal">
          {hasMultiplePrices ? `a partir de ${formatPrice(price)}` : formatPrice(price)}
        </span>
        <Button size="sm" className="cta-text text-xs bg-primary/60 hover:bg-primary/80" onClick={handleAddToCart} disabled={isAdding || !variant?.availableForSale}>
          {isAdding ? <Loader2 className="h-3 w-3 animate-spin" /> : "Adicionar"}
        </Button>
      </div>
    </Link>
  );
}
