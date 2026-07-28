import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, X } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";


interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem);
  const [isAdding, setIsAdding] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const isMobile = useIsMobile();
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const variants = node.variants.edges.map(v => v.node);
  const variant = variants[0];
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const currency = node.priceRange.minVariantPrice.currencyCode;
  const variantPrices = variants.map(v => parseFloat(v.price.amount));
  const hasMultiplePrices = variantPrices.length > 1 && new Set(variantPrices).size > 1;
  const hasMultipleVariants = variants.length > 1;

  const formatPrice = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(v);

  const addVariant = async (v: typeof variants[number]) => {
    setIsAdding(true);
    try {
      await addItem({
        product,
        variantId: v.id,
        variantTitle: v.title,
        price: v.price,
        quantity: 1,
        selectedOptions: v.selectedOptions || [],
      });
      toast.success("Adicionado ao carrinho", { description: node.title });
    } finally {
      setIsAdding(false);
      setPickerOpen(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    if (hasMultipleVariants) {
      setPickerOpen(true);
      return;
    }
    await addVariant(variant);
  };

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pickerOpen || isMobile) return;
    const handleClick = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [pickerOpen, isMobile]);

  const VariantButtons = (
    <div className="flex flex-col gap-2 pt-2">
      {variants.map(v => (
        <Button
          key={v.id}
          variant="outline"
          disabled={isAdding || !v.availableForSale}
          onClick={() => addVariant(v)}
          className="justify-between h-auto py-3 px-4 hover:bg-[#F5B700] hover:text-black active:bg-[#F5B700] active:text-black focus-visible:bg-[#F5B700] focus-visible:text-black"
        >
          <span className="lowercase">{v.title}</span>
          <span>{formatPrice(parseFloat(v.price.amount))}</span>
        </Button>
      ))}
    </div>
  );

  return (
    <div ref={cardRef} className="relative overflow-visible">
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

      {isMobile ? (
        <Sheet open={pickerOpen} onOpenChange={setPickerOpen}>
          <SheetContent side="bottom" className="rounded-t-lg">
            <SheetHeader>
              <SheetTitle className="font-courier lowercase text-xl text-left">{node.title}</SheetTitle>
              <p className="text-sm text-muted-foreground text-left">Escolha o tamanho:</p>
            </SheetHeader>
            {VariantButtons}
          </SheetContent>
        </Sheet>
      ) : (
        pickerOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 z-50 bg-background border border-border rounded-md shadow-lg p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-courier lowercase text-xl">{node.title}</div>
                <p className="text-sm text-muted-foreground">Escolha o tamanho:</p>
              </div>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {VariantButtons}
          </div>
        )
      )}
    </div>
  );
}
