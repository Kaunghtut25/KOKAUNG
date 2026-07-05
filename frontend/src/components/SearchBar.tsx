'use client';

import React, { useState, FormEvent, useCallback } from 'react';
import CurrencyToggle from './CurrencyToggle';
import { searchAll, SearchParams, SearchResults } from '@/lib/api';

interface SearchBarProps {
  onSearch: (results: SearchResults | null, loading: boolean) => void;
  initialParams?: SearchParams;
}

const TYPE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'tours', label: 'Tours' },
  { value: 'hotels', label: 'Hotels' },
  { value: 'cars', label: 'Cars' },
];

export default function SearchBar({ onSearch, initialParams }: SearchBarProps) {
  const [query, setQuery] = useState(initialParams?.query || '');
  const [destination, setDestination] = useState(initialParams?.destination || '');
  const [type, setType] = useState<string>(initialParams?.type || 'all');
  const [minPrice, setMinPrice] = useState(initialParams?.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(initialParams?.maxPrice?.toString() || '');
  const [travelDate, setTravelDate] = useState(initialParams?.travelDate || '');
  const [currency, setCurrency] = useState<'MMK' | 'USD'>(initialParams?.currency || 'MMK');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);
      onSearch(null, true);

      try {
        const params: SearchParams = {
          type: type as SearchParams['type'],
          currency,
        };
        if (query.trim()) params.query = query.trim();
        if (destination.trim()) params.destination = destination.trim();
        if (minPrice) params.minPrice = Number(minPrice);
        if (maxPrice) params.maxPrice = Number(maxPrice);
        if (travelDate) params.travelDate = travelDate;

        const response = await searchAll(params);
        onSearch(response.data, false);
      } catch (err) {
        console.error('Search failed:', err);
        onSearch(null, false);
      } finally {
        setLoading(false);
      }
    },
    [query, destination, type, minPrice, maxPrice, travelDate, currency, onSearch]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-4xl mx-auto rounded-2xl border backdrop-blur-lg bg-white/5 p-6 space-y-4 transition-all duration-300 ${
        isFocused ? 'border-gold/60 shadow-[0_0_30px_rgba(212,175,55,0.15)]' : 'border-gold/30 shadow-lg'
      }`}
    >
      {/* Main search input */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Where do you want to go?"
          className="w-full pl-12 pr-4 py-4 bg-white/10 border border-gold/20 rounded-xl text-white placeholder-gray-400 text-lg focus:outline-none focus:border-gold/50 transition-colors duration-200"
        />
      </div>

      {/* Filter row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Destination */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destination"
            className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-gold/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>

        {/* Type dropdown */}
        <div className="relative">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/10 border border-gold/20 rounded-lg text-white text-sm focus:outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Price range */}
        <div className="flex gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min price"
            className="w-1/2 px-3 py-2.5 bg-white/10 border border-gold/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-gold/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max price"
            className="w-1/2 px-3 py-2.5 bg-white/10 border border-gold/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-gold/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {/* Travel date */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <input
            type="date"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-gold/20 rounded-lg text-white text-sm focus:outline-none focus:border-gold/50 transition-colors [color-scheme:dark]"
          />
        </div>

        {/* Currency toggle */}
        <CurrencyToggle activeCurrency={currency} onToggle={setCurrency} />
      </div>

      {/* Search button */}
      <div className="flex justify-center pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-10 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#E5C048] hover:to-[#D4AF37] text-gray-900 font-semibold text-base shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Searching...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </>
          )}
        </button>
      </div>
    </form>
  );
}
