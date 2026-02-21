import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/atualizar-senha`,
    });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 animate-[fadeIn_0.4s_ease-out]">
        <Link to="/entrar" className="flex items-center gap-1.5 font-sans text-xs tracking-[-0.02em] text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao login
        </Link>

        <div className="space-y-1">
          <h1 className="font-sans text-3xl font-bold tracking-[-0.06em] text-foreground">Recuperar Senha</h1>
          <p className="font-sans text-sm tracking-[-0.02em] text-muted-foreground">
            Informe seu e-mail para receber o link de redefinição
          </p>
        </div>

        {sent ? (
          <div className="animate-[fadeIn_0.3s_ease-out] rounded-lg border border-accent/30 bg-accent/5 px-4 py-5 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
            <p className="font-sans text-sm tracking-[-0.02em] text-foreground">
              Se este e-mail existir, você receberá um link para redefinir a senha.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="h-11 font-sans tracking-[-0.02em]"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 font-sans font-semibold tracking-[-0.02em] transition-all duration-200 active:scale-[0.98]">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar Link"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
