## Phase 7 (part 2) — Tour detail crash fix + admin tours modal repair (2026-08-17)

Commit: `fix(tours): restore missing price defs (detail crash) + repair admin tours modal JSX`

### Bug 1 — PUBLIC: every tour detail page crashed (client exception)
- Root cause: commit `5c6d3a0` (P0 "no fake prices") deleted
  `const price / currencySymbol / totalPrice` from `app/tours/[slug]/page.tsx`
  while the JSX still referenced them → `ReferenceError` at render on ALL tour
  detail pages. Undetected because `next.config` has
  `typescript: { ignoreBuildErrors: true }` (Phase 21 todo).
- Fix: restored the three definitions (after the bookingForm state):
  `price = currency === 'MMK' ? (tour?.priceMMK ?? 0) : (tour?.priceUSD ?? 0)`,
  `currencySymbol`, `totalPrice = price * (travelers || 1)`.
- Verified pre-existing: previous deploy (6nech8i52, Phase 6d) crashed the same
  way — not a Phase 7 regression.

### Bug 2 — ADMIN: Tours Add/Edit modal rendered garbage text
- `app/admin/tours/page.tsx` had an orphaned `className="..." />` after the
  quote-required `</label>` (botched edit). SWC compiled it as a literal TEXT
  node, so admins saw `className="w-full bg-white/5..." />` as visible text in
  the modal, and the priceUSD input lost its styling className (rendered
  unstyled).
- Fix: moved the className onto the priceUSD input; merged styling onto the
  checkbox; removed the orphan lines. tsc's parse error (TS1382) gone.

### Typecheck sweep (new capability — tsc was never running cleanly)
- `npx tsc --noEmit` now completes. Remaining masked errors (~40) are the
  Phase 21 backlog: site-manager page (duplicate ctaImage identifier, JSX
  duplicate attributes TS17001, testimonial object literals, missing
  departmentPhones/cardsPerRow on types), dashboard .label, destinations arg,
  bookings possibly-undefined, admin/layout arg, users route type gen.
  No other "Cannot find name" render-crashers found.

### Verification
- Build green; tests 18/18.
- Live post-deploy: /tours/kalaw + /tours/singapore-city-escape render content
  (no client exception); Singapore itinerary tab shows honest empty state;
  admin tours chunk no longer contains the text-node garbage.

### Note
- Keep `ignoreBuildErrors: true` until Phase 21 fixes the ~40 listed errors;
  then flip it off. The tsc run is now part of the Phase 7 toolchain.
