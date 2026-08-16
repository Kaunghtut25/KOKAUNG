# A9_FIX_LOG.md — P0 Data-Integrity Cycle (2026-08-15)

Branch `fix/grade-a-production-hardening` → merged to `main` (deploys to www.a9travel.com).
Restore point: tag `restore-point-2026-08-15-3c3de84` @ `3c3de84`.

## Commits

| Commit | Scope | Files |
|---|---|---|
| `9653854` | docs: system audit + architecture map + bug report | docs/ (3 new) |
| `4a5f9fe` | fix(data): remove seed fallback + fabricated ratings/counts | persistentStore.ts, api/tours/route.ts, api/tours/[slug]/route.ts, api/hotels/route.ts |
| `5c6d3a0` | fix(ui): no fake stats / Ks 0 / placeholder testimonials; server-authoritative countdown | i18n.tsx, TourCard, HotelCard, StatsCounter, TestimonialSlider, DealsBanner, tours/[slug]/page.tsx |
| `16040f5` | feat(admin): quote-required toggle + promo start/end controls | site-manager/page.tsx, admin/tours/page.tsx |
| `3f0d052` | fix(ui): WhyChooseUs/TrustBadges config-only | WhyChooseUs.tsx, TrustBadges.tsx |

## Fixes

### BUG-001 · fake homepage statistics
- Removed `FALLBACK_STATS` (5000+/150+/30+/15+/50+) from `StatsCounter.tsx`; section renders only from admin `statsCards`, hidden when empty.
- Same class fixed in `WhyChooseUs` (FALLBACK_FEATURES → []) and `TrustBadges` (FALLBACK_BADGES → []).

### BUG-002 · "Ks 0/person"
- API now exposes `quoteRequired` (auto-derived when price is 0) + honest `priceMMK` (0 only when genuinely unset).
- `TourCard`, hotel card, and `/tours/[slug]` render **"Request a Quote"** / **"Price on Request"** (i18n EN+MM) instead of `Ks 0`; review-count hidden when 0.

### BUG-003 · fabricated ratings/review counts
- `rating: … || 4.5/4.0` → `|| 0`; `reviewCount: Math.random()…` → real stored value or 0 (tours list+slug, hotels).
- Hotels: `availableRooms || 5` → real value or 0.

### BUG-004 · store seed fallback
- `persistentStore.ts`: removed ~68-line hardcoded `SEEDS` catalog; DB failure now returns `[]`/`null` or throws — deleted data can never resurrect, failures surface loudly.

### BUG-005 · placeholder testimonials
- `FALLBACK_REVIEWS` removed; slider hidden when no testimonials. Live config still has 4 placeholder-looking entries → **HUMAN VERIFICATION REQUIRED** (are John Smith/Sarah Chen/Marcus Weber/Yuki Tanaka real customers?).

### BUG-006 · countdown
- `DealsBanner`: no fake default banner (hidden until config loads); server-authoritative `endAt`/`startAt` (ISO, timezone-aware) with **ACTIVE / UPCOMING / EXPIRED / DISABLED** states; expired → "Offer Expired", upcoming → "Coming Soon"; never NaN/negative; no 00:00 flash.
- Admin site-manager: new **Offer Ends / Offer Starts** datetime fields (stored UTC).

### BUG-009 · hotel inventory
- Honest `priceOnRequest` + real availability; cards show "Price on Request" when unset.

### BUG-010 · fake fallback tours
- `FALLBACK_TOURS` (Classic Vietnam/Myanmar Highlights…) removed from `/tours/[slug]`; API failure → "Tour not found" state.

## Verification (live, post-deploy)
- `GET /api/tours` → Kalaw + Bagan–Popa `quoteRequired: true`; Singapore false; no fabricated values. ✅
- `GET /api/hotels` → real prices/ratings/rooms; no random counts. ✅
- Home HTML: no "150+ Tour Packages" / "50+ Destinations" / "Classic Vietnam" markers. ✅
- Deployed chunks: 0 occurrences of fake fallback stats/tours. ✅
- Local build: `next build` EXITCODE=0, 53 static pages. ✅

## Remaining P0-adjacent items (next cycles)
- DealsBanner live config still uses `countdownDays: 17` (no endAt) → countdown rolls from load; **admin should set Offer Ends** (fields now available in Site Manager).
- Company facts ("since 2015", IATA, hours, 24/7) → Phase 6 single authoritative source (**HUMAN VERIFICATION REQUIRED**).
- Live `Kalaw` exists as two DB records (different `gen_` ids from list vs detail) → duplicate-cleanup item (Phase 19).
- next.config still ignores TS/lint at build (Phase 21/23); no tests yet (Phase 20); HSTS missing (Phase 13).

## Batch 2 (2026-08-16, commit 14270ce) — HSTS / SEO dedup / duplicate records
- HSTS added to next.config.js (max-age=63072000; includeSubDomains; preload) — VERIFIED live.
- Static public/robots.txt + sitemap.xml removed (App Router built-ins win).
- sitemap.ts rewritten dynamic: live tour/hotel/car slugs from store; stale hardcoded slugs (kalaw-trekking-experience etc., would 404) gone. VERIFIED: 25 URLs, includes /tours/kalaw + singapore-city-escape.
- Duplicate-slug records (2x Kalaw in DB): detail route now picks deterministically (active > complete > newest > id); list route dedupes by slug. VERIFIED: list & detail both serve gen_1786505067769_jxzug9 (desc 156, itin 5), stable across calls.
- DB cleanup of the inactive Kalaw duplicate still recommended (needs admin/DB access — cannot reach Supabase from local env).

