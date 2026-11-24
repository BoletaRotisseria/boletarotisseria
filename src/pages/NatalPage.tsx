import { FileText, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import cardapioFestasPdf from "@/assets/cardapio-festas-2026.pdf.asset.json";

const WHATSAPP_NATAL_URL =
  "https://wa.me/5511998951900?text=Oi%20Boleta%2C%20vi%20o%20Card%C3%A1pio%20de%20Festas%202026%20e%20gostaria%20de%20fazer%20meu%20pedido.";

const NatalPage = () => {
  return (
    <section className="mobile-page-content bg-background pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="container max-w-5xl">
        <div className="max-w-2xl mb-8 md:mb-10">
          <span className="block text-[11px] font-medium tracking-[0.22em] uppercase text-muted-foreground mb-3">
            Natal Boleta · 2026
          </span>
          <h1 className="font-perfectly-nineties text-3xl md:text-5xl font-light text-foreground leading-[1.15] mb-4">
            Cardápio de Festas 2026
          </h1>
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
            Confira o cardápio completo de Natal em PDF. Depois de escolher os pratos da sua ceia, faça o seu pedido diretamente pelo nosso WhatsApp.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8 md:mb-10">
          <a href={cardapioFestasPdf.url} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              variant="outline"
              className="cta-text w-full sm:w-auto rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background px-7 py-3 h-auto text-xs md:text-sm gap-2"
            >
              <FileText className="h-4 w-4" />
              Abrir Cardápio em PDF
            </Button>
          </a>

          <a href={WHATSAPP_NATAL_URL} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="cta-text w-full sm:w-auto rounded-none bg-primary text-foreground hover:bg-primary/90 px-7 py-3 h-auto text-xs md:text-sm gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Pedir pelo WhatsApp
            </Button>
          </a>
        </div>

        <div className="hidden md:block border border-border bg-card">
          <iframe
            src={cardapioFestasPdf.url}
            title="Cardápio de Festas Boleta 2026"
            className="w-full h-[78vh]"
          />
        </div>

        <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm md:text-base text-foreground/80">
            Já escolheu os pratos no PDF? Envie sua lista pelo WhatsApp para confirmar sua encomenda de Natal.
          </p>
          <a href={WHATSAPP_NATAL_URL} target="_blank" rel="noopener noreferrer" className="shrink-0">
            <Button
              size="lg"
              className="cta-text w-full sm:w-auto rounded-none bg-foreground text-background hover:bg-foreground/90 px-7 py-3 h-auto text-xs md:text-sm gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Fazer pedido no WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default NatalPage;