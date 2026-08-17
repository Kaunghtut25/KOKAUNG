"use client";

import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

// FIX 2026-08-17: self-registration closed — admins create accounts via /admin/users.
export default function RegisterPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A1628] via-[#0F1F3D] to-[#0A1628] px-4 py-12">
      <div className="glass-card w-full max-w-md p-8 sm:p-10">
        <div className="flex justify-end -mb-4">
          <LanguageSwitcher dark={false} />
        </div>

        <div className="text-center mb-8">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">
              {t("auth.register.title")}
            </span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base">
            {t("auth.register.subtitle")}
          </p>
        </div>

        <div className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-6 text-center">
          <div className="text-3xl mb-3">🔒</div>
          <p className="text-white font-semibold text-base mb-2">{t("auth.register.closed")}</p>
          <p className="text-white/60 text-sm leading-relaxed">{t("auth.register.closedHint")}</p>
        </div>

        <p className="text-center text-white/50 text-sm mt-6">
          {t("auth.register.haveAccount")}{" "}
          <Link
            href="/auth/login"
            className="text-[#D4AF37] hover:text-[#F5A623] font-medium transition-colors"
          >
            {t("auth.register.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
