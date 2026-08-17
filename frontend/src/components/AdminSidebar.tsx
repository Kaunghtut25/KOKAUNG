"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";
import { decodeTokenPayload, roleRank, sectionsForPath } from "@/lib/auth";

interface NavItem {
  labelKey: string;
  icon: string;
  path: string;
  section?: string;
}

const navItems: NavItem[] = [
  { labelKey: "admin.dashboard", icon: "📊", path: "/admin/dashboard" },
  { labelKey: "admin.manageFlights", icon: "✈️", path: "/admin/bookings", section: "services" },
  { labelKey: "admin.manageTours", icon: "🏔️", path: "/admin/tours", section: "services" },
  { labelKey: "admin.manageDestinations", icon: "🌍", path: "/admin/destinations", section: "services" },
  { labelKey: "admin.manageHotels", icon: "🏨", path: "/admin/hotels", section: "services" },
  { labelKey: "admin.manageCars", icon: "🚗", path: "/admin/cars", section: "services" },
  { labelKey: "admin.manageVisas", icon: "🛂", path: "/admin/visas", section: "services" },
  { labelKey: "admin.manageInsurance", icon: "🛡️", path: "/admin/insurance", section: "services" },
  { labelKey: "admin.manageCruises", icon: "🚢", path: "/admin/cruises", section: "services" },
  { labelKey: "admin.skyLounge", icon: "✨", path: "/admin/sky-lounge", section: "services" },
  { labelKey: "admin.manageBlog", icon: "📝", path: "/admin/blog", section: "content" },
  { labelKey: "admin.manageAbout", icon: "📄", path: "/admin/about", section: "content" },
  { labelKey: "admin.knowledge", icon: "🧠", path: "/admin/knowledge", section: "content" },
  { labelKey: "admin.siteManager", icon: "🛠️", path: "/admin/site-manager", section: "system" },
  { labelKey: "admin.siteSettings", icon: "🔧", path: "/admin/settings", section: "system" },
  { labelKey: "admin.manageUsers", icon: "👥", path: "/admin/users", section: "system" },
  { labelKey: "admin.auditLog", icon: "🔍", path: "/admin/audit-log", section: "system" },
];

const navSections: { key: string; labelKey: string }[] = [
  { key: "services", labelKey: "admin.section.services" },
  { key: "content", labelKey: "admin.section.content" },
  { key: "system", labelKey: "admin.section.system" },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<string>("");
  const [adminRole, setAdminRole] = useState<string>("");
  const [role, setRole] = useState<string>("admin");
  const [auths, setAuths] = useState<string[]>([]);

  useEffect(() => {
    // FIX: 2026-08-04 admin-users-v3 — show LIVE user data from the API,
    // not the stale localStorage snapshot captured at login time.
    const snapshot = localStorage.getItem("admin_user");
    const setFrom = (u: any) => {
      setAdminUser(u?.name || u?.email || "Admin");
      if (u?.role) setAdminRole(u.role);
    };
    if (snapshot) {
      try { setFrom(JSON.parse(snapshot)); } catch { setAdminUser(snapshot); }
    }
    const token = localStorage.getItem("admin_token");
    if (token) {
      fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((users) => {
          if (!Array.isArray(users) || users.length === 0) return;
          let snap: any = {};
          try { snap = JSON.parse(snapshot || "{}"); } catch { /* ignore */ }
          const row =
            users.find((u: any) => u.email === snap.email) ||
            users.find((u: any) => u.isPrimary) ||
            users[0];
          if (row) setFrom(row);
        })
        .catch(() => { /* keep snapshot fallback */ });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      const p = decodeTokenPayload(token);
      if (p?.role && roleRank(p.role) >= 0) {
        setRole(p.role);
        setAdminRole(p.role);
        if (Array.isArray(p.authorities)) setAuths(p.authorities);
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

  const rank = roleRank(role);
  const canSee = (path: string) => {
    // FIX 2026-08-17: also respect Section Access (authorities) from the token
    const secs = sectionsForPath(path);
    const hasSec = rank >= 3 || secs.length === 0 || auths.length === 0 || auths.some((a) => secs.includes(a));
    // Admin-only: user management + site settings
    if (path === "/admin/users" || path === "/admin/settings" || path === "/admin/audit-log") return rank >= 3;
    // Editor+: site manager (content editing)
    if (path === "/admin/site-manager") return rank >= 1 && hasSec;
    // Staff+: bookings management
    if (path === "/admin/bookings") return rank >= 2 && hasSec;
    // Viewer+: content pages (read-only for viewer) within granted sections
    return rank >= 0 && hasSec;
  };

  const isActive = (path: string) => {
    if (path === "/admin/dashboard") {
      return pathname === "/admin/dashboard";
    }
    return pathname.startsWith(path);
  };

  const renderItem = (item: NavItem) => (
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
          {t(item.labelKey)}
        </span>
      </Link>
    </li>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gold/20">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <Image alt="A9 Travel" className="w-10 h-10 rounded-lg object-cover border border-gold/30 flex-shrink-0" src="/logo.jpeg" width={1600} height={900} sizes="100vw" />
          <div className={`${collapsed && !mobileOpen ? "hidden" : "block"}`}>
            <div
              className="text-xl font-bold text-gold tracking-wider leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              A9 Travel
            </div>
            <p className="text-white/50 text-[10px] tracking-wider">ADMIN PANEL</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navItems.filter((item) => canSee(item.path) && !item.section).map(renderItem)}
          {navSections.map((sec) => {
            const items = navItems.filter((item) => canSee(item.path) && item.section === sec.key);
            if (items.length === 0) return null;
            return (
              <React.Fragment key={sec.key}>
                <li className="pt-3 pb-1">
                  <span className={`px-4 text-[10px] font-semibold uppercase tracking-wider text-gold/50 ${collapsed && !mobileOpen ? "hidden" : "block"}`}>
                    {t(sec.labelKey)}
                  </span>
                </li>
                {items.map(renderItem)}
              </React.Fragment>
            );
          })}
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
              <p className="text-white/50 text-[10px] capitalize">{adminRole || "Administrator"}</p>
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
