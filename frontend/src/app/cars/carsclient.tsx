'use client';

import React, { useState } from 'react';
import { Car } from '@/lib/api';
import CarCard from '@/components/CarCard';
import ScrollingRow from '@/components/ScrollingRow';
import CurrencyToggle from '@/components/CurrencyToggle';

const ROW_TITLES = ['🚗 Popular Cars', '🚙 SUVs & Family', '🏎️ Luxury & Sedans'];
const CARDS_PER_ROW = 10;
const ROW_COUNT = 3;

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

export default function CarsClient({ initialCars }: CarsClientProps) {
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [carType, setCarType] = useState('All');

  const pool: Car[] = [];
  const cars = initialCars;
  if (cars.length > 0) {
    for (let i = 0; i < CARDS_PER_ROW * ROW_COUNT; i++) pool.push(cars[i % cars.length]);
  }
  const carRows: Car[][] = [
    pool.slice(0, CARDS_PER_ROW),
    pool.slice(CARDS_PER_ROW, CARDS_PER_ROW * 2),
    pool.slice(CARDS_PER_ROW * 2, CARDS_PER_ROW * 3),
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="relative pt-24 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images_v2/hero-cars-v2.jpg" alt="A9 Global Car Rentals" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/75" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#0A1628]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Premium Car Rentals
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
            Travel in comfort and style. Choose from our fleet of well-maintained vehicles with professional drivers.
          </p>
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
            <div className="ml-auto"><CurrencyToggle activeCurrency={currency} onToggle={setCurrency} /></div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 pb-20">
        {cars.length === 0 && (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="w-[300px] flex-shrink-0"><SkeletonCard /></div>)}
          </div>
        )}

        {cars.length > 0 && (
          <div className="space-y-10">
            {carRows.map((row, rowIdx) => (
              <div key={`car-row-${rowIdx}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {ROW_TITLES[rowIdx]}
                  </h2>
                </div>
                <ScrollingRow>
                  {row.map((car) => (
                    <div key={car._id + '-' + rowIdx} className="w-[300px] flex-shrink-0 snap-start">
                      <CarCard car={car} currency={currency} />
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