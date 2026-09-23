import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/boleta-cestas.jpg";
import capaMesaAsset from "@/assets/capa-mesa.jpg.asset.json";
import seloAsset from "@/assets/selo-comer-beber-transp.png.asset.json";
import perfectlyNinetiesAsset from "@/assets/perfectly-nineties.otf.asset.json";
import papelSedaBg from "@/assets/papel-seda-boleta.jpg";
import quadriculadoMidiaBg from "@/assets/quadriculado-midia-bg.jpg";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  useEffect(() => {
    const font = new FontFace("Perfectly Nineties", `url(${perfectlyNinetiesAsset.url})`);
    font.load().then((loadedFont) => document.fonts.add(loadedFont)).catch(() => undefined);
  }, []);

  return (
    <>
      {/* Capa – hero fixa */}
      <section className="relative h-[85vh] md:h-screen overflow-hidden">
        <img
          src={capaMesaAsset.url}
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
                  className="cta-text rounded-none border border-background/90 bg-transparent text-background tracking-[0.2em] uppercase px-10 hover:bg-background/10"
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
          className="absolute bottom-14 right-4 md:bottom-20 md:right-8 z-10 w-28 md:w-40 lg:w-48 h-auto"
        />
      </section>

      {/* Banner duplo – Peça pelo nosso site */}
      <section className="grid grid-cols-1 md:grid-cols-2 h-[85vh] md:h-[90vh]">
        <div className="h-full overflow-hidden">
          <img src={heroImage} alt="Sacolas Boleta" className="w-full h-full object-cover" />
        </div>
        <div className="bg-primary flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-[1.1] mb-4">
            Peça pelo<br />nosso site!
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
        <div className="absolute inset-0 w-1/2 hidden md:block" style={{ backgroundImage: `url(${papelSedaBg})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.37 }} />
        <div className="absolute inset-0 md:hidden" style={{ backgroundImage: `url(${papelSedaBg})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.37 }} />
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
        <div className="absolute inset-0" style={{ backgroundImage: `url(${quadriculadoMidiaBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'repeat', opacity: 0.9 }} />
        
        <div className="relative z-10 container">
          <div className="bg-background rounded-2xl px-6 py-4 md:px-8 md:py-5 inline-block mb-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Na mídia</h2>
            <p className="text-muted-foreground text-sm md:text-base mt-1">
              <span className="text-destructive">★★★★</span> no Guia Comer & Beber da Veja São Paulo
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                source: "VEJA SÃO PAULO",
                title: "Roberto Eid Philipp, da Boleta, participa de evento na França",
                excerpt: "Único paulistano a integrar o festival no Carreau du Temple, em Paris, levando cuscuz paulista e manjar de coco.",
                link: "https://vejasp.abril.com.br/coluna/delicia-de-conta/comer-e-beber-chef-rotisseria-boleta-participa-de-evento-na-franca/",
                image: "https://vejasp.abril.com.br/wp-content/uploads/2025/09/Roberto-Eid-Phillip.jpg?quality=70&strip=info&w=600&h=400&crop=1",
                imagePosition: "center top",
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
                className="group bg-background rounded-2xl border border-border/50 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                <div className="w-full h-40 rounded-xl overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" style={"imagePosition" in item ? { objectPosition: item.imagePosition as string } : undefined} loading="lazy" />
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                        {item.source}
                      </span>
                      {"isNew" in item && item.isNew && (
                        <span className="text-[9px] font-bold tracking-wider uppercase bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-full">
                          Novo
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-base font-bold mb-1.5 leading-snug group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">{item.excerpt}</p>
                  </div>
                  <span className="mt-3 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Vem ler tudo aqui →
                  </span>
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
