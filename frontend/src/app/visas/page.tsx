'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import BookingModal from '@/components/BookingModal';

const CARD_WIDTH = 220;
const CARD_GAP = 16;
const STEP = CARD_WIDTH + CARD_GAP;
const AUTOPLAY_MS = 3000;

interface VisaService {
  _id: string;
  country: string;
  processingTime: string;
  visaFeeMMK: number;
  visaFeeUSD: number;
  requirements: string[];
  additionalInfo?: string;
}

const COUNTRY_FLAGS: Record<string, string> = {
  Thailand: '🇹🇭', Singapore: '🇸🇬', Malaysia: '🇲🇾', Vietnam: '🇻🇳',
  China: '🇨🇳', Japan: '🇯🇵', 'South Korea': '🇰🇷', India: '🇮🇳',
  'United Arab Emirates': '🇦🇪', Cambodia: '🇰🇭', Indonesia: '🇮🇩',
  Philippines: '🇵🇭', Taiwan: '🇹🇼', Australia: '🇦🇺', 'United Kingdom': '🇬🇧',
  'Hong Kong': '🇭🇰', Macau: '🇲🇴', 'Sri Lanka': '🇱🇰', Nepal: '🇳🇵',
  Maldives: '🇲🇻', Laos: '🇱🇦', Brunei: '🇧🇳', Myanmar: '🇲🇲',
};

const COUNTRY_IMAGES: Record<string, string> = {
  Thailand: 'https://picsum.photos/seed/a9visa-thailand/400/300',
  Singapore: 'https://picsum.photos/seed/a9visa-singapore/400/300',
  Vietnam: 'https://picsum.photos/seed/a9visa-vietnam/400/300',
  China: 'https://picsum.photos/seed/a9visa-china/400/300',
  Japan: 'https://picsum.photos/seed/a9visa-japan/400/300',
  India: 'https://picsum.photos/seed/a9visa-india/400/300',
  'South Korea': 'https://picsum.photos/seed/a9visa-southkorea/400/300',
  'United Arab Emirates': 'https://picsum.photos/seed/a9visa-uae/400/300',
  Cambodia: 'https://picsum.photos/seed/a9visa-cambodia/400/300',
  Malaysia: 'https://picsum.photos/seed/a9visa-malaysia/400/300',
  Indonesia: 'https://picsum.photos/seed/a9visa-indonesia/400/300',
  Philippines: 'https://picsum.photos/seed/a9visa-philippines/400/300',
  Taiwan: 'https://picsum.photos/seed/a9visa-taiwan/400/300',
  Australia: 'https://picsum.photos/seed/a9visa-australia/400/300',
  'United Kingdom': 'https://picsum.photos/seed/a9visa-uk/400/300',
  'Hong Kong': 'https://picsum.photos/seed/a9visa-hongkong/400/300',
  Macau: 'https://picsum.photos/seed/a9visa-macau/400/300',
  'Sri Lanka': 'https://picsum.photos/seed/a9visa-srilanka/400/300',
  Nepal: 'https://picsum.photos/seed/a9visa-nepal/400/300',
  Maldives: 'https://picsum.photos/seed/a9visa-maldives/400/300',
  Laos: 'https://picsum.photos/seed/a9visa-laos/400/300',
  Brunei: 'https://picsum.photos/seed/a9visa-brunei/400/300',
  Myanmar: 'https://picsum.photos/seed/a9visa-myanmar/400/300',
};

