'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import CurrencyToggle from '@/components/CurrencyToggle';
import SocialShare from '@/components/SocialShare';
import { getTour, Tour, ItineraryDay } from '@/lib/api';
import RelatedItems from '@/components/RelatedItems';
import BackButton from '@/components/BackButton';
type TabKey = 'overview' | 'itinerary' | 'included' | 'reviews';

const PLACEHOLDER_IMG =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiMxQTFBMkUiLz48dGV4dCB4PSI2MDAiIHk9IjMwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NiIgZm9udC1mYW1pbHk9Ikdlb3JnaWEiIGZvbnQtc2l6ZT0iMjQiPkE5IEdsb2JhbCAmIzE4MzsgVG91cnM8L3RleHQ+PC9zdmc+';

// ─── Itinerary generator helpers ─────────────────────────
function parseDays(durationStr: string): number {
  const match = durationStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

interface GeneratedDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
}

function generateItinerary(days: number, destination: string): GeneratedDay[] {
  if (days <= 0) return [];

  const middleTemplates: { title: string; description: string; meals: string[] }[] = [
    {
      title: 'Exploration',
      description: `Discover the highlights of ${destination} with a guided tour of the most iconic landmarks and attractions. Immerse yourself in the rich history and vibrant atmosphere of this incredible destination.`,
      meals: ['Breakfast', 'Lunch'],
    },
    {
      title: 'Cultural Experience',
      description: `Dive deep into the local culture with visits to traditional markets, artisan workshops, and historic sites. Interact with local communities and learn about their way of life in ${destination}.`,
      meals: ['Breakfast'],
    },
    {
      title: 'Leisure & Relaxation',
      description: `Enjoy a free day at your own pace. Explore the surroundings, relax at the hotel, or opt for optional excursions. This is your day to create your own adventure in ${destination}.`,
      meals: ['Breakfast'],
    },
    {
      title: 'Nature & Adventure',
      description: `Venture into the natural wonders surrounding ${destination}. Experience breathtaking landscapes, scenic trails, and outdoor activities that showcase the region's natural beauty.`,
      meals: ['Breakfast', 'Lunch'],
    },
    {
      title: 'Hidden Gems',
      description: `Go off the beaten path to discover ${destination}'s hidden treasures. Visit lesser-known spots, secret viewpoints, and local favorites that most tourists miss.`,
      meals: ['Breakfast'],
    },
    {
      title: 'Gastronomic Journey',
      description: `Embark on a culinary adventure through ${destination}. Visit local food markets, participate in a cooking class, and savor authentic dishes at handpicked restaurants.`,
      meals: ['Breakfast', 'Lunch', 'Dinner'],
    },
  ];

  const itinerary: GeneratedDay[] = [];

  for (let d = 1; d <= days; d++) {
    let dayPlan: { title: string; description: string; meals: string[] };

    if (d === 1) {
      dayPlan = {
        title: 'Arrival',
        description: `Welcome to ${destination}! Upon arrival, you will be greeted by our representative and transferred to your hotel. Take the rest of the day to relax and settle in. In the evening, enjoy a welcome dinner featuring local cuisine.`,
        meals: ['Dinner'],
      };
    } else if (d === days) {
      dayPlan = {
        title: 'Departure',
        description: `After breakfast, check out from the hotel. Our representative will transfer you to the airport for your onward journey. Take home unforgettable memories of ${destination}!`,
        meals: ['Breakfast'],
      };
    } else {
      const templateIndex = (d - 2) % middleTemplates.length;
      dayPlan = middleTemplates[templateIndex];
    }

    itinerary.push({ day: d, ...dayPlan });
  }

  return itinerary;
}

interface BookingFormData {
  travelDate: string;
  travelers: number;
  specialRequests: string;
  paymentMethod: 'kbzpay' | 'wavepay' | 'bank_transfer';
}

