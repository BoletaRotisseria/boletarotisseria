import chefImage from "@/assets/boleta-chef.jpg";
import vamosBoletarAsset from "@/assets/vamos-boletar.svg.asset.json";
import { NOTICIAS } from "@/lib/noticias";
import { NoticiasGrid } from "@/components/NoticiasGrid";

export default function CafePage() {
  return (
    <div className="container py-10 md:py-16">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">Nossa História</h1>

        <div className="md:float-right md:ml-8 md:mb-6 md:w-72 lg:w-80 mb-6">
          <img src={chefImage} alt="Chef Roberto e Luciana" className="w-full rounded-lg object-cover" />
        </div>

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
          <img
            src={vamosBoletarAsset.url}
            alt="Vamos Boletar?!"
            className="h-auto w-52 md:w-64"
          />
        </div>

        <section className="clear-both mt-16">
          <h2 className="font-serif normal-case text-2xl md:text-3xl font-bold text-foreground mb-4">Roberto</h2>
          <div className="space-y-5 text-foreground/80 text-sm md:text-base leading-relaxed">
            <p>
              Chef Roberto, cozinheiro por vocação e apaixonado pela mesa como lugar de encontro. Afinal, as melhores histórias sempre começam na cozinha: no aroma que invade a casa, na panela que cozinha lentamente, nas receitas que passam de geração em geração, carregando memórias e afeto.
            </p>
            <p>
              Roberto se formou em Economia e foi para a França, onde cursou quatro anos de Cordon Bleu. Trabalhou no Hotel George V, na maison Fauchon e no restaurante Taillevent, sempre aprimorando seus conhecimentos, técnicas e sabores.
            </p>
            <p>
              Sua história também é marcada por uma herança familiar. Filho de mãe libanesa e pai de origem judaico-alemã, cresceu cercado pelos aromas e sabores das cozinhas de suas avós, onde aprendeu que cozinhar é, antes de tudo, uma forma de demonstrar amor. Foi entre receitas de família, vivências e mesas sempre fartas que nasceu sua paixão pela culinária.
            </p>
            <p>
              Ao longo de sua trajetória, Roberto construiu uma sólida carreira na gastronomia, passando por restaurantes, buffets e eventos, até reunir toda essa experiência para criar o Boleta.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-serif normal-case text-2xl md:text-3xl font-bold text-foreground mb-4">Luciana</h2>
          <div className="space-y-5 text-foreground/80 text-sm md:text-base leading-relaxed">
            <p>
              À frente da loja está a Luciana, sócia e esposa, presença frequente e sorridente que acolhe e cativa os clientes que adentram as portas do Boleta. Formada em Administração de Empresas e em Propaganda e Marketing, teve uma carreira em multinacionais, onde aprendeu gestão e organização. Mas hoje se realiza neste projeto que transforma trabalho em propósito.
            </p>
            <p>
              “Sempre acreditei que cozinhar é apenas uma parte do que significa receber bem. O verdadeiro cuidado está nos detalhes: na escolha de cada produto, na mesa posta com carinho, na embalagem que chega impecável, na conversa com cada cliente e na vontade de facilitar o dia a dia sem abrir mão da boa comida.
            </p>
            <p>
              No Boleta, encontrei a oportunidade de transformar essa forma de enxergar a hospitalidade em um trabalho diário. Ao lado do Roberto, participo de cada etapa da construção da marca, da comunicação e do relacionamento com nossos clientes. Gosto de pensar em cada decisão e tornar o Boleta um lugar acolhedor, onde as pessoas encontram comida de verdade e se sentem em casa.”
            </p>
          </div>
        </section>

        <div id="na-midia" className="clear-both mt-16 scroll-mt-24">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">Na mídia</h2>
          <p className="text-foreground/80 text-sm md:text-base leading-relaxed mb-6">
            Todas as notícias e prêmios do Boleta na imprensa.
          </p>
          <NoticiasGrid noticias={NOTICIAS} />
        </div>
      </div>
    </div>
  );
}
