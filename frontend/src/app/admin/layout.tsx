"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

function AdminErrorFallback() {
  return (
    <div className="min-h-screen bg-deepblue flex items-center justify-center">
      <div className="text-center max-w-md p-8">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-white/50 text-sm mb-6">
          A client-side error occurred while loading this admin page. 
          This may be caused by outdated data or a network issue.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 transition-all"
        >
          Reload Page
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
      try {
        // Decode base64 token
        let decoded: any;
        try {
          const binary = atob(token);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          const jsonStr = new TextDecoder("utf-8").decode(bytes);
          decoded = JSON.parse(jsonStr);
        } catch {
          decoded = JSON.parse(token);
        }

        if (decoded.role !== "admin" || (decoded.exp && decoded.exp < Date.now())) {
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
      } catch {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        router.replace("/auth/login");
      }
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
        <div className="text-gold text-lg animate-pulse">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deepblue">
      <AdminSidebar />
      <main className="md:ml-64 transition-all duration-300 min-h-screen p-6 md:p-8">
        <AdminErrorBoundary>
          {children}
        </AdminErrorBoundary>
      </main>
    </div>
  );
}
