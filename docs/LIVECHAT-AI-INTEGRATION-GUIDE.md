# A9 Travel — Live Chat AI Integration Guide

> **Purpose**: This document explains the current Live Chat format and exactly how to plug in
> real AI API keys (OpenAI / Anthropic / Gemini / DeepSeek / any OpenAI-compatible endpoint)
> so the chat answers like a real travel assistant instead of the current keyword bot.
> Last updated: 2026-08-02 (v82 baseline — Miya connected to local Ollama qwen2.5-coder:3b).
>
> **v81 UPDATE — the brain route is ALREADY DEPLOYED**: `frontend/src/app/api/chat/route.ts` is live
> at `/api/chat` with session memory (Upstash Redis), keyword-bot fallback, live travel-catalog
> grounding, and optional web-research hooks. Add an API key to Vercel env and the chat upgrades
> to a real AI assistant with zero code changes. See section 3 for keys and section 10 for what v81 ships.

---

## 1. Current state (what you have now)

- **File**: `frontend/src/components/LiveChatWidget.tsx` (client component, rendered on every page via `RootClient.tsx`)
- **How it works today**: 100% client-side, **no API call**. A `setTimeout(1500ms)` fake "typing" delay, then a keyword match on the user's text:
  - contains `tour`/`book` → tour canned reply
  - contains `hotel` → hotel reply
  - contains `visa` → visa reply
  - contains `car` → car reply
  - contains `agent`/`human`/`speak` → "connecting you to a consultant" + shows the **contact phone from site-config**
  - anything else → generic "our team will get back to you" fallback
- **Data it already pulls**: `GET /api/admin/site-config` → uses `contact.phone` and `contact.email` for the header ✉️ Email button and the agent-handoff message.
- **UI pieces**: floating pill button (bottom-right), chat panel, message bubbles (user dark / agent white), typing indicator, quick-reply chips, unread badge.

### Message shape (keep this — it's the whole format)

```ts
interface Message {
  id: number;
  text: string;
  sender: 'agent' | 'user';
  time: string; // e.g. "01:52 PM"
}
```

---

## 2. What "API keys later" means — the plan

You will add a **server-side API route** that the chat calls. The AI key **never touches the browser**.

```
User types → LiveChatWidget (browser)
              │  fetch POST /api/chat
              ▼
        /api/chat route (Vercel serverless)
              │  reads OPENAI_API_KEY (env, server-only)
              │  builds messages + system prompt
              ▼
        OpenAI / Anthropic / Gemini / DeepSeek API
              │  reply text
              ▼
        browser renders reply as agent bubble
```

---

## 3. Where your API keys go

| Where | What |
|---|---|
| `.env.local` (your machine, dev) | `OPENAI_API_KEY=sk-...` (or `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`, `DEEPSEEK_API_KEY` — pick one) |
| **Vercel → Project → Settings → Environment Variables** | same key name, **Production** + **Preview** (server-only, do NOT prefix `NEXT_PUBLIC_`) |
| Never in code / git | keys must not be committed. `.env.local` is already git-ignored |

> ⚠️ Rule: anything with `NEXT_PUBLIC_` is exposed to the browser. Your AI key must be **plain** (server-side) so it only exists inside the `/api/chat` function.

---

## 4. The route to create: `frontend/src/app/api/chat/route.ts`

Copy this file in. It supports **any OpenAI-compatible endpoint** (OpenAI, DeepSeek, Groq, OpenRouter, etc.) via the `OPENAI_BASE_URL` + `OPENAI_API_KEY` pair, and also Anthropic if you prefer.

```ts
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are "A9 Travel Support", the live chat assistant for A9 Global Travels & Tours, an IATA-accredited travel agency in Myanmar (YGN) operating since 2015.

Your job: help website visitors with travel planning. You can:
- Recommend tours (Bagan, Inle Lake, Yangon, Mandalay, Ngapali, Golden Rock...)
- Answer hotel, car rental, visa, insurance, flight and cruise questions
- Give general travel advice (best seasons, itineraries, booking steps)

Rules:
- Be warm, concise, and helpful. Burmese visitors may write in Burmese — reply in the same language.
- If the user asks for prices, give typical ranges but say "exact price depends on dates & package — contact us for a quote".
- If the user wants to book or speaks to a human, give the contact phone and email below and suggest the Book Now page.
- Never invent policies. If unsure, hand off to a human agent.
- Keep answers under ~120 words unless asked for detail.

Contact info (from site config, refreshed per request):
Phone: ${'{{PHONE}}'}
Email: ${'{{EMAIL}}'}`;

