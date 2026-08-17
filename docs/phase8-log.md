
# Phase 8 — Hotels audit (2026-08-17)

## Audit findings
- **Filters were decorative**: hotelsclient.tsx collected location/rating/minPrice/maxPrice state but never applied it — the API supports filters, the client ignored them.
- **Duplicate aria-label x5** on rating + sort selects (TS17001, runtime React warning) — botched merge artifact.
- **HotelCard Book Now passed priceMMK/priceUSD** (undefined on hotel records) — booking link always carried price=0. Real data fields are pricePerNightMMK/pricePerNightUSD.
- **Detail page showed 'Ks 0'** for zero-price (priceOnRequest) hotels instead of 'Price on Request'.
- **i18n gaps**: detail page hardcoded EN (About This Hotel / Amenities / Rooms / rooms at this property / Total (n rooms) / reviews / back links + fabricated English fallback description); admin/hotels hardcoded labels (Name/Address/Phone/Email/Review Count/Row/Status/Price MMK/Price USD/Available).

## Fixes (commit a00d219)
- Client-side filtering implemented (location, rating >=, price range per active currency) + currency-aware price sort; skeleton only while initialHotels empty; honest 'no hotels found' empty state (hotel.noResults).
- aria-labels deduped to single; _id||_id cleanup.
- HotelCard book-now URL now carries pricePerNightMMK/pricePerNightUSD.
- Detail page: price<=0 renders t(common.priceOnRequest); all hardcoded EN swapped to new i18n keys (EN+MM): hotel.about/amenities/room/reviews/total/roomsAtProperty/contactForRooms/noResults/noDescription; fabricated fallback description removed (honest empty via hotel.noDescription); back links use hotel.backToHotels.
- admin/hotels labels wrapped in existing admin.form.* keys (+ new admin.form.available EN+MM; priceMmk/priceUsd already existed — reused, duplicates removed).
- Verified: tsc --noEmit hotels errors 0 (was 2x TS17001); next build EXIT=0 Compiled successfully; tests pass.

## Remaining hotels backlog
- Live data: 6 hotels all with real prices/amenities — no data gaps found. availableRooms is static config (badge informational, G-08 respected).
- RelatedItems/ScrollingRow not audited in depth (shared components, covered by Phase 15/16 sweep).
