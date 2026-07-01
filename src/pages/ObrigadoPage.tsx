import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";

export default function ObrigadoPage() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState<"idle" | "tagging" | "done" | "error">("idle");
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    const orderId = params.get("order_id") || params.get("order") || params.get("id");
    let pending: { fulfillmentDate?: string; fulfillmentTime?: string } | null = null;
    try {
      const raw = localStorage.getItem("pending_delivery");
      if (raw) pending = JSON.parse(raw);
    } catch { /* noop */ }

    if (!orderId || !pending?.fulfillmentDate) {
      setStatus("done");
      clearCart();
      return;
    }

    setStatus("tagging");
    supabase.functions
      .invoke("tag-order-by-delivery", {
        body: {
          orderId,
          fulfillmentDate: pending.fulfillmentDate,
          fulfillmentTime: pending.fulfillmentTime,
        },
      })
      .then(({ error }) => {
        if (error) {
          console.error("tag-order-by-delivery failed:", error);
          setStatus("error");
        } else {
          setStatus("done");
        }
        try { localStorage.removeItem("pending_delivery"); } catch { /* noop */ }
        clearCart();
      });
  }, [params, clearCart]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-lg text-center space-y-6">
        <div className="flex justify-center">
          {status === "tagging" ? (
            <Loader2 className="h-14 w-14 text-primary animate-spin" />
          ) : (
            <CheckCircle2 className="h-14 w-14 text-primary" />
          )}
        </div>
        <h1 className="font-serif text-4xl md:text-5xl">Obrigado pelo seu pedido</h1>
        <p className="text-muted-foreground">
          Recebemos seu pedido e já estamos preparando tudo com carinho. Em breve você receberá a
          confirmação por e-mail.
        </p>
        <div className="pt-4">
          <Button asChild size="lg">
            <Link to="/">Voltar para o início</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
