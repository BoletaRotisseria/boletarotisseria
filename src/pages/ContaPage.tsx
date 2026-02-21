import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCliente } from "@/hooks/useCliente";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, User, Mail, Phone, MapPin, Calendar, FileText } from "lucide-react";
import { dateIsoToBr } from "@/lib/validators";

export default function ContaPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { cliente, isLoading: clienteLoading, isComplete } = useCliente();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/entrar?redirectTo=/conta", { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && !clienteLoading && !isComplete) {
      navigate("/completar-cadastro", { replace: true });
    }
  }, [user, clienteLoading, isComplete, navigate]);

  if (authLoading || clienteLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate("/entrar", { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 animate-[fadeIn_0.5s_ease-out]">
        <div className="text-center space-y-1">
          <h1 className="font-serif text-3xl font-bold tracking-[-0.02em] text-foreground">Minha Conta</h1>
          <p className="font-sans text-sm tracking-[-0.02em] text-muted-foreground">
            Olá, {cliente?.nome_completo || user.email}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3 animate-[fadeIn_0.6s_ease-out]">
          <InfoRow icon={<User className="h-4 w-4" />} label="Nome" value={cliente?.nome_completo || "—"} />
          <InfoRow icon={<Mail className="h-4 w-4" />} label="E-mail" value={cliente?.email || user.email || "—"} />
          <InfoRow icon={<FileText className="h-4 w-4" />} label="CPF" value={cliente?.cpf ? cliente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : "—"} />
          <InfoRow icon={<Phone className="h-4 w-4" />} label="Telefone" value={cliente?.telefone || "—"} />
          
          <InfoRow
            icon={<MapPin className="h-4 w-4" />}
            label="Endereço"
            value={cliente ? `${cliente.rua}, ${cliente.numero}${cliente.complemento ? ` - ${cliente.complemento}` : ""} — ${cliente.bairro}, ${cliente.cidade}/${cliente.estado} — CEP ${cliente.cep}` : "—"}
          />
          <InfoRow icon={<Calendar className="h-4 w-4" />} label="Membro desde" value={cliente?.criado_em ? new Date(cliente.criado_em).toLocaleDateString("pt-BR") : "—"} />
        </div>

        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full font-sans tracking-[-0.02em] text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border/40 last:border-0">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <span className="font-sans text-xs text-muted-foreground tracking-[-0.02em] uppercase w-20 shrink-0">{label}</span>
      <span className="font-sans text-sm text-foreground tracking-[-0.02em]">{value}</span>
    </div>
  );
}
