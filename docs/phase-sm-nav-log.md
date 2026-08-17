# Phase: Site Manager — Systematic Navigation Redesign

**Date:** 2026-08-17
**Request:** "This Layout I don't like. Create as Systematically." (referring to the Site Manager admin page)

## Problem
The Site Manager page dumped all 25 sections into a single flat, ungrouped tab bar (previously a plain 2-column grid) — hard to scan, no hierarchy, no way to find a section quickly.

## What changed (smallest safe change — editors & save logic untouched)
`frontend/src/app/admin/site-manager/page.tsx`:
- **Grouped navigator**: 25 sections organized into 6 logical categories, each with an icon + category header:
  - 🧱 **Page Structure** — Layout, Rows, Nav Links, Footer
  - 🎠 **Hero & Visuals** — Hero Slides, Hero Images, Hero Text, Card & Hero Sizes
  - 🏠 **Homepage Content** — Why Choose Us, Stats Cards, Service Icons, CTA Section, Deals Banner, You May Also Like, Testimonials, Partners
  - 📄 **Legal & Info** — FAQ, Terms, Privacy
  - 📞 **Contact & Social** — Contact Info, Social Links, Social Feed
  - ⚙️ **SEO & Advanced** — Meta & SEO, Module Toggles, Tour Detail Tabs
- **Live search** — filters section chips as you type; "no results" state.
- **Active section** highlighted in brand gold (#D4AF37), matching the Save button.
- Replaced the old flat `tabs` array with `sectionGroups` (all labels reuse existing i18n keys).

i18n: 8 new keys added in EN + MM (`searchSections`, `noResults`, 6 group names). Parity verified **1355 = 1355**, zero drift.

## Verified
- `npx tsc --noEmit` → 0
- `npx vitest run` → 36/36
- `npm run build` → BUILD_EXIT=0
- i18n key parity EN = MM (1355), all `admin.sm.*` present in both
