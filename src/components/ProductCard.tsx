import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, X } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { sentenceCase } from "@/lib/text";


interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem);
  const [isAdding, setIsAdding] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hoveredVariantId, setHoveredVariantId] = useState<string | null>(null);
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
  const hoveredVariant = variants.find(v => v.id === hoveredVariantId) || variant;

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
      toast.success("Adicionado ao carrinho", { description: sentenceCase(node.title) });
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
        <div className="relative overflow-hidden rounded-md bg-secondary/30 aspect-square mb-4">
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
          <div className="absolute inset-x-0 bottom-0 flex justify-center p-4 md:hidden">
            <Button size="sm" className="cta-text text-xs shadow-md" onClick={handleAddToCart} disabled={isAdding || !variant?.availableForSale}>
              {isAdding ? <Loader2 className="h-3 w-3 animate-spin" /> : "Adicionar"}
            </Button>
          </div>
          <div className="absolute inset-x-0 bottom-0 hidden md:flex flex-col gap-2 bg-background/95 p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            {hasMultipleVariants && (
              <div className="flex flex-wrap justify-center gap-1.5">
                {variants.map(v => (
                  <Button
                    key={v.id}
                    type="button"
                    size="sm"
                    variant={hoveredVariant?.id === v.id ? "default" : "outline"}
                    className="h-8 px-3 font-sans normal-case text-xs"
                    disabled={!v.availableForSale}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setHoveredVariantId(v.id);
                    }}
                  >
                    {v.title}
                  </Button>
                ))}
              </div>
            )}
            <Button
              size="sm"
              className="cta-text w-full text-xs"
              disabled={isAdding || !hoveredVariant?.availableForSale}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (hoveredVariant) void addVariant(hoveredVariant);
              }}
            >
              {isAdding ? <Loader2 className="h-3 w-3 animate-spin" /> : "Comprar"}
            </Button>
          </div>
        </div>
        <h3 className="font-sans normal-case text-center text-base md:text-lg leading-snug font-normal mb-3 line-clamp-2">{sentenceCase(node.title)}</h3>
        <div className="flex items-center justify-center">
          <span className="text-sm font-normal leading-none">
            {hasMultiplePrices ? `a partir de ${formatPrice(price)}` : formatPrice(price)}
          </span>
        </div>
      </Link>

      {isMobile ? (
        <Sheet open={pickerOpen} onOpenChange={setPickerOpen}>
          <SheetContent side="bottom" className="rounded-t-lg">
            <SheetHeader>
              <SheetTitle className="font-sans normal-case text-xl text-left">{sentenceCase(node.title)}</SheetTitle>
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
                <div className="font-sans text-xl">{sentenceCase(node.title)}</div>
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
