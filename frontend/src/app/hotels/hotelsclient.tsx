'use client';

import React, { useState } from 'react';
import { Hotel } from '@/lib/api';
import HotelCard from '@/components/HotelCard';
import ScrollingRow from '@/components/ScrollingRow';
import CurrencyToggle from "@/components/CurrencyToggle";
import DealsBanner from '@/components/DealsBanner';
import FAQAccordion from '@/components/FAQAccordion';
import TestimonialSlider from '@/components/TestimonialSlider';


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

export default function HotelsClient({ initialHotels, siteConfig }: HotelsClientProps & { siteConfig?: any }) {
  const heroImage = siteConfig?.heroImages?.hotels || "/images_v2/hero-hotels-v2.jpg";
  const ht = siteConfig?.heroText?.hotels || {};
  const hTitle = ht.title || "A9 Global Hotels";
  const hSubtitle = ht.subtitle || "Handpicked accommodations for your comfort";
  const hTitleFont = ht.titleFont || "'Playfair Display', Georgia, serif";
  const hTitleSize = ht.titleSize || "3rem";
  const hSubtitleSize = ht.subtitleSize || "1.2rem";
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const layout = siteConfig?.sectionLayouts?.hotels || { desktop: 4, tablet: 2, mobile: 1 };
  const rowTitles = siteConfig?.sectionRows?.hotels || ["Featured Hotels", "More Hotels", "Additional Hotels"];
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
  };

  // Apply sort
  const sortedHotels = [...initialHotels].sort((a, b) => {
    if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sort === 'price_asc') return (a.priceMMK || 0) - (b.priceMMK || 0);
    if (sort === 'price_desc') return (b.priceMMK || 0) - (a.priceMMK || 0);
    return 0;
  });

  const ITEMS_PER_ROW = 6;
  const pool: Hotel[] = [...sortedHotels];
  // Group by row field
  const rowMap = new Map<number, Hotel[]>();
  pool.forEach(h => {
    const r = (h as any).row || 1;
    if (!rowMap.has(r)) rowMap.set(r, []);
    rowMap.get(r)!.push(h);
  });
  // Sort by row number, limit each row to 6
  const hotelRows: Hotel[][] = [...rowMap.entries()]
    .sort(([a],[b]) => a - b)
    .map(([,items]) => items.slice(0, ITEMS_PER_ROW));

  return (
    <main className="min-h-screen bg-white">
<section className="relative pt-24 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="A9 Global Hotels" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images_v2/hero-hotels-v2.jpg"; }} />
          <div className="absolute inset-0 bg-white/75" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="font-bold mb-4 text-[#0A1628]" style={{ fontFamily: hTitleFont, fontSize: hTitleSize }}>
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
                className="px-4 py-2 rounded-xl border border-[#D4AF37]/30 bg-white text-[#0A1628] text-sm font-medium">
                <option value="">Sort by</option>
                <option value="rating">Rating: High to Low</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
            <div className="ml-auto"><CurrencyToggle activeCurrency={currency} onToggle={setCurrency} /></div>
          </div>
        </div>
      </section>
<section className="max-w-7xl mx-auto px-4 py-10 pb-20">
        {sortedHotels.length === 0 && (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="w-[300px] flex-shrink-0"><SkeletonCard /></div>)}
          </div>
        )}

        {sortedHotels.length > 0 && (
          <div className="space-y-10">
            {hotelRows.map((row, rowIdx) => (
              <div key={`hotel-row-${rowIdx}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {rowTitles[rowIdx] || `Row ${rowIdx + 1}`}
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
{/* ========== Testimonial Slider ========== */}
      <DealsBanner />
      <FAQAccordion section="hotels" />
      <TestimonialSlider />
</main>
  );
}
