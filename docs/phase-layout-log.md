# Phase: Insurance 4-per-row (visas parity) + Cruises = Sky Lounge card size

**Date:** 2026-08-17
**Request:** "Insurances page must be 4 cards in a row like as Visas page cards. Cruises pages cards must be like as Sky Lounge cards size."

## Live baseline (probed)
- Visas grid: literal `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`, image 176px, no fixed card dims.
- Insurance: dynamic siteConfig grid (3 cols) + fixed `cardDimensions.insurance = 300x380` (DB) — that fixed width blocked 4-across.
- Sky Lounge (mingalar): `cardDimensions.mingalar = 340x420`, image = 210 (50% of card height).
- Cruises: no fixed size; stale DB `cardDimensions.cruises.height = 450`.

## Changes (commits `461cbd6` + `c9e3f1c`)
**insuranceclient.tsx**
- Grid (skeleton + real) → literal visas classes `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4` (also removes the Tailwind dynamic-class hazard).
- Removed `cardWidth/cardHeight` from the card call (siteConfig 300x380 no longer applied) → natural 4-across.
- Image `h-40` → `h-44` (176px, visas parity).

**cruisesclient.tsx**
- Card size mirrors Sky Lounge exactly: `loungeDims = siteConfig?.cardDimensions?.mingalar` (cruises-specific DB 450 explicitly NOT used — Site Manager > Sky Lounge > card size is now the single knob for cruises too).
- Card: `width:340px; max-width:100%; height:420px`; image: 50% of card (210px) — same pattern as mingalar.
- Body compacted to fit the fixed 420px box: p-4, title 15px, dest/desc text-xs, price text-lg, buttons text-xs py-1.5, contact text-xs; amenity chips row removed (full amenities still on cruise detail pages); buttons anchored bottom via `mt-auto`.

## Verified
tsc 0 · vitest 36/36 · build 0 · pushed.
Live (buildId `Jc3z5hjhwryyx3uqoyJQb`):
- /insurance: grid `... md:grid-cols-3 lg:grid-cols-4 gap-4` present; no fixed card dims → 4 cards per row like visas.
- /cruises: cards `width:340px;height:420px`, image `height:210px` — identical footprint to /mingalar cards.

## Admin panel consistency (commit `a2cb48b`, buildId `piJC2hFXkbXGjWx99yjo`)
User asked "also updated on admin panel?" — the Site Manager still showed stale controls. Updated:
- Layout tab: Insurance desktop/tablet/mobile selects **locked to 4/2/1** + gold note "Fixed: 4 per row (like the Visas page)" (public page hardcodes the visas grid, so the old control was a no-op).
- Card & Hero Dimensions tab: **Insurance + Cruises width/height inputs disabled** with notes (insurance "Automatic — fills the 4-column grid"; cruises "Follows the Sky Lounge card size (edit it below)"). **Sky Lounge (mingalar) inputs stay editable** + hint "also applies to Cruises cards".
- 4 new admin.sm.* keys EN+MM; parity 1363/1363, SM 251, zero drift.
- Verified live: new EN dict chunk `6146-ab23cbd31c0a24e0.js` contains `insLayoutFixed` (MM is unicode-escaped in minified output; local parity check covers it).

## Module toggles now gate the home search widget (commit `f58ab5d`, buildId `yXtAesW7qnVTQ_HTcsMom`)
Bug: Flights module toggle OFF hid the ServiceIcons strip + nav/footer links, but the home `#search-engine` widget always defaulted to the flights form (SearchModeContext defaults `mode='flights'`; HomePageClient never read `moduleToggles`).
Fix in `components/HomePageClient.tsx`:
- `flightsOn/busesOn` from `siteConfig.moduleToggles`; `effectiveMode` = flights (if on) else buses (if on) else null; widget renders only when non-null.
- Flights form renders only when `effectiveMode==='flights'`; buses form when `effectiveMode==='buses'`; both off → widget hidden.
- Live-verified: with Flights OFF in DB, home SSR HTML shows the bus form ("Select city", no One Way/Round Trip/Multi-City).

## Hero overlap when both search modules off (commit `0b04a26`, buildId `4RQ93nI_P5fCSwNXS8VfI`)
With Flights AND Buses both toggled off, the widget hides but the empty `-mt-24 md:-mt-32` wrapper still pulled the next section up, clipping the "Popular Destinations / Explore The World" heading under the hero (confirmed via screenshot + AutoGLM image recognition).
Fix: the negative margin is now applied only while the widget renders — `className={"relative z-40 px-4 " + (effectiveMode ? "-mt-24 md:-mt-32" : "")}`.
Live-verified: wrapper renders `class="relative z-40 px-4 "`, no `-mt-24`, heading flows directly below hero.
