import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { customerLogin, customerCreate, customerRecover, getStoredToken } from '@/lib/shopifyCustomer';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'shop-login-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        storefront?: string;
      };
    }
  }
}

type Mode = 'login' | 'signup' | 'recover';

export default function EntrarPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, go straight to account
  useEffect(() => {
    if (getStoredToken()) navigate('/minha-conta', { replace: true });
  }, [navigate]);

  // Load Shop JS script once
  useEffect(() => {
    if (document.querySelector('script[data-shop-js]')) return;
    const s = document.createElement('script');
    s.src = 'https://shop.app/js/shop-js/shop-js.js';
    s.async = true;
    s.setAttribute('data-shop-js', 'true');
    document.head.appendChild(s);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const r = await customerLogin(email, password);
        if (r.error) {
          toast({ title: 'Não foi possível entrar', description: r.error, variant: 'destructive' });
        } else {
          toast({ title: 'Bem-vindo de volta!' });
          navigate('/minha-conta', { replace: true });
        }
      } else if (mode === 'signup') {
        const r = await customerCreate({ email, password, firstName, lastName });
        if (r.error) {
          toast({ title: 'Cadastro não concluído', description: r.error, variant: 'destructive' });
        } else {
          const login = await customerLogin(email, password);
          if (login.error) {
            toast({ title: 'Cadastro criado', description: 'Faça login para continuar.' });
            setMode('login');
          } else {
            toast({ title: 'Cadastro concluído!' });
            navigate('/minha-conta', { replace: true });
          }
        }
      } else {
        const r = await customerRecover(email);
        if (r.error) {
          toast({ title: 'Erro', description: r.error, variant: 'destructive' });
        } else {
          toast({ title: 'Verifique seu email', description: 'Enviamos um link para redefinir sua senha.' });
          setMode('login');
        }
      }
    } catch (err) {
      toast({ title: 'Erro inesperado', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#FAF8F2] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6 animate-[fadeIn_0.4s_ease-out]">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-background">
            <User className="h-5 w-5 text-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {mode === 'login' && 'Entrar'}
            {mode === 'signup' && 'Criar Conta'}
            {mode === 'recover' && 'Recuperar Senha'}
          </h1>
          <p className="font-sans text-sm text-muted-foreground">
            {mode === 'login' && 'Acesse sua conta Boleta'}
            {mode === 'signup' && 'Cadastre-se para acompanhar seus pedidos'}
            {mode === 'recover' && 'Receba um link para redefinir sua senha'}
          </p>
        </div>

        {/* Shop JS button - shortcut */}
        {mode === 'login' && (
          <>
            <div className="w-full flex justify-center">
              <shop-login-button
                shop-id={SHOP_ID}
                version="2"
                scope="openid email profile"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-[0.15em]">
                <span className="bg-[#FAF8F2] px-3 text-muted-foreground">ou</span>
              </div>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">Nome</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          {mode !== 'recover' && (
            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={5}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 font-semibold bg-[#F5B700] hover:bg-[#e0a800] text-black"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Criar conta' : 'Enviar link'
            )}
          </Button>
        </form>

        <div className="text-center text-sm font-sans space-y-1">
          {mode === 'login' && (
            <>
              <button type="button" onClick={() => setMode('recover')} className="text-muted-foreground hover:text-foreground underline underline-offset-2">
                Esqueci minha senha
              </button>
              <p className="text-muted-foreground">
                Não tem conta?{' '}
                <button type="button" onClick={() => setMode('signup')} className="text-foreground font-semibold hover:underline">
                  Cadastre-se
                </button>
              </p>
            </>
          )}
          {mode !== 'login' && (
            <button type="button" onClick={() => setMode('login')} className="text-muted-foreground hover:text-foreground underline underline-offset-2">
              Voltar ao login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
