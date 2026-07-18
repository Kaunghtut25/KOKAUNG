"use client";

import React, { useState } from "react";
import { generateBookingUrl } from "@/lib/booking-com";

export default function BookingWidget() {
  const [city, setCity] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  const handleSearch = () => {
    const url = generateBookingUrl({
      city: city || undefined,
      checkin: checkin || undefined,
      checkout: checkout || undefined,
      guests,
      rooms,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Set default dates: today + 30 days and + 33 days
  const getDefaultDates = () => {
    const today = new Date();
    const checkinDate = new Date(today);
    checkinDate.setDate(today.getDate() + 30);
    const checkoutDate = new Date(today);
    checkoutDate.setDate(today.getDate() + 33);
    return {
      checkin: checkinDate.toISOString().split("T")[0],
      checkout: checkoutDate.toISOString().split("T")[0],
    };
  };

  const defaults = getDefaultDates();

  return (
    <section className="max-w-7xl mx-auto px-4 -mt-6 relative z-20">
      <div className="bg-gradient-to-br from-[#0A1628] via-[#0D1F3C] to-[#0A1628] rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/30 border border-[#D4AF37]/20">
        {/* Gold accent line at top */}
        <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Header */}
        <div className="text-center mb-6">
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Search Hotels Worldwide
          </h2>
          <p className="text-[#D4AF37] text-sm md:text-base font-medium">
            Powered by Booking.com — Best price guaranteed
          </p>
        </div>

        {/* Search Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 items-end">
          {/* Destination */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Destination
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City, country or hotel"
                className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/15 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white/15 transition-all duration-300"
              />
            </div>
          </div>

          {/* Check-in */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Check-in
            </label>
            <input
              type="date"
              value={checkin || defaults.checkin}
              onChange={(e) => setCheckin(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/10 border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white/15 transition-all duration-300 [color-scheme:dark]"
            />
          </div>

          {/* Check-out */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Check-out
            </label>
            <input
              type="date"
              value={checkout || defaults.checkout}
              onChange={(e) => setCheckout(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/10 border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white/15 transition-all duration-300 [color-scheme:dark]"
            />
          </div>

          {/* Guests */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-white/10 border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white/15 transition-all duration-300 cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n} className="bg-[#0A1628] text-white">
                  {n} {n === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
          </div>

          {/* Rooms */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Rooms
            </label>
            <select
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-white/10 border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white/15 transition-all duration-300 cursor-pointer"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n} className="bg-[#0A1628] text-white">
                  {n} {n === 1 ? "Room" : "Rooms"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-10 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] shadow-lg shadow-[#D4AF37]/25 hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            🔍 Search Hotels
          </button>
          <p className="text-gray-500 text-xs text-center">
            You&apos;ll be redirected to Booking.com to complete your reservation
          </p>
        </div>
      </div>
    </section>
  );
}
