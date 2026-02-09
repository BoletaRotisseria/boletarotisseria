import { Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CafePage() {
  return (
    <div className="container py-10 md:py-16">
      <div className="text-center mb-12">
        <Coffee className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Café</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Opções rápidas para o seu dia. Visite nosso espaço ou peça para levar.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-secondary/50 rounded-lg p-8 md:p-12 text-center">
          <h2 className="font-serif text-2xl md:text-3xl mb-4">Visite Nosso Espaço</h2>
          <p className="text-muted-foreground mb-6">
            Café coado na hora, pães artesanais, sanduíches e doces frescos. 
            Um ambiente acolhedor para seu café da manhã ou lanche da tarde.
          </p>
          <Link to="/menu">
            <Button className="cta-text">Ver Opções de Café</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
