
## Corrigir dropdown que fica preso na tela

### Problema
O mega-menu de "Cardapios" nao fecha ao tirar o mouse de cima. Isso acontece porque o dropdown usa `position: fixed` e cobre toda a largura da tela, mas os eventos de mouse do div pai (que e pequeno) nao detectam corretamente quando o mouse sai da area do mega-menu.

### Solucao

Modificar o arquivo `src/components/Header.tsx` com as seguintes mudancas:

1. **Adicionar `onMouseEnter` e `onMouseLeave` diretamente no mega-menu** - para que o proprio mega-menu controle quando o mouse entra e sai dele, mantendo o dropdown aberto enquanto o mouse estiver sobre ele e fechando ao sair.

2. **Fechar o dropdown ao clicar em qualquer link** - adicionar `onClick={() => setOpenDropdown(null)}` em todos os links dentro do mega-menu (subcategorias e sub-itens), garantindo que ao navegar o menu feche.

3. **Fechar o dropdown ao mudar de rota** - adicionar um `useEffect` que observe mudancas no `location.pathname` e feche o dropdown automaticamente.

### Detalhes Tecnicos

- No `div` do mega-menu (linha 118), adicionar `onMouseEnter={() => handleEnter(item.label)}` e `onMouseLeave={handleLeave}` para manter a continuidade do hover.
- Nos `Link` das subcategorias (linha 122-131) e sub-itens (linha 140-145), adicionar `onClick={() => setOpenDropdown(null)}`.
- Adicionar `useEffect` com dependencia em `location.pathname` que executa `setOpenDropdown(null)` e `setMobileOpen(false)`.
- Reduzir o timeout do `handleLeave` de 100ms para 50ms para fechamento mais agil.
