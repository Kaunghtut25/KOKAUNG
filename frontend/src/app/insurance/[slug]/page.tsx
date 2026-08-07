'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Calendar from '@/components/Calendar';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CurrencyToggle from '@/components/CurrencyToggle';
import SocialShare from '@/components/SocialShare';
import BackButton from '@/components/BackButton';
import RelatedItems from '@/components/RelatedItems';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useI18n } from "@/lib/i18n";
import { mmLookup, mmInsurance } from "@/lib/mm-content";

const FALLBACK_PLANS: any[] = [
  { _id: "basic-travel-shield", id: "i1", planName: "Basic Travel Shield", coverage: "Medical Emergency + Trip Delay", priceMMK: 15000, priceUSD: 7, duration: "Per trip", benefits: "Medical Emergency up to $50,000, Trip Cancellation, Lost Baggage, 24/7 Assistance", status: "active" },
  { _id: "silver-travel-guard", id: "i2", planName: "Silver Travel Guard", coverage: "Medical + Trip Cancellation + Baggage", priceMMK: 28000, priceUSD: 13, duration: "Per trip", benefits: "Medical up to $100,000, Trip Cancellation, Lost Baggage, Flight Delay, Personal Liability", status: "active" },
  { _id: "gold-comprehensive", id: "i3", planName: "Gold Comprehensive", coverage: "Full Medical + Trip Protection + Evacuation", priceMMK: 45000, priceUSD: 21, duration: "Per trip", benefits: "Medical up to $250,000, Emergency Evacuation, Trip Cancellation, Lost Baggage, Flight Delay, Personal Accident", status: "active" },
  { _id: "platinum-global", id: "i4", planName: "Platinum Global", coverage: "Ultimate Worldwide Coverage", priceMMK: 75000, priceUSD: 36, duration: "Annual", benefits: "Medical Unlimited, Emergency Evacuation, Trip Cancellation, Lost Baggage, Flight Delay, Personal Liability, Adventure Sports, Pre-existing Conditions", status: "active" },
  { _id: "student-travel", id: "i5", planName: "Student Travel Plan", coverage: "Study Abroad Protection", priceMMK: 22000, priceUSD: 10, duration: "Semester", benefits: "Medical up to $75,000, Emergency Evacuation, Study Interruption, Lost Documents, Personal Liability", status: "active" },
];

interface InsurancePlan {
  _id: string;
  planName: string;
  coverage: string;
  priceMMK: number;
  priceUSD: number;
  duration: string;
  benefits: string[];
  description?: string;
  image?: string;
  images?: string[];
}

