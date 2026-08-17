# Phase: Viewer read-only enforcement (About / Visa / Sky Lounge) + Chat Knowledge dark theme

**Date:** 2026-08-17
**Questions raised:**
1. Why can a Viewer admin edit Manage About / Manage Visa / Manage Sky Lounge?
2. Why does Chat Knowledge have a white background?

## Investigation findings
- **Server side is already protected**: Next middleware gates every non-GET `/api/admin/*` request with `rank < 1 → 403` (viewer rank 0). Verified live: unauthenticated POSTs to `/api/admin/visas|mingalar|knowledge|site-config` all return 401; the rank-gate code path is airtight. Login issues viewer tokens as rank 0 (no escalation — role read straight from stored user, restricted to the 4 admin roles).
- **The real problem is the UI**: the sidebar intentionally shows all content pages to viewers ("read-only for viewer"), but the pages themselves did not enforce read-only:
  - `admin/about`, `admin/visas`, `admin/sky-lounge` had **zero** viewer gating (fully active save/add/edit/delete buttons).
  - `admin/knowledge` computed `isViewer` but only used it for add/edit/delete — the **save button was un-gated**.
  - Tours/Hotels/Cars/Cruises/Insurance/Blog/Destinations already gate with `{!isViewer && ...}` — the 3 named pages were the stragglers.
- **Chat Knowledge white background**: page used a light theme (`bg-gray-50`, white cards) while every other admin page is dark navy.

## Changes (matches the established `useClientRole()` pattern used by the other admin pages)
- `src/lib/i18n/en.ts` + `mm.ts`: new key `admin.readOnly.banner` (EN + Burmese).
- `admin/about/page.tsx`: viewer banner, save buttons (2) hidden for viewers, hero upload + certification upload/remove buttons hidden.
- `admin/visas/page.tsx`: viewer banner, Add / Edit / Delete buttons hidden.
- `admin/sky-lounge/page.tsx`: viewer banner, the whole add/edit form hidden, Edit/Delete buttons hidden.
- `admin/knowledge/page.tsx`: viewer banner, save button `disabled={saving || isViewer}`, and **full dark-theme restyle** (navy background, translucent cards, gold accents — consistent with the rest of the admin panel).
- Server-side 403 enforcement was already in place — no middleware changes needed.

## Verified
- `npx tsc --noEmit` → 0
- `npx vitest run` → 36/36
- `npm run build` → BUILD_EXIT=0
- i18n parity 1356 = 1356 (EN/MM), zero drift
