'use client';

import { useState } from 'react';
import { MessageCircle, X, Phone, Mail } from 'lucide-react';

const SOCIAL_LINKS = [
  { label: 'WhatsApp', url: 'https://wa.me/959694320111', icon: '💬', color: 'bg-green-500 hover:bg-green-600' },
  { label: 'Messenger', url: 'https://m.me/a9globaltravel', icon: '💭', color: 'bg-blue-500 hover:bg-blue-600' },
  { label: 'Viber', url: 'viber://chat?number=%2B959694320111', icon: '📞', color: 'bg-purple-500 hover:bg-purple-600' },
  { label: 'Telegram', url: 'https://t.me/a9globaltravel', icon: '📱', color: 'bg-sky-500 hover:bg-sky-600' },
  { label: 'Call', url: 'tel:+959694320111', icon: '📲', color: 'bg-emerald-500 hover:bg-emerald-600' },
];

export default function LiveChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Social links popup */}
      <div className={`flex flex-col gap-2 transition-all duration-300 ${
        open ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
      }`}>
        {SOCIAL_LINKS.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-medium shadow-lg transition-all duration-200 hover:shadow-xl ${item.color}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-gray-900 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
        aria-label="Live chat"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
