# Supabase Setup Guide (Option A — recommended)

The site's code has always targeted Supabase (Postgres), but **no Supabase project was ever connected** — that is why writes (contact, bookings, admin saves) fail while reads work (served from the Upstash Redis cache). This guide fixes it in ~5 minutes.

## 1. Create the project (you)
1. Go to <https://supabase.com> → **Start your project** (free tier is fine).
2. Create an organization + project. Name: e.g. `a9travel`. **Pick a region close to your users** (Singapore is a good choice for Myanmar).
3. Wait for provisioning (~1 min). Copy two values from **Project Settings → API**:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **service_role secret** (NOT the anon key — the code now uses the service role server-side; it never leaves the server)

## 2. Create the tables (you — 1 minute)
1. In the Supabase dashboard open **SQL Editor → New query**.
2. Paste the contents of `supabase/schema.sql` from this repo.
3. **Run.** It creates 12 tables (tours, hotels, cars, cruises, visas, insurances, blog, bookings, mingalar, site-config, settings, knowledge), indexes, and RLS (locked — only the service role can touch data; the public site only ever talks to our API routes, which use the service role server-side).

## 3. Add the env vars to Vercel (you or me)
In Vercel → Project → Settings → Environment Variables (Production):
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `SUPABASE_SERVICE_ROLE_KEY` = service_role secret

…or send me the two values and I add them via the Vercel CLI and trigger the deploy.

## 4. Redeploy
Any push to `main` triggers a deploy. Once live, all writes (contact, bookings, admin) persist to Postgres; Upstash Redis automatically becomes the cache tier (reads try Supabase first, fall back to Redis — existing code behavior).

## 5. Migrate existing data (recommended — keeps current tours/hotels/config/blog)
Your live content currently lives in Upstash Redis. One command copies it into Supabase:
```
cd frontend
set UPSTASH_REDIS_REST_URL=...  set UPSTASH_REDIS_REST_TOKEN=...  set NEXT_PUBLIC_SUPABASE_URL=...  set SUPABASE_SERVICE_ROLE_KEY=...
node scripts/migrate-from-redis.mjs
```
It upserts every record per collection (idempotent — safe to re-run).

## 6. Verify
1. Admin → edit any tour title → save → check Supabase **Table Editor → tours** row updated.
2. Submit the contact form → row appears under `bookings` with `travelType = contact`.
3. Make a test booking on /book-now → row appears; admin Bookings tab shows it.

## Rollback
Remove the two env vars → site returns to current Redis-only behavior. No code change needed.
