# AI Agent Engineering Constitution — v2.0 (Universal Rules)

> **ရည်ရွယ်ချက်:** AI Agent ကို "website generator" ကနေ developer တွေ ဝင်ပြီး understand / edit / debug / extend လွယ်တဲ့ **engineering system** အဖြစ် အသွင်ပြောင်းဖို့။
> **သုံးနည်း:** အောက်ပါ **Universal Rules block** ကို project root ရဲ့ `AGENTS.md` ထဲ ကူးထည့်ပါ (session တိုင်း auto-load)။ Project-specific rules ကို `docs/<project>-development.md` မှာ သီးသန့်ထားပါ။
> **v1 → v2 ပြောင်းလဲချက်:** DO-NOT-CODE-FIRST workflow · Type-suppression ban · State model (11 states) · Security (20 items, AuthN≠AuthZ) · Database governance · API contracts · Observability · Performance · Dependency mgmt · Diff budget · Human approval gates · Risk matrix · ADRs · CI/CD quality gates · General/Project-specific ခွဲခြား။

---

## Part 0 — Core Operating Principles (ဘာမဆို မလုပ်ခင် ဦးနှောက်ထဲ ထည့်ထားရမယ့်ဟာ)

| # | Principle | အနှစ်ချုပ် |
|---|---|---|
| P0.1 | **DO NOT CODE FIRST** | Workflow: **Inspect → Understand → Search → Plan → Identify impact → Implement**။ Code မရေးခင် အဆင့် ၅ ခု ပြီးရမယ် |
| P0.2 | **Smallest Safe Change** | "Button color ပြင်" ဆိုရင် button color ပဲ ပြင်။ design system / theme / CSS / components တွေ ပြန်မရေးနဲ့ |
| P0.3 | **Diff Budget** | Small bug: 1–5 files · Small feature: 3–15 files · Architecture: limit မရှိ ဒါပေမယ့် plan + approval လို။ **Files >50 ဆို STOP → scope ပြန်သုံးသပ်** |
| P0.4 | **No silent contract changes** | API schema / DB / public interface ကို တိတ်တဆိတ် မပြောင်း။ Breaking change ဆို impact analysis + migration + docs + tests + versioning + approval |
| P0.5 | **Think like a Senior Engineer** | "ပြီးရင် ဘယ်သူ ထိန်းသိမ်းမလဲ" ဆိုတဲ့ မေးခွန်းကို line တိုင်းမှာ ထားပါ။ Code က ၆ လအကြာ မင်းကိုယ်တိုင် / တခြား developer က ဖတ်ရမယ် |

---

## Part 1 — Universal Engineering Rules (paste into `AGENTS.md`)

````markdown
# AGENTS.md — Universal Engineering Rules (MANDATORY for all AI coding)

## R1.0 Before you write ANY code — DO NOT CODE FIRST
1. INSPECT: read the existing codebase. Never assume patterns — match existing
   folder structure, component style, naming, data shapes exactly.
2. UNDERSTAND: state what the code currently does, in 2-3 sentences.
3. SEARCH: find similar existing implementations and REUSE them.
4. PLAN: list files to create/modify + impact on existing features. Present
   the plan for confirmation when the task is ambiguous or >5 files.
5. IMPLEMENT only after steps 1-4.
Also: check the LIVE API / DB shape before writing code that reads data.
Never call .split()/.map()/index into fields you have not verified.

## R1.1 Code quality
- TypeScript strict. NO `any`, NO `@ts-ignore`, NO `@ts-expect-error`,
  NO `eslint-disable`, NO `as unknown as X`. Suppressing a type error is
  FORBIDDEN unless you document the technical reason in a comment AND the
  change is approved. Prefer fixing the type properly.
- Naming: components PascalCase, functions/variables camelCase, constants
  UPPER_SNAKE_CASE, files kebab-case (routes) / PascalCase (components).
