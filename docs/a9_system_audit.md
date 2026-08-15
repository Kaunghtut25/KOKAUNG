# A9_SYSTEM_AUDIT.md

**Project:** A9 Global Travels & Tours — https://www.a9travel.com/
**Repo:** `Kaunghtut25/KOKAUNG` (branch `main` → hardening branch `fix/grade-a-production-hardening`)
**Audit date:** 2026-08-15 (restore tag `restore-point-2026-08-15-3c3de84` @ `3c3de84`)
**Auditor:** Principal Engineering pass (agent), 25-phase Grade-A hardening program — Phase 1 output

---

## 1. Technology Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js (App Router) | 14.2.15 | `frontend/`; serverless on Vercel |
| UI | React | 18.3.1 | Client components + RSC |
| Styling | Tailwind CSS | 3.4.4 | + inline styles in several legacy components |
| Language | TypeScript | 5.4.5 | `strict: true` BUT build ignores TS errors (see §21) |
| DB (primary) | Supabase (PostgreSQL) | `@supabase/supabase-js 2.110.6` | Tables named after collections |
| Cache/fallback store | Upstash Redis | `@upstash/redis 1.38.0` | Hash per collection: `a9:<collection>` |
| File storage | Vercel Blob | `@vercel/blob 2.6.1` | Uploads (`/api/upload`) → `*.public.blob.vercel-storage.com` |
| Email | Resend | `resend 6.17.2` | Contact/booking notifications |
| Flight search | Amadeus (Self-Service) | axios via `lib/amadeus.ts` + `/api/amadeus` | Credentials in env |
| Icons | lucide-react, react-icons | 1.23 / 5.2.1 | |
| Image | `next/image` + local `/images_v2/` | — | AVIF/WebP formats configured |
| Legacy backend | Express (optional) | 4.19.2 | `backend/` — NOT used in production (Vercel serverless serves frontend APIs) |
| Deployment | Vercel | `vercel.json` at repo root | Build: `cd frontend && npx next build` |

## 2. Folder Structure (production-relevant)

```
a9-website/
├── vercel.json                  # build/install/output config
├── .github/workflows/ci.yml     # CI (type-check non-blocking, build)
├── backend/                     # legacy Express API (unused in prod; kept for VM deployment docs)
├── docs/                        # this audit family
└── frontend/
    ├── next.config.js           # security headers, image config, **ignores TS/lint errors**
    ├── public/                  # images_v2/, robots.txt, sitemap.xml, og-image.jpg, favicons
    └── src/
        ├── app/                 # routes: /, /about, /tours, /hotels, /cars, /visas, /insurance,
        │   │                    #   /cruises, /mingalar, /blog, /contact, /book-now, /booking,
        │   │                    #   /flights, /buses, /destinations, /faq, /search, /privacy, /terms,
        │   │                    #   /accessibility, /auth/*, /admin/*, /api/*
        │   ├── admin/           # 20 admin pages (dashboard..users)
        │   ├── api/             # 47 route handlers (admin/*, auth/*, public data, chat, upload…)
        │   ├── globals.css
        │   └── robots.ts / sitemap.ts   # generated robots/sitemap (Next)
        ├── components/          # ~50 shared components
        ├── data/                # airports.ts, busCities.ts, fallback.ts
        ├── hooks/ lib/ providers/
        ├── middleware.ts        # auth + RBAC write-gating (rank-based)
        └── supabase-schema.sql  # schema reference
```

## 3. Application Architecture

**Production data path:** Serverless Next.js API routes → `lib/persistentStore.ts` → Supabase (primary) with Upstash Redis as resilient mirror. No long-running backend process in production.

- Server components fetch from public API routes (`/api/tours`, `/api/hotels`, …) and from `/api/admin/site-config` (single config record).
- Client components fetch the same endpoints client-side (hydration-friendly).
- Admin panel: React client pages + `/api/admin/*` routes, JWT (HMAC-SHA256, `AUTH_SECRET`/`ADMIN_PASSWORD`), cookie `a9_admin_token` + Bearer header.

## 4. Database Schema (Supabase)

Collections (tables): `tours`, `hotels`, `cars`, `cruises`, `visas`, `insurances`, `blog`, `bookings`, `mingalar`, `site-config` (singleton), `settings`, `knowledge`, `destinations`, `users`.

Per-collection rows use `id` (uuid/text), `createdAt`, `updatedAt`, `status` (`active`/`inactive`/`featured`). Full reference in `frontend/supabase-schema.sql`.

**Live row counts (2026-08-15):** tours 3 · hotels 6 · destinations 0 · site-config 1 · testimonials 4.

## 5. API Architecture

- Public read: `GET /api/{tours|hotels|cars|visas|insurance|insurances|cruises|mingalar|blog|destinations}` (+ `/tours/[slug]`, `/booking-receiver`, `/search`, `/amadeus`, `/chat`, `/contact`, `/img`).
- Admin CRUD: `/api/admin/{tours|hotels|cars|cruises|visas|insurances|blog|mingalar|destinations|bookings|users|settings|site-config|knowledge|stats|seed}/...` — write-gated by `middleware.ts` RBAC (viewer<editor<staff<admin).
- Auth: `/api/auth/{login|register|verify-otp|forgot-password|reset-password}`.
- Legacy Express backend mirrors a subset (JWT + bcrypt + multer) — superseded in production.

