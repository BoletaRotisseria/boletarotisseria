import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCliente } from "@/hooks/useCliente";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogOut, User, Mail, Phone, MapPin, Calendar, FileText, Pencil, Save, X, Package, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { maskPhone, maskCEP } from "@/lib/validators";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSafeErrorMessage } from "@/lib/errors";

type EditState = {
  nome_completo: string;
  telefone: string;
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento: string;
};

const emptyEdit: EditState = {
  nome_completo: "", telefone: "", cep: "", estado: "",
  cidade: "", bairro: "", rua: "", numero: "", complemento: "",
};

export default function ContaPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { cliente, isLoading: clienteLoading, isComplete } = useCliente();
  const userId = user?.id;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [form, setForm] = useState<EditState>(emptyEdit);

  useEffect(() => {
    if (!authLoading && !userId && location.pathname !== "/entrar") {
      navigate("/entrar?redirectTo=/conta", { replace: true });
    }
  }, [userId, authLoading, navigate, location.pathname]);

  useEffect(() => {
    if (userId && !clienteLoading && !isComplete && location.pathname !== "/completar-cadastro") {
      navigate("/completar-cadastro", { replace: true });
    }
  }, [userId, clienteLoading, isComplete, navigate, location.pathname]);

  const startEdit = () => {
    setForm({
      nome_completo: cliente?.nome_completo ?? "",
      telefone: cliente?.telefone ? maskPhone(cliente.telefone) : "",
      cep: cliente?.cep ? maskCEP(cliente.cep) : "",
      estado: cliente?.estado ?? "",
      cidade: cliente?.cidade ?? "",
      bairro: cliente?.bairro ?? "",
      rua: cliente?.rua ?? "",
      numero: cliente?.numero ?? "",
      complemento: cliente?.complemento ?? "",
    });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm(emptyEdit);
  };

  const handleCepBlur = async () => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((f) => ({
          ...f,
          estado: data.uf || f.estado,
          cidade: data.localidade || f.cidade,
          bairro: data.bairro || f.bairro,
          rua: data.logradouro || f.rua,
        }));
      }
    } catch {
      // silent
    } finally {
      setCepLoading(false);
    }
  };

  const save = async () => {
    if (!userId) return;
    if (form.nome_completo.trim().split(/\s+/).length < 2) {
      toast.error("Informe nome e sobrenome.");
      return;
    }
    const telDigits = form.telefone.replace(/\D/g, "");
    if (telDigits.length < 10) {
      toast.error("Telefone inválido.");
      return;
    }
    setSaving(true);
    const payload = {
      nome_completo: form.nome_completo.trim(),
      telefone: telDigits,
      cep: form.cep.replace(/\D/g, ""),
      estado: form.estado.trim().toUpperCase().slice(0, 2),
      cidade: form.cidade.trim(),
      bairro: form.bairro.trim(),
      rua: form.rua.trim(),
      numero: form.numero.trim(),
      complemento: form.complemento.trim() || null,
      atualizado_em: new Date().toISOString(),
    };
    const { error } = await supabase.from("clientes").update(payload).eq("id", userId);
    if (error) {
      toast.error(getSafeErrorMessage(error));
      setSaving(false);
      return;
    }
    // Sync to Shopify (não bloqueia se falhar)
    try {
      await supabase.functions.invoke("shopify-customer-sync", {
        body: {
          nome_completo: payload.nome_completo,
          cpf: cliente?.cpf ?? "",
          email: cliente?.email ?? user?.email ?? "",
          telefone: payload.telefone,
        },
      });
    } catch (e) {
      console.warn("shopify-customer-sync falhou (ignorado)", e);
    }
    await queryClient.invalidateQueries({ queryKey: ["cliente", userId] });
    toast.success("Dados atualizados.");
    setEditing(false);
    setSaving(false);
  };

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

  const enderecoTxt = cliente && cliente.rua
    ? `${cliente.rua}, ${cliente.numero}${cliente.complemento ? ` - ${cliente.complemento}` : ""} — ${cliente.bairro}, ${cliente.cidade}/${cliente.estado} — CEP ${cliente.cep}`
    : "Preenchido automaticamente no primeiro pedido de entrega.";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8 animate-[fadeIn_0.5s_ease-out]">
        <div className="text-center space-y-1">
          <h1 className="font-serif text-3xl font-bold tracking-[-0.02em] text-foreground">Minha Conta</h1>
          <p className="font-sans text-sm tracking-[-0.02em] text-muted-foreground">
            Olá, {cliente?.nome_completo || user.email}
          </p>
        </div>

        {!editing ? (
          <>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3 animate-[fadeIn_0.6s_ease-out]">
              <InfoRow icon={<User className="h-4 w-4" />} label="Nome" value={cliente?.nome_completo || "—"} />
              <InfoRow icon={<Mail className="h-4 w-4" />} label="E-mail" value={cliente?.email || user.email || "—"} />
              <InfoRow icon={<FileText className="h-4 w-4" />} label="CPF" value={cliente?.cpf ? cliente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : "—"} />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="Telefone" value={cliente?.telefone ? maskPhone(cliente.telefone) : "—"} />
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="Endereço" value={enderecoTxt} />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="Membro desde" value={cliente?.criado_em ? new Date(cliente.criado_em).toLocaleDateString("pt-BR") : "—"} />
            </div>

            <Button variant="outline" onClick={startEdit} className="w-full font-sans tracking-[-0.02em]">
              <Pencil className="h-4 w-4 mr-2" />
              Editar dados
            </Button>

            <PedidosSection userId={userId!} />
          </>
        ) : (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <p className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground font-semibold">Dados pessoais</p>

            <Field label="Nome completo">
              <Input
                value={form.nome_completo}
                onChange={(e) => setForm({ ...form, nome_completo: e.target.value })}
                className="h-11 font-sans"
              />
            </Field>

            <Field label="Telefone / WhatsApp">
              <Input
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })}
                placeholder="(11) 99999-9999"
                className="h-11 font-sans"
              />
            </Field>

            <p className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground font-semibold pt-2">Endereço</p>

            <Field label="CEP">
              <div className="relative">
                <Input
                  value={form.cep}
                  onChange={(e) => setForm({ ...form, cep: maskCEP(e.target.value) })}
                  onBlur={handleCepBlur}
                  placeholder="00000-000"
                  className="h-11 font-sans"
                />
                {cepLoading && <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3.5 text-muted-foreground" />}
              </div>
            </Field>

            <div className="grid grid-cols-[1fr_80px] gap-3">
              <Field label="Cidade">
                <Input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} className="h-11 font-sans" />
              </Field>
              <Field label="UF">
                <Input value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value.toUpperCase().slice(0, 2) })} className="h-11 font-sans" />
              </Field>
            </div>

            <Field label="Bairro">
              <Input value={form.bairro} onChange={(e) => setForm({ ...form, bairro: e.target.value })} className="h-11 font-sans" />
            </Field>

            <div className="grid grid-cols-[1fr_100px] gap-3">
              <Field label="Rua">
                <Input value={form.rua} onChange={(e) => setForm({ ...form, rua: e.target.value })} className="h-11 font-sans" />
              </Field>
              <Field label="Número">
                <Input value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} className="h-11 font-sans" />
              </Field>
            </div>

            <Field label="Complemento (opcional)">
              <Input value={form.complemento} onChange={(e) => setForm({ ...form, complemento: e.target.value })} className="h-11 font-sans" />
            </Field>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={cancelEdit} disabled={saving} className="flex-1">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={save} disabled={saving} className="flex-1">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Save className="h-4 w-4 mr-2" />Salvar</>)}
              </Button>
            </div>

            <p className="font-sans text-xs text-muted-foreground pt-1">
              Para alterar e-mail ou CPF, entre em contato pelo WhatsApp.
            </p>
          </div>
        )}

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
      <span className="font-sans text-sm text-foreground tracking-[-0.02em] flex-1">{value}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

