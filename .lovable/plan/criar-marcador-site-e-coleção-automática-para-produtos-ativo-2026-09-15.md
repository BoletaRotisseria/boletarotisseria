# Criar marcador "site" e coleção automática para produtos ativos

## Objetivo
Permitir que, dentro do admin da Shopify, você identifique rapidamente quais produtos estão publicados no site da Boleta.

## Contexto atual
- O site decide o que exibe por uma **allowlist de handles** (`src/lib/catalogoAtivo.ts`, 83 produtos da Rotisseria) e por **tags específicas** em outras páginas (ex: `tag:emporio`).
- Hoje não existe no Shopify uma tag ou coleção que signifique "está no site". Por isso não dá para filtrar no admin apenas os produtos ativos.

## Plano

1. **Marcar todos os produtos ativos com a tag `site` via API**
   - Para cada produto cujo handle está em `CATALOGO_ATIVO`, adicionar a tag `site` sem apagar as tags existentes.
   - Usar `shopify--batch_update_products` em lotes de 20 para não perder as tags atuais (ex: `oculto`, `emporio`, categorias).

2. **Refinar o filtro do site para exigir a tag `site` também**
   - Em `src/hooks/useShopifyProducts.ts`, quando a busca é ampla (sem query específica), incluir `tag:site` junto com o filtro por allowlist.
   - Páginas que já passam query própria (Rotisseria, Empório, Busca) continuam funcionando normalmente.

3. **Criar uma Coleção Automática no admin Shopify**
   - Caminho manual: **Produtos → Coleções → Criar coleção → Automática**.
   - Condição: **Product tag = site**.
   - Nomear como **"Site"** (ou "Publicado no site").
   - A API de coleções não está disponível nas ferramentas atuais, então esse passo será feito pelo usuário no admin.

4. **Gerar planilha de referência**
   - CSV com `ID Shopify`, `handle`, `título` dos produtos ativos.
   - Serve para conferir no admin se todos os itens marcados estão corretos.

## Resultado esperado
- No admin da Shopify você poderá filtrar produtos pela tag `site`.
- A coleção "Site" mostrará automaticamente todos os produtos publicados.
- O site continua usando a allowlist como camada final de segurança, então um produto fora da lista não aparece mesmo que tenha a tag.

## Observações
- Para remover um produto do site, basta retirar o handle da allowlist no código (não precisa mexer na tag do Shopify imediatamente).
- Futuras inclusões no site devem seguir o fluxo: adicionar handle na allowlist + garantir a tag `site` no produto.
