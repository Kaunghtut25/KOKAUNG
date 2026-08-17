# Phase: Section Access (RBAC) enforcement — "why can an Editor with Tours-only access do everything?"

**Date:** 2026-08-17
**Reported:** Admin user KO KAUNG (Editor) with Section Access = Tours only could still access/edit every admin page.

## Root cause
The "Section Access" checkboxes in Manage Users store `authorities: string[]` on the user record and the login route already signs them into the JWT — but **nothing ever read them**:
- middleware checked only role rank (viewer/editor/staff/admin), never per-section authorities;
- the sidebar filtered by rank only, so an editor saw every content page;
- API routes rank-gated writes but never checked the section.

So Section Access was decorative UI. Any editor could do anything an editor's rank allowed.

## Fix (server-side enforced; empty authorities = all sections; admin role = implicit all)
- `lib/auth.ts`: single-source `ALL_AUTHORITIES` (12 existing + **3 new**: `about`, `site-manager`, `knowledge`), `sectionsForPath(path)` map for every admin page + `/api/admin/*` route, `hasSectionAccess(payload, required)`.
- `middleware.ts`:
  - **Pages**: requesting an admin page outside your sections → redirect to dashboard.
  - **APIs**: any `/api/admin/*` call (GET **and** writes) outside your sections → **403** `"You don't have access to this section"`. Public GETs (site-config/settings) unchanged; rank gates unchanged; admin bypasses.
- `components/AdminSidebar.tsx`: nav filtered by token `authorities` (rank rules preserved).
- `app/api/admin/users/route.ts`: now imports `ALL_AUTHORITIES` from `@/lib/auth` (single source of truth).
- `app/admin/users/page.tsx`: Section Access modal gains About / Site Manager / Chat Knowledge checkboxes.
- i18n: 3 new keys EN + MM (`admin.users.auth.about|siteManager|knowledge`), parity **1359 = 1359**.

## Resulting behavior per role (with KO KAUNG = editor + tours only)
- **KO KAUNG (editor, [tours])**: dashboard + Tours only. Sidebar hides everything else; other pages redirect to dashboard; other APIs → 403.
- **Admin (rank 3)**: implicit all sections.
- **Editor/staff/viewer with empty authorities**: all sections (unchanged default; UI shows "all").
- Existing rank semantics unchanged: viewer read-only, staff+ bookings/site-config, admin users/settings.

## Verified
- tsc 0 · vitest 36/36 · build 0 · i18n parity 1359 = 1359.

## Notes / known surface
- `/api/upload` is a shared image endpoint with in-route admin-token + MIME allowlist + 5 MB cap; it does not know which section an upload belongs to, so it is not per-section gated (image-only, low risk).
- Existing sessions keep their old token until re-login — after deploy, affected users should sign out/in once to get the enforcement behavior.
