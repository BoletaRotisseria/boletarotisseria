import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Cliente {
  id: string;
  nome_completo: string;
  cpf: string;
  email: string;
  telefone: string;
  data_nascimento: string | null;
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento: string | null;
  criado_em: string;
  atualizado_em: string;
}

export function useCliente() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["cliente", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as Cliente | null;
    },
    enabled: !!user,
  });

  const isComplete = !!(
    query.data &&
    query.data.nome_completo &&
    query.data.cpf &&
    query.data.telefone
  );

  return { ...query, cliente: query.data, isComplete };
}
