# A9_BUG_REPORT.md — Phase 2 (Reproduce) findings

**Date:** 2026-08-15 · **Branch:** fix/grade-a-production-hardening · **Baseline:** `3c3de84`
Every finding below was **traced to source** (live API + code path), not assumed.

---

## P0 — Data integrity (fix in progress this cycle)

### BUG-001 · Hardcoded fake homepage statistics
- **Evidence:** `components/StatsCounter.tsx` — `FALLBACK_STATS = [5000+ Happy Travelers, 150+ Tour Packages, 30+ Hotel Partners, 15+ Years Experience, 50+ Destinations]` renders **before** `/api/admin/site-config` resolves; if fetch fails it stays forever.
- **Live truth:** `/api/tours` = **3 tours**; `/api/destinations` = **0**; hotels = 6.
- **Root cause:** static fallback array in client component; no computation from real data.
- **Fix:** remove fake fallback; render only admin-authored `statsCards`; hide section when empty.

### BUG-002 · "Ks 0/person" on real tours
- **Evidence:** `/api/tours` → `Kalaw` (MMK 0, USD 0) and `Bagan – Popa` (MMK 0, USD 0); `TourCard.tsx` renders `{currencySymbol} {price?.toLocaleString() ?? '0'} /person`; detail `tours/[slug]` renders `{price.toLocaleString()}` (→ "Ks 0").
- **Root cause:** `transformTour` does `Number(t.priceMMK) || 0`; records genuinely have no price; UI has no quote state; no `quote_required` field in API mapping or admin form.
- **Fix:** expose `quoteRequired`; render "Request a Quote" when no valid price (unless product is genuinely free — none are); admin toggle for quote-required tours.

### BUG-003 · Fabricated ratings / review counts per request
- **Evidence:** `app/api/tours/route.ts` + `app/api/tours/[slug]/route.ts`: `rating: Number(t.rating) || 4.5`, `reviewCount: Number(t.reviewCount) || Math.floor(Math.random() * 50) + 10`. Hotels: `rating || 4.0`, `reviewCount: Math.random()*30+5`, `availableRooms: Number(h.availableRooms) || 5`.
- **Impact:** every page load invents star ratings, review totals and room availability.
- **Fix:** `|| 0` everywhere; UI hides rating/review count when 0; hotels show availability only when real.

### BUG-004 · Store seeds fabricated records on DB failure
- **Evidence:** `lib/persistentStore.ts` — `getAll` → `activeOnly(SEEDS[collection] || [])`, `getById` → SEEDS lookup, `create` → pushes to SEEDS, `delete_` → splices SEEDS (≈70-line hardcoded seed catalog: Golden Land Explorer, Yangon City Lights, …).
- **Impact:** on Supabase+Redis outage, deleted/fake data resurfaces; admin "create" reports success via memory.
- **Fix:** remove SEEDS entirely; DB failure → `[]`/`null`/throw (fail loud, never fabricate).

### BUG-005 · Placeholder-looking testimonials (live + fallback)
- **Evidence:** live site-config `testimonials` = John Smith (AU), Sarah Chen (SG), Marcus Weber (DE), Yuki Tanaka (JP) — classic placeholder names; `TestimonialSlider.tsx` also has 6 hardcoded `FALLBACK_REVIEWS` (incl. Emily Brown, David Lee) shown before fetch / on failure.
- **Fix:** remove hardcoded fallback; hide section when no testimonials. **HUMAN VERIFICATION REQUIRED:** confirm whether the 4 live testimonials are real customers or demo data.

### BUG-006 · Countdown is client-relative, never expires
- **Evidence:** `DealsBanner.tsx`: `const target = Date.now() + days*86400000` — resets on every page load; site-config `dealsBanner = { enabled:true, countdownDays:17 }` (no end date). No ACTIVE/UPCOMING/EXPIRED/DISABLED states; hydration shows 00s before interval ticks.
- **Fix:** server-authoritative `endAt`/`startAt` (ISO + tz) in site-config; expired → "Offer Expired" state; hide when no end date; no NaN/negative.

## P1 — Consistency / claims (needs business verification)

### BUG-007 · "since 2015" duplicated, inconsistent context
- **Locations (≥6):** `components/WhyChooseUs.tsx` (tagline + MM "၂၀၁၅"), `app/about/layout.tsx` metadata, `app/layout.tsx`, `lib/i18n.tsx` (EN+MM), `app/api/chat/route.ts`, site-config statsCards "IATA Accredited … since 2015"; footerCompanyInfo has **no year** ("Since our founding"); about page `journey` contains its own timeline; WhyChooseUs MM claims "10+ years experience" while another spot says "decade+".
- **Fix (Phase 6):** single `company` block in site-config (`foundedYear`, `iata`, reg numbers, business hours, support24_7) consumed by all pages. **HUMAN VERIFICATION REQUIRED:** verify founded year, IATA code (05301026 in two places — consistent), reg numbers (126395248 / T/I(YGN)-2889 / T/O(YGN)-0946).

### BUG-008 · "24/7 Support" claim vs business hours
- **Evidence:** statsCards claim "24/7 Support"; `contactclient.tsx` references `businessHours` but **no such field exists** in site-config; FAQ mentions 24/7; no authoritative hours source.
- **HUMAN VERIFICATION REQUIRED:** are emergency lines 24/7 while office has business hours? Provide verified hours + whether 24/7 claim is accurate.

### BUG-009 · Tour/hotel inventory inconsistent with claims
- **Evidence:** 3 tours / 6 hotels live. Homepage stats previously claimed "150+ Tour Packages / 50+ Destinations / 30+ Hotel Partners" (now removed with BUG-001 fix). `availableRooms || 5` fakes availability. Hotel prices all `0`/undefined → HotelCard renders "Ks 0/night" (same class as BUG-002).
- **Fix:** quote/price-on-request states for hotels; real availability only.

### BUG-010 · Fake fallback tour catalog on detail-page API failure
- **Evidence:** `app/tours/[slug]/page.tsx` `FALLBACK_TOURS` (Classic Vietnam, Myanmar Highlights, Ngapali… with Unsplash images) served when `getTour` throws.
- **Fix:** remove; show not-found/error state instead.

## P2 — Operational gaps (recorded, phased)

- No tests, no lint enforcement, no health endpoints, no structured logs/request IDs, no HSTS header, CSP `unsafe-inline`+`unsafe-eval` for scripts, `next.config.js` suppresses TS/lint at build, Amadeus flight-search UX states unverified, booking has no online payment.

## Verification limits
- Admin E2E per role requires production credentials (none available) → user must verify in browser.
- Payment/legal/business facts (IATA, founded year, reg numbers, hours, testimonial authenticity) are **HUMAN VERIFICATION REQUIRED** — never invented.
