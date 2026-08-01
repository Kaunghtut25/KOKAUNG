import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// ─────────────────────────────────────────────────────────────────────────────
// A9 Travel — Live Chat Brain Route
// 1. MEMORY  : conversation history per session, stored in Upstash Redis (a9:chat:<sessionId>)
// 2. BRAIN   : LLM reply via OpenAI-compatible endpoint (OPENAI_API_KEY / OPENAI_BASE_URL),
//              Anthropic (ANTHROPIC_API_KEY), or local Ollama (OLLAMA_BASE_URL, e.g. http://localhost:11434/v1).
//              Falls back to keyword bot when none configured.
// 3. RESEARCH: optional web search (TAVILY_API_KEY or SERPER_API_KEY) for current info
// 4. TRAVEL  : live catalog snapshot (tours/hotels/cars/cruises/visas/insurance) injected
//              into the system prompt so the bot answers from real data.
// ─────────────────────────────────────────────────────────────────────────────

const MEMORY_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days per session
const MAX_HISTORY = 30; // messages kept in memory

let _redis: any = null;
function getRedis(): any {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) { console.error('[chat] redis env MISSING url=' + !!url + ' token=' + !!token); return null; }
  _redis = new Redis({ url, token });
  console.error('[chat] redis connected');
  return _redis;
}

const KEYWORD_FALLBACK: Record<string, string> = {
  tour: "Great choice! We offer premium tour packages across Myanmar — Bagan, Inle Lake, Yangon & more. Could you share your preferred destination and travel dates?",
  hotel: "We partner with 30+ luxury hotels in Myanmar. Which city are you looking to stay in, and what's your budget range?",
  visa: "We handle visa applications for 30+ countries. Which country's visa do you need, and what's your passport nationality?",
  car: "We offer a fleet of 30+ vehicles — from sedans to luxury vans. What type of vehicle do you need and for how many days?",
  agent: "I'm connecting you to one of our travel consultants. Please hold for a moment...",
};

// ── travel catalog snapshot (live data for grounding) ───────────────────────
async function fetchCatalog(): Promise<string> {
  const out: string[] = [];
  const picks: Record<string, number> = { tours: 6, hotels: 5, cars: 4, cruises: 4, visas: 5, insurances: 4 };
  try {
    const mod = await import('@/lib/persistentStore');
    for (const [col, n] of Object.entries(picks)) {
      try {
        const items = (await mod.getAll(col as any)) || [];
        const slim = items.slice(0, n).map((it: any) => ({
          t: it.title || it.name || it.plan || '',
          d: it.destination || it.city || it.country || '',
          p: it.priceUSD ? '$' + it.priceUSD : it.priceMMK ? it.priceMMK + ' MMK' : '',
          dur: it.duration || '',
        }));
        if (slim.length) out.push(col + ': ' + JSON.stringify(slim).slice(0, 900));
      } catch { /* skip collection */ }
    }
  } catch { /* store unavailable */ }
  return out.length ? out.join('\n') : '';
}

// ── research hook (current/evergreen facts) ─────────────────────────────────
function wantsResearch(text: string): boolean {
  const t = text.toLowerCase();
  const kws = ['visa requirement', 'entry requirement', 'visa on arrival', 'visa free', 'do i need', 'travel advisory', 'weather', 'best time', 'covid', 'quarantine', 'flight status', 'exchange rate', 'current', '2026', 'update', 'news', 'festival', 'water festival', 'thingyan'];
  return kws.some((k) => t.includes(k));
}

async function research(query: string): Promise<string> {
  const tavily = process.env.TAVILY_API_KEY;
  const serper = process.env.SERPER_API_KEY;
  if (tavily) {
    try {
      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ api_key: tavily, query, max_results: 5, search_depth: 'basic' }),
      });
      const data = await res.json();
      const results = (data?.results || []).map((r: any) => r?.title + ': ' + (r?.content || '').slice(0, 300));
      return results.length ? results.join('\n') : '';
    } catch { return ''; }
  }
  if (serper) {
    try {
      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': serper },
        body: JSON.stringify({ q: query, num: 5 }),
      });
      const data = await res.json();
      const results = (data?.organic || []).map((r: any) => r?.title + ': ' + (r?.snippet || '').slice(0, 300));
      return results.length ? results.join('\n') : '';
    } catch { return ''; }
  }
  return '';
}

