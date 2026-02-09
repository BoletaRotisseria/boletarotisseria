import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, User, Heart, ShoppingCart } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import boletaLogo from "@/assets/boleta-logo.jpeg";

const navItems = [
  { label: "Início", path: "/" },
  { label: "Cardápio Semanal", path: "/semana" },
  { label: "Rotisserie", path: "/rotisserie" },
  { label: "Café", path: "/cafe" },
  { label: "Menu", path: "/menu" },
  { label: "Empório", path: "/emporio" },
  { label: "Individual", path: "/individual" },
  { label: "Presentear", path: "/presentear" },
  { label: "Eventos", path: "/eventos" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border/40">
      <div className="container flex items-center justify-between h-14 md:h-16">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src={boletaLogo}
            alt="Boleta"
            className="h-9 md:h-11 rounded"
          />
        </Link>

        {/* Desktop nav – centered uppercase links */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 text-[11px] font-sans font-medium tracking-[0.12em] uppercase transition-colors hover:text-foreground ${
                location.pathname === item.path
                  ? "text-foreground"
                  : "text-foreground/60"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-1 md:gap-2">
          <button className="hidden md:inline-flex p-2 text-foreground/60 hover:text-foreground transition-colors">
            <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
          <button className="hidden md:inline-flex p-2 text-foreground/60 hover:text-foreground transition-colors">
            <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
          <button className="hidden md:inline-flex p-2 text-foreground/60 hover:text-foreground transition-colors">
            <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
          <CartDrawer />
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-border/40 bg-background px-6 py-4 space-y-1 animate-fade-in">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-xs font-sans font-medium tracking-[0.12em] uppercase border-b border-border/30 ${
                location.pathname === item.path ? "text-foreground" : "text-foreground/60"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
