import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Flame, Clock, Snowflake } from "lucide-react";
import heroImage from "@/assets/boleta-cestas.jpg";
import togoBg from "@/assets/togo-bg.jpg";
import semanaBg from "@/assets/semana-bg.jpg";
import rotisseriaBg from "@/assets/rotisseria-bg.jpg";

const SLIDE_COUNT = 3;
const AUTO_PLAY_INTERVAL = 5000;

const Index = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToSlide = useCallback((index: number) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }, []);

  // Auto-rotate — continuous right direction
  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = prev + 1;
        if (next < SLIDE_COUNT) {
          scrollToSlide(next);
          return next;
        }
        // At last slide: snap instantly to start, then smooth to slide 1
        const el = carouselRef.current;
        if (el) {
          el.scrollTo({ left: 0, behavior: "instant" as ScrollBehavior });
        }
        return 0;
      });
    }, AUTO_PLAY_INTERVAL);
  }, [scrollToSlide]);

  useEffect(() => {
    resetAutoPlay();
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [resetAutoPlay]);

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

  const handleManualNav = (index: number) => {
    scrollToSlide(index);
    resetAutoPlay();
  };

  return (
    <>
      {/* Capa – Carrossel horizontal */}
      <section className="relative bg-foreground h-[70vh] md:h-[80vh]">
        <div
          ref={carouselRef}
          className="h-full w-full flex overflow-x-auto horizontal-snap">

          {/* Slide 1 – To Go */}
          <Link
            to="/to-go"
            className="h-full w-full flex-shrink-0 snap-start relative group flex items-center justify-center">
            <img src={togoBg} alt="To Go" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-foreground/50 group-hover:bg-foreground/40 transition-colors duration-300" />
            <div className="relative z-10 text-center px-6">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-3 drop-shadow-lg">To Go</h2>
              <p className="text-background/80 text-lg md:text-xl max-w-md mx-auto">Pratos prontos para levar e saborear onde quiser.</p>
            </div>
          </Link>

          {/* Slide 2 – Cardápio Semanal */}
          <Link
            to="/semana"
            className="h-full w-full flex-shrink-0 snap-start relative group flex items-center justify-center overflow-hidden">
            <img src={semanaBg} alt="Cardápio Semanal" className="absolute inset-0 w-full h-full object-cover scale-110 transition-transform duration-500 group-hover:scale-120" />
            <div className="absolute inset-0 bg-foreground/50 group-hover:bg-foreground/40 transition-colors duration-300" />
            <div className="relative z-10 text-center px-6">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-3 drop-shadow-lg">Cardápio Semanal</h2>
              <p className="text-background/80 text-lg md:text-xl max-w-md mx-auto">Pratos frescos da semana, prontos para aquecer.</p>
            </div>
          </Link>

          {/* Slide 3 – Rotisserie */}
          <Link
            to="/rotisserie"
            className="h-full w-full flex-shrink-0 snap-start relative group flex items-center justify-center overflow-hidden">
            <img src={rotisseriaBg} alt="Rotisseria" className="absolute inset-0 w-full h-full object-cover scale-110 transition-transform duration-500 group-hover:scale-120" />
            <div className="absolute inset-0 bg-foreground/50 group-hover:bg-foreground/40 transition-colors duration-300" />
            <div className="relative z-10 text-center px-6">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-3 drop-shadow-lg">Rotisseria</h2>
              <p className="text-background/80 text-lg md:text-xl max-w-md mx-auto">Clássicos da casa, empório e muito mais.</p>
            </div>
          </Link>
        </div>

        {/* Setas horizontais */}
        {currentSlide > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); handleManualNav(currentSlide - 1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/20 hover:bg-background/40 backdrop-blur-sm rounded-full p-2 text-background transition-all">
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        {currentSlide < 2 && (
          <button
            onClick={(e) => { e.stopPropagation(); handleManualNav(currentSlide + 1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/20 hover:bg-background/40 backdrop-blur-sm rounded-full p-2 text-background transition-all">
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => handleManualNav(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentSlide === i ? "bg-background scale-125" : "bg-background/40 hover:bg-background/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Banner duplo – Peça pelo nosso site */}
      <section className="grid grid-cols-1 md:grid-cols-2 h-[70vh] md:h-[80vh]">
        <div className="h-full overflow-hidden">
          <img src={heroImage} alt="Sacolas Boleta" className="w-full h-full object-cover" />
        </div>
        <div className="bg-primary flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-[1.1] mb-4">
            Peça pelo<br />nosso site!
          </h2>
          <p className="text-primary-foreground/80 text-base md:text-lg mb-4 max-w-sm">
            Monte seu pedido online, agende a entrega e receba tudo fresquinho na sua casa.
          </p>
          <Link to="/menu">
            <Button size="lg" variant="outline" className="cta-text border-background text-primary-foreground bg-transparent hover:bg-background/10 rounded-full px-8">
              Pedir Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Dicas de Preparo */}
      <section className="bg-secondary/20">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[50vh] md:min-h-[60vh]">
          {/* Texto à esquerda */}
          <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-3">
              Preparo fácil e rápido
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1] mb-4">
              SIMPLES<br />de preparar
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-sm leading-relaxed">
              Todas as instruções de preparo estão especificadas no verso da embalagem. Assista ao vídeo ao lado para um passo a passo completo.
            </p>
          </div>
          {/* Vídeo à direita (placeholder) */}
          <div className="min-h-[40vh] md:min-h-0 bg-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground p-8">
              <div className="w-16 h-16 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl ml-1">▶</span>
              </div>
              <p className="text-sm">Vídeo em breve</p>
            </div>
          </div>
        </div>
      </section>

      {/* Na Mídia */}
      <section className="py-8 md:py-12 bg-background">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-foreground">Na mídia</h2>
          <p className="text-muted-foreground mb-6 text-sm md:text-base">
            <span className="text-destructive">★★★★</span> no Guia Comer & Beber da Veja São Paulo
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                source: "VEJA SÃO PAULO",
                title: "Roberto Eid Philipp, da Boleta, participa de evento na França",
                excerpt: "Único paulistano a integrar o festival no Carreau du Temple, em Paris, levando cuscuz paulista e manjar de coco.",
                link: "https://vejasp.abril.com.br/coluna/delicia-de-conta/comer-e-beber-chef-rotisseria-boleta-participa-de-evento-na-franca/",
                image: "https://vejasp.abril.com.br/wp-content/uploads/2025/09/Roberto-Eid-Phillip.jpg?quality=70&strip=info&w=600&h=400&crop=1",
              },
              {
                source: "VEJA SÃO PAULO",
                title: "Boleta também vende pratos para viagem em Pinheiros",
                excerpt: "No misto de empório e rotisseria, Roberto Eid Philipp assina as receitas e faz a curadoria dos itens à venda.",
                link: "https://vejasp.abril.com.br/comer-e-beber/boleta-pinheiros-critica/",
                image: "https://vejasp.abril.com.br/wp-content/uploads/2023/07/Boleta_ambiente_credito_Helson-Gomes_divulgacao.JPG.jpg?quality=70&strip=info&w=600&h=400&crop=1",
              },
            ].map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-secondary/30 rounded-2xl border border-border/50 p-5 flex items-stretch gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                      {item.source}
                    </span>
                    <h3 className="font-serif text-base md:text-lg font-bold mt-1.5 mb-1.5 leading-snug group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 hidden md:block">{item.excerpt}</p>
                  </div>
                  <span className="mt-3 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Vem ler tudo aqui →
                  </span>
                </div>
                <div className="w-28 md:w-36 flex-shrink-0 rounded-xl overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
