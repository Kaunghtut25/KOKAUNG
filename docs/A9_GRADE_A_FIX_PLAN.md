# A9_GRADE_A_FIX_PLAN.md — Root-Cause Report (Phase 1 + 2)

- **Target:** https://www.a9travel.com/ (repo `Kaunghtut25/KOKAUNG`, Next.js 14.2.15 App Router)
- **Branch:** `fix/a9-grade-a-production` (created from `main` @ `f92aa96`)
- **Checkpoint tag:** `checkpoint-a9-grade-a-2026-08-16`
- **Date:** 2026-08-16
- **Status legend:** `FIXED` (tested live) · `PARTIAL` · `NOT FIXED` · `NOT AUDITED` · `HUMAN VERIFICATION REQUIRED`

> This report covers PHASE 1 (architecture discovery) + PHASE 2 (P0/P1 reproduction).
> **No application code was modified in this pass** — findings only, per the execution order.

---

## 1. Architecture (verified from source)

| Layer | Technology | Location |
|---|---|---|
| Frontend | Next.js 14.2.15 (App Router), React 18.3.1, TS 5.4.5, Tailwind 3.4.4, i18n (EN/MM) | `frontend/src` |
| API | App-Router route handlers (47 routes) — production data path | `frontend/src/app/api` |
| Data | `persistentStore.ts`: Supabase Postgres primary → Upstash Redis cache → Vercel Blob (uploads); **no local ORM** | `frontend/src/lib/persistentStore.ts` |
| Auth | HMAC-SHA256 JWT (`AUTH_SECRET`), cookie `a9_admin_token` + Bearer; RBAC roles admin/staff/editor/viewer | `src/lib/auth.ts`, `src/middleware.ts` |
| Admin | 20 pages under `/admin`, role-gated in middleware + layout + sidebar | `frontend/src/app/admin` |
| Email | Resend (`FROM_EMAIL`) | `api/booking-receiver`, `api/auth/*` |
| Payments | **None.** Booking = inquiry → email (affiliate id only) | `api/booking-receiver` |
| Booking | Public `/book-now` + `/booking` forms → `api/booking-receiver` → admin bookings | see Booking row |
| Flights | Amadeus API (search only) | `api/amadeus` |
| Legacy | Express backend (`backend/`) — **not the production path** | `backend/` |
| Deploy | GitHub → Vercel (main branch), custom build `cd frontend && next build` | `.vercel`, `frontend/next.config.js` |
| SEO | App Router `robots.ts` + dynamic `sitemap.ts` (fixed 2026-08-16) | `frontend/src/app/` |
| CI | `.github/workflows/ci.yml` — type-check is `continue-on-error: true`; **no runs observed (Actions appears disabled)** | `.github/` |

**Data flow (admin):** Admin UI → `api/admin/*` → `persistentStore` → Supabase (+Redis cache) → public `api/*` → client components.

---

## 2. Issue Tracker

