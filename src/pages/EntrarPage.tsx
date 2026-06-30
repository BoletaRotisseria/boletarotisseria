import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function EntrarPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const redirectTo = searchParams.get("redirectTo") || "/conta";

  useEffect(() => {
    if (!authLoading && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, authLoading, navigate, redirectTo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) { setError("Informe um e-mail válido."); return; }
    if (!password) { setError("Informe sua senha."); return; }

    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });

    if (err) {
      if (err.message.includes("Invalid login")) {
        setError("E-mail ou senha incorretos.");
      } else if (err.message.includes("Email not confirmed")) {
        setError("Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.");
      } else if (err.message.includes("rate") || err.status === 429) {
        setError("Muitas tentativas. Aguarde alguns minutos e tente novamente.");
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 animate-[fadeIn_0.4s_ease-out]">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl font-bold tracking-[-0.02em] text-foreground">Entrar</h1>
          <p className="font-sans text-sm tracking-[-0.02em] text-muted-foreground">
            Acesse sua conta para continuar
          </p>
        </div>

        {error && (
          <div className="animate-[fadeIn_0.3s_ease-out] rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm font-sans text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="h-11 font-sans tracking-[-0.02em]"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground">
                Senha
              </Label>
              <Link
                to="/recuperar-senha"
                className="font-sans text-xs tracking-[-0.02em] text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
              >
                Esqueci a senha
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 font-sans tracking-[-0.02em]"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 font-sans font-semibold tracking-[-0.02em] transition-all duration-200 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
          </Button>
        </form>


        <p className="text-center font-sans text-sm tracking-[-0.02em] text-muted-foreground">
          Não tem conta?{" "}
          <Link to="/criar-conta" className="text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
