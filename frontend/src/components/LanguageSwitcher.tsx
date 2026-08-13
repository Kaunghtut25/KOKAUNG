"use client";

import { useI18n } from "@/lib/i18n";

/* FIX: 2026-08-13 flag emojis do not render on Windows (Microsoft ships no
   flag glyphs, they appear as "US"/"MM" letters) — replaced with inline SVG
   flags that render identically on Windows/macOS/iOS/Android. */
const US_FLAG = (
  <svg viewBox="0 0 20 12" width="20" height="12" aria-hidden="true" focusable="false">
    <rect width="20" height="12" fill="#ffffff" />
    <g fill="#b22234">
      <rect y="0" width="20" height="0.92" />
      <rect y="1.85" width="20" height="0.92" />
      <rect y="3.69" width="20" height="0.92" />
      <rect y="5.54" width="20" height="0.92" />
      <rect y="7.38" width="20" height="0.92" />
      <rect y="9.23" width="20" height="0.92" />
      <rect y="11.08" width="20" height="0.92" />
    </g>
    <rect width="8" height="6.46" fill="#3c3b6e" />
    <g fill="#ffffff">
      <circle cx="1.33" cy="1.15" r="0.5" />
      <circle cx="4" cy="1.15" r="0.5" />
      <circle cx="6.67" cy="1.15" r="0.5" />
      <circle cx="1.33" cy="3.23" r="0.5" />
      <circle cx="4" cy="3.23" r="0.5" />
      <circle cx="6.67" cy="3.23" r="0.5" />
      <circle cx="1.33" cy="5.31" r="0.5" />
      <circle cx="4" cy="5.31" r="0.5" />
      <circle cx="6.67" cy="5.31" r="0.5" />
    </g>
  </svg>
);

const MM_FLAG = (
  <svg viewBox="0 0 20 12" width="20" height="12" aria-hidden="true" focusable="false">
    <rect width="20" height="4" fill="#fecb00" />
    <rect y="4" width="20" height="4" fill="#34b233" />
    <rect y="8" width="20" height="4" fill="#ea2839" />
    <path d="M10 3.5 L10.588 5.191 L12.378 5.228 L10.951 6.309 L11.47 8.022 L10 7 L8.53 8.022 L9.049 6.309 L7.622 5.228 L9.412 5.191 Z" fill="#ffffff" />
  </svg>
);

export default function LanguageSwitcher({ dark = true }: { dark?: boolean }) {
  const { lang, setLang } = useI18n();
  const base = dark
    ? "border-transparent text-white hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
    : "border-transparent text-gray-700 hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]";
  const active = "bg-[#D4AF37] border-[#D4AF37] text-[#0A1628]";
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setLang("en")}
        className={`flex items-center justify-center py-1.5 px-3 min-w-[48px] min-h-[48px] rounded-lg border transition-all duration-200 cursor-pointer ${lang === "en" ? active : base}`}
        aria-label="English (USA)"
        title="English"
      >
        <span aria-hidden="true" className="inline-flex overflow-hidden rounded-[2px] leading-none">{US_FLAG}</span>
      </button>
      <button
        onClick={() => setLang("mm")}
        className={`flex items-center justify-center py-1.5 px-3 min-w-[48px] min-h-[48px] rounded-lg border transition-all duration-200 cursor-pointer ${lang === "mm" ? active : base}`}
        aria-label="Myanmar (Burmese)"
        title="မြန်မာ"
      >
        <span aria-hidden="true" className="inline-flex overflow-hidden rounded-[2px] leading-none">{MM_FLAG}</span>
      </button>
    </div>
  );
}
