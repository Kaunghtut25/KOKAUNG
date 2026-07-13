'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api, Tour } from '@/lib/api';
import TourCard from '@/components/TourCard';
import ScrollingRow from '@/components/ScrollingRow';
import CurrencyToggle from '@/components/CurrencyToggle';

type CategoryKey = 'all' | 'myanmar' | 'international' | 'adventure';

// ─── Data ────────────────────────────────────────────────────


// ─── Fetch from admin database ──────────────────────────
const [apiTours, setApiTours] = useState<(Tour & { image: string })[]>([]);
useEffect(() => { api.get('/tours').then((res: any) => { if (res?.data?.length) setApiTours(res.data); }).catch(() => {}); }, []);
const effectiveTours = (list: (Tour & { image: string })[]) => apiTours.length > 0 ? apiTours.filter((t: any) => list.some((l: any) => l.slug === t.slug || l.title === t.title)) : list;

const MYANMAR_TOURS: (Tour & { image: string })[] = [
  { _id: 'm1', slug: 'golden-land-explorer', title: 'Golden Land Explorer', destination: 'Yangon-Bagan-Mandalay-Inle', priceMMK: 1850000, priceUSD: 881, duration: '8D/7N', durationUnit: 'Days', rating: 4.8, reviewCount: 142, image: 'https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=600&h=400&fit=crop'], amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'], featured: true, description: '', groupSize: 20, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'm2', slug: 'bagan-sunrise-discovery', title: 'Bagan Sunrise Discovery', destination: 'Bagan', priceMMK: 950000, priceUSD: 452, duration: '5D/4N', durationUnit: 'Days', rating: 4.9, reviewCount: 98, image: 'https://images.unsplash.com/photo-1558704475-1428913b4c6b?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1558704475-1428913b4c6b?w=600&h=400&fit=crop'], amenities: ['Hotel', 'Breakfast', 'E-Bike', 'Boat Cruise'], featured: true, description: '', groupSize: 15, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'm3', slug: 'mandalay-royal-heritage', title: 'Mandalay Royal Heritage', destination: 'Mandalay', priceMMK: 750000, priceUSD: 357, duration: '4D/3N', durationUnit: 'Days', rating: 4.6, reviewCount: 67, image: 'https://images.unsplash.com/photo-1590474251443-ea19bb0f4e89?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1590474251443-ea19bb0f4e89?w=600&h=400&fit=crop'], amenities: ['Hotel', 'Breakfast', 'Boat Trip', 'Guide'], featured: false, description: '', groupSize: 20, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'm4', slug: 'inle-lake-serenity', title: 'Inle Lake Serenity', destination: 'Inle Lake', priceMMK: 1100000, priceUSD: 524, duration: '5D/4N', durationUnit: 'Days', rating: 4.7, reviewCount: 85, image: 'https://images.unsplash.com/photo-1583431815168-55a35bfefbd3?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1583431815168-55a35bfefbd3?w=600&h=400&fit=crop'], amenities: ['Hotel', 'Breakfast', 'Boat Tour', 'Canoe'], featured: true, description: '', groupSize: 16, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'm5', slug: 'ngapali-beach-escape', title: 'Ngapali Beach Escape', destination: 'Ngapali Beach', priceMMK: 1350000, priceUSD: 643, duration: '4D/3N', durationUnit: 'Days', rating: 4.5, reviewCount: 52, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop'], amenities: ['Resort', 'Breakfast', 'Snorkeling', 'Beach'], featured: false, description: '', groupSize: 18, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'm6', slug: 'yangon-cultural-tour', title: 'Yangon Cultural Tour', destination: 'Yangon', priceMMK: 450000, priceUSD: 214, duration: '3D/2N', durationUnit: 'Days', rating: 4.4, reviewCount: 43, image: 'https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=600&h=400&fit=crop'], amenities: ['Hotel', 'Breakfast', 'Train Ride', 'Tea Shop'], featured: false, description: '', groupSize: 25, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'm7', slug: 'myeik-archipelago-adventure', title: 'Myeik Archipelago Adventure', destination: 'Myeik', priceMMK: 2200000, priceUSD: 1048, duration: '6D/5N', durationUnit: 'Days', rating: 4.9, reviewCount: 37, image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop'], amenities: ['Boat Cabin', 'All Meals', 'Snorkeling', 'Kayak'], featured: true, description: '', groupSize: 12, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'm8', slug: 'yangon-mandalay-express', title: 'Yangon-Mandalay Express', destination: 'Yangon-Mandalay', priceMMK: 550000, priceUSD: 262, duration: '3D/2N', durationUnit: 'Days', rating: 4.3, reviewCount: 38, image: 'https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=600&h=400&fit=crop'], amenities: ['Hotel', 'Breakfast', 'Flight', 'Guide'], featured: false, description: '', groupSize: 22, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'm9', slug: 'shan-highland-trek', title: 'Shan Highland Trek', destination: 'Kalaw-Inle', priceMMK: 850000, priceUSD: 405, duration: '5D/4N', durationUnit: 'Days', rating: 4.8, reviewCount: 45, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop'], amenities: ['Homestay', 'All Meals', 'Guide', 'Porter'], featured: true, description: '', groupSize: 12, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'm10', slug: 'mrauk-u-ancient-kingdoms', title: 'Mrauk U Ancient Kingdoms', destination: 'Mrauk U', priceMMK: 950000, priceUSD: 452, duration: '4D/3N', durationUnit: 'Days', rating: 4.7, reviewCount: 24, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop'], amenities: ['Hotel', 'Breakfast', 'Boat', 'Guide'], featured: false, description: '', groupSize: 12, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'm11', slug: 'hpa-an-cave-explorer', title: 'Hpa-An Cave Explorer', destination: 'Hpa-An', priceMMK: 420000, priceUSD: 200, duration: '3D/2N', durationUnit: 'Days', rating: 4.5, reviewCount: 31, image: 'https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=600&h=400&fit=crop'], amenities: ['Hotel', 'Breakfast', 'Boat', 'Guide'], featured: false, description: '', groupSize: 18, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'm12', slug: 'pyin-oo-lwin-flower-festival', title: 'Pyin Oo Lwin Flower Festival', destination: 'Pyin Oo Lwin', priceMMK: 550000, priceUSD: 262, duration: '4D/3N', durationUnit: 'Days', rating: 4.4, reviewCount: 27, image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4c2ab?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1585320806297-9794b3e4c2ab?w=600&h=400&fit=crop'], amenities: ['Hotel', 'Breakfast', 'Gardens', 'Coffee Tour'], featured: false, description: '', groupSize: 18, itinerary: [], included: [], excluded: [], createdAt: '' },
];

