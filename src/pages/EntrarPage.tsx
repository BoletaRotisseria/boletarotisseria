import { Button } from '@/components/ui/button';
import { ExternalLink, User } from 'lucide-react';

const SHOPIFY_ACCOUNT_URL = 'https://shopify.com/73655975981/account';

export default function EntrarPage() {
  const openAccount = () => {
    window.location.href = SHOPIFY_ACCOUNT_URL;
  };

  return (
    <div className="min-h-[80vh] bg-[#FAF8F2] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6 text-center animate-[fadeIn_0.4s_ease-out]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-background">
          <User className="h-5 w-5 text-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-foreground">Minha Conta</h1>
          <p className="font-sans text-sm leading-6 text-muted-foreground">
            Consulte seus pedidos pela área oficial da Boleta no Shopify.
          </p>
        </div>

        <Button
          type="button"
          onClick={openAccount}
          className="w-full h-11 font-semibold bg-[#F5A800] hover:bg-[#e09b00] text-black"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Ver meus pedidos
        </Button>
      </div>
    </div>
  );
}