export async function POST(req: NextRequest) {
  // 1. read the chat conversation from the browser
  const { messages, siteInfo } = await req.json().catch(() => ({ messages: [], siteInfo: {} }));

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages required' }, { status: 400 });
  }

  // 2. inject live contact info into the system prompt
  const system = SYSTEM_PROMPT
    .replace('{{PHONE}}', siteInfo?.phone || '(see website contact page)')
    .replace('{{EMAIL}}', siteInfo?.email || 'info@a9travel.com');

  // 3. choose provider. Default: OpenAI-compatible.
  const useAnthropic = !!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY;

  try {
    if (useAnthropic) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest',
          max_tokens: 500,
          system,
          messages: messages.slice(-10), // keep last 10 turns only (context window)
        }),
      });
      const data = await res.json();
      const text = data?.content?.[0]?.text ?? 'Sorry, I could not generate a reply.';
      return NextResponse.json({ reply: text });
    }

    // OpenAI-compatible default (OpenAI / DeepSeek / Groq / OpenRouter...)
    const res = await fetch(process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          ...messages.slice(-10).map((m: any) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        ],
        temperature: 0.6,
        max_tokens: 500,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('chat provider error', res.status, err.slice(0, 300));
      return NextResponse.json({ reply: 'I am having trouble connecting right now. Please try again shortly.' }, { status: 200 });
    }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a reply.';
    return NextResponse.json({ reply: text });
  } catch (e) {
    console.error('chat route error', e);
    return NextResponse.json({ reply: 'Something went wrong. Please try again.' }, { status: 200 });
  }
}
```

### Env vars for this route

| Env | Example | Required |
|---|---|---|
| `OPENAI_API_KEY` | `sk-proj-...` | for OpenAI-compatible |
| `OPENAI_MODEL` | `gpt-4o-mini` / `deepseek-chat` | optional (defaults above) |
| `OPENAI_BASE_URL` | `https://api.deepseek.com/v1` (DeepSeek), `https://api.openai.com/v1` | optional |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | alternative provider |
| `ANTHROPIC_MODEL` | `claude-3-5-sonnet-latest` | optional |

---

## 5. Frontend wiring (swap the fake bot for the real API)

In `LiveChatWidget.tsx`, replace the `sendMessage` keyword block with a real fetch:

```tsx
const sendMessage = async (text: string) => {
  if (!text.trim()) return;

  const userMsg: Message = { id: msgId.current++, text: text.trim(), sender: 'user', time: currentTime() };
  const history = [...messages, userMsg];            // full conversation so far
  setMessages(history);
  setInput('');
  setTyping(true);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: history.map(m => ({ text: m.text, sender: m.sender })),
        siteInfo: { phone, email },                    // already fetched from site-config
      }),
    });
    const data = await res.json();
    setMessages(prev => [...prev, { id: msgId.current++, text: data.reply || '...', sender: 'agent', time: currentTime() }]);
  } catch {
    setMessages(prev => [...prev, { id: msgId.current++, text: 'Network error. Please try again.', sender: 'agent', time: currentTime() }]);
  } finally {
    setTyping(false);
  }
};
```

Keep everything else (quick replies, typing dots, unread badge, contact fetch). The UI format stays identical — only the brain changes.

---

## 6. Travel-assistance prompt format (recommended)

If you want the bot to answer **using your actual tour/hotel data** instead of generic AI knowledge, extend the system prompt with live data. Every page already fetches from these endpoints — the chat can too:

| Data | Endpoint | Use in prompt |
|---|---|---|
| Tours | `GET /api/tours` | tour names, durations, highlights |
| Hotels | `GET /api/hotels` | hotel names, cities |
| Cars | `GET /api/cars` | vehicle types |
| Cruises | `GET /api/cruises` | cruise names |
| Visas | `GET /api/visas` | visa types |
| Insurances | `GET /api/insurance` | insurance plans |
| Blog | `GET /api/blog` | destination guides |
| Site config | `GET /api/admin/site-config` | phone, email, socials, deals |

**Recommended pattern** (in the `/api/chat` route, before calling the AI):

```
1. fetch the 2-3 relevant collections (or a cached snapshot)
2. serialize as compact JSON: [{title, city, price, highlights}...]
3. append to system prompt:
   "Here is our CURRENT catalog. Answer ONLY from this list unless
    the user asks a general travel question: <JSON>"
```

This gives you a **grounded travel assistant** — it can name your real tours, say which cities have hotels, and quote your actual price ranges.

---

## 7. Security checklist

- [ ] API keys only as server env vars (no `NEXT_PUBLIC_`)
- [ ] `/api/chat` never logs the key
- [ ] Truncate conversation to last ~10 messages before sending (cost + context control)
- [ ] Add a simple rate limit (e.g. 10 requests/min per IP) if the site gets traffic
- [ ] The admin contact fetch (`/api/admin/site-config`) is already used by the widget; it's fine for phone/email, but if you later fetch catalogs for the prompt, use the **public** endpoints (`/api/tours` etc.), not admin ones.

---

## 8. Testing checklist (after wiring keys)

1. `npm run dev` locally with `.env.local` set → open site → chat → ask "What tours do you have in Bagan?" → expect a real answer
2. Test Burmese input: "မင်္ဂလာပါ၊ ရန်ကုန်မှာ ဟိုတယ် ရှိလား" → expect Burmese reply
3. Test handoff: "speak to an agent" → expect phone/email in reply
4. Deploy: `git push` → `npx vercel --prod --yes` → verify in production
5. If the AI key is missing/invalid → chat must still answer with the graceful fallback message (no crash)

---

## 9. Quick reference — files touched

| File | Change |
|---|---|
| `frontend/src/app/api/chat/route.ts` | **new** — the AI bridge (copy §4) |
| `frontend/src/components/LiveChatWidget.tsx` | replace `sendMessage` body with fetch (copy §5) |
| `.env.local` + Vercel env vars | add provider key |
| (optional) `frontend/src/app/api/chat/` rate-limit | add later if needed |

That's the whole integration. Message format stays `{id, text, sender, time}` — the UI, styling, and bubbles never change.

---

## 10. What v81/v82 already ship (deployed 2026-08-02)

The code is live — you only need to add a key to flip the switch.

| Feature | Status | How |
|---|---|---|
| Session memory | LIVE | a9:chat:<sessionId> in Upstash Redis, 30-day TTL, last 30 messages kept. Session id persists in visitor localStorage (a9_chat_session). No key needed. |
| AI brain | Ready | Route calls OpenAI-compatible (or Anthropic) when key present; otherwise keyword-bot fallback keeps chat working. |
| Researcher | Ready | TAVILY_API_KEY or SERPER_API_KEY -> route searches the web for visa/entry/weather/current-info questions and feeds results into the prompt. |
| Travel info skills | LIVE | Live catalog (tours/hotels/cars/cruises/visas/insurance) from the store is injected into the system prompt every request. |
| Human handoff | LIVE | "speak to an agent" -> phone/email from site-config. |

### Env keys to add (Vercel -> Settings -> Environment Variables -> Production)
| Key | Provider | Notes |
|---|---|---|
| OPENAI_API_KEY | OpenAI | default gpt-4o-mini; override model with OPENAI_MODEL |
| OPENAI_BASE_URL | DeepSeek/Groq/OpenRouter | e.g. https://api.deepseek.com/v1 |
| ANTHROPIC_API_KEY | Claude | used only if no OPENAI key |
| TAVILY_API_KEY / SERPER_API_KEY | search | optional, for current-info answers |