const INTERNATIONAL_TOURS: (Tour & { image: string })[] = [
  { _id: 'i1', slug: 'bangkok-pattaya-luxury', title: 'Bangkok-Pattaya Luxury', destination: 'Thailand', priceMMK: 1650000, priceUSD: 786, duration: '5D/4N', durationUnit: 'Days', rating: 4.5, reviewCount: 76, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop'], amenities: ['Hotel', 'Breakfast', 'Island Tour', 'Guide'], featured: false, description: '', groupSize: 22, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'i2', slug: 'singapore-city-lights', title: 'Singapore City Lights', destination: 'Singapore', priceMMK: 2100000, priceUSD: 1000, duration: '4D/3N', durationUnit: 'Days', rating: 4.7, reviewCount: 63, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop'], amenities: ['Hotel', 'Breakfast', 'Gardens', 'Sentosa'], featured: false, description: '', groupSize: 18, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'i3', slug: 'angkor-wat-discovery', title: 'Angkor Wat Discovery', destination: 'Cambodia', priceMMK: 1450000, priceUSD: 690, duration: '4D/3N', durationUnit: 'Days', rating: 4.5, reviewCount: 54, image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop'], amenities: ['Hotel', 'Breakfast', 'Tuk-Tuk', 'Boat'], featured: false, description: '', groupSize: 20, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'i4', slug: 'vietnam-heritage-trail', title: 'Vietnam Heritage Trail', destination: 'Vietnam', priceMMK: 2400000, priceUSD: 1143, duration: '7D/6N', durationUnit: 'Days', rating: 4.8, reviewCount: 82, image: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=600&h=400&fit=crop'], amenities: ['Hotel', 'Breakfast', 'Cruise', 'Guide'], featured: true, description: '', groupSize: 18, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'i5', slug: 'bali-paradise-escape', title: 'Bali Paradise Escape', destination: 'Indonesia', priceMMK: 1950000, priceUSD: 929, duration: '5D/4N', durationUnit: 'Days', rating: 4.7, reviewCount: 59, image: 'https://images.unsplash.com/photo-1537996194471-e657f9e13f57?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1537996194471-e657f9e13f57?w=600&h=400&fit=crop'], amenities: ['Resort', 'Breakfast', 'Temples', 'Spa'], featured: true, description: '', groupSize: 16, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'i6', slug: 'japan-cherry-blossom-tour', title: 'Japan Cherry Blossom Tour', destination: 'Japan', priceMMK: 3850000, priceUSD: 1833, duration: '7D/6N', durationUnit: 'Days', rating: 4.9, reviewCount: 72, image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=600&h=400&fit=crop'], amenities: ['Hotel', 'Breakfast', 'JR Pass', 'Tea Ceremony'], featured: true, description: '', groupSize: 14, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'i7', slug: 'golden-triangle-explorer', title: 'Golden Triangle Explorer', destination: 'Myanmar-Thailand-Laos', priceMMK: 3500000, priceUSD: 1667, duration: '10D/9N', durationUnit: 'Days', rating: 4.6, reviewCount: 29, image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop'], amenities: ['Hotel', 'Breakfast', 'Cruise', 'Guide'], featured: false, description: '', groupSize: 15, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'i8', slug: 'maldives-honeymoon-special', title: 'Maldives Honeymoon Special', destination: 'Maldives', priceMMK: 3200000, priceUSD: 1524, duration: '4D/3N', durationUnit: 'Days', rating: 4.9, reviewCount: 44, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop'], amenities: ['Overwater Villa', 'Full Board', 'Spa', 'Cruise'], featured: true, description: '', groupSize: 2, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'i9', slug: 'south-korea-discovery', title: 'South Korea Discovery', destination: 'South Korea', priceMMK: 2950000, priceUSD: 1405, duration: '6D/5N', durationUnit: 'Days', rating: 4.6, reviewCount: 41, image: 'https://images.unsplash.com/photo-1534274988757-a0bf53023472?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1534274988757-a0bf53023472?w=600&h=400&fit=crop'], amenities: ['Hotel', 'Breakfast', 'KORAIL', 'Jeju'], featured: false, description: '', groupSize: 16, itinerary: [], included: [], excluded: [], createdAt: '' },
  { _id: 'i10', slug: 'dubai-luxury-experience', title: 'Dubai Luxury Experience', destination: 'UAE', priceMMK: 2750000, priceUSD: 1310, duration: '5D/4N', durationUnit: 'Days', rating: 4.7, reviewCount: 88, image: 'https://images.unsplash.com/photo-1512453979796-25f96bf5c20fe?w=600&h=400&fit=crop', images: ['https://images.unsplash.com/photo-1512453979796-25f96bf5c20fe?w=600&h=400&fit=crop'], amenities: ['Hotel', 'Breakfast', 'Burj Khalifa', 'Desert Safari'], featured: false, description: '', groupSize: 20, itinerary: [], included: [], excluded: [], createdAt: '' },
];

