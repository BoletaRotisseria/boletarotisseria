# Estoque não conta e não vem do Bling — diagnóstico e correção

## Situação

O que consegui confirmar agora, olhando a loja:

- Os produtos estão ativos e com SKU preenchido (ex.: Abobrinha Temperada, opções 150g/250g com SKU 1651 e 148).
- As ferramentas de leitura que tenho não mostram o campo "monitorar estoque" nem a quantidade. Ou seja: **ainda não está confirmado** se o monitoramento realmente ficou ligado na loja ou se o Bling simplesmente não está enviando saldo.

Então o primeiro passo é medir, não mexer.

## Passo 1 — Confirmar se o monitoramento está realmente ligado

Ler a loja item por item pelo canal público e verificar, para cada opção de produto:

- se a loja devolve quantidade disponível (sinal de que o monitoramento está ligado);
- se a opção tem SKU;
- se existem SKUs repetidos em opções diferentes (isso quebra o vínculo com o Bling: ele não sabe qual atualizar);
- se existem opções sem SKU nenhum.

Resultado: uma planilha com uma linha por opção, marcando "monitorado sim/não", SKU e problema encontrado.

## Passo 2 — Reaplicar o monitoramento nas que estiverem faltando

Para as opções que aparecerem sem monitoramento, reaplicar em lotes:
monitorar estoque ligado e venda permitida mesmo com saldo zero (para nada sumir do site enquanto o Bling não envia os números).

## Passo 3 — Corrigir os SKUs problemáticos

Listar separadamente:

- opções sem SKU;
- SKUs duplicados.

Essas são as que nunca vão receber estoque do Bling, por mais que a integração esteja certa. Te devolvo a lista para você confirmar qual código do Bling entra em cada uma.

## Passo 4 — Lado do Bling (você faz, eu não tenho acesso)

O envio de saldo é configurado dentro do Bling, não no site:

- Integrações → Shopify → sincronização de estoque ativada, sentido Bling → Shopify.
- Depósito/local de estoque selecionado (se nenhum estiver marcado, o Bling não envia nada).
- Vínculo dos produtos feito (o Bling casa pelo código = SKU da loja).
- Após ativar, rodar uma sincronização manual: sem isso o Bling só envia quando houver movimentação.

## Detalhes técnicos

- Leitura via Storefront API (`quantityAvailable` só vem quando o monitoramento está ativo e o token tem `unauthenticated_read_product_inventory`); se o campo não vier para nenhum item, testo pela API Admin de variantes para separar "sem permissão" de "sem monitoramento".
- Reaplicação com `shopify--batch_update_product_variants` em lotes de 20 (`inventory_management: "shopify"`, `inventory_policy: "continue"`).
- Nenhuma exclusão de produto, variante ou dado do Bling em nenhum passo.
- Continua pendente: os 54 itens de `pendentes_codigo_bling.csv`, que não têm código do Bling e por isso não podem se vincular.