const FALLBACK_VISAS: VisaService[] = [
  { _id: 'v1', country: 'Thailand', processingTime: '3-5 Business Days', visaFeeMMK: 85000, visaFeeUSD: 40, requirements: ['Passport (6 months)', '2 Passport Photos', 'Flight Booking'] },
  { _id: 'v2', country: 'Singapore', processingTime: '5-7 Business Days', visaFeeMMK: 120000, visaFeeUSD: 57, requirements: ['Passport (6 months)', '2 Passport Photos', 'Application Form', 'Bank Statement'] },
  { _id: 'v3', country: 'Vietnam', processingTime: '3-5 Business Days', visaFeeMMK: 95000, visaFeeUSD: 45, requirements: ['Passport (6 months)', '2 Passport Photos', 'Flight Booking'] },
  { _id: 'v4', country: 'China', processingTime: '5-7 Business Days', visaFeeMMK: 150000, visaFeeUSD: 71, requirements: ['Passport (6 months)', '2 Passport Photos', 'Hotel Reservation'] },
  { _id: 'v5', country: 'Malaysia', processingTime: '3-5 Business Days', visaFeeMMK: 75000, visaFeeUSD: 36, requirements: ['Passport (6 months)', '2 Passport Photos', 'Flight Booking'] },
  { _id: 'v6', country: 'Japan', processingTime: '5-7 Business Days', visaFeeMMK: 130000, visaFeeUSD: 62, requirements: ['Passport (6 months)', 'Bank Statement', 'Employment Letter'] },
  { _id: 'v7', country: 'South Korea', processingTime: '5-7 Business Days', visaFeeMMK: 115000, visaFeeUSD: 55, requirements: ['Passport (6 months)', '2 Passport Photos', 'Bank Statement'] },
  { _id: 'v8', country: 'United Arab Emirates', processingTime: '3-5 Business Days', visaFeeMMK: 140000, visaFeeUSD: 67, requirements: ['Passport (6 months)', '2 Passport Photos', 'Bank Statement'] },
  { _id: 'v9', country: 'Cambodia', processingTime: '2-3 Business Days', visaFeeMMK: 65000, visaFeeUSD: 31, requirements: ['Passport (6 months)', '2 Passport Photos', 'Flight Booking'] },
  { _id: 'v10', country: 'Indonesia', processingTime: '3-5 Business Days', visaFeeMMK: 80000, visaFeeUSD: 38, requirements: ['Passport (6 months)', '2 Passport Photos', 'Bank Statement'] },
  { _id: 'v11', country: 'Taiwan', processingTime: '5-7 Business Days', visaFeeMMK: 105000, visaFeeUSD: 50, requirements: ['Passport (6 months)', '2 Passport Photos', 'Employment Certificate'] },
  { _id: 'v12', country: 'Philippines', processingTime: '5-7 Business Days', visaFeeMMK: 90000, visaFeeUSD: 43, requirements: ['Passport (6 months)', '2 Passport Photos', 'Bank Statement'] },
  { _id: 'v13', country: 'India', processingTime: '5-7 Business Days', visaFeeMMK: 110000, visaFeeUSD: 52, requirements: ['Passport (6 months)', '2 Passport Photos', 'Flight Booking'] },
  { _id: 'v14', country: 'Australia', processingTime: '10-15 Business Days', visaFeeMMK: 280000, visaFeeUSD: 133, requirements: ['Passport (6 months)', 'Bank Statement (6 months)'] },
  { _id: 'v15', country: 'United Kingdom', processingTime: '10-15 Business Days', visaFeeMMK: 320000, visaFeeUSD: 152, requirements: ['Passport (6 months)', 'Bank Statement (6 months)'] },
  { _id: 'v16', country: 'Hong Kong', processingTime: '3-5 Business Days', visaFeeMMK: 85000, visaFeeUSD: 40, requirements: ['Passport (6 months)', '2 Passport Photos', 'Hotel Reservation'] },
  { _id: 'v17', country: 'Macau', processingTime: '3-5 Business Days', visaFeeMMK: 80000, visaFeeUSD: 38, requirements: ['Passport (6 months)', '2 Passport Photos', 'Flight Booking'] },
  { _id: 'v18', country: 'Sri Lanka', processingTime: '3-5 Business Days', visaFeeMMK: 95000, visaFeeUSD: 45, requirements: ['Passport (6 months)', '2 Passport Photos', 'Bank Statement'] },
  { _id: 'v19', country: 'Nepal', processingTime: '3-5 Business Days', visaFeeMMK: 75000, visaFeeUSD: 36, requirements: ['Passport (6 months)', '2 Passport Photos', 'Flight Booking'] },
  { _id: 'v20', country: 'Maldives', processingTime: '2-3 Business Days', visaFeeMMK: 70000, visaFeeUSD: 33, requirements: ['Passport (6 months)', '2 Passport Photos', 'Hotel Reservation'] },
  { _id: 'v21', country: 'Laos', processingTime: '2-3 Business Days', visaFeeMMK: 60000, visaFeeUSD: 29, requirements: ['Passport (6 months)', '2 Passport Photos', 'Flight Booking'] },
  { _id: 'v22', country: 'Brunei', processingTime: '5-7 Business Days', visaFeeMMK: 100000, visaFeeUSD: 48, requirements: ['Passport (6 months)', '2 Passport Photos', 'Bank Statement'] },
  { _id: 'v23', country: 'Myanmar', processingTime: '3-5 Business Days', visaFeeMMK: 90000, visaFeeUSD: 43, requirements: ['Passport (6 months)', '2 Passport Photos', 'Hotel Reservation'] },
];