## 6. Authentication / RBAC

- Token: HMAC-SHA256 signed JWT-style payload (role + email + exp) — `frontend/src/lib/auth.ts`.
- Roles: `admin` (3) > `staff` (2) > `editor` (1) > `viewer` (0); `ROLE_RANK` + `roleRank()` helpers.
- Enforcement: `middleware.ts` — cookie path gate for `/admin/*`, rank-based 403 for `/api/admin/*` writes (viewer read-only; users/settings admin-only; bookings/site-config staff+; content editor+).
- Admin panel entry allows all 4 roles; sidebar nav filtered by role.

## 7. Booking Architecture

- `/book-now` (generic) + `/booking` (tour-specific flow) + `/api/booking-receiver` (creates `bookings` record).
- Payment: **no online gateway wired** — KBZPay/WaveMoney merchant keys exist only in legacy `.env.example`; current flow = booking request + manual confirmation (admin `bookings` page).
- Email: Resend for contact/booking notifications (`lib/email.ts`), `FROM_EMAIL` env.

## 8. External APIs / Integrations

| Integration | Purpose | Status |
|---|---|---|
| Amadeus Self-Service | Flight search | env keys present; `/api/amadeus` route |
| Resend | Email | env key present |
| Supabase | Primary DB | env vars required; **not present in `frontend/.env.local`** (see Risks) |
| Upstash Redis | Resilience mirror | env keys required |
| Vercel Blob | Uploads | via `/api/upload` |
| Google Tag Manager | Analytics | `components/GoogleAnalytics.tsx` + CSP allow |
| Cloudinary (next-cloudinary) | unused dep | installed, no evidence of use |
| Telegram (legacy backend) | notifications | backend-only, unused in prod |

## 9. Payment / Email / Storage Flow

- Payment: none automated (request-based). Flagged for business decision.
- Email: `lib/email.ts` → Resend API.
- Storage: `/api/upload` → Vercel Blob; images referenced by URL; legacy `/images_v2/` local assets.

## 10. Deployment Architecture

- Git push `main` → GitHub Actions CI (non-blocking type-check + build) → Vercel deploy (vercel.json) → `www.a9travel.com`.
- Vercel env vars managed in Vercel project settings (list of KEY NAMES only — values never stored in repo).

## 11. Environment Variables (KEY NAMES ONLY — values redacted by policy)

`frontend/.env.local` (dev) / Vercel (prod): `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AMADEUS_API_KEY`, `AMADEUS_API_SECRET`, `AMADEUS_BASE_URL`, `AUTH_SECRET`, `BOOKING_AFFILIATE_ID`, `FROM_EMAIL`, `RESEND_API_KEY`, `VERCEL_OIDC_TOKEN`. Root: `VERCEL_OIDC_TOKEN`.
**⚠ `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are referenced by code but NOT present in dev `.env.local`** — production must carry them or the store falls back (see Risks).

## 12. Cron / Background Jobs

- None in production (serverless). No scheduled jobs configured. `keep-alive.bat` / `deploy-free-24-7.md` are legacy VM leftovers.

## 13. Caching

- `next/image` (`minimumCacheTTL: 60`) for images; no app-level data cache (APIs are `force-dynamic`).
- Redis hash mirror acts as cache+fallback for store writes/reads.

## 14. Logging / Error Handling / Testing / CI

- Logging: `console.warn` scattered in store; no structured logging, no request IDs, no error-tracking service (Phase 22 gap).
- Error handling: per-component try/catch + error state in several clients; raw objects can reach UI in some paths (Phase 18 gap).
- Testing: **none** — no unit/integration/E2E suites exist (Phase 20 gap).
- CI: `.github/workflows/ci.yml` — `npm ci` → `npx tsc --noEmit` (**continue-on-error**) → `next build` with dummy envs.

## 15. Known Critical Gaps (summary — detail in A9_BUG_REPORT.md)

1. `next.config.js` ignores TS + lint errors at build (`typescript.ignoreBuildErrors`, `eslint.ignoreDuringBuilds`) — builds can ship broken code.
2. Store falls back to hardcoded `SEEDS` on DB failure — deleted data can resurrect; fabricated records served as "real".
3. API transforms fabricate `rating` (default 4.5/4.0) and `reviewCount` (random) per request.
4. Homepage stats show hardcoded fake numbers (150+ Tour Packages, 50+ Destinations — live reality 3/0).
5. Tours without price render "Ks 0" instead of quote state.
6. Testimonials: hardcoded placeholder fallback + live config contains placeholder-looking names.
7. Promo countdown is client-relative (`Date.now() + days`), resets each load; no expiry/state machine.
8. Company facts ("since 2015", IATA, reg numbers, hours) duplicated across ≥6 files with no single source of truth.
9. `frontend/src/data/fallback.ts` and `tours/[slug]` FALLBACK_TOURS ship fabricated tour content on API failure.
10. No tests, no structured logging, no health endpoints, no HSTS header.
