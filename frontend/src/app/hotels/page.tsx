'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, Hotel } from '@/lib/api';
import HotelCard from '@/components/HotelCard';
import CurrencyToggle from '@/components/CurrencyToggle';

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 6 };
      if (location.trim()) params.location = location.trim();
      if (rating) params.rating = Number(rating);
      if (minPrice) params.minPrice = Number(minPrice);
      if (maxPrice) params.maxPrice = Number(maxPrice);
      if (sort) params.sort = sort;

      const response = await api.get<Hotel[]>('/hotels', params);
      const data = response.data as unknown as Hotel[];

      if (response.pagination) {
        setHotels(data);
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
      } else {
        setHotels(data);
        setTotalPages(1);
        setTotal(Array.isArray(data) ? data.length : 0);
      }
    } catch (err) {
      console.error('Failed to fetch hotels:', err);
      const fallbackHotels: Hotel[] = [
        { _id: 'fh1', slug: 'fbh1', name: 'Sule Shangri-La Yangon', location: 'Yangon', rating: 4.7, pricePerNightMMK: 180000, pricePerNightUSD: 86, images: ['https://picsum.photos/seed/a9hotel1/600/400'], amenities: [], availableRooms: 20, description: '', reviewCount: 320 },
        { _id: 'fh2', slug: 'fbh2', name: 'The Strand Yangon', location: 'Yangon', rating: 4.9, pricePerNightMMK: 350000, pricePerNightUSD: 167, images: ['https://picsum.photos/seed/a9hotel2/600/400'], amenities: [], availableRooms: 8, description: '', reviewCount: 412 },
        { _id: 'fh3', slug: 'fbh3', name: 'Aureum Palace Bagan', location: 'Bagan', rating: 4.8, pricePerNightMMK: 220000, pricePerNightUSD: 105, images: ['https://picsum.photos/seed/a9hotel3/600/400'], amenities: [], availableRooms: 30, description: '', reviewCount: 225 },
        { _id: 'fh4', slug: 'fbh4', name: 'Inle Princess Resort', location: 'Inle Lake', rating: 4.6, pricePerNightMMK: 160000, pricePerNightUSD: 76, images: ['https://picsum.photos/seed/a9hotel4/600/400'], amenities: [], availableRooms: 25, description: '', reviewCount: 178 },
        { _id: 'fh5', slug: 'fbh5', name: 'Ngapali Bay Hotel', location: 'Ngapali Beach', rating: 4.7, pricePerNightMMK: 250000, pricePerNightUSD: 119, images: ['https://picsum.photos/seed/a9hotel5/600/400'], amenities: [], availableRooms: 40, description: '', reviewCount: 168 },
        { _id: 'fh6', slug: 'fbh6', name: 'Mandalay Hill Resort', location: 'Mandalay', rating: 4.3, pricePerNightMMK: 120000, pricePerNightUSD: 57, images: ['https://picsum.photos/seed/a9hotel6/600/400'], amenities: [], availableRooms: 55, description: '', reviewCount: 190 },
      ];
      setHotels(fallbackHotels);
      setTotal(fallbackHotels.length);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, location, rating, minPrice, maxPrice, sort]);

  useEffect(() => { fetchHotels(); }, [fetchHotels]);

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value); setPage(1);
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="relative pt-24 pb-12 px-4 overflow-hidden bg-gradient-to-b from-[#FFFDF5] to-white">
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

      <section className="max-w-7xl mx-auto px-4 py-10 pb-20">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && hotels.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>No hotels found</h3>
            <p className="text-gray-500">Try adjusting your filters.</p>
            <button onClick={() => { setLocation(''); setRating(''); setMinPrice(''); setMaxPrice(''); setSort(''); setPage(1); }}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold hover:shadow-lg transition-all">Clear Filters</button>
          </div>
        )}

        {!loading && hotels.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">Showing <span className="text-gray-900 font-medium">{hotels.length}</span> of <span className="text-gray-900 font-medium">{total}</span> hotels</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} currency={currency} />)}
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
