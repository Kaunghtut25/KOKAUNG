
# Phase 9 — Flights (Amadeus) audit (2026-08-17)

## Findings
- **Duplicate aria-label x2** (adults + travelClass selects, TS17001 at old L331/342) — same botched-merge class as Phase 8.
- **Dead code with hardcoded EN**: stopsText() and cabinLabels() defined but never used (render uses t() keys inline).
- **Hardcoded EN error strings**: 'Please fill in origin, destination, and departure date.' and 'Network error. Please try again.' not i18n'd; static errInputs hint line duplicated the validation message and was misleading for API errors.
- **Shared debounce timer race**: one typingTimer for both origin AND destination inputs — typing in one could cancel the other's pending airport search.
- **Broken hero image**: /images_v2/hero-flights-v2.jpg referenced but NEVER EXISTED (no flights hero asset in the repo at all) — hero rendered as dark empty area with a 404 image request.

## Fixes (commit 7192480)
- aria-labels deduped (flights tsc errors 2 → 0).
- Removed dead stopsText/cabinLabels helpers.
- Error strings via t(): validation -> flights.errInputs, network -> flights.errNetwork (NEW key EN+MM added after flights.errInputs); removed the static duplicate hint line.
- Separate originTimer/destTimer debounce states.
- Hero: removed broken bg image; gradient-only hero (from-#0A1628/60 via-#101F36 to-#0A1628) + marker comment; honest until a real flights asset is supplied.
- Kept Amadeus route handler as-is (already validates params, 503 with setup help when unconfigured, error passthrough) — no changes needed.
- Verified: tsc flights clean, next build EXIT=0, tests pass.

## USER ACTION NEEDED
- **Provide a flights hero image** (e.g. /images_v2/hero-flights-v2.jpg or similar) — page currently shows gradient-only hero.
- **Verify popular-routes marketing data** (flights/page.tsx popularRoutes array): 'From \' RGN-BKK, 'From \' RGN-SIN, 'From \' RGN-DXB, 'From \' RGN-NRT, 'From \' RGN-KUL, 'From \' RGN-ICN, 'From \' RGN-LHR, 'From \' MDL-BKK + durations/stops/airlines — static EN marketing copy, needs business confirmation; not i18n'd (MM users see EN).
- **Amadeus API keys**: set AMADEUS_API_KEY / AMADEUS_API_SECRET in Vercel to make the search actually return live offers (currently returns honest 503 'not configured').
- **flight offers are test-environment** (AMADEUS_BASE_URL defaults to test.api.amadeus.com) — switch to production base URL when live bookings start.
