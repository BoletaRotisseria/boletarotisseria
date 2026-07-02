import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, Gift, CalendarIcon, MapPin, Store, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { GIFT_WRAP_OPTIONS, GIFT_WRAP_VARIANT_IDS, buildGiftWrapCartItem } from "@/lib/giftWrap";

const WEEKDAY_SLOTS = ["11h às 13h", "13h às 17h30"];
const SATURDAY_SLOTS = ["11h às 13h"];

function slotsForDate(date: Date | null): string[] {
  if (!date) return [];
  const dow = date.getDay();
  if (dow === 0) return [];
  if (dow === 6) return SATURDAY_SLOTS;
  return WEEKDAY_SLOTS;
}

function parseISODate(s: string | null): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const {
    items, isLoading, isSyncing,
    addItem, updateQuantity, removeItem, getCheckoutUrl, syncCart,
    fulfillmentMethod, fulfillmentDate, fulfillmentTime,
    setFulfillmentMethod, setFulfillmentDate, setFulfillmentTime,
    submitFulfillmentAttributes,
  } = useCartStore();

  const [isGift, setIsGift] = useState<"sim" | "nao" | null>(null);
  const [giftMessage, setGiftMessage] = useState("");

  const visibleItems = items.filter((i) => !GIFT_WRAP_VARIANT_IDS.has(i.variantId));
  const giftItem = items.find((i) => GIFT_WRAP_VARIANT_IDS.has(i.variantId));
  const selectedGiftId = giftItem
    ? GIFT_WRAP_OPTIONS.find((o) => o.variantId === giftItem.variantId)?.id ?? null
    : (isGift === "sim" ? "sacola-boleta" : null);
  const totalItems = visibleItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
  const currencyCode = items[0]?.price.currencyCode || "BRL";

  useEffect(() => {
    if (giftItem && isGift === null) setIsGift("sim");
  }, [giftItem, isGift]);

  useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);

  useEffect(() => { if (!isOpen) setStep(1); }, [isOpen]);

  const { minDate, maxDate } = useMemo(() => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const max = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 21);
    return { minDate: tomorrow, maxDate: max };
  }, []);

  const selectedDate = parseISODate(fulfillmentDate);
  const availableSlots = slotsForDate(selectedDate);

  const isDateDisabled = (d: Date) => {
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (day < minDate) return true;
    if (day > maxDate) return true;
    if (day.getDay() === 0) return true;
    return false;
  };

  const canCheckout =
    visibleItems.length > 0 &&
    !!fulfillmentMethod &&
    !!fulfillmentDate &&
    !!fulfillmentTime &&
    !isLoading &&
    !isSyncing;

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: currencyCode }).format(value);

  const selectGiftOption = async (optionId: string) => {
    const currentItems = useCartStore.getState().items;
    for (const it of currentItems) {
      if (GIFT_WRAP_VARIANT_IDS.has(it.variantId)) await removeItem(it.variantId);
    }
    const opt = GIFT_WRAP_OPTIONS.find((o) => o.id === optionId);
    if (!opt) return;
    const cartItem = buildGiftWrapCartItem(opt);
    if (cartItem) await addItem(cartItem);
  };

  const clearGiftSelection = async () => {
    const currentItems = useCartStore.getState().items;
    for (const it of currentItems) {
      if (GIFT_WRAP_VARIANT_IDS.has(it.variantId)) await removeItem(it.variantId);
    }
  };

  const handleGiftToggle = async (value: "sim" | "nao") => {
    setIsGift(value);
    if (value === "nao") {
      setGiftMessage("");
      await clearGiftSelection();
    }
  };

  const GiftQuestion = (
    <div className="space-y-3">
      <Label className="font-serif text-base flex items-center gap-2">
        <Gift className="h-4 w-4" /> Este pedido é um presente?
      </Label>
      <RadioGroup
        value={isGift ?? ""}
        onValueChange={(v) => handleGiftToggle(v as "sim" | "nao")}
        className="grid grid-cols-2 gap-2"
      >
        <Label htmlFor="gift-sim" className={cn("flex items-center gap-2 rounded-md border p-3 cursor-pointer transition-colors", isGift === "sim" ? "border-primary bg-primary/5" : "border-border")}>
          <RadioGroupItem value="sim" id="gift-sim" />
          <span className="text-sm">Sim</span>
        </Label>
        <Label htmlFor="gift-nao" className={cn("flex items-center gap-2 rounded-md border p-3 cursor-pointer transition-colors", isGift === "nao" ? "border-primary bg-primary/5" : "border-border")}>
          <RadioGroupItem value="nao" id="gift-nao" />
          <span className="text-sm">Não</span>
        </Label>
      </RadioGroup>
    </div>
  );

  const proceedToCheckout = async () => {
    const extraAttrs: Array<{ key: string; value: string }> = [];
    const extraNote: string[] = [];
    if (isGift === "sim" && selectedGiftId) {
      const opt = GIFT_WRAP_OPTIONS.find((o) => o.id === selectedGiftId);
      extraAttrs.push({ key: "Presente", value: "Sim" });
      if (opt) extraAttrs.push({ key: "Embalagem", value: opt.label });
      if (giftMessage.trim()) {
        extraAttrs.push({ key: "Mensagem do Presente", value: giftMessage.trim() });
        extraNote.push(`Mensagem do Presente: ${giftMessage.trim()}`);
      }
      if (opt) extraNote.push(`Embalagem de Presente: ${opt.label}`);
    }
    await submitFulfillmentAttributes(extraAttrs, extraNote);
    const checkoutUrl = getCheckoutUrl();
    if (!checkoutUrl) return;
    try {
      if (window.top && window.top !== window.self) {
        window.top.location.href = checkoutUrl;
        return;
      }
    } catch {
      window.open(checkoutUrl, "_blank", "noopener,noreferrer");
      return;
    }
    window.location.href = checkoutUrl;
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
          <div className="flex items-center gap-2">
            {step === 2 && (
              <button onClick={() => setStep(1)} className="p-1 text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <SheetTitle className="font-serif text-2xl">
              {step === 1 ? "Seu Carrinho" : "Entrega"}
            </SheetTitle>
          </div>
          <SheetDescription>
            {totalItems === 0 ? "Seu carrinho está vazio" : `${totalItems} ${totalItems === 1 ? "item" : "itens"} no carrinho`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 pt-4 min-h-0">
          {visibleItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Seu carrinho está vazio</p>
              </div>
            </div>
          ) : step === 1 ? (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0 space-y-3">
                {/* Pergunta sobe para o topo quando Sim está selecionado */}
                {isGift === "sim" && (
                  <div className="pb-2">
                    {GiftQuestion}
                  </div>
                )}

                {/* Opções de embalagem (só quando Sim) */}
                {isGift === "sim" && (
                  <div className="space-y-3 border-t pt-3">
                    <Label className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground">Escolha a embalagem</Label>
                    <div className="grid gap-2">
                      {GIFT_WRAP_OPTIONS.map((opt) => {
                        const isSelected = selectedGiftId === opt.id;
                        return (
                          <button key={opt.id} type="button" onClick={() => selectGiftOption(opt.id)} disabled={isLoading}
                            className={cn("flex items-center justify-between gap-3 rounded-md border p-3 text-left transition-colors", isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/40")}>
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Gift className="h-4 w-4 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-sm truncate">{opt.label}</p>
                                <p className="text-xs text-muted-foreground truncate">{opt.description}</p>
                              </div>
                            </div>
                            <span className="text-sm font-semibold flex-shrink-0">{opt.price === 0 ? "Cortesia" : formatPrice(opt.price)}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gift-message" className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground">Mensagem do cartão (opcional)</Label>
                      <Textarea id="gift-message" value={giftMessage} onChange={(e) => setGiftMessage(e.target.value.slice(0, 300))}
                        placeholder="Escreva uma mensagem para acompanhar o presente" className="min-h-[80px] font-sans text-sm" maxLength={300} />
                      <p className="text-[10px] text-muted-foreground text-right">{giftMessage.length}/300</p>
                    </div>
                  </div>
                )}

                {/* Itens — aparecem abaixo quando Sim, ou no topo quando Não/null */}
                {isGift !== "sim" && visibleItems.map((item) => (
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
              </div>

              {/* Fixo no fundo */}
              <div className="flex-shrink-0 mt-4 space-y-4">
                {/* Pergunta fica no rodapé apenas quando não é Sim */}
                {isGift !== "sim" && (
                  <div className="pb-2">
                    {GiftQuestion}
                  </div>
                )}
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="font-serif text-lg">Total</span>
                  <span className="text-xl font-bold">{formatPrice(totalPrice)}</span>
                </div>
                <Button onClick={() => setStep(2)} className="w-full cta-text" size="lg" disabled={isGift === null}>
                  Continuar
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0 space-y-4">
                <div className="space-y-2">
                  <Label className="font-serif text-base">Método de recebimento</Label>
                  <RadioGroup
                    value={fulfillmentMethod ?? ""}
                    onValueChange={(v) => setFulfillmentMethod(v as "entrega" | "retirada")}
                    className="grid grid-cols-2 gap-2"
                  >
                    <Label htmlFor="fm-entrega" className={cn("flex items-center gap-2 rounded-md border p-3 cursor-pointer transition-colors", fulfillmentMethod === "entrega" ? "border-primary bg-primary/5" : "border-border")}>
                      <RadioGroupItem value="entrega" id="fm-entrega" />
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">Entrega</span>
                    </Label>
                    <Label htmlFor="fm-retirada" className={cn("flex items-center gap-2 rounded-md border p-3 cursor-pointer transition-colors", fulfillmentMethod === "retirada" ? "border-primary bg-primary/5" : "border-border")}>
                      <RadioGroupItem value="retirada" id="fm-retirada" />
                      <Store className="h-4 w-4" />
                      <span className="text-sm">Retirada</span>
                    </Label>
                  </RadioGroup>
                  {fulfillmentMethod && (
                    <p className="text-xs text-muted-foreground">
                      {fulfillmentMethod === "retirada" ? "Retirada no Boleta Rotisseria" : "Entrega no endereço informado no checkout"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-serif text-base">Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR }) : "Escolha uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        locale={ptBR}
                        selected={selectedDate ?? undefined}
                        onSelect={(d) => d && setFulfillmentDate(toISODate(d))}
                        disabled={isDateDisabled}
                        defaultMonth={selectedDate ?? minDate}
                        fromDate={minDate}
                        toDate={maxDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground">A partir de amanhã, até 21 dias. Domingo indisponível.</p>
                </div>

                {selectedDate && (
                  <div className="space-y-2">
                    <Label className="font-serif text-base">Horário</Label>
                    {availableSlots.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Sem horários disponíveis nesta data.</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.map((slot) => (
                          <Button key={slot} type="button" variant={fulfillmentTime === slot ? "default" : "outline"} size="sm" onClick={() => setFulfillmentTime(slot)} className="text-xs">
                            {slot}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 space-y-4 pt-4 border-t mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-serif text-lg">Total</span>
                  <span className="text-xl font-bold">{formatPrice(totalPrice)}</span>
                </div>
                <Button onClick={proceedToCheckout} className="w-full cta-text" size="lg" disabled={!canCheckout}>
                  {isLoading || isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Finalizar Pedido
                    </>
                  )}
                </Button>
                {!canCheckout && (
                  <p className="text-xs text-center text-muted-foreground">Selecione método, data e horário para continuar.</p>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
