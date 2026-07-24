## Objetivo
Substituir a fonte dos títulos do site (todos os `h1–h6` / `font-serif`) por **LL Riptide** (Regular + Italic), mantendo Inter/Work Sans no corpo e UI.

## Descoberta
- Os títulos usam `font-family: var(--font-serif)` em `src/index.css` — hoje esse token aponta para `Courier Prime` (Cormorant Garamond está importada mas não é aplicada de fato).
- Trocando apenas o valor de `--font-serif`, todos os componentes com `.font-serif` / `h1–h6` passam a usar Riptide automaticamente — sem precisar tocar em ~40 arquivos.

## Passos

1. **Upload das fontes para o CDN Lovable**
   - `LL_Riptide.otf` → `src/assets/LL_Riptide.otf.asset.json`
   - `LL_Riptide_Italic.otf` → `src/assets/LL_Riptide_Italic.otf.asset.json`
   - Os arquivos `.otf` não ficam no repositório; ficam servidos via CDN.

2. **Registrar a fonte em `src/index.css`**
   - Adicionar dois blocos `@font-face` (regular + italic) apontando para as URLs do CDN.
   - Trocar `--font-serif: 'Courier Prime', ...` por `--font-serif: 'LL Riptide', Georgia, serif`.
   - Remover o `@import` do Google Fonts para Cormorant Garamond (não é mais usado) para não baixar fonte à toa.

3. **Remover `text-transform: lowercase` dos títulos (opcional — confirmar)**
   - Hoje todos os `h1–h6` são forçados em minúsculas. Se a LL Riptide for uma display font e você quiser aproveitar caixa alta/versalete, posso remover essa regra. **Deixarei como está por padrão** — se quiser mudar, me avise.

4. **Verificação**
   - Rodar o build (`bun run build`) para garantir que as URLs do CDN resolvem.
   - Conferir visualmente títulos da home, cardápios, minha conta e drawer do carrinho.

## Detalhes técnicos
```css
@font-face {
  font-family: 'LL Riptide';
  src: url('/__l5e/assets-v1/.../LL_Riptide.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'LL Riptide';
  src: url('/__l5e/assets-v1/.../LL_Riptide_Italic.otf') format('opentype');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

:root {
  --font-serif: 'LL Riptide', Georgia, serif;
}
```

## Fora do escopo
- Alterar títulos individuais um a um.
- Substituir Inter / Work Sans no corpo.
- Mudar tamanhos ou pesos existentes.
