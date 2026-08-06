'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Calendar from '@/components/Calendar';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CurrencyToggle from '@/components/CurrencyToggle';
import SocialShare from '@/components/SocialShare';
import BackButton from '@/components/BackButton';
import RelatedItems from '@/components/RelatedItems';
import { getAll } from '@/lib/persistentStore';
import { useI18n } from "@/lib/i18n";
import { mmLookup, mmVisas } from "@/lib/mm-content";

const FALLBACK_VISAS: any[] = [
  { id: "myanmar-visa", _id: "v1", country: "Myanmar", description: "Comprehensive Myanmar visa services for tourists and business travelers. Fast processing and expert guidance through the entire application process.", process: "eVisa available online", priceMMK: 85000, priceUSD: 40, duration: "28 Days (Single Entry)", requirements: "Passport, Digital Photo, Completed Application, Hotel Booking", status: "active" },
  { id: "thailand-visa", _id: "v2", country: "Thailand", description: "Hassle-free Thailand visa processing. Tourist and business visas with expedited options available.", process: "eVisa or Visa on Arrival", priceMMK: 120000, priceUSD: 57, duration: "60 Days (Tourist)", requirements: "Passport, Digital Photo, Flight Itinerary, Bank Statement", status: "active" },
  { id: "vietnam-visa", _id: "v3", country: "Vietnam", description: "Quick and reliable Vietnam visa services. eVisa processing within 3 business days for tourists.", process: "eVisa online", priceMMK: 95000, priceUSD: 45, duration: "30 Days (Single Entry)", requirements: "Passport, Digital Photo, Travel Itinerary", status: "active" },
  { id: "cambodia-visa", _id: "v4", country: "Cambodia", description: "Cambodia visa services including eVisa and Visa on Arrival support for all nationalities.", process: "eVisa or Visa on Arrival", priceMMK: 105000, priceUSD: 50, duration: "30 Days (Tourist)", requirements: "Passport, Digital Photo, USD 30 Fee", status: "active" },
  { id: "singapore-visa", _id: "v5", country: "Singapore", description: "Singapore visa application assistance for Myanmar citizens. Complete documentation support.", process: "e-Visa application", priceMMK: 150000, priceUSD: 71, duration: "30 Days (Multiple Entry)", requirements: "Passport, Form 14A, Digital Photo, Invitation Letter, Bank Statement", status: "active" },
];