const ADVENTURE_TOURS: (Tour & { image: string })[] = [
  MYANMAR_TOURS[6], MYANMAR_TOURS[8], INTERNATIONAL_TOURS[6],
  MYANMAR_TOURS[1], INTERNATIONAL_TOURS[3], MYANMAR_TOURS[10],
];

const ALL_TOURS_DATA = [...effectiveTours(MYANMAR_TOURS), ...INTERNATIONAL_TOURS];

function getCategoryTours(cat: CategoryKey): (Tour & { image: string })[] {
  switch (cat) {
    case 'myanmar': return MYANMAR_TOURS;
    case 'international': return INTERNATIONAL_TOURS;
    case 'adventure': return ADVENTURE_TOURS;
    default: return ALL_TOURS_DATA;
  }
}

// ─── Components ──────────────────────────────────────────────

const CATEGORY_TABS: { key: CategoryKey; label: string; emoji: string }[] = [
  { key: 'all', label: 'All Tours', emoji: '🌏' },
  { key: 'myanmar', label: 'Discover Myanmar', emoji: '🇲🇲' },
  { key: 'international', label: 'International', emoji: '✈️' },
  { key: 'adventure', label: 'Adventure', emoji: '🏔️' },
];

// ─── Page Component ──────────────────────────────────────────

