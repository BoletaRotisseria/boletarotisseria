import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

type AuthView = "login" | "signup" | "forgot";

export default function AuthPage() {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setSuccess(null);
  };

  const switchView = (v: AuthView) => {
    resetForm();
    setView(v);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      toast({ title: "Erro ao criar conta", description: error.message, variant: "destructive" });
    } else {
      setSuccess("Verifique seu e-mail para confirmar o cadastro.");
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setSuccess("Enviamos um link de recuperação para seu e-mail.");
    }
    setLoading(false);
  };

  const title = view === "login" ? "Entrar" : view === "signup" ? "Criar Conta" : "Recuperar Senha";
  const subtitle =
    view === "login"
      ? "Entre com e-mail e senha"
      : view === "signup"
      ? "Preencha seus dados para começar"
      : "Informe seu e-mail para redefinir a senha";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 animate-[fadeIn_0.4s_ease-out]">
        {/* Back to login from other views */}
        {view !== "login" && (
          <button
            onClick={() => switchView("login")}
            className="flex items-center gap-1.5 font-sans text-xs tracking-[-0.02em] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao login
          </button>
        )}

        {/* Header */}
        <div className="space-y-1">
          <h1 className="font-sans text-3xl font-bold tracking-[-0.06em] text-foreground">
            {title}
          </h1>
          <p className="font-sans text-sm tracking-[-0.02em] text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {/* Success state */}
        {success ? (
          <div className="animate-[fadeIn_0.3s_ease-out] rounded-lg border border-accent/30 bg-accent/5 px-4 py-5 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
            <p className="font-sans text-sm tracking-[-0.02em] text-foreground">{success}</p>
          </div>
        ) : (
          <form
            onSubmit={view === "login" ? handleLogin : view === "signup" ? handleSignup : handleForgotPassword}
            className="space-y-4"
          >
            {view === "signup" && (
              <div className="space-y-1.5 animate-[fadeIn_0.3s_ease-out]">
                <Label htmlFor="fullName" className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground">
                  Nome completo
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="h-11 font-sans tracking-[-0.02em]"
                />
              </div>
            )}

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
                required
                className="h-11 font-sans tracking-[-0.02em]"
              />
            </div>

            {view !== "forgot" && (
              <div className="space-y-1.5 animate-[fadeIn_0.2s_ease-out]">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground">
                    Senha
                  </Label>
                  {view === "login" && (
                    <button
                      type="button"
                      onClick={() => switchView("forgot")}
                      className="font-sans text-xs tracking-[-0.02em] text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                    >
                      Esqueci a senha
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="h-11 font-sans tracking-[-0.02em]"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 font-sans font-semibold tracking-[-0.02em] transition-all duration-200 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : view === "login" ? (
                "Entrar"
              ) : view === "signup" ? (
                "Criar Conta"
              ) : (
                "Enviar Link"
              )}
            </Button>
          </form>
        )}

        {/* Toggle login/signup */}
        {!success && (
          <p className="text-center font-sans text-sm tracking-[-0.02em] text-muted-foreground">
            {view === "login" ? "Não tem conta?" : view === "signup" ? "Já tem conta?" : ""}{" "}
            {view !== "forgot" && (
              <button
                onClick={() => switchView(view === "login" ? "signup" : "login")}
                className="text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors"
              >
                {view === "login" ? "Criar conta" : "Entrar"}
              </button>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