- NO hardcoded user-visible strings — ALL through i18n (see R1.2).
- NO magic numbers/colors — use design tokens / config.
- NO duplicated logic — extract shared components/utils ONLY when used twice.
- Small, single-purpose components; strict typed props; composition over
  prop-drilling.

## R1.2 i18n / Localization (MANDATORY coverage)
ALL user-visible text through i18n keys, including:
- labels, buttons, placeholders
- alt text, aria-labels, titles
- validation messages, toasts, error messages, empty states
- page metadata, SEO content (title/description/OG)
- email templates, notifications
When using useI18n, destructure EVERY key you reference (`{ t, lang }`).
Missing keys are bugs — never fall back to raw English silently.

## R1.3 UI state model — applicable states MUST be explicitly considered
Idle · Loading · Success · Empty · Error · Retrying · Offline ·
Unauthorized (401) · Forbidden (403) · Partial data · Stale data
(Not every feature needs all states — but you must consciously decide which
apply and implement them. "It won't happen" is not a valid decision without
a stated reason.)

## R1.4 Responsive & zoom
- Mobile-first; test at 375 / 768 / 1440 px AND browser zoom 80%–200%.
- Overlays/modals: use `min(100vw, …)` / visualViewport-based sizing;
  never let fixed px widths break layout under zoom.
- Long text wraps; no button text overflow; no card overlap.

## R1.5 Accessibility
Semantic HTML, aria-labels, keyboard navigation, focus states, WCAG AA
contrast, form validation with visible errors, reduced-motion respect.

## R1.6 Architecture
- FOLLOW the project's approved architecture. Do NOT introduce a new
  architectural pattern (feature-based / layered / clean / hexagonal /
  modular monolith / monorepo…) without justification + approval.
- Data fetching through the project's existing layer (auth header, base URL,
  error handling, timeout in ONE place). No direct fetch in pages unless
  unavoidable. Cancel requests on unmount.
- State: local state first; context/store only when genuinely shared.
- Significant architecture decisions → Architecture Decision Record (ADR)
  in `docs/adr/` (context → decision → consequences).

## R1.7 Security (20-point checklist)
- Authentication (login/session) and Authorization (WHO can do WHAT) are
  SEPARATE concepts. AuthN ≠ AuthZ. A logged-in user is NOT an admin.
- RBAC/ABAC for permissions; enforce on the SERVER, never trust the client.
- Session management: expiry, rotation, secure storage (no tokens in
  localStorage unless necessary; prefer httpOnly cookies).
- CSRF protection on state-changing requests.
- XSS: escape all output; never dangerouslySetInnerHTML user content.
- SQL injection: parameterized queries / ORM only.
- SSRF: validate/allowlist external URLs the server fetches.
- CORS: explicit origin allowlist; no `*` with credentials.
- File upload: type/size allowlist, random filenames, scan, serve from
  isolated storage, never execute uploaded files.
- Path traversal: never join user input to filesystem paths; sanitize.
- Rate limiting + brute-force protection on login/auth endpoints.
- Secrets: env vars only, never committed; rotate on exposure.
- Encryption: TLS everywhere; encrypt sensitive fields at rest.
- PII handling: collect minimum, mask in logs, respect deletion requests.
- Audit logging for auth/admin/destructive actions.
- Dependency vulnerabilities: keep scanner in CI (npm audit / OSV).
- Security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options.
- Content Security Policy: allowlist scripts/styles; no inline eval.

## R1.8 Database governance
- NEVER modify production schema manually. ALL schema changes = migrations
  (versioned, reviewed, applied through CI/CD).
- NEVER delete/rename columns without impact analysis (queries, indexes,
  backups, read/write paths, downstream consumers).
- Check foreign keys, constraints, and indexes before schema changes;
  add indexes for new query patterns.
- Backward compatibility: old app versions must not break during rollout.
- Data migration plan required for any data transform (dry-run first).
- NEVER destroy production data without explicit human approval.
- Seed data must be deterministic (same input → same output).
- Use transactions wherever atomicity is required.
- Bulk operations: batch, don't loop single queries.

