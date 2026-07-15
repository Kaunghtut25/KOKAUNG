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
      // Token is base64 JSON
      const decoded = JSON.parse(atob(token));
      if (decoded.role !== "admin" || (decoded.exp && decoded.exp < Date.now())) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        router.replace("/auth/login");
        return;
      }
      // Set cookie for middleware (expires in 24h)
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
