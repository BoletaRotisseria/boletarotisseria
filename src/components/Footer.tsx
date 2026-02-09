import { Link } from "react-router-dom";
import boletaLogo from "@/assets/boleta-rotisseria-logo.jpeg";
import quadriculadoBg from "@/assets/quadriculado-bg.jpg";

export function Footer() {
  return (
    <footer className="relative text-foreground">
      <div
        className="absolute inset-0 bg-repeat bg-center opacity-10"
        style={{ backgroundImage: `url(${quadriculadoBg})`, backgroundSize: '400px' }}
      />
      <div className="absolute inset-0 bg-background" style={{ zIndex: -1 }} />
      <div className="container relative z-10 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <img src={boletaLogo} alt="Boleta Rotisseria" className="h-20 rounded mb-4" />
            <p className="text-sm text-foreground/60 max-w-xs">
              Comida fresca, artesanal e deliciosa. Direto da nossa cozinha para a sua mesa.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-lg mb-4">Navegação</h4>
            <nav className="space-y-2 text-sm text-foreground/60">
              <Link to="/menu" className="block hover:text-primary transition-colors">Menu</Link>
              <Link to="/emporio" className="block hover:text-primary transition-colors">Empório</Link>
              <Link to="/individual" className="block hover:text-primary transition-colors">Individual</Link>
              <Link to="/presentear" className="block hover:text-primary transition-colors">Para Presentear</Link>
              <Link to="/eventos" className="block hover:text-primary transition-colors">Eventos</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-serif text-lg mb-4">Contato</h4>
            <div className="space-y-2 text-sm text-foreground/60">
              <p>contato@boletarotisseria.com.br</p>
              <p>São Paulo, SP</p>
            </div>
          </div>
        </div>
        <div className="border-t border-foreground/10 mt-10 pt-6 text-center text-xs text-foreground/40">
          © {new Date().getFullYear()} Boleta Rotisseria. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
