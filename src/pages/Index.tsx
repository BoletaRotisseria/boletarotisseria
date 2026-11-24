import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/boleta-cestas.jpg";
import capaMesaBg from "@/assets/hero-home-bg-2.jpg";
import capaNatalAsset from "@/assets/capa-natal-2026.jpg.asset.json";
import seloAsset from "@/assets/selo-comer-beber-transp.png.asset.json";
import papelSedaBg from "@/assets/papel-seda-boleta.jpg";
import preparoBgAsset from "@/assets/padronagem-preparo.png.asset.json";
import { NOTICIAS } from "@/lib/noticias";
import { NoticiasGrid } from "@/components/NoticiasGrid";
import { capaNatalAtiva } from "@/lib/capaNatal";

const Index = () => {
  const emClimaNatal = capaNatalAtiva();
  const location = useLocation();
  const preparoSectionRef = useRef<HTMLElement>(null);
  const preparoVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  useEffect(() => {
    const section = preparoSectionRef.current;
    if (!section) return;

    let wasVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        if (entry.isIntersecting && !wasVisible) {
          const video = preparoVideoRef.current;
          if (video) {
            video.currentTime = 0;
            void video.play().catch(() => undefined);
          }
        }

        wasVisible = entry.isIntersecting;
      },
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Capa – hero fixa */}
      <section className="mobile-screen-section relative h-[100svh] md:h-screen overflow-hidden">
        <img
          src={emClimaNatal ? capaNatalAsset.url : capaMesaBg}
          alt={
            emClimaNatal
              ? "Chef Roberto Eid Philipp preparando a mesa de Natal do Boleta"
              : "Mesa posta com aperitivos e pratos do Boleta"
          }
          className={
            emClimaNatal
              ? "absolute inset-0 w-full h-full object-cover object-[70%_top] md:object-top"
              : "absolute inset-0 w-full h-full object-cover"
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/35 via-transparent to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end">
          <div className="container pb-10 md:pb-20">
            <div className="max-w-2xl">
              <span
                className={
                  emClimaNatal
                    ? "inline-flex items-center gap-3 text-[10px] md:text-xs font-medium tracking-[0.24em] uppercase text-primary mb-2 md:mb-4"
                    : "block text-[10px] md:text-xs font-medium tracking-[0.2em] md:tracking-[0.25em] uppercase text-background/90 mb-2 md:mb-4"
                }
              >
                {emClimaNatal ? (
                  <>
                    <span className="inline-block w-6 h-px bg-primary" aria-hidden="true" />
                    Natal Boleta · 2026
                  </>
                ) : (
                  "Rotisseria & Empório"
                )}
              </span>
              <h1 className="font-perfectly-nineties text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-light text-background leading-[1.2] md:leading-[1.15] mb-6 md:mb-8 drop-shadow-md">
                {emClimaNatal ? (
                  <>
                    <span className="block lg:whitespace-nowrap">A ceia de Natal com a nossa cozinha na sua mesa.</span>
                    <span className="block lg:whitespace-nowrap">Pronta para aquecer, servir e celebrar.</span>
                  </>
                ) : (
                  <>
                    <span className="block lg:whitespace-nowrap">Comida de verdade, feita para compartilhar.</span>
                    <span className="block lg:whitespace-nowrap">Pronta para aquecer, servir e aproveitar.</span>
                  </>
                )}
              </h1>

              <Link to="/cardapios">
                <Button
                  size="lg"
                  variant="outline"
                  className="cta-text rounded-none border border-background/90 bg-transparent text-background tracking-[0.2em] uppercase px-5 py-2 h-auto text-[11px] md:px-10 md:py-3 md:text-sm hover:bg-background/10"
                >
                  {emClimaNatal ? "Encomendar a Ceia" : "Pedir Agora"}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Selo do prêmio */}
        <img
          src={seloAsset.url}
          alt="Selo Veja Comer & Beber 2026/2027 — Boleta, melhor rotisseria de São Paulo"
          className={
            emClimaNatal
              ? "absolute top-24 left-3 md:top-[84px] md:left-8 lg:left-auto lg:right-8 lg:top-auto lg:bottom-20 z-10 w-36 md:w-36 lg:w-48 h-auto"
              : "absolute top-24 right-3 md:top-[84px] md:right-8 lg:top-auto lg:bottom-20 z-10 w-36 md:w-36 lg:w-48 h-auto"
          }
        />
      </section>

      {emClimaNatal && (
        <section className="bg-natal text-natal-foreground border-t border-natal-foreground/15">
          <div className="container py-10 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="font-perfectly-nineties text-2xl md:text-4xl font-light text-natal-foreground leading-tight mb-2">
                Encomendas de Natal abertas
              </h2>
              <p className="text-sm md:text-base text-natal-foreground/85 leading-relaxed">
                Dos aperitivos às sobremesas, escolha seus pratos online e agende a entrega ou a retirada na loja.
              </p>
            </div>
            <Link to="/rotisserie" className="shrink-0">
              <Button
                size="lg"
                className="cta-text rounded-none bg-natal-foreground text-natal hover:bg-natal-foreground/90 tracking-[0.18em] uppercase px-8 py-3 h-auto text-xs md:text-sm font-semibold"
              >
                Montar minha ceia
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Banner duplo – Peça pelo nosso site */}
      <section className="mobile-screen-split grid grid-cols-1 md:grid-cols-2 md:h-[90vh]">
        <div className="relative min-h-0 h-full overflow-hidden">
          <img src={heroImage} alt="Sacolas Boleta" className="absolute inset-0 md:static w-full h-full object-cover" />
        </div>
        <div className="bg-stripe flex flex-col justify-center px-6 py-6 md:p-12 lg:p-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-[1.1] mb-4">
            Peça pelo<br />nosso <span className="normal-case">Site</span>!
          </h2>
          <p className="text-primary-foreground/80 text-base md:text-lg mb-4 max-w-sm">
            Monte seu pedido online, agende a entrega e receba tudo na sua casa.
          </p>
          <Link to="/cardapios">
            <Button size="lg" variant="outline" className="cta-text border-background text-primary-foreground bg-transparent hover:bg-background/10 rounded-none px-8">
              Pedir Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Dicas de Preparo */}
      <section ref={preparoSectionRef} className="relative bg-background">
        <div className="absolute inset-0 w-1/2 hidden md:block" style={{ backgroundImage: `url(${preparoBgAsset.url})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.55 }} />
        <div className="absolute inset-0 md:hidden" style={{ backgroundImage: `url(${preparoBgAsset.url})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.55 }} />
        <div className="mobile-screen-split relative z-10 grid grid-cols-1 md:grid-cols-2 md:h-[90vh]">
          {/* Texto à esquerda */}
          <div className="flex flex-col justify-center px-6 py-6 md:p-12 lg:p-16">
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
          {/* Vídeo à direita */}
          <div className="min-h-0 md:min-h-full bg-muted flex items-center justify-center overflow-hidden">
            <video
              ref={preparoVideoRef}
              src="/videos/preparo.mp4"
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </section>

      {/* Na Mídia */}
      <section id="na-midia" className="mobile-screen-section relative flex flex-col justify-center py-8 md:py-14 bg-primary scroll-mt-20">
        <div className="relative z-10 container">
          <div className="mb-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Na mídia</h2>
          </div>
          <NoticiasGrid noticias={NOTICIAS.slice(0, 2)} lightHover />
          <div className="mt-6 text-center">
            <Link
              to="/cafe#na-midia"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors underline underline-offset-4"
            >
              Ver todas as notícias
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
