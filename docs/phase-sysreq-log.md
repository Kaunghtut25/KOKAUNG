# Phase: Systematic requirement details on Visas & Insurance listing cards

**Date:** 2026-08-17
**Request:** "I want to show requirement details as systematically for Visas and Insurances." (screenshots of a9travel.com/visas + a9travel.com/insurance)

## What the screenshots showed
- **Visas listing**: requirement items as small gold chips (only first 3, `slice(0,3)`); long lists (Thailand) read as run-on text.
- **Insurance listing**: benefits as small gold chips.

## What was already systematic (reference style)
Both **detail** pages already render requirement/benefit items as a 2-column grid of gold-tinted cards with a gold checkmark SVG:
- Visa detail: "Required Documents" (`visa.requiredDocs`)
- Insurance detail: "Included Benefits" (`ins.includedBenefits`)

## Change (smallest safe, 2 files)
`frontend/src/app/visas/visasclient.tsx` (VisaGridCard) and `frontend/src/app/insurance/insuranceclient.tsx` (InsuranceCard):
- Replaced chip rows with a compact systematic checklist: small uppercase label ("Required Documents" / "Included Benefits") + one row per item with the same gold ✓ checkmark SVG used on detail pages.
- All items are now shown (removed the `slice(0, 3)` cap on visas).
- Reused existing i18n keys (`visa.requiredDocs`, `ins.includedBenefits` — already EN+MM) → no new strings, parity unchanged.

## Verified
tsc 0 · vitest 36/36 · build 0.
