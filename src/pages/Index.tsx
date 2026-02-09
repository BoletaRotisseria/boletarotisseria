import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const scrollToSlide = (index: number) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const handleScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setCurrentSlide(idx);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Capa – Carrossel horizontal */}
      <section className="relative bg-foreground h-[70vh] md:h-[80vh]">
        <div
          ref={carouselRef}
          className="h-full w-full flex overflow-x-auto horizontal-snap"
        >
          {/* Slide 1 – Cardápio Semanal */}
          <Link
            to="/semana"
            className="h-full w-full flex-shrink-0 snap-start relative group flex items-center justify-center"
          >
            <img
              src={heroImage}
              alt="Cardápio Semanal"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-foreground/50 group-hover:bg-foreground/40 transition-colors duration-300" />
            <div className="relative z-10 text-center px-6">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-3 drop-shadow-lg">
                Cardápio Semanal
              </h2>
              <p className="text-background/80 text-lg md:text-xl max-w-md mx-auto">
                Pratos frescos da semana, prontos para aquecer.
              </p>
            </div>
          </Link>

          {/* Slide 2 – Rotisserie */}
          <Link
            to="/rotisserie"
            className="h-full w-full flex-shrink-0 snap-start relative group flex items-center justify-center"
          >
            <div className="absolute inset-0 diamond-pattern opacity-30" />
            <div className="absolute inset-0 bg-primary/80 group-hover:bg-primary/70 transition-colors duration-300" />
            <div className="relative z-10 text-center px-6">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-3 drop-shadow-lg">
                Rotisserie
              </h2>
              <p className="text-primary-foreground/80 text-lg md:text-xl max-w-md mx-auto">
                Clássicos da casa, empório e muito mais.
              </p>
            </div>
          </Link>
        </div>

        {/* Setas horizontais */}
        {currentSlide === 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); scrollToSlide(1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/20 hover:bg-background/40 backdrop-blur-sm rounded-full p-2 text-background transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
        {currentSlide === 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); scrollToSlide(0); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/20 hover:bg-background/40 backdrop-blur-sm rounded-full p-2 text-background transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Dots horizontais */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {[0, 1].map((i) => (
            <button
              key={i}
              onClick={() => scrollToSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentSlide === i ? "bg-background scale-125" : "bg-background/40 hover:bg-background/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Pratos artesanais do Boleta" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="container relative z-10 py-16">
          <div className="max-w-xl">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-[1.1] mb-6">
              Escolha seus pratos, aqueça e aproveite.
            </h1>
            <p className="text-background/80 text-lg md:text-xl mb-8 max-w-md">
              Loja de comidas frescas e congeladas, comida saudável, prática e deliciosa.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu">
                <Button size="lg" className="cta-text">Ver Menu</Button>
              </Link>
              <Link to="/menu">
                <Button size="lg" variant="outline" className="cta-text bg-background/10 border-background/30 text-background hover:bg-background/20">
                  Pedir Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { title: "Fresco & Artesanal", desc: "Ingredientes selecionados, receitas da casa." },
              { title: "Prático & Rápido", desc: "Peça e receba em casa, pronto para aquecer." },
              { title: "Feito com Carinho", desc: "Cada prato preparado com dedicação e sabor." },
            ].map((f) => (
              <div key={f.title} className="p-6">
                <h3 className="font-serif text-2xl mb-3">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            Peça direto do Boleta
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Praticidade e sabor direto na sua mesa.
          </p>
          <Link to="/menu">
            <Button size="lg" variant="outline" className="cta-text bg-background text-foreground hover:bg-background/90">
              Ver Menu Completo
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Index;
