## Phase 6d — Close public registration (2026-08-17)

Commit: `fix(auth): close public self-registration — accounts admin-created only`

### Problem
`POST /api/auth/register` + `/auth/register` were open to anyone. Resulting
accounts got role `"user"` (rank -1, no panel access), so it wasn't a privilege
escalation — but it is an open signup + store-pollution vector on a production
site, and the navbar advertised it. Accounts are meant to be created by admins
via `/admin/users`.

### Changes
- **`app/api/auth/register/route.ts`** — rewritten; POST now returns 403
  `"Registration is closed..."`. (`verifyPassword` export removed — was not
  imported anywhere.)
- **`app/auth/register/page.tsx`** — rewritten as a "Registration is closed 🔒"
  notice card (EN+MM via i18n), keeps LanguageSwitcher + Sign In link. No form,
  no submit, no unused code.
- **`lib/i18n.tsx`** — added `auth.register.closed` + `auth.register.closedHint`
  in EN and MM.
- **`components/Navbar.tsx`** — removed the "Sign Up" link from the account
  dropdown (login link now single item, rounded-xl).
- Left in place: `lib/api.ts` register helper (unused now — harmless, available
  if an admin invite flow reuses it) and forgot-password flow (already
  anti-enumeration, "always 200-style").

### Verification
- Build green; tests 18/18.
- Live probes after deploy: POST /api/auth/register → 403; GET /auth/register →
  200 with closed notice; login page unaffected.