| ID | Issue | Sev | Root Cause | File | API | DB | Status |
| -- | ----- | --- | ---------- | ---- | --- | -- | ------ |
| G-01 | Homepage "0+" / fake statistics | P0 | Hardcoded `FALLBACK_STATS` rendered when config missing; stats now config-only but `parseStat` still renders `0` if a card parses to 0 | `components/StatsCounter.tsx` | `api/admin/site-config` | `site-config.statsCards` | **FIXED** (live-tested) + residual |
| G-02 | Tour price "Ks 0/person" | P0 | DB records have `priceMMK=0`; renderer had no quote-state | `components/TourCard.tsx`, `api/tours`, `api/tours/[slug]` | `api/tours`, `api/tours/[slug]` | `tours.priceMMK/priceUSD/quote_required` | **FIXED** (live-tested) + business check |
| G-03 | Countdown "00 00 00 00" | P0 | Client-side `Date.now()+countdownDays`, no expiry | `components/DealsBanner.tsx` | `api/admin/site-config` | `site-config.dealsBanner` | **FIXED** (live-tested) + residual |
| G-04 | Company info inconsistent ("since 2015" ×10, timeline 2017/2019/2020/2022) | P0 | No single authoritative company source; facts duplicated/hardcoded | `CompanyTimeline.tsx`, `WhyChooseUs.tsx`, `layout.tsx`, `i18n.tsx`, `about/*`, `api/chat`, `api/admin/site-config` | `api/admin/site-config` | none (`about.founded` undefined) | **NOT FIXED** — HUMAN VERIFICATION REQUIRED |
| G-05 | "24/7 Support" claim vs no business hours | P1 | Claim in 11 files; no `businessHours`/`emergency_support` fields exist | `StatsCounter.tsx` (config), `TrustBadges.tsx`, `WhyChooseUs.tsx`, `contact/contactclient.tsx`, `FAQAccordion.tsx`, `i18n.tsx`, blog/insurance details | `api/admin/site-config` | none | **NOT FIXED** — HUMAN VERIFICATION REQUIRED |
| G-06 | Placeholder testimonials | P1 | 4 config entries (John Smith/AU, Sarah Chen/SG, Marcus Weber/DE, Yuki Tanaka/JP); no verified/source/date fields; hardcoded fallback removed 2026-08-15 | `TestimonialSlider.tsx`, site-config | `api/admin/site-config` | `site-config.testimonials` | **PARTIAL** — HUMAN VERIFICATION REQUIRED |
| G-07 | Tour/destination counts | P1 | Counts now computed from API data; homepage destinations = 0 (deleted); check marketing counts elsewhere | `tours/toursclient.tsx` (real), `CompanyTimeline.tsx` ("30+ packages") | `api/tours`, `api/destinations` | `tours.status` | **PARTIAL** — timeline claim needs verification |
| G-08 | Hotel data / room inventory | P1 | Prices/ratings real (verified); `availableRooms` origin unverifiable (marketing vs live inventory) | `components/HotelCard.tsx`, `api/hotels` | `api/hotels` | `hotels.availableRooms` | **PARTIAL** — HUMAN VERIFICATION REQUIRED |
| G-09 | Booking flow E2E | P1 | Not yet audited (needs browser forms + email); no duplicate-submit/CSRF/rate-limit verification | `app/book-now`, `app/booking`, `api/booking-receiver`, `admin/bookings` | `api/booking-receiver` | `bookings` | **NOT AUDITED** |
| G-10 | Contact form hardening | P1 | Basic validation exists; spam protection/rate limit/CSRF/duplicate-submit not verified | `contact/contactclient.tsx`, `api/contact` | `api/contact` | `messages` (or email) | **NOT AUDITED** |
| G-11 | Admin→API→DB→Frontend sync | P1 | Chain exists; `SEEDS` fallback removed 2026-08-15; adminStore has own fallbacks; no audit log | `lib/persistentStore.ts`, `lib/adminStore.ts` | all `api/admin/*` | all tables | **PARTIAL** |
| G-12 | Security headers | P2 | HSTS added 2026-08-16 (live); CSP still uses `unsafe-inline`/`unsafe-eval` (Next.js runtime needs; document) | `next.config.js` | — | — | **FIXED** (HSTS) + review |
| G-13 | Tests / CI gates | P2 | **Zero tests in repo**; CI type-check `continue-on-error: true`; no gating | — | — | — | **NOT FIXED** |

---

## 3. Detailed Root Causes (10 focus areas)

### 3.1 Homepage 0+ statistics — G-01 (P0)
- **Page:** `/` · **Component:** `StatsCounter.tsx` (used via HomePageClient) · **File:** `frontend/src/components/StatsCounter.tsx`
- **API:** `GET /api/admin/site-config` → `statsCards` · **DB:** `site-config` doc/row `statsCards[]`
- **Root cause (was):** `FALLBACK_STATS` hardcoded (5000+, 150+ Tour Packages, 50+ Destinations…) rendered whenever config was missing; when config existed but numbers were absent, `0+` rendered.
- **Fix applied (2026-08-15, live-verified):** fallback deleted; stats render only from `statsCards`; section hidden when empty. Live HTML contains no "150+"/"0+" markers.
- **Current values:** config `statsCards` = `["IATA Accredited", "5,000+ Happy Travelers", "24/7 Support"]` — admin-controlled, but the numbers are **marketing claims, not DB-computed**.
- **Residual:** `parseStat` would still render a `0+` card if an admin saves a card whose title parses to 0/null. Proposed: drop cards whose parsed `num` is `null` or `0` (hide, never show "0+").
- **Regression risk:** low (display-only). **Test:** config-empty → section absent; card "0+ X" → hidden; "5,000+ Happy Travelers" → renders.

