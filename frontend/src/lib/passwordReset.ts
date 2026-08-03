/**
 * passwordReset.ts — OTP + one-time reset-token helpers for admin password recovery.
 * Storage: Upstash Redis (a9:otp:<email>, a9:rst:<tokenHash>, a9:rl:otp*) with in-memory fallback.
 * Uses the same lazy Redis pattern as login/chat routes. Node runtime only.
 */
import { createHash, randomBytes, timingSafeEqual } from "crypto";

const OTP_TTL_SECONDS = 10 * 60; // 10 minutes
const MAX_ATTEMPTS = 5;
const RESEND_MIN_INTERVAL_MS = 60 * 1000; // min 60s between OTP emails to same address
const RESEND_MAX_PER_HOUR = 5;

let redisClient: any = null;
function getRedis(): any {
  if (redisClient) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const { Redis } = require("@upstash/redis");
    redisClient = new Redis({ url, token });
    return redisClient;
  } catch {
    return null;
  }
}

// ── in-memory fallback (survives per-instance; Redis is authoritative when present) ──
const memOtp = new Map<string, { otp: string; expiresAt: number; attempts: number }>();
const memReset = new Map<string, number>(); // tokenHash -> expiresAt
const memRl = new Map<string, number[]>(); // key -> [timestamps]

export function generateOtp(): string {
  // 6-digit numeric OTP from crypto randomness
  const buf = randomBytes(4);
  const num = buf.readUInt32BE(0) % 1000000;
  return String(num).padStart(6, "0");
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// ── OTP issue ──
export async function issueOtp(email: string): Promise<{ otp: string; email: string }> {
  const otp = generateOtp();
  const now = Date.now();
  const expiresAt = now + OTP_TTL_SECONDS * 1000;
  const record = JSON.stringify({ otp, expiresAt, attempts: 0 });
  const redis = getRedis();
  if (redis) {
    try {
      await redis.set("a9:otp:" + email, record, { ex: OTP_TTL_SECONDS });
      return { otp, email };
    } catch {
      // fall through to memory
    }
  }
  memOtp.set(email, { otp, expiresAt, attempts: 0 });
  return { otp, email };
}

// ── OTP verify (attempts-limited) ──
export async function verifyOtp(email: string, otp: string): Promise<{ ok: boolean; reason?: string; attemptsLeft?: number }> {
  const redis = getRedis();
  if (redis) {
    try {
      const raw = await redis.get("a9:otp:" + email);
      if (!raw) return { ok: false, reason: "expired" };
      let rec: any = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (Date.now() > rec.expiresAt) {
        await redis.del("a9:otp:" + email);
        return { ok: false, reason: "expired" };
      }
      if (rec.attempts >= MAX_ATTEMPTS) {
        await redis.del("a9:otp:" + email);
        return { ok: false, reason: "too-many" };
      }
      const a = Buffer.from(String(rec.otp));
      const b = Buffer.from(String(otp || ""));
      const match = a.length === b.length && timingSafeEqual(a, b);
      if (!match) {
        rec.attempts += 1;
        await redis.set("a9:otp:" + email, JSON.stringify(rec), { ex: Math.max(1, Math.ceil((rec.expiresAt - Date.now()) / 1000)) });
        return { ok: false, reason: "invalid", attemptsLeft: MAX_ATTEMPTS - rec.attempts };
      }
      await redis.del("a9:otp:" + email);
      return { ok: true };
    } catch {
      // fall through to memory
    }
  }
  const rec = memOtp.get(email);
  if (!rec) return { ok: false, reason: "expired" };
  if (Date.now() > rec.expiresAt) { memOtp.delete(email); return { ok: false, reason: "expired" }; }
  if (rec.attempts >= MAX_ATTEMPTS) { memOtp.delete(email); return { ok: false, reason: "too-many" }; }
  const a = Buffer.from(rec.otp);
  const b = Buffer.from(otp || "");
  if (a.length === b.length && timingSafeEqual(a, b)) {
    memOtp.delete(email);
    return { ok: true };
  }
  rec.attempts += 1;
  return { ok: false, reason: "invalid", attemptsLeft: MAX_ATTEMPTS - rec.attempts };
}

// ── one-time reset token registry ──
export async function storeResetToken(token: string): Promise<void> {
  const h = hashToken(token);
  const redis = getRedis();
  if (redis) {
    try { await redis.set("a9:rst:" + h, "1", { ex: OTP_TTL_SECONDS }); return; } catch { /* fall */ }
  }
  memReset.set(h, Date.now() + OTP_TTL_SECONDS * 1000);
}

export async function consumeResetToken(token: string): Promise<boolean> {
  const h = hashToken(token);
  const redis = getRedis();
  if (redis) {
    try {
      const exists = await redis.get("a9:rst:" + h);
      if (!exists) return false;
      await redis.del("a9:rst:" + h);
      return true;
    } catch { /* fall */ }
  }
  const exp = memReset.get(h);
  if (!exp) return false;
  memReset.delete(h);
  return Date.now() <= exp;
}

// ── resend / abuse rate limiting ──
export async function canSendOtp(email: string, ip: string): Promise<{ ok: boolean; reason?: string }> {
  const redis = getRedis();
  const keyEmail = "a9:rl:otp:" + email;
  const keyIp = "a9:rl:otpip:" + ip;
  if (redis) {
    try {
      const [lastEmail, hourCount] = await Promise.all([
        redis.get(keyEmail),
        redis.get(keyIp),
      ]);
      if (lastEmail && Date.now() - lastEmail < RESEND_MIN_INTERVAL_MS) {
        return { ok: false, reason: "Please wait a minute before requesting another code." };
      }
      if ((hourCount || 0) >= RESEND_MAX_PER_HOUR) {
        return { ok: false, reason: "Too many reset requests. Try again later." };
      }
      return { ok: true };
    } catch {
      // fall through
    }
  }
  const now = Date.now();
  const last = memRl.get(keyEmail) || [];
  if (last.length && now - last[last.length - 1] < RESEND_MIN_INTERVAL_MS) {
    return { ok: false, reason: "Please wait a minute before requesting another code." };
  }
  const ipTimes = memRl.get(keyIp) || [];
  if (ipTimes.filter((t) => now - t < 3600000).length >= RESEND_MAX_PER_HOUR) {
    return { ok: false, reason: "Too many reset requests. Try again later." };
  }
  return { ok: true };
}

export async function recordOtpSend(email: string, ip: string): Promise<void> {
  const now = Date.now();
  const redis = getRedis();
  if (redis) {
    try {
      await Promise.all([
        redis.set("a9:rl:otp:" + email, now, { ex: 3600 }),
        redis.incr("a9:rl:otpip:" + ip).then(() => redis.expire("a9:rl:otpip:" + ip, 3600)),
      ]);
      return;
    } catch {
      // fall through
    }
  }
  const e = memRl.get(email) || []; e.push(now); memRl.set(email, e);
  const i = memRl.get(ip) || []; i.push(now); memRl.set(ip, i);
}
