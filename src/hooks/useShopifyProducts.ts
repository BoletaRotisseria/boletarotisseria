import { useQuery } from '@tanstack/react-query';
import { storefrontApiRequest, STOREFRONT_PRODUCTS_QUERY, ShopifyProduct } from '@/lib/shopify';
import { CATALOGO_ATIVO } from '@/lib/catalogoAtivo';

export function useShopifyProducts(count = 250, searchQuery?: string) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ['shopify-products', count, searchQuery],
    queryFn: async () => {
      // busca ampla e filtra pelo catálogo ativo do site
      const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first: 250, query: searchQuery || null });
      const edges: ShopifyProduct[] = data?.data?.products?.edges || [];
      return edges.filter((e) => CATALOGO_ATIVO.has(e.node.handle));
    },
  });
}
