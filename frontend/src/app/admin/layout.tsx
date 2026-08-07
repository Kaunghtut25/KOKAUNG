"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeTokenPayload } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";
import { LanguageProvider } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NarrowView from "@/components/NarrowView";
import { useI18n } from "@/lib/i18n";

function AdminErrorFallback() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-deepblue flex items-center justify-center">
      <div className="text-center max-w-md p-8">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-white mb-2">{t("admin.layout.errTitle")}</h2>
        <p className="text-white/50 text-sm mb-6">
          {t("admin.layout.errBody")}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 transition-all"
        >
          {t("admin.layout.reload")}
        </button>
      </div>
    </div>
  );
}

class AdminErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[AdminErrorBoundary] Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <AdminErrorFallback />;
    }
    return this.props.children;
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.replace("/auth/login");
        return;
      }
      const payload = decodeTokenPayload(token);
      if (!payload || payload.role !== "admin" || (payload.exp && payload.exp < Date.now())) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        router.replace("/auth/login");
        return;
      }
      // Set cookie for middleware
      try {
        document.cookie = `a9_admin_token=${token}; path=/; max-age=86400; samesite=lax`;
      } catch {}
      setAuthorized(true);
    } catch (e: any) {
      console.error("[AdminLayout] Auth check error:", e);
      setError(e?.message || "Authentication error");
    }
  }, [router]);

  if (error) {
    return <AdminErrorFallback />;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-deepblue flex items-center justify-center">
        <div className="text-gold text-lg animate-pulse">{t("admin.layout.checking")}</div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-deepblue">
        <NarrowView />
        <AdminSidebar />
        <main className="xl:ml-64 transition-all duration-300 min-h-screen p-6 md:p-8">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher dark={false} />
          </div>
          <AdminErrorBoundary>
            {children}
          </AdminErrorBoundary>
        </main>
      </div>
    </LanguageProvider>
  );
}
