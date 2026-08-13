# A9 Project-Specific Development Rules (docs/a9-development.md)

> ဒီဖိုင်က **project-specific rules** — Universal rules အတွက် `AGENTS.md` (ai-agent-engineering-constitution.md ရဲ့ Part 1 block) ကို ကြည့်ပါ။
> အောက်ပါဟာတွေက A9 မှာ တကယ်ဖြစ်ခဲ့တဲ့ bug တွေကနေ သင်ခန်းစာယူထားတာတွေ ဖြစ်ပါတယ်။

---

## A9-01 Stack (မပြောင်းနဲ့)
- Next.js 14 (App Router) + TypeScript + Tailwind CSS, hosted on **Vercel** (www.a9travel.com)
- Data: Supabase (production) — နောက်ကွယ်မှာ `lib/persistentStore.ts` ကနေ abstract လုပ်ထား (fallback: Redis/local)
- Admin auth: HMAC-SHA256 signed token (`AUTH_SECRET` / `ADMIN_PASSWORD` env) — middleware က `/admin/*` နဲ့ admin APIs တွေကို ကာကွယ်ထား
- Build: `npm run build` (frontend folder) · Deploy: `git push origin main` → Vercel auto-deploy

## A9-02 i18n (EN + MM — မဖြစ်မနေ)
- `src/lib/i18n.tsx` ထဲမှာ EN + MM dictionaries တစ်ခုတည်း ထား
- `useI18n()` ကို သုံးတိုင်း **`{ t, lang }` နှစ်ခုလုံး destructure လုပ်ရမယ်** — `lang` ကို destructure မလုပ်ဘဲ သုံးရင် SSR မှာ ReferenceError → page 500 (ဒီ bug က /destinations မှာ တကယ်ဖြစ်ဖူးတယ်)
- UI ထဲ စာသားတိုက်ရိုက် မရေး — keys အကုန် EN + MM နှစ်မျိုးလုံး ထည့်
- Admin page labels တွေလည်း i18n (admin.* keys)

## A9-03 Data shapes — LIVE API ကနေ အရင်စစ် (ဒီဟာတွေ အကုန် တကယ်ဖြစ်ဖူးတယ်)
- **`tags` က ARRAY** (`["Culture","Food"]`) — `.split(",")` ခေါ်ရင် crash → `Array.isArray()` check လုပ်ပြီး handle
- `rating`, `reviews` → number · `minPrice`, `bestTime`, `duration` → string · `groupSize` → number | undefined
- `images` က string (JSON) သို့မဟုတ် array ဖြစ်နိုင်; `image` က fallback
- `description` = paragraph 1; `description2` = paragraph 2 (admin မှာ တည်းဖြတ်လို့ရ) — detail page က description2 မရှိရင် highlights-based auto text ပြ
- Admin API route (`/api/admin/destinations`) က field whitelist မလုပ်ဘူး — field အသစ်ထည့်ရင် **detail page ရဲ့ field mapping မှာပါ ထည့်ပေးရမယ်** (whitelist ကြောင့် ပျောက်တတ်တယ်)

## A9-04 Zoom / responsive (A9-specific rules)
- Overlays/modals: `min(100vw, var(--vvw, 100vw))` သုံး — `--vvw/--vvh` တွေက root layout ရဲ့ inline script ကနေ publish လုပ်ထားပြီးသား
- `html[data-narrow="1"]` နဲ့ admin main column ကို width သတ်တဲ့ CSS rules တွေ **မထည့်နဲ့** — Mac zoom မှာ cards တွေ အကျဉ်းခံပြီး ပျက်တယ် (ဖျက်ပြီးသား)
- Admin list pages တွေက table + `overflow-x-auto` (zoom-safe) — card grid ပြန်မပြောင်းနဲ့

## A9-05 Admin conventions
- Admin pages: dark theme (`bg-[#0A1628]`), gold accent (`#D4AF37` / `bg-gold`), tables က hotels/tours/destinations အကုန် တစ်ပုံစံတည်း
- Dropzone upload: `dest-img-input` pattern — modal ထဲ drag&drop + URL input
- `/api/admin/*` routes တွေက auth ကို middleware ကပဲ ကာကွယ်တယ် — route ထဲမှာ ပြန်မရေးဘဲ token ကို `Authorization: Bearer` နဲ့ စစ်

## A9-06 Git / secrets
- **ဘယ်တော့မှ commit မလုပ်ရ:** `.env*`, `*.db`, `*.sqlite*`, `.openclaw-diag.env`, `scripts/ollama-gate-secret.txt`
- `git push` မလုပ်ခင်: build pass + `git rev-parse HEAD` == `git ls-remote origin main` (MATCH) စစ်
- Deploy verification: buildId/CSS chunk hash ပြောင်းလား + i18n chunk ထဲ key အသစ်ပါလား စစ် — "pushed" နဲ့ "live" မရောထွေးနဲ့

## A9-07 Known pitfalls (ထပ်မဖြစ်စေရန်)
1. `lang` destructure မေ့ → SSR 500
2. `tags` array ကို string လို ယူဆ → client crash
3. Admin field အသစ် → detail page mapping မှာ ထည့်မေ့
4. Fixed-width / `100vw` overlay → zoom မှာ နေရာလွဲ
5. PowerShell inline `node -e` quoting ပျက် → script file အရင်ရေး
6. CRLF vs LF — patch string match မှာ နှစ်မျိုးလုံး စမ်း
7. Build stderr noise (Supabase env warning) ရှိရင် exit code 1 ဖြစ်တတ် — Compiled successfully ကိုကြည့်
