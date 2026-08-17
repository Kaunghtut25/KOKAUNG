
# Phase 10 — Booking E2E audit (2026-08-17)

## Audit scope
- book-now page (public booking form), booking-receiver routes, /api/bookings + [id]/pay + [id]/payment, admin bookings page, BookingModal, lib/bookingValidation, middleware.
- E2E contract verified: flights page → book-now link carries type/from/to/fromCity/toCity/depart/return/adults/class/airline/airlineCode/flightNo/price/currency/departTime/arriveTime/stops/offerId — all consumed correctly. Hotels pass type=hotel&priceMMK&priceUSD — handled. BookingModal → POST /api/bookings → /bookings/{id}/pay with allowlisted methods. booking/page.tsx → lib/api processPayment (PUT /payment). Both pay routes validate method allowlist + 404/500 correctly. validation lib is the single source of truth, shared by both POST routes; idempotency via requestId in both.

## Bugs found & fixed (commit a972a3b)
- **P0 SECURITY: /api/booking-receiver GET (full booking list w/ name/email/phone) + [id] PATCH (status update) were completely public** — any visitor could dump all customer PII or mutate inquiry status. Admin page already sent Bearer tokens, so locking down via middleware (GET+PATCH → admin token; POST stays public for the form) breaks nothing. Verified in live browser after deploy.
- book-now summary labels were hardcoded EN (shown to MM users): booking type names, Flexible, Traveler(s), One Way/Round Trip/Multi-City (+Flight), cabin class, Local/Foreigner, Nonstop/stops, Depart/Arrive, Leg...to...on, 'Flight X to Y' itemName — all now via i18n (23 new book.* keys EN+MM; cabin labels reuse existing flights.cabin*).
- Triplicate identical idempotency comment collapsed to one.
- pre-existing tsc: verifyToken(token: string) rejected undefined from middleware (2 errors, masked by ignoreBuildErrors) — signature now accepts undefined w/ guard (runtime behavior unchanged; Phase 21 backlog -2).

## Not changed (flagged)
- **/booking page (booking/page.tsx) is ORPHANED**: no internal links, not in sitemap (only reachable by direct URL). Legacy page using lib/api createBooking/processPayment. Recommend user decision: delete, restore links, or leave.
- specialRequests prefill text (EN, editable textarea content, stored record) left as-is — structured record data consumed by admin, not UI chrome.

## USER ACTION
- Decide fate of orphaned /booking page.
- Booking records currently persist to Upstash Redis (persistentStore) — Supabase migration (pending user account) will move them; booking-receiver PATCH updates 'inquiries' collection via adminStore.