### Known v81 implementation notes
- @upstash/redis v1.38 **auto-deserializes JSON on get** — do NOT JSON.parse the result of redis.get again (double-parse fails with "[object Object]"). Pass the array directly to set (client stringifies).
- Memory verification: POST twice with same sessionId -> response memory field increments (1 -> 2 -> 3).
- The keyword fallback uses only the last user message; the LLM path uses the last 10 turns + Redis history.

---

## 11. v82 — Miya connected to local Ollama (qwen2.5-coder:3b) — LIVE

**Status: FULLY WORKING on www.a9travel.com.** The live chat is named **Miya** and answers
visitors using your local qwen2.5-coder:3b model, through a token-gated public tunnel.

### Architecture (how the pieces connect)
```
Visitor browser
  -> POST /api/chat (www.a9travel.com, Vercel serverless)
  -> reads OLLAMA_BASE_URL / OLLAMA_MODEL / OLLAMA_API_KEY env
  -> HTTPS POST https://<tunnel>.trycloudflare.com/v1/chat/completions   (Bearer OLLAMA_API_KEY)
  -> ollama-gate.js on your PC (port 11555) checks the token
  -> http://localhost:11434/v1/chat/completions (Ollama, qwen2.5-coder:3b)
  -> reply flows back the same way
```

### Vercel env vars (all set, production)
| Key | Value | Purpose |
|---|---|---|
| OLLAMA_BASE_URL | https://<tunnel>.trycloudflare.com/v1 | OpenAI-compatible endpoint of local Ollama via tunnel |
| OLLAMA_MODEL | qwen2.5-coder:3b | the model |
| OLLAMA_API_KEY | (generated secret) | bearer token required by ollama-gate |
| UPSTASH_REDIS_REST_URL / TOKEN | (existing) | chat memory (a9:chat:<sessionId>) |

### Local processes that must keep running (on your PC)
1. **Ollama** on port 11434 (already running — OLLAMA_HOST=0.0.0.0).
2. **ollama-gate.js** — token-gated proxy, port 11555.
   - File: repo `scripts/ollama-gate.js`.
   - Start: `node scripts/ollama-gate.js 11555 <secret>` (or set OLLAMA_GATE_SECRET env).
3. **cloudflared quick tunnel** from 11555 to a public URL.
   - `cloudflared tunnel --url http://localhost:11555 --protocol http2 --edge-ip-version 4`
   - NOTE: quick-tunnel URL CHANGES every restart. If the PC restarts, run it again and update
     OLLAMA_BASE_URL on Vercel (or the chat falls back to the keyword bot — it never breaks).

### Miya persona + travel knowledge guidelines
The system prompt (route.ts buildSystemPrompt) now:
- Tells the model its name is **Miya** and to say so when asked.
- Adds **TRAVEL KNOWLEDGE GUIDELINES**: Myanmar destinations (Yangon/Shwedagon, Bagan, Mandalay,
  Inle Lake, Ngapali, Golden Rock), domestic travel options, best seasons (Nov-Feb cool/dry),
  Myanmar e-visa basics (advise checking embassy per nationality), and the rule to never invent
  visa fees/flight rules — use catalog/research or hand off.
- Still matches language (Burmese in -> Burmese out), asks ONE clarifying question, hands off
  with phone/email for bookings, keeps answers ~120 words.
- Keyword fallback is name-aware too: "your name" -> "I'm Miya...".

### If you change Ollama host/proxy later
- Local dev without tunnel: set OLLAMA_BASE_URL=http://localhost:11434/v1 (no tunnel needed).
- Other model: change OLLAMA_MODEL on Vercel (models available: qwen2.5-coder:7b, deepseek-r1:8b, hermes3).
- Token rotation: generate a new secret, update ollama-gate start command AND OLLAMA_API_KEY on Vercel.
- Security: ollama-gate only forwards POST /v1/chat/completions with the correct Bearer token;
  everything else returns 404/401. The tunnel URL itself is unguessable but NOT secret — do not
  paste it publicly.

---

## 12. v82c (2026-08-02) — post-reboot recovery + model swap (LIVE)