function buildSystemPrompt(phone: string, email: string, catalog: string, researchText: string): string {
  return `You are "Master A9", the AI live chat assistant for A9 Global Travels & Tours, an IATA-accredited travel agency in Myanmar (YGN) operating since 2015.

YOUR IDENTITY:
- Your name is Master A9. When asked "what is your name" or "who are you", say you are Master A9, the AI travel assistant for A9 Global Travels & Tours.
- You are a warm, knowledgeable human travel consultant — not a generic chatbot.

HOW TO ANSWER LIKE A HUMAN CONSULTANT:
- Read the visitor's message carefully, infer intent (booking, price check, visa question, itinerary help, complaint, general info).
- Ask ONE clarifying question when details are missing (dates, destination, group size, budget) — do not dump everything at once.
- Be warm, concise, conversational. Match the visitor's language (Burmese visitors may write in Burmese — reply in Burmese; English in, English out).
- Give concrete next steps; suggest the Book Now page when they're ready to book.
- For prices give typical ranges and say "exact price depends on dates & package — contact us for a quote".
- If the visitor wants to book or talk to a human, give the phone and email below and offer to connect them.
- Never invent policies, flights, or visa rules. Use the catalog and research below when relevant; otherwise hand off to a human.
- Keep answers under ~120 words unless the visitor asks for detail.

TRAVEL KNOWLEDGE GUIDELINES (use this expertise when relevant):
- A9 operates tours, hotels, cars, cruises, visas, insurance & sky lounge across Myanmar.
- Top Myanmar destinations: Yangon (Shwedagon Pagoda), Bagan (temple plain), Mandalay, Inle Lake, Ngapali Beach, Golden Rock (Kyaiktiyo), Nay Pyi Taw.
- Domestic travel: flights (Yangon-Bagan, Yangon-Mandalay, Yangon-Inle/Heho), overnight buses, private cars with drivers, E-bikes in Bagan, boat transfers on Inle.
- Best time to visit Myanmar: Nov-Feb (cool dry season). Rainy season Jun-Sep. Hot Mar-May.
- Visa: Myanmar e-visa is available online for tourism (typical stay ~28 days for many nationalities); some nationalities are visa-free or visa-on-arrival — always advise checking with the nearest Myanmar embassy for the visitor's nationality, and offer A9 visa assistance.
- Flights and entry rules change often — if unsure or the question is about current rules, use the research results below or hand off to a human.
- Never state a visa fee or rule as guaranteed unless it comes from the research below or the live catalog.

OUR LIVE CATALOG (answer from this when relevant):
${catalog || '(catalog unavailable)'}

${researchText ? `RECENT WEB RESEARCH (current info — use when relevant, note it may change):\n${researchText}` : ''}

Contact: Phone ${phone || '(see contact page)'} | Email ${email || 'info@a9travel.com'}`;
}

function keywordReply(text: string, phone: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('your name') || lower.includes('who are you') || lower.includes('what are you') || lower.includes('what is your name')) {
    return "I'm Master A9, the AI travel assistant for A9 Global Travels & Tours. I can help you plan tours, hotels, visas, cars & more across Myanmar. How can I help?";
  }
  if (lower.includes('tour') || lower.includes('book')) return KEYWORD_FALLBACK.tour;
  if (lower.includes('hotel')) return KEYWORD_FALLBACK.hotel;
  if (lower.includes('visa')) return KEYWORD_FALLBACK.visa;
  if (lower.includes('car')) return KEYWORD_FALLBACK.car;
  if (lower.includes('agent') || lower.includes('human') || lower.includes('speak')) return KEYWORD_FALLBACK.agent + (phone ? ` You can also reach us directly at ${phone}.` : '');
  return `Thank you for your message! Our team will get back to you shortly.${phone ? ` For urgent inquiries, please call ${phone}.` : ''}`;
}