export default function VisaDetailPage() {
  const { t, lang } = useI18n();
  const params = useParams();
  const slug = params?.slug as string;

  const [rawVisa, setRawVisa] = useState<any>(null);
  const visa = useMemo(() => {
    if (lang !== "mm" || !rawVisa) return rawVisa;
    return { ...rawVisa, ...mmLookup(mmVisas, rawVisa) };
  }, [rawVisa, lang]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [travelers, setTravelers] = useState(1);
  const [travelDate, setTravelDate] = useState('');

  useEffect(() => {
    if (!slug) return;

    const fetchVisa = async () => {
      setLoading(true);
      setError('');
      try {
        let visas: any[] = [];
        try {
          const res = await fetch('/api/visas', { cache: 'no-store' });
          const j = await res.json();
          visas = (j && (j.data || j)) || [];
        } catch (e) { console.error("visa api fetch failed", e); }
        if (!Array.isArray(visas) || visas.length === 0) visas = FALLBACK_VISAS;
        const found = visas.find((v: any) =>
          ((v.country || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')) === slug ||
          ((v.country || '').toLowerCase().replace(/\s+/g, '-')) === slug ||
          v.id === slug ||
          v._id === slug ||
          v.slug === slug
        );
        if (found) {
          setRawVisa(found);
        } else {
          setError('Visa not found');
        }
      } catch (err) {
        console.error('Failed to fetch visa:', err);
        setError('Visa not found');
      } finally {
        setLoading(false);
      }
    };

    fetchVisa();
  }, [slug]);

  // ─── Loading State ────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-4">
          <BackButton />
        </div>
        <div className="h-[60vh] bg-gray-100 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
            <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────────────
  if (error || !visa) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
          <BackButton />
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-center space-y-4">
            <svg className="w-16 h-16 mx-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl text-[#0A1628] font-semibold">{t("visa.errorTitle")}</h2>
            <p className="text-gray-500">{error || 'Visa not found'}</p>
            <Link
              href="/visas"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold inline-block"
            >
              Back to Visas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const country = visa.country || visa.title || '';
  const COUNTRY_IMAGES: Record<string, string> = {
    Thailand: '/images_v2/visa1-v3.jpg',  Singapore: '/images_v2/visa2-v3.jpg',
    Malaysia: '/images_v2/visa3-v3.jpg',  China: '/images_v2/visa4-v3.jpg',
    India: '/images_v2/visa5-v3.jpg',     'United Arab Emirates': '/images_v2/visa6-v3.jpg',
    Vietnam: '/images_v2/visa4-v3.jpg',   Cambodia: '/images_v2/visa3-v3.jpg',
    Japan: '/images_v2/visa1-v3.jpg',     'South Korea': '/images_v2/visa2-v3.jpg',
    Indonesia: '/images_v2/visa3-v3.jpg', Taiwan: '/images_v2/visa2-v3.jpg',
    Philippines: '/images_v2/visa6-v3.jpg', Australia: '/images_v2/visa1-v3.jpg',
    'United Kingdom': '/images_v2/visa2-v3.jpg', 'Hong Kong': '/images_v2/visa1-v3.jpg',
    Macau: '/images_v2/visa1-v3.jpg',     'Sri Lanka': '/images_v2/visa3-v3.jpg',
    Nepal: '/images_v2/visa4-v3.jpg',     Maldives: '/images_v2/visa6-v3.jpg',
    Laos: '/images_v2/visa3-v3.jpg',      Brunei: '/images_v2/visa1-v3.jpg',
    Myanmar: '/images_v2/visa2-v3.jpg',
  };
  // Resolve hero image: per-visa image first, then uploaded images[], then country map, then generic fallback
  const displayImage =
    visa.image ||
    (visa.images && Array.isArray(visa.images) && visa.images[0]) ||
    COUNTRY_IMAGES[country] ||
    '/images_v2/visa1-v2.jpg';
  const processing = visa.processingTime || '3-5 Business Days';
  const requirements: string[] = Array.isArray(visa.requirements)
    ? visa.requirements
    : (typeof visa.requirements === 'string'
      ? visa.requirements.split(',').map((s: string) => s.trim()).filter(Boolean)
      : []);

  const price = currency === 'MMK' ? (visa.visaFeeMMK || visa.priceMMK || 0) : (visa.visaFeeUSD || visa.priceUSD || 0);
  const currencySymbol = currency === 'MMK' ? 'Ks' : '$';
  const totalPrice = price * travelers;

  const handleBookNow = () => {
    const bookUrl = new URL('/book-now', window.location.origin);
    bookUrl.searchParams.set('type', 'visa');
    bookUrl.searchParams.set('title', visa.country);
    bookUrl.searchParams.set('destination', visa.country);
    bookUrl.searchParams.set('price', String(price));
    bookUrl.searchParams.set('currency', currency);
    bookUrl.searchParams.set('travelers', String(travelers));
    bookUrl.searchParams.set('travelDate', travelDate);
    window.location.href = bookUrl.toString();
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Back Button */}
      <BackButton />

      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <Image src={displayImage} alt={country} width={1200} height={630} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_70%)]" />
        <Link href="/visas" className="absolute top-6 left-4 md:top-8 md:left-8 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all text-sm">
          ← Back to Visas
        </Link>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold border border-[#D4AF37]/30 backdrop-blur-sm">
                📍 {country}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 text-white/80 text-xs font-semibold border border-[#D4AF37]/30 backdrop-blur-sm">
                ⏱ {processing}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {t("visa.visaTo", { country })}
            </h1>
            <p className="text-white/60 text-base md:text-lg">{t("visa.proService")}</p>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm">
        <Link href="/" className="text-gray-500 hover:text-[#D4AF37]">{t("visa.home")}</Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link href="/visas" className="text-gray-500 hover:text-[#D4AF37]">{t("visa.visas")}</Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-[#0A1628] font-medium">{country}</span>
      </nav>

      <SocialShare url={typeof window !== "undefined" ? window.location.href : ""} title={"A9 Global Travel - Visas"} />

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
                <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">{t("visa.fee")}</p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold">{processing}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">{t("visa.processing")}</p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold">{country}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">{t("visa.country")}</p>
              </div>
            </div>

            {/* Description */}
            {visa.description && (
              <div>
                <h2 className="text-2xl font-bold text-[#0A1628] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  About This Visa
                </h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  {visa.description}
                </p>
              </div>
            )}

            {/* Processing Time */}
            <div className="bg-[#0A1628] rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Processing Time
              </h2>
              <p className="text-white/60 text-sm mb-4">
                Estimated processing: <span className="text-[#D4AF37] font-semibold">{processing}</span>
              </p>
              <p className="text-white/40 text-xs">
                Processing time may vary depending on embassy workload and document completeness.
              </p>
            </div>

            {/* Requirements */}
            {requirements.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#0A1628] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {t("visa.requiredDocs")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {requirements.map((req: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/15 text-[#0A1628] text-sm font-medium hover:bg-[#D4AF37]/10 transition-colors">
                      <svg className="w-4 h-4 text-[#D4AF37] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {req}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — Interactive Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-2xl border border-[#D4AF37]/20 bg-white shadow-lg p-6 space-y-5">
                {/* Price Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t("visa.fee")}</p>
                    <p className="text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {currencySymbol} {price.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">{t("visa.perPerson")}</p>
                  </div>
                  <CurrencyToggle activeCurrency={currency} onToggle={setCurrency} />
                </div>

                {/* Info Rows */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">{t("visa.country")}</span>
                    <span className="text-[#0A1628] font-medium">{country}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">{t("visa.processingTime")}</span>
                    <span className="text-[#0A1628] font-medium">{processing}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">{t("visa.requirements")}</span>
                    <span className="text-[#0A1628] font-medium">{t("visa.documents", { n: requirements.length })}</span>
                  </div>
                </div>

                <hr className="border-[#D4AF37]/10" />

                {/* Travel Date */}
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">{t("visa.travelDate")}</label>
                  <Calendar value={travelDate} onChange={setTravelDate} label={t("visa.travelDate")} />
                </div>

                {/* Travelers Counter */}
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">{t("visa.travelers")}</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-12 text-center text-[#0A1628] font-semibold">{travelers}</span>
                    <button
                      type="button"
                      onClick={() => setTravelers(travelers + 1)}
                      className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-3 border-t border-[#D4AF37]/10">
                  <span className="text-gray-700 font-medium">{t("visa.total")}</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">
                    {currencySymbol} {totalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Book Now Button */}
                <button
                  onClick={handleBookNow}
                  className="block w-full py-3.5 rounded-xl text-center font-bold text-base bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:scale-[1.02] transition-all duration-300"
                >
                  Book Now
                </button>
                <p className="text-center text-gray-400 text-xs">{t("visa.noPayment")}</p>
              </div>

              <Link
                href="/visas"
                className="block w-full py-3 rounded-xl text-center font-semibold text-sm border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A1628] transition-all duration-300"
              >
                ← Back to All Visas
              </Link>
            </div>
          </div>
        </div>
      </section>

      <RelatedItems section="visas" excludeSlug={slug} destination={typeof country === "string" ? country : ""} />
    </main>
  );
}
