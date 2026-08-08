'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HiLocationMarker, HiClock, HiUser, HiSearch, HiHome } from 'react-icons/hi';
import { useI18n } from '@/lib/i18n';
import Image from "next/image";

interface BusRoute {
  _id: string;
  from: string;
  to: string;
  priceMMK: number;
  duration: string;
  operators: string[];
  route: string;
}

const FALLBACK_BUS_ROUTES: BusRoute[] = [
  { _id: "bus1", from: "Yangon", to: "Mandalay", priceMMK: 25000, duration: "9 hours", operators: ["JJ Express", "Elite Express"], route: "Yangon → Mandalay" },
  { _id: "bus2", from: "Yangon", to: "Bagan", priceMMK: 22000, duration: "10 hours", operators: ["Shwe Mandalar", "Famous Express"], route: "Yangon → Bagan" },
  { _id: "bus3", from: "Yangon", to: "Taunggyi", priceMMK: 28000, duration: "12 hours", operators: ["JJ Express"], route: "Yangon → Taunggyi (Inle)" },
  { _id: "bus4", from: "Yangon", to: "Naypyitaw", priceMMK: 15000, duration: "5 hours", operators: ["Elite Express", "Shwe Mandalar"], route: "Yangon → Naypyitaw" },
  { _id: "bus5", from: "Mandalay", to: "Bagan", priceMMK: 12000, duration: "4 hours", operators: ["Shwe Mandalar", "Famous Express"], route: "Mandalay → Bagan" },
  { _id: "bus6", from: "Yangon", to: "Pyay", priceMMK: 18000, duration: "6 hours", operators: ["Famous Express"], route: "Yangon → Pyay" },
  { _id: "bus7", from: "Yangon", to: "Mawlamyine", priceMMK: 20000, duration: "7 hours", operators: ["Elite Express"], route: "Yangon → Mawlamyine" },
  { _id: "bus8", from: "Yangon", to: "Pathein", priceMMK: 16000, duration: "6 hours", operators: ["Shwe Mandalar"], route: "Yangon → Pathein" },
  { _id: "bus9", from: "Mandalay", to: "Taunggyi", priceMMK: 18000, duration: "8 hours", operators: ["JJ Express"], route: "Mandalay → Taunggyi" },
  { _id: "bus10", from: "Yangon", to: "Hpa-An", priceMMK: 15000, duration: "6 hours", operators: ["Famous Express"], route: "Yangon → Hpa-An" },
];

interface BusesClientProps {
  initialRoutes: BusRoute[];
  siteConfig?: any;
}

