import { Link } from "react-router-dom";
import boletaLogo from "@/assets/boleta-rotisseria-logo.jpeg";
import quadriculadoBg from "@/assets/quadriculado-bg.jpg";

const WHATSAPP_CARDAPIO = "https://wa.me/5511998951900?text=Ol%C3%A1%2C%20quero%20receber%20o%20card%C3%A1pio%20semanal.";
const WHATSAPP_CONTATO = "https://wa.me/5511998951900";
const INSTAGRAM_URL = "https://www.instagram.com/boleta.rotisseria?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

export function Footer() {
  return (
    <footer className="relative text-foreground">
      {/* Background texture */}
      <div
        className="absolute inset-0 bg-repeat bg-center opacity-10"
        style={{ backgroundImage: `url(${quadriculadoBg})`, backgroundSize: "400px" }} />

      <div className="absolute inset-0 bg-background" style={{ zIndex: -1 }} />

      {/* Faixa superior – Inscrição WhatsApp */}
      <div className="relative z-10 border-b border-foreground/10">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 py-5">
          <p className="font-serif text-xl md:text-2xl tracking-[-0.02em] text-center sm:text-left">
            Receba o nosso cardápio semanal.
          </p>
          <a
            href={WHATSAPP_CARDAPIO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] text-white px-6 py-3 rounded font-sans text-xs font-bold tracking-[0.14em] uppercase hover:bg-[#1fb855] transition-colors">

            <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white flex-shrink-0">
              <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.129 6.744 3.047 9.379L1.054 31.25l6.1-1.955a15.923 15.923 0 008.85 2.674C24.824 31.969 32 24.793 32 16.004 32 7.176 24.824 0 16.004 0zm9.32 22.609c-.39 1.1-2.288 2.1-3.15 2.168-.793.063-1.535.375-5.172-1.078-4.375-1.75-7.16-6.234-7.375-6.523-.21-.289-1.75-2.328-1.75-4.438s1.11-3.148 1.5-3.578c.39-.43.86-.54 1.148-.54.29 0 .578.003.828.016.27.012.633-.102.99.753.39.883 1.32 3.227 1.437 3.46.117.235.195.508.04.82-.157.312-.235.508-.47.78-.234.274-.492.61-.703.82-.234.234-.477.488-.205.957.274.47 1.215 2.004 2.61 3.246 1.789 1.594 3.297 2.086 3.766 2.32.469.235.742.196 1.016-.117.273-.313 1.172-1.367 1.484-1.836.313-.47.625-.39 1.055-.235.43.157 2.734 1.29 3.203 1.524.47.235.781.352.898.547.117.195.117 1.133-.273 2.234z" />
            </svg>
            Quero Receber
          </a>
        </div>
      </div>

      {/* Corpo do rodapé – 4 colunas */}
      <div className="container relative z-10 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Coluna 1 – Logo + Sobre */}
          <div>
            <img src={boletaLogo} alt="Boleta Rotisseria" className="h-20 rounded mb-4" />
            <p className="text-sm text-foreground/60 leading-relaxed mb-6">
              O Boleta oferece uma experiência gastronômica artesanal, com pratos preparados diariamente e ingredientes selecionados.
            </p>
            <p className="font-sans text-[11px] font-bold tracking-[0.14em] uppercase mb-3">
              Siga o Boleta
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-foreground/20 text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors"
              aria-label="Instagram">

              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>

          {/* Coluna 2 – Institucional */}
          <div>
            <h4 className="font-sans text-[11px] font-bold tracking-[0.14em] uppercase mb-5">
              Institucional
            </h4>
            <nav className="space-y-2.5 text-sm">
              <Link to="/cafe" className="block text-foreground/60 hover:text-foreground transition-colors">
                Sobre nós
              </Link>
              <Link to="/semana" className="block text-foreground/60 hover:text-foreground transition-colors">
                Cardápio da semana
              </Link>
              <Link to="/menu" className="block text-foreground/60 hover:text-foreground transition-colors">
                Nossa cozinha
              </Link>
            </nav>
          </div>

          {/* Coluna 3 – Informações Úteis */}
          <div>
            <h4 className="font-sans text-[11px] font-bold tracking-[0.14em] uppercase mb-5">
              Informações Úteis
            </h4>
            <nav className="space-y-2.5 text-sm">
              <Link to="/conta" className="block text-foreground/60 hover:text-foreground transition-colors">
                Meus Pedidos
              </Link>
              <Link to="/eventos" className="block text-foreground/60 hover:text-foreground transition-colors">
                Política de entrega
              </Link>
              <Link to="/eventos" className="block text-foreground/60 hover:text-foreground transition-colors">
                Trocas e Cancelamentos
              </Link>
              <Link to="/eventos" className="block text-foreground/60 hover:text-foreground transition-colors">
                Política de Privacidade
              </Link>
            </nav>
          </div>

          {/* Coluna 4 – Atendimento */}
          <div>
            <h4 className="font-sans text-[11px] font-bold tracking-[0.14em] uppercase mb-5">
              Atendimento
            </h4>
            <div className="space-y-3 text-sm text-foreground/60">
              <p className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                <a href="tel:+5511998951900" className="hover:text-foreground transition-colors">(11) 99895-1900</a>
              </p>
              <p className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                <span>Seg a Sex 10h às 18h 
Sábado 10h às 14h
                </span>
              </p>
              <p className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                <span>
                </span>
              </p>
              <p className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>Rua Ferreira de Araújo, 418 – Pinheiros</span>
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="border-t border-foreground/10 mt-10 pt-6 text-center text-xs text-foreground/40">
          © {new Date().getFullYear()} Boleta. Todos os direitos reservados.
        </div>
      </div>
    </footer>);}