type ShopifyOrder = {
  id: number;
  name: string;
  created_at: string;
  financial_status: string | null;
  fulfillment_status: string | null;
  cancelled_at: string | null;
  total_price: string;
  currency: string;
  order_status_url: string | null;
  line_items: { title: string; quantity: number; variant_title: string | null }[];
};

function statusInfo(o: ShopifyOrder): { label: string; tone: string; active: boolean } {
  if (o.cancelled_at) return { label: "Cancelado", tone: "bg-destructive/10 text-destructive", active: false };
  if (o.fulfillment_status === "fulfilled") return { label: "Entregue", tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400", active: false };
  if (o.fulfillment_status === "partial") return { label: "Entrega parcial", tone: "bg-amber-500/10 text-amber-700 dark:text-amber-400", active: true };
  if (o.financial_status === "paid") return { label: "Em preparo", tone: "bg-primary/10 text-primary", active: true };
  if (o.financial_status === "pending") return { label: "Aguardando pagamento", tone: "bg-amber-500/10 text-amber-700 dark:text-amber-400", active: true };
  if (o.financial_status === "refunded") return { label: "Reembolsado", tone: "bg-muted text-muted-foreground", active: false };
  return { label: "Em andamento", tone: "bg-primary/10 text-primary", active: true };
}

function PedidosSection({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["pedidos-shopify", userId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<{ orders: ShopifyOrder[] }>("shopify-customer-orders", { body: {} });
      if (error) throw error;
      return data?.orders ?? [];
    },
    staleTime: 60_000,
  });

  const orders = data ?? [];
  const ativos = orders.filter((o) => statusInfo(o).active);
  const passados = orders.filter((o) => !statusInfo(o).active);

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4 animate-[fadeIn_0.6s_ease-out]">
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-muted-foreground" />
        <h2 className="font-serif text-lg tracking-[-0.02em] text-foreground">Meus pedidos</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="font-sans text-sm text-muted-foreground">Não foi possível carregar seus pedidos agora.</p>
      ) : orders.length === 0 ? (
        <p className="font-sans text-sm text-muted-foreground">Você ainda não tem pedidos.</p>
      ) : (
        <div className="space-y-5">
          {ativos.length > 0 && (
            <div className="space-y-2">
              <p className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground font-semibold">Em andamento</p>
              {ativos.map((o) => <PedidoCard key={o.id} o={o} />)}
            </div>
          )}
          {passados.length > 0 && (
            <div className="space-y-2">
              <p className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground font-semibold">Histórico</p>
              {passados.map((o) => <PedidoCard key={o.id} o={o} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PedidoCard({ o }: { o: ShopifyOrder }) {
  const s = statusInfo(o);
  const data = new Date(o.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  const total = Number(o.total_price).toLocaleString("pt-BR", { style: "currency", currency: o.currency || "BRL" });
  return (
    <div className="rounded-lg border border-border/60 bg-background/50 p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-sans text-sm font-semibold tracking-[-0.02em] text-foreground">Pedido {o.name}</p>
          <p className="font-sans text-xs text-muted-foreground tracking-[-0.02em]">{data} · {total}</p>
        </div>
        <span className={`font-sans text-[10px] uppercase tracking-wider px-2 py-1 rounded-full whitespace-nowrap ${s.tone}`}>
          {s.label}
        </span>
      </div>
      {o.line_items.length > 0 && (
        <ul className="font-sans text-xs text-muted-foreground tracking-[-0.02em] space-y-0.5">
          {o.line_items.slice(0, 4).map((li, i) => (
            <li key={i}>· {li.quantity}× {li.title}{li.variant_title ? ` (${li.variant_title})` : ""}</li>
          ))}
          {o.line_items.length > 4 && <li className="italic">+ {o.line_items.length - 4} item(ns)</li>}
        </ul>
      )}
      {o.order_status_url && (
        <a
          href={o.order_status_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-sans text-xs text-primary hover:underline tracking-[-0.02em]"
        >
          Acompanhar pedido <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}
