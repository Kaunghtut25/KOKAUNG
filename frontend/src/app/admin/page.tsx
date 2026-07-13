// admin/page.tsx — /admin redirects to admin auth with token check
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token));
        if (payload.role === "admin") {
          router.replace("/admin/dashboard");
          return;
        }
      } catch {}
    }
    router.replace("/auth/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
      <div className="text-[#D4AF37] text-lg animate-pulse">Redirecting...</div>
    </div>
  );
}