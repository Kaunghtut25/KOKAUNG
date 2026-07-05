'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import BookingModal from '@/components/BookingModal';

interface InsurancePlan {
  _id: string;
  planName: string;
  coverageAmountMMK: number;
  coverageAmountUSD: number;
  premiumMMK: number;
  premiumUSD: number;
  duration: string;
  benefits: string[];
  exclusions?: string[];
  description?: string;
  provider?: string;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-white/10" />
        <div className="flex-1">
          <div className="h-5 bg-white/10 rounded w-3/4 mb-2" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-white/10 rounded w-full" />
        <div className="h-3 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-5/6" />
      </div>
      <div className="h-10 bg-white/10 rounded-xl" />
    </div>
  );
}

const shieldIcon = (
  <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);


const FALLBACK_PLANS: InsurancePlan[] = [
  { _id: 'ins1', planName: 'Basic Travel Shield', coverageAmountMMK: 5000000, coverageAmountUSD: 2381, premiumMMK: 25000, premiumUSD: 12, duration: '1-30 Days', provider: 'A9 Global Insurance', benefits: ['Medical Emergency Cover', 'Trip Cancellation', 'Lost Baggage', 'Personal Accident'], exclusions: [], description: 'Essential coverage for short trips' },
  { _id: 'ins2', planName: 'Gold Explorer Plan', coverageAmountMMK: 15000000, coverageAmountUSD: 7143, premiumMMK: 55000, premiumUSD: 26, duration: '1-90 Days', provider: 'A9 Global Insurance', benefits: ['Comprehensive Medical', 'Trip Delay Compensation', 'Lost Passport Assistance', 'Emergency Evacuation', 'Personal Liability'], exclusions: [], description: 'Comprehensive coverage for explorers' },
  { _id: 'ins3', planName: 'Family Vacation Plus', coverageAmountMMK: 25000000, coverageAmountUSD: 11905, premiumMMK: 85000, premiumUSD: 40, duration: '1-60 Days', provider: 'A9 Global Insurance', benefits: ['Full Family Cover', 'Child Medical Assistance', 'Trip Cancellation', 'Delayed Baggage', '24/7 Helpline', 'COVID-19 Cover'], exclusions: [], description: 'Complete family travel protection' },
  { _id: 'ins4', planName: 'Premium Elite Guard', coverageAmountMMK: 50000000, coverageAmountUSD: 23810, premiumMMK: 150000, premiumUSD: 71, duration: 'Up to 365 Days', provider: 'A9 Global Insurance', benefits: ['Unlimited Medical', 'Pre-existing Conditions', 'Business Equipment Cover', 'Concierge Service', 'Air Ambulance', 'Trip Curtailment', 'Personal Accident 24/7'], exclusions: [], description: 'Ultimate protection for frequent travelers' },
];

const PLAN_IMAGES: Record<string, string> = {
  'Basic Travel Shield': 'https://images.unsplash.com/photo-1487452066049-a6d1fa0a075c?w=600&h=200&fit=crop',
  'Gold Explorer Plan': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=200&fit=crop',
  'Family Vacation Plus': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=200&fit=crop',
  'Premium Elite Guard': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=200&fit=crop',
};

