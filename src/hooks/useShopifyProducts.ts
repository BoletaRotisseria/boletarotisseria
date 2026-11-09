import { useQuery } from '@tanstack/react-query';
import { storefrontApiRequest, STOREFRONT_PRODUCTS_QUERY, ShopifyProduct } from '@/lib/shopify';
import { CATALOGO_ATIVO } from '@/lib/catalogoAtivo';

export function useShopifyProducts(count = 250, searchQuery?: string) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ['shopify-products', count, searchQuery],
    queryFn: async () => {
      // busca ampla: apenas produtos marcados com a tag 'site' e não ocultos
      const query = searchQuery || 'tag:site AND -tag:oculto';
      const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first: 250, query });
      const edges: ShopifyProduct[] = data?.data?.products?.edges || [];
      return edges.filter((e) => CATALOGO_ATIVO.has(e.node.handle));
    },
  });
}
