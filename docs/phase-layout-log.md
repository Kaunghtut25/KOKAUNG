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
