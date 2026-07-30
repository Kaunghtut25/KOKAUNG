'use client';

import { getAll } from '@/lib/persistentStore';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound, useParams } from 'next/navigation';
import SocialShare from '@/components/SocialShare';
import CurrencyToggle from '@/components/CurrencyToggle';
import BackButton from '@/components/BackButton';
import RelatedItems from '@/components/RelatedItems';
export const dynamic = 'force-dynamic';

interface HotelDetail {
  _id: string;
  slug: string;
  name: string;
  location: string;
  description: string;
  rating: number;
  reviewCount: number;
  pricePerNightMMK: number;
  pricePerNightUSD: number;
  availableRooms: number;
  totalRooms: number;
  amenities: string[];
  images: string[];
  status: string;
  featured: boolean;
  address?: string;
}

async function getHotelBySlug(slug: string): Promise<HotelDetail | null> {
  try {
    const rawHotels = await getAll('hotels') as any[];
    const found = rawHotels.find((h: any) => {
      const hSlug = (h.name || h.location || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return hSlug === slug || h.id === slug || h._id === slug;
    });
    if (!found) return null;

    let images: string[] = [];
    if (Array.isArray(found.images)) {
      for (const item of found.images) {
        if (typeof item === 'string' && item.trim().startsWith('[')) {
          try { const parsed = JSON.parse(item); if (Array.isArray(parsed)) { images.push(...parsed.filter((x: string) => x.trim())); continue; } } catch {}
        }
        if (typeof item === 'string' && item.trim()) images.push(item.trim());
      }
    } else if (typeof found.images === 'string' && found.images.trim()) {
      const s = found.images.trim();
      if (s.startsWith('[')) { try { const parsed = JSON.parse(s); if (Array.isArray(parsed)) images = parsed.filter((x: string) => x.trim()); } catch { images = [s]; } }
      else images = [s];
    }

    const idMap: Record<string, string> = {
      h1: '/images_v2/hotel1-v2.jpg', h2: '/images_v2/hotel2-v2.jpg', h3: '/images_v2/hotel3-v2.jpg',
      h4: '/images_v2/hotel4-v2.jpg', h5: '/images_v2/hotel5-v2.jpg', h6: '/images_v2/hotel6-v2.jpg',
      h7: '/images_v2/hotel-luxury-v2.jpg', h8: '/images_v2/hotel-budget-v2.jpg',
      h9: '/images_v2/hotel-city-v2.jpg', h10: '/images_v2/hotel-resort-v2.jpg',
    };

    if (images.length === 0) {
      const fallback = idMap[found.id] || idMap[found._id] || '/images_v2/hotel1-v2.jpg';
      images = [fallback];
    }

    images = images.map((img: string, idx: number) => {
      if (img && img.includes('/images_v2/')) return img;
      return idx === 0 ? (idMap[found.id] || idMap[found._id] || '/images_v2/hotel1-v2.jpg') : '';
    }).filter(Boolean);

    const hSlug = (found.name || found.location || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    return {
      _id: found.id || found._id || '',
      slug: hSlug,
      name: found.name || '',
      location: found.location || '',
      address: found.address || '',
      description: found.description || '',
      rating: Number(found.rating) || 4.0,
      reviewCount: Number(found.reviewCount) || 0,
      pricePerNightMMK: Number(found.pricePerNightMMK) || 0,
      pricePerNightUSD: Number(found.pricePerNightUSD) || 0,
      availableRooms: Number(found.availableRooms) || 0,
      totalRooms: Number(found.totalRooms) || 0,
      amenities: typeof found.amenities === 'string' ? found.amenities.split(',').map((s: string) => s.trim()).filter(Boolean) : Array.isArray(found.amenities) ? found.amenities : [],
      images,
      status: found.status || 'active',
      featured: found.featured || false,
    };
  } catch {
    return null;
  }
}



export default function HotelDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [rooms, setRooms] = useState(1);
  const [travelDate, setTravelDate] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getHotelBySlug(slug)
      .then((h) => {
        if (h) setHotel(h);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

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
            <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
          <BackButton />
        </div>
        <div className="flex items-center justify-center flex-1 py-20">
          <div className="text-center space-y-4">
            <h2 className="text-xl text-[#0A1628] font-semibold">Hotel Not Found</h2>
            <p className="text-gray-500">The hotel you are looking for does not exist.</p>
            <Link href="/hotels" className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold inline-block">
              Back to Hotels
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const price = currency === 'MMK' ? hotel.pricePerNightMMK : hotel.pricePerNightUSD;
  const currencySymbol = currency === 'MMK' ? 'Ks' : '$';
  const totalPrice = price * rooms;
  const heroImage = hotel.images[0] || '/images_v2/hotel1-v2.jpg';

  function renderStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => (
      <svg key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.round(rating) ? 'text-[#D4AF37]' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  }

  const handleBookNow = () => {
    const bookUrl = new URL('/book-now', window.location.origin);
    bookUrl.searchParams.set('type', 'hotel');
    bookUrl.searchParams.set('title', hotel.name);
    bookUrl.searchParams.set('location', hotel.location);
    bookUrl.searchParams.set('price', String(price));
    bookUrl.searchParams.set('currency', currency);
    bookUrl.searchParams.set('guests', String(rooms));
    bookUrl.searchParams.set('checkIn', travelDate);
    window.location.href = bookUrl.toString();
  };

  const bookNowUrl = `/book-now?type=hotel&name=${encodeURIComponent(hotel.name)}&id=${encodeURIComponent(hotel._id)}&priceMMK=${hotel.pricePerNightMMK}&priceUSD=${hotel.pricePerNightUSD}&location=${encodeURIComponent(hotel.location)}`;

  const roomsLabel = hotel.availableRooms === 0
    ? 'Sold Out'
    : hotel.availableRooms <= 3
    ? 'Only ' + hotel.availableRooms + ' left'
    : hotel.availableRooms + ' rooms available';

  const roomsBadgeClass = hotel.availableRooms === 0
    ? 'bg-red-500/20 text-red-300 border-red-500/30'
    : hotel.availableRooms <= 3
    ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    : 'bg-green-500/20 text-green-300 border-green-500/30';

  const availabilityText = hotel.availableRooms === 0
    ? 'Fully booked'
    : hotel.availableRooms <= 5
    ? 'Limited availability — book soon!'
    : 'Good availability';

  return (
    <main className="min-h-screen bg-white">
      {/* Back Button */}
      <BackButton bookNowUrl={bookNowUrl} />

      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <Image src={heroImage} alt={hotel.name} width={1200} height={630} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_70%)]" />
        <Link href="/hotels" className="absolute top-6 left-4 md:top-8 md:left-8 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all text-sm">
          ← Back to Hotels
        </Link>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold border border-[#D4AF37]/30 backdrop-blur-sm">
                📍 {hotel.location}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${roomsBadgeClass}`}>
                {roomsLabel}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {hotel.name}
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">{renderStars(hotel.rating)}</div>
              <span className="text-white/70 text-sm">{hotel.rating.toFixed(1)} ({hotel.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm">
        <Link href="/" className="text-gray-500 hover:text-[#D4AF37]">Home</Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link href="/hotels" className="text-gray-500 hover:text-[#D4AF37]">Hotels</Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-[#0A1628] font-medium">{hotel.name}</span>
      </nav>

      <SocialShare url={typeof window !== "undefined" ? window.location.href : ""} title={"A9 Global Travel - Hotels"} />

      <section className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-[#0A1628] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                About This Hotel
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">
                {hotel.description || 'Experience world-class hospitality with elegant rooms, modern amenities, and exceptional service. Perfect for both business and leisure travelers seeking comfort and convenience.'}
              </p>
            </div>

            {hotel.amenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#0A1628] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hotel.amenities.map((amenity: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/15 text-[#0A1628] text-sm font-medium hover:bg-[#D4AF37]/10 transition-colors">
                      <svg className="w-4 h-4 text-[#D4AF37] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-[#0A1628] rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Rooms Available
              </h2>
              <p className="text-white/60 text-sm mb-4">
                {hotel.totalRooms} total rooms · {hotel.availableRooms} available now
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div
                  className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] h-2 rounded-full transition-all"
                  style={{ width: hotel.totalRooms > 0 ? (hotel.availableRooms / hotel.totalRooms * 100) + '%' : '0%' }}
                />
              </div>
              <p className="text-[#D4AF37] text-sm font-medium">
                {availabilityText}
              </p>
            </div>
          </div>

          {/* Interactive Booking Sidebar — Tours-style */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-2xl border border-[#D4AF37]/20 bg-white shadow-lg p-6 space-y-6">
              {/* Price + Currency Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-[#D4AF37]">
                    {currencySymbol} {price.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">/ night</span>
                </div>
                <CurrencyToggle activeCurrency={currency} onToggle={setCurrency} />
              </div>

              <hr className="border-[#D4AF37]/10" />

              {/* Quick info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Per Night</span>
                  <span className="text-[#0A1628]">{currencySymbol} {price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="text-[#0A1628] flex items-center gap-1">★ {hotel.rating.toFixed(1)} ({hotel.reviewCount} reviews)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Rooms</span>
                  <span className="text-[#0A1628]">{hotel.availableRooms}</span>
                </div>
              </div>

              <hr className="border-[#D4AF37]/10" />

              {/* Booking inputs */}
              <div className="space-y-3">
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">Check-in Date</label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-[#D4AF37]/50"
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-xs mb-1 block">Rooms</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRooms(Math.max(1, rooms - 1))}
                      className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-12 text-center text-[#0A1628] font-semibold">{rooms}</span>
                    <button
                      type="button"
                      onClick={() => setRooms(Math.min(hotel.availableRooms, rooms + 1))}
                      className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-3 border-t border-[#D4AF37]/10">
                <span className="text-gray-700 font-medium">Total ({rooms} room{rooms > 1 ? 's' : ''})</span>
                <span className="text-2xl font-bold text-[#D4AF37]">
                  {currencySymbol} {totalPrice.toLocaleString()}
                </span>
              </div>

              {/* Book Now */}
              <button
                onClick={handleBookNow}
                disabled={!hotel || hotel.availableRooms === 0}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] font-bold text-base shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Book Now
              </button>

              <p className="text-center text-gray-500 text-xs">No payment required to book</p>
            </div>

            <Link
              href="/hotels"
              className="block w-full py-3 rounded-xl text-center font-semibold text-sm border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A1628] transition-all duration-300 mt-4"
            >
              ← Back to All Hotels
            </Link>
          </div>
        </div>
      </section>
      <RelatedItems section="hotels" excludeSlug={slug} destination={typeof hotel?.location === "string" ? hotel.location : ""} />
    </main>
  );
}
