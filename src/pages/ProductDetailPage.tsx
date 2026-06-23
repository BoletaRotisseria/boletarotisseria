import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { storefrontApiRequest, STOREFRONT_PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { RelatedProducts } from "@/components/RelatedProducts";

export default function ProductDetailPage() {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const isCartLoading = useCartStore(state => state.isLoading);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/cardapios");
  };

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', handle],
    queryFn: async () => {
      const data = await storefrontApiRequest(STOREFRONT_PRODUCT_BY_HANDLE_QUERY, { handle });
      return data?.data?.productByHandle;
    },
    enabled: !!handle,
  });

  if (isLoading) return <div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!product) return <div className="container py-20 text-center"><h2 className="font-serif text-2xl">Produto não encontrado</h2></div>;

  const variant = product.variants.edges[selectedVariantIdx]?.node;
  const image = product.images.edges[0]?.node;
  const price = parseFloat(variant?.price.amount || "0");
  const currency = variant?.price.currencyCode || "BRL";
  const formatPrice = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(v);

  const handleAddToCart = async () => {
    if (!variant) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Adicionado ao carrinho", { description: product.title });
  };

  return (
    <div className="container py-8 md:py-16">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-lg overflow-hidden bg-secondary/30">
          {image && <img src={image.url} alt={image.altText || product.title} className="w-full h-full object-cover" />}
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>
          {product.description && product.description.trim().replace(/\.$/, "").toLowerCase() !== "item do empório" && (
            <p className="text-muted-foreground mb-6">{product.description}</p>
          )}
          <p className="text-3xl font-bold mb-6">{formatPrice(price)}</p>

          {product.variants.edges.length > 1 && (
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Opção</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.edges.map((v: { node: { id: string; title: string; availableForSale: boolean } }, i: number) => (
                  <button
                    key={v.node.id}
                    onClick={() => setSelectedVariantIdx(i)}
                    className={`px-4 py-2 rounded text-sm border transition-colors ${
                      i === selectedVariantIdx ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
                    } ${!v.node.availableForSale ? "opacity-40 cursor-not-allowed" : ""}`}
                    disabled={!v.node.availableForSale}
                  >
                    {v.node.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button size="lg" className="cta-text w-full md:w-auto" onClick={handleAddToCart} disabled={isCartLoading || !variant?.availableForSale}>
            {isCartLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Adicionar ao Carrinho
          </Button>
        </div>
      </div>

      <RelatedProducts productTags={product.tags || []} currentProductId={product.id} />
    </div>
  );
}
