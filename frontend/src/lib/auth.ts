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
  purpose?: string;
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

/** All grantable section authorities (Section Access in Manage Users). */
export const ALL_AUTHORITIES = [
  "tours", "hotels", "cars", "cruises", "visas", "insurances",
  "bookings", "users", "settings", "blog", "destinations", "sky-lounge",
  "about", "site-manager", "knowledge",
] as const;

/** Map an admin pathname (page or /api/admin/* route) to the section authority/ies required to access it. */
export function sectionsForPath(pathname: string): string[] {
  const p = pathname.split("?")[0];
  const m: [string, string[]][] = [
    ["/admin/dashboard", []],
    ["/admin/about", ["about"]],
    ["/admin/site-manager", ["site-manager"]],
    ["/admin/tours", ["tours"]],
    ["/admin/hotels", ["hotels"]],
    ["/admin/cars", ["cars"]],
    ["/admin/cruises", ["cruises"]],
    ["/admin/visas", ["visas"]],
    ["/admin/insurance", ["insurances"]],
    ["/admin/blog", ["blog"]],
    ["/admin/destinations", ["destinations"]],
    ["/admin/sky-lounge", ["sky-lounge"]],
    ["/admin/bookings", ["bookings"]],
    ["/admin/knowledge", ["knowledge"]],
    ["/admin/users", ["users"]],
    ["/admin/settings", ["settings"]],
    ["/api/admin/tours", ["tours"]],
    ["/api/admin/hotels", ["hotels"]],
    ["/api/admin/cars", ["cars"]],
    ["/api/admin/cruises", ["cruises"]],
    ["/api/admin/visas", ["visas"]],
    ["/api/admin/insurances", ["insurances"]],
    ["/api/admin/blog", ["blog"]],
    ["/api/admin/destinations", ["destinations"]],
    ["/api/admin/mingalar", ["sky-lounge"]],
    ["/api/admin/bookings", ["bookings"]],
    ["/api/admin/knowledge", ["knowledge"]],
    ["/api/admin/users", ["users"]],
    ["/api/admin/settings", ["settings"]],
    ["/api/admin/chat-config", ["settings"]],
    ["/api/admin/site-config", ["site-manager", "about"]],
  ];
  for (const [prefix, secs] of m) {
    if (p === prefix || p.startsWith(prefix + "/")) return secs;
  }
  return [];
}

/** True when the token holder may access at least one required section. Admin (rank 3) = implicit all; empty authorities = all sections. */
export function hasSectionAccess(payload: AuthPayload | null, required: string[]): boolean {
  if (!payload || required.length === 0) return true;
  if (roleRank(payload.role) >= 3) return true;
  const auths = Array.isArray(payload.authorities) ? payload.authorities : [];
  if (auths.length === 0) return true;
  return auths.some((a) => required.includes(a));
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
