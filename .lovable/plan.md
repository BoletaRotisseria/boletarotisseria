## Sincronizar data de entrega com "Processar por" no Shopify

Atualmente a edge function `tag-order-by-delivery` apenas adiciona uma tag `entrega-YYYY-MM-DD` ao pedido. Vamos estendê-la para também preencher a data/hora de fulfillment do pedido, que é o que popula a coluna "Processar por" no admin do Shopify.

### O que muda

**1. Edge function `tag-order-by-delivery/index.ts`**

Além do PUT que adiciona a tag, fazer uma segunda chamada à Admin API para definir a deadline de fulfillment do pedido:

- `POST /admin/api/2025-07/orders/{orderId}/fulfillment_orders.json` (GET) para obter os `fulfillment_order` IDs do pedido
- Para cada fulfillment_order, chamar:
  `POST /admin/api/2025-07/fulfillment_orders/{id}/reschedule.json`
  com `{ "fulfillment_order": { "new_fulfill_at": "<ISO datetime>" } }`

O `new_fulfill_at` será construído a partir de `fulfillmentDate` + `fulfillmentTime` recebidos no body (ex: `2026-07-05T10:00:00-03:00`).

Isso faz o Shopify exibir a data/hora na coluna **Processar por** (Fulfill by) no admin de pedidos.

**2. Nenhuma mudança no frontend**

`ObrigadoPage` já envia `orderId`, `fulfillmentDate` e `fulfillmentTime` — suficiente para a edge function.

### Detalhes técnicos

- Manter a lógica atual de tag (não remover)
- Tratar erro do reschedule sem falhar a request inteira (a tag é o mais importante)
- Se `fulfillmentTime` vier como range ("10:00 - 12:00"), usar o início do range para `new_fulfill_at`
- Timezone: usar `-03:00` (São Paulo) ao montar o ISO

### Resultado

Após uma compra, o pedido no Shopify Admin passará a mostrar:
- Tag `entrega-2026-07-05`
- Coluna **Processar por**: `5 jul, 10:00`

Permitindo filtrar/ordenar pedidos pela data de entrega prometida sem depender só das tags.