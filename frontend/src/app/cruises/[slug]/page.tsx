'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAll } from '@/lib/persistentStore';
import CurrencyToggle from '@/components/CurrencyToggle';
import SocialShare from '@/components/SocialShare';
import BackButton from '@/components/BackButton';
import Calendar from '@/components/Calendar';
import RelatedItems from '@/components/RelatedItems';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useI18n } from "@/lib/i18n";
import { mmLookup, mmCruises } from "@/lib/mm-content";
export const dynamic = 'force-dynamic';

const FALLBACK_CRUISES = [
  { id: "cr1", title: "Halong Bay Cruise", destination: "Vietnam", description: "Luxury overnight cruise through Halong Bay.", priceMMK: 650000, priceUSD: 310, duration: "3 Days / 2 Nights", images: ["/images_v2/hero-cruises-v2.jpg"] },
  { id: "cr2", title: "Mekong River Cruise", destination: "Cambodia", description: "Journey along the legendary Mekong River.", priceMMK: 920000, priceUSD: 440, duration: "5 Days / 4 Nights", images: ["/images_v2/hero-cruises-v2.jpg"] },
  { id: "cr3", title: "Andaman Sea Cruise", destination: "Thailand", description: "Island hopping in the Andaman Sea.", priceMMK: 580000, priceUSD: 276, duration: "4 Days / 3 Nights", images: ["/images_v2/hero-cruises-v2.jpg"] },
  { id: "cr4", title: "Singapore Strait Cruise", destination: "Singapore", description: "Luxury cruise around Singapore.", priceMMK: 1200000, priceUSD: 571, duration: "3 Days / 2 Nights", images: ["/images_v2/hero-cruises-v2.jpg"] },
  { id: "cr5", title: "Maldives Atoll Cruise", destination: "Maldives", description: "Sail through pristine atolls.", priceMMK: 2500000, priceUSD: 1190, duration: "7 Days / 6 Nights", images: ["/images_v2/dest-maldives-v2.jpg"] },
  { id: "cr6", title: "Dubai Marina Cruise", destination: "UAE", description: "Evening dinner cruise along Dubai Marina.", priceMMK: 180000, priceUSD: 85, duration: "Evening", images: ["/images_v2/dest-dubai-v2.jpg"] },
  { id: "cr7", title: "Alaska Glacier Cruise", destination: "Alaska, USA", description: "Witness towering glaciers and whales.", priceMMK: 4200000, priceUSD: 2000, duration: "7 Days / 6 Nights", images: ["/images_v2/dest-japan-v2.jpg"] },
  { id: "cr8", title: "Norwegian Fjords Cruise", destination: "Norway", description: "Sail through dramatic fjords.", priceMMK: 3800000, priceUSD: 1810, duration: "7 Days / 6 Nights", images: ["/images_v2/dest-korea-v2.jpg"] },
  { id: "cr9", title: "Greek Isles Cruise", destination: "Greece", description: "Island-hop through Santorini and Mykonos.", priceMMK: 2800000, priceUSD: 1333, duration: "8 Days / 7 Nights", images: ["/images_v2/dest-paris-v2.jpg"] },
  { id: "cr10", title: "Antarctic Expedition", destination: "Antarctica", description: "The ultimate adventure to the last wilderness.", priceMMK: 8500000, priceUSD: 4050, duration: "12 Days / 11 Nights", images: ["/images_v2/hero-cruises-v2.jpg"] },
];

interface CruiseDetailPageProps {
  cruise: any;
  slug: string;
}

