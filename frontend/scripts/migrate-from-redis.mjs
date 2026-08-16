// A9Travel — migrate existing data from Upstash Redis (current de-facto store) into Supabase.
// Prereq (run from the frontend dir): env with real values, e.g. via a local .env or shell:
//   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Run:  cd frontend && node scripts/migrate-from-redis.mjs
import { Redis } from "@upstash/redis";
import { createClient } from "@supabase/supabase-js";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!redisUrl || !redisToken || !sbUrl || !sbKey) {
  console.error("Missing env. Need UPSTASH_REDIS_REST_URL/TOKEN + NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const redis = new Redis({ url: redisUrl, token: redisToken });
const sb = createClient(sbUrl, sbKey, { auth: { persistSession: false } });

const collections = ["tours", "hotels", "cars", "cruises", "visas", "insurances", "blog", "bookings", "mingalar", "site-config", "settings", "knowledge"];

for (const c of collections) {
  try {
    const hash = await redis.hgetall("a9:" + c);
    const entries = Object.entries(hash || {});
    if (entries.length === 0) { console.log(c + ": 0 (empty)"); continue; }
    let ok = 0, skip = 0;
    for (const [id, raw] of entries) {
      let rec;
      try { rec = JSON.parse(raw); } catch { rec = { id }; }
      if (!rec || typeof rec !== "object") { skip++; continue; }
      const now = rec.createdAt || new Date().toISOString();
      const row = { id, payload: rec, created_at: now, updated_at: rec.updatedAt || now };
      const { error } = await sb.from(c).upsert(row, { onConflict: "id" });
      if (error) { console.error("  " + c + "/" + id + " FAILED:", error.message); skip++; }
      else ok++;
    }
    console.log(c + ": " + ok + " migrated, " + skip + " failed/skipped");
  } catch (e) {
    console.error(c + ": ERROR " + e.message);
  }
}
console.log("Done. Verify in Supabase Dashboard -> Table Editor.");
