import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAll } from '@/lib/persistentStore';
import SocialShare from '@/components/SocialShare';
import RelatedItems from '@/components/RelatedItems';
export const dynamic = 'force-dynamic';

interface PageProps { params: { slug: string } }

const FALLBACK_PLANS = [
  { _id: 'i1', planName: 'Basic Travel Shield', coverage: 'Medical + Trip Delay', priceMMK: 15000, priceUSD: 7, duration: 'Per trip', benefits: ['Medical Emergency', 'Trip Cancellation', 'Lost Baggage'] },
  { _id: 'i2', planName: 'Standard Travel Guard', coverage: 'Medical + Baggage', priceMMK: 25000, priceUSD: 12, duration: 'Per trip', benefits: ['Medical Emergency', 'Baggage Loss', 'Flight Delay'] },
  { _id: 'i3', planName: 'Premium Travel Protect', coverage: 'Medical + Cancellation', priceMMK: 45000, priceUSD: 21, duration: 'Annual', benefits: ['Unlimited Medical', 'Trip Cancellation', 'Concierge'] },
  { _id: 'i4', planName: 'Family Travel Plan', coverage: 'Family Medical + Trip', priceMMK: 60000, priceUSD: 29, duration: 'Per trip', benefits: ['Full Family Cover', 'Child Medical', 'Trip Cancellation'] },
  { _id: 'i5', planName: 'Senior Travel Cover', coverage: 'Medical + Evacuation', priceMMK: 55000, priceUSD: 26, duration: 'Per trip', benefits: ['Medical Emergency', 'Emergency Evacuation', 'Repatriation'] },
  { _id: 'i6', planName: 'Adventure Sports Pack', coverage: 'Extreme Sports + Medical', priceMMK: 85000, priceUSD: 40, duration: 'Per trip', benefits: ['Sports Injury', 'Helicopter Rescue', 'Equipment Cover'] },
  { _id: 'i7', planName: 'Business Travel Pro', coverage: 'Medical + Productivity', priceMMK: 75000, priceUSD: 36, duration: 'Annual', benefits: ['Medical Emergency', 'Trip Delay', 'Document Replacement'] },
  { _id: 'i8', planName: 'Student Travel Basic', coverage: 'Medical + Baggage', priceMMK: 12000, priceUSD: 6, duration: 'Per trip', benefits: ['Medical Emergency', 'Baggage Loss', 'Trip Cancellation'] },
  { _id: 'i9', planName: 'Cruise Coverage', coverage: 'Medical + Missed Port', priceMMK: 95000, priceUSD: 45, duration: 'Per trip', benefits: ['Medical Emergency', 'Missed Port', 'Cabin Cover'] },
];



export default async function InsuranceDetailPage({ params }: PageProps) {
  const slug = params.slug;
  let plans = await getAll('insurances') as any[];
  if (plans.length === 0) plans = FALLBACK_PLANS;
  const plan = plans.find((p: any) => ((p.planName || p.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug || p.id === slug || p._id === slug)) || null;
  if (!plan) notFound();

  const name = plan.planName || plan.title || '';
  const displayImage = (plan.images && Array.isArray(plan.images) && plan.images[0]) || plan.image || '/images_v2/ins1-v2.jpg';
  const priceMMK = plan.priceMMK || 0;
  const priceUSD = plan.priceUSD || 0;
  const coverage = plan.coverage || '';
  const benefits: string[] = Array.isArray(plan.benefits) ? plan.benefits : (typeof plan.benefits === 'string' ? plan.benefits.split(',').map((s: string) => s.trim()).filter(Boolean) : []);
  const duration = plan.duration || 'Per Trip';

  const bookNowUrl = '/book-now?type=insurance&plan=' + encodeURIComponent(name) + '&id=' + encodeURIComponent(plan.id || plan._id || slug) + '&priceMMK=' + priceMMK + '&priceUSD=' + priceUSD;

  return (
    <main className="min-h-screen bg-white">
      {/* Back Button */}

      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <Image src={displayImage} alt={name} width={1200} height={630} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_70%)]" />
        <Link href="/insurance" className="absolute top-6 left-4 md:top-8 md:left-8 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all text-sm">
          ← Back to Insurance
        </Link>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold border border-[#D4AF37]/30 backdrop-blur-sm">
                🛡️ Travel Insurance
              </span>
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 text-white/80 text-xs font-semibold border border-[#D4AF37]/30 backdrop-blur-sm">
                {duration}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {name}
            </h1>
            <p className="text-white/60 text-base md:text-lg">{coverage}</p>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm">
        <Link href="/" className="text-gray-500 hover:text-[#D4AF37]">Home</Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link href="/insurance" className="text-gray-500 hover:text-[#D4AF37]">Insurance</Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-[#0A1628] font-medium">{name}</span>
      </nav>

      <SocialShare url={typeof window !== "undefined" ? window.location.href : ""} title={"A9 Global Travel - Insurance"} />

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold">Ks {priceMMK.toLocaleString()}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">Price</p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold">{duration}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">Duration</p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold">{benefits.length}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">Benefits</p>
              </div>
            </div>

            {/* Coverage Details */}
            <div>
              <h2 className="text-2xl font-bold text-[#0A1628] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Coverage Details
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">
                {coverage || 'Comprehensive travel insurance coverage for your peace of mind.'}
              </p>
            </div>

            {/* Benefits */}
            {benefits.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#0A1628] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Included Benefits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {benefits.map((b: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/15 text-[#0A1628] text-sm font-medium hover:bg-[#D4AF37]/10 transition-colors">
                      <svg className="w-4 h-4 text-[#D4AF37] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Plan Info Card */}
            <div className="bg-[#0A1628] rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Plan Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">Price (MMK)</p>
                    <p className="text-white font-medium">Ks {priceMMK.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">Price (USD)</p>
                    <p className="text-white font-medium">${priceUSD.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">Duration</p>
                    <p className="text-white font-medium">{duration}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar — Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-2xl border border-[#D4AF37]/20 bg-gray-50 p-6 space-y-5">
                {/* Price Header */}
                <div className="bg-gradient-to-r from-[#0A1628] to-[#162D50] -mx-6 -mt-6 p-6 rounded-t-2xl text-white">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Plan Price</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      Ks {priceMMK.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-white/50 text-sm mt-1">
                    ≈ ${priceUSD.toLocaleString()} USD
                  </p>
                </div>

                {/* Info Rows */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Plan Name</span>
                    <span className="text-[#0A1628] font-medium">{name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-[#0A1628] font-medium">{duration}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Coverage</span>
                    <span className="text-[#0A1628] font-medium">{coverage}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Benefits</span>
                    <span className="text-[#0A1628] font-medium">{benefits.length} included</span>
                  </div>
                </div>

                {/* Book Now Button */}
                <Link
                  href={bookNowUrl}
                  className="block w-full py-3.5 rounded-xl text-center font-bold text-base bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:scale-[1.02] transition-all duration-300"
                >
                  Book Now
                </Link>
                <p className="text-center text-gray-400 text-xs">No payment required to inquire</p>
              </div>

              <Link
                href="/insurance"
                className="block w-full py-3 rounded-xl text-center font-semibold text-sm border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A1628] transition-all duration-300"
              >
                ← Back to All Insurance
              </Link>
            </div>
          </div>
        </div>
      </section>

      <RelatedItems section="insurance" excludeSlug={slug} />
    </main>
  );
}
