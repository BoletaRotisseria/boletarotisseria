import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { customerLogin, customerCreate, customerRecover } from '@/lib/shopifyCustomer';
import { useShopifyCustomer } from '@/hooks/useShopifyCustomer';
import { toast } from 'sonner';

const SHOP_DOMAIN = 'boleta-direct-8l7a1.myshopify.com';
const SHOP_LOGIN_URL = 'https://shop.app/pay/login';

// Load Shopify Storefront Web Components SDK once (provides <shopify-account>)
function useShopifyWebComponents() {
  useEffect(() => {
    if (document.getElementById('shopify-web-components')) return;
    const s = document.createElement('script');
    s.id = 'shopify-web-components';
    s.type = 'module';
    s.src = 'https://cdn.shopify.com/storefront/web-components.js';
    document.head.appendChild(s);
  }, []);
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'shopify-store': any;
      'shopify-account': any;
    }
  }
}

export default function EntrarPage() {
  useShopJS();
  const navigate = useNavigate();
  const { isLoggedIn, reload } = useShopifyCustomer();

  const [mode, setMode] = useState<'login' | 'signup' | 'recover'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) navigate('/minha-conta', { replace: true });
  }, [isLoggedIn, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        const r = await customerLogin(email.trim(), password);
        if (r.error) { setError(r.error); return; }
        toast.success('Bem-vindo(a) de volta!');
        await reload();
        navigate('/minha-conta');
      } else if (mode === 'signup') {
        const r = await customerCreate({ email: email.trim(), password, firstName, lastName });
        if (r.error) { setError(r.error); return; }
        const login = await customerLogin(email.trim(), password);
        if (login.error) { setError(login.error); return; }
        toast.success('Conta criada com sucesso!');
        await reload();
        navigate('/minha-conta');
      } else {
        const r = await customerRecover(email.trim());
        if (r.error) { setError(r.error); return; }
        toast.success('Se este e-mail existir, enviaremos o link de recuperação.');
        setMode('login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#FAF8F2] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6 animate-[fadeIn_0.4s_ease-out]">
        <div className="space-y-1 text-center">
          <h1 className="font-serif text-3xl font-bold tracking-[-0.02em] text-foreground">
            {mode === 'signup' ? 'Criar Conta' : mode === 'recover' ? 'Recuperar Senha' : 'Entrar'}
          </h1>
          <p className="font-sans text-sm text-muted-foreground">
            {mode === 'signup' ? 'Cadastre-se para começar' : mode === 'recover' ? 'Enviaremos um link para seu e-mail' : 'Acesse sua conta Boleta'}
          </p>
        </div>

        {/* Shop Pay auto-detect */}
        {mode === 'login' && (
          <div className="flex justify-center" dangerouslySetInnerHTML={{
            __html: `<shop-user-status shop-id="${SHOP_ID}"></shop-user-status>`
          }} />
        )}

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase text-muted-foreground">Nome</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-11" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase text-muted-foreground">Sobrenome</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-11" required />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs uppercase text-muted-foreground">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" required autoComplete="email" />
          </div>

          {mode !== 'recover' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs uppercase text-muted-foreground">Senha</Label>
                {mode === 'login' && (
                  <button type="button" onClick={() => { setError(null); setMode('recover'); }} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4">
                    Esqueci a senha
                  </button>
                )}
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" required minLength={5} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 font-semibold bg-[#F5A800] hover:bg-[#e09b00] text-black"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> :
              mode === 'signup' ? 'Criar conta' : mode === 'recover' ? 'Enviar link' : 'Entrar'}
          </Button>
        </form>

        {mode === 'login' && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#FAF8F2] px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.open(SHOP_LOGIN_URL, '_blank', 'noopener,noreferrer')}
              className="w-full h-11 rounded-md bg-[#F5A800] hover:bg-[#e09b00] text-black font-sans font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Entrar com Google
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Não tem conta?{' '}
              <button type="button" onClick={() => { setError(null); setMode('signup'); }} className="text-foreground underline underline-offset-4 hover:text-foreground/80">
                Criar conta
              </button>
            </p>
          </>
        )}

        {mode !== 'login' && (
          <p className="text-center text-sm text-muted-foreground">
            <button type="button" onClick={() => { setError(null); setMode('login'); }} className="text-foreground underline underline-offset-4 hover:text-foreground/80">
              Voltar ao login
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
