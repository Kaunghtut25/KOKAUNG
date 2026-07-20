'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import BookingModal from '@/components/BookingModal';
import { getImageFallback } from '@/lib/imageFallback';
import DealsBanner from '@/components/DealsBanner';
import FAQAccordion from '@/components/FAQAccordion';
import TestimonialSlider from '@/components/TestimonialSlider';
interface InsurancePlan {
  id?: string;
  _id?: string;
  premiumPriceMMK?: number;
  premiumPriceUSD?: number;
  planName?: string;
  title?: string;
  coverageAmountMMK?: number;
  coverageAmountUSD?: number;
  premiumMMK?: number;
  premiumUSD?: number;
  coverage?: string;
  priceMMK?: number;
  priceUSD?: number;
  duration?: string;
  benefits?: string[];
  exclusions?: string[];
  description?: string;
  provider?: string;
  image?: string;
  images?: string[];
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-100" />
        <div className="flex-1">
          <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-3/4" />
      </div>
      <div className="h-10 bg-gray-100 rounded-xl" />
    </div>
  );
}

const FALLBACK_PLANS: InsurancePlan[] = [
  { _id: 'i1', planName: 'Basic Travel Shield', coverage: 'Medical + Trip Delay', priceMMK: 15000, priceUSD: 7, duration: 'Per trip', description: 'Essential coverage for short trips', benefits: ['Medical Emergency', 'Trip Cancellation', 'Lost Baggage'], image: '/images_v2/ins1-v3.jpg' },
  { _id: 'i2', planName: 'Standard Travel Guard', coverage: 'Medical + Baggage', priceMMK: 25000, priceUSD: 12, duration: 'Per trip', description: 'Comprehensive protection plan', benefits: ['Medical Emergency', 'Baggage Loss', 'Flight Delay'], image: '/images_v2/ins2-v3.jpg' },
  { _id: 'i3', planName: 'Premium Travel Protect', coverage: 'Medical + Cancellation', priceMMK: 45000, priceUSD: 21, duration: 'Annual', description: 'Premium travel coverage', benefits: ['Unlimited Medical', 'Trip Cancellation', 'Concierge'], image: '/images_v2/ins3-v3.jpg' },
  { _id: 'i4', planName: 'Family Travel Plan', coverage: 'Family Medical + Trip', priceMMK: 60000, priceUSD: 29, duration: 'Per trip', description: 'Complete family protection', benefits: ['Full Family Cover', 'Child Medical', 'Trip Cancellation'], image: '/images_v2/ins4-v3.jpg' },
  { _id: 'i5', planName: 'Senior Travel Cover', coverage: 'Medical + Evacuation', priceMMK: 55000, priceUSD: 26, duration: 'Per trip', description: 'Specialized coverage for senior travelers', benefits: ['Medical Emergency', 'Emergency Evacuation', 'Repatriation'], image: '/images_v2/ins1-v3.jpg' },
  { _id: 'i6', planName: 'Adventure Sports Pack', coverage: 'Extreme Sports + Medical', priceMMK: 85000, priceUSD: 40, duration: 'Per trip', description: 'Coverage for adventure activities', benefits: ['Sports Injury', 'Helicopter Rescue', 'Equipment Cover'], image: '/images_v2/ins2-v3.jpg' },
  { _id: 'i7', planName: 'Business Travel Pro', coverage: 'Medical + Productivity', priceMMK: 75000, priceUSD: 36, duration: 'Annual', description: 'For frequent business travelers', benefits: ['Medical Emergency', 'Trip Delay', 'Document Replacement'], image: '/images_v2/ins3-v3.jpg' },
  { _id: 'i8', planName: 'Student Travel Basic', coverage: 'Medical + Baggage', priceMMK: 12000, priceUSD: 6, duration: 'Per trip', description: 'Affordable coverage for students', benefits: ['Medical Emergency', 'Baggage Loss', 'Trip Cancellation'], image: '/images_v2/ins4-v3.jpg' },
  { _id: 'i9', planName: 'Cruise Coverage', coverage: 'Medical + Missed Port', priceMMK: 95000, priceUSD: 45, duration: 'Per trip', description: 'Specialized cruise travel insurance', benefits: ['Medical Emergency', 'Missed Port', 'Cabin Cover'], image: '/images_v2/ins1-v3.jpg' },
];

function normalizePlan(raw: any): InsurancePlan {
  const rawImages = Array.isArray(raw.images) ? raw.images : (typeof raw.images === 'string' ? [raw.images] : undefined);
  return {
    _id: raw._id || raw.id || '',
    planName: raw.title || raw.planName || raw.name || '',
    coverage: raw.coverage || '',
    duration: raw.duration || 'Per Trip',
    priceMMK: Number(raw.priceMMK || raw.premiumPriceMMK || raw.premiumMMK || raw.price || 0),
    priceUSD: Number(raw.priceUSD || raw.premiumPriceUSD || raw.premiumUSD || 0),
    coverageAmountMMK: Number(raw.coverageAmountMMK || 0),
    coverageAmountUSD: Number(raw.coverageAmountUSD || 0),
    benefits: Array.isArray(raw.benefits) ? raw.benefits : (typeof raw.benefits === 'string' ? raw.benefits.split(',').map((s:string) => s.trim()).filter(Boolean) : []),
    description: raw.description || '',
    image: raw.image || getImageFallback(raw._id || raw.id, rawImages),
  };
}