export default function InsurancePage() {
  const router = useRouter();
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null);

  useEffect(() => {
    const fetchInsurance = async () => {
      setLoading(true);
      try {
        const response = await api.get<InsurancePlan[]>('/insurance');
        const data = response.data as unknown as InsurancePlan[];
        if (Array.isArray(data) && data.length > 0) {
          setPlans(data);
        } else {
          setPlans(FALLBACK_PLANS);
        }
      } catch (err) {
        console.error('Failed to fetch insurance:', err);
        setPlans(FALLBACK_PLANS);
      } finally {
        setLoading(false);
      }
    };
    fetchInsurance();
  }, []);

  const handleGetCovered = (plan: InsurancePlan) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('a9token') : null;
    if (!token) {
      router.push('/auth/login');
      return;
    }
    setSelectedPlan(plan);
    setShowBookingModal(true);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1487452066049-a6d1fa0a075c?w=1600&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5A623] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
            <svg className="w-10 h-10 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-[#D4AF37] via-[#F5A623] to-[#D4AF37] bg-clip-text text-transparent"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Travel Insurance Plans
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Travel with peace of mind. Comprehensive insurance coverage for medical emergencies, trip cancellations, lost baggage, and more.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-10 pb-20">
        {/* Currency Toggle */}
        {!loading && plans.length > 0 && (
          <div className="flex justify-center mb-10">
            <div className="flex rounded-xl bg-white shadow-sm border border-gray-200 p-1">
              <button
                onClick={() => setCurrency('MMK')}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currency === 'MMK'
                    ? 'bg-[#D4AF37] text-gray-900 shadow-md'
                    : 'text-gray-900/60 hover:text-gray-900'
                }`}
              >
                MMK (Ks)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currency === 'USD'
                    ? 'bg-[#D4AF37] text-gray-900 shadow-md'
                    : 'text-gray-900/60 hover:text-gray-900'
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && plans.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <svg className="w-20 h-20 mx-auto text-gold/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h3 className="text-xl text-gray-900 font-semibold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Insurance plans coming soon
            </h3>
            <p className="text-gray-400">We&apos;re updating our insurance offerings. Check back shortly.</p>
          </div>
        )}

        {/* Insurance Cards — 4 per row */}
        {!loading && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const coverage =
                currency === 'MMK' ? plan.coverageAmountMMK : plan.coverageAmountUSD;
              const premium =
                currency === 'MMK' ? plan.premiumMMK : plan.premiumUSD;
              const currencySymbol = currency === 'MMK' ? 'Ks' : '$';
              const benefits = plan.benefits || [];

              return (
                <div
                  key={plan._id}
                  className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:border-gold/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/5 transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Card Image */}
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={PLAN_IMAGES[plan.planName] || 'https://images.unsplash.com/photo-1487452066049-a6d1fa0a075c?w=600&h=200&fit=crop&auto=format&q=80'}
                      alt={`Travel Insurance - ${plan.planName}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => { const t = e.target as HTMLImageElement; if (t.src !== 'https://images.unsplash.com/photo-1487452066049-a6d1fa0a075c?w=600&h=200&fit=crop&auto=format&q=80') t.src = 'https://images.unsplash.com/photo-1487452066049-a6d1fa0a075c?w=600&h=200&fit=crop&auto=format&q=80'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent" />
                  </div>
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5A623] flex items-center justify-center shadow-md shadow-[#D4AF37]/20">
                        {shieldIcon}
                      </div>
                      <div>
                        <h3
                          className="text-gray-900 font-semibold text-lg"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          {plan.planName}
                        </h3>
                        {plan.provider && (
                          <p className="text-gray-500 text-xs">by {plan.provider}</p>
                        )}
                      </div>
                    </div>

                    {/* Coverage Amount */}
                    <div className="mb-1">
                      <p className="text-gray-500 text-xs uppercase tracking-wider">Coverage</p>
                      <p className="text-[#D4AF37] text-2xl font-bold">
                        {currencySymbol} {coverage?.toLocaleString() || 'Contact us'}
                      </p>
                    </div>

                    {/* Premium + Duration */}
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Premium</p>
                        <p className="text-gray-900 font-bold text-lg">
                          {currencySymbol} {premium?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      {plan.duration && (
                        <div>
                          <p className="text-gray-500 text-xs uppercase tracking-wider">Duration</p>
                          <p className="text-gray-900 font-medium text-sm">{plan.duration}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="p-6 flex-1">
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-3">
                      Benefits
                    </p>
                    {benefits.length > 0 ? (
                      <ul className="space-y-2">
                        {benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-600 text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 text-sm">Benefits details available upon inquiry</p>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => handleGetCovered(plan)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#E5C048] hover:to-[#D4AF37] text-gray-900 font-bold text-base shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 transition-all duration-300 active:scale-[0.98]"
                    >
                      Get Protected
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Trust indicators */}
        {!loading && !error && plans.length > 0 && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: '🛡️', title: '24/7 Assistance', desc: 'Round-the-clock emergency support' },
              { icon: '🏥', title: 'Medical Coverage', desc: 'Hospital and medical expenses' },
              { icon: '✈️', title: 'Trip Protection', desc: 'Cancellation and delay coverage' },
              { icon: '🧳', title: 'Baggage Cover', desc: 'Lost or delayed baggage protection' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white shadow-sm border border-gray-200 text-center"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 className="text-gray-900 font-semibold text-sm mb-1">{item.title}</h4>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {selectedPlan && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          itemType="insurance"
          itemId={selectedPlan._id}
          itemName={selectedPlan.planName}
          itemSubtitle={selectedPlan.duration}
          unitPrice={selectedPlan.premiumMMK || 0}
          currency="MMK"
          unitLabel="person"
          maxQuantity={10}
        />
      )}
    </main>
  );
}