function VisaSliderCard({ visa, currency, onClick }: { visa: VisaService; currency: 'MMK' | 'USD'; onClick: () => void }) {
  const flag = COUNTRY_FLAGS[visa.country] || '🌏';
  const imageUrl = COUNTRY_IMAGES[visa.country];
  const fee = currency === 'MMK' ? visa.visaFeeMMK : visa.visaFeeUSD;
  const symbol = currency === 'MMK' ? 'Ks' : '$';

  return (
    <div onClick={onClick} className="w-[220px] h-[280px] rounded-2xl overflow-hidden flex-shrink-0 snap-start group cursor-pointer border border-gray-100 hover:border-gold/40 transition-all duration-300 bg-white shadow-sm flex flex-col">
      {imageUrl ? (
        <div className="relative h-32 overflow-hidden">
          <img src={imageUrl} alt={visa.country} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-2 left-3 flex items-center gap-2">
            <span className="text-2xl">{flag}</span>
            <h3 className="text-white font-semibold text-base drop-shadow-md" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{visa.country}</h3>
          </div>
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-br from-[#D4AF37]/20 to-[#F5A623]/20 flex items-center justify-center">
          <span className="text-5xl">{flag}</span>
        </div>
      )}
      <div className="p-3 flex flex-col flex-1 justify-between">
        {!imageUrl && (
          <h3 className="text-gray-900 font-semibold text-sm" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{visa.country}</h3>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
          <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{visa.processingTime}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[#D4AF37] font-bold text-lg">{symbol} {fee?.toLocaleString()}</p>
          <span className="text-gray-500 text-xs">Visa Fee</span>
        </div>
      </div>
    </div>
  );
}

function ScrollingRow({ visas, currency, onApply }: { visas: VisaService[]; currency: 'MMK' | 'USD'; onApply: (visa: VisaService) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current; if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);
  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current; if (!el) return;
    el.scrollTo({ left: direction === 'left' ? el.scrollLeft - STEP : el.scrollLeft + STEP, behavior: 'smooth' });
  }, []);
  const autoScroll = useCallback(() => {
    const el = scrollRef.current; if (!el) return;
    if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 4) { el.scrollTo({ left: 0, behavior: 'smooth' }); }
    else { scroll('right'); }
  }, [scroll]);

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(autoScroll, AUTOPLAY_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, autoScroll]);
  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    return () => el.removeEventListener('scroll', updateArrows);
  }, [updateArrows]);

  if (!visas || visas.length === 0) return null;
  return (
    <div className="relative group/row" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <button onClick={() => scroll('left')} aria-label="Scroll left" className={'absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#D4AF37]/90 shadow-lg flex items-center justify-center transition-all duration-300 ' + (canScrollLeft ? 'opacity-0 group-hover/row:opacity-100 hover:bg-[#D4AF37] hover:scale-110' : 'opacity-0 pointer-events-none')} style={{ marginLeft: -16 }}>
        <ChevronLeft className="w-5 h-5 text-gray-900" />
      </button>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {visas.map((visa) => (<VisaSliderCard key={visa._id} visa={visa} currency={currency} onClick={() => onApply(visa)} />))}
      </div>
      <button onClick={() => scroll('right')} aria-label="Scroll right" className={'absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#D4AF37]/90 shadow-lg flex items-center justify-center transition-all duration-300 ' + (canScrollRight ? 'opacity-0 group-hover/row:opacity-100 hover:bg-[#D4AF37] hover:scale-110' : 'opacity-0 pointer-events-none')} style={{ marginRight: -16 }}>
        <ChevronRight className="w-5 h-5 text-gray-900" />
      </button>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (<div key={i} className="w-[220px] h-[280px] rounded-2xl flex-shrink-0 bg-white shadow-sm animate-pulse border border-gray-100" />))}
    </div>
  );
}