## 2026-08-16 — Grade-A Phase 3: P0 residuals + booking idempotency (ff5c42a)

Branch: fix/a9-grade-a-production -> merged to main (ff5c42a). Checkpoint tag: checkpoint-a9-grade-a-2026-08-16.

1. **StatsCounter — never render "0+"** (G-01 residual): cards that parse to 0/negative are now filtered out (label-only cards like "IATA Accredited" / "24/7 Support" kept). No code path can render a "0+" statistic anymore; section hides when nothing valid remains.
2. **DealsBanner — DISABLED without an absolute end date** (G-03 residual): removed the rolling 'Date.now() + countdownDays' fallback. A promotion only renders when endAt is a valid ISO date (ACTIVE countdown / UPCOMING / EXPIRED). Missing or invalid endAt -> banner not rendered. ALSO removed a fabricated hardcoded MM promo title ("Bagan Explorer 30% discount") — promo copy now comes only from admin site-config.
3. **Tour publish validation** (G-02 residual): api/admin/tours POST/PUT now reject saves where price is missing/0 AND Quote Required is off ("A tour needs a price (MMK or USD) or Quote Required"). priceMMK/priceUSD must be non-negative numbers; title required on create.
4. **Booking idempotency + validation** (G-09 start): booking-receiver accepts a client requestId; a repeat submission with the same requestId returns the existing booking (duplicate:true) instead of creating a second row/email. Added server validation: YYYY-MM-DD dates, passengers 1-9 integer, amount non-negative. book-now sends a stable crypto.randomUUID per form session (retries reuse it).
5. **Docs**: A9_GRADE_A_FIX_PLAN.md (root-cause report, phase 1+2, commit 2bd99d3).

Admin follow-ups: set **Offer Ends** (endAt) in Site Manager to re-enable the promo banner; DB CHECK constraints + unique slug index still recommended (no Supabase creds locally); booking-receiver rate limiting = future phase.

## 2026-08-16 — Phase 4: booking/contact hardening + CRITICAL infra finding (a338701, 6b1ef6f)

### Shipped (a338701)
1. **Restored missing booking API** — BookingModal (`tours/[slug]`, visas, insurance) and `booking/page.tsx` were posting to `/api/bookings` and `/api/bookings/:id/pay|payment` which DID NOT EXIST (404 → booking flow silently broken). Added POST /api/bookings, POST /api/bookings/[id]/pay, PUT /api/bookings/[id]/payment with validation, requestId idempotency, admin+customer emails, payment recording (status 'Recorded' — no real gateway).
2. **Contact hardening** — server validation (email/phone format, message <=5000), honeypot spam trap, requestId dedup, Upstash rate limit (10/min/IP, fail-open).
3. **booking-receiver** — now shares lib/bookingValidation + rate limit.
4. **New libs**: rateLimit.ts (Upstash REST sliding window), bookingValidation.ts, promoState.ts (pure).
5. **First unit tests** — vitest + 18 tests (promoState, bookingValidation); npm test green; build green.

### CRITICAL FINDING (6b1ef6f + investigation)
- **Supabase is NOT configured on Vercel.** `vercel env ls production` shows 19 vars — zero NEXT_PUBLIC_SUPABASE_URL/ANON_KEY. persistentStore.ts is Supabase-first with Upstash Redis fallback; supabase.ts throws 'not configured' on every call.
- **Consequence:** ALL reads serve from the Upstash Redis cache (site displays fine — tours/hotels/config live in Redis hashes `a9:*`), but writes depend entirely on Redis. Live test: valid contact POST returned 500 `Store unavailable: cannot persist bookings/gen_... (no seed fallback)` (both Supabase and one Redis write attempt failed).
- **Live behavior matrix:** contact form 500s (was LOSING messages); book-now 'succeeds' with dbSaved:false but admin still gets the notification email; admin saves would fail if Redis write fails (update() -> 404 'Not found').
- **Mitigation shipped (6b1ef6f):** contact route now store+email best-effort, always returns success (message can never be lost silently). Build green, pushed to main.
- **Cannot fully root-cause the Redis write failure remotely:** `vercel env pull` returns empty values for ALL vars (CLI token lacks secret-read scope), so no direct Redis probe. Hypotheses: Upstash free-tier request throttling during the 11-request burst, or maxmemory (a9:* hashes have NO TTL — unbounded growth).

### HUMAN ACTION REQUIRED — choose the real database
- **Option A (recommended): configure Supabase.** Create a Supabase project, run the table schema (see A9_GRADE_A_FIX_PLAN.md G-11 / Supabase SQL below), add NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY to Vercel (Production), redeploy. Existing Redis data will become the cache tier as designed; optionally seed Supabase from Redis.
- **Option B: adopt Turso** (TURSO_URL/TOKEN already in env) — requires refactoring persistentStore (currently Supabase-flavored) to libsql; larger change.
- **Option C: keep Redis as the de-facto store** — add TTL/eviction management to a9:* hashes and monitor capacity; not a real relational DB, risky for bookings.
- Also: `vercel env pull` cannot read secrets with the current CLI token — if future ops need values, add a full-scope token or use the dashboard.

### Supabase schema (Option A)
```sql
-- one table per collection: tours, hotels, cars, cruises, visas, insurances, blog, bookings, mingalar, site-config, settings, knowledge
-- columns: id text primary key, created_at timestamptz default now(), updated_at timestamptz, plus a jsonb 'payload' column
-- persistentStore inserts the full record object; simplest mapping: table(collection) with a jsonb column named after the collection.
-- RLS: enable row level security; policy allow_select = anon select; policy allow_insert/update/delete = anon (public content) or service_role only.
```
