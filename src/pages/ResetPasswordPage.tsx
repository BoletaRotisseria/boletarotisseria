import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    // Also check URL hash for recovery token
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    }
    setLoading(false);
  };

  if (!isRecovery) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4 text-center animate-[fadeIn_0.4s_ease-out]">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
          <p className="font-sans text-sm tracking-[-0.02em] text-muted-foreground">
            Verificando link de recuperação...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 animate-[fadeIn_0.4s_ease-out]">
        <div className="space-y-1">
          <h1 className="font-sans text-3xl font-bold tracking-[-0.06em] text-foreground">
            Nova Senha
          </h1>
          <p className="font-sans text-sm tracking-[-0.02em] text-muted-foreground">
            Defina sua nova senha
          </p>
        </div>

        {success ? (
          <div className="animate-[fadeIn_0.3s_ease-out] rounded-lg border border-accent/30 bg-accent/5 px-4 py-5 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
            <p className="font-sans text-sm tracking-[-0.02em] text-foreground">
              Senha atualizada! Redirecionando...
            </p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground">
                Nova senha
              </Label>
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
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground">
                Confirmar senha
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="h-11 font-sans tracking-[-0.02em]"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 font-sans font-semibold tracking-[-0.02em] transition-all duration-200 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Nova Senha"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
