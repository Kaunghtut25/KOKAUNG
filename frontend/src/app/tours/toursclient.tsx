'use client';

import React, { useState, useEffect } from 'react';
import TourCard from '@/components/TourCard';
import ScrollingRow from '@/components/ScrollingRow';
import CurrencyToggle from '@/components/CurrencyToggle';
import DealsBanner from '@/components/DealsBanner';
import FAQAccordion from '@/components/FAQAccordion';
import TestimonialSlider from '@/components/TestimonialSlider';
import RoutesMap from '@/components/RoutesMap';

export default function ToursClient(props) {
  const [heroImage, setHeroImage] = useState("/images_v2/hero-tours-v2.jpg");
  const { initialTours, preloadMap } = props;
  const [apiTours, setApiTours] = useState(initialTours);
  const [currency, setCurrency] = useState('MMK');
  const [layout, setLayout] = useState({ desktop: 3, tablet: 2, mobile: 1 });
  useEffect(() => {
    fetch("/api/admin/site-config")
      .then(r => r.json())
      .then(d => {
        if (d?.sectionLayouts?.tours) setLayout(d.sectionLayouts.tours);
      })
      .catch(() => {});
  }, []);
  const [rowTitles, setRowTitles] = useState(["Featured Tours", "More Tours", "Additional Tours"]);
  useEffect(() => {
    fetch("/api/admin/site-config")
      .then(r => r.json())
      .then(d => {
        if (d?.sectionRows?.tours) setRowTitles(d.sectionRows.tours);
      })
      .catch(() => {});
  }, []);
  const [destination, setDestination] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [sort, setSort] = useState('');
  useEffect(() => { fetch("/api/admin/settings").then(r => r.json()).then(d => { if (d?.heroImages?.tours) setHeroImage(d.heroImages.tours); }).catch(() => {}); }, []);

  useEffect(() => {
    fetch('/api/tours?page=1&limit=50').then(r => r.json()).then(data => {
      const items = data?.data || data || [];
      if (items.length > 0) {
        const tours = items.map((t) => ({
          _id: t._id, slug: t.slug, title: t.title || 'Untitled',
          destination: t.destination || '', description: t.description || '',
          priceMMK: t.priceMMK || 0, priceUSD: t.priceUSD || 0,
          duration: t.duration || '', rating: t.rating || 0,
          reviewCount: t.reviewCount || 0,
          image: t.image || t.images?.[0] || '/images_v2/hero-tours-v2.jpg',
          images: t.images || [], amenities: t.amenities || [],
        }));
        setApiTours(tours);
      }
    }).catch(() => {});
  }, []);

  const filteredTours = apiTours.filter((t) => {
    const q = destination.toLowerCase();
    if (q && !String(t.destination).toLowerCase().includes(q) && !String(t.title).toLowerCase().includes(q)) return false;
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
    if (sort === 'duration') {
      const aMatch = String(a.duration).match(/(\d+)/);
      const bMatch = String(b.duration).match(/(\d+)/);
      const aDays = aMatch ? parseInt(aMatch[1]) : 0;
      const bDays = bMatch ? parseInt(bMatch[1]) : 0;
      return aDays - bDays;
    }
    return 0;
  });

  const ITEMS_PER_ROW = 6;
  const pool = [...sortedTours];
  const tourRows = [];
  for (let i = 0; i < pool.length; i += ITEMS_PER_ROW) {
    tourRows.push(pool.slice(i, i + ITEMS_PER_ROW));
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative pt-24 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="A9 Global Tours" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images_v2/hero-tours-v2.jpg"; }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/80 via-[#0A1628]/40 to-[#0A1628]/60" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Explore Our Tours
          </h1>
          <p className="text-gray-300 text-lg">Discover the beauty of Myanmar with our curated tour packages</p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" className="px-4 py-2 rounded-xl border border-gray-200 text-sm" />
          <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min Price" type="number" className="px-4 py-2 rounded-xl border border-gray-200 text-sm w-28" />
          <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max Price" type="number" className="px-4 py-2 rounded-xl border border-gray-200 text-sm w-28" />
          <select value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm">
            <option value="">Any Duration</option>
            <option value="1-3">1-3 Days</option>
            <option value="4-7">4-7 Days</option>
            <option value="8-14">8-14 Days</option>
            <option value="15+">15+ Days</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm">
            <option value="">Sort By</option>
            <option value="rating">Rating (High to Low)</option>
            <option value="price_asc">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="duration">Duration (Short to Long)</option>
          </select>
          <CurrencyToggle currency={currency} setCurrency={setCurrency} />
        </div>
      </section>

      {/* Tour Rows */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        {sortedTours.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No tours found matching your filters.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {tourRows.map((row, rowIdx) => (
              <div key={rowIdx}>
                <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {rowTitles[rowIdx] || `Row ${rowIdx + 1}`}
                </h2>
                <ScrollingRow>
                  {row.map((item, i) => (
                    <div key={item._id || i} className="w-[300px] flex-shrink-0 snap-start">
<TourCard tour={item} currency={currency} preloadedImage={preloadMap?.[item._id]} />
</div>
                  ))}
                </ScrollingRow>
              </div>
            ))}
          </div>
        )}
      </section>
          <DealsBanner />
      <FAQAccordion section="tours" />
      <TestimonialSlider />
      <RoutesMap />
</main>
  );
}
