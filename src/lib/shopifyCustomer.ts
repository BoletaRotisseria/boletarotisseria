// Shopify Storefront Customer API
// Token com scopes: unauthenticated_read/write_customers, unauthenticated_read_customer_tags
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE = 'boleta-direct-8l7a1.myshopify.com';
const SHOPIFY_URL = `https://${SHOPIFY_STORE}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const CUSTOMER_TOKEN = '58f343adbc198074febf9ab590d42a88';

const LS_TOKEN_KEY = 'boleta_customer_access_token';
const LS_EXPIRES_KEY = 'boleta_customer_access_expires';

async function gql(query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(SHOPIFY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': CUSTOMER_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map((e: { message: string }) => e.message).join(', '));
  return json.data;
}

export interface CustomerToken {
  accessToken: string;
  expiresAt: string;
}

export interface ShopifyCustomer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  email: string | null;
  phone: string | null;
  defaultAddress: ShopifyAddress | null;
  addresses: { edges: Array<{ node: ShopifyAddress }> };
  orders: { edges: Array<{ node: ShopifyOrder }> };
}

export interface ShopifyAddress {
  id: string;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  zip: string | null;
  country: string | null;
  phone: string | null;
}

export interface ShopifyOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  totalPrice: { amount: string; currencyCode: string };
  statusUrl: string;
  lineItems: {
    edges: Array<{ node: { title: string; quantity: number } }>;
  };
}

// ============ Auth ============
export async function customerLogin(email: string, password: string): Promise<{ token?: CustomerToken; error?: string }> {
  const data = await gql(
    `mutation ($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { code message }
      }
    }`,
    { input: { email, password } }
  );
  const errs = data?.customerAccessTokenCreate?.customerUserErrors ?? [];
  if (errs.length) return { error: errs[0].message };
  const t = data?.customerAccessTokenCreate?.customerAccessToken;
  if (!t) return { error: 'Falha ao autenticar' };
  saveToken(t);
  return { token: t };
}

export async function customerCreate(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
}): Promise<{ error?: string; ok?: boolean }> {
  const data = await gql(
    `mutation ($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id }
        customerUserErrors { code message field }
      }
    }`,
    { input }
  );
  const errs = data?.customerCreate?.customerUserErrors ?? [];
  if (errs.length) return { error: errs[0].message };
  return { ok: true };
}

export async function customerRecover(email: string): Promise<{ error?: string; ok?: boolean }> {
  const data = await gql(
    `mutation ($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors { code message }
      }
    }`,
    { email }
  );
  const errs = data?.customerRecover?.customerUserErrors ?? [];
  if (errs.length) return { error: errs[0].message };
  return { ok: true };
}

export async function fetchCustomer(accessToken: string): Promise<ShopifyCustomer | null> {
  const data = await gql(
    `query ($token: String!) {
      customer(customerAccessToken: $token) {
        id firstName lastName displayName email phone
        defaultAddress { id address1 address2 city province zip country phone }
        addresses(first: 10) {
          edges { node { id address1 address2 city province zip country phone } }
        }
        orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
          edges { node {
            id orderNumber processedAt financialStatus fulfillmentStatus statusUrl
            totalPrice { amount currencyCode }
            lineItems(first: 20) { edges { node { title quantity } } }
          } }
        }
      }
    }`,
    { token: accessToken }
  );
  return data?.customer ?? null;
}

export async function customerLogout(accessToken: string) {
  try {
    await gql(
      `mutation ($token: String!) {
        customerAccessTokenDelete(customerAccessToken: $token) {
          deletedAccessToken
        }
      }`,
      { token: accessToken }
    );
  } catch { /* ignore */ }
  clearToken();
}

// ============ localStorage helpers ============
export function saveToken(t: CustomerToken) {
  localStorage.setItem(LS_TOKEN_KEY, t.accessToken);
  localStorage.setItem(LS_EXPIRES_KEY, t.expiresAt);
  window.dispatchEvent(new Event('boleta:auth-change'));
}

export function clearToken() {
  localStorage.removeItem(LS_TOKEN_KEY);
  localStorage.removeItem(LS_EXPIRES_KEY);
  window.dispatchEvent(new Event('boleta:auth-change'));
}

export function getStoredToken(): string | null {
  const token = localStorage.getItem(LS_TOKEN_KEY);
  const expires = localStorage.getItem(LS_EXPIRES_KEY);
  if (!token || !expires) return null;
  if (new Date(expires).getTime() < Date.now()) {
    clearToken();
    return null;
  }
  return token;
}
