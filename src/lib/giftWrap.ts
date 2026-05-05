import type { ShopifyProduct } from "./shopify";

export interface GiftWrapOption {
  id: string;
  label: string;
  description: string;
  price: number; // BRL, 0 = free
  variantId: string | null; // null = no Shopify line needed
  productId: string | null;
  handle: string | null;
}

export const GIFT_WRAP_OPTIONS: GiftWrapOption[] = [
  {
    id: "sacola-boleta",
    label: "Sacola Boleta",
    description: "Sacola básica de cortesia",
    price: 0,
    variantId: null,
    productId: null,
    handle: null,
  },
  {
    id: "caixa-pequena",
    label: "Caixa Pequena",
    description: "29 × 22,5 × 9,5 cm",
    price: 45,
    variantId: "gid://shopify/ProductVariant/44911899574317",
    productId: "gid://shopify/Product/8489457418285",
    handle: "embalagem-de-presente-caixa-pequena",
  },
  {
    id: "caixa-media",
    label: "Caixa Média",
    description: "30 × 29,5 × 10 cm",
    price: 45,
    variantId: "gid://shopify/ProductVariant/44911900164141",
    productId: "gid://shopify/Product/8489457778733",
    handle: "embalagem-de-presente-caixa-media",
  },
  {
    id: "sacola-juta",
    label: "Sacola de Juta",
    description: "Sacola de juta Boleta",
    price: 48,
    variantId: "gid://shopify/ProductVariant/44911905996845",
    productId: "gid://shopify/Product/8489459286061",
    handle: "embalagem-de-presente-sacola-de-juta",
  },
];

export const GIFT_WRAP_VARIANT_IDS = new Set(
  GIFT_WRAP_OPTIONS.map((o) => o.variantId).filter(Boolean) as string[]
);

export function buildGiftWrapCartItem(option: GiftWrapOption) {
  if (!option.variantId || !option.productId || !option.handle) return null;
  const product: ShopifyProduct = {
    node: {
      id: option.productId,
      title: `Embalagem de Presente — ${option.label}`,
      description: option.description,
      handle: option.handle,
      priceRange: {
        minVariantPrice: { amount: option.price.toFixed(2), currencyCode: "BRL" },
      },
      images: { edges: [] },
      variants: {
        edges: [
          {
            node: {
              id: option.variantId,
              title: "Default Title",
              price: { amount: option.price.toFixed(2), currencyCode: "BRL" },
              availableForSale: true,
              selectedOptions: [],
            },
          },
        ],
      },
      options: [],
    },
  };
  return {
    product,
    variantId: option.variantId,
    variantTitle: option.label,
    price: { amount: option.price.toFixed(2), currencyCode: "BRL" },
    quantity: 1,
    selectedOptions: [],
  };
}
