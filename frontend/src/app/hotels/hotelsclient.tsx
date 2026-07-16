'use client';

import React, { useState } from 'react';
import { Hotel } from '@/lib/api';
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

interface HotelsClientProps {
  initialHotels: Hotel[];
}

export default function HotelsClient({ initialHotels }: HotelsClientProps) {
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
  };

  const pool: Hotel[] = [];
  const hotels = initialHotels;
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
                <option value="">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <input type="number" value={minPrice} onChange={(e) => handleFilterChange(setMinPrice, e.target.value)}
                placeholder="Min MMK" className="w-[100px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors [appearance:textfield]" />
              <span className="text-gray-400">–</span>
              <input type="number" value={maxPrice} onChange={(e) => handleFilterChange(setMaxPrice, e.target.value)}
                placeholder="Max MMK" className="w-[100px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors [appearance:textfield]" />
            </div>
            <div className="relative">
              <select value={sort} onChange={(e) => handleFilterChange(setSort, e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none cursor-pointer pr-8">
                <option value="">Sort by</option>
                <option value="rating">Rating</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
            <div className="ml-auto"><CurrencyToggle activeCurrency={currency} onToggle={setCurrency} /></div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10 pb-20">
        {hotels.length === 0 && (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="w-[300px] flex-shrink-0"><SkeletonCard /></div>)}
          </div>
        )}

        {hotels.length > 0 && (
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