// FIX 2026-08-16: pure promo state logic — extracted from DealsBanner for unit tests.
export type PromoStatus = "active" | "upcoming" | "expired" | "disabled";

export function computePromoStatus(endAt?: string, startAt?: string, now: number = Date.now()): PromoStatus {
  if (!endAt) return "disabled";
  const end = Date.parse(endAt);
  if (Number.isNaN(end)) return "disabled";
  if (startAt) {
    const start = Date.parse(startAt);
    if (!Number.isNaN(start) && now < start) return "upcoming";
  }
  if (now >= end) return "expired";
  return "active";
}

export function computeCountdown(targetEpoch: number, now: number = Date.now()): { d: number; h: number; m: number; s: number } | null {
  const diff = targetEpoch - now;
  if (diff <= 0) return null;
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor(diff / 3600000) % 24,
    m: Math.floor(diff / 60000) % 60,
    s: Math.floor(diff / 1000) % 60,
  };
}
