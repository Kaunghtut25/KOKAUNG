/**
 * persistentStore.ts — Supabase-backed store (generic schema: id, payload jsonb, created_at, updated_at)
 * Falls back to Upstash Redis cache when Supabase is unavailable.
 * FIX 2026-08-16: Supabase branch rewritten for the generic schema (supabase/schema.sql).
 */

import { supabase } from './supabase';
import { Redis } from '@upstash/redis';

type Collection = "tours" | "hotels" | "cars" | "cruises" | "visas" | "insurances" | "blog" | "bookings" | "mingalar" | "site-config" | "settings" | "knowledge" | "destinations" | "users" | "audit-log";

// ── Redis client (lazy) ────────────────────────────────────
let _redis: any = null;
function getRedis(): any {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) { console.warn('[Store] Upstash Redis env vars missing'); return null; }
  _redis = new Redis({ url, token });
  console.warn('[Store] Upstash Redis connected');
  return _redis;
}

async function redisSet(collection: string, data: Record<string, any>): Promise<any> {
  const redis = getRedis(); if (!redis) return null;
  const id = data.id || "gen_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  const item = { ...data, id, updatedAt: new Date().toISOString() };
  try {
    // Add/update single item — do NOT delete whole hash (would wipe all other items)
    await redis.hset("a9:" + collection, { [id]: JSON.stringify(item) });
    return item;
  } catch (err: any) {
    console.warn("[Store] Redis hset(" + collection + ") failed:", err.message?.substring(0, 80));
    return null;
  }
}
async function redisGetAll(collection: string): Promise<any[] | null> {
  const redis = getRedis(); if (!redis) return null;
  try {
    const hash = await redis.hgetall("a9:" + collection);
    if (!hash) return [];
    return Object.values(hash).map((v: any) => { try { return JSON.parse(v); } catch { return v; } });
  } catch (err: any) {
    console.warn("[Store] Redis hgetall(" + collection + ") failed:", err.message?.substring(0, 80));
    return null;
  }
}
async function redisGetById(collection: string, id: string): Promise<any | null> {
  const redis = getRedis(); if (!redis) return null;
  try {
    const raw = await redis.hget("a9:" + collection, id);
    if (!raw) return null;
    try { return JSON.parse(raw as string); } catch { return raw; }
  } catch (err: any) {
    console.warn("[Store] Redis hget(" + collection + ", " + id + ") failed:", err.message?.substring(0, 80));
    return null;
  }
}
async function redisUpdate(collection: string, id: string, data: Record<string, any>): Promise<any | null> {
  const redis = getRedis(); if (!redis) return null;
  try {
    const existing = await redisGetById(collection, id);
    if (!existing) return null;
    const updated = { ...existing, ...data, id, updatedAt: new Date().toISOString() };
    await redis.hset("a9:" + collection, { [id]: JSON.stringify(updated) });
    return updated;
  } catch (err: any) {
    console.warn("[Store] Redis hset update(" + collection + ") failed:", err.message?.substring(0, 80));
    return null;
  }
}
async function redisDelete(collection: string, id: string): Promise<boolean> {
  const redis = getRedis(); if (!redis) return false;
  try {
    await redis.hdel("a9:" + collection, id);
    return true;
  } catch (err: any) {
    console.warn("[Store] Redis hdel(" + collection + ") failed:", err.message?.substring(0, 80));
    return false;
  }
}

// ── Supabase row mapping (generic schema) ──────────────────
function rowToRecord(row: any): any {
  if (!row) return row;
  if (!row.payload) return row; // tolerate legacy full-column rows
  return { ...row.payload, id: row.id, createdAt: row.created_at || row.payload.createdAt, updatedAt: row.updated_at || row.payload.updatedAt };
}
function recordToRow(record: any): Record<string, any> {
  const now = new Date().toISOString();
  return { id: record.id, payload: record, created_at: record.createdAt || now, updated_at: record.updatedAt || now };
}

// ── Public API ────────────────────────────────────────────

// FIX: 2026-08-17 audit - normalize stale placeholder phone in site-config
// (DB copy may hold +95 9 123 456 789; render-side fix until next admin save)
function sanitizeSiteConfigPhone(v: unknown): unknown {
  if (typeof v === "string") return v.replace(/\+?95 ?9 ?123 ?456 ?789/g, "+95 9 781 617 111");
  if (Array.isArray(v)) return v.map(sanitizeSiteConfigPhone);
  if (v && typeof v === "object") {
    const o: Record<string, unknown> = {};
    for (const k of Object.keys(v)) o[k] = sanitizeSiteConfigPhone((v as Record<string, unknown>)[k]);
    return o;
  }
  return v;
}

export async function getAll(collection: Collection): Promise<any[]> {
  const activeOnly = (items: any[]) => (items || []).filter((i: any) => i.status !== "inactive");
  const normalize = (items: any[]) => collection === "site-config" ? (items || []).map((i: any) => ({ ...i, ...(sanitizeSiteConfigPhone(i) as Record<string, unknown>) })) : items;
  try {
    const { data, error } = await supabase.from(collection).select('id,payload,created_at,updated_at').order('created_at', { ascending: false });
    if (!error && data) return normalize(activeOnly(data.map(rowToRecord)));
  } catch (err) {
    console.warn(`[Store] Supabase getAll(${collection}) failed, trying Redis:`, (err as Error).message?.substring(0, 80));
  }
  const redisData = await redisGetAll(collection);
  if (redisData !== null && redisData.length > 0) return normalize(activeOnly(redisData));
  console.warn(`[Store] Data unavailable for ${collection}`);
  return [];
}