export default function InsuranceDetailPage() {
  const { t, lang } = useI18n();
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [rawPlan, setRawPlan] = useState<InsurancePlan | null>(null);
  const plan = useMemo(() => {
    if (lang !== "mm" || !rawPlan) return rawPlan;
    return { ...rawPlan, ...mmLookup(mmInsurance, rawPlan) };
  }, [rawPlan, lang]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [travelers, setTravelers] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchPlan = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/insurance');
        const json = await res.json();
        const plans: InsurancePlan[] = json?.data || [];
        const found = plans.find((p: InsurancePlan) => {
          const planSlug = (p.planName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return planSlug === slug || p._id === slug;
        }) || null;
        if (found) {
          setRawPlan(found);
        } else {
          const fallback = FALLBACK_PLANS.find(p => p._id === slug || (p.planName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
          if (fallback) {
            setRawPlan(fallback as InsurancePlan);
          } else {
            setError('Insurance plan not found');
          }
        }
      } catch (err) {
        console.error('Failed to fetch insurance plan:', err);
        const fallback = FALLBACK_PLANS.find(p => p._id === slug || (p.planName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
        if (fallback) {
          setRawPlan(fallback as InsurancePlan);
        } else {
          setError('Insurance plan not found');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [slug]);

  const heroImage = plan?.images?.[0] || plan?.image || '/images_v2/ins1-v2.jpg';
  const displayHero = imgError ? '/images_v2/ins1-v2.jpg' : heroImage;
  const price = currency === 'MMK' ? (plan?.priceMMK ?? 0) : (plan?.priceUSD ?? 0);
  const currencySymbol = currency === 'MMK' ? 'Ks' : '$';
  const totalPrice = price * travelers;

  const handleBookNow = () => {
    if (!plan) return;
    const bookUrl = new URL('/book-now', window.location.origin);
    bookUrl.searchParams.set('type', 'insurance');
    bookUrl.searchParams.set('title', plan.planName);
    bookUrl.searchParams.set('duration', plan.duration);
    bookUrl.searchParams.set('price', String(price));
    bookUrl.searchParams.set('currency', currency);
    bookUrl.searchParams.set('travelers', String(travelers));
    bookUrl.searchParams.set('travelDate', travelDate);
    window.location.href = bookUrl.toString();
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-4">
          <BackButton />
        </div>
        <div className="h-[60vh] bg-white/5 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="h-8 bg-white/10 rounded w-1/3 mb-4 animate-pulse" />
          <div className="h-4 bg-white/10 rounded w-1/4 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-4 bg-white/10 rounded animate-pulse" />
              <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse" />
            </div>
            <div className="h-64 bg-white/5 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
          <BackButton />
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-center space-y-4">
            <svg className="w-16 h-16 mx-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl text-[#0A1628] font-semibold">{t("ins.errorTitle")}</h2>
            <p className="text-gray-500">{error || 'Insurance plan not found'}</p>
            <button
              onClick={() => router.push('/insurance')}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold"
            >
              Back to Insurance
            </button>
          </div>
        </div>
      </div>
    );
  }

  const name = plan.planName || '';
  const coverage = plan.coverage || '';
  const benefits: string[] = Array.isArray((plan as any).benefits) ? (plan as any).benefits : (typeof (plan as any).benefits === 'string' ? (plan as any).benefits.split(',').map((s: string) => s.trim()).filter(Boolean) : []);
  const duration = plan.duration || 'Per trip';

  return (
    <ErrorBoundary>
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <BackButton />

      {/* Hero image */}
      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <Link href="/insurance" className="absolute top-24 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all text-sm">
          ← Back to Insurance
        </Link>
        <Image
          src={displayHero}
          alt={name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/90 text-gray-900 text-sm font-semibold">
              🛡️ Travel Insurance
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm">
              {duration}
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {name}
          </h1>
          <p className="text-white/80 text-lg">{coverage}</p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm">
        <Link href="/" className="text-gray-500 hover:text-[#D4AF37]">{t("ins.home")}</Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link href="/insurance" className="text-gray-500 hover:text-[#D4AF37]">{t("ins.insurance")}</Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-[#0A1628] font-medium">{name}</span>
      </nav>

      <SocialShare url={typeof window !== "undefined" ? window.location.href : ""} title={"A9 Global Travel - Insurance"} />

      {/* Content + Sidebar */}
      <section className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold">Ks {plan.priceMMK.toLocaleString()}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">{t("ins.priceMMK")}</p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold">{duration}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">{t("ins.duration")}</p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold">{benefits.length}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">{t("ins.benefits")}</p>
              </div>
            </div>

            {/* Coverage Details */}
            <div>
              <h2 className="text-2xl font-bold text-[#0A1628] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Coverage Details
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">
                {coverage || 'Comprehensive travel insurance coverage for your peace of mind.'}
              </p>
            </div>

            {/* Benefits */}
            {benefits.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#0A1628] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Included Benefits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {benefits.map((b: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/15 text-[#0A1628] text-sm font-medium hover:bg-[#D4AF37]/10 transition-colors">
                      <svg className="w-4 h-4 text-[#D4AF37] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Plan Summary Card */}
            <div className="bg-[#0A1628] rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Plan Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">{t("ins.priceMMK")}</p>
                    <p className="text-white font-medium">Ks {plan.priceMMK.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">{t("ins.priceUSD")}</p>
                    <p className="text-white font-medium">${plan.priceUSD.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">{t("ins.duration")}</p>
                    <p className="text-white font-medium">{duration}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Booking Card — Tours-style interactive booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-[#D4AF37]/20 bg-white shadow-lg p-6 space-y-6">
              {/* Price */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-[#D4AF37]">
                    {currencySymbol}{' '}{price.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">{t("common.perPerson")}</span>
                </div>
                <CurrencyToggle activeCurrency={currency} onToggle={setCurrency} />
              </div>

              <hr className="border-gold/10" />

              {/* Quick info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("ins.duration")}</span>
                  <span className="text-[#0A1628]">{duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("ins.coverage")}</span>
                  <span className="text-[#0A1628]">{coverage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("ins.benefits")}</span>
                  <span className="text-[#0A1628]">{t("ins.coverages", { n: benefits.length })}</span>
                </div>
              </div>

              <hr className="border-gold/10" />

              {/* Booking form */}
              <div className="space-y-3">
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">{t("ins.travelDate")}</label>
                  <Calendar value={travelDate} onChange={setTravelDate} label={t("ins.travelDate")} />
                </div>
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">{t("ins.travelers")}</label>
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
                      onClick={() => setTravelers(Math.min(50, travelers + 1))}
                      className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-3 border-t border-gold/10">
                <span className="text-gray-700 font-medium">{t("ins.total")}</span>
                <span className="text-2xl font-bold text-[#D4AF37]">
                  {currencySymbol}{' '}{totalPrice.toLocaleString()}
                </span>
              </div>

              {/* Book Now */}
              <button
                onClick={handleBookNow}
                disabled={!plan}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#E5C048] hover:to-[#D4AF37] text-gray-900 font-bold text-lg shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#D4AF37] disabled:hover:to-[#C5A028]"
              >
                Book Now
              </button>

              <p className="text-center text-gray-500 text-xs">{t("ins.noPayment")}</p>
            </div>

            <Link
              href="/insurance"
              className="block w-full py-3 rounded-xl text-center font-semibold text-sm border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A1628] transition-all duration-300"
            >
              ← Back to All Insurance
            </Link>
          </div>
        </div>
      </section>

      <ErrorBoundary fallback={null}>
        <RelatedItems section="insurance" excludeSlug={slug} />
      </ErrorBoundary>
    </main>
    </ErrorBoundary>
  );
}