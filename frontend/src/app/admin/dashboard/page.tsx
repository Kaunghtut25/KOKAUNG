"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Booking } from "@/lib/api";

interface DashboardStats {
  totalTours: number;
  totalHotels: number;
  totalCars: number;
  totalBookings: number;
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
  { key: "totalTours", label: "Total Tours", icon: "✈️" },
  { key: "totalHotels", label: "Total Hotels", icon: "🏨" },
  { key: "totalCars", label: "Total Cars", icon: "🚗" },
  { key: "totalBookings", label: "Total Bookings", icon: "📋" },
  { key: "revenueMMK", label: "Revenue (MMK)", icon: "💰", format: true },
  { key: "pendingPayments", label: "Pending Payments", icon: "⏳", format: true },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTours: 0,
    totalHotels: 0,
    totalCars: 0,
    totalBookings: 0,
    revenueMMK: 0,
    pendingPayments: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const [statsRes, bookingsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/admin/bookings?limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
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
    new Intl.NumberFormat("en-MM").format(n);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { className: string; label: string }> = {
      pending: {
        className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        label: "Pending",
      },
      paid: {
        className: "bg-green-500/20 text-green-400 border-green-500/30",
        label: "Paid",
      },
      completed: {
        className: "bg-green-500/20 text-green-400 border-green-500/30",
        label: "Completed",
      },
      confirmed: {
        className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        label: "Confirmed",
      },
      cancelled: {
        className: "bg-red-500/20 text-red-400 border-red-500/30",
        label: "Cancelled",
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
      tour: "✈️",
      hotel: "🏨",
      car: "🚗",
      visa: "🛂",
      insurance: "🛡️",
    };
    return map[type?.toLowerCase()] || "📋";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gold/70 animate-pulse text-lg">Loading dashboard...</div>
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
            Admin Dashboard
          </h1>
          <p className="text-white/50 mt-2 text-lg font-light tracking-wide">
            Manage your travel empire
          </p>
        </div>
      </div>

      {/* ─── Stats Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const value = stats[card.key as keyof DashboardStats];
          return (
            <div
              key={card.key}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-gold/40 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[32px] leading-none">{card.icon}</span>
                <span className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-semibold">
                  {card.label}
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

      {/* ─── Recent Bookings ─── */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Recent Bookings</h2>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                    Booking ID
                  </th>
                  <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                    Customer
                  </th>
                  <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                    Type
                  </th>
                  <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                    Amount
                  </th>
                  <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                    Status
                  </th>
                  <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                    Date
                  </th>
                  <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-10 text-center text-white/30"
                    >
                      <span className="text-3xl block mb-2">📋</span>
                      No recent bookings found.
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
                        <span className="text-white/40 text-xs">{booking.currency || "MMK"}</span>
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
                          View Details
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
        <h2 className="text-xl font-bold text-white mb-4">Revenue Overview</h2>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
          <span className="text-5xl mb-4 block">📈</span>
          <p className="text-white/50 text-lg">Chart coming soon</p>
          <p className="text-white/30 text-sm mt-1">
            Revenue analytics visualization will be available in a future update.
          </p>
        </div>
      </div>
    </div>
  );
}