function CruiseDetailClient({ cruise, slug }: CruiseDetailPageProps) {
  const { t } = useI18n();
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [travelers, setTravelers] = useState(1);
  const [travelDate, setTravelDate] = useState('');

  const name = cruise.title || cruise.name || '';
  // Per-cruise hero image resolution:
  // 1. cruise.image (single image field)
  // 2. cruise.images[0] (gallery array)
  // 3. CRUISE_HERO_IMAGES[title] (real uploaded cruise photos)
  // 4. generic fallback
  const CRUISE_HERO_IMAGES: Record<string, string> = {
    'Dubai Marina Dhow Cruise': 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609375257_o1rs8j-dubai-marina-cruise-BgrMHFrRlMaplw4wKa6mhDfiJCZocL.jpg',
    'Maldives Overwater Cruise': 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609373849_qqocr6-maldives-atoll-cruise-4G5XO1nb7DSkWAqaEf6UzHzUKoVh83.jpg',
    'Phuket Island Hopper': 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609371185_a6d9cm-andaman-sea-cruise-DGrdWrFm1Bd4Gn84CJ4GX6gu1raCvL.jpg',
    'Yangon River Sunset Cruise': 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609382352_ryle8t-myanmar-irrawaddy-cruise-Am9kKNeh5003TOiSveDXzysyPqIdgm.jpg',
    'Caribbean Explorer': 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609379660_ztdt36-greek-isles-cruise-2yVStBJzJwAPF3wplYiL95N9MKL5L7.jpg',
    'Halong Bay Cruise': 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609368332_ogdvxh-halong-bay-cruise-DN02hErUVjbA7g5tYyF78PqpvBiLtu.jpg',
    'Mekong River Cruise': 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609369635_4qqbgm-mekong-river-cruise-TFX7rfdQd2KizGqwlEVQPbJGlF28Yq.jpg',
    'Singapore Strait Cruise': 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609372628_tayqki-singapore-strait-cruise-miIWaEO9qvinGxDZs9H2Yc7blMPxEt.jpg',
    'Alaska Glacier Cruise': 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609376675_4c233e-alaska-glacier-cruise-OtRwzKuRPnoga7apeB9VGEwvllAvYQ.jpg',
    'Norwegian Fjords Cruise': 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609378262_5q6ygv-norwegian-fjords-cruise-j7xFcN4bQ5WnVlHq59E00Y6yaKQV3I.jpg',
    'Greek Isles Cruise': 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609379660_ztdt36-greek-isles-cruise-2yVStBJzJwAPF3wplYiL95N9MKL5L7.jpg',
    'Antarctic Expedition': 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609380925_9n0iah-antarctic-expedition-3AUnTFu9jcZMpIpkvoQbENDoxuKeqh.jpg',
  };
  const displayImage =
    cruise.image ||
    (cruise.images && Array.isArray(cruise.images) && cruise.images[0]) ||
    CRUISE_HERO_IMAGES[name] ||
    '/images_v2/hero-cruises-v2.jpg';
  const priceMMK = cruise.priceMMK || 0;
  const priceUSD = cruise.priceUSD || 0;
  const dest = cruise.destination || '';
  const duration = cruise.duration || '';
  const description = cruise.description || '';
  const rating = cruise.rating || 4.5;

  const price = currency === 'MMK' ? priceMMK : priceUSD;
  const currencySymbol = currency === 'MMK' ? 'Ks' : '$';
  const totalPrice = price * travelers;

  const handleBookNow = () => {
    const bookUrl = new URL('/book-now', window.location.origin);
    bookUrl.searchParams.set('type', 'cruise');
    bookUrl.searchParams.set('title', name);
    bookUrl.searchParams.set('destination', dest);
    bookUrl.searchParams.set('duration', duration);
    bookUrl.searchParams.set('price', String(price));
    bookUrl.searchParams.set('currency', currency);
    bookUrl.searchParams.set('travelers', String(travelers));
    bookUrl.searchParams.set('travelDate', travelDate);
    window.location.href = bookUrl.toString();
  };

  const renderStars = (r: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < Math.round(r) ? 'text-[#D4AF37]' : 'text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const maxGroupSize = cruise.groupSize || 12;

  return (
    <main className="min-h-screen bg-white">
      <BackButton label={t("cruise.backToCruises")} />

      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <Image src={displayImage} alt={name} width={1200} height={630} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_70%)]" />
        <Link href="/cruises" className="absolute top-6 left-4 md:top-8 md:left-8 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all text-sm">
          ← Back to Cruises
        </Link>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold border border-[#D4AF37]/30 backdrop-blur-sm">
                📍 {dest}
              </span>
              {duration && (
                <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 text-white/80 text-xs font-semibold border border-[#D4AF37]/30 backdrop-blur-sm">
                  🛳 {duration}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {name}
            </h1>
            <p className="text-white/60 text-base md:text-lg">{dest}{duration ? ' · ' + duration : ''}</p>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm">
        <Link href="/" className="text-gray-500 hover:text-[#D4AF37]">{t("cruise.home")}</Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link href="/cruises" className="text-gray-500 hover:text-[#D4AF37]">{t("cruise.cruises")}</Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-[#0A1628] font-medium">{name}</span>
      </nav>

      <SocialShare url={typeof window !== "undefined" ? window.location.href : ""} title={"A9 Global Travel - Cruises"} />

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold">{currencySymbol} {price.toLocaleString()}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">{t("cruise.price")}</p>
              </div>
              {duration && (
                <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                  <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[#D4AF37] text-2xl font-bold">{duration}</p>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">{t("cruise.duration")}</p>
                </div>
              )}
              <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold">{dest}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">{t("cruise.destination")}</p>
              </div>
            </div>

            {/* Description */}
            {description && (
              <div>
                <h2 className="text-2xl font-bold text-[#0A1628] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Cruise Details
                </h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  {description}
                </p>
              </div>
            )}

            {/* Details Card */}
            <div className="bg-[#0A1628] rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {t("cruise.tripInformation")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dest && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wider">{t("cruise.destination")}</p>
                      <p className="text-white font-medium">{dest}</p>
                    </div>
                  </div>
                )}
                {duration && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wider">{t("cruise.duration")}</p>
                      <p className="text-white font-medium">{duration}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">{t("cruise.priceMMK")}</p>
                    <p className="text-white font-medium">Ks {priceMMK.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">{t("cruise.priceUSD")}</p>
                    <p className="text-white font-medium">${priceUSD.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar — Interactive Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="rounded-2xl border border-[#D4AF37]/20 bg-white p-6 space-y-5 shadow-lg shadow-[#D4AF37]/5 mb-4">
                {/* Price Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {currencySymbol} {price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">{t("common.perPerson")}</span>
                  </div>
                  <CurrencyToggle activeCurrency={currency} onToggle={setCurrency} />
                </div>

                <hr className="border-[#D4AF37]/10" />

                {/* Info Rows */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">{t("cruise.duration")}</span>
                    <span className="text-[#0A1628] font-medium">{duration}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">{t("cruise.destination")}</span>
                    <span className="text-[#0A1628] font-medium">{dest}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">{t("cruise.groupSize")}</span>
                    <span className="text-[#0A1628] font-medium">Up to {maxGroupSize} people</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">{t("cruise.rating")}</span>
                    <span className="text-[#0A1628] font-medium flex items-center gap-1">
                      {renderStars(rating)}
                    </span>
                  </div>
                </div>

                <hr className="border-[#D4AF37]/10" />

                {/* Booking Form */}
                <div className="space-y-3">
                  <div>
                    <Calendar
  value={travelDate}
  onChange={setTravelDate}
  label={t("cruise.travelDate")}
/>
                  </div>
                  <div>
                    <label className="text-gray-600 text-xs mb-1 block">{t("cruise.travelers")}</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        className="w-9 h-9 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-12 text-center text-[#0A1628] font-semibold">{travelers}</span>
                      <button
                        type="button"
                        onClick={() => setTravelers(Math.min(maxGroupSize, travelers + 1))}
                        className="w-9 h-9 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-3 border-t border-[#D4AF37]/10">
                  <span className="text-gray-700 font-medium">Total ({travelers} {travelers === 1 ? 'traveler' : 'travelers'})</span>
                  <span className="text-2xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {currencySymbol} {totalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Book Now Button */}
                <button
                  onClick={handleBookNow}
                  className="block w-full py-3.5 rounded-xl text-center font-bold text-lg bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:scale-[1.02] transition-all duration-300 active:scale-[0.98]"
                >
                  {t("common.bookNow")}
                </button>
                <p className="text-center text-gray-400 text-xs">{t("cruise.noPayment")}</p>
              </div>

              {/* Back Link */}
              <Link
                href="/cruises"
                className="block w-full py-3 rounded-xl text-center font-semibold text-sm border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A1628] transition-all duration-300"
              >
                ← Back to All Cruises
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ErrorBoundary fallback={null}>
        <RelatedItems section="cruises" excludeSlug={slug} destination={typeof dest === "string" ? dest : ""} />
      </ErrorBoundary>
    </main>
  );
}

export default function CruiseDetailPage({ params }: { params: { slug: string } }) {
  const { t, lang } = useI18n();
  const slug = params.slug;
  const [rawCruise, setRawCruise] = useState<any>(null);
  const cruise = useMemo(() => {
    if (lang !== "mm" || !rawCruise) return rawCruise;
    return { ...rawCruise, ...mmLookup(mmCruises, rawCruise) };
  }, [rawCruise, lang]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/cruises', { cache: 'no-store' })
      .then(function(r) { return r.json(); })
      .then(function(j: any) {
        if (cancelled) return;
        var arr = (j && (j.data || j)) || [];
        var list = (Array.isArray(arr) && arr.length >= 5) ? arr : FALLBACK_CRUISES;
        var found = list.find(function(c: any) {
          return ((c.title || c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug ||
            c.id === slug || c._id === slug || c.slug === slug);
        });
        setRawCruise(found || null);
      })
      .catch(function(e) { console.error('cruises api fetch failed', e); setRawCruise(null); })
      .finally(function() { if (!cancelled) setLoading(false); });
    return function() { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-24 text-center">
        <div className="text-gray-500 py-16">{t("cruise.loading")}</div>
      </main>
    );
  }
  if (!cruise) {
    return (
      <main className="min-h-screen bg-white pt-24 text-center">
        <BackButton />
        <h1 className="text-4xl font-bold text-[#0A1628] mb-4">{t("cruise.notFound")}</h1>
        <p className="text-gray-600 mb-8">{t("cruise.notFoundDesc")}</p>
        <Link href="/cruises" className="text-[#D4AF37] font-semibold hover:underline">← Back to Cruises</Link>
      </main>
    );
  }

  return <CruiseDetailClient cruise={cruise} slug={slug} />;
}