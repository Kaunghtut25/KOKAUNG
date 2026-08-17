# Phase 11 — Admin CRUD audit (2026-08-17)

## Audit scope
All 16 admin pages (dashboard, site-manager, about, bookings, tours, destinations, hotels, cars, visas, insurance, cruises, blog, knowledge, users, sky-lounge, settings) × their API routes + middleware RBAC + auth surface.

## Verdict: CRUD wiring is COMPLETE and consistent
- Every admin page implements full list/create/update/delete against existing routes with correct methods
  (`method = isNew ? "POST" : "PUT"` + `DELETE`; destinations/users/knowledge use `?id=` single-route pattern, rest use `/[id]`).
- All 24 `/api/admin/*` routes exist and match page calls. Earlier "missing route" alarms were regex false positives.
- Auth verified:
  - middleware gates all `/api/admin/*` (public GET whitelist = site-config + settings only; seed NOT public).
  - Rank RBAC: users API rank≥3 even for GET; writes rank≥1; settings rank≥3; site-config+bookings rank≥2; viewers read-only.
  - `/api/upload` enforces admin token in-route + MIME allowlist (SVG blocked) + 5 MB cap.
  - `/api/auth/register` closed server-side (403) since 2026-08-17 (accounts created only via /admin/users).
  - `/api/booking-receiver` GET/PATCH gated (Phase 10); POST public for form.
- `/admin` root redirects correctly; admin layout has error boundary + role check + cookie sync.
- `/admin/cleanup` = hidden dev-only tool (not in sidebar, rank≥3), calls only real routes.

## Bugs found & fixed (commit 9f9…)
1. **site-manager: `ctaImage` declared twice** in SiteConfig interface (TS2300) AND in the default config object (TS1117) — duplicate key, last-wins semantics. Removed both dups.
2. **bookings: `inquiryModal.amount` unguarded** (TS18048) — `amount ?? 0` guard in the flight-details render.
3. **dashboard: quickActions keyed on `action.label`** (TS2339) — field is `labelKey`; keys were all `undefined` (broken re-render identity). Now `action.labelKey`.
4. **settings: tabs rendered `{tab.label}`** (TS2339) — field is `labelKey`; **tab labels rendered literally `undefined` in production UI**. Now `t(tab.labelKey)`.
5. **admin layout: role check on possibly-undefined `payload.role`** (TS2345) — explicit `!payload.role` guard (runtime behavior unchanged).
6. **destinations: `setEditing({...editing, image})` with `editing: Destination|null`** (TS2345) — null-guarded; no change when no row selected.
7. **users route: exported `ADMIN_ROLES`/`ALL_AUTHORITIES`/`verifyPassword`** broke Next's route-module type constraint (TS2344) — de-exported (nothing imported them).

tsc 80 → 66. Remaining 12 site-manager items (7× dealsBanner partial types, cardsPerRow, 4× TS17001 dup-attrs, 2× Testimonial partials) are pre-existing type debt → Phase 21 worklist (runtime is correct).

## Not changed (flagged)
- 16 sidebar pages all reachable; cleanup + root /admin handled above.
- No orphaned routes or pages discovered (only /booking public orphan, Phase 10 note).
- Admin pages i18n: prior phases (admin-i18n stages 1-7) completed; no new hardcoded strings found in touched lines.
- DealsBanner/Testimonial/cardsPerRow interface debt → Phase 21.
