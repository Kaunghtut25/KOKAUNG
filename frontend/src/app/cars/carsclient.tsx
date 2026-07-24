'use client';

import React, { useState } from 'react';
import { Car } from '@/lib/api';
import CarCard from '@/components/CarCard';
import ScrollingRow from '@/components/ScrollingRow';
import CurrencyToggle from '@/components/CurrencyToggle';
import DealsBanner from '@/components/DealsBanner';
import FAQAccordion from '@/components/FAQAccordion';
import TestimonialSlider from '@/components/TestimonialSlider';

const CAR_TYPES = ['All', 'SUV', 'Sedan', 'MPV', 'Hatchback', 'Pickup', 'Luxury'];

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
        </div>
      </div>
    </div>
  );
}

interface CarsClientProps {
  initialCars: Car[];
}

export default function CarsClient({ initialCars, siteConfig }: CarsClientProps & { siteConfig?: any }) {
  const heroImage = siteConfig?.heroImages?.cars || "/images_v2/hero-cars-v2.jpg";
  const ct = siteConfig?.heroText?.cars || {};
  const cTitle = ct.title || "";
  const cSubtitle = ct.subtitle || "";
  const cTitleFont = ct.titleFont || "'Playfair Display', Georgia, serif";
  const cTitleSize = ct.titleSize || "3rem";
  const cSubtitleSize = ct.subtitleSize || "1.2rem";
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const layout = siteConfig?.sectionLayouts?.cars || { desktop: 3, tablet: 2, mobile: 1 };
  const rowTitles = siteConfig?.sectionRows?.cars || ["Popular Cars", "More Cars", "Additional Cars"];
  const [carType, setCarType] = useState('All');
  const [sort, setSort] = useState('');
  // Apply sort
  const sortedCars = [...initialCars].sort((a, b) => {
    if (sort === 'price_asc') return (a.priceMMK || 0) - (b.priceMMK || 0);
    if (sort === 'price_desc') return (b.priceMMK || 0) - (a.priceMMK || 0);
    return 0;
  });

  const ITEMS_PER_ROW = 6;
  const pool: Car[] = [...sortedCars];
  const carRows: Car[][] = [];
  for (let i = 0; i < pool.length; i += ITEMS_PER_ROW) {
    carRows.push(pool.slice(i, i + ITEMS_PER_ROW));
  }

  return (
    <main className="min-h-screen bg-white">
<section className="relative pt-24 pb-12 px-4 overflow-hidden" style={{ height: (siteConfig?.heroDimensions?.["cars"]?.desktop || 380) + "px" }}>
        <div className="absolute inset-0">
          <img src={heroImage} alt="A9 Global Car Rentals" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images_v2/hero-cars-v2.jpg"; }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="font-bold mb-4 text-[#0A1628]" style={{ fontFamily: cTitleFont, fontSize: cTitleSize }}>
            {cTitle}
          </h1>
          {cSubtitle ? (
            <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8" style={{ fontSize: cSubtitleSize }}>{cSubtitle}</p>
          ) : null}
        </div>
      </section>
<section className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2 flex-wrap">
              {CAR_TYPES.map((type) => (
                <button key={type} onClick={() => setCarType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    carType === type ? 'bg-[#D4AF37] text-white shadow-md' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-[#D4AF37]'}`}>
                  {type}
                </button>
              ))}
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 rounded-xl border border-[#D4AF37]/30 bg-white text-[#0A1628] text-sm font-medium">
              <option value="">Sort by</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <div className="ml-auto"><CurrencyToggle activeCurrency={currency} onToggle={setCurrency} /></div>
          </div>
        </div>
      </section>
<section className="max-w-7xl mx-auto px-4 py-8 pb-20">
        {sortedCars.length === 0 && (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="flex-shrink-0" style={{ width: (siteConfig?.cardDimensions?.cars?.width) || 300 }}><SkeletonCard /></div>)}
          </div>
        )}

        {sortedCars.length > 0 && (
          <div className="space-y-10">
            {carRows.map((row, rowIdx) => (
              <div key={`car-row-${rowIdx}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {rowTitles[rowIdx] || `Row ${rowIdx + 1}`}
                  </h2>
                </div>
                <ScrollingRow>
                  {row.map((car) => (
                    <div key={car._id + '-' + rowIdx} className="flex-shrink-0 snap-start" style={{ width: (siteConfig?.cardDimensions?.cars?.width) || 300 }}>
<CarCard car={car} currency={currency} cardWidth={siteConfig?.cardDimensions?.cars?.width} cardHeight={siteConfig?.cardDimensions?.cars?.height} />
</div>
                  ))}
                </ScrollingRow>
              </div>
            ))}
          </div>
        )}
      </section>
      <DealsBanner />
      <FAQAccordion section="cars" />
      <TestimonialSlider />
</main>
  );
}