export async function POST(req: NextRequest) {
  const { sessionId, messages, siteInfo } = await req.json().catch(() => ({ sessionId: '', messages: [], siteInfo: {} }));
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages required' }, { status: 400 });
  }
  const sid = (typeof sessionId === 'string' && sessionId.length >= 8 && sessionId.length <= 64) ? sessionId : 'anon_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  const phone = siteInfo?.phone || '';
  const email = siteInfo?.email || '';
  const lastUserText = [...messages].reverse().find((m: any) => m?.sender === 'user')?.text || '';

  // ── 1. MEMORY: load history from Redis, merge, persist ──
  const redis = getRedis();
  let history: any[] = [];
  if (redis) {
    try {
      const raw = await redis.get('a9:chat:' + sid);
      // NOTE: @upstash/redis v1.38 auto-deserializes JSON on get — raw is already an object/array.
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (Array.isArray(parsed)) history = parsed;
    } catch {}
  }
  const merged = [...history, ...messages].slice(-MAX_HISTORY);
  if (redis) {
    try { await redis.set('a9:chat:' + sid, merged, { ex: MEMORY_TTL_SECONDS }); } catch (e) { console.error('[chat] memory write FAIL', (e as Error).message); }
  }

  // ── 2. BRAIN: try LLM, fall back to keyword bot ──
  const apiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const ollamaBase = process.env.OLLAMA_BASE_URL; // e.g. http://localhost:11434/v1 (local Ollama)
  const ollamaModel = process.env.OLLAMA_MODEL || 'qwen2.5-coder:3b';
  let reply = '';

  if (apiKey || anthropicKey || ollamaBase) {
    try {
      const [catalog, researchText] = await Promise.all([
        fetchCatalog(),
        wantsResearch(lastUserText) ? research(lastUserText) : Promise.resolve(''),
      ]);
      const system = buildSystemPrompt(phone, email, catalog, researchText);

      if (anthropicKey && !apiKey) {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({
            model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest',
            max_tokens: 500,
            system,
            messages: merged.slice(-10).map((m: any) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
          }),
        });
        const data = await res.json();
        reply = data?.content?.[0]?.text ?? '';
      } else if (ollamaBase) {
        // Local Ollama (OpenAI-compatible /v1) — no real API key needed
        try {
          const res = await fetch(ollamaBase.replace(/\/$/, '') + '/chat/completions', {
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: 'Bearer ollama' },
            body: JSON.stringify({
              model: ollamaModel,
              messages: [
                { role: 'system', content: system },
                ...merged.slice(-10).map((m: any) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
              ],
              temperature: 0.6,
              max_tokens: 500,
            }),
          });
          if (!res.ok) {
            const errText = await res.text();
            console.error('[chat] ollama error', res.status, errText.slice(0, 200));
          } else {
            const data = await res.json();
            reply = data?.choices?.[0]?.message?.content ?? '';
          }
        } catch (e) {
          console.error('[chat] ollama call error', (e as Error).message);
        }
      } else {
        const res = await fetch(process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [
              { role: 'system', content: system },
              ...merged.slice(-10).map((m: any) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
            ],
            temperature: 0.6,
            max_tokens: 500,
          }),
        });
        if (!res.ok) {
          const errText = await res.text();
          console.error('[chat] provider error', res.status, errText.slice(0, 200));
        } else {
          const data = await res.json();
          reply = data?.choices?.[0]?.message?.content ?? '';
        }
      }
    } catch (e) {
      console.error('[chat] brain error', (e as Error).message);
      reply = '';
    }
    if (!reply) {
      reply = 'I am having trouble connecting right now. Please try again shortly.';
    }
  } else {
    // No API key yet — keyword bot keeps the chat alive
    reply = keywordReply(lastUserText, phone);
  }

  return NextResponse.json({ reply, sessionId: sid, memory: merged.length });
}
