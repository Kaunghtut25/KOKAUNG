'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import BookingModal from '@/components/BookingModal';
import { getImageFallback } from '@/lib/imageFallback';
import Image from 'next/image';

interface InsurancePlan {
  _id: string;
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

const shieldIcon = (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

/** Normalize API data or fallback — handles both old & new field names */
function normalizePlan(raw: any): InsurancePlan {
  return {
    _id: raw._id || raw.id || '',
    planName: raw.title || raw.planName || raw.name || '',
    coverage: raw.coverage || '',
    duration: raw.duration || '',
    priceMMK: Number(raw.priceMMK || raw.premiumMMK || raw.price || 0),
    priceUSD: Number(raw.priceUSD || raw.premiumUSD || 0),
    coverageAmountMMK: Number(raw.coverageAmountMMK || 0),
    coverageAmountUSD: Number(raw.coverageAmountUSD || 0),
    benefits: Array.isArray(raw.benefits) ? raw.benefits : (typeof raw.benefits === 'string' ? raw.benefits.split(',').map((s:string) => s.trim()) : []),
    description: raw.description || '',
    image: raw.image || raw.images?.[0] || getImageFallback(raw._id || raw.id, raw.images),
  };
}

const FALLBACK_PLANS: InsurancePlan[] = [
  { _id: 'i1', planName: 'Basic Travel Shield', coverage: 'Medical + Trip Delay', priceMMK: 15000, priceUSD: 7, duration: 'Per trip', description: 'Essential coverage for short trips', benefits: ['Medical Emergency', 'Trip Cancellation', 'Lost Baggage'], image: '/images_v2/ins1-v3.jpg' },
  { _id: 'i2', planName: 'Standard Travel Guard', coverage: 'Medical + Baggage', priceMMK: 25000, priceUSD: 12, duration: 'Per trip', description: 'Comprehensive protection plan', benefits: ['Medical Emergency', 'Baggage Loss', 'Flight Delay'], image: '/images_v2/ins2-v3.jpg' },
  { _id: 'i3', planName: 'Premium Travel Protect', coverage: 'Medical + Cancellation', priceMMK: 45000, priceUSD: 21, duration: 'Annual', description: 'Premium travel coverage', benefits: ['Unlimited Medical', 'Trip Cancellation', 'Concierge'], image: '/images_v2/ins3-v3.jpg' },
  { _id: 'i4', planName: 'Family Travel Plan', coverage: 'Family Medical + Trip', priceMMK: 60000, priceUSD: 29, duration: 'Per trip', description: 'Complete family protection', benefits: ['Full Family Cover', 'Child Medical', 'Trip Cancellation'], image: '/images_v2/ins4-v3.jpg' },
];

function InsuranceCard({ plan, currency, onSelect }: { plan: InsurancePlan; currency: 'MMK' | 'USD'; onSelect: () => void }) {
  const name = plan.planName || plan.title || '';
  const coverage = plan.coverage || '';
  const duration = plan.duration || 'Per Trip';
  const price = currency === 'MMK' ? (plan.priceMMK || 0) : (plan.priceUSD || 0);
  const imageUrl = plan.image || getImageFallback(plan._id, plan.images);
  const symbol = currency === 'MMK' ? 'Ks' : '$';
  const benefits = (plan.benefits || []).slice(0, 3);

  return (
    <div className="rounded-2xl overflow-hidden group cursor-pointer border border-gray-100 hover:border-gold/40 transition-all duration-300 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = '/images_v2/ins1-v3.jpg'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <h3 className="text-white font-semibold text-sm drop-shadow-md" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{name}</h3>
        </div>
      </div>
      {/* Details */}
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
        <button onClick={onSelect} className="w-full mt-1 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] font-bold rounded-xl text-xs hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all">Get Quote</button>
      </div>
    </div>
  );
}

export default function InsurancePage() {
  const router = useRouter();
  const [plans, setPlans] = useState<InsurancePlan[]>(FALLBACK_PLANS);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null);

  useEffect(() => {
    const fetchInsurance = async () => {
      try {
        const response = await api.get<any[]>('/insurance');
        const raw = response.data as unknown as any[];
        if (Array.isArray(raw) && raw.length > 0) {
          setPlans(raw.map(normalizePlan));
        }
      } catch {
        setPlans(FALLBACK_PLANS);
      } finally {
        setLoading(false);
      }
    };
    fetchInsurance();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative w-full h-64 sm:h-80 overflow-hidden">
        <img src="/images_v2/ins1-v3.jpg" alt="Insurance" className="w-full h-full object-cover" />
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

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-12 relative z-10 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {plans.map(plan => (
              <InsuranceCard key={plan._id} plan={plan} currency={currency} onSelect={() => setSelectedPlan(plan)} />
            ))}
          </div>
        )}
      </section>

      {selectedPlan && (
        <BookingModal isOpen={!!selectedPlan} onClose={() => setSelectedPlan(null)} title={`Get Quote: ${selectedPlan.planName || selectedPlan.title}`} fields={['Name', 'Email', 'Phone', 'Travel Date']} />
      )}
    </div>
  );
}
