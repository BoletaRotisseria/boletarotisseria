import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type Estado =
  | "carregando"
  | "confirmar"
  | "sucesso"
  | "ja-cancelado"
  | "invalido"
  | "erro";

export default function UnsubscribePage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [estado, setEstado] = useState<Estado>(token ? "carregando" : "invalido");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!token) return;
    let ativo = true;

    (async () => {
      try {
        const resposta = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } }
        );
        const dados = await resposta.json().catch(() => ({}));
        if (!ativo) return;

        if (resposta.status === 404) setEstado("invalido");
        else if (dados?.valid === false) setEstado("ja-cancelado");
        else if (dados?.valid === true) setEstado("confirmar");
        else setEstado("erro");
      } catch {
        if (ativo) setEstado("erro");
      }
    })();

    return () => {
      ativo = false;
    };
  }, [token]);

  const confirmar = async () => {
    setEnviando(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "handle-email-unsubscribe",
        { body: { token } }
      );
      if (error) setEstado("erro");
      else if (data?.success) setEstado("sucesso");
      else if (data?.reason === "already_unsubscribed") setEstado("ja-cancelado");
      else setEstado("erro");
    } catch {
      setEstado("erro");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container max-w-lg py-20 md:py-28">
      <div className="border-t-4 border-primary pt-8">
        <p className="font-serif text-sm tracking-[0.18em] uppercase text-muted-foreground mb-4">
          Boleta Rotisseria
        </p>

        {estado === "carregando" && <p className="text-muted-foreground">Só um instante…</p>}

        {estado === "confirmar" && (
          <>
            <h1 className="font-serif normal-case text-3xl md:text-4xl mb-4">
              Cancelar recebimento
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Ao confirmar, você deixa de receber os e-mails da Boleta neste
              endereço. Você pode voltar a ser avisado quando quiser, falando com
              a gente pelo WhatsApp.
            </p>
            <Button
              size="lg"
              className="cta-text rounded-none"
              onClick={confirmar}
              disabled={enviando}
            >
              {enviando ? "Confirmando…" : "Confirmar cancelamento"}
            </Button>
          </>
        )}

        {estado === "sucesso" && (
          <>
            <h1 className="font-serif normal-case text-3xl md:text-4xl mb-4">
              Cancelado
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Pronto — não vamos mais enviar e-mails para este endereço. Se um dia
              quiser voltar a receber as novidades, é só chamar no WhatsApp (11)
              99895-1900.
            </p>
          </>
        )}

        {estado === "ja-cancelado" && (
          <>
            <h1 className="font-serif normal-case text-3xl md:text-4xl mb-4">
              Já estava cancelado
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Este link já foi usado antes, então não há nada a fazer por aqui.
            </p>
          </>
        )}

        {estado === "invalido" && (
          <>
            <h1 className="font-serif normal-case text-3xl md:text-4xl mb-4">
              Link inválido
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Esse link não é válido ou já expirou. Se você recebeu um e-mail
              nosso, use o link dele novamente ou fale com a gente pelo WhatsApp
              (11) 99895-1900.
            </p>
          </>
        )}

        {estado === "erro" && (
          <>
            <h1 className="font-serif normal-case text-3xl md:text-4xl mb-4">
              Não conseguimos concluir
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Algo deu errado nesta tentativa. Tente novamente em instantes ou
              fale com a gente pelo WhatsApp (11) 99895-1900.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
