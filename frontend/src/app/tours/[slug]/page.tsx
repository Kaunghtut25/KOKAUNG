'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CurrencyToggle from '@/components/CurrencyToggle';
import SocialShare from '@/components/SocialShare';
import { getTour, Tour, ItineraryDay } from '@/lib/api';
import RelatedItems from '@/components/RelatedItems';
import BackButton from '@/components/BackButton';
import Calendar from '@/components/Calendar';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useI18n } from '@/lib/i18n';
import { mmTours } from '@/lib/mm-content';
import { generateItinerary, parseDays } from '@/lib/tourItinerary';
type TabKey = 'overview' | 'itinerary' | 'included' | 'reviews';

// ─── Fallback tours when API is unavailable ─────────────────



const PLACEHOLDER_IMG =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiMxQTFBMkUiLz48dGV4dCB4PSI2MDAiIHk9IjMwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NiIgZm9udC1mYW1pbHk9Ikdlb3JnaWEiIGZvbnQtc2l6ZT0iMjQiPkE5IEdsb2JhbCAmIzE4MzsgVG91cnM8L3RleHQ+PC9zdmc+';

// ─── Itinerary generator helpers ─────────────────────────
interface BookingFormData {
  travelDate: string;
  travelers: number;
  specialRequests: string;
  paymentMethod: 'kbzpay' | 'wavepay' | 'bank_transfer';
}

