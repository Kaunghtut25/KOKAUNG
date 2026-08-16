// FIX 2026-08-16: server-side rate limiting via Upstash Redis REST (fail-open when not configured).
export type RateLimitResult = { ok: boolean; limit: number; remaining: number; retryAfterSec?: number };

export async function rateLimit(identifier: string, limit = 10, windowSec = 60): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { ok: true, limit, remaining: limit };
  const key = `rl:${identifier}:${Math.floor(Date.now() / (windowSec * 1000))}`;
  try {
    const inc = await fetch(`${url}/incr`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify([key]),
    });
    const incJson = await inc.json();
    const count = Number(incJson?.result ?? incJson);
    if (count === 1) {
      await fetch(`${url}/expire`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify([key, windowSec]),
      });
    }
    const remaining = Math.max(0, limit - count);
    if (count > limit) return { ok: false, limit, remaining: 0, retryAfterSec: windowSec };
    return { ok: true, limit, remaining };
  } catch {
    return { ok: true, limit, remaining: limit }; // fail open — never block real users on infra errors
  }
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for") || "";
  return fwd.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}
