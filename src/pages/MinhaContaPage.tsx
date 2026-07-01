import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, MapPin, Package, LogOut } from 'lucide-react';
import { useShopifyCustomer } from '@/hooks/useShopifyCustomer';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function MinhaContaPage() {
  const navigate = useNavigate();
  const { customer, loading, logout } = useShopifyCustomer();

  useEffect(() => {
    if (!loading && !customer) navigate('/entrar', { replace: true });
  }, [loading, customer, navigate]);

  if (loading || !customer) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF8F2]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const orders = customer.orders?.edges ?? [];
  const addresses = customer.addresses?.edges ?? [];

  return (
    <div className="min-h-[80vh] bg-[#FAF8F2] px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-10">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-bold text-foreground">
              Olá, {customer.firstName || 'cliente'}
            </h1>
            <p className="mt-1 font-sans text-sm text-muted-foreground">{customer.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
        </header>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl flex items-center gap-2">
            <Package className="h-5 w-5" /> Pedidos
          </h2>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground bg-white rounded-md p-6 text-center border border-border/40">
              Você ainda não tem pedidos.
            </p>
          ) : (
            <ul className="space-y-2">
              {orders.map(({ node }) => (
                <li key={node.id} className="bg-white rounded-md border border-border/40 p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-sans font-semibold text-sm">Pedido #{node.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(node.processedAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      {node.fulfillmentStatus && ` · ${node.fulfillmentStatus}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans font-semibold text-sm">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: node.totalPrice.currencyCode }).format(parseFloat(node.totalPrice.amount))}
                    </p>
                    <a href={node.statusUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#F5A800] hover:underline">
                      Ver detalhes
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl flex items-center gap-2">
            <MapPin className="h-5 w-5" /> Endereços
          </h2>
          {addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground bg-white rounded-md p-6 text-center border border-border/40">
              Nenhum endereço salvo.
            </p>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {addresses.map(({ node }) => (
                <li key={node.id} className="bg-white rounded-md border border-border/40 p-4 text-sm">
                  <p>{node.address1}{node.address2 ? `, ${node.address2}` : ''}</p>
                  <p className="text-muted-foreground">
                    {[node.city, node.province, node.zip].filter(Boolean).join(' · ')}
                  </p>
                  {node.country && <p className="text-muted-foreground">{node.country}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
