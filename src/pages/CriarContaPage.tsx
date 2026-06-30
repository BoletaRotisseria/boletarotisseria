import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cadastroSchema, type CadastroFormData, maskCPF, maskPhone } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, ArrowLeft, Info } from "lucide-react";
import { getSafeErrorMessage } from "@/lib/errors";

export default function CriarContaPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isExistingAccount, setIsExistingAccount] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { termos: false as any },
  });

  const handleExistingAccount = () => {
    setIsExistingAccount(true);
    setServerError(null);
    setLoading(false);
  };

  const onSubmit = async (data: CadastroFormData) => {
    setLoading(true);
    setServerError(null);
    setIsExistingAccount(false);

    // Check email uniqueness in clientes
    const emailClean = data.email.trim().toLowerCase();
    const { data: existingEmail } = await supabase
      .from("clientes")
      .select("id")
      .eq("email", emailClean)
      .maybeSingle();

    if (existingEmail) {
      handleExistingAccount();
      return;
    }

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
      email: emailClean,
      password: data.senha,
      options: {
        data: { full_name: data.nome_completo },
        emailRedirectTo: window.location.origin + "/entrar",
      },
    });

    if (authError) {
      if (authError.message.toLowerCase().includes("already") || authError.message.toLowerCase().includes("registered")) {
        handleExistingAccount();
      } else {
        setServerError(getSafeErrorMessage(authError));
      }
      setLoading(false);
      return;
    }

    // Supabase returns user with empty identities array when email already exists
    if (authData.user && Array.isArray(authData.user.identities) && authData.user.identities.length === 0) {
      handleExistingAccount();
      return;
    }

    // Insert cliente profile
    if (authData.user) {
      const telClean = data.telefone.replace(/\D/g, "");
      const { error: insertError } = await supabase.from("clientes").insert({
        id: authData.user.id,
        nome_completo: data.nome_completo.trim(),
        cpf: cpfClean,
        email: emailClean,
        telefone: telClean,
      });

      if (insertError) {
        setServerError(getSafeErrorMessage(insertError));
        setLoading(false);
        return;
      }

      // Sincroniza com Shopify (cria customer lá). Falha silenciosa — o webhook do pedido cobre.
      try {
        await supabase.functions.invoke("shopify-customer-sync", {
          body: {
            nome_completo: data.nome_completo.trim(),
            cpf: cpfClean,
            email: emailClean,
            telefone: telClean,
          },
        });
      } catch (e) {
        console.warn("shopify-customer-sync falhou (ignorado)", e);
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
          <h1 className="font-serif text-2xl font-bold tracking-[-0.02em] text-foreground">Cadastro realizado!</h1>
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
          <h1 className="font-serif text-3xl font-bold tracking-[-0.02em] text-foreground">Criar Conta</h1>
          <p className="font-sans text-sm tracking-[-0.02em] text-muted-foreground">
            Preencha seus dados para começar
          </p>
        </div>

        {isExistingAccount ? (
          <Alert className="animate-[fadeIn_0.3s_ease-out] border-accent/20 bg-accent/10 text-foreground [&>svg]:text-accent">
            <Info className="h-4 w-4" />
            <AlertTitle className="font-serif text-base tracking-[-0.02em] lowercase">Já existe uma conta com esse e-mail</AlertTitle>
            <AlertDescription className="font-sans text-sm text-muted-foreground">
              Use o botão abaixo para entrar. Se esqueceu sua senha, recupere o acesso.
            </AlertDescription>
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/entrar">
                <Button className="w-full h-11 font-sans font-semibold tracking-[-0.02em]">
                  Entrar
                </Button>
              </Link>
              <Link to="/recuperar-senha">
                <Button variant="outline" className="w-full h-11 font-sans tracking-[-0.02em]">
                  Esqueci a senha
                </Button>
              </Link>
            </div>
          </Alert>
        ) : serverError ? (
          <div className="animate-[fadeIn_0.3s_ease-out] rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm font-sans text-destructive">
            {serverError}
          </div>
        ) : null}

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

          <FieldWrapper label="E-mail" error={errors.email?.message}>
            <Input {...register("email")} type="email" placeholder="seu@email.com" className="h-11 font-sans tracking-[-0.02em]" />
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
