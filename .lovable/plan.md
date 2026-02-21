

## Mudanca de cor da faixa de Diferenciais

**Problema**: A faixa de Diferenciais (amarela) seguida do banner "Peca pelo site" (tambem amarelo) cria repeticao visual.

**Solucao**: Trocar o fundo da faixa de Diferenciais para o tom escuro (foreground/carvao), com textos claros. Isso cria um ritmo visual mais harmonioso:

```text
Hero (escuro) -> Diferenciais (escuro) -> Banner foto + amarelo -> Na Midia (claro)
```

### Alteracoes tecnicas

**Arquivo: `src/pages/Index.tsx`**

1. Mudar o fundo da section de `bg-primary` para `bg-foreground`
2. Mudar a cor do texto dos titulos e descricoes de `text-secondary-foreground` para `text-background`
3. Mudar a borda dos cards de `border-secondary-foreground` para `border-background/30` (borda clara sutil)

Isso mantem a identidade visual (usando cores ja definidas no tema) e quebra a repeticao do amarelo, criando mais profundidade na pagina.

