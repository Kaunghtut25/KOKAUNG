"use client";

import React, { useEffect, useState, useCallback } from "react";

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  type: string;
  itemName: string;
  itemId: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  bookingStatus: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  travelDate?: string;
  guests?: number;
}

interface BookingInquiry {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  travelType: string;
  fromAirport: string;
  toAirport: string;
  departDate: string;
  returnDate: string;
  passengers: number;
  travelClass: string;
  specialRequests: string;
  contactPreference: string;
  status: string;
  referenceNumber: string;
  createdAt: string;
  airline?: string;
  airlineCode?: string;
  flightNo?: string;
  departTime?: string;
  arriveTime?: string;
  stops?: string;
  offerId?: string;
  clientType?: string;
  tripType?: string;
  itemName?: string;
  amount?: number;
  currency?: string;
}

type ActiveTab = "bookings" | "inquiries";

// Use the Next.js API routes directly (relative URLs work in dev & production)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

type StatusFilter = "all" | "pending" | "paid" | "cancelled" | "completed";
type InquiryStatusFilter = "all" | "New" | "Contacted" | "Confirmed" | "Cancelled";

export default function AdminBookingsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("bookings");

  // ─── Bookings state (existing) ───
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingLoading, setBookingLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [detailsModal, setDetailsModal] = useState<Booking | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // ─── Inquiries state ───
  const [inquiries, setInquiries] = useState<BookingInquiry[]>([]);
  const [inquiryLoading, setInquiryLoading] = useState(true);
  const [inquiryFilter, setInquiryFilter] = useState<InquiryStatusFilter>("all");
  const [inquiryPage, setInquiryPage] = useState(1);
  const [inquiryTotalPages, setInquiryTotalPages] = useState(1);
  const [inquiryModal, setInquiryModal] = useState<BookingInquiry | null>(null);
  const [updatingInquiryId, setUpdatingInquiryId] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  // ─── Fetch bookings ───
  const fetchBookings = useCallback(async () => {
    setBookingLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`${API_BASE}/api/admin/bookings?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : data.bookings || data.data || []);
        setTotalPages(data.totalPages || data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setBookingLoading(false);
    }
  }, [token, page, statusFilter]);

  // ─── Fetch inquiries from Next.js API route ───
  const fetchInquiries = useCallback(async () => {
    setInquiryLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(inquiryPage));
      params.set("limit", String(limit));
      if (inquiryFilter !== "all") params.set("status", inquiryFilter);
      const res = await fetch(`${API_BASE}/api/booking-receiver?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.data || []);
        setInquiryTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
    } finally {
      setInquiryLoading(false);
    }
  }, [inquiryPage, inquiryFilter]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);
  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);
  useEffect(() => { setPage(1); }, [statusFilter]);
  useEffect(() => { setInquiryPage(1); }, [inquiryFilter]);

  // ─── Update inquiry status ───
  const handleInquiryStatusUpdate = async (inquiryId: string, newStatus: string) => {
    setUpdatingInquiryId(inquiryId);
    try {
      const res = await fetch(`${API_BASE}/api/booking-receiver/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchInquiries();
        if (inquiryModal?._id === inquiryId) {
          setInquiryModal((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setUpdatingInquiryId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      New: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      Confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
      Cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      paid: "bg-green-500/20 text-green-400 border-green-500/30",
      completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    };
    const cls = map[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>{status}</span>;
  };

  const getTypeIcon = (type: string) => {
    const map: Record<string, string> = {
      flight: "\u2708\uFE0F", hotel: "\uD83C\uDFE8", tour: "\uD83C\uDF0F",
      car: "\uD83D\uDE97", visa: "\uD83D\uDEE2", insurance: "\uD83D\uDEE1\uFE0F",
    };
    return map[type?.toLowerCase()] || "\uD83D\uDCCB";
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const inquiryStatusOptions = ["New", "Contacted", "Confirmed", "Cancelled"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Bookings & Inquiries</h1>
        <p className="text-white/40 text-sm mt-1">Track and manage bookings and customer inquiries</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/10 w-fit">
        {(["bookings", "inquiries"] as ActiveTab[]).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize ${activeTab === tab ? "bg-gold text-deepblue" : "text-white/50 hover:text-white"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ══════════════ BOOKINGS TAB ══════════════ */}
      {activeTab === "bookings" && (
        <>
          {/* Status filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {(["all", "pending", "paid", "cancelled", "completed"] as StatusFilter[]).map((f) => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 capitalize ${statusFilter === f ? "bg-gold/20 text-gold border-gold/40" : "bg-white/5 text-white/50 border-white/10 hover:border-gold/30"}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Booking ID</th>
                    <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Customer</th>
                    <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Type</th>
                    <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Item</th>
                    <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Payment</th>
                    <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                    <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Date</th>
                    <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingLoading ? (
                    <tr><td colSpan={8} className="p-10 text-center text-white/30"><span className="animate-pulse">Loading bookings...</span></td></tr>
                  ) : bookings.length === 0 ? (
                    <tr><td colSpan={8} className="p-10 text-center text-white/30">No bookings found.</td></tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors">
                        <td className="p-4 text-white font-mono text-xs">#{b.id?.slice(0, 8)}</td>
                        <td className="p-4 text-white/80 font-medium">{b.customerName}</td>
                        <td className="p-4 text-white/70 capitalize">{b.type}</td>
                        <td className="p-4 text-white/80">{b.itemName}</td>
                        <td className="p-4">{getStatusBadge(b.paymentStatus)}</td>
                        <td className="p-4">{getStatusBadge(b.bookingStatus)}</td>
                        <td className="p-4 text-white/50 text-xs">{formatDate(b.createdAt)}</td>
                        <td className="p-4">
                          <button onClick={() => setDetailsModal(b)} className="px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-colors">View</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-white/10">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed">\u2190 Previous</button>
                <span className="text-white/50 text-sm">Page {page} of {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed">Next \u2192</button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ══════════════ INQUIRIES TAB ══════════════ */}
      {activeTab === "inquiries" && (
        <>
          {/* Inquiry status filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {(["all", "New", "Contacted", "Confirmed", "Cancelled"] as InquiryStatusFilter[]).map((f) => (
              <button key={f} onClick={() => setInquiryFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${inquiryFilter === f ? "bg-gold/20 text-gold border-gold/40" : "bg-white/5 text-white/50 border-white/10 hover:border-gold/30"}`}>
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Date</th>
                    <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Ref #</th>
                    <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Name</th>
                    <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Email</th>
                    <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Phone</th>
                    <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Travel Type</th>
                    <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Route</th>
                    <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                    <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiryLoading ? (
                    <tr><td colSpan={9} className="p-10 text-center text-white/30"><span className="animate-pulse">Loading inquiries...</span></td></tr>
                  ) : inquiries.length === 0 ? (
                    <tr><td colSpan={9} className="p-10 text-center text-white/30">No inquiries found.</td></tr>
                  ) : (
                    inquiries.map((inq) => (
                      <tr key={inq._id} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors">
                        <td className="p-4 text-white/50 text-xs">{formatDate(inq.createdAt)}</td>
                        <td className="p-4 text-gold font-mono text-xs">{inq.referenceNumber}</td>
                        <td className="p-4 text-white/80 font-medium">{inq.fullName}</td>
                        <td className="p-4 text-white/60 text-xs">{inq.email}</td>
                        <td className="p-4 text-white/60">{inq.phone}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 text-white/70 capitalize">
                            <span>{getTypeIcon(inq.travelType)}</span> {inq.travelType}
                          </span>
                        </td>
                        <td className="p-4 text-white/60 text-xs">
                          {inq.fromAirport && inq.toAirport ? `${inq.fromAirport} \u2192 ${inq.toAirport}` : inq.fromAirport || inq.toAirport || "\u2014"}
                        </td>
                        <td className="p-4">{getStatusBadge(inq.status)}</td>
                        <td className="p-4">
                          <button onClick={() => setInquiryModal(inq)} className="px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-colors">View</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {inquiryTotalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-white/10">
                <button onClick={() => setInquiryPage((p) => Math.max(1, p - 1))} disabled={inquiryPage <= 1} className="px-3 py-1.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed">\u2190 Previous</button>
                <span className="text-white/50 text-sm">Page {inquiryPage} of {inquiryTotalPages}</span>
                <button onClick={() => setInquiryPage((p) => Math.min(inquiryTotalPages, p + 1))} disabled={inquiryPage >= inquiryTotalPages} className="px-3 py-1.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed">Next \u2192</button>
              </div>
            )}
          </div>

          {/* Inquiry Details Modal */}
          {inquiryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setInquiryModal(null)} />
              <div className="relative bg-deepblue-dark border border-white/10 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto z-10">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-deepblue-dark z-10">
                  <h2 className="text-xl font-bold text-gold">Inquiry Details</h2>
                  <button onClick={() => setInquiryModal(null)} className="text-white/50 hover:text-white transition-colors text-2xl leading-none">\u2715</button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="text-white/40 text-xs uppercase tracking-wider">Reference</span><p className="text-gold font-mono">{inquiryModal.referenceNumber}</p></div>
                    <div><span className="text-white/40 text-xs uppercase tracking-wider">Date</span><p className="text-white">{new Date(inquiryModal.createdAt).toLocaleString()}</p></div>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="text-white/50 text-xs uppercase tracking-wider mb-2">Customer Info</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div><span className="text-white/40 text-xs">Name</span><p className="text-white">{inquiryModal.fullName}</p></div>
                      <div><span className="text-white/40 text-xs">Email</span><p className="text-white break-all">{inquiryModal.email}</p></div>
                      <div><span className="text-white/40 text-xs">Phone</span><p className="text-white">{inquiryModal.phone}</p></div>
                      <div><span className="text-white/40 text-xs">Contact Preference</span><p className="text-white capitalize">{inquiryModal.contactPreference}</p></div>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="text-white/50 text-xs uppercase tracking-wider mb-2">Travel Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div><span className="text-white/40 text-xs">Travel Type</span><p className="text-white capitalize">{inquiryModal.travelType}</p></div>
                      <div><span className="text-white/40 text-xs">Trip Type</span><p className="text-white capitalize">{inquiryModal.tripType || "\u2014"}</p></div>
                      <div><span className="text-white/40 text-xs">Travel Class</span><p className="text-white">{inquiryModal.travelClass || "\u2014"}</p></div>
                      <div><span className="text-white/40 text-xs">Client Type</span><p className="text-white capitalize">{inquiryModal.clientType || "local"}</p></div>
                      {inquiryModal.fromAirport && <div><span className="text-white/40 text-xs">From</span><p className="text-white">{inquiryModal.fromAirport}</p></div>}
                      {inquiryModal.toAirport && <div><span className="text-white/40 text-xs">To</span><p className="text-white">{inquiryModal.toAirport}</p></div>}
                      {inquiryModal.departDate && <div><span className="text-white/40 text-xs">Departure Date</span><p className="text-white">{inquiryModal.departDate}</p></div>}
                      {inquiryModal.returnDate && <div><span className="text-white/40 text-xs">Return Date</span><p className="text-white">{inquiryModal.returnDate}</p></div>}
                      <div><span className="text-white/40 text-xs">Passengers</span><p className="text-white">{inquiryModal.passengers}</p></div>
                    </div>
                  </div>

                  {(inquiryModal.airline || inquiryModal.flightNo || inquiryModal.departTime) && (
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="text-white/50 text-xs uppercase tracking-wider mb-2">Flight Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {inquiryModal.airline && <div><span className="text-white/40 text-xs">Airline</span><p className="text-white">{inquiryModal.airline}</p></div>}
                      {inquiryModal.flightNo && <div><span className="text-white/40 text-xs">Flight No</span><p className="text-white font-mono">{inquiryModal.flightNo}</p></div>}
                      {inquiryModal.departTime && <div><span className="text-white/40 text-xs">Departure Time</span><p className="text-white">{inquiryModal.departTime}</p></div>}
                      {inquiryModal.arriveTime && <div><span className="text-white/40 text-xs">Arrival Time</span><p className="text-white">{inquiryModal.arriveTime}</p></div>}
                      {inquiryModal.stops !== undefined && inquiryModal.stops !== "" && <div><span className="text-white/40 text-xs">Stops</span><p className="text-white">{inquiryModal.stops === "0" ? "Nonstop" : inquiryModal.stops + " stop(s)"}</p></div>}
                      {inquiryModal.offerId && <div><span className="text-white/40 text-xs">Offer ID</span><p className="text-white font-mono text-xs">{inquiryModal.offerId}</p></div>}
                      {inquiryModal.amount > 0 && <div><span className="text-white/40 text-xs">Price</span><p className="text-gold font-bold">{inquiryModal.amount} {inquiryModal.currency}</p></div>}
                    </div>
                  </div>
                  )}
                  {inquiryModal.specialRequests && (
                    <div className="border-t border-white/10 pt-4">
                      <span className="text-white/40 text-xs uppercase tracking-wider">Special Requests</span>
                      <p className="text-white/70 mt-1">{inquiryModal.specialRequests}</p>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="text-white/50 text-xs uppercase tracking-wider mb-3">Update Status</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      {inquiryStatusOptions.map((opt) => (
                        <button key={opt} onClick={() => handleInquiryStatusUpdate(inquiryModal._id, opt)}
                          disabled={updatingInquiryId === inquiryModal._id || inquiryModal.status === opt}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${inquiryModal.status === opt ? "bg-gold/20 text-gold cursor-default" : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"} disabled:opacity-50 disabled:cursor-not-allowed`}>
                          {updatingInquiryId === inquiryModal._id ? "Updating..." : opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end px-6 py-4 border-t border-white/10 bg-deepblue-dark/50">
                  <button onClick={() => setInquiryModal(null)} className="px-5 py-2 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all text-sm">Close</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
