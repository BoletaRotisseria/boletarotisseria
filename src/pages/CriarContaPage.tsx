import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cadastroSchema, type CadastroFormData, maskCPF, maskPhone, maskCEP, maskDate, dateBrToIso } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

const UF_LIST = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export default function CriarContaPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { complemento: "", termos: false as any },
  });

  const onSubmit = async (data: CadastroFormData) => {
    setLoading(true);
    setServerError(null);

    // Check CPF uniqueness
    const cpfClean = data.cpf.replace(/\D/g, "");
    const { data: existing } = await supabase
      .from("clientes")
      .select("id")
      .eq("cpf", cpfClean)
      .maybeSingle();

    if (existing) {
      setServerError("Este CPF já está cadastrado.");
      setLoading(false);
      return;
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.senha,
      options: {
        data: { full_name: data.nome_completo },
        emailRedirectTo: window.location.origin + "/entrar",
      },
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        setServerError("Este e-mail já está cadastrado.");
      } else {
        setServerError(authError.message);
      }
      setLoading(false);
      return;
    }

    // Insert cliente profile
    if (authData.user) {
      const { error: insertError } = await supabase.from("clientes").insert({
        id: authData.user.id,
        nome_completo: data.nome_completo.trim(),
        cpf: cpfClean,
        email: data.email.trim(),
        telefone: data.telefone.replace(/\D/g, ""),
        data_nascimento: dateBrToIso(data.data_nascimento),
        cep: data.cep.replace(/\D/g, ""),
        estado: data.estado.toUpperCase(),
        cidade: data.cidade.trim(),
        bairro: data.bairro.trim(),
        rua: data.rua.trim(),
        numero: data.numero.trim(),
        complemento: data.complemento?.trim() || null,
      });

      if (insertError) {
        setServerError(insertError.message);
        setLoading(false);
        return;
      }
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6 animate-[fadeIn_0.4s_ease-out] text-center">
          <CheckCircle2 className="h-12 w-12 text-accent mx-auto" />
          <h1 className="font-sans text-2xl font-bold tracking-[-0.06em] text-foreground">Cadastro realizado!</h1>
          <p className="font-sans text-sm text-muted-foreground tracking-[-0.02em]">
            Enviamos um e-mail de confirmação para você. Verifique sua caixa de entrada para ativar sua conta.
          </p>
          <Link to="/entrar">
            <Button variant="outline" className="w-full mt-4 font-sans tracking-[-0.02em]">
              Ir para login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-8">
      <div className="w-full max-w-lg space-y-6 animate-[fadeIn_0.4s_ease-out]">
        <Link to="/entrar" className="flex items-center gap-1.5 font-sans text-xs tracking-[-0.02em] text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao login
        </Link>

        <div className="space-y-1">
          <h1 className="font-sans text-3xl font-bold tracking-[-0.06em] text-foreground">Criar Conta</h1>
          <p className="font-sans text-sm tracking-[-0.02em] text-muted-foreground">
            Preencha seus dados para começar
          </p>
        </div>

        {serverError && (
          <div className="animate-[fadeIn_0.3s_ease-out] rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm font-sans text-destructive">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <FieldWrapper label="Nome completo" error={errors.nome_completo?.message}>
            <Input {...register("nome_completo")} placeholder="Seu nome completo" className="h-11 font-sans tracking-[-0.02em]" />
          </FieldWrapper>

          {/* CPF */}
          <FieldWrapper label="CPF" error={errors.cpf?.message}>
            <Input
              {...register("cpf")}
              placeholder="000.000.000-00"
              className="h-11 font-sans tracking-[-0.02em]"
              onChange={(e) => setValue("cpf", maskCPF(e.target.value))}
              value={watch("cpf") || ""}
            />
          </FieldWrapper>

          {/* Email */}
          <FieldWrapper label="E-mail" error={errors.email?.message}>
            <Input {...register("email")} type="email" placeholder="seu@email.com" className="h-11 font-sans tracking-[-0.02em]" />
          </FieldWrapper>

          {/* Telefone */}
          <FieldWrapper label="Telefone / WhatsApp" error={errors.telefone?.message}>
            <Input
              {...register("telefone")}
              placeholder="(11) 99999-9999"
              className="h-11 font-sans tracking-[-0.02em]"
              onChange={(e) => setValue("telefone", maskPhone(e.target.value))}
              value={watch("telefone") || ""}
            />
          </FieldWrapper>

          {/* Endereço header */}
          <p className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground font-semibold pt-2">Endereço</p>

          {/* CEP + UF */}
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

          {/* Cidade + Bairro */}
          <div className="grid grid-cols-2 gap-3">
            <FieldWrapper label="Cidade" error={errors.cidade?.message}>
              <Input {...register("cidade")} placeholder="Sua cidade" className="h-11 font-sans tracking-[-0.02em]" />
            </FieldWrapper>
            <FieldWrapper label="Bairro" error={errors.bairro?.message}>
              <Input {...register("bairro")} placeholder="Seu bairro" className="h-11 font-sans tracking-[-0.02em]" />
            </FieldWrapper>
          </div>

          {/* Rua + Número + Complemento */}
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

          {/* Senha */}
          <p className="font-sans text-xs tracking-[-0.02em] uppercase text-muted-foreground font-semibold pt-2">Senha de acesso</p>
          <div className="grid grid-cols-2 gap-3">
            <FieldWrapper label="Senha" error={errors.senha?.message}>
              <Input {...register("senha")} type="password" placeholder="Mínimo 8 caracteres" className="h-11 font-sans tracking-[-0.02em]" />
            </FieldWrapper>
            <FieldWrapper label="Confirmar senha" error={errors.confirmar_senha?.message}>
              <Input {...register("confirmar_senha")} type="password" placeholder="Repita a senha" className="h-11 font-sans tracking-[-0.02em]" />
            </FieldWrapper>
          </div>

          {/* Termos */}
          <div className="flex items-start gap-2 pt-2">
            <Checkbox
              id="termos"
              checked={watch("termos") as any}
              onCheckedChange={(checked) => setValue("termos", checked as boolean as any)}
              className="mt-0.5"
            />
            <label htmlFor="termos" className="font-sans text-xs tracking-[-0.02em] text-muted-foreground leading-tight cursor-pointer">
              Li e concordo com os{" "}
              <span className="underline underline-offset-4 text-foreground">Termos de Uso</span> e{" "}
              <span className="underline underline-offset-4 text-foreground">Política de Privacidade</span>.
            </label>
          </div>
          {errors.termos && (
            <p className="text-xs font-sans text-destructive animate-[fadeIn_0.2s_ease-out]">{errors.termos.message}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 font-sans font-semibold tracking-[-0.02em] transition-all duration-200 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Conta"}
          </Button>
        </form>

        <p className="text-center font-sans text-sm tracking-[-0.02em] text-muted-foreground pb-8">
          Já tem conta?{" "}
          <Link to="/entrar" className="text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors">
            Entrar
          </Link>
        </p>
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