### 3.2 Ks 0/person — G-02 (P0)
- **Page:** `/tours`, `/tours/[slug]`, `/hotels` · **Components:** `TourCard.tsx`, `HotelCard.tsx`, `tours/[slug]/page.tsx`
- **API:** `GET /api/tours`, `/api/tours/[slug]`, `/api/hotels` · **DB:** `tours` (`priceMMK`, `priceUSD`, `quote_required`, `status`), `hotels` (`pricePerNightMMK`, …)
- **Root cause:** records exist with `priceMMK=0`/`priceUSD=0` (Kalaw, Bagan–Popa); the old renderer always formatted the price → "Ks 0/person".
- **Fix applied (live-verified):** API exposes `quoteRequired` (stored flag OR auto-derived when both prices are 0/absent); cards/detail render i18n "Request a Quote" / "Price on Request"; review count hidden when 0. Current live: Kalaw + Bagan–Popa `quoteRequired: true`; Singapore 1,250,000 MMK.
- **Validation added:** API maps `Number(x) > 0 ? x : 0` (never NaN); admin has a "Quote Required" checkbox.
- **HUMAN VERIFICATION REQUIRED:** are Kalaw/Bagan–Popa genuinely quote-based products (price unset on purpose) or should they have real prices? The DB value is 0; only the business can confirm intent. Recommended validation add: admin blocks publishing a tour with `priceMMK<=0` AND `quote_required=false` (DB CHECK + API + admin form).
- **Regression risk:** low. **Tests:** price 0 + quote flag → "Request a Quote"; price 0 + no flag → validation error; negative price → flagged.

