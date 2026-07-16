'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, Car } from '@/lib/api';
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

export default function CarsPage() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
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
        { _id: 'fc5', slug: 'fbc5', carType: 'Mercedes S-Class', capacity: 3, images: ['/images_v2/unsplash-43-v2.jpg'], features: ['AC', 'WiFi', 'Massage'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 250000, priceUSD: 119 }], description: '' },
        { _id: 'fc6', slug: 'fbc6', carType: 'Toyota Land Cruiser Prado', capacity: 7, images: ['/images_v2/unsplash-31-v2.jpg'], features: ['AC', '4WD', 'Sunroof'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 180000, priceUSD: 86 }], description: '' },
        { _id: 'fc7', slug: 'fbc7', carType: 'Toyota Camry', capacity: 5, images: ['/images_v2/unsplash-25-v2.jpg'], features: ['AC', 'Leather', 'GPS'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 90000, priceUSD: 43 }], description: '' },
        { _id: 'fc8', slug: 'fbc8', carType: 'Toyota Wish', capacity: 7, images: ['/images_v2/unsplash-42-v2.jpg'], features: ['AC', 'Spacious'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 80000, priceUSD: 38 }], description: '' },
        { _id: 'fc9', slug: 'fbc9', carType: 'Mitsubishi Pajero', capacity: 7, images: ['/images_v2/unsplash-23-v2.jpg'], features: ['AC', '4WD', 'Luggage'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 160000, priceUSD: 76 }], description: '' },
        { _id: 'fc10', slug: 'fbc10', carType: 'Toyota Noah', capacity: 8, images: ['/images_v2/unsplash-16-v2.jpg'], features: ['AC', 'Spacious', 'WiFi'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 85000, priceUSD: 40 }], description: '' },
        { _id: 'fc11', slug: 'fbc11', carType: 'Honda Civic', capacity: 5, images: ['/images_v2/unsplash-43-v2.jpg'], features: ['AC', 'Fuel Efficient'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 55000, priceUSD: 26 }], description: '' },
        { _id: 'fc12', slug: 'fbc12', carType: 'Toyota Corolla', capacity: 5, images: ['/images_v2/unsplash-31-v2.jpg'], features: ['AC', 'GPS', 'Fuel'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 50000, priceUSD: 24 }], description: '' },
        { _id: 'fc13', slug: 'fbc13', carType: 'BMW 5 Series', capacity: 4, images: ['/images_v2/unsplash-25-v2.jpg'], features: ['AC', 'Leather', 'WiFi'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 220000, priceUSD: 105 }], description: '' },
        { _id: 'fc14', slug: 'fbc14', carType: 'Toyota Hilux', capacity: 5, images: ['/images_v2/unsplash-42-v2.jpg'], features: ['AC', '4WD'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 95000, priceUSD: 45 }], description: '' },
        { _id: 'fc15', slug: 'fbc15', carType: 'Suzuki Ertiga', capacity: 7, images: ['/images_v2/unsplash-23-v2.jpg'], features: ['AC', 'Spacious'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 45000, priceUSD: 21 }], description: '' },
        { _id: 'fc16', slug: 'fbc16', carType: 'Honda HR-V', capacity: 5, images: ['/images_v2/unsplash-16-v2.jpg'], features: ['AC', 'Sunroof', 'Camera'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 75000, priceUSD: 36 }], description: '' },
        { _id: 'fc17', slug: 'fbc17', carType: 'Toyota Innova', capacity: 8, images: ['/images_v2/unsplash-43-v2.jpg'], features: ['AC', 'Spacious', 'Luggage'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 90000, priceUSD: 43 }], description: '' },
        { _id: 'fc18', slug: 'fbc18', carType: 'Nissan X-Trail', capacity: 5, images: ['/images_v2/unsplash-31-v2.jpg'], features: ['AC', '4WD', 'Camera'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 110000, priceUSD: 52 }], description: '' },
        { _id: 'fc19', slug: 'fbc19', carType: 'Mercedes E-Class', capacity: 4, images: ['/images_v2/unsplash-25-v2.jpg'], features: ['AC', 'Leather', 'WiFi'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 200000, priceUSD: 95 }], description: '' },
        { _id: 'fc20', slug: 'fbc20', carType: 'Toyota Probox', capacity: 5, images: ['/images_v2/unsplash-42-v2.jpg'], features: ['AC', 'Cargo'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 40000, priceUSD: 19 }], description: '' },
        { _id: 'fc21', slug: 'fbc21', carType: 'Ford Ranger', capacity: 5, images: ['/images_v2/unsplash-23-v2.jpg'], features: ['AC', '4WD'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 100000, priceUSD: 48 }], description: '' },
        { _id: 'fc22', slug: 'fbc22', carType: 'Mazda CX-5', capacity: 5, images: ['/images_v2/unsplash-16-v2.jpg'], features: ['AC', 'Camera'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 80000, priceUSD: 38 }], description: '' },
        { _id: 'fc23', slug: 'fbc23', carType: 'Toyota Fortuner', capacity: 7, images: ['/images_v2/unsplash-43-v2.jpg'], features: ['AC', '4WD', 'Luggage'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 130000, priceUSD: 62 }], description: '' },
        { _id: 'fc24', slug: 'fbc24', carType: 'Hyundai Tucson', capacity: 5, images: ['/images_v2/unsplash-31-v2.jpg'], features: ['AC', 'Camera'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 70000, priceUSD: 33 }], description: '' },
        { _id: 'fc25', slug: 'fbc25', carType: 'Kia Sorento', capacity: 7, images: ['/images_v2/unsplash-25-v2.jpg'], features: ['AC', 'Spacious'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 110000, priceUSD: 52 }], description: '' },
        { _id: 'fc26', slug: 'fbc26', carType: 'Suzuki Dzire', capacity: 4, images: ['/images_v2/unsplash-42-v2.jpg'], features: ['AC', 'Fuel Efficient'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 35000, priceUSD: 17 }], description: '' },
        { _id: 'fc27', slug: 'fbc27', carType: 'Audi A6', capacity: 4, images: ['/images_v2/unsplash-23-v2.jpg'], features: ['AC', 'Leather', 'WiFi'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 240000, priceUSD: 114 }], description: '' },
        { _id: 'fc28', slug: 'fbc28', carType: 'Toyota Rush', capacity: 5, images: ['/images_v2/unsplash-16-v2.jpg'], features: ['AC', 'Compact'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 65000, priceUSD: 31 }], description: '' },
        { _id: 'fc29', slug: 'fbc29', carType: 'Honda Brio', capacity: 4, images: ['/images_v2/unsplash-43-v2.jpg'], features: ['AC', 'Compact'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 30000, priceUSD: 14 }], description: '' },
        { _id: 'fc30', slug: 'fbc30', carType: 'Isuzu D-Max', capacity: 5, images: ['/images_v2/unsplash-31-v2.jpg'], features: ['AC', '4WD'], pricingWithDriver: [{ duration: 'Full Day', priceMMK: 90000, priceUSD: 43 }], description: '' },
      ];
      setAllCars(fallbackCars);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  // Build 3 rows × 10 cards
  const pool: Car[] = [];
  if (allCars.length > 0) {
    for (let i = 0; i < CARDS_PER_ROW * ROW_COUNT; i++) pool.push(allCars[i % allCars.length]);
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

      {/* Cars — 3 Scrolling Rows of 10 */}
      <section className="max-w-7xl mx-auto px-4 py-8 pb-20">
        {loading && (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="w-[300px] flex-shrink-0"><SkeletonCard /></div>)}
          </div>
        )}

        {!loading && allCars.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>No Cars Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">We couldn't find any vehicles matching your criteria. Please try a different car type or contact us for custom arrangements.</p>
            <button onClick={() => { setCarType('All'); }}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold hover:shadow-lg transition-all">Show All Cars</button>
          </div>
        )}

        {!loading && allCars.length > 0 && (
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
