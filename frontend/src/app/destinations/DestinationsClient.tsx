'use client';

import React, { useState } from 'react';
import { useI18n } from "@/lib/i18n";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DealsBanner from '@/components/DealsBanner';
import FAQAccordion from '@/components/FAQAccordion';
import TestimonialSlider from '@/components/TestimonialSlider';
import Image from "next/image";

interface Destination {
  city: string;
  country: string;
  image: string;
  minPrice: string;
  bestTime?: string;
  description?: string;
  highlights?: string[];
  rating?: number;
  reviews?: number;
  duration?: string;
  tags?: string[];
}

interface Props {
  initialDestinations: Destination[];
  siteConfig?: any;
}

function toSlug(text: string): string {
  return (text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function DestinationsClient({ initialDestinations, siteConfig }: Props) {
  /* FIX: 2026-08-12 lang-reference-error — destructure lang (was undefined -> ReferenceError -> /destinations 500 + console 'Uncaught (in promise) Object') */
  const { t, lang } = useI18n();
  const router = useRouter();
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);

  const heroImage = siteConfig?.heroImages?.destinations || "/images_v2/hero-destinations-v2.jpg";
  const dt = siteConfig?.heroText?.destinations || {};
  const dTitle = dt.title || "";
  const dSubtitle = dt.subtitle || "";
  const dTitleFont = dt.titleFont || "'Playfair Display', Georgia, serif";
  const dTitleSize = dt.titleSize || "3rem";
  const dSubtitleSize = dt.subtitleSize || "1.2rem";

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative pt-24 pb-12 px-4 overflow-hidden"
        style={{ height: (siteConfig?.heroDimensions?.destinations?.desktop || 400) + "px" }}
      >
        <div className="absolute inset-0">
          <Image alt="Explore Destinations" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images_v2/hero-destinations-v2.jpg"; }} src={heroImage} width={1600} height={900} sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="font-bold mb-4 text-white" style={{ fontFamily: dTitleFont, fontSize: dTitleSize }}>
            {dTitle || "Popular Destinations"}
          </h1>
          {dSubtitle ? (
            <p className="text-white/70 text-lg max-w-2xl mx-auto" style={{ fontSize: dSubtitleSize }}>
              {dSubtitle}
            </p>
          ) : (
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Explore our curated selection of incredible destinations across Asia and beyond
            </p>
          )}
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="sr-only">{t("dests.gridTitle")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {initialDestinations.map((dest, i) => {
            const slug = toSlug(dest.city);
            const shortDesc = (dest.description || "").length > 100
              ? (dest.description || "").substring(0, 100) + "..."
              : (dest.description || "");

            return (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#D4AF37]/40 transition-all group cursor-pointer"
                onClick={(e) => { if (!(e.target as HTMLElement).closest("a, button")) setSelectedDest(dest); }}
              >
                {/* Card Image */}
                <div className="relative w-full h-48 overflow-hidden">
                  <Image alt={dest.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609663178_ta1biy-bangkok-x7Q8kUMuXRvj6qMJAZxBbawKS4zkjI.jpg";
                    }} src={dest.image} width={1600} height={900} sizes="100vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#D4AF37]/90 text-[#0A1628] text-xs font-bold">
                    {dest.country}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3
                    className="font-bold text-[#0A1628] text-lg mb-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {dest.city}
                  </h3>
                  {shortDesc && (
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{shortDesc}</p>
                  )}
                  {(dest.rating || dest.reviews) && (
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }, (_, si) => (
                          <svg key={si} className={`w-3.5 h-3.5 ${si < Math.round(dest.rating || 0) ? 'text-[#D4AF37]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-[#0A1628] font-semibold text-sm">{dest.rating}</span>
                      {dest.reviews ? <span className="text-gray-400 text-xs">({dest.reviews.toLocaleString()} {lang === "mm" ? "သုံးသပ်ချက်" : "reviews"})</span> : null}
                    </div>
                  )}
                  {(dest.duration || dest.bestTime) && (
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2 text-xs text-gray-500">
                      {dest.duration && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {dest.duration}
                        </span>
                      )}
                      {dest.bestTime && (
                        <span className="flex items-center gap-1">
                          <span>☀️</span>
                          {dest.bestTime}
                        </span>
                      )}
                    </div>
                  )}
                  {dest.tags && dest.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {dest.tags.slice(0, 3).map((tag, ti) => (
                        <span key={ti} className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#7A5F08] text-[11px] font-medium border border-[#D4AF37]/20">{tag}</span>
                      ))}
                    </div>
                  )}
                  {dest.minPrice && (
                    <p className="text-[#8A6C0B] text-sm font-semibold mb-4">{dest.minPrice}</p>
                  )}
                  <div className="flex gap-2">
                    <Link
                      href={"/destinations/" + slug}
                      className="flex-1 px-3 py-2 border border-[#D4AF37] text-[#8A6C0B] text-sm font-semibold rounded-full text-center hover:bg-[#D4AF37] hover:text-[#0A1628] transition-colors"
                    >
                      {t("common.viewDetails")}
                    </Link>
                    <Link
                      href={"/book-now?type=tour&destination=" + encodeURIComponent(dest.city)}
                      className="flex-1 px-3 py-2 bg-[#D4AF37] text-[#0A1628] text-sm font-semibold rounded-full text-center hover:bg-[#C19B2F] transition-colors"
                    >
                      Book Trip
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <DealsBanner />
      <FAQAccordion section="destinations" />
      <TestimonialSlider />
    
      {/* Quick View Modal */}
      {selectedDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedDest(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative h-56">
              <Image alt={selectedDest.city} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609663178_ta1biy-bangkok-x7Q8kUMuXRvj6qMJAZxBbawKS4zkjI.jpg"; }} src={selectedDest.image} width={1600} height={900} sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button onClick={() => setSelectedDest(null)} className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all">✕</button>
              <div className="absolute bottom-4 left-6">
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{selectedDest.city}</h2>
                <p className="text-white/80 text-sm">{selectedDest.country}</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">{selectedDest.description || "A fascinating destination waiting to be explored. Rich in culture, history, and unforgettable experiences."}</p>
              {selectedDest.bestTime && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-[#8A6C0B]">☀️</span> Best time: <span className="font-medium">{selectedDest.bestTime}</span>
                </div>
              )}
              {selectedDest.minPrice && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-[#8A6C0B]">💰</span> Starting from: <span className="font-medium text-[#8A6C0B]">{selectedDest.minPrice}</span>
                </div>
              )}
              {selectedDest.highlights && selectedDest.highlights.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{t("list.highlights")}</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDest.highlights.map((h, i) => (
                      <span key={i} className="px-3 py-1 bg-[#D4AF37]/10 text-[#7A5F08] text-xs rounded-full">{h}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <Link href={"/destinations/" + toSlug(selectedDest.city)} className="flex-1 px-4 py-2.5 border border-[#D4AF37] text-[#8A6C0B] text-sm font-semibold rounded-full text-center hover:bg-[#D4AF37] hover:text-white transition-colors">{t("list.fullDetails")}</Link>
                <Link href={"/book-now?type=tour&destination=" + encodeURIComponent(selectedDest.city)} className="flex-1 px-4 py-2.5 bg-[#D4AF37] text-[#0A1628] text-sm font-semibold rounded-full text-center hover:bg-[#C19B2F] transition-colors">{t("list.bookTrip")}</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}