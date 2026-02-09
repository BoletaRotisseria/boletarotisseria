import { Link } from "react-router-dom";
import collageSemana from "@/assets/collage-semana.jpg";
import collageRotisserie from "@/assets/collage-rotisserie.jpg";
import boletaLogo from "@/assets/boleta-logo.jpeg";

export default function SplashPage() {
  return (
    <div className="min-h-screen bg-foreground flex flex-col">
      {/* Logo */}
      <div className="flex justify-center pt-8 pb-4 z-10">
        <img src={boletaLogo} alt="Boleta" className="h-14 md:h-20 rounded" />
      </div>

      {/* Two collages */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 px-4 md:px-8 pb-8">
        {/* Left — Cardápio Semanal */}
        <Link
          to="/semana"
          className="group relative flex-1 rounded-2xl overflow-hidden min-h-[40vh] md:min-h-0 cursor-pointer"
        >
          <img
            src={collageSemana}
            alt="Cardápio Semanal"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-sans font-semibold tracking-widest uppercase mb-3">
              Novidade
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-background leading-tight mb-2">
              Cardápio Semanal
            </h2>
            <p className="text-background/70 text-sm md:text-base max-w-sm">
              Pratos frescos e equilibrados, prontos toda semana para o seu dia a dia.
            </p>
          </div>
        </Link>

        {/* Right — Rotisserie */}
        <Link
          to="/rotisserie"
          className="group relative flex-1 rounded-2xl overflow-hidden min-h-[40vh] md:min-h-0 cursor-pointer"
        >
          <img
            src={collageRotisserie}
            alt="Rotisserie"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-sans font-semibold tracking-widest uppercase mb-3">
              Clássico
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-background leading-tight mb-2">
              Rotisserie
            </h2>
            <p className="text-background/70 text-sm md:text-base max-w-sm">
              Terrines, tortas, quiches, massas e muito mais da nossa cozinha artesanal.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
