import quadriculadoBg from "@/assets/quadriculado-midia-bg.jpg";

export default function CafePage() {
  return (
    <div>
      {/* Hero banner com quadriculado */}
      <div className="relative h-[35vh] md:h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: `url(${quadriculadoBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 text-center">
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
            CONHEÇA O BOLETA
          </h1>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container py-10 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">Nossa História</h2>

          <div className="space-y-5 text-foreground/80 text-sm md:text-base leading-relaxed">
            <p>
              No início da pandemia, em 2020, resolvemos cozinhar em casa, em família. Todos se envolveram: além de mim - chef Roberto Eid Philipp -, minha esposa Luciana e nossos filhos Manu e Dudu. Desenvolvemos cardápios semanais que imediatamente - e felizmente - caíram no gosto dos amigos. Logo o negócio foi batizado de Boleta em homenagem ao meu apelido!
            </p>
            <p>
              Dois anos depois, a rotisseria ganhou endereço próprio: uma casinha charmosa na concorrida Rua Ferreira de Araújo, próxima aos outros dois empreendimentos da família: a Galeria Estação, de arte popular brasileira, e a Estação São Paulo, espaço de festas e eventos. A loja fica perto também do nosso antigo buffet Balsâmico.
            </p>
            <p>
              São aperitivos, terrines, assados, massas frescas e doces prontos para levar para casa, fáceis de aquecer e servir. Entre os carros-chefes estão a clássica Terrine de pato com pistache, a delicada Lasanha de alcachofra e a Cocada cremosa de forno. Um menu da semana traz sempre novidades. E na entrada do Boleta, temos um empório com vinhos, queijos, geleias e outros produtos artesanais que estou sempre pesquisando, ótimas opções para acompanhar e presentear.
            </p>
            <p>
              Cosmopolita como São Paulo, nosso repertório reúne inspirações de diversas partes do mundo e também minhas memórias de família - árabe de um lado, judaico-alemã de outro. Ainda temos influências do tempo em que morei em Paris, quando estudei na Le Cordon Bleu e trabalhei em cozinhas prestigiadas como Fauchon, Taillevent e George V. E dos anos em que chefiei o buffet da banqueteira Neka Menna Barreto, que me introduziu no universo dos eventos e festas.
            </p>
            <p className="font-serif text-lg md:text-xl font-bold text-foreground">
              Vamos Boletar?!
            </p>
          </div>

          <div className="mt-16">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">Sobre o Boleta</h2>
            <p className="text-foreground/80 text-sm md:text-base leading-relaxed">
              Rotisseria e empório com a assinatura do chef Roberto Eid Philipp, o Boleta. Aperitivos, terrines, massas frescas, assados e doces prontos para levar para casa, além de produtos artesanais para acompanhar ou presentear.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