## R1.9 API contracts
Define and document: request schema, response schema, error schema
(consistent error shape), authentication, authorization, pagination,
filtering, sorting, versioning.
- NEVER change an existing API contract silently.
- Breaking change requires: impact analysis → frontend compatibility check →
  migration plan → documentation update → tests → version bump → approval.
- New endpoints follow the project's existing error format.

## R1.10 Observability
Production code must be debuggable without the author:
- Structured logging (JSON, levels, no console.log noise in prod).
- Error tracking (capture stack + context; user-safe messages).
- Request IDs / correlation IDs (propagate through the call chain).
- Metrics for key operations (latency, error rate, throughput).
- Health checks (`/api/health`) for services.
- Performance monitoring hooks where the stack supports it.
- Audit logs for auth/admin/payment actions.

## R1.11 Performance engineering
- Core Web Vitals: LCP, CLS, INP within target.
- Bundle size: code-split routes, no dead imports; warn on big deps.
- Images: next/image-style optimization, explicit sizes, lazy below fold.
- Lazy loading for non-critical components.
- Caching strategy (HTTP cache headers, SWR/React Query style where used).
- DB: watch for N+1 queries; paginate lists; index hot paths.
- API response size: select only needed fields; paginate.
- Rendering: choose SSR/SSG/CSR per page needs; avoid client waterfalls.
- Watch memory usage: event listeners, intervals, large arrays cleaned up.

## R1.12 Dependencies
- Use the project's package manager + lockfile (commit the lockfile).
- NO new dependency without justification; prefer small, maintained,
  typed packages; check license + maintenance status.
- Keep versions pinned; update via dedicated PRs with changelog review.
- Remove unused dependencies; no duplicate libs doing the same job.
- Run dependency vulnerability scan before merge (CI).

## R1.13 Testing
- Unit tests for logic/utils; component tests for UI states (R1.3);
  E2E for critical flows (login → CRUD → payment if present).
- Tests must be deterministic and fast; no sleeps/network in unit tests.
- A bug fix MUST include a regression test that fails on the old code.
- Coverage on critical paths, not vanity metrics.

## R1.14 Git & change management
- One commit = one coherent, reviewable logical change (a large feature can
  be many small commits: API → logic → UI → tests → docs).
- Conventional commits: feat: fix: refactor: docs: style: test: chore: perf:
  security: revert:
- Commit message body explains WHY, not just WHAT.
- Branch per feature/fix; PR with description of what + why + what you
  tested + what you did NOT test.
- Make the SMALLEST SAFE CHANGE. Do not modify unrelated files. Do not
  refactor unrelated code unless explicitly requested or required for
  correctness.

## R1.15 CI/CD quality gates (merge blocked until ALL pass)
- Lint (eslint) · Format (prettier --check) · Typecheck (tsc --noEmit strict)
- Unit + component tests · Build · Security scanner · Dependency scanner
- Preview deployment with screenshots for UI changes.
- Production deploy: only from main after green CI + human approval.

## R1.16 AI self-review protocol (before you say "done")
1. Re-read your own diff as a reviewer: does each change belong to this task?
2. Re-check R1.1–R1.13 against your diff (types, i18n, states, security…).
3. Run lint + typecheck + build + tests; fix ALL failures.
4. Verify in browser: desktop + mobile + zoom + language switch + the 3+
   states; console must have NO errors/warnings.
5. Write the verification result honestly in the PR ("tested X, NOT tested Y").
6. If diff >50 files or >15 files for a small task → STOP and re-scope.

## R1.17 Human approval gates (MANDATORY — AI must not proceed alone)
Pipeline: AI implement → AI self-review (R1.16) → automated checks (R1.15)
→ security review → HUMAN REVIEW → merge.
Human approval REQUIRED before: database destructive changes, schema
migrations, authentication/authorization changes, payment code, infra
changes, production deployment, handling secrets, data deletion,
breaking API changes, new architecture patterns, dependencies with
significant risk.
When in doubt: ASK. Never bypass a gate.

