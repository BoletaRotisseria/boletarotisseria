import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, Gift, ArrowLeft, Check, CalendarIcon } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { GIFT_WRAP_OPTIONS, GIFT_WRAP_VARIANT_IDS, buildGiftWrapCartItem, type GiftWrapOption } from "@/lib/giftWrap";
import { format, addDays, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

type Step = "cart" | "delivery-date" | "gift-question" | "gift-select";

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("cart");
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, addItem, getCheckoutUrl, syncCart, deliveryDate, setDeliveryDate } = useCartStore();
  const initialDate = deliveryDate ? new Date(deliveryDate + "T12:00:00") : undefined;
  const [pickedDate, setPickedDate] = useState<Date | undefined>(initialDate);

  const visibleItems = items.filter((i) => !GIFT_WRAP_VARIANT_IDS.has(i.variantId));
  const giftItem = items.find((i) => GIFT_WRAP_VARIANT_IDS.has(i.variantId));
  const totalItems = visibleItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
  const currencyCode = items[0]?.price.currencyCode || "BRL";

  const today = startOfDay(new Date());
  const minDate = addDays(today, 1);
  const maxDate = addDays(today, 21);

  useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);
  useEffect(() => {
    if (!isOpen) {
      setStep("cart");
      setSelectedGift(null);
      setPickedDate(deliveryDate ? new Date(deliveryDate + "T12:00:00") : undefined);
    }
  }, [isOpen, deliveryDate]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: currencyCode }).format(value);

  const handleStartCheckout = () => {
    setStep("delivery-date");
  };

  const handleConfirmDate = async () => {
    if (!pickedDate) return;
    const iso = format(pickedDate, "yyyy-MM-dd");
    await setDeliveryDate(iso);
    setSelectedGift(giftItem ? GIFT_WRAP_OPTIONS.find(o => o.variantId === giftItem.variantId)?.id ?? null : null);
    setStep("gift-question");
  };

  const goToCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  const handleNoGift = async () => {
    if (giftItem) await removeItem(giftItem.variantId);
    goToCheckout();
  };

  const handleConfirmGift = async (option: GiftWrapOption) => {
    // Remove any previously selected paid wrap
    if (giftItem && giftItem.variantId !== option.variantId) {
      await removeItem(giftItem.variantId);
    }
    // Add new paid wrap if needed and not already present
    if (option.variantId && (!giftItem || giftItem.variantId !== option.variantId)) {
      const newItem = buildGiftWrapCartItem(option);
      if (newItem) await addItem(newItem);
    }
    goToCheckout();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 text-foreground hover:text-foreground/70 transition-colors">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {totalItems}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          {step !== "cart" && (
            <button
              onClick={() => {
                if (step === "gift-select") setStep("gift-question");
                else if (step === "gift-question") setStep("delivery-date");
                else setStep("cart");
              }}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground self-start mb-1"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
          )}
          <SheetTitle className="font-serif text-2xl">
            {step === "cart" && "Seu Carrinho"}
            {step === "delivery-date" && "Quando deseja receber?"}
            {step === "gift-question" && "Este pedido é um presente?"}
            {step === "gift-select" && "Escolha a embalagem"}
          </SheetTitle>
          {step === "cart" && (
            <SheetDescription>
              {totalItems === 0 ? "Seu carrinho está vazio" : `${totalItems} ${totalItems === 1 ? "item" : "itens"} no carrinho`}
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="flex flex-col flex-1 pt-4 min-h-0">
          {step === "cart" && (
            visibleItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Seu carrinho está vazio</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto pr-2 min-h-0 space-y-3">
                  {visibleItems.map((item) => (
                    <div key={item.variantId} className="flex gap-3 p-3 rounded-md bg-secondary/30">
                      <div className="w-16 h-16 bg-secondary rounded overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.product.node.title}</h4>
                        {item.variantTitle !== "Default Title" && (
                          <p className="text-xs text-muted-foreground">{item.variantTitle}</p>
                        )}
                        <p className="font-semibold text-sm mt-1">{formatPrice(parseFloat(item.price.amount))}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.variantId)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-xs">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {giftItem && (
                    <div className="flex gap-3 p-3 rounded-md bg-primary/10 border border-primary/20">
                      <div className="w-16 h-16 bg-primary/20 rounded flex items-center justify-center flex-shrink-0">
                        <Gift className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{giftItem.product.node.title}</h4>
                        <p className="font-semibold text-sm mt-1">{formatPrice(parseFloat(giftItem.price.amount))}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(giftItem.variantId)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0 space-y-4 pt-4 border-t mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-lg">Total</span>
                    <span className="text-xl font-bold">{formatPrice(totalPrice)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Pedido direto com o Boleta, simples e seguro, sem taxas de aplicativo.
                  </p>
                  <Button onClick={handleStartCheckout} className="w-full cta-text" size="lg" disabled={visibleItems.length === 0 || isLoading || isSyncing}>
                    {isLoading || isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ExternalLink className="w-4 h-4 mr-2" />Finalizar Pedido</>}
                  </Button>
                </div>
              </>
            )
          )}

          {step === "delivery-date" && (
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                <div className="flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <CalendarIcon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground px-2">
                  Selecione o dia em que deseja receber o seu pedido. Disponível a partir de amanhã, até 21 dias à frente.
                </p>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={pickedDate}
                    onSelect={setPickedDate}
                    locale={ptBR}
                    disabled={(date) => date < minDate || date > maxDate}
                    fromDate={minDate}
                    toDate={maxDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto rounded-md border")}
                  />
                </div>
                {pickedDate && (
                  <p className="text-center text-sm">
                    Entrega em <span className="font-semibold">{format(pickedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}</span>
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 pt-4 border-t mt-4">
                <Button
                  size="lg"
                  className="w-full cta-text"
                  disabled={!pickedDate || isLoading || isSyncing}
                  onClick={handleConfirmDate}
                >
                  {isLoading || isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar data"}
                </Button>
              </div>
            </div>
          )}

          {step === "gift-question" && (
            <div className="flex-1 flex flex-col justify-center gap-4 px-2">
              <div className="flex items-center justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Gift className="h-8 w-8 text-primary" />
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Podemos preparar o seu pedido com uma embalagem especial.
              </p>
              <Button size="lg" className="w-full cta-text" onClick={() => setStep("gift-select")} disabled={isLoading}>
                Sim, é um presente
              </Button>
              <Button size="lg" variant="outline" className="w-full" onClick={handleNoGift} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Não, seguir para o pagamento"}
              </Button>
            </div>
          )}

          {step === "gift-select" && (
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {GIFT_WRAP_OPTIONS.map((opt) => {
                  const isSelected = selectedGift === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedGift(opt.id)}
                      className={`w-full text-left flex gap-3 p-4 rounded-md border-2 transition-colors ${
                        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="w-20 h-20 bg-secondary rounded flex items-center justify-center flex-shrink-0">
                        <Gift className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif text-base font-semibold">{opt.label}</h4>
                          {isSelected && <Check className="h-4 w-4 text-primary flex-shrink-0 mt-1" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                        <p className="font-semibold text-sm mt-2">
                          {opt.price === 0 ? "Cortesia" : formatPrice(opt.price)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex-shrink-0 pt-4 border-t mt-4">
                <Button
                  size="lg"
                  className="w-full cta-text"
                  disabled={!selectedGift || isLoading || isSyncing}
                  onClick={() => {
                    const opt = GIFT_WRAP_OPTIONS.find((o) => o.id === selectedGift);
                    if (opt) handleConfirmGift(opt);
                  }}
                >
                  {isLoading || isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ExternalLink className="w-4 h-4 mr-2" />Confirmar e finalizar</>}
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
