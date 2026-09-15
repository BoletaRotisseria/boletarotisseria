# Coalhada Seca Temperada 350g: estoque do Bling não chega

## Situação verificada

Na loja, a Coalhada Seca Temperada tem dois tamanhos:

- 350g — código 156, contagem de estoque ligada, saldo atualmente zero
- 150g — sem código nenhum, contagem ligada, saldo zero

O código 156 não está repetido em nenhum outro item da loja, então não há conflito de código. Do lado da loja o item está pronto para receber saldo: a contagem está ativa e o código existe.

Isso deixa duas causas possíveis, e nenhuma delas pode ser confirmada de dentro da loja:

1. No Bling não existe produto com o código 156, ou o código de lá é diferente (ex. tem letras, zeros à frente, ou é o código de outro item).
2. O produto existe no Bling com o código 156, mas não está vinculado à loja, ou o depósito escolhido na integração não tem saldo desse item.

Um sinal a favor da causa 1: a opção 150g está sem código, ou seja, os dois tamanhos nunca foram cadastrados por completo — é comum nesse caso o código do 350g também não bater com o do Bling.

## O que vou fazer

1. Levantar, para a Coalhada e para os itens vizinhos da mesma categoria, exatamente qual código está gravado em cada tamanho, para você comparar lado a lado com a tela de produtos do Bling.
2. Depois que você confirmar (ou corrigir) o código de cada tamanho, gravar os códigos certos na loja: o correto no 350g e o do 150g, que hoje está vazio.
3. Reconferir depois da sua sincronização no Bling se o saldo passou a chegar nesse item.

## O que depende de você (não tenho acesso ao Bling)

1. Abrir o produto da coalhada no Bling e conferir o código de cada tamanho — se lá for um código diferente de 156, é ele que vale.
2. Confirmar que o produto está vinculado à loja na integração do Bling e que o depósito usado na sincronização tem saldo dele.
3. Rodar uma sincronização manual de estoque depois do vínculo — sem isso o Bling só envia saldo quando houver movimentação.

## Observação técnica

Nenhum dado da loja é apagado. As alterações são apenas no campo de código (SKU) das opções da coalhada, feitas em lote pelas ferramentas de atualização de variantes, mantendo a contagem de estoque ligada e a venda permitida em saldo zero.
