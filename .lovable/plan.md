

## Remover linha de direitos autorais do rodape

Vou remover o bloco inferior do rodape que contem o texto "© 2026 Boleta. Todos os direitos reservados.", incluindo o separador (border-top) acima dele.

### Detalhes tecnicos

**Arquivo:** `src/components/Footer.tsx`

- Remover o `div` com classe `border-t border-foreground/10 mt-10 pt-6 text-center text-xs text-foreground/40` e todo seu conteudo (linhas ~120-123 aproximadamente)

