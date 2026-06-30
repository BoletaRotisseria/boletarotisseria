import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCliente } from "@/hooks/useCliente";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { completarCadastroSchema, type CompletarCadastroFormData, maskCPF, maskPhone } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { getSafeErrorMessage } from "@/lib/errors";
import { useQueryClient } from "@tanstack/react-query";

export default function CompletarCadastroPage() {
  const { user, loading: authLoading } = useAuth();
  const { cliente, isLoading: clienteLoading, isComplete } = useCliente();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<CompletarCadastroFormData>({
    resolver: zodResolver(completarCadastroSchema),
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/entrar", { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && !clienteLoading && isComplete) {
      navigate("/conta", { replace: true });
    }
  }, [user, clienteLoading, isComplete, navigate]);

  // Prefill with existing data
  useEffect(() => {
    if (cliente) {
      reset({
        nome_completo: cliente.nome_completo || user?.user_metadata?.full_name || "",
        cpf: cliente.cpf ? maskCPF(cliente.cpf) : "",
        telefone: cliente.telefone ? maskPhone(cliente.telefone) : "",
      });
    }
  }, [cliente, user, reset]);

  const onSubmit = async (data: CompletarCadastroFormData) => {
    if (!user) return;
    setLoading(true);
    setServerError(null);

    const cpfClean = data.cpf.replace(/\D/g, "");
    const payload = {
      id: user.id,
      nome_completo: data.nome_completo.trim(),
      cpf: cpfClean,
      email: user.email || "",
      telefone: data.telefone.replace(/\D/g, ""),
      atualizado_em: new Date().toISOString(),
    };

    const { error } = await supabase.from("clientes").upsert(payload, { onConflict: "id" });

    if (error) {
      if (error.message.includes("unique") || error.message.includes("cpf")) {
        setServerError("Este CPF já está cadastrado em outra conta.");
      } else {
        setServerError(getSafeErrorMessage(error));
      }
      setLoading(false);
      return;
    }

    // Sincroniza com Shopify (cria/atualiza customer lá)
    try {
      await supabase.functions.invoke("shopify-customer-sync", {
        body: {
          nome_completo: payload.nome_completo,
          cpf: payload.cpf,
          email: payload.email,
          telefone: payload.telefone,
        },
      });
    } catch (e) {
      console.warn("shopify-customer-sync falhou (ignorado)", e);
    }

    await queryClient.invalidateQueries({ queryKey: ["cliente", user.id] });
    navigate("/conta", { replace: true });
    setLoading(false);
  };

  if (authLoading || clienteLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-8">
      <div className="w-full max-w-lg space-y-6 animate-[fadeIn_0.4s_ease-out]">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl font-bold tracking-[-0.02em] text-foreground">Completar Cadastro</h1>
          <p className="font-sans text-sm tracking-[-0.02em] text-muted-foreground">
            Precisamos de alguns dados para continuar
          </p>
        </div>

        {/* Email read-only com opção de trocar */}
        <div className="space-y-1.5">
          <Label className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground">E-mail</Label>
          <Input value={user?.email || ""} disabled className="h-11 font-sans tracking-[-0.02em] bg-muted" />
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/criar-conta", { replace: true });
            }}
            className="font-sans text-xs tracking-[-0.02em] text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
          >
            Usar outro e-mail
          </button>
        </div>

        {serverError && (
          <div className="animate-[fadeIn_0.3s_ease-out] rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm font-sans text-destructive">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldWrapper label="Nome completo" error={errors.nome_completo?.message}>
            <Input {...register("nome_completo")} placeholder="Seu nome completo" className="h-11 font-sans tracking-[-0.02em]" />
          </FieldWrapper>

          <FieldWrapper label="CPF" error={errors.cpf?.message}>
            <Input
              {...register("cpf")}
              placeholder="000.000.000-00"
              className="h-11 font-sans tracking-[-0.02em]"
              onChange={(e) => setValue("cpf", maskCPF(e.target.value))}
              value={watch("cpf") || ""}
            />
          </FieldWrapper>

          <FieldWrapper label="Telefone / WhatsApp" error={errors.telefone?.message}>
            <Input
              {...register("telefone")}
              placeholder="(11) 99999-9999"
              className="h-11 font-sans tracking-[-0.02em]"
              onChange={(e) => setValue("telefone", maskPhone(e.target.value))}
              value={watch("telefone") || ""}
            />
          </FieldWrapper>

          <p className="font-sans text-xs tracking-[-0.02em] text-muted-foreground pt-1">
            O endereço será preenchido automaticamente quando você finalizar seu primeiro pedido de entrega.
          </p>

          <Button type="submit" disabled={loading} className="w-full h-11 font-sans font-semibold tracking-[-0.02em] transition-all duration-200 active:scale-[0.98]">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar e Continuar"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function FieldWrapper({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs font-sans text-destructive animate-[fadeIn_0.2s_ease-out]">{error}</p>}
    </div>
  );
}
