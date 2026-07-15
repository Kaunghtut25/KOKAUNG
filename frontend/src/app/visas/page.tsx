'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import BookingModal from '@/components/BookingModal';

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

function VisaCard({ visa, currency, onClick }: { visa: VisaService; currency: 'MMK' | 'USD'; onClick: () => void }) {
  const flag = COUNTRY_FLAGS[visa.country] || '🌏';
  const imageUrl = COUNTRY_IMAGES[visa.country];
  const fee = currency === 'MMK' ? visa.visaFeeMMK : visa.visaFeeUSD;
  const symbol = currency === 'MMK' ? 'Ks' : '$';

  return (
    <div onClick={onClick} className="rounded-2xl overflow-hidden group cursor-pointer border border-gray-100 hover:border-gold/40 transition-all duration-300 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col">
      {imageUrl ? (
        <div className="relative h-36 overflow-hidden">
          <img src={imageUrl} alt={visa.country} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-2 left-3 flex items-center gap-2">
            <span className="text-2xl">{flag}</span>
            <h3 className="text-white font-semibold text-lg drop-shadow-md" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{visa.country}</h3>
          </div>
        </div>
      ) : (
        <div className="h-36 bg-gradient-to-br from-[#D4AF37]/20 to-[#F5A623]/20 flex items-center justify-center">
          <span className="text-5xl">{flag}</span>
        </div>
      )}
      <div className="p-4 flex flex-col flex-1 justify-between gap-1.5">
        {!imageUrl && (
          <h3 className="text-gray-900 font-semibold text-sm" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{visa.country}</h3>
        )}
        <p className="text-xs text-gray-500">{visa.processingTime}</p>
        <p className="text-xs text-gray-400">{visa.requirements.slice(0, 2).join(' · ')}</p>
        <div className="mt-auto pt-2">
          <span className="text-gold font-bold text-base">{symbol} {fee.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function VisasPage() {
  const [visas, setVisas] = useState<VisaService[]>(FALLBACK_VISAS);
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [selectedVisa, setSelectedVisa] = useState<VisaService | null>(null);

  useEffect(() => { api.get('/visas').then(r => { if (r.data?.data) setVisas(r.data.data); }).catch(() => {}); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative w-full h-72 sm:h-96 overflow-hidden">
        <img src="/images_v2/visa1-v3.jpg" alt="Visa Services" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/70 to-[#0A1628]/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Visa Services</h1>
          <p className="text-white/70 max-w-xl text-sm sm:text-base">Hassle-free visa processing for destinations worldwide</p>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setCurrency('MMK')} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${currency==='MMK'?'bg-gold text-white':'bg-white/20 text-white/70'}`}>🇲🇲 MMK</button>
            <button onClick={() => setCurrency('USD')} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${currency==='USD'?'bg-gold text-white':'bg-white/20 text-white/70'}`}>💵 USD</button>
          </div>
        </div>
      </section>

      {/* 2-Row Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 relative z-10 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {visas.map(v => <VisaCard key={v._id} visa={v} currency={currency} onClick={() => setSelectedVisa(v)} />)}
        </div>
      </section>

      {/* Modal */}
      {selectedVisa && <BookingModal isOpen={!!selectedVisa} onClose={() => setSelectedVisa(null)} title={`Apply for ${selectedVisa.country} Visa`} fields={['Name','Passport No','Travel Date']} />}
    </div>
  );
}
