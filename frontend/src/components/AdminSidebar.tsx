"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "📊", path: "/admin/dashboard" },
  { label: "Manage Flights", icon: "✈️", path: "/admin/bookings" },
  { label: "Manage Tours", icon: "🏔️", path: "/admin/tours" },
  { label: "Manage Hotels", icon: "🏨", path: "/admin/hotels" },
  { label: "Manage Cars", icon: "🚗", path: "/admin/cars" },
  { label: "Manage Visas", icon: "🛂", path: "/admin/visas" },
  { label: "Manage Insurance", icon: "🛡️", path: "/admin/insurance" },
  { label: "Manage Cruises", icon: "🚢", path: "/admin/cruises" },
  { label: "Manage Blog", icon: "📝", path: "/admin/blog" },
  { label: "Bookings", icon: "📋", path: "/admin/bookings" },
  { label: "Site Settings", icon: "⚙️", path: "/admin/settings" },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<string>("");

  useEffect(() => {
    const user = localStorage.getItem("admin_user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setAdminUser(parsed.username || parsed.email || "Admin");
      } catch {
        setAdminUser(user);
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/auth/login");
  };

  const isActive = (path: string) => {
    if (path === "/admin/dashboard") {
      return pathname === "/admin/dashboard";
    }
    return pathname.startsWith(path);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gold/20">
        <h1
          className="text-2xl font-bold text-gold tracking-wider"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          A9 ADMIN
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-gold/15 text-gold border-l-2 border-gold"
                    : "text-white/70 hover:bg-gold/10 hover:text-white border-l-2 border-transparent"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className={`${collapsed && !mobileOpen ? "hidden" : "block"}`}>
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        {/* Admin User */}
        {adminUser && (
          <div className="px-4 py-2 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold flex-shrink-0">
              {adminUser.charAt(0).toUpperCase()}
            </span>
            <div className={`${collapsed && !mobileOpen ? "hidden" : "block"} overflow-hidden`}>
              <p className="text-white/80 text-sm font-medium truncate">{adminUser}</p>
              <p className="text-white/30 text-[10px]">Administrator</p>
            </div>
          </div>
        )}
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-md text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm"
        >
          <span>🏠</span>
          <span className={`${collapsed && !mobileOpen ? "hidden" : "block"}`}>
            Back to Site
          </span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all text-sm w-full text-left"
        >
          <span>🚪</span>
          <span className={`${collapsed && !mobileOpen ? "hidden" : "block"}`}>
            Logout
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-deepblue-dark border border-gold/30 rounded-lg p-2 text-gold"
      >
        <span className="text-xl">{mobileOpen ? "✕" : "☰"}</span>
      </button>

      {/* Sidebar - desktop */}
      <aside
        className={`hidden md:flex flex-col fixed top-0 left-0 h-full bg-deepblue-dark border-r border-gold/30 z-30 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-gold text-deepblue-dark flex items-center justify-center text-xs font-bold shadow-lg hover:bg-gold/80 transition-colors"
        >
          {collapsed ? "→" : "←"}
        </button>
        {sidebarContent}
      </aside>

      {/* Sidebar - mobile */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-deepblue-dark border-r border-gold/30 z-50 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
