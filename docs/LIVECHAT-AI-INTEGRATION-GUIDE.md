# A9 Travel — Live Chat AI Integration Guide

> **Purpose**: This document explains the current Live Chat format and exactly how to plug in
> real AI API keys (OpenAI / Anthropic / Gemini / DeepSeek / any OpenAI-compatible endpoint)
> so the chat answers like a real travel assistant instead of the current keyword bot.
> Last updated: 2026-08-02 (v80 baseline).

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

## 10. v82c status (2026-08-02) — live & running

- **Brain**: gemma3:4b (best Burmese of the 4 local models — verified by 4-model shootout; qwen2.5-coder:3b/7b + hermes3 all produce garbled Burmese).
- **Burmese quality fix**: few-shot BURMESE REPLY STYLE example in the system prompt (show a correct example — a "pure Burmese" prohibition backfired into Karen-script gibberish).
- **Widget label**: "Travel Assistant • Online now" (changed from "AI Travel Assistant • Online now").
- **Live env (Vercel production)**: OLLAMA_BASE_URL=https://guestbook-buck-earthquake-spam.trycloudflare.com/v1 (guestbook tunnel up; coalition-seats-harbour-configured = spare), OLLAMA_MODEL=gemma3:4b, OLLAMA_API_KEY=<raw secret>, maxDuration=60 (v82b).
- **Gate gotcha (critical)**: start the gate with the RAW secret from `scripts/ollama-gate-secret.txt` — the `.openclaw/tmp/ollama-secret.txt` copy contains an `OLLAMA_GATE_SECRET=` prefix that will make Vercel auth fail (401 → "trouble connecting").
- **Tunnel gotcha**: killing the cloudflared session/wrapper does NOT kill the child process — check `Get-CimInstance Win32_Process -Filter "Name='cloudflared.exe'"` before assuming a tunnel is dead.
- **www.a9travel.com can intermittently ETIMEDOUT** from this network while the deployment URL works — transient edge flake, recovers in minutes.
