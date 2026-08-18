import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { effectiveSettings, resolveProvider, type StoredChatConfig } from '@/lib/chatConfig';

// v82b: allow up to 60s for local Ollama generation (Vercel default is 10s)
export const maxDuration = 60;

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

const MEMORY_TTL_SECONDS = 60 * 60 * 24 * 365 * 10; // LIFETIME memory: 10 years per session (2026-08-08 user request)
const MAX_HISTORY = 500; // LIFETIME memory: keep long conversation log (LLM still sees only last 10 via slice(-10))

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

// ── Rate limiting: 60 msgs / 15 min per IP (Upstash Redis when available, in-memory fallback) ──
// FIX: 2026-08-04 add rate limiting to /api/chat (prevents LLM bill abuse)
const RL_WINDOW_MS = 15 * 60 * 1000;
const RL_MAX = 60;

const rlMemory = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

async function isChatRateLimited(ip: string): Promise<boolean> {
  const key = 'a9:rl:chat:' + ip;
  const redis = getRedis();
  if (redis) {
    try {
      const count: number = (await redis.get(key)) || 0;
      return (count || 0) >= RL_MAX;
    } catch { /* fall through to memory */ }
  }
  const bucket = rlMemory.get(key);
  if (!bucket || bucket.resetAt < Date.now()) return false;
  return bucket.count >= RL_MAX;
}

async function recordChatHit(ip: string): Promise<void> {
  const key = 'a9:rl:chat:' + ip;
  const redis = getRedis();
  if (redis) {
    try {
      await redis.pipeline().incr(key).expire(key, Math.ceil(RL_WINDOW_MS / 1000)).exec();
      return;
    } catch { /* fall through to memory */ }
  }
  const now = Date.now();
  const bucket = rlMemory.get(key);
  if (!bucket || bucket.resetAt < now) {
    rlMemory.set(key, { count: 1, resetAt: now + RL_WINDOW_MS });
  } else {
    bucket.count += 1;
  }
}

