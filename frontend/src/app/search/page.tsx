'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import CurrencyToggle from '@/components/CurrencyToggle';
import TourCard from '@/components/TourCard';
import HotelCard from '@/components/HotelCard';
import CarCard from '@/components/CarCard';
import { SearchResults, Tour, Hotel, Car } from '@/lib/api';

type TabType = 'all' | 'tours' | 'hotels' | 'cars';

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gold/20 animate-pulse">
      <div className="h-[300px] bg-white/5" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-6 bg-white/10 rounded-full w-16" />
          <div className="h-6 bg-white/10 rounded-full w-16" />
          <div className="h-6 bg-white/10 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 space-y-4">
      <svg className="w-20 h-20 mx-auto text-gold/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 className="text-xl font-semibold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
        No results found
      </h3>
      <p className="text-gray-400 max-w-md mx-auto">
        We couldn&apos;t find anything matching your search. Try adjusting your filters or searching for a different destination.
      </p>
    </div>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');

  const handleSearch = useCallback((data: SearchResults | null, isLoading: boolean) => {
    setResults(data);
    setLoading(isLoading);
  }, []);

  // Auto-search when arriving with URL params
  useEffect(() => {
    const q = searchParams.get('q');
    const dest = searchParams.get('dest');
    const typeParam = searchParams.get('type');
    if (!q && !dest) return;

    const doSearch = async () => {
      setLoading(true);
      try {
        const params: Record<string, unknown> = {};
        if (typeParam) params.type = typeParam;
        if (q) params.query = q;
        if (dest) params.destination = dest;
        const response = await searchAll(params as SearchParams);
        setResults(response.data);
      } catch (err) {
        console.error('Auto-search failed:', err);
      } finally {
        setLoading(false);
      }
    };
    doSearch();
  }, [searchParams]);

  // Parse initial query from URL if present
  const initialParams = {
    query: searchParams.get('q') || undefined,
    type: (searchParams.get('type') as TabType) || undefined,
    destination: searchParams.get('dest') || undefined,
  };

  const tabs: { key: TabType; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: results ? results.tours.length + results.hotels.length + results.cars.length : undefined },
    { key: 'tours', label: 'Tours', count: results?.tours.length },
    { key: 'hotels', label: 'Hotels', count: results?.hotels.length },
    { key: 'cars', label: 'Cars', count: results?.cars.length },
  ];

  const getFilteredItems = () => {
    if (!results) return { tours: [], hotels: [], cars: [] };
    if (activeTab === 'tours') return { tours: results.tours, hotels: [], cars: [] };
    if (activeTab === 'hotels') return { tours: [], hotels: results.hotels, cars: [] };
    if (activeTab === 'cars') return { tours: [], hotels: [], cars: results.cars };
    return results;
  };

  const filtered = getFilteredItems();
  const totalItems = filtered.tours.length + filtered.hotels.length + filtered.cars.length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Hero search section */}
      <section className="relative pt-24 pb-12 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)]" />
        <div className="relative">
          <h1
            className="text-4xl md:text-5xl text-center text-white font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Discover Your Journey
          </h1>
          <p className="text-gray-400 text-center mb-10 text-lg">
            Search tours, hotels, and car rentals across Myanmar
          </p>
          <SearchBar onSearch={handleSearch} initialParams={initialParams} />
        </div>
      </section>

      {/* Results section */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {/* Tabs + Currency */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex bg-white/5 rounded-xl p-1 border border-gold/10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1.5 text-xs opacity-75">({tab.count})</span>
                )}
              </button>
            ))}
          </div>
          <CurrencyToggle activeCurrency={currency} onToggle={setCurrency} />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && results && totalItems === 0 && <EmptyState />}

        {/* Results grid */}
        {!loading && totalItems > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.tours.map((tour: Tour) => (
                <TourCard key={tour._id} tour={tour} currency={currency} />
              ))}
              {filtered.hotels.map((hotel: Hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} currency={currency} />
              ))}
              {filtered.cars.map((car: Car) => (
                <CarCard key={car._id} car={car} currency={currency} />
              ))}
            </div>

            {/* Result count */}
            <p className="text-center text-gray-500 text-sm mt-8">
              Showing {totalItems} result{totalItems !== 1 ? 's' : ''}
            </p>
          </>
        )}

        {/* Initial state - no search performed yet */}
        {!loading && !results && (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto text-gold/20 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-lg">Use the search bar above to find your perfect trip</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
          <div className="animate-spin w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
