import { useQuery } from '@tanstack/react-query';
import { storefrontApiRequest, STOREFRONT_PRODUCTS_QUERY, ShopifyProduct } from '@/lib/shopify';
import { CATALOGO_ATIVO } from '@/lib/catalogoAtivo';

const MAX_PAGES = 10;

export function useShopifyProducts(count = 250, searchQuery?: string) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ['shopify-products', count, searchQuery],
    queryFn: async () => {
      // busca ampla: apenas produtos marcados com a tag 'site' e não ocultos
      const query = searchQuery || 'tag:site AND -tag:oculto';
      const edges: ShopifyProduct[] = [];
      let after: string | null = null;

      // a API do Shopify devolve no máximo 250 produtos por página; sem paginar,
      // produtos além do 250º nunca chegavam ao site
      for (let page = 0; page < MAX_PAGES; page++) {
        const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first: 250, query, after });
        const products = data?.data?.products;
        edges.push(...(products?.edges || []));
        if (!products?.pageInfo?.hasNextPage) break;
        after = products.pageInfo.endCursor;
      }

      return edges.filter((e) => CATALOGO_ATIVO.has(e.node.handle));
    },
  });
}
