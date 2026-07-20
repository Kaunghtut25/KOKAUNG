'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DealsBanner from '@/components/DealsBanner';
import FAQAccordion from '@/components/FAQAccordion';
import TestimonialSlider from '@/components/TestimonialSlider';
import RoutesMap from '@/components/RoutesMap';
interface Cruise {
  _id?: string;
  id?: string;
  slug?: string;
  name?: string;
  id: string; title: string; destination: string; description: string;
  priceMMK: number; priceUSD: number; duration: string;
  images: string[]; amenities: string; included: string; excluded: string;
}

const FALLBACK_CRUISES: Cruise[] = [
  {
    id: 'cr1', title: 'Halong Bay Cruise', destination: 'Vietnam',
    description: 'Luxury overnight cruise through Halong Bay — explore caves, kayaking, and stunning limestone karsts.',
    priceMMK: 650000, priceUSD: 310, duration: '3 Days / 2 Nights',
    images: ['/images_v2/hero-cruises-v2.jpg'],
    amenities: 'AC Cabin, Restaurant, Sun Deck, Kayaking',
    included: 'Cabin, Meals, Tours, Kayaking',
    excluded: 'Flights, Visa Fees',
  },
  {
    id: 'cr2', title: 'Singapore Cruise', destination: 'Singapore',
    description: 'Luxury cruise around Singapore — experience world-class dining, entertainment, and stunning skyline views.',
    priceMMK: 800000, priceUSD: 380, duration: '4 Days / 3 Nights',
    images: ['/images_v2/hero-singapore-v2.jpg'],
    amenities: 'Balcony Cabin, Pool, Casino, Theatre',
    included: 'Cabin, All Meals, Entertainment',
    excluded: 'Flights, Shore Excursions',
  },
  {
    id: 'cr3', title: 'Mediterranean Dream', destination: 'Italy/Greece',
    description: 'Sail the Mediterranean — visit Rome, Athens, Santorini and more on a luxurious 7-day voyage.',
    priceMMK: 2500000, priceUSD: 1190, duration: '7 Days / 6 Nights',
    images: ['/images_v2/dest-paris-v2.jpg'],
    amenities: 'Suite, Fine Dining, Spa, Pool Deck',
    included: 'Suite, All Meals, Port Excursions',
    excluded: 'Flights, Travel Insurance',
  },
  {
    id: 'cr4', title: 'Caribbean Paradise', destination: 'Caribbean',
    description: 'Tropical island hopping — crystal waters, white sands, and endless sunshine across the Caribbean.',
    priceMMK: 3200000, priceUSD: 1525, duration: '10 Days / 9 Nights',
    images: ['/images_v2/hero-thailand-v2.jpg'],
    amenities: 'Ocean View Cabin, Water Sports, Live Shows',
    included: 'Cabin, Meals, Activities, Port Fees',
    excluded: 'Flights, Premium Drinks',
  },
  {
    id: 'cr5', title: 'Mekong River Cruise', destination: 'Myanmar/Thailand',
    description: 'Journey along the mighty Mekong River — discover ancient temples, floating markets, and riverside villages.',
    priceMMK: 450000, priceUSD: 215, duration: '5 Days / 4 Nights',
    images: ['/images_v2/tour-bagan-v2.jpg'],
    amenities: 'River View Cabin, Observation Deck, Library',
    included: 'Cabin, Meals, Daily Excursions, Guide',
    excluded: 'Flights, Visa, Tips',
  },
  {
    id: 'cr6', title: 'Dubai Marina Cruise', destination: 'UAE',
    description: 'Evening dinner cruise along Dubai Marina — stunning skyline views, gourmet dining, and live entertainment.',
    priceMMK: 180000, priceUSD: 85, duration: 'Evening',
    images: ['/images_v2/dest-dubai-v2.jpg'],
    amenities: 'Dinner Buffet, Live Music, Open Deck',
    included: 'Dinner, Drinks, Entertainment',
    excluded: 'Hotel Transfers',
  },
  {
    id: 'cr7', title: 'Alaska Glacier Cruise', destination: 'Alaska, USA',
    description: 'Witness towering glaciers, humpback whales, and pristine wilderness on an unforgettable Alaskan adventure.',
    priceMMK: 4200000, priceUSD: 2000, duration: '7 Days / 6 Nights',
    images: ['/images_v2/dest-japan-v2.jpg'],
    amenities: 'Balcony Cabin, Wildlife Guide, Hot Tub, Observatory',
    included: 'Cabin, All Meals, Shore Excursions, Naturalist Talks',
    excluded: 'Flights, Premium Alcohol, Tips',
  },
  {
    id: 'cr8', title: 'Norwegian Fjords Cruise', destination: 'Norway',
    description: 'Sail through dramatic fjords, cascading waterfalls, and charming Scandinavian villages under the midnight sun.',
    priceMMK: 3800000, priceUSD: 1810, duration: '7 Days / 6 Nights',
    images: ['/images_v2/dest-korea-v2.jpg'],
    amenities: 'Ocean View Cabin, Nordic Spa, Fine Dining, Library',
    included: 'Cabin, Meals, Fjord Excursions, Guides',
    excluded: 'Flights, Travel Insurance, Tips',
  },
  {
    id: 'cr9', title: 'Greek Isles Cruise', destination: 'Greece',
    description: 'Island-hop through Santorini, Mykonos, and Crete — whitewashed villages, turquoise waters, and ancient history.',
    priceMMK: 2800000, priceUSD: 1333, duration: '8 Days / 7 Nights',
    images: ['/images_v2/dest-paris-v2.jpg'],
    amenities: 'Suite, Pool Deck, Greek Cuisine, Evening Shows',
    included: 'Cabin, All Meals, Island Tours, Port Fees',
    excluded: 'Flights, Optional Excursions, Tips',
  },
  {
    id: 'cr10', title: 'Antarctic Expedition', destination: 'Antarctica',
    description: 'The ultimate adventure — penguins, icebergs, and the last untouched wilderness on Earth. Expedition-grade cruise.',
    priceMMK: 8500000, priceUSD: 4050, duration: '12 Days / 11 Nights',
    images: ['/images_v2/hero-cruises-v2.jpg'],
    amenities: 'Expedition Suite, Zodiac Boats, Science Lab, Lecture Hall',
    included: 'Cabin, All Meals, Daily Excursions, Expedition Gear',
    excluded: 'Flights to Ushuaia, Travel Insurance, Tips',
  },
];

