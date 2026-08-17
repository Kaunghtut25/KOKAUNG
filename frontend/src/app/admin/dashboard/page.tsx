"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n";

interface DashboardStats {
  totalTours: number;
  totalHotels: number;
  totalCars: number;
  totalVisas: number;
  totalInsurances: number;
  totalCruises: number;
  totalBlogPosts: number;
  totalBookings: number;
  totalInquiries: number;
  revenueMMK: number;
  pendingPayments: number;
}

interface RecentBooking {
  id: string;
  customerName: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

const statCards = [
  { key: "totalTours", labelKey: "admin.dash.totalTours", icon: "🏔️" },
  { key: "totalHotels", labelKey: "admin.dash.totalHotels", icon: "🏨" },
  { key: "totalCars", labelKey: "admin.dash.totalCars", icon: "🚗" },
  { key: "totalVisas", labelKey: "admin.dash.visaServices", icon: "🛂" },
  { key: "totalInsurances", labelKey: "admin.dash.insurancePlans", icon: "🛡️" },
  { key: "totalCruises", labelKey: "admin.dash.cruisePackages", icon: "🚢" },
  { key: "totalBlogPosts", labelKey: "admin.dash.blogPosts", icon: "📝" },
  { key: "totalBookings", labelKey: "admin.dash.totalBookings", icon: "📋" },
  { key: "totalInquiries", labelKey: "admin.dash.inquiries", icon: "💬" },
  { key: "revenueMMK", labelKey: "admin.dash.revenueMmk", icon: "💰", format: true },
  { key: "pendingPayments", labelKey: "admin.dash.pendingPayments", icon: "⏳", format: true },
];

export default function AdminDashboardPage() {
  const { t } = useI18n();
  const [stats, setStats] = useState<DashboardStats>({
    totalTours: 0,
    totalHotels: 0,
    totalCars: 0,
    totalVisas: 0,
    totalInsurances: 0,
    totalCruises: 0,
    totalBlogPosts: 0,
    totalBookings: 0,
    totalInquiries: 0,
    revenueMMK: 0,
    pendingPayments: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const [statsRes, bookingsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/admin/bookings?limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        // Map API field names to dashboard interface
        setStats({
          totalTours: statsData.totalTours ?? statsData.tours ?? 0,
          totalHotels: statsData.totalHotels ?? statsData.hotels ?? 0,
          totalCars: statsData.totalCars ?? statsData.cars ?? 0,
          totalVisas: statsData.totalVisas ?? statsData.visas ?? 0,
          totalInsurances: statsData.totalInsurances ?? statsData.insurances ?? 0,
          totalCruises: statsData.totalCruises ?? statsData.cruises ?? 0,
          totalBlogPosts: statsData.totalBlogPosts ?? statsData.blog ?? 0,
          totalBookings: statsData.totalBookings ?? statsData.bookings ?? 0,
          totalInquiries: statsData.totalInquiries ?? statsData.inquiries ?? 0,
          revenueMMK: statsData.revenueMMK ?? 0,
          pendingPayments: statsData.pendingPayments ?? 0,
        });
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setRecentBookings(
          Array.isArray(bookingsData) ? bookingsData : bookingsData.bookings || []
        );
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const formatNumber = (n: number) =>
    new Intl.NumberFormat("en-US").format(n);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { className: string; label: string }> = {
      pending: {
        className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        label: t("admin.dash.pending"),
      },
      paid: {
        className: "bg-green-500/20 text-green-400 border-green-500/30",
        label: t("admin.dash.paid"),
      },
      completed: {
        className: "bg-green-500/20 text-green-400 border-green-500/30",
        label: t("admin.dash.completed"),
      },
      confirmed: {
        className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        label: t("admin.dash.confirmed"),
      },
      cancelled: {
        className: "bg-red-500/20 text-red-400 border-red-500/30",
        label: t("admin.dash.cancelled"),
      },
    };
    const s = map[status] || {
      className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      label: status,
    };
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${s.className}`}
      >
        {s.label}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    const map: Record<string, string> = {
      tour: "🏔️",
      hotel: "🏨",
      car: "🚗",
      visa: "🛂",
      insurance: "🛡️",
      cruise: "🚢",
    };
    return map[type?.toLowerCase()] || "📋";
  };

  const quickActions = [
    { labelKey: "admin.dash.addTour", icon: "🏔️", href: "/admin/tours" },
    { labelKey: "admin.dash.addHotel", icon: "🏨", href: "/admin/hotels" },
    { labelKey: "admin.dash.addCar", icon: "🚗", href: "/admin/cars" },
    { labelKey: "admin.dash.addVisa", icon: "🛂", href: "/admin/visas" },
    { labelKey: "admin.dash.addInsurance", icon: "🛡️", href: "/admin/insurance" },
    { labelKey: "admin.dash.addCruise", icon: "🚢", href: "/admin/cruises" },
    { labelKey: "admin.dash.newBlog", icon: "📝", href: "/admin/blog" },
    { labelKey: "admin.dash.viewSettings", icon: "⚙️", href: "/admin/settings" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gold/70 animate-pulse text-lg">{t("admin.dash.loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ─── Hero / Header ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A1628] via-[#0d1f3c] to-[#0A1628] border border-white/10 p-8 md:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#D4AF37] via-[#F0D060] to-[#D4AF37] bg-clip-text text-transparent pb-1">
            {t("admin.dash.title")}
          </h1>
          <p className="text-white/50 mt-2 text-lg font-light tracking-wide">
            {t("admin.dash.subtitle")}
          </p>
        </div>
      </div>

      {/* ─── Stats Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const value = stats[card.key as keyof DashboardStats];
          return (
            <div
              key={card.key}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-gold/40 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[32px] leading-none">{card.icon}</span>
                <span className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-semibold">
                  {t(card.labelKey)}
                </span>
              </div>
              <div className="text-2xl font-bold text-gold group-hover:text-[#F0D060] transition-colors">
                {card.format && value > 0
                  ? `${formatNumber(value)} Ks`
                  : formatNumber(value)}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Quick Actions ─── */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">{t("admin.dash.quickActions")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <a
              key={action.labelKey}
              href={action.href}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/40 hover:bg-white/[0.07] transition-all duration-300 group text-center"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <span className="text-white/70 text-xs font-medium group-hover:text-gold transition-colors">
                {t(action.labelKey)}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* ─── Recent Bookings ─── */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">{t("admin.dash.recentBookings")}</h2>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">
                    {t("admin.dash.bookingId")}
                  </th>
                  <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">
                    {t("admin.dash.customer")}
                  </th>
                  <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">
                    {t("admin.dash.type")}
                  </th>
                  <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">
                    {t("admin.dash.amount")}
                  </th>
                  <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">
                    {t("admin.dash.status")}
                  </th>
                  <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">
                    {t("admin.dash.date")}
                  </th>
                  <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">
                    {t("admin.dash.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-10 text-center text-white/50"
                    >
                      <span className="text-3xl block mb-2">📋</span>
                      {t("admin.dash.noRecent")}
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-white/5 hover:bg-white/[0.04] transition-colors"
                    >
                      <td className="p-4 text-white font-mono text-xs">
                        #{booking.id?.slice(0, 8)}
                      </td>
                      <td className="p-4 text-white/80 font-medium">
                        {booking.customerName}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 text-white/70">
                          <span className="text-base">{getTypeIcon(booking.type)}</span>
                          <span className="capitalize">{booking.type}</span>
                        </span>
                      </td>
                      <td className="p-4 text-white font-medium">
                        {formatNumber(booking.amount)}{" "}
                        <span className="text-white/60 text-xs">{booking.currency || "MMK"}</span>
                      </td>
                      <td className="p-4">{getStatusBadge(booking.status)}</td>
                      <td className="p-4 text-white/50 text-xs">
                        {new Date(booking.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4">
                        <button className="text-gold hover:text-gold/80 text-sm font-medium transition-colors hover:underline underline-offset-4">
                          {t("admin.dash.viewDetails")}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── Revenue Overview ─── */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">{t("admin.dash.revenue")}</h2>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
          <span className="text-5xl mb-4 block">📈</span>
          <p className="text-white/50 text-lg">{t("admin.dash.chartSoon")}</p>
          <p className="text-white/50 text-sm mt-1">
            {t("admin.dash.chartText")}
          </p>
        </div>
      </div>
    </div>
  );
}