export default function VisasPage() {
  // Fetch from admin database
  const [apiData, setApiData] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    fetch('/api/visas').then(r => r.json()).then(data => {
      const items = data?.data || data || [];
      if (items.length > 0) { setApiData(items); setDataLoaded(true); }
    }).catch(() => {});
  }, []);

  const router = useRouter();
  const [visas, setVisas] = useState<VisaService[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [useFallback, setUseFallback] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState<VisaService | null>(null);

  useEffect(() => {
    const fetchVisas = async () => {
      setLoading(true); setUseFallback(false);
      try {
        const response = await api.get<VisaService[]>('/visas');
        const data = response.data as unknown as VisaService[];
        if (Array.isArray(data) && data.length > 0) { setVisas(data); }
        else { setUseFallback(true); setVisas(FALLBACK_VISAS); }
      } catch (err) {
        console.error('Failed to fetch visas:', err);
        setUseFallback(true); setVisas(FALLBACK_VISAS);
      } finally { setLoading(false); }
    };
    fetchVisas();
  }, []);

  const handleApplyNow = (visa: VisaService) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('a9token') : null;
    if (!token) { router.push('/auth/login'); return; }
    setSelectedVisa(visa);
    setShowBookingModal(true);
  };

  const asiaVisas = visas.filter(v => ['Thailand','Singapore','Vietnam','Malaysia','Cambodia','Indonesia','Philippines','Laos','Myanmar'].includes(v.country)).slice(0, 10);
  const worldVisas = visas.filter(v => ['China','Japan','South Korea','India','United Arab Emirates','Taiwan','Australia','United Kingdom','Hong Kong','Macau','Sri Lanka','Nepal','Maldives','Brunei'].includes(v.country)).slice(0, 10);

  return (
    <main className="min-h-screen bg-white">
      <section className="relative pt-24 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/hero-visas.jpg)" }} />
        <div className="absolute inset-0 bg-gray-950/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12),transparent_70%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-[#D4AF37] via-[#F5A623] to-[#D4AF37] bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Visa Services</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Hassle-free visa processing for your international travel. We handle the paperwork so you can focus on your journey.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pt-8 flex justify-end">
        <div className="flex rounded-xl bg-white shadow-sm border border-gray-200 p-1">
          <button onClick={() => setCurrency('MMK')} className={'px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ' + (currency === 'MMK' ? 'bg-[#D4AF37] text-gray-900 shadow-md' : 'text-gray-900/60 hover:text-gray-900')}>MMK</button>
          <button onClick={() => setCurrency('USD')} className={'px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ' + (currency === 'USD' ? 'bg-[#D4AF37] text-gray-900 shadow-md' : 'text-gray-900/60 hover:text-gray-900')}>USD</button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10 pb-20">
        {loading ? (
          <div className="space-y-12"><SkeletonRow /><SkeletonRow /></div>
        ) : visas.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <h3 className="text-xl text-gray-900 font-semibold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Visa services coming soon</h3>
            <p className="text-gray-400">We are updating our visa service listings. Check back shortly.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {useFallback && <p className="text-amber-400/70 text-sm text-center">Showing sample visas — using offline data</p>}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                <h2 className="text-lg font-bold text-gold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>ASEAN & Nearby</h2>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
              </div>
              <ScrollingRow visas={asiaVisas.length > 0 ? asiaVisas : FALLBACK_VISAS.filter(v => ['Thailand','Singapore','Vietnam','Malaysia','Cambodia','Indonesia','Philippines'].includes(v.country)).slice(0, 10)} currency={currency} onApply={handleApplyNow} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                <h2 className="text-lg font-bold text-gold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Asia Pacific & Middle East</h2>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
              </div>
              <ScrollingRow visas={worldVisas.length > 0 ? worldVisas : FALLBACK_VISAS.filter(v => ['China','Japan','South Korea','India','United Arab Emirates','Taiwan','Australia','United Kingdom'].includes(v.country)).slice(0, 10)} currency={currency} onApply={handleApplyNow} />
            </div>
            <p className="text-gray-500 text-xs text-center">Hover over arrows to scroll • Auto-scroll pauses on hover</p>
          </div>
        )}
      </section>

      {selectedVisa && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          itemType="visa"
          itemId={selectedVisa._id}
          itemName={selectedVisa.country + ' Visa'}
          itemSubtitle={selectedVisa.processingTime}
          unitPrice={selectedVisa.visaFeeMMK || 0}
          currency="MMK"
          unitLabel="applicant"
          maxQuantity={5}
        />
      )}
      <style jsx>{'.scrollbar-hide::-webkit-scrollbar { display: none; }'}</style>
    </main>
  );
}
