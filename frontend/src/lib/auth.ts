/**
 * Shared auth token helpers — HMAC-SHA256 signed tokens (Web Crypto).
 * Works in both Edge (middleware) and Node (API routes) runtimes.
 *
 * Token format: base64url(JSON payload) + "." + base64url(HMAC-SHA256(secret, payload))
 * Secret: AUTH_SECRET env (falls back to ADMIN_PASSWORD if set; fail-closed if neither).
 */
const encoder = new TextEncoder();

function b64urlEncode(input: string): string {
  const bytes = encoder.encode(input);
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(input: string): string {
  let b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function getSecret(): string {
  return process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || '';
}

async function hmacSign(data: string): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error('AUTH_SECRET not configured');
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const bytes = new Uint8Array(sig);
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export interface AuthPayload {
  id?: string;
  email?: string;
  role?: string;
  name?: string;
  authorities?: string[];
  iat?: number;
  exp?: number;
}

/** Roles allowed into the admin panel. Used by middleware + API routes. */
export const ADMIN_ROLES = ["admin", "staff", "editor", "viewer"] as const;

/** Role rank for permission checks (higher = more privileged). */
export const ROLE_RANK: Record<string, number> = {
  viewer: 0,
  editor: 1,
  staff: 2,
  admin: 3,
};

/** Resolve a role to its rank; unknown/missing roles get -1 (below viewer). */
export function roleRank(role?: string): number {
  return role ? (ROLE_RANK[role] ?? -1) : -1;
}

/** Sign a payload into a signed token. Throws if no secret configured. */
export async function signToken(payload: AuthPayload): Promise<string> {
  const body = b64urlEncode(JSON.stringify(payload));
  const sig = await hmacSign(body);
  return body + '.' + sig;
}

/** Verify a signed token. Returns payload or null (invalid/expired/no secret). */
export async function verifyToken(token: string | undefined | null): Promise<AuthPayload | null> {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [body, sig] = parts;
    if (!body || !sig) return null;
    const expected = await hmacSign(body);
    if (expected !== sig) return null;
    const payload = JSON.parse(b64urlDecode(body)) as AuthPayload;
    // FIX: 2026-08-04 accept exp in epoch-seconds OR epoch-ms (some signers use seconds)
    if (payload.exp) {
      const expMs = payload.exp < 1e12 ? payload.exp * 1000 : payload.exp;
      if (expMs < Date.now()) return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/** Client-safe: decode token payload WITHOUT verifying signature (signed format base64url(payload).base64url(sig)). */
export function decodeTokenPayload(token: string): AuthPayload | null {
  try {
    const body = token.split('.')[0];
    if (!body) return null;
    return JSON.parse(b64urlDecode(body)) as AuthPayload;
  } catch {
    return null;
  }
}

/** Verify an Authorization header / cookie token and confirm panel role access. */
export async function isAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const payload = await verifyToken(token);
  return !!payload?.role && (ADMIN_ROLES as readonly string[]).includes(payload.role);
}