export default function BusesClient({ initialRoutes, siteConfig }: BusesClientProps) {
  const { t } = useI18n();
  const heroImage = siteConfig?.heroImages?.buses || "/images_v2/hero-bagan-v2.jpg";
  const [routes] = useState<BusRoute[]>(initialRoutes.length > 0 ? initialRoutes : FALLBACK_BUS_ROUTES);

  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  const filteredRoutes = routes.filter((r) => {
    if (fromCity && !r.from.toLowerCase().includes(fromCity.toLowerCase()) && !r.route.toLowerCase().includes(fromCity.toLowerCase())) return false;
    if (toCity && !r.to.toLowerCase().includes(toCity.toLowerCase()) && !r.route.toLowerCase().includes(toCity.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-2">
        <Link href="/#services" className="inline-flex items-center gap-2 text-sm text-[#8A6C0B] hover:text-[#7A5F08] transition-colors font-medium">
          <HiHome className="w-4 h-4" />
          {t("buses.backToServices")}
        </Link>
      </div>

      {/* ── Hero ── */}
      <section className="relative w-full h-64 sm:h-80 overflow-hidden">
        <Image alt={t("buses.heroAlt")} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images_v2/hero-cars.jpg"; }} src={heroImage} width={1600} height={900} sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/70 to-[#0A1628]/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-bold text-white text-3xl sm:text-4xl md:text-5xl mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {t("buses.heroTitle")}
          </h1>
          <p className="text-[#D4AF37] text-sm sm:text-base max-w-xl">
            {t("buses.heroSubtitle")}
          </p>
        </div>
      </section>

      {/* ── Search Form ── */}
      <section className="max-w-6xl mx-auto -mt-12 relative z-20 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-[#D4AF37]/20 p-5 sm:p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t("buses.fromCity")}</label>
              <input
                type="text"
                placeholder={t("buses.fromPh")}
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t("buses.toCity")}</label>
              <input
                type="text"
                placeholder={t("buses.toPh")}
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t("home.date")}</label>
              <input
                type="date"
                aria-label={t("home.date")} value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t("buses.passengers")}</label>
              <select
                aria-label={t("buses.passengers")} value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? t("buses.passenger") : t("buses.passengers")}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-center text-xs text-gray-500 mt-1">
            {t("buses.showing", { count: filteredRoutes.length, total: routes.length })}
            {(fromCity || toCity) && t("buses.filtered")}
          </div>
        </div>
      </section>

      {/* ── Results Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="sr-only">{t("buses.routesHeading")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRoutes.map((route) => (
            <div
              key={route._id}
              className="bg-white rounded-2xl border border-gray-100 hover:border-[#D4AF37]/40 hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Card top gradient bar */}
              <div className="h-2 bg-gradient-to-r from-[#D4AF37] to-[#F5A623]" />

              <div className="p-5">
                {/* Route Title */}
                <h3 className="font-bold text-lg text-[#0A1628] mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {route.route}
                </h3>

                {/* Route Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HiLocationMarker className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                    <span>{route.from} → {route.to}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HiClock className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HiUser className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                    <span>{route.operators.join(" / ")}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="border-t border-gray-100 pt-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1">{t("car.startingFrom")}</p>
                  <p className="text-2xl font-bold text-[#8A6C0B]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    Ks {route.priceMMK.toLocaleString()}
                  </p>
                </div>

                {/* Book Now Button */}
                <Link
                  href={`/book-now?type=bus&from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}&priceMMK=${route.priceMMK}&duration=${encodeURIComponent(route.duration)}&operators=${encodeURIComponent(route.operators.join(","))}&route=${encodeURIComponent(route.route)}`}
                  className="w-full block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] hover:shadow-lg group-hover:from-[#C5A028] group-hover:to-[#E09600]"
                >
                  {t("common.bookNow")}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredRoutes.length === 0 && (
          <div className="text-center py-20">
            <HiSearch className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{t("buses.noRoutes")}</h3>
            <p className="text-gray-500 mt-2">{t("buses.tryAdjusting")}</p>
          </div>
        )}
      </section>

      {/* ── Why Book Buses With Us ── */}
      <section className="py-16 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#8A6C0B] text-sm font-semibold uppercase tracking-widest">{t("buses.whyTitle")}</span>
          <h2 className="font-bold text-3xl mt-2 mb-10" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {t("buses.whyHeading")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🎫", title: t("buses.featPrices"), desc: t("buses.featPricesDesc") },
              { icon: "🛡️", title: t("buses.featOperators"), desc: t("buses.featOperatorsDesc") },
              { icon: "📞", title: t("buses.featSupport"), desc: t("buses.featSupportDesc") },
              { icon: "🔄", title: t("buses.featEasy"), desc: t("buses.featEasyDesc") },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow border border-gray-100">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-lg text-[#0A1628] mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Operator Partners ── */}
      <section className="py-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#8A6C0B] text-sm font-semibold uppercase tracking-widest">{t("buses.trusted")}</span>
          <h2 className="font-bold text-3xl mt-2 mb-10" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {t("buses.operatorHeading")}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "JJ Express", tier: "premier" },
              { name: "Elite Express", tier: "premier" },
              { name: "Shwe Mandalar", tier: "gold" },
              { name: "Famous Express", tier: "gold" },
            ].map((operator, i) => (
              <div
                key={i}
                className={`rounded-xl px-6 py-4 text-center border transition-all min-w-[160px] ${
                  operator.tier === "premier"
                    ? "bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30 hover:border-[#D4AF37]/60"
                    : "bg-white border-gray-200 hover:border-[#D4AF37]/30 hover:shadow-md"
                }`}
              >
                <div className="text-xl mb-2">🚌</div>
                <h3 className={`font-semibold ${operator.tier === "premier" ? "text-[#0A1628]" : "text-gray-700"}`}>
                  {operator.name}
                </h3>
                {operator.tier === "premier" && (
                  <span className="inline-block bg-[#D4AF37] text-[#0A1628] text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-1">
                    {t("buses.premier")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-[#D4AF37]/10 via-[#D4AF37]/5 to-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl p-10 md:p-14">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A1628] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {t("buses.ctaTitle")}
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              {t("buses.ctaDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="px-8 py-3 border border-[#D4AF37] text-[#D4AF37] font-semibold rounded-xl hover:bg-[#D4AF37] hover:text-white transition-all"
              >
                {t("common.contactUs")}
              </Link>
              <Link
                href="/tours"
                className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] font-bold rounded-xl hover:shadow-lg transition-all"
              >
                {t("buses.exploreTours")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
