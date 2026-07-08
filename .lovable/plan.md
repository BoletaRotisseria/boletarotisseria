# Vender fatias com peso variável usando EAN-13 da balança

Seu cenário: a balança imprime uma etiqueta com código de barras EAN-13 que já contém o peso (ou o preço) da fatia, e a integração com o Bling é quem sincroniza com o Shopify. O Shopify puro **não interpreta** o "peso embutido" no código — quem faz isso é a balança + Bling. O que precisamos é preparar o cadastro para que cada leitura no PDV/Bling case com um item no Shopify.

## Como funciona o EAN-13 de peso variável

Etiquetas de balança seguem o padrão GS1 prefixo `2`:

```text
2 X X X X X   P P P P P   D
│ └─ código do produto ─┘ └── peso ou preço ──┘ dígito verificador
```

- Prefixo **`20`–`29`** → produto de peso/preço variável
- 5 dígitos seguintes → **PLU** (código interno do produto, ex.: `00123`)
- 5 dígitos finais → **peso em gramas** ou **preço em centavos**, dependendo da configuração da balança
- Último dígito → check digit

O leitor no Bling reconhece o PLU e aplica o peso/preço lido da etiqueta.

## Passo a passo no Shopify (via Bling)

### 1. Definir o PLU de cada produto na balança
Ex.: Frango assado = PLU `00123`, Lombo = `00124`, Costela = `00125`.

### 2. Criar 1 produto por item no Shopify
Um produto para cada tipo de fatia/peça (não uma variante por peso). Ex.: "Frango Assado (fatia)".

- **Preço:** o valor por kg (referência) — o Bling vai sobrescrever com o valor real da etiqueta ao criar o pedido.
- **SKU:** o mesmo PLU (`00123`) para casar com o Bling.
- **Código de barras (barcode):** deixar **em branco** ou usar o PLU. Não colar um EAN completo aqui, porque cada etiqueta impressa tem um EAN diferente (peso muda).
- **Peso:** 1 kg de referência.
- **Rastrear estoque:** desligado (ou tratado pelo Bling), já que peça a peça é variável.

### 3. Configurar o mapeamento no Bling
No Bling, cada produto precisa estar marcado como **"produto pesável"** com:
- PLU igual ao da balança
- Preço/kg cadastrado
- Vinculado ao produto do Shopify pelo SKU

Quando a etiqueta é lida, o Bling calcula `peso × preço/kg` e envia o pedido pro Shopify com a linha já com o valor final.

### 4. Fluxo na venda
1. Cliente escolhe a fatia já cortada.
2. Você bipa a etiqueta da balança no Bling.
3. Bling identifica o PLU, lê o peso/preço da etiqueta, monta o pedido.
4. Pedido chega no Shopify com o item correto e o valor real da fatia.

## Pontos de atenção

- **Não cadastre um EAN fixo** no campo barcode do Shopify pra esses produtos — o EAN muda a cada etiqueta.
- **O leitor precisa estar no Bling**, não no admin do Shopify, porque o Shopify Admin não decodifica o "2X" nativamente.
- Se um dia quiser vender essas fatias **no site**, aí sim precisaríamos de uma lógica custom (não é o caso agora, você já confirmou que é só no Shopify/Bling).

## O que eu faço a seguir

Se quiser, quando você me passar a **lista de produtos pesáveis** (nome + PLU + preço/kg), eu:
1. Crio cada produto no Shopify com SKU = PLU, sem barcode fixo, estoque destravado.
2. Você configura o mapeamento no Bling usando o mesmo PLU.

Me confirma se quer que eu já crie os produtos e me manda a lista.
