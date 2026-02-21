import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCliente } from "@/hooks/useCliente";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { completarCadastroSchema, type CompletarCadastroFormData, maskCPF, maskPhone, maskCEP, maskDate, dateBrToIso, dateIsoToBr } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const UF_LIST = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

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
        data_nascimento: cliente.data_nascimento ? dateIsoToBr(cliente.data_nascimento) : "",
        cep: cliente.cep ? maskCEP(cliente.cep) : "",
        estado: cliente.estado || "",
        cidade: cliente.cidade || "",
        bairro: cliente.bairro || "",
        rua: cliente.rua || "",
        numero: cliente.numero || "",
        complemento: cliente.complemento || "",
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
      data_nascimento: dateBrToIso(data.data_nascimento),
      cep: data.cep.replace(/\D/g, ""),
      estado: data.estado.toUpperCase(),
      cidade: data.cidade.trim(),
      bairro: data.bairro.trim(),
      rua: data.rua.trim(),
      numero: data.numero.trim(),
      complemento: data.complemento?.trim() || null,
      atualizado_em: new Date().toISOString(),
    };

    // Upsert: insert if not exists, update if exists
    const { error } = await supabase.from("clientes").upsert(payload, { onConflict: "id" });

    if (error) {
      if (error.message.includes("unique") || error.message.includes("cpf")) {
        setServerError("Este CPF já está cadastrado em outra conta.");
      } else {
        setServerError(error.message);
      }
      setLoading(false);
      return;
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

        {/* Email read-only */}
        <div className="space-y-1.5">
          <Label className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground">E-mail</Label>
          <Input value={user?.email || ""} disabled className="h-11 font-sans tracking-[-0.02em] bg-muted" />
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

          <p className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground font-semibold pt-2">Endereço</p>

          <div className="grid grid-cols-2 gap-3">
            <FieldWrapper label="CEP" error={errors.cep?.message}>
              <Input
                {...register("cep")}
                placeholder="00000-000"
                className="h-11 font-sans tracking-[-0.02em]"
                onChange={(e) => setValue("cep", maskCEP(e.target.value))}
                value={watch("cep") || ""}
              />
            </FieldWrapper>
            <FieldWrapper label="Estado" error={errors.estado?.message}>
              <select
                {...register("estado")}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-sans tracking-[-0.02em] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Selecione</option>
                {UF_LIST.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </FieldWrapper>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FieldWrapper label="Cidade" error={errors.cidade?.message}>
              <Input {...register("cidade")} placeholder="Sua cidade" className="h-11 font-sans tracking-[-0.02em]" />
            </FieldWrapper>
            <FieldWrapper label="Bairro" error={errors.bairro?.message}>
              <Input {...register("bairro")} placeholder="Seu bairro" className="h-11 font-sans tracking-[-0.02em]" />
            </FieldWrapper>
          </div>

          <FieldWrapper label="Rua" error={errors.rua?.message}>
            <Input {...register("rua")} placeholder="Nome da rua" className="h-11 font-sans tracking-[-0.02em]" />
          </FieldWrapper>

          <div className="grid grid-cols-2 gap-3">
            <FieldWrapper label="Número" error={errors.numero?.message}>
              <Input {...register("numero")} placeholder="Nº" className="h-11 font-sans tracking-[-0.02em]" />
            </FieldWrapper>
            <FieldWrapper label="Complemento" error={errors.complemento?.message}>
              <Input {...register("complemento")} placeholder="Opcional" className="h-11 font-sans tracking-[-0.02em]" />
            </FieldWrapper>
          </div>

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
