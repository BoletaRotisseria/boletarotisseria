import { useEffect, useState, useCallback } from 'react';
import { fetchCustomer, getStoredToken, customerLogout, type ShopifyCustomer } from '@/lib/shopifyCustomer';

export function useShopifyCustomer() {
  const [customer, setCustomer] = useState<ShopifyCustomer | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const load = useCallback(async () => {
    const t = getStoredToken();
    setToken(t);
    if (!t) { setCustomer(null); setLoading(false); return; }
    setLoading(true);
    try {
      const c = await fetchCustomer(t);
      setCustomer(c);
    } catch {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('boleta:auth-change', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('boleta:auth-change', handler);
      window.removeEventListener('storage', handler);
    };
  }, [load]);

  const logout = useCallback(async () => {
    if (token) await customerLogout(token);
    setCustomer(null);
    setToken(null);
  }, [token]);

  return { customer, loading, token, isLoggedIn: !!customer, logout, reload: load };
}