const KEYWORD_FALLBACK: Record<string, string> = {
  tour: "Great choice! We offer premium tour packages across Myanmar — Bagan, Inle Lake, Yangon & more. Could you share your preferred destination and travel dates?",
  hotel: "We partner with 30+ luxury hotels in Myanmar. Which city are you looking to stay in, and what's your budget range?",
  visa: "We handle visa applications for 30+ countries. Which country's visa do you need, and what's your passport nationality?",
  car: "We offer a fleet of 30+ vehicles — from sedans to luxury vans. What type of vehicle do you need and for how many days?",
  agent: "I'm connecting you to one of our travel consultants. Please hold for a moment...",
  // FIX: 2026-08-04 Burmese keyword fallback — so Burmese visitors get replies in their language
  "ခရီး": "ကျေးဇူးပြု၍ သွားရောက်လိုသည့် နေရာနှင့် ခရီးသွားမည့်ရက်ကို ပြောပြပေးပါ။ A9 Global မှ မြန်မာနိုင်ငံတစ်ဝှမ်း (ပုဂံ၊ အင်းလေး၊ ရန်ကုန် စသည်) tour များ စီစဉ်ပေးပါသည်။",
  "ဟိုတယ်": "မည်သည့်မြို့တွင် တည်းခိုလိုပါသလဲ။ ဘတ်ဂျက် ဘယ်လောက်ရှိပါသလဲ။ A9 Global မှ မြန်မာနိုင်ငံအနှံ့ ဟိုတယ် ၃၀ ကျော်နှင့် ချိတ်ဆက်ထားပါသည်။",
  "ဗီဇာ": "မည်သည့်နိုင်ငံအတွက် ဗီဇာလျှောက်ထားလိုပါသလဲ။ နိုင်ငံကူးလက်မှတ် နိုင်ငံသားက ဘာပါလဲ။ A9 Global မှ နိုင်ငံ ၃၀ ကျော်အတွက် ဗီဇာလျှောက်ထားပေးပါသည်။",
  "ကား": "မည်သည့်ကားအမျိုးအစား လိုအပ်ပါသလဲ။ ဘယ်နှစ်ရက်စီစဉ်ပေးရမလဲ။ A9 Global မှ ကား ၃၀ ကျော် ငှားရမ်းပေးပါသည်။",
  "အေးဂျင့်": "ခဏစောင့်ပါ။ ကျွန်ုပ်တို့၏ travel consultant တစ်ဦးနှင့် ချိတ်ဆက်ပေးပါမည်။",
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

// ── trained knowledge base (admin-managed, long-term memory) ──────────────
async function fetchKnowledge(): Promise<any[]> {
  try {
    const mod = await import('@/lib/persistentStore');
    const items = (await mod.getAll('knowledge')) || [];
    return items.filter((it: any) => it.status !== 'inactive').map((it: any) => ({
      t: it.topic || '',
      q: it.question || '',
      a: it.answer || '',
      k: it.keywords || '',
    }));
  } catch { return []; }
}

function matchKnowledge(text: string, kb: any[]): string {
  if (!kb.length || !text) return '';
  const tl = text.toLowerCase();
  const scored = kb.map((e: any) => {
    let score = 0;
    const kws = String(e.k || '').split(',').map((x: string) => x.trim().toLowerCase()).filter(Boolean);
    for (const kw of kws) if (kw && tl.includes(kw)) score += 2;
    const q = (e.q || '').toLowerCase();
    const t = (e.t || '').toLowerCase();
    if (q && tl.includes(q)) score += 3;
    if (t && tl.includes(t)) score += 2;
    return { e, score };
  }).filter((s: any) => s.score > 0).sort((a: any, b: any) => b.score - a.score).slice(0, 5);
  if (!scored.length) return '';
  return scored.map((s: any) => `- Topic: ${s.e.t || '(topic)'}\n  Q: ${s.e.q || '-'}\n  A: ${s.e.a || ''}`).join('\n');
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

const BUSINESS_INFO = {
  phones: {
    ticket: '+959 781 617 111',
    visa: '+959 781 617 333',
    hotel: '+959 694 202 111',
    outbound: '+959 756 348 222',
    inbound: '+959 694 320 111',
  },
  emails: ['a9ticketing@a9globaltravel.com.mm', 'info@a9globaltravel.com'],
  address: 'No-18, Ground Floor, Zayya Waddy Street, Baho Road, Sanchaung Tsp, Yangon, Myanmar',
  hours: 'Mon-Fri 9:00 AM - 5:00 PM, Sat 9:00 AM - 12:00 PM',
  offDays: 'Sunday & Public Holidays - Closed',
  viber: '+959 694 320 111',
  messenger: 'https://m.me/a9globaltravel',
  telegram: 'https://t.me/a9globaltravel',
};

function buildSystemPrompt(phone: string, email: string, catalog: string, researchText: string, knowledgeText: string = ''): string {
  return `You are "Miya", the AI live chat assistant for A9 Global Travels & Tours, an IATA-accredited travel agency in Myanmar (YGN) operating since 2018.

YOUR IDENTITY:
- Your name is Miya. When asked "what is your name" or "who are you", say you are Miya, the AI travel assistant for A9 Global Travels & Tours.
- You are a warm, knowledgeable human travel consultant — not a generic chatbot.

PERSONA — FEMALE VOICE (CRITICAL, ALWAYS):
- You ALWAYS speak with the warm, friendly, polite voice of a young woman. Never switch to a male voice, never mix voices.
- In Burmese, ALWAYS use female forms: "ကျွန်မတို့" for we/our and "ကျွန်မ" for I. NEVER use "ကျွန်တော်တို့" or "ကျွန်တော်" (male forms).
- Be warm and approachable (ဖော်ရွေပျူငှာ) and treat every client with respect and care (လေးစားစွာ ပြန်ဖြေပါ).
- In English keep the same warm female tone (e.g. "we'd love to help", "let me check that for you").
- Never refer to yourself as male and never use male-voiced phrasing.
- BURMESE POLITE PARTICLE (CRITICAL): end polite sentences with "ရှင်" (female), e.g. "ပြောပြပါရှင်", "ကြိုဆိုပါတယ်ရှင်". NEVER use "ခင်ဗျာ" (male particle) — it makes you sound male. "ရှင်" for greetings/closings, "ခင်ဗျာ" is BANNED.

HOW TO ANSWER LIKE A HUMAN CONSULTANT:
- Read the visitor's message carefully, infer intent (booking, price check, visa question, itinerary help, complaint, general info).
- Ask ONE clarifying question when details are missing (dates, destination, group size, budget) — do not dump everything at once.
- Be warm, concise, conversational. Match the visitor's language (Burmese visitors may write in Burmese — reply in Burmese; English in, English out).
- Give concrete next steps; suggest the Book Now page when they're ready to book.
- For prices give typical ranges and say "exact price depends on dates & package — contact us for a quote".
- If the visitor wants to book or talk to a human, give the phone and email below and offer to connect them.
- Never invent policies, flights, or visa rules. Use the catalog and research below when relevant; otherwise hand off to a human.
- Keep answers under ~120 words unless the visitor asks for detail.
- FORMAT for the chat UI (IMPORTANT): use short lines, '- ' bullets with **bold** labels, numbered steps when relevant, and blank lines between sections. No markdown headings (no #), no tables, no code blocks, no emojis at line starts.
BURMESE REPLY STYLE (when the visitor writes in Burmese, reply in proper Myanmar script with a warm greeting. The example below ONLY shows the greeting tone - NEVER copy its content):
EXAMPLE: Visitor: "မင်္ဂလာပါ" - Reply: "မင်္ဂလာပါရှင်။ A9 Global Travels & Tours မှ ကြိုဆိုပါတယ်ရှင်။ ကျွန်မက Miya ပါ။ ခရီးသွားခရီးစဉ်တွေ၊ လေယာဉ်လက်မှတ်၊ ဟိုတယ်၊ ဗီဇာနဲ့ အာမခံလေးတွေအထိ ကူညီပေးနိုင်ပါတယ်။ ဘယ်လိုကူညီပေးရမလဲ ပြောပြပါရှင်။"
CRITICAL: ALWAYS answer the visitor ACTUAL question first, in the same language they used. The greeting is only a short opening line (1 sentence max). If they ask for phone numbers, address, hours or emails, give the BUSINESS INFO values immediately and completely - do NOT ask about tours, do NOT copy the example tour content, and do NOT end the reply early.

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

${knowledgeText ? `YOUR TRAINED KNOWLEDGE BASE (authoritative — provided by the A9 team. When the visitor's question matches one of these topics, answer FROM the given A value — it overrides generic advice):\n${knowledgeText}\n` : ''}
${researchText ? `RECENT WEB RESEARCH (current info — use when relevant, note it may change):\n${researchText}` : ''}

BUSINESS INFO (AUTHORITATIVE — the ONLY contact facts you may state; NEVER invent phone numbers, emails, addresses, hours or off days):
- Ticket/General Phone: ${BUSINESS_INFO.phones.ticket}
- Visa Department: ${BUSINESS_INFO.phones.visa}
- Hotel Department: ${BUSINESS_INFO.phones.hotel}
- Outbound Department: ${BUSINESS_INFO.phones.outbound}
- Inbound Department: ${BUSINESS_INFO.phones.inbound}
- Emails: ${BUSINESS_INFO.emails.join(', ')}
- Address: ${BUSINESS_INFO.address}
- Working Hours: ${BUSINESS_INFO.hours}
- Off Days: ${BUSINESS_INFO.offDays}
- Viber: ${BUSINESS_INFO.viber} | Messenger: ${BUSINESS_INFO.messenger} | Telegram: ${BUSINESS_INFO.telegram}
RULES for contact questions:
- If asked for a phone number, email, address, hours or off days, answer ONLY from the BUSINESS INFO above — word for word, no reformatting into different numbers.
- If asked for a department not listed (e.g. refunds, marketing), give the ticket line ${BUSINESS_INFO.phones.ticket} and the general email ${BUSINESS_INFO.emails[0]}.
- If asked something not in BUSINESS INFO, say you will check with the team / refer them to the Contact page — never guess.
${phone ? `- Client-provided phone: ${phone}` : ''}
${email ? `- Client-provided email: ${email}` : ''}`;
}

function keywordReply(text: string, phone: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('your name') || lower.includes('who are you') || lower.includes('what are you') || lower.includes('what is your name')) {
    return "I'm Miya, the AI travel assistant for A9 Global Travels & Tours. I can help you plan tours, hotels, visas, cars & more across Myanmar. How can I help?";
  }
  if (lower.includes('tour') || lower.includes('book')) return KEYWORD_FALLBACK.tour;
  if (lower.includes('hotel')) return KEYWORD_FALLBACK.hotel;
  if (lower.includes('visa')) return KEYWORD_FALLBACK.visa;
  if (lower.includes('car')) return KEYWORD_FALLBACK.car;
  if (lower.includes('agent') || lower.includes('human') || lower.includes('speak')) return KEYWORD_FALLBACK.agent + (phone ? ` You can also reach us directly at ${phone}.` : '');
  // FIX: 2026-08-04 Burmese keyword branches
  if (lower.includes('ခရီး') || lower.includes('ဘွတ်ကင်') || lower.includes('booking')) return KEYWORD_FALLBACK['ခရီး'];
  if (lower.includes('ဟိုတယ်')) return KEYWORD_FALLBACK['ဟိုတယ်'];
  if (lower.includes('ဗီဇာ')) return KEYWORD_FALLBACK['ဗီဇာ'];
  if (lower.includes('ကား')) return KEYWORD_FALLBACK['ကား'];
  if (lower.includes('အေးဂျင့်') || lower.includes('လူ') && lower.includes('ပြော')) return KEYWORD_FALLBACK['အေးဂျင့်'];
  return `Thank you for your message! Our team will get back to you shortly.${phone ? ` For urgent inquiries, please call ${phone}.` : ''}`;
}

export async function POST(req: NextRequest) {
  const { sessionId, messages, siteInfo } = await req.json().catch(() => ({ sessionId: '', messages: [], siteInfo: {} }));
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages required' }, { status: 400 });
  }

  // ── 0. RATE LIMIT: check before any LLM/Redis work ──
  const ip = clientIp(req);
  if (await isChatRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many messages. Please try again later.' }, { status: 429 });
  }
  await recordChatHit(ip);
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
  // Admin-configured chat settings (stored server-side in Redis a9:settings/chat-config;
  // keys are never sent to the client). Env vars remain the fallback.
  let storedChatCfg: StoredChatConfig = {};
  if (redis) {
    try {
      const rawCfg = await redis.hget('a9:settings', 'chat-config');
      if (rawCfg) storedChatCfg = typeof rawCfg === 'string' ? (JSON.parse(rawCfg) as StoredChatConfig) : (rawCfg as StoredChatConfig);
    } catch (e) { console.error('[chat] chat-config read FAIL', (e as Error).message); }
  }
  const eff = effectiveSettings(storedChatCfg, process.env);
  const apiKey = eff.openaiApiKey;
  const anthropicKey = eff.anthropicApiKey;
  const ollamaBase = eff.ollamaBaseUrl;
  const ollamaModel = eff.ollamaModel;
  const openaiModel = eff.openaiModel;
  const openaiBase = eff.openaiBaseUrl;
  const anthropicModel = eff.anthropicModel;
  const provider = resolveProvider(storedChatCfg, process.env);
  let reply = '';

  if (provider !== 'none') {
    try {
      const [catalog, researchText, kb] = await Promise.all([
        fetchCatalog(),
        wantsResearch(lastUserText) ? research(lastUserText) : Promise.resolve(''),
        fetchKnowledge(),
      ]);
      const knowledgeText = matchKnowledge(lastUserText, kb);
      const system = buildSystemPrompt(phone, email, catalog, researchText, knowledgeText);

      if (provider === 'anthropic') {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({
            model: anthropicModel,
            max_tokens: 1200,
            system,
            messages: merged.slice(-10).map((m: any) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
          }),
        });
        const data = await res.json();
        reply = data?.content?.[0]?.text ?? '';
      } else if (provider === 'ollama') {
        // Local Ollama (OpenAI-compatible /v1) — no real API key needed
        try {
          const res = await fetch(ollamaBase.replace(/\/$/, '') + '/chat/completions', {
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: 'Bearer ' + (process.env.OLLAMA_API_KEY || 'ollama') },
            body: JSON.stringify({
              model: ollamaModel,
              messages: [
                { role: 'system', content: system },
                ...merged.slice(-10).map((m: any) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
              ],
              temperature: 0.6,
              max_tokens: 1200,
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
      } else if (provider === 'openai') {
        const res = await fetch(openaiBase, {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: openaiModel,
            messages: [
              { role: 'system', content: system },
              ...merged.slice(-10).map((m: any) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
            ],
            temperature: 0.6,
            max_tokens: 1200,
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
