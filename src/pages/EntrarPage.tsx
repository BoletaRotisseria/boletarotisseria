import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { customerLogin, customerCreate, customerRecover } from '@/lib/shopifyCustomer';
import { useShopifyCustomer } from '@/hooks/useShopifyCustomer';
import { toast } from 'sonner';

export default function EntrarPage() {
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
          <p className="text-center text-sm text-muted-foreground">
            Não tem conta?{' '}
            <button type="button" onClick={() => { setError(null); setMode('signup'); }} className="text-foreground underline underline-offset-4 hover:text-foreground/80">
              Criar conta
            </button>
          </p>
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
