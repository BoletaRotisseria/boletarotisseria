import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CartItem,
  createShopifyCart,
  addLineToShopifyCart,
  updateShopifyCartLine,
  removeLineFromShopifyCart,
  storefrontApiRequest,
  updateShopifyCartAttributes,
  updateShopifyCartNote,
  CART_QUERY,
} from '@/lib/shopify';

export type { CartItem } from '@/lib/shopify';

export type FulfillmentMethod = 'entrega' | 'retirada';

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  fulfillmentMethod: FulfillmentMethod | null;
  fulfillmentDate: string | null; // yyyy-MM-dd
  fulfillmentTime: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  addItem: (item: Omit<CartItem, 'lineId'>) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  setFulfillmentMethod: (m: FulfillmentMethod | null) => void;
  setFulfillmentDate: (d: string | null) => void;
  setFulfillmentTime: (t: string | null) => void;
  submitFulfillmentAttributes: (extraAttributes?: Array<{ key: string; value: string }>, extraNoteLines?: string[]) => Promise<void>;
  getCheckoutUrl: () => string | null;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      fulfillmentMethod: null,
      fulfillmentDate: null,
      fulfillmentTime: null,
      isLoading: false,
      isSyncing: false,

      addItem: async (item) => {
        const { items, cartId, clearCart } = get();
        const existingItem = items.find(i => i.variantId === item.variantId);
        set({ isLoading: true });
        try {
          if (!cartId) {
            const result = await createShopifyCart({ ...item, lineId: null });
            if (result) {
              set({ cartId: result.cartId, checkoutUrl: result.checkoutUrl, items: [{ ...item, lineId: result.lineId }] });
            }
          } else if (existingItem) {
            const newQuantity = existingItem.quantity + item.quantity;
            if (!existingItem.lineId) return;
            const result = await updateShopifyCartLine(cartId, existingItem.lineId, newQuantity);
            if (result.success) {
              set({ items: get().items.map(i => i.variantId === item.variantId ? { ...i, quantity: newQuantity } : i) });
            } else if (result.cartNotFound) clearCart();
          } else {
            const result = await addLineToShopifyCart(cartId, { ...item, lineId: null });
            if (result.success) {
              set({ items: [...get().items, { ...item, lineId: result.lineId ?? null }] });
            } else if (result.cartNotFound) clearCart();
          }
        } catch (error) {
          console.error('Failed to add item:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) { await get().removeItem(variantId); return; }
        const { items, cartId, clearCart } = get();
        const item = items.find(i => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;
        set({ isLoading: true });
        try {
          const result = await updateShopifyCartLine(cartId, item.lineId, quantity);
          if (result.success) {
            set({ items: get().items.map(i => i.variantId === variantId ? { ...i, quantity } : i) });
          } else if (result.cartNotFound) clearCart();
        } catch (error) { console.error('Failed to update quantity:', error); }
        finally { set({ isLoading: false }); }
      },

      removeItem: async (variantId) => {
        const { items, cartId, clearCart } = get();
        const item = items.find(i => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;
        set({ isLoading: true });
        try {
          const result = await removeLineFromShopifyCart(cartId, item.lineId);
          if (result.success) {
            const newItems = get().items.filter(i => i.variantId !== variantId);
            newItems.length === 0 ? clearCart() : set({ items: newItems });
          } else if (result.cartNotFound) clearCart();
        } catch (error) { console.error('Failed to remove item:', error); }
        finally { set({ isLoading: false }); }
      },

      clearCart: () => set({
        items: [], cartId: null, checkoutUrl: null,
        fulfillmentMethod: null, fulfillmentDate: null, fulfillmentTime: null,
      }),
      getCheckoutUrl: () => get().checkoutUrl,

      setFulfillmentMethod: (m) => set({ fulfillmentMethod: m, fulfillmentTime: null }),
      setFulfillmentDate: (d) => set({ fulfillmentDate: d, fulfillmentTime: null }),
      setFulfillmentTime: (t) => set({ fulfillmentTime: t }),

      submitFulfillmentAttributes: async (extraAttributes = [], extraNoteLines = []) => {
        const { cartId, fulfillmentMethod, fulfillmentDate, fulfillmentTime, clearCart } = get();
        if (!cartId || !fulfillmentMethod || !fulfillmentDate || !fulfillmentTime) return;
        const methodLabel = fulfillmentMethod === 'retirada' ? 'Retirada' : 'Entrega';
        const [y, m, d] = fulfillmentDate.split('-');
        const dateLabel = `${d}/${m}/${y}`;
        const locationLabel = fulfillmentMethod === 'retirada'
          ? 'Retirada na Boleta Rotisseria'
          : 'Entrega no endereço informado no checkout';
        const attributes = [
          { key: 'Método de Recebimento', value: methodLabel },
          { key: 'Data de Entrega/Retirada', value: dateLabel },
          { key: 'Horário de Entrega/Retirada', value: fulfillmentTime },
          { key: 'Local', value: locationLabel },
          ...extraAttributes,
        ];
        const noteParts = [
          `Método de Recebimento: ${methodLabel}`,
          `Data de Entrega/Retirada: ${dateLabel}`,
          `Horário de Entrega/Retirada: ${fulfillmentTime}`,
          locationLabel,
          ...extraNoteLines,
        ];
        const note = noteParts.join('\n');
        try {
          const [attrRes, noteRes] = await Promise.all([
            updateShopifyCartAttributes(cartId, attributes),
            updateShopifyCartNote(cartId, note),
          ]);
          if (attrRes.cartNotFound || noteRes.cartNotFound) clearCart();
        } catch (error) {
          console.error('Failed to submit fulfillment attributes:', error);
        }
      },

      syncCart: async () => {
        const { cartId, isSyncing, clearCart } = get();
        if (!cartId || isSyncing) return;
        set({ isSyncing: true });
        try {
          const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
          if (!data) return;
          const cart = data?.data?.cart;
          if (!cart || cart.totalQuantity === 0) clearCart();
        } catch (error) { console.error('Failed to sync cart:', error); }
        finally { set({ isSyncing: false }); }
      },
    }),
    {
      name: 'boleta-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
        fulfillmentMethod: state.fulfillmentMethod,
        fulfillmentDate: state.fulfillmentDate,
        fulfillmentTime: state.fulfillmentTime,
      }),
    }
  )
);
