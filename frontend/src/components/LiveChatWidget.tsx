'use client';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'agent' | 'user';
  time: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Welcome to A9 Global Travel & Tours! How may we assist you today?",
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
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [phone, setPhone] = useState('+95 9 781 617 111');
  const scrollRef = useRef<HTMLDivElement>(null);
  const msgId = useRef(2);

  const currentTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then((res) => res.json())
      .then((data) => {
        if (data?.contact?.phone) setPhone(data.contact.phone);
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

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: msgId.current++,
      text: text.trim(),
      sender: 'user',
      time: currentTime(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const responses: Record<string, string> = {
        tour: "Great choice! We offer premium tour packages across Myanmar — Bagan, Inle Lake, Yangon & more. Could you share your preferred destination and travel dates?",
        hotel: "We partner with 30+ luxury hotels in Myanmar. Which city are you looking to stay in, and what's your budget range?",
        visa: "We handle visa applications for 30+ countries. Which country's visa do you need, and what's your passport nationality?",
        car: "We offer a fleet of 30+ vehicles — from sedans to luxury vans. What type of vehicle do you need and for how many days?",
        agent: `I'm connecting you to one of our travel consultants. Please hold for a moment... You can also reach us directly at ${phone}.`,
      };

      const lower = text.toLowerCase();
      let response = `Thank you for your message! Our team will get back to you shortly. For urgent inquiries, please call ${phone}.`;

      if (lower.includes('tour') || lower.includes('book')) response = responses.tour;
      else if (lower.includes('hotel')) response = responses.hotel;
      else if (lower.includes('visa')) response = responses.visa;
      else if (lower.includes('car')) response = responses.car;
      else if (lower.includes('agent') || lower.includes('human') || lower.includes('speak')) response = responses.agent;

      const agentMsg: Message = {
        id: msgId.current++,
        text: response,
        sender: 'agent',
        time: currentTime(),
      };
      setMessages(prev => [...prev, agentMsg]);
    }, 1500);
  };

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
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
                  A9 Travel Support
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                </div>
                <div style={{ fontSize: 11, opacity: 0.7, color: '#D4AF37' }}>24/7 Live Chat • Online now</div>
              </div>
            </div>
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
                    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                  }}
                >
                  {msg.text}
                </div>
                {msg.time && (
                  <div style={{ fontSize: 10, color: '#999', marginTop: 2, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                    {msg.time}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 4, padding: '10px 14px', background: 'white', borderRadius: '14px 14px 14px 4px', width: 'fit-content' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ccc', animation: 'bounce 1s infinite' }} />
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ccc', animation: 'bounce 1s infinite 0.2s' }} />
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ccc', animation: 'bounce 1s infinite 0.4s' }} />
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
          bottom: 20,
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
            <span>Live Chat</span>
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
    </>
  );
}