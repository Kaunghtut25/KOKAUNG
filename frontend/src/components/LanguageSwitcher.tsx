"use client";

import { useI18n } from "@/lib/i18n";

export default function LanguageSwitcher({ dark = true }: { dark?: boolean }) {
  const { lang, setLang } = useI18n();
  const base = dark
    ? "border-transparent text-white hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
    : "border-transparent text-gray-700 hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]";
  const active = "bg-[#D4AF37] border-[#D4AF37] text-[#0A1628]";
  /* FIX: 2026-08-07 square service-button style switcher */
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setLang("en")}
        className={`flex items-center justify-center py-1.5 px-3 rounded-lg border transition-all duration-200 cursor-pointer ${lang === "en" ? active : base}`}
        aria-label="English (USA)"
        title="English"
      >
        <span aria-hidden="true" className="text-sm leading-none">🇺🇸</span>
      </button>
      <button
        onClick={() => setLang("mm")}
        className={`flex items-center justify-center py-1.5 px-3 rounded-lg border transition-all duration-200 cursor-pointer ${lang === "mm" ? active : base}`}
        aria-label="Myanmar (Burmese)"
        title="မြန်မာ"
      >
        <span aria-hidden="true" className="text-sm leading-none">🇲🇲</span>
      </button>
    </div>
  );
}
