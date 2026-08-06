"use client";

import { useI18n } from "@/lib/i18n";

export default function LanguageSwitcher({ dark = true }: { dark?: boolean }) {
  const { lang, setLang } = useI18n();
  const base = dark
    ? "border-white/20 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]"
    : "border-gray-300 text-gray-700 hover:border-[#D4AF37] hover:text-[#D4AF37]";
  const active = "bg-[#D4AF37] text-[#0A1628] border-[#D4AF37] font-bold";
  return (
    <div className={`flex items-center rounded-full border ${dark ? "border-white/20" : "border-gray-300"} overflow-hidden text-xs`}>
      <button
        onClick={() => setLang("en")}
        className={`flex items-center justify-center px-2.5 py-1.5 text-base leading-none transition-all ${lang === "en" ? active : base}`}
        aria-label="English (USA)"
        title="English"
      >
        <span aria-hidden="true">🇺🇸</span>
      </button>
      <button
        onClick={() => setLang("mm")}
        className={`flex items-center justify-center px-2.5 py-1.5 text-base leading-none transition-all ${lang === "mm" ? active : base}`}
        aria-label="Myanmar (Burmese)"
        title="မြန်မာ"
      >
        <span aria-hidden="true">🇲🇲</span>
      </button>
    </div>
  );
}
