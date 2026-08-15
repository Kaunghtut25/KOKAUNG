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
