# Phase 15 — Performance (2026-08-17)

## Inventory (data-driven)
- 78 `<Image>` tags, only 3 with `priority`; raw `<img>` only in admin preview, PartnerLogos (lazy ✓), a9image (deliberate status component).
- Fonts: already `next/font` Inter (self-hosted, no render-blocking links) ✓.
- No heavy vendor libs anywhere (no framer-motion/recharts/swiper/etc.).
- i18n.tsx was a single 190 kB module (EN + MM dictionaries) statically imported by every page — the dominant shared cost.
- Route table: home first-load 299 kB (heaviest); detail pages 243–261 kB.

## Batch 1 — LCP + caching (`f1b464d` part 1)
- **`priority` added to 6 hero images** (tours ×2 incl. fallback, hotels, cruises, cars, buses) — all above-fold, `sizes="100vw"`. Live-verified: `/tours` hero now has `fetchpriority="high"`.
- **`minimumCacheTTL: 60 → 31536000`** (1 year) in next.config.js — remote images cache aggressively.

## Batch 2 — JS split (`f1b464d` part 2)
- **HomePageClient**: below-fold sections (TestimonialSlider, SocialFeed, PartnerLogos, Newsletter) → `next/dynamic`. (Impact was small — 299→296 kB — sections weren't the bulk.)
- **i18n EN/MM split (the real win)**: extracted `src/lib/i18n/en.ts` (62.8 kB, static) and `src/lib/i18n/mm.ts` (126 kB, lazy via dynamic import). Provider rewritten:
  - `mm` loads on demand (`import("./i18n/mm")`, cached in module scope).
  - Saved `a9_lang=mm` → provider loads chunk then commits state (no EN flash for returning MM users).
  - Fresh EN session → background warm via `requestIdleCallback`.
  - `t()` falls back to EN keys until mm chunk resolves.
  - Key parity verified: 1320 = 1320 keys, zero drift.
- **Result: every public route −21~22 kB First Load JS** (home 296→274, tours 161→140, hotels 159→138, blog 154→133, visas 193→171, insurance 193→172, book-now 139→117). MM chunk = separate 120.6 kB lazy file (chunk `898.*`).

## Verification
- `tsc --noEmit`: 0 errors (strict — `ignoreBuildErrors` removed earlier same session).
- `npm run build`: BUILD_EXIT=0; `npm test`: 0.
- Live (buildId `FwhiqA_6R0MHFBZ4vQE7k`): /, /tours, /api/admin/site-config all 200.
- Puppeteer live: 
  - EN→dropdown→"Myanmar (Burmese)" click → Burmese renders (lazy chunk loads, no console errors).
  - Saved `a9_lang=mm` reload → Burmese immediately.
  - `/tours` hero has `fetchpriority="high"`; zero page/console errors.

## Next (Phase 15 candidates, deferred)
- Detail pages 243–261 kB First Load (tours/[slug], hotels/[slug] etc.) — dynamic-split the below-fold blocks (itinerary/amenities/forms) if wanted.
- Cache-Control for API routes; preconnect to `images.unsplash.com` / vercel blob host.
- Real-user LCP baseline via puppeteer trace + Web Vitals on both locales.