export default function TourDetailPage() {
  const { t, lang } = useI18n();
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [rawTour, setRawTour] = useState<Tour | null>(null);
  const tour = useMemo(() => {
    if (lang !== "mm" || !rawTour) return rawTour;
    return { ...rawTour, ...(mmTours[rawTour.slug] || {}) };
  }, [rawTour, lang]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [imgError, setImgError] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState<'form' | 'payment'>('form');

  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    travelDate: '',
    travelers: 1,
    specialRequests: '',
    paymentMethod: 'kbzpay',
  });

  useEffect(() => {
    if (!slug) return;

    const fetchTour = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getTour(slug);
        setRawTour(response.data);
        if (!response.data) throw new Error('Not found');
      } catch (err) {
        console.error('Failed to fetch tour:', err);
        setError('Tour not found');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [slug]);

  const handleBookNow = () => {
    if (!tour) return;
    const bookUrl = new URL('/book-now', window.location.origin);
    bookUrl.searchParams.set('type', 'tour');
    bookUrl.searchParams.set('tour', tour.slug || tour._id);
    bookUrl.searchParams.set('title', tour.title);
    bookUrl.searchParams.set('destination', tour.destination);
    bookUrl.searchParams.set('duration', tour.duration + ' ' + tour.durationUnit);
    bookUrl.searchParams.set('price', String(price));
    bookUrl.searchParams.set('currency', currency);
    router.push(bookUrl.toString());
  };

  const handleProceedToPayment = () => {
    if (!bookingForm.travelDate) return;
    setBookingStep('payment');
  };

  const handleConfirmBooking = () => {
    if (!tour) return;
    const bookUrl = new URL('/book-now', window.location.origin);
    bookUrl.searchParams.set('type', 'tour');
    bookUrl.searchParams.set('tour', tour.slug || tour._id);
    bookUrl.searchParams.set('title', tour.title);
    bookUrl.searchParams.set('destination', tour.destination);
    bookUrl.searchParams.set('duration', tour.duration + ' ' + tour.durationUnit);
    bookUrl.searchParams.set('price', String(price));
    bookUrl.searchParams.set('travelers', String(bookingForm.travelers));
    bookUrl.searchParams.set('date', bookingForm.travelDate);
    bookUrl.searchParams.set('currency', currency);
    bookUrl.searchParams.set('requests', bookingForm.specialRequests);
    router.push(bookUrl.toString());
  };

  const generatedItinerary = useMemo(
    () => generateItinerary(parseDays(tour?.duration || ''), tour?.destination || '', lang === "mm" ? t : undefined),
    [tour?.duration, tour?.destination, lang]
  );

  // FIX 2026-08-12: prefer DB itinerary (editable via Admin) when present; fall back to auto-generated
  const displayItinerary = useMemo(
    () => (tour?.itinerary && tour.itinerary.length > 0 ? tour.itinerary : generatedItinerary),
    [tour?.itinerary, generatedItinerary]
  );

    // Dynamic tabs from site config — filter visible and respect ordering
  const [detailPageTabs, setDetailPageTabs] = useState<{ key: string; label: string; visible: boolean }[]>([]);
  useEffect(() => {
    fetch('/api/admin/site-config')
      .then(r => r.json())
      .then(cfg => {
        if (cfg?.detailPageTabs?.tours) {
          setDetailPageTabs(cfg.detailPageTabs.tours);
        } else {
          setDetailPageTabs([
            { key: 'overview', label: 'Overview', visible: true },
            { key: 'itinerary', label: 'Itinerary', visible: true },
            { key: 'included', label: 'Included / Excluded', visible: true },
            { key: 'reviews', label: 'Reviews', visible: false },
          ]);
        }
      })
      .catch(() => {
        setDetailPageTabs([
          { key: 'overview', label: 'Overview', visible: true },
          { key: 'itinerary', label: 'Itinerary', visible: true },
          { key: 'included', label: 'Included / Excluded', visible: true },
          { key: 'reviews', label: 'Reviews', visible: false },
        ]);
      });
  }, []);

  const tabs = detailPageTabs
    .filter((tab) => tab.visible)
    .map((tab) => ({
      key: tab.key as TabKey,
      label:
        lang === "mm" && ["overview", "itinerary", "included", "reviews"].includes(tab.key)
          ? t("tour.tab" + tab.key.charAt(0).toUpperCase() + tab.key.slice(1))
          : tab.label,
    }));

  // ─── Loading State ────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-4">
          <BackButton label={t("common.backToTours")} />
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

  // ─── Error State ─────────────────────────────────────────
  if (error || !tour) {
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
            <h2 className="text-xl text-[#0A1628] font-semibold">{t("tour.errorTitle")}</h2>
            <p className="text-gray-500">{error || 'Tour not found'}</p>
            <button
              onClick={() => router.push('/search')}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold inline-block"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Content ───────────────────────────────────────
  return (
    <ErrorBoundary>
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Back Button */}
      <BackButton />

      {/* Hero image */}
      <section className="relative w-full h-[60vh] overflow-hidden">
        <Link href="/tours" className="absolute top-24 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all text-sm">
          ← Back to Tours
        </Link>
        <Image
          src={displayHero}
          alt={tour.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          onError={() => setImgError(true)}
          unoptimized={displayHero === PLACEHOLDER_IMG}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/90 text-gray-900 text-sm font-semibold">
              {tour.destination}
            </span>
            <span className="flex items-center gap-1">{renderStars(tour.rating)}</span>
            <span className="text-white/70 text-sm">({tour.reviewCount} reviews)</span>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {tour.title}
          </h1>
          <p className="text-white/80 text-lg">
            {tour.duration} {tour.durationUnit} • Up to {tour.groupSize} people
          </p>
        </div>
      </section>

      {/* Content + Sidebar */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Tab navigation */}
            <div className="flex border-b border-gold/20 mb-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'border-[#D4AF37] text-[#D4AF37]'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl text-[#0A1628] font-semibold mb-4">{t("tour.about")}</h2>
                  <p className="text-gray-700 leading-relaxed">{tour.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <p className="text-[#8A6C0B] text-2xl font-bold">{tour.duration}</p>
                    <p className="text-gray-600 text-sm">{tour.durationUnit}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <p className="text-[#8A6C0B] text-2xl font-bold">{tour.groupSize}</p>
                    <p className="text-gray-600 text-sm">{t("tour.maxGroupSize")}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <p className="text-[#8A6C0B] text-2xl font-bold">★ {tour.rating}</p>
                    <p className="text-gray-600 text-sm">{t("tour.rating")}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <p className="text-[#8A6C0B] text-2xl font-bold">{tour.reviewCount}</p>
                    <p className="text-gray-600 text-sm">{t("tour.reviews")}</p>
                  </div>
                </div>

                {tour.amenities && tour.amenities.length > 0 && (
                  <div>
                    <h2 className="text-xl text-[#0A1628] font-semibold mb-4">{t("tour.amenities")}</h2>
                    <div className="flex flex-wrap gap-2">
                      {tour.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-full bg-[#D4AF37]/10 text-[#7A5F08] text-sm border border-[#D4AF37]/20"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tour Itinerary */}
                {displayItinerary.length > 0 && (
                  <div>
                    <h2
                      className="text-xl text-[#0A1628] font-semibold mb-6"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Tour Itinerary
                    </h2>
                    <div className="space-y-4">
                      {displayItinerary.map((day: any) => (
                        <div
                          key={day.day}
                          className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#0A1628] to-[#0F2035] p-5 transition-all duration-300 hover:border-[#D4AF37]/40 hover:shadow-lg hover:shadow-[#D4AF37]/10"
                        >
                          <div className="flex items-start gap-4">
                            {/* Gold day number badge */}
                            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#C5A028] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                              <div className="text-center">
                                <span className="block text-xs text-gray-900/70 font-medium leading-tight">{t("tour.day")}</span>
                                <span className="block text-gray-900 text-xl font-bold leading-tight">{day.day}</span>
                              </div>
                            </div>

                            {/* Day content */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-semibold text-base mb-1.5">
                                {day.title}
                              </h3>
                              <p className="text-gray-500 text-sm leading-relaxed">
                                {day.description}
                              </p>
                              {day.meals.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                  {day.meals.map((meal) => (
                                    <span
                                      key={meal}
                                      className="px-2.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#7A5F08] text-xs font-medium border border-[#D4AF37]/20"
                                    >
                                      🍽 {t("tour.meal." + meal.toLowerCase())}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Itinerary */}
            {activeTab === 'itinerary' && (
              <div className="space-y-0">
                {(displayItinerary as any[]).map((day: any, idx: number) => (
                  <div key={idx} className="relative flex gap-4 pb-8">
                    {/* Timeline accent line */}
                    {idx < displayItinerary.length - 1 && (
                      <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-[#D4AF37]/50 to-transparent" />
                    )}

                    {/* Day circle */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A028] flex items-center justify-center text-gray-900 font-bold text-sm z-10">
                      {day.day}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <h3 className="text-[#0A1628] font-semibold text-lg mb-1">{day.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{day.description}</p>
                      {day.meals && day.meals.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {day.meals.map((meal, mi) => (
                            <span key={mi} className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-xs border border-orange-500/20">
                              {meal}
                            </span>
                          ))}
                        </div>
                      )}
                      {day.accommodation && (
                        <p className="text-gray-500 text-xs mt-1">🏨 {day.accommodation}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Included / Excluded */}
            {activeTab === 'included' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Included */}
                <div>
                  <h3 className="text-xl text-[#0A1628] font-semibold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Included
                  </h3>
                  <ul className="space-y-3">
                    {(tour.included || []).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                    {(tour.included || []).length === 0 && (
                      <li className="text-gray-500">{t("tour.noItems")}</li>
                    )}
                  </ul>
                </div>

                {/* Excluded */}
                <div>
                  <h3 className="text-xl text-[#0A1628] font-semibold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Excluded
                  </h3>
                  <ul className="space-y-3">
                    {(tour.excluded || []).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {item}
                      </li>
                    ))}
                    {(tour.excluded || []).length === 0 && (
                      <li className="text-gray-500">{t("tour.noItems")}</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gold/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-600 text-lg">{t("tour.reviewsComingSoon")}</p>
                <p className="text-gray-500 text-sm mt-1">{t("tour.reviewsSoonDesc")}</p>
              </div>
            )}
          </div>

          {/* Sidebar Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-[#D4AF37]/20 bg-white shadow-lg p-6 space-y-6">
              {/* Price */}
              <div className="flex items-center justify-between">
                <div>
                  {price > 0 ? (
                    <span className="text-3xl font-bold text-[#8A6C0B]">
                      {currencySymbol} {price.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-3xl font-bold text-[#8A6C0B]">{t("common.requestQuote")}</span>
                  )}
                  {price > 0 && <span className="text-gray-500 text-sm ml-1">{t("common.perPerson")}</span>}
                </div>
                <CurrencyToggle activeCurrency={currency} onToggle={setCurrency} />
              </div>

              <hr className="border-gold/10" />

              {/* Quick info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("tour.duration")}</span>
                  <span className="text-[#0A1628]">{tour.duration} {tour.durationUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("tour.groupSize")}</span>
                  <span className="text-[#0A1628]">{t("tour.upToPeople", { n: tour.groupSize })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("tour.rating")}</span>
                  <span className="text-[#0A1628] flex items-center gap-1">★ {tour.rating}</span>
                </div>
              </div>

              <hr className="border-gold/10" />

              {/* Booking form preview */}
              <div className="space-y-3">
                <div>
                                    <Calendar
                    value={bookingForm.travelDate}
                    onChange={(date) => setBookingForm((prev) => ({ ...prev, travelDate: date }))}
                    label={t("tour.travelDate")}
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">{t("tour.travelers")}</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setBookingForm((prev) => ({
                          ...prev,
                          travelers: Math.max(1, prev.travelers - 1),
                        }))
                      }
                      className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-12 text-center text-[#0A1628] font-semibold">{bookingForm.travelers}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setBookingForm((prev) => ({
                          ...prev,
                          travelers: Math.min(tour.groupSize, prev.travelers + 1),
                        }))
                      }
                      className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-3 border-t border-gold/10">
                <span className="text-gray-700 font-medium">{t("tour.total")}</span>
                {price > 0 ? (
                  <span className="text-2xl font-bold text-[#8A6C0B]">
                    {currencySymbol} {totalPrice.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-xl font-bold text-[#8A6C0B]">{t("common.requestQuote")}</span>
                )}
              </div>

              {/* Book Now */}
              <button
                onClick={handleBookNow}
                disabled={!tour}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#E5C048] hover:to-[#D4AF37] text-gray-900 font-bold text-lg shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#D4AF37] disabled:hover:to-[#C5A028]"
              >
                {t("common.bookNow")}
              </button>

              <p className="text-center text-gray-500 text-xs">{t("tour.noPayment")}</p>
            </div>
            <Link
              href="/tours"
              className="block w-full py-3 rounded-xl text-center font-semibold text-sm border-2 border-[#D4AF37] text-[#8A6C0B] hover:bg-[#D4AF37] hover:text-[#0A1628] transition-all duration-300"
            >
              ← Back to All Tours
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Booking Modal ───────────────────────────────── */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowBookingModal(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg bg-white border border-gray-200 shadow-xl rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gold/50 transition-colors flex items-center justify-center"
            >
              ✕
            </button>

            {bookingStep === 'form' ? (
              <>
                <h2 className="text-2xl text-[#0A1628] font-bold mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Confirm Your Booking
                </h2>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="text-[#0A1628] font-semibold">{tour.title}</p>
                    <p className="text-gray-500 text-sm">{tour.destination} • {tour.duration} {tour.durationUnit}</p>
                  </div>

                  <div>
                                        <Calendar
                      value={bookingForm.travelDate}
                      onChange={(date) => setBookingForm((prev) => ({ ...prev, travelDate: date }))}
                      label={t("tour.travelDate")}
                    />
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm mb-1 block">{t("tour.numTravelers")}</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBookingForm((prev) => ({ ...prev, travelers: Math.max(1, prev.travelers - 1) }))}
                        className="w-10 h-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors text-lg"
                      >
                        −
                      </button>
                      <span className="w-16 text-center text-white font-bold text-lg">{bookingForm.travelers}</span>
                      <button
                        type="button"
                        onClick={() => setBookingForm((prev) => ({ ...prev, travelers: Math.min(tour.groupSize, prev.travelers + 1) }))}
                        className="w-10 h-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm mb-1 block">{t("tour.specialRequests")}</label>
                    <textarea
                      value={bookingForm.specialRequests}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, specialRequests: e.target.value }))}
                      placeholder={t("tour.specialRequestsPh")}
                      rows={3}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-gold/50 resize-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex justify-between items-center">
                    <span className="text-gray-700">Total ({bookingForm.travelers} travelers)</span>
                    <span className="text-xl font-bold text-[#8A6C0B]">
                      {currencySymbol} {totalPrice.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    disabled={!bookingForm.travelDate}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#E5C048] hover:to-[#D4AF37] text-gray-900 font-bold text-lg shadow-lg shadow-[#D4AF37]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl text-[#0A1628] font-bold mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Select Payment Method
                </h2>

                <div className="space-y-3 mb-6">
                  {(['kbzpay', 'wavepay', 'bank_transfer'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setBookingForm((prev) => ({ ...prev, paymentMethod: method }))}
                      className={`w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all duration-200 ${
                        bookingForm.paymentMethod === method
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                          : 'border-gold/20 bg-white/5 hover:border-gold/30'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          bookingForm.paymentMethod === method ? 'border-[#D4AF37]' : 'border-gray-600'
                        }`}
                      >
                        {bookingForm.paymentMethod === method && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                        )}
                      </div>
                      <div>
                        <p className="text-[#0A1628] font-medium">
                          {method === 'kbzpay' ? 'KBZPay' : method === 'wavepay' ? 'WavePay' : 'Bank Transfer'}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {method === 'kbzpay' && 'Scan QR with KBZPay app'}
                          {method === 'wavepay' && 'Scan QR with WavePay app'}
                          {method === 'bank_transfer' && 'Transfer to our bank account'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleConfirmBooking}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#E5C048] hover:to-[#D4AF37] text-gray-900 font-bold text-lg shadow-lg shadow-[#D4AF37]/20 transition-all duration-300"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => setBookingStep('form')}
                  className="w-full py-2 mt-2 text-gray-500 hover:text-gray-900 text-sm transition-colors"
                >
                  ← Back
                </button>
              </>
            )}
          </div>
        </div>
      )}
            <ErrorBoundary fallback={null}>
        <RelatedItems section="tours" excludeSlug={slug} destination={typeof tour?.destination === "string" ? tour.destination : ""} />
      </ErrorBoundary>
</main>
    </ErrorBoundary>
  );
}
