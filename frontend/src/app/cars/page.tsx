'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, Car } from '@/lib/api';
import CarCard from '@/components/CarCard';
import ScrollingRow from '@/components/ScrollingRow';
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
        </div>
      </div>
    </div>
  );
}

const CAR_TYPES = ['All', 'SUV', 'Sedan', 'MPV', 'Hatchback', 'Pickup', 'Luxury'];

export default function CarsPage() {
  // Fetch from admin database
  const [apiData, setApiData] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    fetch('/api/cars').then(r => r.json()).then(data => {
      const items = data?.data || data || [];
      if (items.length > 0) { setApiData(items); setDataLoaded(true); }
    }).catch(() => {});
  }, []);

  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [carType, setCarType] = useState('All');
  const [allCars, setAllCars] = useState<Car[]>([]);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<Car[]>('/cars', { limit: 50 });
      const data = response.data as unknown as Car[];
      const raw = Array.isArray(data) ? data : [];
      // Fill in missing pricing (Redis cache may have empty arrays)
      const defaultPrices: Record<string, { duration: string; priceMMK: number; priceUSD: number }> = {
        'Toyota Alphard': { duration: 'Full Day', priceMMK: 150000, priceUSD: 71 },
        'Toyota Wish': { duration: 'Full Day', priceMMK: 80000, priceUSD: 38 },
        'Toyota Noah': { duration: 'Full Day', priceMMK: 85000, priceUSD: 40 },
        'Alphard Executive': { duration: 'Full Day', priceMMK: 200000, priceUSD: 95 },
        'Minibus 15-Seater': { duration: 'Full Day', priceMMK: 120000, priceUSD: 57 },
        'Probox Budget': { duration: 'Full Day', priceMMK: 50000, priceUSD: 24 },
      };
      const withPricing = raw.map((c) => ({
        ...c,
        pricingWithDriver: (c.pricingWithDriver && c.pricingWithDriver.length > 0)
          ? c.pricingWithDriver
          : defaultPrices[c.carType || ''] ? [defaultPrices[c.carType || '']] : [{ duration: 'Full Day', priceMMK: 0, priceUSD: 0 }],
      }));
      setAllCars(withPricing);
    } catch (err) {
      console.error('Failed to fetch cars:', err);
      const fallbackCars: Car[] = [
        { _id: 'fc1', slug: 'fbc1', carType: 'Toyota Alphard', capacity: 6, images: ['/images_v2/unsplash-25-v2.jpg'], features: ['AC', 'Leather', 'WiFi'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 100000, priceUSD: 48 }], description: '' },
        { _id: 'fc2', slug: 'fbc2', carType: 'Toyota Vios', capacity: 4, images: ['/images_v2/unsplash-42-v2.jpg'], features: ['AC', 'GPS', 'Fuel'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 60000, priceUSD: 29 }], description: '' },
        { _id: 'fc3', slug: 'fbc3', carType: 'Toyota Hiace', capacity: 12, images: ['/images_v2/unsplash-23-v2.jpg'], features: ['AC', 'Luggage'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 140000, priceUSD: 67 }], description: '' },
        { _id: 'fc4', slug: 'fbc4', carType: 'Honda CR-V', capacity: 5, images: ['/images_v2/unsplash-16-v2.jpg'], features: ['AC', 'Sunroof'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 85000, priceUSD: 40 }], description: '' },
        { _id: 'fc5', slug: 'fbc5', carType: 'Mercedes S-Class', capacity: 3, images: ['/images/unsplash-43.jpg'], features: ['AC', 'WiFi', 'Massage'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 250000, priceUSD: 119 }], description: '' },
        { _id: 'fc6', slug: 'fbc6', carType: 'Toyota Land Cruiser Prado', capacity: 7, images: ['/images_v2/unsplash-31-v2.jpg'], features: ['AC', '4WD', 'Sunroof'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 180000, priceUSD: 86 }], description: '' },
      ];
      setAllCars(fallbackCars);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  useEffect(() => {
    let filtered = [...allCars];
    if (carType !== 'All') {
      filtered = filtered.filter((c) => c.carType && c.carType.toLowerCase().includes(carType.toLowerCase()));
    }
    const start = (page - 1) * 6;
    setTotal(filtered.length);
    setTotalPages(Math.max(1, Math.ceil(filtered.length / 6)));
    setCars(filtered.slice(start, start + 6));
  }, [allCars, carType, page]);

  const handleTypeChange = (type: string) => { setCarType(type); setPage(1); };

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
                <button key={type} onClick={() => handleTypeChange(type)}
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

      {/* Featured Scrolling Row */}
      {!loading && allCars.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>🚗 Popular Cars</h2>
          </div>
          <ScrollingRow>
            {allCars.slice(0, 6).map((car) => (
              <div key={car._id} className="w-[300px] flex-shrink-0 snap-start">
                <CarCard car={car} currency={currency} />
              </div>
            ))}
          </ScrollingRow>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-10 pb-20">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && cars.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>No Cars Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">We couldn't find any vehicles matching your criteria. Please try a different car type or contact us for custom arrangements.</p>
            <button onClick={() => { setCarType('All'); setPage(1); }}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold hover:shadow-lg transition-all">Show All Cars</button>
          </div>
        )}

        {!loading && cars.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">Showing <span className="text-gray-900 font-medium">{cars.length}</span> of <span className="text-gray-900 font-medium">{total}</span> vehicles</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => <CarCard key={car._id} car={car} currency={currency} />)}
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
