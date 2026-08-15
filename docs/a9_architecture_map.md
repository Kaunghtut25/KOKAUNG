# A9_ARCHITECTURE_MAP.md

**Project:** A9 Global Travels & Tours — production architecture map (2026-08-15)

---

## 1. High-Level Data Flow

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│         BROWSER             │        │          ADMIN PANEL         │
│  www.a9travel.com (public)  │        │  /admin/* (4 roles:          │
│  + /admin/* (authenticated) │        │  viewer/editor/staff/admin)  │
└──────────────┬──────────────┘        └──────────────┬───────────────┘
               │ HTTPS (CSP, HSTS*)                    │ JWT (HMAC-SHA256)
               ▼                                       ▼
┌────────────────────────────────────────────────────────────────────┐
│                  NEXT.JS 14 (Vercel serverless)                    │
│  ├─ App Router pages (RSC) ─ /, /about, /tours, /hotels, ...      │
│  ├─ Client components (hydration, fetch /api/*)                    │
│  ├─ API Routes ─ /api/* (public) + /api/admin/* (RBAC-gated)      │
│  ├─ middleware.ts ─ cookie auth + rank-based write gating          │
│  └─ lib/persistentStore.ts ─ single data gateway                   │
└──────────────┬─────────────────────────────────────────────────────┘
               │
      ┌────────┴───────────────┐
      ▼                        ▼
┌─────────────┐        ┌────────────────┐
│  SUPABASE   │◄──────►│  UPSTASH REDIS │   (mirror/cache: a9:<collection> hash)
│ PostgreSQL  │  write │                │
└─────────────┘  +read └────────────────┘
      │
      └── (on failure: NO seed fallback after hardening — empty/error, never fabricated data)

External integrations:
  ├─ Vercel Blob  ── file uploads (/api/upload → *.public.blob.vercel-storage.com)
  ├─ Resend       ── email (contact + booking notifications)
  ├─ Amadeus      ── flight search (/api/amadeus)
  ├─ Google Tag Manager ── analytics
  └─ Supabase     ── auth-independent (custom JWT in app)
```

## 2. Frontend (Public Pages)

```
/  (home: hero, stats, featured tours, popular destinations, testimonials, partners…)
├── /about        ── company story, timeline, certifications, values
├── /tours        ── listing + filters (tab inbound/outbound, destination, price, duration, sort)
│   └── /tours/[slug]  ── detail (overview/itinerary/included/reviews tabs, booking modal)
├── /hotels       ── listing
│   └── /hotels/[slug]
├── /cars  /visas  /insurance  /cruises  /mingalar  (+ [slug] details)
├── /flights  /buses  /destinations/[city]  /search
├── /book-now  /booking  ── booking request flows → /api/booking-receiver
├── /blog  /faq  /contact  /privacy  /terms  /accessibility
└── /auth/{login|register|forgot-password|reset-password}
```

## 3. Admin Panel (`/admin/*`)

```
/admin (index) ─ redirect → /admin/dashboard
├── dashboard        ── stats (tours/hotels/bookings counts…)
├── tours | hotels | cars | cruises | visas | insurance | blog | destinations ── CRUD grids
├── bookings         ── booking records (staff+)
├── users            ── admin user management (admin only)
├── settings         ── global settings (admin only)
├── site-manager     ── site-config editor (stats cards, testimonials, deals banner, partners, about…)
├── knowledge        ── KB for chat
├── cleanup          ── data cleanup tool
├── sky-lounge | about  ── content pages
└── layout + AdminSidebar ── role-filtered nav (viewer sees content pages only)
```

**RBAC matrix (enforced in middleware + API):**

| Resource | viewer | editor | staff | admin |
|---|---|---|---|---|
| Read all public/admin data | ✅ | ✅ | ✅ | ✅ |
| Content writes (tours/hotels/blog/destinations…) | ❌ 403 | ✅ | ✅ | ✅ |
| Bookings writes | ❌ | ❌ | ✅ | ✅ |
| site-config writes | ❌ | ❌ | ✅ | ✅ |
| Users + settings writes | ❌ | ❌ | ❌ | ✅ |

## 4. Services → Database

```
lib/persistentStore.ts (getAll/getById/create/update/delete_)
  1. try Supabase (primary)
  2. else Upstash Redis mirror
  3. else → []/null/throw (hardened; previously seeded fabricated data)
```
Collections: `tours hotels cars cruises visas insurances blog bookings mingalar site-config settings knowledge destinations users`

## 5. Auth Flow

```
POST /api/auth/login  → verify ADMIN_EMAIL/PASSWORD or users table → sign HMAC token {role,email,exp}
  → Set-Cookie a9_admin_token (HttpOnly? — see security audit) + client localStorage admin_token
middleware.ts: /admin/* pages need valid cookie; /api/admin/* writes need rank ≥ threshold
```

## 6. Booking Flow

```
/tours/[slug] Book Now (or /book-now, /booking)
  → form (date, travelers, payment method KBZPay/WaveMoney/card, special requests)
  → POST /api/booking-receiver → persistentStore.create("bookings")
  → admin /admin/bookings sees record; confirmation via manual contact (no online payment)
```

## 7. Deployment Chain

```
git push main → GitHub Actions CI (npm ci → tsc (non-blocking) → next build)
             → Vercel (vercel.json: cd frontend && next build)
             → www.a9travel.com
```

## 8. Key Dependencies (important edges)

- `lib/persistentStore.ts` — used by ALL API routes (public + admin). Single choke point for data integrity.
- `middleware.ts` — authN + authZ for the whole admin surface.
- `lib/auth.ts` — token sign/verify + role ranking (shared by middleware, layout, sidebar, APIs).
- `lib/i18n.tsx` — all user-visible strings (EN + MM dictionaries) incl. new quote/expiry keys.
- `lib/site-config` singleton record — drives homepage sections, stats cards, testimonials, deals banner, partners, about, footer.
- `next.config.js` — security headers + image config; **currently also suppresses TS/lint at build (risk).**

## 9. Risk Hotspots (for hardening phases)

| # | Hotspot | Risk | Phase |
|---|---|---|---|
| 1 | persistentStore SEEDS fallback | fabricated data on outage | 3/19 |
| 2 | API transform defaults (rating 4.5, random reviewCount) | fake ratings | 3 |
| 3 | StatsCounter/TestimonialSlider fallbacks | fake stats/testimonials | 4/6 |
| 4 | DealsBanner client-relative countdown | no authoritative expiry | 5 |
| 5 | "since 2015" duplicated in 6+ files | inconsistent company facts | 6 |
| 6 | next.config ignores TS/lint | broken code ships | 21/23 |
| 7 | No tests / logging / health endpoints | blind production | 20/22 |
| 8 | HSTS missing; CSP uses unsafe-inline/eval | header hardening | 13 |
| 9 | Amadeus flight search error/empty states | UX on failures | 9/18 |
| 10 | Booking has no online payment | business decision | 10 |