export default function ToursPage() {
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [activeTab, setActiveTab] = useState<CategoryKey>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [destination, setDestination] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [sort, setSort] = useState('');

  // Build client-filtered list
  const categoryTours = getCategoryTours(activeTab);

  const filteredTours = categoryTours.filter((t) => {
    if (destination.trim() && !t.destination.toLowerCase().includes(destination.trim().toLowerCase()) && !t.title.toLowerCase().includes(destination.trim().toLowerCase())) return false;
    if (minPrice && t.priceMMK < Number(minPrice)) return false;
    if (maxPrice && t.priceMMK > Number(maxPrice)) return false;
    if (durationFilter) {
      const days = parseInt(t.duration.split('D')[0]) || 0;
      if (durationFilter === '1-3' && days > 3) return false;
      if (durationFilter === '4-7' && (days < 4 || days > 7)) return false;
      if (durationFilter === '8-14' && (days < 8 || days > 14)) return false;
      if (durationFilter === '15+' && days < 15) return false;
    }
    return true;
  });

  // Sort
  const sortedTours = [...filteredTours].sort((a, b) => {
    if (sort === 'rating') return b.rating - a.rating;
    if (sort === 'price_asc') return a.priceMMK - b.priceMMK;
    if (sort === 'price_desc') return b.priceMMK - a.priceMMK;
    return 0;
  });

  const ITEMS_PER_PAGE = 6;
  const totalFiltered = sortedTours.length;
  const computedTotalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE);
  const displayTours = sortedTours.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [activeTab, destination, minPrice, maxPrice, durationFilter, sort]);

  // Dynamic SEO title
  useEffect(() => {
    document.title = 'A9 Global Tours — Myanmar & International Tour Packages | A9 Global Travels';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Explore 20+ premium tour packages across Myanmar, Thailand, Vietnam, Singapore, Japan, Bali, Maldives, and more. Handpicked destinations, expert guides, IATA-accredited travel agency in Yangon.');
    }
  }, []);

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative pt-24 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-tours.jpg" alt="A9 Global Tours — Myanmar & International Travel Packages" className="w-full h-full object-cover" />
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
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Scrolling Row — Featured / category showcase */}
      <section className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {activeTab === 'all' ? '🌟 Featured Tours' : activeTab === 'myanmar' ? '🇲🇲 Discover Myanmar' : activeTab === 'international' ? '✈️ International Escapes' : '🏔️ Adventure Awaits'}
          </h2>
        </div>
        <ScrollingRow>
          {categoryTours.slice(0, 10).map((item) => (
            <div key={item._id} className="w-[300px] flex-shrink-0 snap-start">
              <TourCard tour={item} currency={currency} />
            </div>
          ))}
        </ScrollingRow>
      </section>

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
                className="w-[100px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-gray-400">–</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => handleFilterChange(setMaxPrice, e.target.value)}
                placeholder="Max MMK"
                className="w-[100px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="relative">
              <select
                value={durationFilter}
                onChange={(e) => { setDurationFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none cursor-pointer pr-8"
              >
                <option value="" className="bg-white text-gray-900">All Durations</option>
                <option value="1-3" className="bg-white text-gray-900">1-3 Days</option>
                <option value="4-7" className="bg-white text-gray-900">4-7 Days</option>
                <option value="8-14" className="bg-white text-gray-900">8-14 Days</option>
                <option value="15+" className="bg-white text-gray-900">15+ Days</option>
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
                <option value="" className="bg-white text-gray-900">Sort by</option>
                <option value="rating" className="bg-white text-gray-900">Rating</option>
                <option value="price_asc" className="bg-white text-gray-900">Price: Low to High</option>
                <option value="price_desc" className="bg-white text-gray-900">Price: High to Low</option>
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
        {displayTours.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>No Tours Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">Try adjusting your filters or search terms.</p>
            <button
              onClick={() => { setDestination(''); setMinPrice(''); setMaxPrice(''); setDurationFilter(''); setSort(''); setPage(1); }}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold hover:shadow-lg transition-all"
            >
              Show All Tours
            </button>
          </div>
        )}

        {displayTours.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">
                Showing <span className="text-gray-900 font-medium">{displayTours.length}</span> of{' '}
                <span className="text-gray-900 font-medium">{totalFiltered}</span> tours
              </p>
              <span className="text-xs text-gray-400">
                {CATEGORY_TABS.find(t => t.key === activeTab)?.label}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTours.map((item) => (
                <TourCard key={item._id} tour={item} currency={currency} />
              ))}</div>

            {/* Pagination */}
            {computedTotalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-[#D4AF37] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: computedTotalPages }, (_, i) => i + 1)
                  .filter((p) => { if (computedTotalPages <= 7) return true; if (p === 1 || p === computedTotalPages) return true; if (Math.abs(p - page) <= 1) return true; return false; })
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
                  onClick={() => setPage((prev) => Math.min(computedTotalPages, prev + 1))}
                  disabled={page === computedTotalPages}
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
