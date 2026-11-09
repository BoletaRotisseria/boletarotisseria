// Signed, short-lived state is only issued to authenticated administrators.
async function signature(payload: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function createOAuthState(userId: string, secret: string, now = Date.now()) {
  const payload = btoa(JSON.stringify({ userId, expiresAt: now + 10 * 60_000, nonce: crypto.randomUUID(), purpose: "bling-oauth" }));
  return `${payload}.${await signature(payload, secret)}`;
}

export async function verifyOAuthState(state: string, secret: string, now = Date.now()): Promise<string | null> {
  if (!state || state.length > 2048 || !secret) return null;
  const [payload, provided, extra] = state.split(".");
  if (!payload || !provided || extra) return null;
  const expected = await signature(payload, secret);
  if (provided.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
  if (diff) return null;
  try {
    const data = JSON.parse(atob(payload));
    if (data.purpose !== "bling-oauth" || typeof data.userId !== "string" || !data.userId || typeof data.expiresAt !== "number" || data.expiresAt <= now || data.expiresAt > now + 10 * 60_000) return null;
    return data.userId;
  } catch { return null; }
}