export default function CruisesClient({ initialCruises }: { initialCruises: Cruise[] }) {
  const [layout, setLayout] = useState({ desktop: 3, tablet: 2, mobile: 1 });
  useEffect(() => {
    fetch("/api/admin/site-config")
      .then(r => r.json())
      .then(d => {
        if (d?.sectionLayouts?.cruises) setLayout(d.sectionLayouts.cruises);
      })
      .catch(() => {});
  }, []);
  const [heroImage, setHeroImage] = useState("/images_v2/hero-cruises-v2.jpg");
  const router = useRouter();
  const cruises = initialCruises.length > 0 ? initialCruises : FALLBACK_CRUISES;
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  useEffect(() => { fetch("/api/admin/site-config").then(r => r.json()).then(d => { if (d?.heroImages?.cruises) setHeroImage(d.heroImages.cruises); }).catch(() => {}); }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <img
          src={heroImage}
          alt="Luxury Cruises" onError={(e) => { (e.target as HTMLImageElement).src = "/images_v2/hero-cruises-v2.jpg"; }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/90 via-[#0A1628]/40 to-[#0A1628]/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            🚢 Cruises
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">Luxury cruise packages to world-class destinations</p>
        </div>
      </section>

      {/* Currency Toggle */}
      <div className="max-w-6xl mx-auto px-4 pt-8 flex justify-end">
        <div className="flex rounded-lg overflow-hidden border border-gray-200">
          <button
            onClick={() => setCurrency('MMK')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${currency === 'MMK' ? 'bg-[#D4AF37] text-white' : 'bg-white text-gray-600'}`}
          >Ks (MMK)</button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${currency === 'USD' ? 'bg-[#D4AF37] text-white' : 'bg-white text-gray-600'}`}
          >$ (USD)</button>
        </div>
      </div>

      {/* Cruise Cards */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className={`grid grid-cols-${layout.mobile} md:grid-cols-${layout.tablet} lg:grid-cols-${layout.desktop} gap-6`}>
          {cruises.map((cruise) => {
            const displayPrice = currency === 'USD'
              ? '$' + cruise.priceUSD.toLocaleString()
              : 'Ks ' + cruise.priceMMK.toLocaleString();
            return (
              <div key={cruise.id} onClick={() => router.push("/cruises/" + (cruise.id || cruise._id || cruise.slug))} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#D4AF37]/40 transition-all group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={cruise.images?.[0] || '/images_v2/hero-cruises-v2.jpg'}
                    alt={cruise.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images_v2/hero-cruises-v2.jpg'; }}
                  />
                  <div className="absolute top-3 right-3 bg-[#D4AF37] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {cruise.duration}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#0A1628] group-hover:text-[#D4AF37] transition-colors mb-1">{cruise.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{cruise.destination}</p>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{cruise.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {cruise.amenities?.split(',').slice(0, 3).map((a, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{a.trim()}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[#D4AF37] font-bold text-xl">{displayPrice}</span>
                      <span className="text-gray-400 text-xs ml-1">/ person</span>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={'/cruises/' + (cruise.id || cruise._id || cruise.slug)}
                      className="flex-1 px-3 py-2 border border-[#D4AF37] text-[#D4AF37] text-sm font-semibold rounded-full text-center hover:bg-[#D4AF37] hover:text-white transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => router.push('/book-now?type=cruise&name=' + encodeURIComponent(cruise.title||cruise.name||'') + '&destination=' + encodeURIComponent(cruise.destination) + '&id=' + (cruise.id || cruise._id || ''))}
                      className="flex-1 px-3 py-2 bg-[#D4AF37] text-white text-sm font-semibold rounded-full hover:bg-[#C19B2F] transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                  <button
                    onClick={() => router.push('/contact?subject=' + encodeURIComponent('Cruise Inquiry') + '&item=' + encodeURIComponent(cruise.title || cruise.name || ''))}
                    className="w-full mt-2 py-2 text-sm text-gray-600 hover:text-[#D4AF37] transition-colors"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <DealsBanner />
      <FAQAccordion section="cruises" />
      <TestimonialSlider />
      <RoutesMap />
</main>
  );
}