export async function getById(collection: Collection, id: string): Promise<any | null> {
  try {
    const { data, error } = await supabase.from(collection).select('id,payload,created_at,updated_at').eq('id', id).maybeSingle();
    if (!error && data) return rowToRecord(data);
  } catch (err) {
    console.warn(`[Store] Supabase getById(${collection}, ${id}) failed:`, (err as Error).message?.substring(0, 80));
  }
  const redisItem = await redisGetById(collection, id);
  if (redisItem) return redisItem;
  console.warn(`[Store] getById — no data (no seed fallback)`);
  return null;
}

export async function create(collection: Collection, data: Record<string, any>): Promise<any> {
  const id = data.id || `gen_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const item = { ...data, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  try {
    const { data: result, error } = await supabase.from(collection).insert(recordToRow(item)).select('id,payload,created_at,updated_at').single();
    if (!error && result) {
      if (collection !== "audit-log") await appendAudit(collection, "create", id);
      return rowToRecord(result);
    }
  } catch (err) {
    console.warn(`[Store] Supabase create(${collection}) failed, trying Redis:`, (err as Error).message?.substring(0, 80));
  }
  const redisResult = await redisSet(collection, item);
  if (redisResult) {
    console.warn(`[Store] Saved ${collection}/${id} to Upstash Redis`);
    if (collection !== "audit-log") await appendAudit(collection, "create", id);
    return redisResult;
  }
  throw new Error(`Store unavailable: cannot persist ${collection}/${id} (no seed fallback)`);
}

export async function update(collection: Collection, id: string, data: Record<string, any>): Promise<any | null> {
  const payload = { ...data, updatedAt: new Date().toISOString() };
  try {
    const existingRow = await supabase.from(collection).select('payload').eq('id', id).maybeSingle();
    if (!existingRow.error && existingRow.data) {
      const merged = { ...existingRow.data.payload, ...payload, updatedAt: new Date().toISOString() };
      const { data: result, error } = await supabase.from(collection).update({ payload: merged, updated_at: merged.updatedAt }).eq('id', id).select('id,payload,created_at,updated_at').single();
      if (!error && result) {
        if (collection !== "audit-log") await appendAudit(collection, "update", id);
        return rowToRecord(result);
      }
    }
  } catch (err) {
    console.warn(`[Store] Supabase update(${collection}, ${id}) failed, trying Redis:`, (err as Error).message?.substring(0, 80));
  }
  const redisResult = await redisUpdate(collection, id, payload);
  if (redisResult) {
    console.warn(`[Store] Updated ${collection}/${id} in Upstash Redis`);
    if (collection !== "audit-log") await appendAudit(collection, "update", id);
    return redisResult;
  }
  return null;
}

export const delete_ = async (collection: Collection, id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from(collection).delete().eq('id', id);
    if (!error) {
      if (collection !== "audit-log") await appendAudit(collection, "delete", id);
      return true;
    }
  } catch (err) {
    console.warn(`[Store] Supabase delete(${collection}, ${id}) failed:`, (err as Error).message?.substring(0, 80));
  }
  const redisOk = await redisDelete(collection, id);
  if (redisOk) {
    console.warn(`[Store] Deleted ${collection}/${id} from Upstash Redis`);
    if (collection !== "audit-log") await appendAudit(collection, "delete", id);
    return true;
  }
  return false;

};

export async function getBookings(): Promise<any[]> {
  return getAll("bookings");
}

export async function getDashboardStats(): Promise<Record<string, number>> {
  try {
    const [tours, hotels, cars, cruises, visas, insurances, blog, bookings, mingalar] = await Promise.all([
      getAll("tours"), getAll("hotels"), getAll("cars"), getAll("cruises"),
      getAll("visas"), getAll("insurances"), getAll("blog"), getAll("bookings"), getAll("mingalar"),
    ]);
    return {
      tours: tours.length, hotels: hotels.length, cars: cars.length,
      cruises: cruises.length, visas: visas.length, insurances: insurances.length,
      blog: blog.length, bookings: bookings.length, mingalar: mingalar.length,
    };
  } catch {
    return {
      tours: 0, hotels: 0, cars: 0, cruises: 0, visas: 0,
      insurances: 0, blog: 0, bookings: 0, mingalar: 0,
    };
  }
}

export const updateById = update;
export const deleteById = delete_;

// ── Audit logging (FIX 2026-08-17 Phase 22) ──────────────────
async function appendAudit(collection: string, action: "create" | "update" | "delete", id: string): Promise<void> {
  try {
    await create("audit-log", {
      collection,
      action,
      targetId: id,
      at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("[Store] audit-log write failed:", (err as Error).message?.substring(0, 80));
  }
}
