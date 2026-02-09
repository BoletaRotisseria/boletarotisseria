import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";
import boletaLogo from "@/assets/boleta-logo.jpeg";

const Index = () => {
  return (
    <>
      {/* Cover – Logo + Two Collages */}
      <section className="bg-foreground">
        {/* Logo */}
        <div className="flex items-center justify-center pt-10 pb-6 md:pt-14 md:pb-8">
          <img
            src={boletaLogo}
            alt="Boleta Rotisseria"
            className="h-[20vh] md:h-[22vh] lg:h-[25vh] rounded-lg shadow-lg"
          />
        </div>

        {/* Two collage links */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[50vh]">
          {/* Left – Cardápio Semanal */}
          <Link
            to="/semana"
            className="relative group overflow-hidden flex items-center justify-center min-h-[40vh] md:min-h-[50vh]"
          >
            <img
              src={heroImage}
              alt="Cardápio Semanal"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-foreground/50 group-hover:bg-foreground/40 transition-colors duration-300" />
            <div className="relative z-10 text-center px-6">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-background mb-3 drop-shadow-lg">
                Cardápio Semanal
              </h2>
              <p className="text-background/80 text-base md:text-lg max-w-xs mx-auto">
                Pratos frescos da semana, prontos para aquecer.
              </p>
            </div>
          </Link>

          {/* Right – Rotisserie */}
          <Link
            to="/rotisserie"
            className="relative group overflow-hidden flex items-center justify-center min-h-[40vh] md:min-h-[50vh] border-t md:border-t-0 md:border-l border-background/10"
          >
            <div className="absolute inset-0 diamond-pattern opacity-30" />
            <div className="absolute inset-0 bg-primary/80 group-hover:bg-primary/70 transition-colors duration-300" />
            <div className="relative z-10 text-center px-6">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-3 drop-shadow-lg">
                Rotisserie
              </h2>
              <p className="text-primary-foreground/80 text-base md:text-lg max-w-xs mx-auto">
                Clássicos da casa, empório e muito mais.
              </p>
            </div>
          </Link>
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

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { title: "Fresco & Artesanal", desc: "Ingredientes selecionados, receitas da casa." },
              { title: "Prático & Rápido", desc: "Peça e receba em casa, pronto para aquecer." },
              { title: "Sem Taxas de App", desc: "Pedido direto, mais economia pra você." },
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
            Simples, seguro e sem taxas de aplicativo.
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
