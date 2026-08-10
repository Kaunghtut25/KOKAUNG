'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from "@/lib/i18n";
import { createPortal } from 'react-dom';

function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0, m, k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) parts.push(<strong key={k++}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith('[')) {
      const lm = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      parts.push(lm ? <a key={k++} href={lm[2]} target="_blank" rel="noopener noreferrer" style={{ color: '#D4AF37', textDecoration: 'underline' }}>{lm[1]}</a> : tok);
    } else parts.push(<em key={k++}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function ChatText({ text }: { text: string }) {
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0, key = 0;
  while (i < lines.length) {
    const line = lines[i];
    const heading = line.match(/^\s*(#{1,4})\s+(.*)$/);
    const bullet = line.match(/^\s*[-\u2022*]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (heading) {
      blocks.push(<div key={key++} style={{ fontWeight: 700, color: '#0A1628', margin: '8px 0 4px', fontSize: 13.5 }}><Inline text={heading[2]} /></div>);
      i++;
    } else if (bullet) {
      const items: React.ReactNode[] = [];
      while (i < lines.length) {
        const b = lines[i].match(/^\s*[-\u2022*]\s+(.*)$/);
        if (!b) break;
        items.push(<li key={items.length} style={{ marginBottom: 3 }}><Inline text={b[1]} /></li>);
        i++;
      }
      blocks.push(<ul key={key++} style={{ margin: '6px 0', paddingLeft: 18, listStyle: 'disc' }}>{items}</ul>);
    } else if (numbered) {
      const items: React.ReactNode[] = [];
      while (i < lines.length) {
        const n = lines[i].match(/^\s*\d+[.)]\s+(.*)$/);
        if (!n) break;
        items.push(<li key={items.length} style={{ marginBottom: 3 }}><Inline text={n[1]} /></li>);
        i++;
      }
      blocks.push(<ol key={key++} style={{ margin: '6px 0', paddingLeft: 18 }}>{items}</ol>);
    } else if (line.trim() === '') {
      blocks.push(<div key={key++} style={{ height: 6 }} />);
      i++;
    } else {
      blocks.push(<div key={key++} style={{ marginBottom: 4 }}><Inline text={line} /></div>);
      i++;
    }
  }
  return <>{blocks}</>;
}

interface Message {
  id: number;
  text: string;
  sender: 'agent' | 'user';
  time: string;
}

const STORAGE_KEY = 'a9_chat_session';

function getSessionId(): string {
  try {
    let sid = localStorage.getItem(STORAGE_KEY);
    if (!sid) {
      sid = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10) + '_' + Math.random().toString(36).slice(2, 6);
      localStorage.setItem(STORAGE_KEY, sid);
    }
    return sid;
  } catch { return 'anon_' + Date.now().toString(36); }
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Welcome! I'm Miya, your AI travel assistant from A9 Global Travel & Tours. How may I help you plan your trip today?",
    sender: 'agent',
    time: '',
  },
];

const quickReplies = [
  "I want to book a tour",
  "Hotel inquiry",
  "Visa assistance",
  "Car rental",
  "Speak to an agent",
];

export default function LiveChatWidget() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(max-width: 1023.98px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const msgId = useRef(2);
  const sessionId = useRef<string>('');

  const currentTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  // init session id once (client-only)
  useEffect(() => {
    sessionId.current = getSessionId();
  }, []);

  // FIX: 2026-08-11 auto-open chat once per visitor after 8s
  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem('a9_chat_autoopened') === '1'; } catch {}
    if (seen) return;
    const t = setTimeout(() => {
      setOpen(true);
      try { localStorage.setItem('a9_chat_autoopened', '1'); } catch {}
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then((res) => res.json())
      .then((data) => {
        if (data?.contact?.phone) setPhone(data.contact.phone);
        if (data?.contact?.email) setEmail(data.contact.email);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  useEffect(() => {
    if (!open && messages.length > 1) {
      setUnread(prev => prev + 1);
    }
  }, [messages.length]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: msgId.current++,
      text: text.trim(),
      sender: 'user',
      time: currentTime(),
    };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setTyping(true);
    const startedAt = Date.now();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId.current || getSessionId(),
          messages: history.map(m => ({ text: m.text, sender: m.sender })),
          siteInfo: { phone, email },
        }),
      });
      const data = await res.json().catch(() => ({ reply: '' }));
      const replyText = data?.reply || 'Sorry, I could not generate a reply. Please try again.';
      setMessages(prev => [...prev, { id: msgId.current++, text: replyText, sender: 'agent', time: currentTime() }]);
    } catch {
      setMessages(prev => [...prev, { id: msgId.current++, text: 'Network error. Please try again.', sender: 'agent', time: currentTime() }]);
    } finally {
      const elapsed = Date.now() - startedAt;
      const remaining = 900 - elapsed;
      setTimeout(() => setTyping(false), remaining > 0 ? remaining : 0);
    }
  };

  if (!mounted) return null;
  return createPortal(
    <>
      {/* FIX: 2026-08-11 chat widget zoom position - portal to body + mobile offset above sticky CTA */}
      {/* Chat Panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: isMobile ? 148 : 80,
            right: 20,
            width: 380,
            maxWidth: 'calc(100vw - 40px)',
            height: 520,
            maxHeight: 'calc(100vh - 110px)',
            background: 'white',
            borderRadius: 12,
            boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Header — Emirates style: clean, no circles */}
          <div
            style={{
              background: '#0A1628',
              padding: '14px 18px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderBottom: '2px solid #D4AF37',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  Miya
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                </div>
                <div style={{ fontSize: 11, opacity: 0.7, color: '#D4AF37' }}>Travel Assistant • Online now</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {email && (
                <a
                  href={`mailto:${email}`}
                  title="Email us"
                  aria-label="Email us"
                  style={{
                    background: 'rgba(212,175,55,0.15)',
                    border: '1px solid rgba(212,175,55,0.4)',
                    color: '#D4AF37',
                    borderRadius: 18,
                    padding: '4px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    cursor: 'pointer',
                  }}
                >
                  ✉️ Email
                </a>
              )}
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer',
                  fontSize: 22,
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 18px',
              background: '#f8f9fa',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                }}
              >
                <div
                  style={{
                    background: msg.sender === 'user' ? '#0A1628' : 'white',
                    color: msg.sender === 'user' ? 'white' : '#333',
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    fontSize: 13,
                    lineHeight: 1.4,
                    whiteSpace: 'pre-wrap',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                  }}
                >
                  {msg.sender === 'user' ? msg.text : <ChatText text={msg.text} />}
                </div>
                {msg.time && (
                  <div style={{ fontSize: 10, color: '#999', marginTop: 2, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                    {msg.time}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 5, padding: '13px 16px', background: 'white', borderRadius: '14px 14px 14px 4px', width: 'fit-content', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
                {[0, 1, 2].map((d) => (
                  <span key={d} style={{ width: 7, height: 7, borderRadius: '50%', background: '#0A1628', opacity: 0.5, animation: 'bounce 1.1s infinite', animationDelay: d * 0.18 + 's' }} />
                ))}
              </div>
            )}

            {messages.length === 1 && !typing && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => sendMessage(reply)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 16,
                      border: '1px solid #D4AF37',
                      background: 'white',
                      color: '#0A1628',
                      fontSize: 12,
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              padding: '10px 14px',
              background: 'white',
              borderTop: '1px solid #eee',
              display: 'flex',
              gap: 8,
              flexShrink: 0,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(input); }}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '9px 14px',
                borderRadius: 20,
                border: '1px solid #e0e0e0',
                outline: 'none',
                fontSize: 13,
                color: '#333',
                background: '#f8f9fa',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#D4AF37'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e0e0e0'; }}
            />
            <button
              onClick={() => sendMessage(input)}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#0A1628',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Emirates-style floating button — pill shape, no circles */}
      <button
        onClick={() => { setOpen(!open); if (!open) setUnread(0); }}
        style={{
          position: 'fixed',
          bottom: isMobile ? 84 : 20,
          right: 20,
          height: 44,
          borderRadius: 22,
          background: '#0A1628',
          border: 'none',
          cursor: 'pointer',
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 7,
          padding: '0 18px',
          transition: 'all 0.2s',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 600,
          fontSize: 13,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#0F2035'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#0A1628'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)'; }}
      >
        {open ? (
          <span style={{ fontSize: 18, lineHeight: 1 }}>×</span>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>{t("common.liveChat")}</span>
            {unread > 0 && (
              <span style={{
                marginLeft: 2,
                background: '#ef4444',
                color: 'white',
                fontSize: 10,
                fontWeight: 700,
                minWidth: 16,
                height: 16,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
              }}>
                {unread}
              </span>
            )}
          </>
        )}
      </button>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </>,
    document.body
  );
}
