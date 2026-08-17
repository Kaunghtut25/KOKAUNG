## Phase 7 — Tours inventory audit + P0 itinerary fix (2026-08-17)

Commit: `fix(tours): remove auto-generated itinerary fallback (P0) + honest empty state`

### Live inventory (3 tours in store)
| Tour | Type | Price | Itinerary | Amenities | Included | Excluded |
|---|---|---|---|---|---|---|
| Kalaw | inbound* | quote-only (MMK 0) | 5 days ✓ | **0** | 3 | 2 |
| Bagan – Popa | inbound* | quote-only | 4 days ✓ | 3 | 3 | **0** |
| Singapore City Escape | outbound* | 1,250,000 MMK / 595 USD | **0 (empty)** | 4 | 4 | 3 |

\* `tourType` field absent on all records — admin tabs classify via destination heuristic (Myanmar → inbound). Works, but admins should set tourType when editing.

### P0 issue found & fixed
- `tours/[slug]/page.tsx` auto-GENERATED a placeholder day-by-day itinerary
  (`generateItinerary` in lib/tourItinerary.ts — templated "Exploration / Cultural
  Experience / Leisure" days) whenever the DB itinerary was empty. Singapore City
  Escape was showing these fabricated day plans as if real (same class of problem
  as the removed fallback arrays).
- **Fix**: fallback removed; itinerary tab now shows an honest empty state
  ("Itinerary coming soon" + "contact us" — EN + MM i18n keys
  `tour.itinerary.emptyTitle/emptyDesc`). Real itineraries come from the admin
  Itinerary Editor only.
- `generateItinerary`/`parseDays` now unused (lib/tourItinerary.ts left in place,
  dead but harmless — candidate for later cleanup).

### Confirmed OK (no change needed)
- TourCard: price > 0 → "Ks X" else "Request Quote" — quote-only tours never show "Ks 0".
- Detail page price block already shows Request Quote for quote-only tours.
- Detail page already prefers DB itinerary when present (Kalaw/Bagan unaffected).

### Business actions (data, not code)
1. Singapore City Escape: add a real itinerary via admin (currently empty).
2. Kalaw: add amenities. Bagan–Popa: add exclusions.
3. Homepage claims "30+ packages" but only 3 tours live — either add tours or soften the claim (human verification item).
4. Set tourType (inbound/outbound) on each tour for accurate tabs.

### Verification
- Build green; tests 18/18. Live check post-deploy: /tours/singapore-city-escape itinerary tab → empty state (no generated days).
