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
    // Verify token contains admin role
    try {
      const payload = JSON.parse(atob(token));
      if (payload.role !== "admin") {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        router.replace("/auth/login");
        return;
      }
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
