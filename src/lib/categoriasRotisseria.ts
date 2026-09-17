// Categorias da Rotisseria conforme os setores da Lista de Produtos 2026
export interface CategoriaRotisseria {
  label: string;
  slug: string;
  handles: string[];
}

export const CATEGORIAS_ROTISSERIA: CategoriaRotisseria[] = [
  {
    label: "Antipastos",
    slug: "antipastos",
    handles: [
      "abobrinha-temperada",
      "alcachofra-confitada",
      "alichela-mini",
      "berinjela-desfiada-mini",
      "berinjela-temperada-mini",
      "coalhada-seca-temperada",
      "pate-de-gorgonzola",
      "pate-de-salmao-mini",
      "sardela-mini",
    ],
  },
  {
    label: "Aperitivos",
    slug: "aperitivos",
    handles: [
      "bolinho-de-bacalhau",
      "coxinha-de-frango-frita",
      "croquete-de-carne",
      "dadinho-de-tapioca",
      "doguinho",
      "empadinha-de-camarao",
      "empadinha-de-palmito",
      "esfiha-aberta-de-carne",
      "kibe",
      "queijo-brie-folhado",
      "quiche-de-queijo-mini",
      "salmao-defumado-blinis",
      "pate-de-foie",
    ],
  },
  {
    label: "Pães e Torradas",
    slug: "paes-e-torradas",
    handles: [
      "focaccia-de-alecrim",
      "pao-campagne",
      "pao-multigraos",
      "torrada-pao-sirio",
      "torrada-crackers",
      "torrada-focaccia",
      "lascas-de-polvilho",
    ],
  },
  {
    label: "Saladas",
    slug: "saladas",
    handles: ["salada-de-graos-rotisseria", "salada-proteica"],
  },
  {
    label: "Empanadas",
    slug: "empanadas",
    handles: [
      "empanada-de-carne",
      "empanada-de-carne-picante",
      "empanada-de-queijo-e-cebola",
    ],
  },
  {
    label: "Veggie",
    slug: "veggie",
    handles: ["berinjela-parmegiana-rotisseria"],
  },
  {
    label: "Carnes e Peixes",
    slug: "carne-peixe-e-frango",
    handles: [
      "arroz-de-bacalhau-rotisseria",
      "arroz-de-pato-rotisseria",
      "maminha",
      "picadinho",
      "polpetone",
      "polpetinhas",
      "strogonoff-de-carne",
      "strogonoff-de-frango",
      "tiras-de-frango-com-molho-mostarda",
    ],
  },
  {
    label: "Acompanhamentos",
    slug: "acompanhamentos",
    handles: [
      "farofa-crocante",
      "pure-de-mandioquinha",
      "pure-de-maca-e-maracuja",
    ],
  },
  {
    label: "Massas",
    slug: "massas",
    handles: [
      "capeletti-de-carne-mini",
      "capeletti-in-brodo",
      "ravioli-de-alcachofra",
      "ravioli-de-muzzarela",
      "ravioli-de-ossobuco",
      "ravioli-listrado-caprese",
      "tortelli-de-chevre",
      "sorrentini-de-bufala-com-manjericao",
      "lasanha-bolonhesa",
      "lasanha-de-alcachofra",
      "lasanha-de-ossobuco",
    ],
  },
  {
    label: "Molhos",
    slug: "molhos",
    handles: [
      "molho-bolonhesa",
      "molho-limao-siciliano",
      "molho-parmesao",
      "molho-pesto",
      "molho-roti",
      "molho-pomodoro",
    ],
  },
  {
    label: "Pizza",
    slug: "pizza",
    handles: ["massa-para-pizza"],
  },
  {
    label: "Tortas e Quiches",
    slug: "tortas-e-quiches",
    handles: [
      "torta-de-frango",
      "torta-de-palmito",
      "quiche-de-queijo",
      "quiche-de-queijo-de-cabra-e-tomatinho-cereja",
    ],
  },
  {
    label: "Sopas e Caldos",
    slug: "sopas-e-caldos",
    handles: ["brodo", "sopa-de-cebola", "sopa-de-legumes", "caldo-verde"],
  },
  {
    label: "Sobremesas",
    slug: "sobremesas",
    handles: [
      "quiche-de-chocolate-rotisseria",
      "panelinha-de-palha-italiana",
      "panelinha-de-cookies",
      "cocada-cremosa-de-forno",
      "torta-mousse-de-chocolate",
      "bolo-de-nozes-com-fios-de-ovos",
      "cheesecake-com-frutas-vermelhas",
      "torta-crumble-de-maca",
      "pudim-de-pistache-rotisseria",
      "pudim-de-doce-de-leite",
    ],
  },
];

export const handlesDaCategoria = (slug: string): string[] =>
  CATEGORIAS_ROTISSERIA.find((c) => c.slug === slug)?.handles ?? [];
