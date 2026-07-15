'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api, Tour } from '@/lib/api';
import TourCard from '@/components/TourCard';
import ScrollingRow from '@/components/ScrollingRow';
import CurrencyToggle from '@/components/CurrencyToggle';

type CategoryKey = 'all';

// For now, tours page uses the database API directly
// Categories (Myanmar/International/Adventure) are derived from destination

const CATEGORY_TABS: { key: CategoryKey; label: string; emoji: string }[] = [
  { key: 'all', label: 'All Tours', emoji: '🌏' },
];

// ─── Page Component ──────────────────────────────────────────

export default function ToursPage() {
  const [apiTours, setApiTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [activeTab] = useState<CategoryKey>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [destination, setDestination] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [sort, setSort] = useState('');

  // Fetch from database API
  const fetchTours = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '50'); // Fetch all for client-side filtering
      if (destination) params.set('destination', destination);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (sort) params.set('sort', sort);
      params.set('currency', currency);

      const res = await fetch(`/api/tours?${params.toString()}`);

      if (!res.ok) throw new Error('Failed to load tours');

      const data = await res.json();
      const tours: Tour[] = (data.data || []).map((t: any) => ({
        ...t,
        _id: t._id || t.id || `tour-${Math.random()}`,
        image: Array.isArray(t.images) ? t.images[0] : t.image || '/images_v2/hotel1-v3.jpg',
        images: t.images || [],
      }));

      setTotalCount(data.pagination?.total || tours.length);
      setTotalPages(data.pagination?.totalPages || Math.max(1, Math.ceil(tours.length / 6)));
      setApiTours(tours);
    } catch (err: any) {
      setError(err.message || 'Failed to load tours');
      console.error('Tours fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, destination, minPrice, maxPrice, sort, currency]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  // Client-side duration filter
  const filteredTours = apiTours.filter((t) => {
    if (durationFilter) {
      const dur = String(t.duration || '');
      const dayMatch = dur.match(/(\d+)/);
      const days = dayMatch ? parseInt(dayMatch[1]) : 0;
      if (durationFilter === '1-3' && days > 3) return false;
      if (durationFilter === '4-7' && (days < 4 || days > 7)) return false;
      if (durationFilter === '8-14' && (days < 8 || days > 14)) return false;
      if (durationFilter === '15+' && days < 15) return false;
    }
    return true;
  });

  const displayTours = filteredTours.slice((page - 1) * 6, page * 6);
  const computedTotal = Math.max(1, Math.ceil(filteredTours.length / 6));

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [destination, minPrice, maxPrice, durationFilter, sort]);

  // Dynamic SEO
  useEffect(() => {
    document.title = 'A9 Global Tours — Myanmar & International Tour Packages | A9 Global Travels';
  }, []);

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative pt-24 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images_v2/hero-tours-v2.jpg" alt="A9 Global Tours" className="w-full h-full object-cover" />
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

      {/* Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="flex flex-wrap gap-2 justify-center border-b border-gray-200 pb-4">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 shadow-md"
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Scrolling Row — Featured from DB */}
      {apiTours.length > 0 && !loading && (
        <section className="max-w-7xl mx-auto px-4 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              🌟 Featured Tours
            </h2>
          </div>
          <ScrollingRow>
            {apiTours.filter(t => t.featured).slice(0, 10).map((item) => (
              <div key={item._id || item.id} className="w-[300px] flex-shrink-0 snap-start">
                <TourCard tour={item} currency={currency} />
              </div>
            ))}
          </ScrollingRow>
        </section>
      )}

      {/* Filter Bar */}
      <section className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                value={destination}
                onChange={(e) => handleFilterChange(setDestination, e.target.value)}
                placeholder="Search tours..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => handleFilterChange(setMinPrice, e.target.value)}
                placeholder="Min MMK"
                className="w-[100px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors [appearance:textfield]"
              />
              <span className="text-gray-400">–</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => handleFilterChange(setMaxPrice, e.target.value)}
                placeholder="Max MMK"
                className="w-[100px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors [appearance:textfield]"
              />
            </div>
            <div className="relative">
              <select
                value={durationFilter}
                onChange={(e) => { setDurationFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none cursor-pointer pr-8"
              >
                <option value="">All Durations</option>
                <option value="1-3">1-3 Days</option>
                <option value="4-7">4-7 Days</option>
                <option value="8-14">8-14 Days</option>
                <option value="15+">15+ Days</option>
              </select>
              <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none cursor-pointer pr-8"
              >
                <option value="">Sort by</option>
                <option value="rating">Rating</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
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

      {/* Results Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8 pb-20">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
            <p className="text-gray-400 mt-4">Loading tours...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20 space-y-4">
            <span className="text-4xl block">⚠️</span>
            <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Something went wrong
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchTours}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && apiTours.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <span className="text-5xl block">✈️</span>
            <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              No Tours Available
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Check back soon for new tour packages, or contact us for custom itineraries.
            </p>
            <button
              onClick={fetchTours}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold hover:shadow-lg transition-all"
            >
              Refresh
            </button>
          </div>
        )}

        {!loading && !error && filteredTours.length === 0 && apiTours.length > 0 && (
          <div className="text-center py-20 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              No Tours Found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">Try adjusting your filters or search terms.</p>
            <button
              onClick={() => { setDestination(''); setMinPrice(''); setMaxPrice(''); setDurationFilter(''); setSort(''); setPage(1); }}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold hover:shadow-lg transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {!loading && !error && displayTours.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">
                Showing <span className="text-gray-900 font-medium">{displayTours.length}</span> of{' '}
                <span className="text-gray-900 font-medium">{filteredTours.length}</span> tours
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTours.map((item) => (
                <TourCard key={item._id || item.id} tour={item} currency={currency} />
              ))}
            </div>

            {/* Pagination */}
            {computedTotal > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-[#D4AF37] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: computedTotal }, (_, i) => i + 1)
                  .filter((p) => { if (computedTotal <= 7) return true; if (p === 1 || p === computedTotal) return true; if (Math.abs(p - page) <= 1) return true; return false; })
                  .map((p, idx, arr) => {
                    const showEllipsis = idx > 0 && arr[idx - 1] !== p - 1;
                    return (
                      <React.Fragment key={p}>
                        {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                        <button
                          onClick={() => setPage(p)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                            page === p
                              ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white shadow-sm'
                              : 'border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-[#D4AF37]'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}
                <button
                  onClick={() => setPage((prev) => Math.min(computedTotal, prev + 1))}
                  disabled={page === computedTotal}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-[#D4AF37] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
