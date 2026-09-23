import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function EventosPage() {
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", mensagem: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Solicitação enviada!", { description: "Entraremos em contato em breve." });
    setForm({ nome: "", email: "", telefone: "", mensagem: "" });
  };

  return (
    <div className="container py-10 md:py-16">
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Eventos</h1>
        <div className="space-y-5 text-muted-foreground text-sm md:text-base leading-relaxed">
          <p>
            Seja para um jantar entre amigos ou uma grande festa, adoraríamos fazer parte do seu evento. Queremos levar a alegria e os sabores da Boleta até você, onde quer que esteja.
          </p>
          <p>
            À frente da nossa cozinha está o chef Roberto Eid Philipp, que construiu sua trajetória ao lado da banqueteira Neka Menna Barreto e, mais tarde, como fundador e ex-sócio do Buffet Balsâmico. Hoje, traz toda essa experiência para a Boleta e para cada evento que realizamos.
          </p>
          <p>
            Personalizamos cada ocasião, criando um cardápio pensado especialmente para você, com uma seleção dos seus pratos favoritos e tudo o que é preciso para tornar o momento especial e inesquecível para seus convidados.
          </p>
          <p>
            Conte um pouco sobre o seu evento no formulário abaixo. Entraremos em contato para pensar todos os detalhes com você.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        <Input
          placeholder="Seu nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
        <Input
          type="email"
          placeholder="Seu e-mail"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Input
          type="tel"
          placeholder="Telefone"
          value={form.telefone}
          onChange={(e) => setForm({ ...form, telefone: e.target.value })}
        />
        <Textarea
          placeholder="Conte sobre o seu evento: data, número de convidados, tipo de comida..."
          rows={5}
          value={form.mensagem}
          onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
          required
        />
        <Button type="submit" size="lg" className="cta-text w-full">
          Solicitar Orçamento
        </Button>
      </form>
    </div>
  );
}