function InsuranceCard({ plan, currency, onSelect }: { plan: InsurancePlan; currency: 'MMK' | 'USD'; onSelect: () => void }) {
  const router = useRouter();
  const name = plan.planName || plan.title || '';
  const coverage = plan.coverage || '';
  const duration = plan.duration || 'Per Trip';
  const price = currency === 'MMK' ? (plan.priceMMK || 0) : (plan.priceUSD || 0);
  const imageUrl = plan.image || getImageFallback(plan._id, plan.images);
  const symbol = currency === 'MMK' ? 'Ks' : '$';
  const benefits = (plan.benefits || []).slice(0, 3);

  return (
    <div onClick={() => router.push("/insurance/" + (plan._id || plan.id))} className="rounded-2xl overflow-hidden group cursor-pointer border border-gray-100 hover:border-gold/40 transition-all duration-300 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <div className="relative h-40 overflow-hidden">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = '/images_v2/ins1-v3.jpg'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <h3 className="text-white font-semibold text-sm drop-shadow-md" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{name}</h3>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-1 justify-between gap-1.5">
        <p className="text-[11px] text-gray-500">{coverage} · {duration}</p>
        <div className="flex flex-wrap gap-1">
          {benefits.map((b, i) => (
            <span key={i} className="text-[10px] bg-[#D4AF37]/10 text-[#B8960F] px-1.5 py-0.5 rounded-full">{b}</span>
          ))}
        </div>
        <div className="mt-auto pt-1">
          <span className="text-gold font-bold text-sm">{symbol} {price.toLocaleString()}</span>
        </div>
        <button onClick={() => router.push('/book-now?type=insurance&plan=' + encodeURIComponent(plan.planName||name||'') + '&id=' + encodeURIComponent(plan._id||plan.id||'') + '&priceMMK=' + ((plan.priceMMK||plan.premiumPriceMMK||0)) + '&priceUSD=' + ((plan.priceUSD||plan.premiumPriceUSD||0)) + '&coverage=' + encodeURIComponent(plan.coverage||''))} className="w-full mt-1 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] font-bold rounded-xl text-xs hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all">Book Now</button>
        <button
          onClick={(e: any) => { e.stopPropagation(); router.push("/insurance/" + (plan._id || plan.id)); }}
          className="w-full mt-1 py-2 rounded-xl text-center font-semibold text-xs transition-all duration-300 bg-white text-[#0A1628] border border-gray-200 hover:bg-[#0A1628] hover:text-[#D4AF37] hover:border-[#D4AF37] hover:shadow-lg"
        >
          View Details &rarr;
        </button>
        {coverage && <p className="text-[10px] text-gray-500 mt-1 leading-tight">{coverage}</p>}
      </div>
    </div>
  );
}

interface InsuranceClientProps {
  initialPlans: InsurancePlan[];
}

export default function InsuranceClient({ initialPlans }: InsuranceClientProps) {
  const [heroImage, setHeroImage] = useState("/images_v2/ins1-v3.jpg");
  const [layout, setLayout] = useState({ desktop: 3, tablet: 2, mobile: 1 });
  useEffect(() => {
    fetch("/api/admin/site-config")
      .then(r => r.json())
      .then(d => {
        if (d?.sectionLayouts?.insurance) setLayout(d.sectionLayouts.insurance);
        if (d?.heroImages?.insurance) setHeroImage(d.heroImages.insurance);
      })
      .catch(() => {});
  }, []);
  const [plans, setPlans] = useState<InsurancePlan[]>(initialPlans.length > 0 ? initialPlans : FALLBACK_PLANS);
  const [loading, setLoading] = useState(initialPlans.length === 0);
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null);

  useEffect(() => {
    if (initialPlans.length > 0) return;
    const fetchInsurance = async () => {
      try {
        const response = await api.get<any[]>('/insurance');
        const raw = response.data as unknown as any[];
        if (Array.isArray(raw) && raw.length > 0) {
          setPlans(raw.map(normalizePlan));
        }
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchInsurance();
  }, [initialPlans.length]);

  const displayPlans = plans.slice(0, 9);

  return (
    <div className="min-h-screen bg-gray-50">
<section className="relative w-full h-64 sm:h-80 overflow-hidden">
        <img src={heroImage} alt="Insurance" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images_v2/ins1-v3.jpg"; }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/70 to-[#0A1628]/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Travel Insurance</h1>
          <p className="text-white/70 max-w-xl text-xs sm:text-sm">Protect your journey with comprehensive coverage</p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => setCurrency('MMK')} className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${currency==='MMK'?'bg-gold text-white':'bg-white/20 text-white/70'}`}>🇲🇲 MMK</button>
            <button onClick={() => setCurrency('USD')} className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${currency==='USD'?'bg-gold text-white':'bg-white/20 text-white/70'}`}>💵 USD</button>
          </div>
        </div>
      </section>
<section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-12">
        {loading ? (
          <div className={`grid grid-cols-${layout.mobile} sm:grid-cols-${layout.tablet} lg:grid-cols-${layout.desktop} gap-4`}>
            {[1,2,3,4,5,6,7,8,9].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className={`grid grid-cols-${layout.mobile} sm:grid-cols-${layout.tablet} lg:grid-cols-${layout.desktop} gap-4 sm:gap-5`}>
            {displayPlans.map(plan => (
              <InsuranceCard key={plan._id} plan={plan} currency={currency} onSelect={() => setSelectedPlan(plan)} />
            ))}
          </div>
        )}
      </section>
      {selectedPlan && <BookingModal isOpen={!!selectedPlan} onClose={() => setSelectedPlan(null)} itemType="insurance" itemId={selectedPlan.id || selectedPlan._id || ''} itemName={selectedPlan.planName || selectedPlan.title || ''} priceMMK={selectedPlan.premiumPriceMMK || selectedPlan.priceMMK} priceUSD={selectedPlan.premiumPriceUSD || selectedPlan.priceUSD} />}
          <DealsBanner />
      <FAQAccordion section="insurance" />
      <TestimonialSlider />
</div>
  );
}