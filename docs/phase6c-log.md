## Phase 6c — Viewer UI gating + admin-only hardening (2026-08-16)

Commit: `viewer buttons hidden + admin-only users/settings/cleanup` (after `bb994bb`)

### Problem
Viewers (rank 0) could *view* Add/Edit/Delete buttons on all 12 content admin
pages; clicks 403'd server-side (middleware), but the UI suggested write access.
Additionally, `/admin/users` page + `GET /api/admin/users` (user list, incl.
emails + hashes) were readable by ANY valid role — a data exposure.

### Changes
- **NEW `frontend/src/lib/useClientRole.ts`** — client-safe hook; decodes
  `localStorage.admin_token` payload via `decodeTokenPayload`; defaults to
  `"admin"` (no flash of hidden controls for privileged users; SSR-safe).
- **8 admin pages** (`cars`, `cruises`, `hotels`, `insurance`, `tours`,
  `destinations`, `knowledge`, `blog`): each now runs
  `const isViewer = useClientRole() === "viewer";` (inserted immediately after
  the component signature — hooks order safe) and wraps:
  - the Add/New button,
  - the row Edit + Delete button pair (single `{!isViewer && (<>…</>)}` unit),
  - blog: additionally the whole Create/Edit `<form>` block (viewers see the
    post list + view links only).
  Viewers still see View links and read-only data.
- **Middleware hardening**:
  - Pages `/admin/users`, `/admin/settings`, `/admin/cleanup` now require
    rank ≥ 3 (redirect to `/admin/dashboard` otherwise) — staff/editor/viewer
    can no longer open user management or the destructive cleanup tool UI.
  - `GET /api/admin/users` now admin-only (rank ≥ 3) — user list (emails,
    password hashes) no longer readable by staff/editor/viewer. Rank is now
    computed for every non-public admin API request, not just writes.
  - Write gates unchanged: viewer → 403 read-only; settings → admin; site-config
    + bookings → staff+; other content → editor+.
- `cleanup` page needed no button patch (page itself is now admin-only).

### Verification
- `npm run build` green; `npm test` 18/18.
- Per-page scan: every delete call site (`setDeleteConfirm`, `del(`, `remove(`,
  `handleDelete`) sits inside a viewer wrap; 2 wraps per page (add + rows).
- Deployed live-verify follows after push (3-5 min).

### Notes
- Security boundary remains middleware (403) — UI hiding is UX only, as designed.
- `/api/admin/settings` GET stays public (public site reads it) — only the page
  and writes are admin-gated.
