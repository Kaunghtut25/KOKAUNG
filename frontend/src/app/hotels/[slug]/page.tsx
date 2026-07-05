'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import CurrencyToggle from '@/components/CurrencyToggle';
import BookingModal from '@/components/BookingModal';
import { getHotel, Hotel } from '@/lib/api';

type TabKey = 'overview' | 'amenities' | 'roomTypes' | 'location';

const PLACEHOLDER_IMG =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiMxQTFBMkUiLz48dGV4dCB4PSI2MDAiIHk9IjMwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NiIgZm9udC1mYW1pbHk9Ikdlb3JnaWEiIGZvbnQtc2l6ZT0iMjQiPkE5IEdsb2JhbCAmIzE4MzsgSG90ZWxzPC90ZXh0Pjwvc3ZnPg==';

interface RoomType {
  name: string;
  capacity: number;
  pricePerNightMMK: number;
  pricePerNightUSD: number;
  description: string;
}

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [imgError, setImgError] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Booking state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(1);

  useEffect(() => {
    if (!slug) return;
    const fetchHotel = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getHotel(slug);
        setHotel(response.data);
      } catch (err) {
        console.error('Failed to fetch hotel:', err);
        setError('Failed to load hotel details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [slug]);

  // Compute nights from dates
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diff = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      setNights(diff);
    }
  }, [checkIn, checkOut]);

  const heroImage = hotel?.images?.[0] || PLACEHOLDER_IMG;
  const displayHero = imgError ? PLACEHOLDER_IMG : heroImage;

  // Room types — derive from hotel data or use defaults
  const roomTypes: RoomType[] = [
    { name: 'Standard Room', capacity: 2, pricePerNightMMK: hotel?.pricePerNightMMK || 0, pricePerNightUSD: hotel?.pricePerNightUSD || 0, description: 'Comfortable room with essential amenities' },
    { name: 'Deluxe Room', capacity: 2, pricePerNightMMK: (hotel?.pricePerNightMMK || 0) * 1.5, pricePerNightUSD: (hotel?.pricePerNightUSD || 0) * 1.5, description: 'Spacious room with premium furnishings and view' },
    { name: 'Suite', capacity: 4, pricePerNightMMK: (hotel?.pricePerNightMMK || 0) * 2.5, pricePerNightUSD: (hotel?.pricePerNightUSD || 0) * 2.5, description: 'Luxury suite with separate living area' },
  ];

  const selectedRoom = roomTypes[selectedRoomIndex];
  const roomPrice = currency === 'MMK' ? selectedRoom.pricePerNightMMK : selectedRoom.pricePerNightUSD;
  const currencySymbol = currency === 'MMK' ? 'Ks' : '$';
  const totalPrice = roomPrice * nights;

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

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'amenities', label: 'Amenities' },
    { key: 'roomTypes', label: 'Room Types' },
    { key: 'location', label: 'Location' },
  ];

  const handleBookNow = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('a9token') : null;
    if (!token) {
      router.push('/auth/login');
      return;
    }
    if (!checkIn || !checkOut) return;
    router.push(
      `/booking?type=hotel&id=${hotel?._id}&quantity=${nights}&travelers=${guests}&date=${checkIn}`
    );
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
  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <svg className="w-16 h-16 mx-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="text-xl text-white font-semibold">Something went wrong</h2>
          <p className="text-gray-400">{error || 'Hotel not found'}</p>
          <button
            onClick={() => router.push('/hotels')}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold"
          >
            Back to Hotels
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
          alt={hotel.name}
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
              📍 {hotel.location}
            </span>
            <span className="flex items-center gap-1">{renderStars(hotel.rating)}</span>
            <span className="text-gray-400 text-sm">({hotel.reviewCount} reviews)</span>
            {hotel.availableRooms !== undefined && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  hotel.availableRooms === 0
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : hotel.availableRooms <= 3
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}
              >
                {hotel.availableRooms === 0
                  ? 'Sold Out'
                  : hotel.availableRooms <= 3
                  ? `Only ${hotel.availableRooms} left`
                  : `${hotel.availableRooms} rooms available`}
              </span>
            )}
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {hotel.name}
          </h1>
        </div>
      </section>

      {/* Content + Sidebar */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex border-b border-gold/20 mb-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'border-[#D4AF37] text-[#D4AF37]'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl text-white font-semibold mb-4">About This Hotel</h3>
                  <p className="text-gray-300 leading-relaxed">{hotel.description || 'Experience comfort and convenience at this wonderful property.'}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-gold/10 text-center">
                    <p className="text-[#D4AF37] text-2xl font-bold">★ {hotel.rating}</p>
                    <p className="text-gray-400 text-sm">Star Rating</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-gold/10 text-center">
                    <p className="text-[#D4AF37] text-2xl font-bold">{hotel.reviewCount}</p>
                    <p className="text-gray-400 text-sm">Reviews</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-gold/10 text-center">
                    <p className="text-[#D4AF37] text-2xl font-bold">🏨</p>
                    <p className="text-gray-400 text-sm">Check-in: 2PM</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-gold/10 text-center">
                    <p className="text-[#D4AF37] text-2xl font-bold">🕛</p>
                    <p className="text-gray-400 text-sm">Check-out: 12PM</p>
                  </div>
                </div>
              </div>
            )}

            {/* Amenities */}
            {activeTab === 'amenities' && (
              <div>
                <h3 className="text-xl text-white font-semibold mb-6">Hotel Amenities</h3>
                {hotel.amenities && hotel.amenities.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {hotel.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gold/20 bg-white/5 hover:border-gold/40 transition-colors"
                      >
                        <svg className="w-5 h-5 text-[#D4AF37] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Amenities information coming soon.</p>
                )}
              </div>
            )}

            {/* Room Types */}
            {activeTab === 'roomTypes' && (
              <div className="space-y-6">
                <h3 className="text-xl text-white font-semibold mb-4">Available Room Types</h3>
                {roomTypes.map((room, idx) => {
                  const p = currency === 'MMK' ? room.pricePerNightMMK : room.pricePerNightUSD;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedRoomIndex(idx)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                        selectedRoomIndex === idx
                          ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-lg shadow-[#D4AF37]/5'
                          : 'border-gold/20 bg-white/5 hover:border-gold/40'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-white font-semibold text-lg">{room.name}</h4>
                          <p className="text-gray-400 text-sm mt-1">{room.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Up to {room.capacity} guests
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-[#D4AF37] text-2xl font-bold">
                            {currencySymbol} {p.toLocaleString()}
                          </span>
                          <span className="text-gray-400 text-xs ml-1">/night</span>
                        </div>
                      </div>
                      {selectedRoomIndex === idx && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowBookingModal(true);
                          }}
                          className="mt-4 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 transition-all duration-300"
                        >
                          Book Now
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Location */}
            {activeTab === 'location' && (
              <div className="space-y-6">
                <h3 className="text-xl text-white font-semibold mb-4">Location</h3>
                <div className="rounded-2xl overflow-hidden border border-gold/20">
                  <div className="aspect-video bg-white/5 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <svg className="w-12 h-12 mx-auto text-gold/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-[#D4AF37] font-semibold">{hotel.location}</p>
                      <p className="text-gray-500 text-sm">Map view coming soon</p>
                    </div>
                  </div>
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
                  <span className="text-3xl font-bold text-[#D4AF37]">
                    {currencySymbol} {selectedRoom.pricePerNightMMK.toLocaleString()}
                  </span>
                  <span className="text-gray-400 text-sm ml-1">/ night</span>
                </div>
                <CurrencyToggle activeCurrency={currency} onToggle={setCurrency} />
              </div>

              <hr className="border-gold/10" />

              {/* Dates */}
              <div className="space-y-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-gold/20 rounded-lg text-white text-sm focus:outline-none focus:border-gold/50 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-gold/20 rounded-lg text-white text-sm focus:outline-none focus:border-gold/50 [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Room selection */}
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Room Type</label>
                <div className="relative">
                  <select
                    value={selectedRoomIndex}
                    onChange={(e) => setSelectedRoomIndex(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-gold/20 rounded-lg text-white text-sm focus:outline-none focus:border-gold/50 appearance-none cursor-pointer"
                  >
                    {roomTypes.map((room, idx) => (
                      <option key={idx} value={idx} className="bg-gray-900 text-white">
                        {room.name}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Guests</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-lg border border-gold/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-white font-semibold">{guests}</span>
                  <button
                    type="button"
                    onClick={() => setGuests((prev) => Math.min(selectedRoom.capacity, prev + 1))}
                    className="w-8 h-8 rounded-lg border border-gold/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {currencySymbol} {roomPrice.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}
                  </span>
                  <span className="text-white">{currencySymbol} {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <hr className="border-gold/10" />

              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-medium">Total</span>
                <span className="text-2xl font-bold text-[#D4AF37]">
                  {currencySymbol} {totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleBookNow}
                disabled={!checkIn || !checkOut || hotel.availableRooms === 0}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#E5C048] hover:to-[#D4AF37] text-gray-900 font-bold text-lg shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
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
        itemType="hotel"
        itemId={hotel._id}
        itemName={hotel.name}
        itemSubtitle={`${hotel.location} • ${selectedRoom.name}`}
        unitPrice={currency === 'MMK' ? selectedRoom.pricePerNightMMK : selectedRoom.pricePerNightUSD}
        currency={currency}
        unitLabel="night"
        maxQuantity={30}
      />
    </main>
  );
}
