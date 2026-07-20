'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import BookingModal from '@/components/BookingModal';
import DealsBanner from '@/components/DealsBanner';
import FAQAccordion from '@/components/FAQAccordion';
import TestimonialSlider from '@/components/TestimonialSlider';
interface VisaService {
  slug?: string;
  _id: string;
  id?: string;
  country: string;
  countryCode?: string;
  processingTime: string;
  visaFeeMMK: number;
  visaFeeUSD: number;
  requirements: string[];
  additionalInfo?: string;
  image?: string;
}

const COUNTRY_FLAGS: Record<string, string> = {
  Thailand: '🇹🇭', Singapore: '🇸🇬', Malaysia: '🇲🇾', Vietnam: '🇻🇳',
  China: '🇨🇳', Japan: '🇯🇵', 'South Korea': '🇰🇷', India: '🇮🇳',
  'United Arab Emirates': '🇦🇪', Cambodia: '🇰🇭', Indonesia: '🇮🇩',
  Taiwan: '🇹🇼', Philippines: '🇵🇭', Australia: '🇦🇺',
  'United Kingdom': '🇬🇧', 'Hong Kong': '🇭🇰', Macau: '🇲🇴',
  'Sri Lanka': '🇱🇰', Nepal: '🇳🇵', Maldives: '🇲🇻', Laos: '🇱🇦',
  Brunei: '🇧🇳', Myanmar: '🇲🇲',
};

const COUNTRY_IMAGES: Record<string, string> = {
  Thailand: '/images_v2/visa1-v3.jpg',  Singapore: '/images_v2/visa2-v3.jpg',
  Malaysia: '/images_v2/visa3-v3.jpg',  China: '/images_v2/visa4-v3.jpg',
  India: '/images_v2/visa5-v3.jpg',     'United Arab Emirates': '/images_v2/visa6-v3.jpg',
  Vietnam: '/images_v2/visa4-v3.jpg',   Cambodia: '/images_v2/visa3-v3.jpg',
  Japan: '/images_v2/visa1-v3.jpg',     'South Korea': '/images_v2/visa2-v3.jpg',
  Indonesia: '/images_v2/visa3-v3.jpg', Taiwan: '/images_v2/visa2-v3.jpg',
  Philippines: '/images_v2/visa6-v3.jpg', Australia: '/images_v2/visa1-v3.jpg',
  'United Kingdom': '/images_v2/visa2-v3.jpg', 'Hong Kong': '/images_v2/visa1-v3.jpg',
  Macau: '/images_v2/visa1-v3.jpg',     'Sri Lanka': '/images_v2/visa3-v3.jpg',
  Nepal: '/images_v2/visa4-v3.jpg',     Maldives: '/images_v2/visa6-v3.jpg',
  Laos: '/images_v2/visa3-v3.jpg',      Brunei: '/images_v2/visa1-v3.jpg',
  Myanmar: '/images_v2/visa2-v3.jpg',
};

