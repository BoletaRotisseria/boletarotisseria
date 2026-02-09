import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import boletaLogo from "@/assets/boleta-logo.jpeg";

const isHome = () => window.location.pathname === "/";

const navItems = [
  { label: "Início", path: "/" },
  { label: "Café", path: "/cafe" },
  { label: "Menu", path: "/menu" },
  { label: "Empório", path: "/emporio" },
  { label: "Individual", path: "/individual" },
  { label: "Para Presentear", path: "/presentear" },
  { label: "Eventos", path: "/eventos" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex-shrink-0">
          <img
            src={boletaLogo}
            alt="Boleta Rotisseria"
            className={`rounded transition-all duration-300 ${
              location.pathname === "/" ? "h-14 md:h-20" : "h-10 md:h-14"
            }`}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 text-sm font-sans font-medium tracking-wide transition-colors hover:text-primary ${
                location.pathname === item.path ? "text-primary" : "text-foreground/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CartDrawer />
          <Link to="/menu">
            <Button className="cta-text hidden sm:inline-flex" size="sm">
              Pedir Agora
            </Button>
          </Link>
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-border bg-background px-6 py-4 space-y-1 animate-fade-in">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-base font-sans font-medium border-b border-border/50 ${
                location.pathname === item.path ? "text-primary" : "text-foreground/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/menu" onClick={() => setMobileOpen(false)}>
            <Button className="cta-text w-full mt-4">Pedir Agora</Button>
          </Link>
        </nav>
      )}
    </header>
  );
}
