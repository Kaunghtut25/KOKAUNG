import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export const runtime = "nodejs";

// Fail closed: no hardcoded fallback credentials. Must be configured via env.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const credsConfigured = Boolean(ADMIN_EMAIL && ADMIN_PASSWORD);

// ── Rate limiting (Upstash Redis when available; in-memory fallback) ──
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 50; // counts FAILED attempts only; generous enough that a
// legit admin behind a shared NAT/WARP egress is never locked out, while still
// blocking brute force (3.3 tries/min max). Successful login resets the bucket.

let redisClient: any = null;
function getRedis(): any {
  if (redisClient) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  // Lazy require to keep middleware import graph clean (Node runtime here)
  try {
    const { Redis } = require("@upstash/redis");
    redisClient = new Redis({ url, token });
    return redisClient;
  } catch {
    return null;
  }
}

const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function bucketKey(ip: string): string {
  return "a9:rl:login:" + ip;
}

// Peek at current failure count WITHOUT incrementing, so a successful login
// never extends a stale window. Returns true when the IP is over the limit.
async function isRateLimited(ip: string): Promise<boolean> {
  const key = bucketKey(ip);
  const redis = getRedis();
  if (redis) {
    try {
      const count = await redis.get<number>(key);
      return (count || 0) > MAX_ATTEMPTS;
    } catch {
      // fall through to memory
    }
  }
  const bucket = memoryBuckets.get(key);
  if (!bucket || bucket.resetAt < Date.now()) return false;
  return bucket.count > MAX_ATTEMPTS;
}

// Called ONLY after a failed credential check (401 path).
async function recordFailure(ip: string): Promise<void> {
  const key = bucketKey(ip);
  const redis = getRedis();
  if (redis) {
    try {
      await redis.pipeline()
        .incr(key)
        .expire(key, Math.ceil(WINDOW_MS / 1000))
        .exec();
      return;
    } catch {
      // fall through to memory
    }
  }
  const now = Date.now();
  const bucket = memoryBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    bucket.count += 1;
  }
}

// Successful login clears the bucket so a legitimate admin never gets stuck.
async function resetRateLimit(ip: string): Promise<void> {
  try {
    const key = bucketKey(ip);
    const redis = getRedis();
    if (redis) {
      await redis.del(key);
    } else {
      memoryBuckets.delete(key);
    }
  } catch {
    // best-effort: never block a successful login
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!credsConfigured) {
      return NextResponse.json(
        { message: "Admin credentials are not configured on this server. Set ADMIN_EMAIL and ADMIN_PASSWORD." },
        { status: 503 }
      );
    }

    const ip = clientIp(request);
    if (await isRateLimited(ip)) {
      return NextResponse.json(
        { message: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const text = await request.text();
    let body: any;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }

    const email = body.email;
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      // Count this failure toward the window; then reject.
      await recordFailure(ip);
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Successful login: reset the rate-limit bucket so a legitimate admin
    // never gets stuck behind an old 429 window.
    await resetRateLimit(ip);

    const user = {
      id: "admin-001",
      email: ADMIN_EMAIL,
      name: "A9 Admin",
      role: "admin",
    };

    const token = await signToken({
      ...user,
      iat: Date.now(),
      exp: Date.now() + 86400000,
    });

    return NextResponse.json({ success: true, token, user });
  } catch (err) {
    console.error("[login] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