### 3.3 Countdown 00:00:00:00 — G-03 (P0)
- **Page:** `/` · **Component:** `DealsBanner.tsx` · **File:** `frontend/src/components/DealsBanner.tsx`
- **API:** `GET /api/admin/site-config` → `dealsBanner` · **DB:** `site-config.dealsBanner{enabled,badge,title,buttonLabel,buttonHref,countdownDays,endAt?,startAt?}`
- **Root cause:** countdown computed client-side as `Date.now() + countdownDays` — resets on every load, no absolute expiry, hydration flashed "00 00 00 00".
- **Fix applied (live-verified):** server-authoritative `endAt`/`startAt` (ISO, UTC); explicit states **ACTIVE** (real countdown), **UPCOMING** ("Coming Soon"), **EXPIRED** ("Offer Expired"), **DISABLED** (render nothing); no fake default banner.
- **Residual (needs admin action):** live config still has `enabled:true, countdownDays:17` and **no `endAt`/`startAt`** → the banner currently derives a rolling 17-day window from load time (never expires). Recommended: if `enabled && !endAt` → treat as **DISABLED** (don't render) so a promo without a real end date cannot display; the Site Manager "Offer Ends" field exists to set it.
- **Regression risk:** low. **Tests:** active (endAt future) → ticking countdown; expired → "Offer Expired"; upcoming (startAt future) → "Coming Soon"; missing dates → hidden; invalid dates → hidden; hydration → no 00 flash; timezone → UTC comparison.

### 3.4 Company information consistency — G-04 (P0)
- **Pages:** `/`, `/about`, `/contact`, footer, admin about, chat widget · **Files:** `CompanyTimeline.tsx`, `WhyChooseUs.tsx`, `app/layout.tsx`, `lib/i18n.tsx`, `app/about/aboutclient.tsx`, `app/about/layout.tsx`, `app/admin/about/page.tsx`, `app/admin/site-manager/page.tsx`, `api/admin/site-config/route.ts`, `api/chat/route.ts`
- **Current conflicting facts:** "since 2015" appears in ≥10 files; MM copy claims "10+ years"; `CompanyTimeline.tsx` hardcodes 2015 Founded / 2017 IATA / 2019 "30+ tour packages" / 2020 / 2022 Sky Lounge; `about.founded` = **undefined** in live config.
- **Root cause:** no single authoritative company-settings source; facts duplicated as literals.
- **Proposed fix (Phase 6, NOT applied):** add `company_settings` block to site-config (admin-editable): `founded_year`, `experience_years`, `iata_status`, `iata_year`, `office_hours`, `emergency_support`, `company_registration`, `license_information`. Render timeline/why-choose/footer/contact from it; delete the hardcoded literals.
- **HUMAN VERIFICATION REQUIRED (do not invent):** founding year, IATA number/status/year, registration/license numbers, Sky Lounge claim, "30+ packages" claim, experience-years formula.
- **Regression risk:** medium (touches many pages — needs per-page regression). **Tests:** config-driven values render on all pages; missing values → section hidden or "HUMAN VERIFICATION" placeholder (never conflicting numbers).

### 3.5 24/7 support inconsistency — G-05 (P1)
- **Files (11):** `aboutclient.tsx`, `api/admin/seed`, `api/admin/site-config`, `blog/[slug]/page.tsx`, `insurance/[slug]/page.tsx`, `FAQAccordion.tsx`, `StatsCounter.tsx` (config card), `TrustBadges.tsx`, `WhyChooseUs.tsx`, `adminStore.ts`, `i18n.tsx`; plus contact page ("Office"/"Hours" text present).
- **Root cause:** "24/7 Support" is a marketing claim duplicated in config + components; there is **no** `businessHours` field and **no** `emergency_support` capability flag.
- **Proposed fix (Phase 8, NOT applied):** introduce `company_settings.businessHours` + `emergency_support` (boolean + phone); render office hours from config on `/contact`; show "24/7 Emergency Support" **only if** `emergency_support` is true — otherwise remove the claim everywhere.
- **HUMAN VERIFICATION REQUIRED:** does a real 24/7 channel exist (phone/WhatsApp/Telegram)? What are the real office hours (weekday/Sat/Sun)?
- **Regression risk:** low-medium (copy-only changes). **Tests:** config without emergency flag → no 24/7 string in any rendered page; with flag → appears once with phone.

### 3.6 Testimonials — G-06 (P1)
- **Component:** `TestimonialSlider.tsx` (fallback `FALLBACK_REVIEWS` removed 2026-08-15; hides when empty — live-verified no placeholder fallback).
- **API/DB:** `site-config.testimonials[]` (admin-editable) — current: John Smith/Australia, Sarah Chen/Singapore, Marcus Weber/Germany, Yuki Tanaka/Japan (all 5★).
- **Root cause:** these 4 entries look like demo/placeholder data; schema lacks `verified`, `source`, `date`, `status` fields.
- **Proposed fix (Phase 9, NOT applied):** extend schema with `verified/source/date/status`; keep only entries confirmed real; remove or replace demo entries.
- **HUMAN VERIFICATION REQUIRED:** are these real customers? Do you have booking/email records (source) for each?
- **Regression risk:** low. **Tests:** entry with `status:demo` → not rendered; empty list → section hidden.

### 3.7 Tour/destination counts — G-07 (P1)
- **Good:** `/tours` tab badges (`countInbound`/`countOutbound`) computed from live `apiTours` (real data) — no hardcoding.
- **Residual:** `CompanyTimeline.tsx` claims "30+ tour packages" (2019) vs **3 live tours** → contradictory; homepage "Popular Destinations" shows live destinations (currently 0 — deleted per earlier fix; section should hide when empty).
- **Proposed fix:** all counts from `published` (status!==inactive) records; timeline "30+" → config-driven or removed.
- **HUMAN VERIFICATION:** was "30+ packages" ever true? Is 3 tours the real current inventory?
- **Tests:** count badge == API list length for statuses; inactive/draft never counted.

### 3.8 Hotel data — G-08 (P1)
- **Live (verified):** 6 hotels, real prices (85,000–280,000 MMK), ratings 3–5, `priceOnRequest:false`, room counts 12–60.
- **Root cause:** `availableRooms` is a stored number with no inventory system behind it → displayed as "N rooms" / "Only N left" / "Sold Out" (see `HotelCard.tsx` lines 33–34, 89–93) — i.e., **marketing data presented as live inventory**.
- **Proposed fix:** label as "standard rooms" (capacity-style) OR add `inventory_source: live|static` and show "From Ks …" without scarcity claims when static.
- **HUMAN VERIFICATION:** is room availability real-time, or a static config number?
- **Regression risk:** low. **Tests:** static source → no "Only N left" scarcity text.

### 3.9 Booking flow — G-09 (P1, NOT AUDITED)
- **Files:** `app/book-now/page.tsx`, `app/booking/*`, `api/booking-receiver/route.ts`, `admin/bookings/*`, `api/admin/bookings/*`
- **Known:** no payment processor (inquiry → email via Resend; `BOOKING_AFFILIATE_ID` present); booking form → `booking-receiver` → email + DB row.
- **To audit (needs browser E2E + email test):** duplicate submission/double-click, stale price, invalid dates/passenger counts, session expiry, API failure/timeout states, admin visibility of created bookings, confirmation email.
- **Proposed:** idempotency key (client-generated UUID) on `booking-receiver`; server-side validation; unique constraint on `(email, tourId, travelDate)`; honeypot + rate limit.
- **Tests:** double-submit → 1 booking; invalid date → 400; missing field → 400; API 500 → error state + retry.

### 3.10 Contact form — G-10 (P1, NOT AUDITED)
- **Files:** `contact/contactclient.tsx` (client validation exists), `api/contact/route.ts`
- **To verify/add:** server-side validation, phone/email format, spam protection (honeypot/rate limit), CSRF where applicable, XSS sanitization, duplicate-submit prevention, success/error states.
- **Tests:** valid → 200 + stored/emailed; invalid email → 400; rapid repeat → rate-limited.

### 3.11 Admin ↔ API ↔ DB ↔ Frontend sync — G-11 (P1, PARTIAL)
- **Fixed:** `persistentStore.ts` `SEEDS` fallback removed (2026-08-15) — DB failure now returns `[]`/throws; no resurrected/deleted data.
- **Open:** `lib/adminStore.ts` contains its own fallback copies (incl. a "24/7" string); no admin audit log; no DB constraints/CHECKs (e.g., price≥0, quote_required consistency, unique slug); Kalaw duplicate rows exist in DB (2× `gen_` ids — code handles deterministically since 2026-08-16; DB cleanup pending).
- **Proposed:** add CHECK constraints + unique index on `slug` where feasible; remove adminStore fallbacks; audit-log admin writes.

---

## 4. Regression & Testing Baseline

- Build: `cd frontend && npm run build` → EXITCODE=0 (verified locally after each change set).
- Live verification stack: buildId/HEAD match + deployed chunk/HTML marker scan (used for G-01..G-03, HSTS, sitemap).
- **No automated tests exist** (G-13). Phase 22 must add: stats, zero-price, countdown, company settings, support hours, testimonials, counts, hotel data, contact, booking, admin CRUD.
- CI type-check currently `continue-on-error: true`; `next.config.js` has `ignoreBuildErrors` + `ignoreDuringBuilds` — must be removed only after tsc+lint are clean (Phase 21).

## 5. Human Verification Required (do NOT invent)

| Fact | Where used | Needed from business |
| --- | --- | --- |
| Founding year | "since 2015" ×10, timeline | Real year |
| IATA status/number/year | statsCards, timeline 2017, footer | Real accreditation |
| Company registration / license | about, admin about | Registration numbers |
| Experience years | "10+ years" (MM), "since 2015" (EN) | Consistent formula |
| 24/7 support | statsCards, WhyChooseUs, FAQ, contact | Does a real 24/7 channel exist? |
| Office hours | contact page | Weekday/Sat/Sun hours |
| Testimonials (4) | homepage slider | Real customers? source records? |
| "30+ tour packages", "Sky Lounge 2022" | timeline | Real milestones? |
| Tour prices = 0 (Kalaw, Bagan–Popa) | tours API | Quote-required by design? |
| Hotel room counts | hotel cards | Live inventory or static? |
| "5,000+ Happy Travelers" | statsCards | Real cumulative travelers? |

## 6. Next Steps (after this report is reviewed)

1. Phase 3/4 — finish P0 residuals: (a) StatsCounter hide 0/null cards; (b) DealsBanner require `endAt` (else DISABLED) + set live Offer Ends; (c) publish-validation for price/quote consistency.
2. Phase 5 — P1: company_settings source (G-04), 24/7 truthfulness (G-05), testimonials schema (G-06), counts (G-07), hotel inventory wording (G-08).
3. Phase 13 — booking flow + contact form audits with browser E2E.
4. Phase 20–23 — tests, tsc/lint gate, CI enablement.
5. Phase 25 — final report with PASS/FAIL/NOT VERIFIED/HUMAN VERIFICATION REQUIRED.

*Nothing in section 3 marked "NOT FIXED"/"HUMAN VERIFICATION REQUIRED" was guessed — every claim above traces to the file/API/DB cited.*
