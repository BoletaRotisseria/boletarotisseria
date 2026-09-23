export interface Noticia {
  source: string;
  title: string;
  excerpt: string;
  link: string;
  image: string;
  imagePosition?: string;
  isNew?: boolean;
}

export const NOTICIAS: Noticia[] = [
  {
    source: "VEJA SÃO PAULO",
    title: "Comer & Beber 2026: Boleta é eleita a melhor rotisseria de São Paulo",
    excerpt: "O Boleta levou o prêmio de melhor rotisseria do Guia Comer & Beber 2026, da Veja São Paulo.",
    link: "https://vejasp.abril.com.br/coluna/delicia-de-conta/comer-e-beber-2026-boleta-melhor-rotisseria/",
    image: "https://vejasp.abril.com.br/wp-content/uploads/2026/09/Boleta-Tortelli-de-chevre-com-molho-siciliano-040.jpg?quality=70&strip=info&w=600&h=400&crop=1",
    isNew: true,
  },
  {
    source: "VEJA SÃO PAULO",
    title: "Comer & Beber 2026: Roberto Eid Philipp é o chef de rotisseria do ano",
    excerpt: "O chef do Boleta foi eleito o chef de rotisseria do ano pelo Guia Comer & Beber 2026, da Veja São Paulo.",
    link: "https://vejasp.abril.com.br/coluna/delicia-de-conta/comer-e-beber-2026-roberto-eid-philipp-chef-de-rotisseria-do-ano/",
    image: "https://vejasp.abril.com.br/wp-content/uploads/2026/09/Boleta-Roberto-Eid-Philipp-012.jpg?quality=70&strip=info&w=600&h=400&crop=1",
    imagePosition: "center top",
    isNew: true,
  },
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
];
