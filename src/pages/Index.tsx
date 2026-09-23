import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/boleta-cestas.jpg";
import capaMesaBg from "@/assets/hero-home-bg-2.jpg";
import seloAsset from "@/assets/selo-comer-beber-transp.png.asset.json";
import papelSedaBg from "@/assets/papel-seda-boleta.jpg";
import losangoBgAsset from "@/assets/padronagem-losango.png.asset.json";
import quadriculadoMidiaBgAsset from "@/assets/padronagem-grade.png.asset.json";
import { NOTICIAS } from "@/lib/noticias";
import { NoticiasGrid } from "@/components/NoticiasGrid";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  return (
    <>
      {/* Capa – hero fixa */}
      <section className="relative h-[85vh] md:h-screen overflow-hidden">
        <img
          src={capaMesaBg}
          alt="Mesa posta com aperitivos e pratos do Boleta"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/35 via-transparent to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end">
          <div className="container pb-14 md:pb-20">
            <div className="max-w-2xl">
              <span className="block text-[11px] md:text-xs font-medium tracking-[0.25em] uppercase text-background/90 mb-4">
                Rotisseria & Empório
              </span>
              <h1 className="font-perfectly-nineties text-2xl sm:text-4xl md:text-5xl font-light text-background leading-[1.15] mb-8 drop-shadow-md">
                <span className="block whitespace-nowrap">Comida de verdade, feita para compartilhar.</span>
                <span className="block whitespace-nowrap">Pronta para aquecer, servir e aproveitar.</span>
              </h1>
              <Link to="/cardapios">
                <Button
                  size="lg"
                  variant="outline"
                  className="cta-text rounded-none border border-background/90 bg-transparent text-background tracking-[0.2em] uppercase px-5 py-2 h-auto text-[11px] md:px-10 md:py-3 md:text-sm hover:bg-background/10"
                >
                  Pedir Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Selo do prêmio */}
        <img
          src={seloAsset.url}
          alt="Selo Veja Comer & Beber 2026/2027 — Boleta, melhor rotisseria de São Paulo"
          className="absolute top-24 right-4 md:top-[84px] md:right-8 lg:top-auto lg:bottom-20 z-10 w-24 md:w-36 lg:w-48 h-auto"
        />
      </section>

      {/* Banner duplo – Peça pelo nosso site */}
      <section className="grid grid-cols-1 md:grid-cols-2 h-[85vh] md:h-[90vh]">
        <div className="h-full overflow-hidden">
          <img src={heroImage} alt="Sacolas Boleta" className="w-full h-full object-cover" />
        </div>
        <div className="bg-primary flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-[1.1] mb-4">
            Peça pelo<br />nosso <span className="normal-case">Site</span>!
          </h2>
          <p className="text-primary-foreground/80 text-base md:text-lg mb-4 max-w-sm">
            Monte seu pedido online, agende a entrega e receba tudo na sua casa.
          </p>
          <Link to="/cardapios">
            <Button size="lg" variant="outline" className="cta-text border-background text-primary-foreground bg-transparent hover:bg-background/10 rounded-full px-8">
              Pedir Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Dicas de Preparo */}
      <section className="relative bg-background">
        <div className="absolute inset-0 w-1/2 hidden md:block" style={{ backgroundImage: `url(${losangoBgAsset.url})`, backgroundSize: '900px', backgroundRepeat: 'repeat', opacity: 0.25 }} />
        <div className="absolute inset-0 md:hidden" style={{ backgroundImage: `url(${losangoBgAsset.url})`, backgroundSize: '900px', backgroundRepeat: 'repeat', opacity: 0.25 }} />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 h-[85vh] md:h-[90vh]">
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
          {/* Vídeo à direita */}
          <div className="min-h-[40vh] md:min-h-full bg-muted flex items-center justify-center overflow-hidden">
            <video
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
      <section id="na-midia" className="relative py-10 md:py-14 bg-background scroll-mt-20">
        <div className="absolute inset-0" style={{ backgroundImage: `url(${quadriculadoMidiaBgAsset.url})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'repeat', opacity: 0.9 }} />
        
        <div className="relative z-10 container">
          <div className="bg-background rounded-2xl px-6 py-4 md:px-8 md:py-5 inline-block mb-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Na mídia</h2>
            <p className="text-muted-foreground text-sm md:text-base mt-1">
              <span className="text-destructive">★★★★</span> no Guia Comer & Beber da Veja São Paulo
            </p>
          </div>
          <NoticiasGrid noticias={NOTICIAS.slice(0, 2)} />
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
