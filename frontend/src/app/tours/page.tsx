'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, Tour } from '@/lib/api';
import TourCard from '@/components/TourCard';
import ScrollingRow from '@/components/ScrollingRow';
import CurrencyToggle from '@/components/CurrencyToggle';
import SearchBar from '@/components/SearchBar';

type CategoryKey = 'all' | 'myanmar' | 'international' | 'adventure';

// ─── Data ────────────────────────────────────────────────────

const MYANMAR_TOURS = [
  { slug: 'golden-land-explorer', title: 'Golden Land Explorer', destination: 'Yangon-Bagan-Mandalay-Inle', priceMMK: 1850000, priceUSD: 881, duration: '8D/7N', rating: 4.8, image: 'https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'], featured: true },
  { slug: 'bagan-sunrise-discovery', title: 'Bagan Sunrise Discovery', destination: 'Bagan', priceMMK: 950000, priceUSD: 452, duration: '5D/4N', rating: 4.9, image: 'https://images.unsplash.com/photo-1558704475-1428913b4c6b?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'E-Bike', 'Boat Cruise'], featured: true },
  { slug: 'mandalay-royal-heritage', title: 'Mandalay Royal Heritage', destination: 'Mandalay', priceMMK: 750000, priceUSD: 357, duration: '4D/3N', rating: 4.6, image: 'https://images.unsplash.com/photo-1590474251443-ea19bb0f4e89?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'Boat Trip', 'Guide'] },
  { slug: 'inle-lake-serenity', title: 'Inle Lake Serenity', destination: 'Inle Lake', priceMMK: 1100000, priceUSD: 524, duration: '5D/4N', rating: 4.7, image: 'https://images.unsplash.com/photo-1583431815168-55a35bfefbd3?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'Boat Tour', 'Canoe'], featured: true },
  { slug: 'ngapali-beach-escape', title: 'Ngapali Beach Escape', destination: 'Ngapali Beach', priceMMK: 1350000, priceUSD: 643, duration: '4D/3N', rating: 4.5, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop', amenities: ['Resort', 'Breakfast', 'Snorkeling', 'Beach'] },
  { slug: 'yangon-cultural-tour', title: 'Yangon Cultural Tour', destination: 'Yangon', priceMMK: 450000, priceUSD: 214, duration: '3D/2N', rating: 4.4, image: 'https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'Train Ride', 'Tea Shop'] },
  { slug: 'myeik-archipelago-adventure', title: 'Myeik Archipelago Adventure', destination: 'Myeik', priceMMK: 2200000, priceUSD: 1048, duration: '6D/5N', rating: 4.9, image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop', amenities: ['Boat Cabin', 'All Meals', 'Snorkeling', 'Kayak'], featured: true },
  { slug: 'yangon-mandalay-express', title: 'Yangon-Mandalay Express', destination: 'Yangon-Mandalay', priceMMK: 550000, priceUSD: 262, duration: '3D/2N', rating: 4.3, image: 'https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'Flight', 'Guide'] },
  { slug: 'shan-highland-trek', title: 'Shan Highland Trek', destination: 'Kalaw-Inle', priceMMK: 850000, priceUSD: 405, duration: '5D/4N', rating: 4.8, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', amenities: ['Homestay', 'All Meals', 'Guide', 'Porter'], featured: true },
  { slug: 'mrauk-u-ancient-kingdoms', title: 'Mrauk U Ancient Kingdoms', destination: 'Mrauk U', priceMMK: 950000, priceUSD: 452, duration: '4D/3N', rating: 4.7, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'Boat', 'Guide'] },
  { slug: 'hpa-an-cave-explorer', title: 'Hpa-An Cave Explorer', destination: 'Hpa-An', priceMMK: 420000, priceUSD: 200, duration: '3D/2N', rating: 4.5, image: 'https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'Boat', 'Guide'] },
  { slug: 'pyin-oo-lwin-flower-festival', title: 'Pyin Oo Lwin Flower Festival', destination: 'Pyin Oo Lwin', priceMMK: 550000, priceUSD: 262, duration: '4D/3N', rating: 4.4, image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4c2ab?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'Gardens', 'Coffee Tour'] },
];

const INTERNATIONAL_TOURS = [
  { slug: 'bangkok-pattaya-luxury', title: 'Bangkok-Pattaya Luxury', destination: 'Thailand', priceMMK: 1650000, priceUSD: 786, duration: '5D/4N', rating: 4.5, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'Island Tour', 'Guide'] },
  { slug: 'singapore-city-lights', title: 'Singapore City Lights', destination: 'Singapore', priceMMK: 2100000, priceUSD: 1000, duration: '4D/3N', rating: 4.7, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'Gardens', 'Sentosa'] },
  { slug: 'angkor-wat-discovery', title: 'Angkor Wat Discovery', destination: 'Cambodia', priceMMK: 1450000, priceUSD: 690, duration: '4D/3N', rating: 4.5, image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'Tuk-Tuk', 'Boat'] },
  { slug: 'vietnam-heritage-trail', title: 'Vietnam Heritage Trail', destination: 'Vietnam', priceMMK: 2400000, priceUSD: 1143, duration: '7D/6N', rating: 4.8, image: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'Cruise', 'Guide'], featured: true },
  { slug: 'bali-paradise-escape', title: 'Bali Paradise Escape', destination: 'Indonesia', priceMMK: 1950000, priceUSD: 929, duration: '5D/4N', rating: 4.7, image: 'https://images.unsplash.com/photo-1537996194471-e657f9e13f57?w=600&h=400&fit=crop', amenities: ['Resort', 'Breakfast', 'Temples', 'Spa'], featured: true },
  { slug: 'japan-cherry-blossom-tour', title: 'Japan Cherry Blossom Tour', destination: 'Japan', priceMMK: 3850000, priceUSD: 1833, duration: '7D/6N', rating: 4.9, image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'JR Pass', 'Tea Ceremony'], featured: true },
  { slug: 'golden-triangle-explorer', title: 'Golden Triangle Explorer', destination: 'Myanmar-Thailand-Laos', priceMMK: 3500000, priceUSD: 1667, duration: '10D/9N', rating: 4.6, image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'Cruise', 'Guide'] },
  { slug: 'maldives-honeymoon-special', title: 'Maldives Honeymoon Special', destination: 'Maldives', priceMMK: 3200000, priceUSD: 1524, duration: '4D/3N', rating: 4.9, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop', amenities: ['Overwater Villa', 'Full Board', 'Spa', 'Cruise'], featured: true },
  { slug: 'south-korea-discovery', title: 'South Korea Discovery', destination: 'South Korea', priceMMK: 2950000, priceUSD: 1405, duration: '6D/5N', rating: 4.6, image: 'https://images.unsplash.com/photo-1534274988757-a0bf53023472?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'KORAIL', 'Jeju'] },
  { slug: 'dubai-luxury-experience', title: 'Dubai Luxury Experience', destination: 'UAE', priceMMK: 2750000, priceUSD: 1310, duration: '5D/4N', rating: 4.7, image: 'https://images.unsplash.com/photo-1512453979796-25f96bf5c20fe?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'Burj Khalifa', 'Desert Safari'] },
];

const ADVENTURE_TOURS = [
  { slug: 'myeik-archipelago-adventure', title: 'Myeik Archipelago Adventure', destination: 'Myeik', priceMMK: 2200000, priceUSD: 1048, duration: '6D/5N', rating: 4.9, image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop', amenities: ['Boat Cabin', 'All Meals', 'Snorkeling', 'Kayak'] },
  { slug: 'shan-highland-trek', title: 'Shan Highland Trek', destination: 'Kalaw-Inle', priceMMK: 850000, priceUSD: 405, duration: '5D/4N', rating: 4.8, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', amenities: ['Homestay', 'All Meals', 'Guide', 'Porter'] },
  { slug: 'golden-triangle-explorer', title: 'Golden Triangle Explorer', destination: 'Myanmar-Thailand-Laos', priceMMK: 3500000, priceUSD: 1667, duration: '10D/9N', rating: 4.6, image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'Cruise', 'Guide'] },
  { slug: 'bagan-sunrise-discovery', title: 'Bagan Sunrise Discovery', destination: 'Bagan', priceMMK: 950000, priceUSD: 452, duration: '5D/4N', rating: 4.9, image: 'https://images.unsplash.com/photo-1558704475-1428913b4c6b?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'E-Bike', 'Boat Cruise'] },
  { slug: 'vietnam-heritage-trail', title: 'Vietnam Heritage Trail', destination: 'Vietnam', priceMMK: 2400000, priceUSD: 1143, duration: '7D/6N', rating: 4.8, image: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'Cruise', 'Guide'] },
  { slug: 'hpa-an-cave-explorer', title: 'Hpa-An Cave Explorer', destination: 'Hpa-An', priceMMK: 420000, priceUSD: 200, duration: '3D/2N', rating: 4.5, image: 'https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=600&h=400&fit=crop', amenities: ['Hotel', 'Breakfast', 'Boat', 'Guide'] },
];

const ALL_TOURS_DATA = [...MYANMAR_TOURS, ...INTERNATIONAL_TOURS];

function getCategoryTours(cat: CategoryKey) {
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

function TourScrollingCard({ item, currency }: { item: typeof ALL_TOURS_DATA[0]; currency: 'MMK' | 'USD' }) {
  const displayPrice = currency === 'MMK' ? item.priceMMK : item.priceUSD;
  const symbol = currency === 'MMK' ? 'Ks' : '$';

  return (
    <Link
      href={`/tours/${item.slug}`}
      className="w-[300px] flex-shrink-0 snap-start block"
    >
      <div className="group relative rounded-2xl overflow-hidden cursor-pointer border border-gray-200 hover:border-[#D4AF37]/60 hover:shadow-xl hover:shadow-[#D4AF37]/10 hover:scale-[1.02] transition-all duration-300">
        <div className="relative h-[300px] w-full overflow-hidden bg-gray-200">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            style={{ position: 'absolute', inset: 0 }}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#D4AF37]/90 text-gray-900 text-xs font-semibold backdrop-blur-sm">
            {item.destination}
          </span>
          <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-sm border border-white/10">
            {item.duration}
          </span>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3
              className="text-white text-xl font-bold mb-2 line-clamp-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {item.title}
            </h3>
            <div className="flex items-center justify-between">
              {/* Rating stars */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(item.rating) ? 'text-[#D4AF37]' : 'text-gray-500'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-right">
                <span className="text-[#D4AF37] text-lg font-bold">
                  {symbol} {displayPrice.toLocaleString()}
                </span>
                <span className="text-gray-400 text-xs ml-1">/person</span>
              </div>
            </div>
          </div>
        </div>
        {/* Amenities chips */}
        <div className="px-4 pt-3 flex flex-wrap gap-1.5">
          {item.amenities.slice(0, 3).map((a, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs border border-[#D4AF37]/20"
            >
              {a}
            </span>
          ))}
        </div>
        {/* View Details button */}
        <div className="px-4 pb-3 pt-2">
          <span className="block w-full text-center py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5A623] hover:from-[#E5C048] hover:to-[#D4AF37] text-[#0A1628] font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/30">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Page Component ──────────────────────────────────────────

export default function ToursPage() {
  const router = useRouter();
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
          {categoryTours.slice(0, 10).map((item, i) => (
            <TourScrollingCard key={`cat-${activeTab}-${i}`} item={item} currency={currency} />
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
              {displayTours.map((item, idx) => (
                <div key={idx} className="group relative rounded-2xl overflow-hidden cursor-pointer border border-gray-200 hover:border-[#D4AF37]/60 hover:shadow-xl hover:shadow-[#D4AF37]/10 hover:scale-[1.02] transition-all duration-300">
                  <Link href={`/tours/${item.slug}`}>
                    <div className="relative h-[260px] w-full overflow-hidden bg-gray-200">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        style={{ position: 'absolute', inset: 0 }}
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#D4AF37]/90 text-gray-900 text-xs font-semibold backdrop-blur-sm">
                        {item.destination}
                      </span>
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-sm border border-white/10">
                        {item.duration}
                      </span>
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-white text-xl font-bold mb-2 line-clamp-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                          {item.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }, (_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < Math.round(item.rating) ? 'text-[#D4AF37]' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <div className="text-right">
                            <span className="text-[#D4AF37] text-lg font-bold">
                              {currency === 'MMK' ? `Ks ${item.priceMMK.toLocaleString()}` : `$ ${item.priceUSD.toLocaleString()}`}
                            </span>
                            <span className="text-gray-400 text-xs ml-1">/person</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pt-3 flex flex-wrap gap-1.5">
                      {item.amenities.map((a, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs border border-[#D4AF37]/20">{a}</span>
                      ))}
                    </div>
                  </Link>
                  <div className="px-4 pb-4 pt-2">
                    <Link
                      href={`/tours/${item.slug}`}
                      className="block w-full text-center py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5A623] hover:from-[#E5C048] hover:to-[#D4AF37] text-[#0A1628] font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/30"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

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
