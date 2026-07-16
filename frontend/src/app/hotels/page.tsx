'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, Hotel } from '@/lib/api';
import HotelCard from '@/components/HotelCard';
import ScrollingRow from '@/components/ScrollingRow';
import CurrencyToggle from '@/components/CurrencyToggle';

const ROW_TITLES = ['👑 Luxury Stays', '💎 Budget Friendly', '🏨 Popular Hotels'];
const CARDS_PER_ROW = 10;
const ROW_COUNT = 3;

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 animate-pulse">
      <div className="h-[300px] bg-gray-100" />
      <div className="p-4 space-y-3 bg-white">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-6 bg-gray-100 rounded-full w-16" />
          <div className="h-6 bg-gray-100 rounded-full w-16" />
          <div className="h-6 bg-gray-100 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}

export default function HotelsPage() {
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { limit: 50 };
      if (location.trim()) params.location = location.trim();
      if (rating) params.rating = Number(rating);
      if (minPrice) params.minPrice = Number(minPrice);
      if (maxPrice) params.maxPrice = Number(maxPrice);
      if (sort) params.sort = sort;

      const response = await api.get<Hotel[]>('/hotels', params);
      const data = response.data as unknown as Hotel[];

      if (Array.isArray(data)) {
        setHotels(data);
      } else {
        setHotels([]);
      }
    } catch (err) {
      console.error('Failed to fetch hotels:', err);
      const fallbackHotels: Hotel[] = [
        { _id: 'fh1', slug: 'fbh1', name: 'Sule Shangri-La Yangon', location: 'Yangon', rating: 4.7, pricePerNightMMK: 180000, pricePerNightUSD: 86, images: ['/images_v2/hotel1-v3.jpg'], amenities: ['Restaurant', 'Bar', 'Butler Service', 'Spa', 'Pool'], availableRooms: 20, description: '', reviewCount: 320 },
        { _id: 'fh2', slug: 'fbh2', name: 'The Strand Yangon', location: 'Yangon', rating: 4.9, pricePerNightMMK: 350000, pricePerNightUSD: 167, images: ['/images_v2/hotel2-v3.jpg'], amenities: ['Restaurant', 'Bar', 'Butler Service', 'Spa', 'Fitness Center'], availableRooms: 8, description: '', reviewCount: 412 },
        { _id: 'fh3', slug: 'fbh3', name: 'Aureum Palace Bagan', location: 'Bagan', rating: 4.8, pricePerNightMMK: 220000, pricePerNightUSD: 105, images: ['/images_v2/hotel3-v3.jpg'], amenities: ['Restaurant', 'Bar', 'Butler Service', 'Spa', 'Garden'], availableRooms: 30, description: '', reviewCount: 225 },
        { _id: 'fh4', slug: 'fbh4', name: 'Inle Princess Resort', location: 'Inle Lake', rating: 4.6, pricePerNightMMK: 160000, pricePerNightUSD: 76, images: ['/images_v2/hotel4-v3.jpg'], amenities: ['Restaurant', 'Bar', 'Butler Service', 'Spa', 'Lake View'], availableRooms: 25, description: '', reviewCount: 178 },
        { _id: 'fh5', slug: 'fbh5', name: 'Ngapali Bay Hotel', location: 'Ngapali Beach', rating: 4.7, pricePerNightMMK: 250000, pricePerNightUSD: 119, images: ['/images_v2/hotel5-v3.jpg'], amenities: ['Restaurant', 'Bar', 'Butler Service', 'Spa', 'Beach Access'], availableRooms: 40, description: '', reviewCount: 168 },
        { _id: 'fh6', slug: 'fbh6', name: 'Mandalay Hill Resort', location: 'Mandalay', rating: 4.3, pricePerNightMMK: 120000, pricePerNightUSD: 57, images: ['/images_v2/hotel3-v3.jpg'], amenities: ['Restaurant', 'Bar', 'Butler Service', 'Spa', 'Hill View'], availableRooms: 55, description: '', reviewCount: 190 },
        { _id: 'fh7', slug: 'fbh7', name: 'Kempinski Nay Pyi Taw', location: 'Nay Pyi Taw', rating: 4.8, pricePerNightMMK: 300000, pricePerNightUSD: 143, images: ['/images_v2/hotel2-v3.jpg'], amenities: ['Restaurant', 'Bar', 'Butler Service', 'Spa', 'Pool'], availableRooms: 18, description: '', reviewCount: 95 },
        { _id: 'fh8', slug: 'fbh8', name: 'Sedona Hotel Yangon', location: 'Yangon', rating: 4.5, pricePerNightMMK: 155000, pricePerNightUSD: 74, images: ['/images_v2/hotel3-v3.jpg'], amenities: ['Restaurant', 'Bar', 'Butler Service', 'Spa', 'Pool'], availableRooms: 60, description: '', reviewCount: 285 },
        { _id: 'fh9', slug: 'fbh9', name: 'Bagan Lodge', location: 'Bagan', rating: 4.6, pricePerNightMMK: 190000, pricePerNightUSD: 90, images: ['/images_v2/hotel4-v3.jpg'], amenities: ['Restaurant', 'Bar', 'Butler Service', 'Spa', 'Garden'], availableRooms: 35, description: '', reviewCount: 210 },
        { _id: 'fh10', slug: 'fbh10', name: 'Novotel Inle Lake', location: 'Inle Lake', rating: 4.4, pricePerNightMMK: 140000, pricePerNightUSD: 67, images: ['/images_v2/hotel5-v3.jpg'], amenities: ['Restaurant', 'Bar', 'Butler Service', 'Spa', 'Lake View'], availableRooms: 45, description: '', reviewCount: 155 },
        { _id: 'fh11', slug: 'fbh11', name: 'Clover Hotel Yangon', location: 'Yangon', rating: 4.1, pricePerNightMMK: 45000, pricePerNightUSD: 21, images: ['/images_v2/hotel1-v3.jpg'], amenities: ['Restaurant', 'WiFi'], availableRooms: 50, description: '', reviewCount: 130 },
        { _id: 'fh12', slug: 'fbh12', name: 'Ostello Bello Bagan', location: 'Bagan', rating: 4.4, pricePerNightMMK: 35000, pricePerNightUSD: 17, images: ['/images_v2/hotel2-v3.jpg'], amenities: ['Restaurant', 'Bar'], availableRooms: 80, description: '', reviewCount: 195 },
        { _id: 'fh13', slug: 'fbh13', name: 'Royal Inlay Hotel', location: 'Inle Lake', rating: 4.0, pricePerNightMMK: 50000, pricePerNightUSD: 24, images: ['/images_v2/hotel3-v3.jpg'], amenities: ['Restaurant', 'WiFi'], availableRooms: 30, description: '', reviewCount: 88 },
        { _id: 'fh14', slug: 'fbh14', name: 'Silver Oaks Mandalay', location: 'Mandalay', rating: 3.9, pricePerNightMMK: 38000, pricePerNightUSD: 18, images: ['/images_v2/hotel4-v3.jpg'], amenities: ['Restaurant', 'WiFi'], availableRooms: 40, description: '', reviewCount: 75 },
        { _id: 'fh15', slug: 'fbh15', name: 'Beachfront Inn Ngapali', location: 'Ngapali Beach', rating: 4.2, pricePerNightMMK: 65000, pricePerNightUSD: 31, images: ['/images_v2/hotel5-v3.jpg'], amenities: ['Restaurant', 'Beach Access'], availableRooms: 22, description: '', reviewCount: 142 },
        { _id: 'fh16', slug: 'fbh16', name: 'Golden Guest House', location: 'Yangon', rating: 4.0, pricePerNightMMK: 25000, pricePerNightUSD: 12, images: ['/images_v2/hotel1-v3.jpg'], amenities: ['WiFi'], availableRooms: 15, description: '', reviewCount: 65 },
        { _id: 'fh17', slug: 'fbh17', name: 'Shwe Yee Win Bagan', location: 'Bagan', rating: 4.3, pricePerNightMMK: 42000, pricePerNightUSD: 20, images: ['/images_v2/hotel2-v3.jpg'], amenities: ['Restaurant', 'WiFi'], availableRooms: 28, description: '', reviewCount: 110 },
        { _id: 'fh18', slug: 'fbh18', name: 'Nyaung Shwe Haven', location: 'Inle Lake', rating: 4.1, pricePerNightMMK: 48000, pricePerNightUSD: 23, images: ['/images_v2/hotel3-v3.jpg'], amenities: ['Restaurant', 'WiFi'], availableRooms: 20, description: '', reviewCount: 92 },
        { _id: 'fh19', slug: 'fbh19', name: 'Taunggyi Comfort Inn', location: 'Taunggyi', rating: 3.8, pricePerNightMMK: 32000, pricePerNightUSD: 15, images: ['/images_v2/hotel4-v3.jpg'], amenities: ['Restaurant', 'WiFi'], availableRooms: 35, description: '', reviewCount: 48 },
        { _id: 'fh20', slug: 'fbh20', name: 'Pyay Riverside', location: 'Pyay', rating: 3.7, pricePerNightMMK: 28000, pricePerNightUSD: 13, images: ['/images_v2/hotel5-v3.jpg'], amenities: ['Restaurant', 'WiFi'], availableRooms: 25, description: '', reviewCount: 53 },
        { _id: 'fh21', slug: 'fbh21', name: 'Chatrium Hotel Yangon', location: 'Yangon', rating: 4.5, pricePerNightMMK: 145000, pricePerNightUSD: 69, images: ['/images_v2/hotel1-v3.jpg'], amenities: ['Restaurant', 'Bar', 'Butler Service', 'Spa', 'Pool'], availableRooms: 50, description: '', reviewCount: 267 },
        { _id: 'fh22', slug: 'fbh22', name: 'Melia Yangon', location: 'Yangon', rating: 4.4, pricePerNightMMK: 135000, pricePerNightUSD: 64, images: ['/images_v2/hotel2-v3.jpg'], amenities: ['Restaurant', 'Bar', 'Spa', 'Pool'], availableRooms: 70, description: '', reviewCount: 198 },
        { _id: 'fh23', slug: 'fbh23', name: 'Heritage Bagan Hotel', location: 'Bagan', rating: 4.2, pricePerNightMMK: 85000, pricePerNightUSD: 40, images: ['/images_v2/hotel3-v3.jpg'], amenities: ['Restaurant', 'Pool', 'Garden'], availableRooms: 40, description: '', reviewCount: 156 },
        { _id: 'fh24', slug: 'fbh24', name: 'Pristine Lotus Spa Resort', location: 'Inle Lake', rating: 4.7, pricePerNightMMK: 200000, pricePerNightUSD: 95, images: ['/images_v2/hotel4-v3.jpg'], amenities: ['Restaurant', 'Bar', 'Butler Service', 'Spa', 'Lake View'], availableRooms: 15, description: '', reviewCount: 89 },
        { _id: 'fh25', slug: 'fbh25', name: 'Amazing Ngapali Resort', location: 'Ngapali Beach', rating: 4.5, pricePerNightMMK: 210000, pricePerNightUSD: 100, images: ['/images_v2/hotel5-v3.jpg'], amenities: ['Restaurant', 'Bar', 'Spa', 'Beach Access'], availableRooms: 30, description: '', reviewCount: 172 },
        { _id: 'fh26', slug: 'fbh26', name: 'Hotel Max Mandalay', location: 'Mandalay', rating: 4.0, pricePerNightMMK: 55000, pricePerNightUSD: 26, images: ['/images_v2/hotel1-v3.jpg'], amenities: ['Restaurant', 'WiFi'], availableRooms: 45, description: '', reviewCount: 120 },
        { _id: 'fh27', slug: 'fbh27', name: 'Hotel Yadanarbon Mandalay', location: 'Mandalay', rating: 4.1, pricePerNightMMK: 65000, pricePerNightUSD: 31, images: ['/images_v2/hotel2-v3.jpg'], amenities: ['Restaurant', 'Pool', 'WiFi'], availableRooms: 55, description: '', reviewCount: 138 },
        { _id: 'fh28', slug: 'fbh28', name: 'Aureum Palace Nay Pyi Taw', location: 'Nay Pyi Taw', rating: 4.4, pricePerNightMMK: 180000, pricePerNightUSD: 86, images: ['/images_v2/hotel3-v3.jpg'], amenities: ['Restaurant', 'Bar', 'Butler Service', 'Spa', 'Pool'], availableRooms: 25, description: '', reviewCount: 78 },
        { _id: 'fh29', slug: 'fbh29', name: 'Thazin Garden Hotel Bagan', location: 'Bagan', rating: 4.0, pricePerNightMMK: 60000, pricePerNightUSD: 29, images: ['/images_v2/hotel4-v3.jpg'], amenities: ['Restaurant', 'Garden', 'WiFi'], availableRooms: 35, description: '', reviewCount: 105 },
        { _id: 'fh30', slug: 'fbh30', name: 'Viewpoint Lodge Inle', location: 'Inle Lake', rating: 4.3, pricePerNightMMK: 120000, pricePerNightUSD: 57, images: ['/images_v2/hotel5-v3.jpg'], amenities: ['Restaurant', 'Bar', 'Lake View'], availableRooms: 20, description: '', reviewCount: 94 },
      ];
      setHotels(fallbackHotels);
    } finally {
      setLoading(false);
    }
  }, [location, rating, minPrice, maxPrice, sort]);

  useEffect(() => { fetchHotels(); }, [fetchHotels]);

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
  };

  // Build 3 rows × 10 cards
  const pool: Hotel[] = [];
  if (hotels.length > 0) {
    for (let i = 0; i < CARDS_PER_ROW * ROW_COUNT; i++) pool.push(hotels[i % hotels.length]);
  }
  const hotelRows: Hotel[][] = [
    pool.slice(0, CARDS_PER_ROW),
    pool.slice(CARDS_PER_ROW, CARDS_PER_ROW * 2),
    pool.slice(CARDS_PER_ROW * 2, CARDS_PER_ROW * 3),
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="relative pt-24 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images_v2/hero-hotels-v2.jpg" alt="A9 Global Hotels" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/75" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#0A1628]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Find Your Perfect Stay
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
            From luxury resorts to cozy boutique hotels — discover accommodations that make your trip unforgettable.
          </p>
        </div>
      </section>

      <section className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input type="text" value={location} onChange={(e) => handleFilterChange(setLocation, e.target.value)}
                placeholder="Search location..." className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors" />
            </div>
            <div className="relative">
              <select value={rating} onChange={(e) => handleFilterChange(setRating, e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none cursor-pointer pr-8">
                <option value="" className="bg-white text-gray-900">Any Rating</option>
                <option value="3" className="bg-white text-gray-900">3+ Stars</option>
                <option value="4" className="bg-white text-gray-900">4+ Stars</option>
                <option value="5" className="bg-white text-gray-900">5 Stars</option>
              </select>
              <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="flex gap-2 items-center">
              <input type="number" value={minPrice} onChange={(e) => handleFilterChange(setMinPrice, e.target.value)}
                placeholder="Min MMK" className="w-[100px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <span className="text-gray-400">–</span>
              <input type="number" value={maxPrice} onChange={(e) => handleFilterChange(setMaxPrice, e.target.value)}
                placeholder="Max MMK" className="w-[100px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
            <div className="relative">
              <select value={sort} onChange={(e) => handleFilterChange(setSort, e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none cursor-pointer pr-8">
                <option value="" className="bg-white text-gray-900">Sort by</option>
                <option value="rating" className="bg-white text-gray-900">Rating</option>
                <option value="price_asc" className="bg-white text-gray-900">Price: Low to High</option>
                <option value="price_desc" className="bg-white text-gray-900">Price: High to Low</option>
              </select>
              <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="ml-auto"><CurrencyToggle activeCurrency={currency} onToggle={setCurrency} /></div>
          </div>
        </div>
      </section>

      {/* Hotels — 3 Scrolling Rows of 10 */}
      <section className="max-w-7xl mx-auto px-4 py-10 pb-20">
        {loading && (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="w-[300px] flex-shrink-0"><SkeletonCard /></div>)}
          </div>
        )}

        {!loading && hotels.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>No Hotels Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">We couldn't find any hotels matching your search. Please try a different location or adjust your price range.</p>
            <button onClick={() => { setLocation(''); setRating(''); setMinPrice(''); setMaxPrice(''); setSort(''); }}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold hover:shadow-lg transition-all">Show All Hotels</button>
          </div>
        )}

        {!loading && hotels.length > 0 && (
          <div className="space-y-10">
            {hotelRows.map((row, rowIdx) => (
              <div key={`hotel-row-${rowIdx}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {ROW_TITLES[rowIdx]}
                  </h2>
                </div>
                <ScrollingRow>
                  {row.map((hotel, i) => (
                    <div key={`hotel-row-${rowIdx}-card-${i}`} className="w-[300px] flex-shrink-0 snap-start">
                      <HotelCard hotel={hotel} currency={currency} />
                    </div>
                  ))}
                </ScrollingRow>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