const FALLBACK_VISAS: VisaService[] = [
  { _id: 'v1',  country: 'Thailand',
    slug: 'thailand', processingTime: '3-5 Days', visaFeeMMK: 85000, visaFeeUSD: 40, requirements: ['Passport 6m','2 Photos'] },
  { _id: 'v2',  country: 'Singapore',
    slug: 'singapore', processingTime: '5-7 Days', visaFeeMMK: 120000, visaFeeUSD: 57, requirements: ['Passport 6m','Bank Statement'] },
  { _id: 'v3',  country: 'Vietnam',
    slug: 'vietnam', processingTime: '3-5 Days', visaFeeMMK: 95000, visaFeeUSD: 45, requirements: ['Passport 6m','Flight Booking'] },
  { _id: 'v4',  country: 'China',
    slug: 'china', processingTime: '5-7 Days', visaFeeMMK: 150000, visaFeeUSD: 71, requirements: ['Passport 6m','Hotel Reservation'] },
  { _id: 'v5',  country: 'Malaysia',
    slug: 'malaysia', processingTime: '3-5 Days', visaFeeMMK: 75000, visaFeeUSD: 36, requirements: ['Passport 6m','Photos'] },
  { _id: 'v6',  country: 'Japan',
    slug: 'japan', processingTime: '5-7 Days', visaFeeMMK: 130000, visaFeeUSD: 62, requirements: ['Passport 6m','Employment Letter'] },
  { _id: 'v7',  country: 'South Korea',
    slug: 'south-korea', processingTime: '5-7 Days', visaFeeMMK: 115000, visaFeeUSD: 55, requirements: ['Passport 6m','Bank Statement'] },
  { _id: 'v8',  country: 'UAE', processingTime: '3-5 Days', visaFeeMMK: 140000, visaFeeUSD: 67, requirements: ['Passport 6m','Bank Statement'] },
  { _id: 'v9',  country: 'Cambodia',
    slug: 'cambodia', processingTime: '2-3 Days', visaFeeMMK: 65000, visaFeeUSD: 31, requirements: ['Passport 6m','Flight'] },
  { _id: 'v10', country: 'Indonesia',
    slug: 'indonesia', processingTime: '3-5 Days', visaFeeMMK: 80000, visaFeeUSD: 38, requirements: ['Passport 6m','Bank Statement'] },
  { _id: 'v11', country: 'Taiwan', processingTime: '5-7 Days', visaFeeMMK: 105000, visaFeeUSD: 50, requirements: ['Passport 6m','Employment'] },
  { _id: 'v12', country: 'Philippines',
    slug: 'philippines', processingTime: '5-7 Days', visaFeeMMK: 90000, visaFeeUSD: 43, requirements: ['Passport 6m','Photos'] },
  { _id: 'v13', country: 'India',
    slug: 'india', processingTime: '5-7 Days', visaFeeMMK: 110000, visaFeeUSD: 52, requirements: ['Passport 6m','eVisa'] },
  { _id: 'v14', country: 'Australia', processingTime: '10-15 Days', visaFeeMMK: 280000, visaFeeUSD: 133, requirements: ['Passport 6m','Bank 6m'] },
  { _id: 'v15', country: 'UK', processingTime: '10-15 Days', visaFeeMMK: 320000, visaFeeUSD: 152, requirements: ['Passport 6m','Bank 6m'] },
  { _id: 'v16', country: 'Hong Kong', processingTime: '3-5 Days', visaFeeMMK: 85000, visaFeeUSD: 40, requirements: ['Passport 6m','Hotel'] },
  { _id: 'v17', country: 'Macau', processingTime: '3-5 Days', visaFeeMMK: 80000, visaFeeUSD: 38, requirements: ['Passport 6m','Flight'] },
  { _id: 'v18', country: 'Sri Lanka', processingTime: '3-5 Days', visaFeeMMK: 95000, visaFeeUSD: 45, requirements: ['Passport 6m','Bank'] },
  { _id: 'v19', country: 'Nepal', processingTime: '3-5 Days', visaFeeMMK: 75000, visaFeeUSD: 36, requirements: ['Passport 6m','Flight'] },
  { _id: 'v20', country: 'Maldives', processingTime: '2-3 Days', visaFeeMMK: 70000, visaFeeUSD: 33, requirements: ['Passport 6m','Hotel'] },
  { _id: 'v21', country: 'Laos', processingTime: '2-3 Days', visaFeeMMK: 60000, visaFeeUSD: 29, requirements: ['Passport 6m','Flight'] },
  { _id: 'v22', country: 'Brunei', processingTime: '5-7 Days', visaFeeMMK: 100000, visaFeeUSD: 48, requirements: ['Passport 6m','Bank'] },
  { _id: 'v23', country: 'Myanmar',
    slug: 'myanmar', processingTime: '3-5 Days', visaFeeMMK: 90000, visaFeeUSD: 43, requirements: ['Passport 6m','Hotel'] },
];



function VisaGridCard({ visa }: { visa: VisaService }) {
  const router = useRouter();
  const flag = COUNTRY_FLAGS[visa.country] || '🌏';
  const imageUrl = visa.image || COUNTRY_IMAGES[visa.country];

  return (
    <div
      onClick={() => router.push("/visas/" + (visa.slug||visa._id||visa.id))}
      className="h-[430px] rounded-2xl overflow-hidden group cursor-pointer border border-gray-100 hover:border-gold/40 transition-all duration-300 bg-white shadow-sm flex flex-col"
    >
      {imageUrl ? (
        <div className="relative h-44 overflow-hidden">
          <img src={imageUrl} alt={visa.country} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-1.5 left-2 flex items-center gap-1.5">
            <span className="text-xl">{flag}</span>
            <h3 className="text-white font-semibold text-sm drop-shadow-md" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{visa.country}</h3>
          </div>
        </div>
      ) : (
        <div className="h-52 bg-gradient-to-br from-[#D4AF37]/20 to-[#F5A623]/20 flex items-center justify-center">
          <span className="text-4xl">{flag}</span>
        </div>
      )}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <p className="text-xs text-gray-500">{visa.processingTime}</p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {visa.requirements.slice(0, 3).map((r, i) => (
            <span key={i} className="text-[11px] bg-[#D4AF37]/10 text-[#B8960F] px-2 py-1 rounded-full">{r}</span>
          ))}
        </div>
        {(visa.visaFeeMMK > 0 || visa.visaFeeUSD > 0) && (
          <div className="pt-2 flex gap-3 text-xs">
            {visa.visaFeeMMK > 0 && <span className="text-gold font-bold">Ks {visa.visaFeeMMK.toLocaleString()}</span>}
            {visa.visaFeeUSD > 0 && <span className="text-gold font-bold">${visa.visaFeeUSD}</span>}
          </div>
        )}
        <div className="mt-auto pt-3 flex flex-col gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); router.push('/book-now?type=visa&country=' + encodeURIComponent(visa.country||'') + '&id=' + encodeURIComponent(visa._id||visa.id||'') + '&feeMMK=' + (visa.visaFeeMMK||0) + '&feeUSD=' + (visa.visaFeeUSD||0) + '&processingTime=' + encodeURIComponent(visa.processingTime||'')); }}
            className="w-full py-2.5 rounded-xl text-center font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] hover:shadow-lg cursor-pointer"
          >
            Book Now
          </button>
          <div
            onClick={(e) => { e.stopPropagation(); router.push("/visas/" + (visa.slug||visa._id||visa.id)); }}
            className="w-full py-2.5 rounded-xl text-center font-semibold text-sm transition-all duration-300 bg-white text-[#0A1628] border border-gray-200 hover:bg-[#0A1628] hover:text-[#D4AF37] hover:border-[#D4AF37] hover:shadow-lg cursor-pointer"
          >
            View Details →
          </div>
        </div>
      </div>
    </div>
  );
}

