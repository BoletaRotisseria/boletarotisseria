import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CalendarDays } from "lucide-react";

export default function EventosPage() {
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", mensagem: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Solicitação enviada!", { description: "Entraremos em contato em breve." });
    setForm({ nome: "", email: "", telefone: "", mensagem: "" });
  };

  return (
    <div className="container py-10 md:py-16">
      <div className="text-center mb-12">
        <CalendarDays className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Eventos</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Encomendas maiores e corporativas. Conte com a qualidade Boleta para o seu evento.
        </p>
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
