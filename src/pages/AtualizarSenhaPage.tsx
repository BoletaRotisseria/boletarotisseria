import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function AtualizarSenhaPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invalidLink, setInvalidLink] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      setInvalidLink(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) { setError("A senha deve ter no mínimo 8 caracteres."); return; }
    if (password !== confirm) { setError("As senhas não coincidem."); return; }

    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/entrar", { replace: true }), 3000);
    }
    setLoading(false);
  };

  if (invalidLink) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4 animate-[fadeIn_0.4s_ease-out] text-center">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <h1 className="font-sans text-2xl font-bold tracking-[-0.06em] text-foreground">Link inválido ou expirado</h1>
          <p className="font-sans text-sm text-muted-foreground tracking-[-0.02em]">
            Solicite uma nova redefinição de senha.
          </p>
          <Button variant="outline" onClick={() => navigate("/recuperar-senha")} className="font-sans tracking-[-0.02em]">
            Recuperar senha
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4 animate-[fadeIn_0.4s_ease-out] text-center">
          <CheckCircle2 className="h-10 w-10 text-accent mx-auto" />
          <h1 className="font-sans text-2xl font-bold tracking-[-0.06em] text-foreground">Senha atualizada!</h1>
          <p className="font-sans text-sm text-muted-foreground tracking-[-0.02em]">
            Sua senha foi atualizada com sucesso. Redirecionando para login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 animate-[fadeIn_0.4s_ease-out]">
        <div className="space-y-1">
          <h1 className="font-sans text-3xl font-bold tracking-[-0.06em] text-foreground">Nova Senha</h1>
          <p className="font-sans text-sm tracking-[-0.02em] text-muted-foreground">
            Defina sua nova senha de acesso
          </p>
        </div>

        {error && (
          <div className="animate-[fadeIn_0.3s_ease-out] rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm font-sans text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground">Nova senha</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" className="h-11 font-sans tracking-[-0.02em]" />
          </div>
          <div className="space-y-1.5">
            <Label className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground">Confirmar nova senha</Label>
            <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repita a senha" className="h-11 font-sans tracking-[-0.02em]" />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-11 font-sans font-semibold tracking-[-0.02em] transition-all duration-200 active:scale-[0.98]">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Atualizar Senha"}
          </Button>
        </form>
      </div>
    </div>
  );
}
