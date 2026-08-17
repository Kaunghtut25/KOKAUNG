'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useI18n } from "@/lib/i18n";
import { mmVisas, mmLookup } from "@/lib/mm-content";
import { api } from '@/lib/api';
import BookingModal from '@/components/BookingModal';
import DealsBanner from '@/components/DealsBanner';
import FAQAccordion from '@/components/FAQAccordion';
import TestimonialSlider from '@/components/TestimonialSlider';
import Image from "next/image";
import FlagIcon from '@/components/FlagIcon';

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
  Thailand: 'th', Singapore: 'sg', Malaysia: 'my', Vietnam: 'vn',
  China: 'cn', Japan: 'jp', 'South Korea': 'kr', India: 'in',
  'United Arab Emirates': 'ae', Cambodia: 'kh', Indonesia: 'id',
  Taiwan: 'tw', Philippines: 'ph', Australia: 'au',
  'United Kingdom': 'gb', 'Hong Kong': 'hk', Macau: 'mo',
  'Sri Lanka': 'lk', Nepal: 'np', Maldives: 'mv', Laos: 'la',
  Brunei: 'bn', Myanmar: 'mm',
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
  const { t } = useI18n();
  const flag = COUNTRY_FLAGS[visa.country] || '';
  const imageUrl = visa.image || COUNTRY_IMAGES[visa.country];

  return (
    <div
      onClick={() => router.push("/visas/" + (visa.slug||visa._id||visa.id))}
      className="rounded-2xl overflow-hidden group cursor-pointer border border-gray-100 hover:border-gold/40 transition-all duration-300 bg-white shadow-sm flex flex-col"
      style={{ minHeight: 380 }}
    >
      {imageUrl ? (
        <div className="relative overflow-hidden" style={{ height: 176 }}>
          <Image alt={visa.country} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={imageUrl} width={1600} height={900} sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-1.5 left-2 flex items-center gap-1.5">
            <span className="text-xl inline-flex items-center"><FlagIcon code={flag} width={24} /></span>
            <h3 className="text-white font-semibold text-sm drop-shadow-md" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{visa.country}</h3>
          </div>
        </div>
      ) : (
        <div className="h-52 bg-gradient-to-br from-[#D4AF37]/20 to-[#F5A623]/20 flex items-center justify-center">
          <span className="text-4xl inline-flex items-center"><FlagIcon code={flag} width={48} /></span>
        </div>
      )}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <p className="text-xs text-gray-500">{visa.processingTime}</p>
        {visa.requirements.length > 0 && (
          <div className="mt-1.5">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">{t("visa.requiredDocs")}</p>
            <ul className="space-y-1">
              {visa.requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] leading-snug text-[#7A5F08]">
                  <svg className="w-3 h-3 text-[#D4AF37] flex-shrink-0 mt-[1px]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {(visa.visaFeeMMK > 0 || visa.visaFeeUSD > 0) && (
          <div className="pt-2 flex gap-3 text-xs">
            {visa.visaFeeMMK > 0 && <span className="text-[#8A6C0B] font-bold">Ks {visa.visaFeeMMK.toLocaleString()}</span>}
            {visa.visaFeeUSD > 0 && <span className="text-[#8A6C0B] font-bold">${visa.visaFeeUSD}</span>}
          </div>
        )}
        <div className="mt-auto pt-3 flex flex-col gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); router.push('/book-now?type=visa&country=' + encodeURIComponent(visa.country||'') + '&id=' + encodeURIComponent(visa._id||visa.id||'') + '&feeMMK=' + (visa.visaFeeMMK||0) + '&feeUSD=' + (visa.visaFeeUSD||0) + '&processingTime=' + encodeURIComponent(visa.processingTime||'')); }}
            className="w-full py-2.5 rounded-xl text-center font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] hover:shadow-lg cursor-pointer"
          >
            {t("common.bookNow")}
          </button>
          <div
            onClick={(e) => { e.stopPropagation(); router.push("/visas/" + (visa.slug||visa._id||visa.id)); }}
            className="w-full py-2.5 rounded-xl text-center font-semibold text-sm transition-all duration-300 bg-white text-[#0A1628] border border-gray-200 hover:bg-[#0A1628] hover:text-[#D4AF37] hover:border-[#D4AF37] hover:shadow-lg cursor-pointer"
          >
            {t("common.viewDetails")} →
          </div>
        </div>
      </div>
    </div>
  );
}

interface VisasClientProps {
  initialVisas: VisaService[];
}

export default function VisasClient({ initialVisas, siteConfig }: VisasClientProps & { siteConfig?: any }) {
  const heroImage = siteConfig?.heroImages?.visas || "/images_v2/visa1-v3.jpg";
  const vt = siteConfig?.heroText?.visas || {};
  const vTitle = vt.title || "";
  const vSubtitle = vt.subtitle || "";
  const vTitleFont = vt.titleFont || "'Playfair Display', serif";
  const vTitleSize = vt.titleSize || "2.5rem";
  const vSubtitleSize = vt.subtitleSize || "1rem";
  
  const [visas, setVisas] = useState<VisaService[]>(initialVisas.length > 0 ? initialVisas : FALLBACK_VISAS);
  const { lang } = useI18n();
  const displayVisas = useMemo(
    () => visas.map((v) => (lang === "mm" ? { ...v, ...mmLookup(mmVisas, v) } : v)),
    [visas, lang]
  );
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

    return (
    <div className="min-h-screen bg-gray-50">
<section className="relative w-full h-64 sm:h-80 overflow-hidden" style={{ height: (siteConfig?.heroDimensions?.["visas"]?.desktop || 380) + "px" }}>
        <Image alt="Visa Services" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images_v2/visa1-v3.jpg"; }} src={heroImage} width={1600} height={900} sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/70 to-[#0A1628]/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 mb-8">
          {vTitle ? (<h1 className="font-bold text-white mb-2" style={{ fontFamily: vTitleFont, fontSize: vTitleSize }}>{vTitle}</h1>) : null}
          {vSubtitle ? (<p className="text-white/70 max-w-xl text-xs sm:text-sm" style={{ fontSize: vSubtitleSize }}>{vSubtitle}</p>) : null}
        </div>
      </section>
      <div className="flex justify-center gap-2 pt-8 pb-2">
        <button onClick={() => setCurrency('MMK')} className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${currency==='MMK'?'bg-gold text-[#0A1628]':'bg-white/20 text-gray-600 border border-gray-200'}`}><FlagIcon code="mm" width={16} className="inline-block mr-1" /> MMK</button>
        <button onClick={() => setCurrency('USD')} className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${currency==='USD'?'bg-gold text-[#0A1628]':'bg-white/20 text-gray-600 border border-gray-200'}`}>💵 USD</button>
      </div>
<section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayVisas.map(v => (
            <VisaGridCard key={v._id} visa={v} />
          ))}
        </div>
      </section>
{selectedVisa && <BookingModal isOpen={!!selectedVisa} onClose={() => setSelectedVisa(null)} itemType="visa" itemId={selectedVisa._id} itemName={`Apply for ${selectedVisa.country} Visa`} />}
          <DealsBanner />
      <FAQAccordion section="visas" />
      <TestimonialSlider />
</div>
  );
}
