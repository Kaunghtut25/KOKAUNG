# Phase: Unique image per Insurance card (visa-card style)

**Date:** 2026-08-17
**Request:** "Image should appear like at Visa cards for Insurance's cards."

## Symptom (screenshot 16:40)
Insurance listing cards showed **reused stock photos**: bridge photo on 2 plans, clouds photo on 2 plans. Visa cards each show a unique country photo. DB has 7 plans but only 4 generic images (`ins1-v3` ×2, `ins3-v3` ×3).

## Root cause
Plans in Redis `insurances` carry generic default images (`/images_v2/ins*-v3.jpg`); nothing guaranteed uniqueness.

## Change (smallest safe, 3 files)
- **NEW `frontend/src/lib/insuranceImages.ts`** — `INSURANCE_IMAGE_POOL` (12 existing local ins photos: v3/v2/named sets) + `uniqueInsuranceImages()`: assigns each plan a unique image in plan order; **preserves real admin uploads** (blob URLs / non-pool paths); duplicate uploads also reassigned. >12 plans → pool cycles (unique until exhausted).
- **`frontend/src/app/api/insurance/route.ts`** — GET returns `uniqueInsuranceImages(plans.map(transformInsurance))` (detail pages + client fetches).
- **`frontend/src/app/insurance/page.tsx`** — `getInitialPlans()` server-side applies the same helper so server-rendered listing cards are unique too (client only re-fetches when initialPlans empty).

Admin can still fully control any card's image via the Insurance editor (upload → blob URL → preserved verbatim).

## Verified
tsc 0 · vitest 36/36 · build 0 · pushed `bd433bb`.
Live (buildId `mEI4CIB9bBxL8cFvkdF0K`): `/api/insurance` 7/7 unique; `/insurance` page renders 7 distinct card images.
