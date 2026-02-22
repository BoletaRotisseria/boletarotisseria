import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, ChevronDown, Search, User } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { useAuth } from "@/hooks/useAuth";
import boletaLogo from "@/assets/boleta-logo.jpeg";

interface SubItem {
  label: string;
  path: string;
}

interface SubCategory {
  label: string;
  path: string;
  highlight?: boolean;
  items?: SubItem[];
}

interface NavItem {
  label: string;
  path: string;
  subCategories?: SubCategory[];
}

const navItems: NavItem[] = [
  {
    label: "Cardápios",
    path: "/cardapios",
    subCategories: [
      {
        label: "Rotisseria",
        path: "/rotisserie",
        items: [
          { label: "Para Compartilhar", path: "/rotisserie" },
          { label: "Carnes & Aves", path: "/rotisserie" },
          { label: "Massas", path: "/rotisserie" },
          { label: "Saladas", path: "/rotisserie" },
          { label: "Acompanhamentos", path: "/rotisserie" },
          { label: "Sopas", path: "/rotisserie" },
          { label: "Sobremesas", path: "/rotisserie" },
        ],
      },
      {
        label: "Empório",
        path: "/emporio",
        items: [
          { label: "Queijos & Embutidos", path: "/emporio" },
          { label: "Antepastos & Conservas", path: "/emporio" },
          { label: "Massas & Molhos", path: "/emporio" },
          { label: "Doces & Chocolates", path: "/emporio" },
          { label: "Biscoitos & Snacks", path: "/emporio" },
          { label: "Azeites, Temperos & Especiais", path: "/emporio" },
        ],
      },
      {
        label: "To Go",
        path: "/to-go",
      },
      {
        label: "Presentes",
        path: "/presentes",
        items: [
          { label: "Cestas", path: "/presentes" },
          { label: "Itens de Casa", path: "/presentes" },
        ],
      },
      {
        label: "Vinhos",
        path: "/vinhos",
        items: [
          { label: "Branco", path: "/vinhos" },
          { label: "Tinto", path: "/vinhos" },
          { label: "Rosé", path: "/vinhos" },
          { label: "Espumante", path: "/vinhos" },
          { label: "Champagne", path: "/vinhos" },
        ],
      },
    ],
  },
  { label: "Sobre Nós", path: "/cafe" },
  { label: "Contato", path: "/eventos" },
  { label: "Mídia", path: "/eventos" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [mobileSubExpanded, setMobileSubExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mobileTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchClosedByClick = useRef(false);
  const mobileClosedByClick = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 50);
  };

  const handleSearchEnter = () => {
    if (searchClosedByClick.current) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setSearchOpen(true);
  };

  const handleSearchLeave = () => {
    searchClosedByClick.current = false;
    searchTimeoutRef.current = setTimeout(() => setSearchOpen(false), 100);
  };

  const handleMobileEnter = () => {
    if (mobileClosedByClick.current) return;
    if (mobileTimeoutRef.current) clearTimeout(mobileTimeoutRef.current);
    setMobileOpen(true);
  };

  const handleMobileLeave = () => {
    mobileClosedByClick.current = false;
    mobileTimeoutRef.current = setTimeout(() => setMobileOpen(false), 100);
  };

  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border/40">
      {/* Main bar */}
      <div className="container flex items-center justify-between h-14 md:h-16">
        <Link to="/" className="flex-shrink-0">
          <img src={boletaLogo} alt="Boleta" className="h-14 md:h-[72px] rounded -my-2" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0 flex-1 justify-center">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.subCategories && handleEnter(item.label)}
              onMouseLeave={handleLeave}
            >
              <Link
                to={item.path}
                className={`flex items-center gap-1 px-4 py-2 text-[11px] font-sans font-semibold tracking-[0.14em] uppercase transition-colors hover:text-foreground ${
                  location.pathname === item.path ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {item.label}
                {item.subCategories && <ChevronDown className="h-3 w-3" strokeWidth={2} />}
              </Link>

              {/* Mega-menu rendered inside the nav item for seamless hover */}
              {item.subCategories && openDropdown === item.label && (
                <div
                  className="fixed left-0 right-0 top-[56px] md:top-[64px] z-50 bg-background border-b border-border/40 shadow-md animate-fade-in"
                  onMouseEnter={() => handleEnter(item.label)}
                  onMouseLeave={handleLeave}
                >
                  {/* Invisible bridge to connect nav link to mega-menu */}
                  <div className="absolute left-0 right-0 -top-4 h-4" />
                  <div className="container">
                    <div className="flex border border-border/60">
                      {item.subCategories.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.path}
                          onClick={() => setOpenDropdown(null)}
                          className={`flex-1 px-6 py-3 text-xs font-sans font-bold tracking-[0.14em] uppercase text-center border-r border-border/40 last:border-r-0 hover:bg-secondary/50 transition-colors ${
                            sub.highlight ? "text-destructive" : "text-foreground"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                    <div className="flex py-4">
                      {item.subCategories.map((sub) => (
                        <div key={sub.label} className="flex-1 px-6">
                          {sub.items && (
                            <ul className="space-y-1">
                              {sub.items.map((si) => (
                                <li key={si.label}>
                                  <Link
                                    to={si.path}
                                    onClick={() => setOpenDropdown(null)}
                                    className="text-[11px] font-sans font-semibold tracking-[0.1em] uppercase text-foreground/70 hover:text-foreground transition-colors"
                                  >
                                    {si.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-1 md:gap-2">
          <div
            onMouseEnter={handleSearchEnter}
            onMouseLeave={handleSearchLeave}
          >
            <button
              onClick={() => {
                if (searchOpen) searchClosedByClick.current = true;
                setSearchOpen(!searchOpen);
              }}
              className="p-2 text-foreground hover:text-foreground/70 transition-colors"
              aria-label="Pesquisar"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
          <Link
            to={user ? "/conta" : "/entrar"}
            className="p-2 text-foreground hover:text-foreground/70 transition-colors"
            aria-label={user ? "Minha Conta" : "Entrar"}
          >
            <User className="h-5 w-5" />
          </Link>
          <CartDrawer />
          <div
            onMouseEnter={handleMobileEnter}
            onMouseLeave={handleMobileLeave}
          >
            <button className="lg:hidden p-2 text-foreground hover:text-foreground/70 transition-colors" onClick={() => {
              if (mobileOpen) mobileClosedByClick.current = true;
              setMobileOpen(!mobileOpen);
            }}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div
          className="border-t border-border/40 bg-background animate-fade-in"
          onMouseEnter={handleSearchEnter}
          onMouseLeave={handleSearchLeave}
        >
          <div className="container py-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  setSearchOpen(false);
                }
              }}
              className="flex gap-2"
            >
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="O que você procura?"
                className="flex-1 bg-secondary/50 border border-border/60 rounded px-4 py-2 text-sm font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => {
                  searchClosedByClick.current = true;
                  setSearchOpen(false);
                }}
                className="p-2 text-foreground/60 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}




      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          className="lg:hidden border-t border-border/40 bg-background px-6 py-4 space-y-1 animate-fade-in max-h-[80vh] overflow-y-auto"
          onMouseEnter={handleMobileEnter}
          onMouseLeave={handleMobileLeave}
        >
          {navItems.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between border-b border-border/30">
                <Link
                  to={item.path}
                  onClick={() => !item.subCategories && setMobileOpen(false)}
                  className={`block py-3 text-xs font-sans font-medium tracking-[0.12em] uppercase ${
                    location.pathname === item.path ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  {item.label}
                </Link>
                {item.subCategories && (
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                    className="p-2"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${mobileExpanded === item.label ? "rotate-180" : ""}`}
                    />
                  </button>
                )}
              </div>
              {item.subCategories && mobileExpanded === item.label && (
                <div className="pl-4 pb-2 space-y-2">
                  {item.subCategories.map((sub) => (
                    <div key={sub.label}>
                      <div className="flex items-center justify-between">
                        <Link
                          to={sub.path}
                          onClick={() => setMobileOpen(false)}
                          className={`block py-2 text-[11px] font-sans font-bold tracking-[0.1em] uppercase ${
                            sub.highlight ? "text-destructive" : "text-foreground/80"
                          }`}
                        >
                          {sub.label}
                        </Link>
                        {sub.items && sub.items.length > 0 && (
                          <button
                            onClick={() => setMobileSubExpanded(mobileSubExpanded === sub.label ? null : sub.label)}
                            className="p-2"
                          >
                            <ChevronDown
                              className={`h-3.5 w-3.5 text-foreground/60 transition-transform ${mobileSubExpanded === sub.label ? "rotate-180" : ""}`}
                            />
                          </button>
                        )}
                      </div>
                      {sub.items && mobileSubExpanded === sub.label && (
                        <ul className="pl-3 space-y-1 animate-fade-in">
                          {sub.items.map((si) => (
                            <li key={si.label}>
                              <Link
                                to={si.path}
                                onClick={() => setMobileOpen(false)}
                                className="block py-1 text-[10px] font-sans tracking-[0.08em] uppercase text-foreground/60 hover:text-foreground"
                              >
                                {si.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}
