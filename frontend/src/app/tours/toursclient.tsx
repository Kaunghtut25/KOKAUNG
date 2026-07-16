'use client';

import React, { useState, useEffect } from 'react';
import TourCard from '@/components/TourCard';
import ScrollingRow from '@/components/ScrollingRow';
import CurrencyToggle from '@/components/CurrencyToggle';
import type { Tour } from '@/lib/api';

const ROW_TITLES = ['🌟 Featured Tours', '🌏 Popular Destinations', '🧭 Adventure & Beyond'];
const CARDS_PER_ROW = 10;
const ROW_COUNT = 3;

export default function ToursClient({ initialTours, preloadMap }: { initialTours: Tour[]; preloadMap: Record<string, string> }) {
  const [apiTours, setApiTours] = useState<Tour[]>(initialTours);
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');

  const [destination, setDestination] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [sort, setSort] = useState('');

  // Refresh from API (for real-time updates)
  useEffect(() => {
    fetch('/api/tours?page=1&limit=50').then(r => r.json()).then(data => {
      if (data?.data?.length) {
        const tours: Tour[] = data.data.map((t: any) => ({
          ...t,
          _id: t._id || t.id || '',
          image: Array.isArray(t.images) ? t.images[0] : '/images_v2/bagan-v2.jpg',
        }));
        setApiTours(tours);
      }
    }).catch(() => {});
  }, []);

  const filteredTours = apiTours.filter((t) => {
    if (destination.trim()) {
      const q = destination.trim().toLowerCase();
      if (!t.destination.toLowerCase().includes(q) && !t.title.toLowerCase().includes(q)) return false;
    }
    if (minPrice && t.priceMMK < Number(minPrice)) return false;
    if (maxPrice && t.priceMMK > Number(maxPrice)) return false;
    if (durationFilter) {
      const dayMatch = String(t.duration).match(/(\d+)/);
      const days = dayMatch ? parseInt(dayMatch[1]) : 0;
      if (durationFilter === '1-3' && days > 3) return false;
      if (durationFilter === '4-7' && (days < 4 || days > 7)) return false;
      if (durationFilter === '8-14' && (days < 8 || days > 14)) return false;
      if (durationFilter === '15+' && days < 15) return false;
    }
    return true;
  });

  const sortedTours = [...filteredTours].sort((a, b) => {
    if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sort === 'price_asc') return (a.priceMMK || 0) - (b.priceMMK || 0);
    if (sort === 'price_desc') return (b.priceMMK || 0) - (a.priceMMK || 0);
    return 0;
  });

  // Split tours into 3 rows of 10 cards each (cycle through existing tours when fewer than 30)
  const pool: Tour[] = [];
  if (sortedTours.length > 0) {
    for (let i = 0; i < CARDS_PER_ROW * ROW_COUNT; i++) pool.push(sortedTours[i % sortedTours.length]);
  }
  const tourRows: Tour[][] = [
    pool.slice(0, CARDS_PER_ROW),
    pool.slice(CARDS_PER_ROW, CARDS_PER_ROW * 2),
    pool.slice(CARDS_PER_ROW * 2, CARDS_PER_ROW * 3),
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative pt-24 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images_v2/hero-tours-v2.jpg" alt="A9 Global Tours" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/75" />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#0A1628]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Explore Our Tours
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
            Discover unforgettable journeys across Myanmar and beyond.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Search tours..." className="flex-1 min-w-[180px] pl-3 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-[#D4AF37]" />
            <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min MMK" className="w-[100px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-[#D4AF37]" />
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max MMK" className="w-[100px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-[#D4AF37]" />
            <select value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm">
              <option value="">All Durations</option>
              <option value="1-3">1-3 Days</option>
              <option value="4-7">4-7 Days</option>
              <option value="8-14">8-14 Days</option>
              <option value="15+">15+ Days</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm">
              <option value="">Sort by</option>
              <option value="rating">Rating</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <div className="ml-auto"><CurrencyToggle activeCurrency={currency} onToggle={setCurrency} /></div>
          </div>
        </div>
      </section>

      {/* Tours — 3 Scrolling Rows of 10 */}
      <section className="max-w-7xl mx-auto px-4 py-8 pb-20">
        {sortedTours.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <span className="text-5xl block">✈️</span>
            <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>No Tours Found</h3>
            <p className="text-gray-500">Try adjusting your filters.</p>
            <button onClick={() => { setDestination(''); setMinPrice(''); setMaxPrice(''); setDurationFilter(''); setSort(''); }} className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold">Clear Filters</button>
          </div>
        ) : (
          <div className="space-y-10">
            {tourRows.map((row, rowIdx) => (
              <div key={`tour-row-${rowIdx}`}>
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {ROW_TITLES[rowIdx]}
                  </h2>
                </div>
                <ScrollingRow>
                  {row.map((item, i) => (
                    <div key={`tour-row-${rowIdx}-card-${i}`} className="w-[300px] flex-shrink-0 snap-start">
                      <TourCard tour={item} currency={currency} preloadedImage={preloadMap?.[item._id || item.slug]} />
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
