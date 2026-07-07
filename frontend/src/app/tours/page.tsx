'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, Tour, ApiResponse } from '@/lib/api';
import TourCard from '@/components/TourCard';
import ScrollingRow from '@/components/ScrollingRow';
import CurrencyToggle from '@/components/CurrencyToggle';
import SearchBar from '@/components/SearchBar';

interface ToursResponse {
  tours: Tour[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

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

export default function ToursPage() {
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [destination, setDestination] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [sort, setSort] = useState('');

  const fetchTours = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 6 };
      if (destination.trim()) params.destination = destination.trim();
      if (minPrice) params.minPrice = Number(minPrice);
      if (maxPrice) params.maxPrice = Number(maxPrice);
      if (duration) params.duration = duration;
      if (sort) params.sort = sort;

      const response = await api.get<Tour[]>('/tours', params);
      const data = response.data as unknown as Tour[];

      if (response.pagination) {
        setTours(data);
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
      } else {
        setTours(data);
        setTotalPages(1);
        setTotal(Array.isArray(data) ? data.length : 0);
      }
    } catch (err) {
      console.error('Failed to fetch tours:', err);
      // Fallback data with unique images
      const fallbackTours: Tour[] = [
        { _id: 'ft1', slug: 'fallback-1', title: 'Golden Land Explorer', destination: 'Yangon - Bagan - Mandalay', description: '', priceMMK: 1850000, priceUSD: 881, duration: '8D/7N', groupSize: 20, rating: 4.8, reviewCount: 142, images: ['https://picsum.photos/seed/a9tour1/600/400'], amenities: [], itinerary: [], included: [], excluded: [], featured: true, createdAt: '' },
        { _id: 'ft2', slug: 'fallback-2', title: 'Bagan Sunrise Discovery', destination: 'Bagan', description: '', priceMMK: 950000, priceUSD: 452, duration: '5D/4N', groupSize: 15, rating: 4.9, reviewCount: 98, images: ['https://picsum.photos/seed/a9tour2/600/400'], amenities: [], itinerary: [], included: [], excluded: [], featured: true, createdAt: '' },
        { _id: 'ft3', slug: 'fallback-3', title: 'Mandalay Royal Heritage', destination: 'Mandalay', description: '', priceMMK: 750000, priceUSD: 357, duration: '4D/3N', groupSize: 20, rating: 4.6, reviewCount: 67, images: ['https://picsum.photos/seed/a9tour3/600/400'], amenities: [], itinerary: [], included: [], excluded: [], featured: false, createdAt: '' },
        { _id: 'ft4', slug: 'fallback-4', title: 'Inle Lake Serenity', destination: 'Inle Lake', description: '', priceMMK: 1100000, priceUSD: 524, duration: '5D/4N', groupSize: 16, rating: 4.7, reviewCount: 85, images: ['https://picsum.photos/seed/a9tour4/600/400'], amenities: [], itinerary: [], included: [], excluded: [], featured: true, createdAt: '' },
        { _id: 'ft5', slug: 'fallback-5', title: 'Ngapali Beach Escape', destination: 'Ngapali Beach', description: '', priceMMK: 1350000, priceUSD: 643, duration: '4D/3N', groupSize: 18, rating: 4.5, reviewCount: 52, images: ['https://picsum.photos/seed/a9tour5/600/400'], amenities: [], itinerary: [], included: [], excluded: [], featured: false, createdAt: '' },
        { _id: 'ft6', slug: 'fallback-6', title: 'Yangon Cultural Tour', destination: 'Yangon', description: '', priceMMK: 450000, priceUSD: 214, duration: '3D/2N', groupSize: 25, rating: 4.4, reviewCount: 43, images: ['https://picsum.photos/seed/a9tour6/600/400'], amenities: [], itinerary: [], included: [], excluded: [], featured: false, createdAt: '' },
      ];
      setTours(fallbackTours);
      setTotal(fallbackTours.length);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, destination, minPrice, maxPrice, duration, sort]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const handleFilterChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    setter(value);
    setPage(1);
  };

  const handleSearchFromBar = useCallback((results: unknown, isLoading: boolean) => {
    // SearchBar callback — not used on listing page directly
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative pt-24 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://picsum.photos/seed/a9tour-hero/1920/600" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/75" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#0A1628]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Explore Our Tours
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
            Discover unforgettable journeys across Myanmar and beyond. Handpicked destinations, expert guides, and authentic experiences await.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input type="text" value={destination} onChange={(e) => handleFilterChange(setDestination, e.target.value)}
                placeholder="Destination"
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors" />
            </div>
            <div className="flex gap-2 items-center">
              <input type="number" value={minPrice} onChange={(e) => handleFilterChange(setMinPrice, e.target.value)}
                placeholder="Min MMK"
                className="w-[100px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <span className="text-gray-400">–</span>
              <input type="number" value={maxPrice} onChange={(e) => handleFilterChange(setMaxPrice, e.target.value)}
                placeholder="Max MMK"
                className="w-[100px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
            <div className="relative">
              <select value={duration} onChange={(e) => { setDuration(e.target.value); setPage(1); }}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none cursor-pointer pr-8">
                <option value="" className="bg-white text-gray-900">All Durations</option>
                <option value="1-3" className="bg-white text-gray-900">1-3 Days</option>
                <option value="4-7" className="bg-white text-gray-900">4-7 Days</option>
                <option value="8-14" className="bg-white text-gray-900">8-14 Days</option>
                <option value="15+" className="bg-white text-gray-900">15+ Days</option>
              </select>
              <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="relative">
              <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
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
            <div className="ml-auto">
              <CurrencyToggle activeCurrency={currency} onToggle={setCurrency} />
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Row 1 — Discover Myanmar */}
      <section className="max-w-7xl mx-auto px-4 pt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>🌟 Discover Myanmar</h2>
        </div>
        <ScrollingRow>
          {[
            { title: 'Bagan Sunrise Tour', destination: 'Bagan', priceMMK: 950000, priceUSD: 452, image: 'https://picsum.photos/seed/a9tour-bagan/600/400' },
            { title: 'Inle Lake Discovery', destination: 'Inle Lake', priceMMK: 1100000, priceUSD: 524, image: 'https://picsum.photos/seed/a9tour-inlelake/600/400' },
            { title: 'Mandalay Heritage', destination: 'Mandalay', priceMMK: 750000, priceUSD: 357, image: 'https://picsum.photos/seed/a9tour-mandalay/600/400' },
            { title: 'Yangon City Walk', destination: 'Yangon', priceMMK: 450000, priceUSD: 214, image: 'https://picsum.photos/seed/a9tour-yangon/600/400' },
            { title: 'Ngapali Beach Bliss', destination: 'Ngapali Beach', priceMMK: 1350000, priceUSD: 643, image: 'https://picsum.photos/seed/a9tour-ngapali/600/400' },
            { title: 'Golden Rock Trek', destination: 'Kyaiktiyo', priceMMK: 520000, priceUSD: 248, image: 'https://picsum.photos/seed/a9tour-goldenrock/600/400' },
            { title: 'Putao Adventure', destination: 'Putao', priceMMK: 2100000, priceUSD: 1000, image: 'https://picsum.photos/seed/a9tour-putao/600/400' },
            { title: 'Mrauk U Ancient City', destination: 'Mrauk U', priceMMK: 1800000, priceUSD: 857, image: 'https://picsum.photos/seed/a9tour-mrauku/600/400' },
            { title: 'Hpa-an Caves', destination: 'Hpa-an', priceMMK: 650000, priceUSD: 310, image: 'https://picsum.photos/seed/a9tour-hpaan/600/400' },
            { title: 'Pyin Oo Lwin Escape', destination: 'Pyin Oo Lwin', priceMMK: 580000, priceUSD: 276, image: 'https://picsum.photos/seed/a9tour-pyinoolwin/600/400' },
          ].map((item, i) => (
            <div key={`row1-${i}`} className="w-[300px] flex-shrink-0 snap-start">
              <div className="group relative rounded-2xl overflow-hidden cursor-pointer border border-gray-200 hover:border-[#D4AF37]/60 hover:shadow-xl hover:shadow-[#D4AF37]/10 hover:scale-[1.02] transition-all duration-300">
                <div className="relative h-[300px] w-full overflow-hidden bg-gray-200">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" style={{ position: 'absolute', inset: 0 }} onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/a9tour-fallback/600/400'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#D4AF37]/90 text-gray-900 text-xs font-semibold backdrop-blur-sm">{item.destination}</span>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white text-xl font-bold mb-2 line-clamp-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{item.title}</h3>
                    <div className="text-right">
                      <span className="text-[#D4AF37] text-lg font-bold">{currency === 'MMK' ? `Ks ${item.priceMMK.toLocaleString()}` : `$ ${item.priceUSD.toLocaleString()}`}</span>
                      <span className="text-gray-400 text-xs ml-1">/person</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollingRow>
      </section>

      {/* Scrolling Row 2 — Beyond Myanmar */}
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>🌏 Beyond Myanmar</h2>
        </div>
        <ScrollingRow>
          {[
            { title: 'Bangkok Explorer', destination: 'Thailand', priceMMK: 1200000, priceUSD: 571, image: 'https://picsum.photos/seed/a9tour-bangkok/600/400' },
            { title: 'Singapore City Life', destination: 'Singapore', priceMMK: 2500000, priceUSD: 1190, image: 'https://picsum.photos/seed/a9tour-singapore/600/400' },
            { title: 'Bali Paradise', destination: 'Indonesia', priceMMK: 1800000, priceUSD: 857, image: 'https://picsum.photos/seed/a9tour-bali/600/400' },
            { title: 'Dubai Luxury', destination: 'UAE', priceMMK: 3500000, priceUSD: 1667, image: 'https://picsum.photos/seed/a9tour-dubai/600/400' },
            { title: 'Tokyo Highlights', destination: 'Japan', priceMMK: 4200000, priceUSD: 2000, image: 'https://picsum.photos/seed/a9tour-tokyo/600/400' },
            { title: 'Seoul Discovery', destination: 'South Korea', priceMMK: 2800000, priceUSD: 1333, image: 'https://picsum.photos/seed/a9tour-seoul/600/400' },
            { title: 'Kuala Lumpur Getaway', destination: 'Malaysia', priceMMK: 1500000, priceUSD: 714, image: 'https://picsum.photos/seed/a9tour-kualalumpur/600/400' },
            { title: 'Hanoi Heritage', destination: 'Vietnam', priceMMK: 900000, priceUSD: 429, image: 'https://picsum.photos/seed/a9tour-hanoi/600/400' },
            { title: 'Phnom Penh Culture', destination: 'Cambodia', priceMMK: 850000, priceUSD: 405, image: 'https://picsum.photos/seed/a9tour-phnompenh/600/400' },
            { title: 'Maldives Dream', destination: 'Maldives', priceMMK: 5500000, priceUSD: 2619, image: 'https://picsum.photos/seed/a9tour-maldives/600/400' },
          ].map((item, i) => (
            <div key={`row2-${i}`} className="w-[300px] flex-shrink-0 snap-start">
              <div className="group relative rounded-2xl overflow-hidden cursor-pointer border border-gray-200 hover:border-[#D4AF37]/60 hover:shadow-xl hover:shadow-[#D4AF37]/10 hover:scale-[1.02] transition-all duration-300">
                <div className="relative h-[300px] w-full overflow-hidden bg-gray-200">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" style={{ position: 'absolute', inset: 0 }} onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/a9tour-fallback/600/400'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#D4AF37]/90 text-gray-900 text-xs font-semibold backdrop-blur-sm">{item.destination}</span>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white text-xl font-bold mb-2 line-clamp-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{item.title}</h3>
                    <div className="text-right">
                      <span className="text-[#D4AF37] text-lg font-bold">{currency === 'MMK' ? `Ks ${item.priceMMK.toLocaleString()}` : `$ ${item.priceUSD.toLocaleString()}`}</span>
                      <span className="text-gray-400 text-xs ml-1">/person</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollingRow>
      </section>

      {/* Results Grid */}
      <section className="max-w-7xl mx-auto px-4 py-10 pb-20">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && tours.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>No tours found</h3>
            <p className="text-gray-500">Try adjusting your filters.</p>
            <button onClick={() => { setDestination(''); setMinPrice(''); setMaxPrice(''); setDuration(''); setSort(''); setPage(1); }}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold hover:shadow-lg transition-all">Clear Filters</button>
          </div>
        )}

        {!loading && tours.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">Showing <span className="text-gray-900 font-medium">{tours.length}</span> of <span className="text-gray-900 font-medium">{total}</span> tours</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => <TourCard key={tour._id} tour={tour} currency={currency} />)}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-[#D4AF37] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">← Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => { if (totalPages <= 7) return true; if (p === 1 || p === totalPages) return true; if (Math.abs(p - page) <= 2) return true; return false; })
                  .map((p, idx, arr) => {
                    const showEllipsis = idx > 0 && arr[idx - 1] !== p - 1;
                    return (<React.Fragment key={p}>{showEllipsis && <span className="px-2 text-gray-400">...</span>}<button onClick={() => setPage(p)} className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${page === p ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white shadow-sm' : 'border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-[#D4AF37]'}`}>{p}</button></React.Fragment>);
                  })}
                <button onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-[#D4AF37] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next →</button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