- **Brain**: qwen2.5-coder:7b (user chose this; gemma3:4b removed 2026-08-02). Clean Burmese with the few-shot prompt; warm ~23-29s per reply (cold first call ~68s — warm the model if chat slows).
- **Burmese quality fix**: few-shot BURMESE REPLY STYLE example in the system prompt (show a correct example — a "pure Burmese" prohibition backfired into Karen-script gibberish).
- **Widget label**: "Travel Assistant • Online now" (was "AI Travel Assistant • Online now"). Verified in deployed chunk layout-cc28334a22f6e5a4.js.
- **Vercel env (production)**: OLLAMA_BASE_URL=https://guestbook-buck-earthquake-spam.trycloudflare.com/v1 (guestbook tunnel up; coalition-seats-harbour-configured = spare), OLLAMA_MODEL=gemma3:4b, OLLAMA_API_KEY=<raw secret>, maxDuration=60.
- **Gate gotcha (critical)**: start the gate with the RAW secret from `scripts/ollama-gate-secret.txt` — the `.openclaw/tmp/ollama-secret.txt` copy contains an `OLLAMA_GATE_SECRET=` prefix that makes Vercel auth fail (401 → "trouble connecting" error reply).
- **Tunnel gotcha**: killing the cloudflared session/wrapper does NOT kill the child process — check `Get-CimInstance Win32_Process -Filter "Name=cloudflared.exe"` before assuming a tunnel is dead.
- **www.a9travel.com can intermittently ETIMEDOUT** from this network while the deployment URL works — transient edge flake, recovers in minutes.
- **Deploys this cycle**: frontend-pycum1yra (maxDuration) → frontend-bxtdmhr3e (gemma3) → frontend-5hnm27e2b (label + few-shot). Commits fb6cfb6 → c9ae240 → ae6f0ec → ebd231e.

---

## 13. v82e (2026-08-02) — DeepSeek API connected (fast cloud brain)

- **Brain**: deepseek-chat via https://api.deepseek.com/v1/chat/completions (OpenAI-compatible). Replies in 2–5s (was 23–29s local). Better Burmese too.
- **Vercel env**: OPENAI_API_KEY=<deepseek key>, OPENAI_BASE_URL=https://api.deepseek.com/v1/chat/completions (FULL endpoint — route uses it as-is), OPENAI_MODEL=deepseek-chat. OLLAMA_* still set as automatic fallback.
- **Route change**: Ollama branch requires `!apiKey` — so when OPENAI_API_KEY is set, the OpenAI-compatible branch (DeepSeek) wins; remove the key to fall back to local Ollama with zero code changes.
- **Local stack now optional**: Ollama + gate + tunnel are idle fallback while the DeepSeek key is set — chat works without them.
- **Key handling**: stored only in Vercel env (Sensitive) + `.openclaw/tmp/env-ds-key.txt`; never commit it.

---

## 14. v82f (2026-08-02) — Miya knows real business info (no more invented contact details)

- **Problem**: bot gave a fake phone (+95 1 123 4567) because stored `contact.phone` was empty → prompt said "(see contact page)" → model hallucinated.
- **Fix**: `BUSINESS_INFO` const in `frontend/src/app/api/chat/route.ts` — department phones (ticket +959 781 617 111, visa +959 781 617 333, hotel +959 694 202 111, outbound +959 756 348 222, inbound +959 694 320 111), emails (a9ticketing@a9globaltravel.com.mm, info@a9globaltravel.com), address (No-18 Zayya Waddy St, Baho Rd, Sanchaung, Yangon), hours (Mon-Fri 9-5, Sat 9-12), off days (Sunday & public holidays), viber/messenger/telegram. Prompt ends with "BUSINESS INFO (AUTHORITATIVE...)" + rules: answer ONLY from it word-for-word, NEVER invent; unknown → refer to Contact page.
- **Verified live**: phone/hours/Sunday/email+address questions all return exact real data (2.4-3.6s, DeepSeek).
- **Where hours/off-days live**: /contact page HTML only (no site-config fields) — keep BUSINESS_INFO in sync if the user changes business hours.
- **Patch pitfall**: when generating code that must contain `${...}` literals, never use a JS template literal in the patch script for that content — build via string concat with a DOLLAR variable.
