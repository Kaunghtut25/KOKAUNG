"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

/* FIX: 2026-08-08 audit - primary CTA below thumb zone on mobile; sticky bottom bar */
export default function MobileStickyCTA() {
  const { t } = useI18n();
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-[#D4AF37]/30 bg-[#0A1628]/95 backdrop-blur px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-stretch gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.25)]">
      <a
        href="tel:+959781617111"
        className="flex-[0.8] flex items-center justify-center gap-1.5 rounded-xl border border-[#D4AF37]/50 text-[#D4AF37] text-sm font-semibold py-3 min-h-[44px] active:scale-[0.98] transition-transform"
        aria-label="Call A9 Global Travels"
      >
        <span aria-hidden="true">📞</span>
        <span className="hidden xs:inline">Call</span>
      </a>
      <Link
        href="/book-now"
        className="flex-[1.2] flex items-center justify-center gap-1.5 rounded-xl bg-[#D4AF37] text-[#0A1628] text-sm font-bold py-3 min-h-[44px] active:scale-[0.98] transition-transform shadow-lg shadow-[#D4AF37]/20"
      >
        {t("nav.bookNow")} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