export default function TourDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [tour, setTour] = useState<Tour | null>(null);
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
        setTour(response.data);
      } catch (err) {
        console.error('Failed to fetch tour:', err);
        setError('Failed to load tour details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [slug]);

  const heroImage = tour?.images?.[0] || PLACEHOLDER_IMG;
  const displayHero = imgError ? PLACEHOLDER_IMG : heroImage;
  const price = currency === 'MMK' ? tour?.priceMMK ?? 0 : tour?.priceUSD ?? 0;
  const currencySymbol = currency === 'MMK' ? 'Ks' : '$';
  const totalPrice = price * bookingForm.travelers;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < Math.round(rating) ? 'text-[#D4AF37]' : 'text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

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
    () => generateItinerary(parseDays(tour?.duration || ''), tour?.destination || ''),
    [tour?.duration, tour?.destination]
  );

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'itinerary', label: 'Itinerary' },
    { key: 'included', label: 'Included / Excluded' },
    { key: 'reviews', label: 'Reviews' },
  ];

  // ─── Loading State ────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
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
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <svg className="w-16 h-16 mx-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="text-xl text-[#0A1628] font-semibold">Something went wrong</h2>
          <p className="text-gray-500">{error || 'Tour not found'}</p>
          <button
            onClick={() => router.push('/search')}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold inline-block"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  // ─── Main Content ───────────────────────────────────────
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Back Button */}
      <BackButton />

      {/* Hero image */}
      <section className="relative w-full h-[60vh] overflow-hidden">
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
                  <h3 className="text-xl text-[#0A1628] font-semibold mb-4">About This Tour</h3>
                  <p className="text-gray-700 leading-relaxed">{tour.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <p className="text-[#D4AF37] text-2xl font-bold">{tour.duration}</p>
                    <p className="text-gray-600 text-sm">{tour.durationUnit}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <p className="text-[#D4AF37] text-2xl font-bold">{tour.groupSize}</p>
                    <p className="text-gray-600 text-sm">Max Group Size</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <p className="text-[#D4AF37] text-2xl font-bold">★ {tour.rating}</p>
                    <p className="text-gray-600 text-sm">Rating</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <p className="text-[#D4AF37] text-2xl font-bold">{tour.reviewCount}</p>
                    <p className="text-gray-600 text-sm">Reviews</p>
                  </div>
                </div>

                {tour.amenities && tour.amenities.length > 0 && (
                  <div>
                    <h3 className="text-xl text-[#0A1628] font-semibold mb-4">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {tour.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-sm border border-[#D4AF37]/20"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tour Itinerary */}
                {generatedItinerary.length > 0 && (
                  <div>
                    <h3
                      className="text-xl text-[#0A1628] font-semibold mb-6"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      Tour Itinerary
                    </h3>
                    <div className="space-y-4">
                      {generatedItinerary.map((day) => (
                        <div
                          key={day.day}
                          className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#0A1628] to-[#0F2035] p-5 transition-all duration-300 hover:border-[#D4AF37]/40 hover:shadow-lg hover:shadow-[#D4AF37]/10"
                        >
                          <div className="flex items-start gap-4">
                            {/* Gold day number badge */}
                            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#C5A028] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                              <div className="text-center">
                                <span className="block text-xs text-gray-900/70 font-medium leading-tight">Day</span>
                                <span className="block text-gray-900 text-xl font-bold leading-tight">{day.day}</span>
                              </div>
                            </div>

                            {/* Day content */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-semibold text-base mb-1.5">
                                {day.title}
                              </h4>
                              <p className="text-gray-400 text-sm leading-relaxed">
                                {day.description}
                              </p>
                              {day.meals.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                  {day.meals.map((meal) => (
                                    <span
                                      key={meal}
                                      className="px-2.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-medium border border-[#D4AF37]/20"
                                    >
                                      🍽 {meal}
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
                {(generatedItinerary).map((day: GeneratedDay, idx: number) => (
                  <div key={idx} className="relative flex gap-4 pb-8">
                    {/* Timeline accent line */}
                    {idx < generatedItinerary.length - 1 && (
                      <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-[#D4AF37]/50 to-transparent" />
                    )}

                    {/* Day circle */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A028] flex items-center justify-center text-gray-900 font-bold text-sm z-10">
                      {day.day}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <h4 className="text-[#0A1628] font-semibold text-lg mb-1">{day.title}</h4>
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
                      <li className="text-gray-500">No items listed</li>
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
                      <li className="text-gray-500">No items listed</li>
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
                <p className="text-gray-600 text-lg">Reviews coming soon</p>
                <p className="text-gray-500 text-sm mt-1">We&apos;re working on collecting authentic reviews from our travelers.</p>
              </div>
            )}
          </div>

          {/* Sidebar Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gold/20 bg-white/5 backdrop-blur-sm p-6 space-y-6">
              {/* Price */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-[#D4AF37]">
                    {currencySymbol} {price.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">/ person</span>
                </div>
                <CurrencyToggle activeCurrency={currency} onToggle={setCurrency} />
              </div>

              <hr className="border-gold/10" />

              {/* Quick info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="text-[#0A1628]">{tour.duration} {tour.durationUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Group Size</span>
                  <span className="text-[#0A1628]">Up to {tour.groupSize} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="text-[#0A1628] flex items-center gap-1">★ {tour.rating}</span>
                </div>
              </div>

              <hr className="border-gold/10" />

              {/* Booking form preview */}
              <div className="space-y-3">
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">Travel Date</label>
                  <input
                    type="date"
                    value={bookingForm.travelDate}
                    onChange={(e) => setBookingForm((prev) => ({ ...prev, travelDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-gold/50 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">Travelers</label>
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
                <span className="text-gray-700 font-medium">Total</span>
                <span className="text-2xl font-bold text-[#D4AF37]">
                  {currencySymbol} {totalPrice.toLocaleString()}
                </span>
              </div>

              {/* Book Now */}
              <button
                onClick={handleBookNow}
                disabled={!tour}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#E5C048] hover:to-[#D4AF37] text-gray-900 font-bold text-lg shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#D4AF37] disabled:hover:to-[#C5A028]"
              >
                Book Now
              </button>

              <p className="text-center text-gray-500 text-xs">No payment required to book</p>
            </div>
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
                    <label className="text-gray-600 text-sm mb-1 block">Travel Date</label>
                    <input
                      type="date"
                      value={bookingForm.travelDate}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, travelDate: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-gold/50 [color-scheme:dark]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-600 text-sm mb-1 block">Number of Travelers</label>
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
                    <label className="text-gray-600 text-sm mb-1 block">Special Requests</label>
                    <textarea
                      value={bookingForm.specialRequests}
                      onChange={(e) => setBookingForm((prev) => ({ ...prev, specialRequests: e.target.value }))}
                      placeholder="Any special requirements or preferences..."
                      rows={3}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-gold/50 resize-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex justify-between items-center">
                    <span className="text-gray-700">Total ({bookingForm.travelers} travelers)</span>
                    <span className="text-xl font-bold text-[#D4AF37]">
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
      <RelatedItems section="tours" />
</main>
  );
}
