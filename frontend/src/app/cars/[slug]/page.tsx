'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import CurrencyToggle from '@/components/CurrencyToggle';
import BookingModal from '@/components/BookingModal';
import { getCar, Car } from '@/lib/api';

const PLACEHOLDER_IMG =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiMxQTFBMkUiLz48dGV4dCB4PSI2MDAiIHk9IjMwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NiIgZm9udC1mYW1pbHk9Ikdlb3JnaWEiIGZvbnQtc2l6ZT0iMjQiPkE5IEdsb2JhbCAmIzE4MzsgQ2FyczwvdGV4dD48L3N2Zz4=';

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [imgError, setImgError] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPricingIndex, setSelectedPricingIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    const fetchCar = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getCar(slug);
        setCar(response.data);
      } catch (err) {
        console.error('Failed to fetch car:', err);
        setError('Failed to load car details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [slug]);

  const heroImage = car?.images?.[0] || PLACEHOLDER_IMG;
  const displayHero = imgError ? PLACEHOLDER_IMG : heroImage;

  const pricingTiers = car?.pricingWithDriver || [];
  const selectedPricing = pricingTiers[selectedPricingIndex];

  const displayPrice = selectedPricing
    ? currency === 'MMK'
      ? selectedPricing.priceMMK
      : selectedPricing.priceUSD
    : 0;
  const currencySymbol = currency === 'MMK' ? 'Ks' : '$';

  const features = car?.features || [];

  const handleBookNow = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('a9token') : null;
    if (!token) {
      router.push('/auth/login');
      return;
    }
    setShowBookingModal(true);
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
        <div className="h-[60vh] bg-white/5 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="h-8 bg-white/10 rounded w-1/3 mb-4 animate-pulse" />
          <div className="h-4 bg-white/10 rounded w-1/4 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-4 bg-white/10 rounded animate-pulse" />
              <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
            </div>
            <div className="h-64 bg-white/5 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error || !car) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <svg className="w-16 h-16 mx-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="text-xl text-white font-semibold">Something went wrong</h2>
          <p className="text-gray-400">{error || 'Car not found'}</p>
          <button
            onClick={() => router.push('/cars')}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold"
          >
            Back to Cars
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] overflow-hidden">
        <Image
          src={displayHero}
          alt={car.carType}
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
              {car.carType}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 text-white text-sm font-medium backdrop-blur-sm border border-white/10">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {car.capacity} seats
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl text-white font-bold"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {car.carType}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div>
              <h3 className="text-xl text-white font-semibold mb-4">About This Vehicle</h3>
              <p className="text-gray-300 leading-relaxed">
                {car.description || `Experience comfort and reliability with our ${car.carType}. Perfect for your travel needs, featuring professional driver service and well-maintained vehicles.`}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-gold/10 text-center">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold">{car.capacity}</p>
                <p className="text-gray-400 text-sm">Seats</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-gold/10 text-center">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold">✓</p>
                <p className="text-gray-400 text-sm">Insured</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-gold/10 text-center">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold">👨‍✈️</p>
                <p className="text-gray-400 text-sm">With Driver</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-gold/10 text-center">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold">24/7</p>
                <p className="text-gray-400 text-sm">Available</p>
              </div>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div>
                <h3 className="text-xl text-white font-semibold mb-4">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gold/20 bg-white/5"
                    >
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Tiers */}
            {pricingTiers.length > 0 && (
              <div>
                <h3 className="text-xl text-white font-semibold mb-4">Pricing Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pricingTiers.map((tier, idx) => {
                    const p = currency === 'MMK' ? tier.priceMMK : tier.priceUSD;
                    const isSelected = selectedPricingIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedPricingIndex(idx)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 text-center ${
                          isSelected
                            ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-lg shadow-[#D4AF37]/5 scale-[1.03]'
                            : 'border-gold/20 bg-white/5 hover:border-gold/40'
                        }`}
                      >
                        <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
                          <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h4 className="text-white font-semibold mb-1">{tier.duration}</h4>
                        <p className="text-[#D4AF37] text-2xl font-bold">
                          {currencySymbol} {p.toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gold/20 bg-white/5 backdrop-blur-sm p-6 space-y-6">
              {/* Price */}
              <div className="flex items-center justify-between">
                <div>
                  {selectedPricing ? (
                    <>
                      <span className="text-3xl font-bold text-[#D4AF37]">
                        {currencySymbol} {displayPrice.toLocaleString()}
                      </span>
                      <p className="text-gray-400 text-xs mt-0.5">{selectedPricing.duration}</p>
                    </>
                  ) : (
                    <span className="text-gray-500 text-lg">Contact for pricing</span>
                  )}
                </div>
                <CurrencyToggle activeCurrency={currency} onToggle={setCurrency} />
              </div>

              <hr className="border-gold/10" />

              {/* Quick info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Vehicle</span>
                  <span className="text-white">{car.carType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Capacity</span>
                  <span className="text-white">{car.capacity} seats</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Driver</span>
                  <span className="text-green-400">Included ✓</span>
                </div>
                {features.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Features</span>
                    <span className="text-white">{features.length}+</span>
                  </div>
                )}
              </div>

              <hr className="border-gold/10" />

              {/* Total */}
              {selectedPricing && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Price</span>
                  <span className="text-2xl font-bold text-[#D4AF37]">
                    {currencySymbol} {displayPrice.toLocaleString()}
                  </span>
                </div>
              )}

              <button
                onClick={handleBookNow}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#E5C048] hover:to-[#D4AF37] text-gray-900 font-bold text-lg shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 transition-all duration-300 active:scale-[0.98]"
              >
                Book Now
              </button>

              <p className="text-center text-gray-500 text-xs">No payment required to book</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        itemType="car"
        itemId={car._id}
        itemName={car.carType}
        itemSubtitle={selectedPricing ? selectedPricing.duration : undefined}
        unitPrice={currency === 'MMK' ? (selectedPricing?.priceMMK || 0) : (selectedPricing?.priceUSD || 0)}
        currency={currency}
        unitLabel="day"
        maxQuantity={10}
      />
    </main>
  );
}
