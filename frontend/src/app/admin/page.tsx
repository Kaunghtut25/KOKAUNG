// admin/page.tsx — /admin redirects to admin auth with token check
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { decodeTokenPayload, roleRank } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export default function AdminRootPage() {
  const { t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      const payload = decodeTokenPayload(token);
      // FIX 2026-08-16: allow any valid panel role (admin/staff/editor/viewer) —
      // only invalid/expired tokens go to login; exp is ms (login route signs Date.now()+86400000)
      if (payload && roleRank(payload.role) >= 0 && (!payload.exp || payload.exp > Date.now())) {
        router.replace("/admin/dashboard");
        return;
      }
    }
    router.replace("/auth/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
      <div className="text-[#D4AF37] text-lg animate-pulse">{t("admin.root.redirecting")}</div>
    </div>
  );
}