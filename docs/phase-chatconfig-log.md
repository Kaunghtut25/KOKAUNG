# Phase: Live Chat Config in Admin Panel (chat-config)

**Date:** 2026-08-17
**Scope:** Admin → Settings → new **Live Chat** tab — configure the AI provider, API keys, and model used by the public Live Chat assistant.

## What was requested
"Add users can change API keys option and model at Admin panel for Live Chat. Provide existing API keys and Model at admin panel."

## What was built

### 1. New shared lib — `src/lib/chatConfig.ts`
Pure, testable helpers shared by the admin API, the public chat route, and unit tests:
- `maskKey()` — API keys are **never shown in full** in the admin UI; only a masked preview (`sk-…wxyz`).
- `resolveProvider()` — decides which provider serves the chat (stored config wins; `auto` keeps the original env priority OpenAI → Anthropic → Ollama).
- `effectiveSettings()` — stored value wins, env var falls back, then default (`gpt-4o-mini` / `claude-3-5-sonnet-latest` / `qwen2.5-coder:3b`).
- `CLEAR_KEY` sentinel — `__CLEAR__` removes a stored key on save.

### 2. New admin API — `src/app/api/admin/chat-config/route.ts`
- **GET** (admin-only): returns provider, base URLs, models, plus `*ApiKeySet` booleans and **masked** previews — never the raw keys. Also reports env fallback status.
- **PUT** (admin-only): key semantics `""` = keep existing, `__CLEAR__` = remove, otherwise replace. Provider allowlisted.
- Storage: persistentStore `"settings"` collection, fixed record id `chat-config` (Supabase when configured, Upstash Redis fallback — same store as all other admin data). **NOT** in `site-config`, whose GET is public (LiveChatWidget reads it) — keys never leak to the public.
- **Middleware**: `/api/admin/chat-config` requires rank ≥ 3 (Full-Access admin), same gate as `/api/admin/users` and `/api/admin/settings`, enforced server-side for GET and PUT.

### 3. Public chat route — `src/app/api/chat/route.ts`
- Reads the stored `chat-config` server-side (Redis `a9:settings` hash) before falling back to env vars.
- Provider selection via `resolveProvider()`; stored base URL / model override env.
- Behavior unchanged when nothing is stored (pure env path, keyword-bot fallback intact).

### 4. Admin UI — Settings → Live Chat tab
- Provider dropdown (Auto / OpenAI / Anthropic / Ollama-local).
- Per-provider API key password field with masked preview, "Remove saved key" toggle, and keep-existing hint.
- Base URL + Model inputs with server-default placeholders.
- Dedicated save button; toast feedback; all strings i18n'd EN + MM (27 new keys, parity verified 1347 = 1347).

### 5. Tests — `src/lib/__tests__/chatConfig.test.ts` (18 tests)
maskKey (never leaks full key), resolveProvider (auto priority, explicit override, missing-key → none), effectiveSettings (stored > env > default), provider allowlist, CLEAR_KEY sentinel.

## Verification
- `npx tsc --noEmit` → 0 errors
- `npx vitest run` → 36/36 passed (18 new)
- `npm run build` → BUILD_EXIT=0 (strict, no ignoreBuildErrors)
- i18n key parity: EN 1347 = MM 1347, zero drift

## Security notes
- Keys stored server-side only; masked in every admin response; never in public payloads.
- Endpoint gated at middleware (rank ≥ 3) — not just hidden UI.
- No plaintext key ever leaves the server.

## Files changed
- new `frontend/src/lib/chatConfig.ts`
- new `frontend/src/app/api/admin/chat-config/route.ts`
- new `frontend/src/lib/__tests__/chatConfig.test.ts`
- edit `frontend/src/app/api/chat/route.ts` (BRAIN reads stored config)
- edit `frontend/src/middleware.ts` (chat-config rank gate)
- edit `frontend/src/app/admin/settings/page.tsx` (Live Chat tab)
- edit `frontend/src/lib/i18n/en.ts` + `mm.ts` (27 keys each)
