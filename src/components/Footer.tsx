import { Link } from "react-router-dom";
import casinhaAsset from "@/assets/casinha-boleta.png.asset.json";
import { Button } from "@/components/ui/button";
import { Clock3, Instagram, MapPin, Phone } from "lucide-react";

const WHATSAPP_CARDAPIO = "https://wa.me/5511998951900?text=Ol%C3%A1%2C%20quero%20receber%20o%20card%C3%A1pio%20semanal.";
const INSTAGRAM_URL = "https://www.instagram.com/boleta.rotisseria?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

export function Footer() {
  return (
    <footer className="bg-footer text-foreground">
      <div className="border-y border-border/60 bg-background/70">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 py-6 md:flex-row md:gap-8">
          <h3 className="font-serif normal-case text-2xl text-center shrink-0">
            Cardápio semanal
          </h3>
          <p className="text-sm text-muted-foreground text-center shrink-0">
            Inscreva-se e fique por dentro das novidades.
          </p>
          <Button asChild className="h-auto rounded-none px-6 py-3 text-xs tracking-[0.14em] uppercase shrink-0">
            <a
              href={WHATSAPP_CARDAPIO}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 32 32" className="w-4 h-4 fill-current flex-shrink-0">
                <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.129 6.744 3.047 9.379L1.054 31.25l6.1-1.955a15.923 15.923 0 008.85 2.674C24.824 31.969 32 24.793 32 16.004 32 7.176 24.824 0 16.004 0zm9.32 22.609c-.39 1.1-2.288 2.1-3.15 2.168-.793.063-1.535.375-5.172-1.078-4.375-1.75-7.16-6.234-7.375-6.523-.21-.289-1.75-2.328-1.75-4.438s1.11-3.148 1.5-3.578c.39-.43.86-.54 1.148-.54.29 0 .578.003.828.016.27.012.633-.102.99.753.39.883 1.32 3.227 1.437 3.46.117.235.195.508.04.82-.157.312-.235.508-.47.78-.234.274-.492.61-.703.82-.234.234-.477.488-.205.957.274.47 1.215 2.004 2.61 3.246 1.789 1.594 3.297 2.086 3.766 2.32.469.235.742.196 1.016-.117.273-.313 1.172-1.367 1.484-1.836.313-.47.625-.39 1.055-.235.43.157 2.734 1.29 3.203 1.524.47.235.781.352.898.547.117.195.117 1.133-.273 2.234z" />
              </svg>
              Quero receber
            </a>
          </Button>
        </div>
      </div>

      <div className="container px-4 py-4 md:py-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-[1.25fr_1fr_1.05fr_2.7fr] md:items-start md:gap-x-0">
          <div className="flex justify-center sm:justify-start">
            <img src={casinhaAsset.url} alt="Fachada da Boleta Rotisseria" className="-mt-12 -mb-8 h-64 w-auto object-contain md:-mt-16 md:-mb-10 md:h-80" />
          </div>

          <div className="md:pt-11">
            <h4 className="font-serif normal-case text-2xl font-normal mb-6">
              Institucional
            </h4>
            <nav className="space-y-3 text-sm">
              <Link to="/cafe" className="block text-muted-foreground hover:text-foreground transition-colors">
                Sobre nós
              </Link>
              <Link to="/semana" className="block text-muted-foreground hover:text-foreground transition-colors">
                Cardápio da semana
              </Link>
              <Link to="/menu" className="block text-muted-foreground hover:text-foreground transition-colors">
                Nossa cozinha
              </Link>
            </nav>
          </div>

          <div className="md:pt-11">
            <h4 className="font-serif normal-case text-2xl font-normal mb-6">
              Atendimento
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0" strokeWidth={1.6} />
                <a href="tel:+5511998951900" className="hover:text-foreground transition-colors">(11) 99895-1900</a>
              </p>
              <p className="flex items-center gap-3">
                <Instagram className="h-5 w-5 shrink-0" strokeWidth={1.6} />
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">@boleta.rotisseria</a>
              </p>
            </div>
          </div>

          <div className="md:pt-11">
            <h4 className="font-serif normal-case text-2xl font-normal mb-6">
              Casinha
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 shrink-0" strokeWidth={1.6} />
                <span>Seg a Sex 10h às 18h – Sábado 10h às 14h</span>
              </p>
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.6} />
                <span>Rua Ferreira de Araújo, 418 – Pinheiros</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}