"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }
    try {
      // Decode base64 token — handle both atob and Buffer formats
      let decoded: any;
      try {
        // Try browser's atob first
        const binary = atob(token);
        // Handle UTF-8 encoding
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const jsonStr = new TextDecoder("utf-8").decode(bytes);
        decoded = JSON.parse(jsonStr);
      } catch {
        // Fallback: try direct JSON parse (in case token is already JSON)
        decoded = JSON.parse(token);
      }

      if (decoded.role !== "admin" || (decoded.exp && decoded.exp < Date.now())) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        router.replace("/auth/login");
        return;
      }
      // Set cookie for middleware
      document.cookie = `a9_admin_token=${token}; path=/; max-age=86400; samesite=lax`;
      setAuthorized(true);
    } catch {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      router.replace("/auth/login");
    }
  }, [router]);

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
        {children}
      </main>
    </div>
  );
}
