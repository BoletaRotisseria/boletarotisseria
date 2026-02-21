import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function EntrarPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    const { error: err } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (err) {
      setError(err.message || "Erro ao conectar com o Google.");
      setGoogleLoading(false);
    }
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

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground font-sans">ou</span>
          </div>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="group w-full flex items-center justify-center gap-3 h-11 rounded-md border border-border bg-card font-sans text-sm font-medium tracking-[-0.02em] text-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:border-foreground/20 active:scale-[0.98] disabled:opacity-60"
        >
          {googleLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Continuar com Google</span>
            </>
          )}
        </button>

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
