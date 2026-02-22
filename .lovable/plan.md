

# Criar Todos os Produtos no Shopify + Atualizar Paginas

## Resumo

Criar os 200+ produtos dos cardapios de Rotisseria e Emporio no Shopify usando a ferramenta `create_shopify_product`, e atualizar as paginas para filtrar por `product_type`.

## Etapa 1: Criar produtos da Rotisseria no Shopify (~80 produtos)

Cada produto sera criado com:
- **product_type**: "Rotisseria"
- **tags**: nome da categoria (ex: "antipastos", "massas", "carnes")
- **variants**: tamanho/peso + preco (ex: "Serve 2 - 350g" = R$45)

Categorias (do PDF):
- Antipastos: Berinjela, Caponata, Ratatouille, Cogumelos, Tomate Seco, Pimentoes, Abobrinha, Legumes, Polvo, Carpaccio
- Para Compartilhar: Bolinho de Bacalhau, Croqueta de Jamon, Pastel de Nata, Mini Quiche, Empada, Kibbeh, Coxinha, Risoles, etc.
- Pates e Terrines: Pate de Campagne, Terrine de Foie Gras, Rillette de Canard, etc.
- Paes e Torradas: Pao de Alho, Focaccia, Bruschetta, Crostini, etc.
- Saladas, Arroz, Quiches, Massas, Molhos, Carnes, Acompanhamentos, Sopas, Sobremesas, Tabuas

## Etapa 2: Criar produtos do Emporio no Shopify (~120 produtos)

Cada produto sera criado com:
- **product_type**: "Emporio"
- **tags**: nome da categoria (ex: "biscoitos", "queijos", "temperos")
- **variants**: peso + preco

Categorias (do PDF):
- Biscoitos (18 itens), Chocolates (3), Geleias (7), Granola (3), Doces (12), Mel (4), Chas (4)
- Antipastos (6), Torradas e Snacks (10), Nuts (6), Salames e Embutidos (13), Queijos (13)
- Escargots (2), Temperos (16), Azeites e Vinagres (5), Trufados (4), Massas secas (24), Molhos (8)

## Etapa 3: Atualizar codigo

### src/pages/RotisseriePage.tsx
- Mudar query para `useShopifyProducts(250, "product_type:Rotisseria")`
- Tornar pills de categoria clicaveis com estado ativo
- Filtrar por tag ao clicar: `"product_type:Rotisseria AND tag:massas"`
- Adicionar pill "Todos" para limpar filtro

### src/pages/EmporioPage.tsx
- Mesmo tratamento com `"product_type:Emporio"`

### src/hooks/useShopifyProducts.ts
- Aumentar limite padrao para 250

## Observacoes

- Produtos serao criados sem imagem (podem ser adicionadas depois pelo chat ou painel Shopify)
- A criacao dos 200+ produtos sera feita em lotes ao longo de algumas mensagens
- Todos os produtos ficarao integrados com carrinho e checkout Shopify (Pix/cartao)
- Voce pode editar qualquer produto depois de forma autonoma pelo painel Shopify ou pelo chat