interface VisasClientProps {
  initialVisas: VisaService[];
}

export default function VisasClient({ initialVisas }: VisasClientProps) {
  const [heroImage, setHeroImage] = useState("/images_v2/visa1-v3.jpg");
  const [layout, setLayout] = useState({ desktop: 4, tablet: 3, mobile: 2 });
  useEffect(() => {
    fetch("/api/admin/site-config")
      .then(r => r.json())
      .then(d => {
        if (d?.sectionLayouts?.visas) setLayout(d.sectionLayouts.visas);        if (d?.heroImages?.visas) setHeroImage(d.heroImages.visas);
      })
      .catch(() => {});
  }, []);
  const [visas, setVisas] = useState<VisaService[]>(initialVisas.length > 0 ? initialVisas : FALLBACK_VISAS);
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [selectedVisa, setSelectedVisa] = useState<VisaService | null>(null);

  useEffect(() => {
    if (initialVisas.length > 0) return; // already have server data
    api.get('/visas').then(r => {
      const items = r.data as unknown as any[];
      if (Array.isArray(items) && items.length > 0) {
        const mapped: VisaService[] = items.map((v: any) => ({
          _id: v._id || v.id || '',
          country: v.country || '',
          countryCode: v.countryCode || '',
          processingTime: v.processingTime || '3-5 Days',
          visaFeeMMK: Number(v.visaFeeMMK) || 0,
          visaFeeUSD: Number(v.visaFeeUSD) || 0,
          requirements: typeof v.requirements === 'string'
            ? v.requirements.split(',').map((s: string) => s.trim()).filter(Boolean)
            : Array.isArray(v.requirements) ? v.requirements : [],
          additionalInfo: v.additionalInfo || '',
          image: v.image || COUNTRY_IMAGES[v.country],
        }));
        setVisas(mapped);
      }
    }).catch(() => {});
  }, [initialVisas.length]);

  // Cycle through existing visas to fill 3 rows × 10 cards (like Tours)
  const CARDS_PER_ROW = 4;
  const ROW_COUNT = 3;
  const pool: VisaService[] = [...visas];


  return (
    <div className="min-h-screen bg-gray-50">
<section className="relative w-full h-64 sm:h-80 overflow-hidden">
        <img src={heroImage} alt="Visa Services" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images_v2/visa1-v3.jpg"; }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/70 to-[#0A1628]/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Visa Services</h1>
          <p className="text-white/70 max-w-xl text-xs sm:text-sm">Hassle-free visa processing for destinations worldwide</p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => setCurrency('MMK')} className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${currency==='MMK'?'bg-gold text-white':'bg-white/20 text-white/70'}`}>🇲🇲 MMK</button>
            <button onClick={() => setCurrency('USD')} className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${currency==='USD'?'bg-gold text-white':'bg-white/20 text-white/70'}`}>💵 USD</button>
          </div>
        </div>
      </section>
<section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-20">
        <div className={`grid grid-cols-${layout.mobile} md:grid-cols-${layout.tablet} lg:grid-cols-${layout.desktop} gap-4`}>
          {pool.map(v => <VisaGridCard key={v._id + '-' + v._id} visa={v} />)}
        </div>
      </section>
{selectedVisa && <BookingModal isOpen={!!selectedVisa} onClose={() => setSelectedVisa(null)} title={`Apply for ${selectedVisa.country} Visa`} fields={['Name','Passport No','Travel Date']} />}
          <DealsBanner />
      <FAQAccordion section="visas" />
      <TestimonialSlider />
</div>
  );
}