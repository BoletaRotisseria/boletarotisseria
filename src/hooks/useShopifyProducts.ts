import { useQuery } from '@tanstack/react-query';
import { storefrontApiRequest, STOREFRONT_PRODUCTS_QUERY, ShopifyProduct } from '@/lib/shopify';
import { CATALOGO_ATIVO } from '@/lib/catalogoAtivo';

export function useShopifyProducts(count = 250, searchQuery?: string) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ['shopify-products', count, searchQuery],
    queryFn: async () => {
      const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first: count, query: searchQuery || null });
      const edges: ShopifyProduct[] = data?.data?.products?.edges || [];
      return edges.filter((e) => CATALOGO_ATIVO.has(e.node.handle));
    },
  });
}