## R1.18 Documentation
- README: setup, commands, env vars, deploy (updated when workflow changes).
- ARCHITECTURE.md: system overview, data flow, key decisions (with ADRs).
- SECURITY.md: how to report issues; security model summary.
- CONTRIBUTING.md: setup, conventions, PR process (if project has
  contributors).
- ADRs in docs/adr/ for significant decisions.
- Code comments explain WHY only (never "what"); complex logic gets a
  one-paragraph explanation above it.
- CHANGELOG for user-visible changes.
````

---

## Part 2 — Documentation Set (project root)

| File | အကြောင်းအရာ | ဘယ်သူ ဖတ်မလဲ |
|---|---|---|
| `AGENTS.md` | အထက်ပါ Universal Rules block | AI agents (auto-load) |
| `README.md` | setup, commands, env, deploy | developers, newcomers |
| `ARCHITECTURE.md` | system overview, data flow, decisions | developers, reviewers |
| `SECURITY.md` | security model, reporting | security, developers |
| `CONTRIBUTING.md` | conventions, PR process | contributors |
| `docs/adr/` | Architecture Decision Records | developers, architects |
| `docs/<project>-development.md` | project-specific rules | AI agents + developers |

> Machine-enforced >  "don't do X": ESLint, Prettier, TypeScript strict, tests,
> CI gates, security scanner, dependency scanner တွေနဲ့ "လုပ်လို့မရအောင်"
> တားထားတာက "မလုပ်နဲ့လို့ ပြောထားတာ" ထက် အဆများစွာ အားကောင်းတယ်။

---

## Part 3 — Risk Classification & Approval Matrix

| Risk level | ဥပမာ | AI တစ်ယောက်တည်း လုပ်လို့ရလား? |
|---|---|---|
| 🟢 Low | typo, copy fix, style tweak, small bug (1–5 files) | Yes → CI → PR → human review |
| 🟡 Medium | small feature (3–15 files), new endpoint, UI states | Yes → CI → tests → human review |
| 🟠 High | auth/AuthZ change, DB migration, API breaking change, payments, secrets, data deletion | **No — plan + human approval REQUIRED** |
| 🔴 Critical | production deploy, schema destroy, infra, mass data ops | **No — multi-step approval + rollback plan** |

---

## Part 4 — PR Review Checklist (AI ကိုယ်တိုင် ဖြည့်ရမယ့်ဟာ)

- [ ] Inspect → Understand → Search → Plan လုပ်ပြီးမှ ရေးထား (R1.0)
- [ ] Smallest safe change; unrelated files မပါ (R1.14)
- [ ] Diff budget ထဲမှာ ရှိ (R1.0 P0.3)
- [ ] `any` / suppression တွေ မရှိ (R1.1)
- [ ] UI strings အကုန် i18n — alt/aria/validation/metadata/email အပါအဝင် (R1.2)
- [ ] Applicable states (idle/loading/success/empty/error/retry/offline/401/403/partial/stale) စဉ်းစားပြီး (R1.3)
- [ ] Mobile + desktop + zoom + language switch စမ်းပြီး (R1.4)
- [ ] Security checklist (AuthN≠AuthZ, input validation, no secrets…) (R1.7)
- [ ] DB ပြောင်းရင် migration + impact analysis ပါ (R1.8)
- [ ] API contract မပျက် / breaking ဆို approval (R1.9)
- [ ] Logging/observability ထည့်ထား (R1.10)
- [ ] Performance: images, bundle, N+1, pagination (R1.11)
- [ ] Regression test ပါ (R1.13)
- [ ] lint + typecheck + build + tests pass (R1.15)
- [ ] Tested / NOT tested ရေးထား (R1.16)
- [ ] Human approval gates လိုအပ်တာတွေ ရှိရင် စောင့်ထား (R1.17)
