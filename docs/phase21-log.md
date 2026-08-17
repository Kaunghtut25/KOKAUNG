# Phase 21 — Type backlog cleanup (2026-08-17)

## Goal
Remove the last quality asterisk: the `typescript: { ignoreBuildErrors: true }` mask in `next.config.mjs`. The full `tsc --noEmit` backlog went **66 → 0**.

## Batch 1 — site-manager (`f6d301f`, -38 errors)
- **P1 runtime bug: testimonial edits wiped the item's other fields.** The handlers did `a[i] = { ...t, name: ... }` — `t` is the i18n translate function, NOT the testimonial item (`tm`). Spreading a function yields `{}`, so every keystroke in any testimonial field silently destroyed name/country/tour/text/rating/image. Fixed to `{ ...tm, field }` (6 spots). TS had caught this as "partial object" errors.
- **Unreachable feature restored:** `tab === "detailTabs"` section had no tab button and the key was missing from the `Tab` union → the detail-page tab-ordering editor was dead UI. Added `"detailTabs"` to the union + a tab button (reuses `admin.sm.tourTabs` label, EN+MM already present).
- Added 5 genuinely-missing `SiteConfig` fields used at runtime: `heroText`, `cardDimensions`, `heroDimensions`, `moduleToggles`, `detailPageTabs`; `cardsPerRow?` on `SectionLayout`.
- `dealsBanner` fields made optional (7 partial-update call sites; setter requires full type).
- Removed 4 duplicate `style` attributes on textareas (TS17001; kept the class-line style = today's rendering).

## Batch 2 — API + FlagIcon (`96c959c`, -25 errors)
- **FlagIcon: added `className` prop** (svg helper + 25 call sites). The MMK/USD toggle flags now actually get `inline-block mr-1` (was silently ignored).
- **bookings admin route: `getBookings(page, limit, status)` passed 3 args to a 0-arg function** (args silently ignored → returned everything). Route now fetches all, filters by status, slices page/limit — matching the admin page's intent (it already sends page/limit).
- `Collection` type: added `"destinations" | "users"` (admin destinations route called `getAll("destinations")` → 4 errors).
- **site-config route: `destinationsText` duplicated in the default config** (two identical blocks; first silently ignored) — deduped to one.
- `AuthPayload` + `purpose?: string` (reset-password/verify-otp use it).

## Batch 3 — final 15 (`b07be2e`, -15 errors)
- admin tours: `handleFieldChange` accepts boolean (quote_required checkbox).
- blog page: dropped `posts` prop (BlogClient self-fetches; prop was ignored at runtime).
- `BookingData` + `requestId?` (legacy /booking page).
- contact reset form now clears `website` too.
- destinations `PopularDestination` + `groupSize?`.
- tours/[slug]: `(meal: string)` / `(meal: string, mi: number)` implicit-any params.
- toursclient: **CurrencyToggle was called with `currency`/`setCurrency` but the component API is `activeCurrency`/`onToggle`** → `onToggle` was `undefined`; clicking the toggle would have thrown. Now matches all 10 other call sites. **Live-verified working.**
- visas: `BookingModal` called with `title`/`fields` (not props of BookingModal) → now `itemType="visa" itemId itemName`. Note: nothing sets `selectedVisa` so this modal is latent dead code; the real visa booking path is the card's `/book-now?type=visa` button (pre-existing design, untouched).
- PopularDestinations: `destText` added to card props type.
- SearchBar: documented cast for the fallback flat list (component is currently unused).
- ServiceIcons: `label`/`icon`/`href` fallbacks for optional fields.
- WhyChooseUs: `image?` optional.

## Verification
- `npx tsc --noEmit`: **0 errors** (was 66).
- `npm run build`: BUILD_EXIT=0 "Compiled successfully".
- `npm test`: TEST_EXIT=0.
- Pushed `f6d301f` → `96c959c` → `b07be2e`; deployed; buildId `uDF8bbwNvHLIiBSk2LR27`.
- Live probes: /api/admin/bookings 401, /api/admin/site-config 200, / /tours /visas 200.
- Puppeteer: tours MMK/USD toggle clicks and switches active state (previously broken); homepage renders 7 flag SVGs; zero console/page errors.

## Next for Phase 21 completion
- Remove `typescript: { ignoreBuildErrors: true }` from `next.config.mjs` and re-build to prove the pipeline type-cleans on Vercel. (Do this in a follow-up deploy; note the `next.config.mjs` edit + rebuild + redeploy is itself a deploy cycle.)
