import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const categories = [
  {
    title: "Rotisseria",
    description: "Aperitivos, pratos principais, massas, saladas e sobremesas da casa.",
    path: "/rotisserie",
  },
  {
    title: "Empório",
    description: "Antepastos, doces, azeites, temperos e produtos especiais.",
    path: "/emporio",
  },
  {
    title: "Individual",
    description: "Refeições prontas para levar. Praticidade sem abrir mão do sabor.",
    path: "/to-go",
  },
  {
    title: "Presentes",
    description: "Cestas gourmet e sugestões especiais para presentear.",
    path: "/presentes",
  },
  {
    title: "Vinhos",
    description: "Brancos, tintos, rosés, espumantes e champagnes selecionados.",
    path: "/vinhos",
  },
];

export default function CardapiosPage() {
  return (
    <div className="container py-10 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Cardápios</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Explore nossas categorias e descubra tudo o que preparamos para você.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {categories.map((cat) => (
          <Link
            key={cat.title}
            to={cat.path}
            className="group border border-border rounded-lg p-6 md:p-8 flex flex-col justify-between hover:shadow-md hover:border-primary/40 transition-all"
          >
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
                {cat.title}
              </h2>
              <p className="text-muted-foreground text-sm">{cat.description}</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm font-sans font-semibold uppercase tracking-wider text-foreground/60 group-hover:text-primary transition-colors">
              Ver cardápio <ChevronRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
