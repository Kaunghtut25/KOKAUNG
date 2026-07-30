import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAll } from '@/lib/persistentStore';
import SocialShare from '@/components/SocialShare';
import BackButton from '@/components/BackButton';
import RelatedItems from '@/components/RelatedItems';
export const dynamic = 'force-dynamic';

interface PageProps { params: { slug: string } }

const FALLBACK_CRUISES = [
  { id: "cr1", title: "Halong Bay Cruise", destination: "Vietnam", description: "Luxury overnight cruise through Halong Bay.", priceMMK: 650000, priceUSD: 310, duration: "3 Days / 2 Nights", images: ["/images_v2/hero-cruises-v2.jpg"] },
  { id: "cr2", title: "Mekong River Cruise", destination: "Cambodia", description: "Journey along the legendary Mekong River.", priceMMK: 920000, priceUSD: 440, duration: "5 Days / 4 Nights", images: ["/images_v2/hero-cruises-v2.jpg"] },
  { id: "cr3", title: "Andaman Sea Cruise", destination: "Thailand", description: "Island hopping in the Andaman Sea.", priceMMK: 580000, priceUSD: 276, duration: "4 Days / 3 Nights", images: ["/images_v2/hero-cruises-v2.jpg"] },
  { id: "cr4", title: "Singapore Strait Cruise", destination: "Singapore", description: "Luxury cruise around Singapore.", priceMMK: 1200000, priceUSD: 571, duration: "3 Days / 2 Nights", images: ["/images_v2/hero-cruises-v2.jpg"] },
  { id: "cr5", title: "Maldives Atoll Cruise", destination: "Maldives", description: "Sail through pristine atolls.", priceMMK: 2500000, priceUSD: 1190, duration: "7 Days / 6 Nights", images: ["/images_v2/dest-maldives-v2.jpg"] },
  { id: "cr6", title: "Dubai Marina Cruise", destination: "UAE", description: "Evening dinner cruise along Dubai Marina.", priceMMK: 180000, priceUSD: 85, duration: "Evening", images: ["/images_v2/dest-dubai-v2.jpg"] },
  { id: "cr7", title: "Alaska Glacier Cruise", destination: "Alaska, USA", description: "Witness towering glaciers and whales.", priceMMK: 4200000, priceUSD: 2000, duration: "7 Days / 6 Nights", images: ["/images_v2/dest-japan-v2.jpg"] },
  { id: "cr8", title: "Norwegian Fjords Cruise", destination: "Norway", description: "Sail through dramatic fjords.", priceMMK: 3800000, priceUSD: 1810, duration: "7 Days / 6 Nights", images: ["/images_v2/dest-korea-v2.jpg"] },
  { id: "cr9", title: "Greek Isles Cruise", destination: "Greece", description: "Island-hop through Santorini and Mykonos.", priceMMK: 2800000, priceUSD: 1333, duration: "8 Days / 7 Nights", images: ["/images_v2/dest-paris-v2.jpg"] },
  { id: "cr10", title: "Antarctic Expedition", destination: "Antarctica", description: "The ultimate adventure to the last wilderness.", priceMMK: 8500000, priceUSD: 4050, duration: "12 Days / 11 Nights", images: ["/images_v2/hero-cruises-v2.jpg"] },
];



export default async function CruiseDetailPage({ params }: PageProps) {
  const slug = params.slug;
  let cruises = await getAll('cruises') as any[];
  if (cruises.length === 0) cruises = FALLBACK_CRUISES;
  const cruise = cruises.find((c: any) => ((c.title || c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug || c.id === slug || c._id === slug || c.slug === slug)) || null;
  if (!cruise) notFound();

  const name = cruise.title || cruise.name || '';
  const displayImage = (cruise.images && Array.isArray(cruise.images) && cruise.images[0]) || '/images_v2/hero-cruises-v2.jpg';
  const priceMMK = cruise.priceMMK || 0;
  const priceUSD = cruise.priceUSD || 0;
  const dest = cruise.destination || '';
  const duration = cruise.duration || '';
  const description = cruise.description || '';

  const bookNowUrl = '/book-now?type=cruise&name=' + encodeURIComponent(name) + '&id=' + encodeURIComponent(cruise.id || cruise._id || slug) + '&priceMMK=' + priceMMK + '&priceUSD=' + priceUSD + '&destination=' + encodeURIComponent(dest);

  return (
    <main className="min-h-screen bg-white">
      <BackButton bookNowUrl={`/book-now?type=cruise&name=${encodeURIComponent(name)}&id=${encodeURIComponent(cruise.id || cruise._id || slug)}&priceMMK=${priceMMK}&priceUSD=${priceUSD}&destination=${encodeURIComponent(dest)}`} />

      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <Image src={displayImage} alt={name} width={1200} height={630} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_70%)]" />
        <Link href="/cruises" className="absolute top-6 left-4 md:top-8 md:left-8 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all text-sm">
          ← Back to Cruises
        </Link>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold border border-[#D4AF37]/30 backdrop-blur-sm">
                📍 {dest}
              </span>
              {duration && (
                <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 text-white/80 text-xs font-semibold border border-[#D4AF37]/30 backdrop-blur-sm">
                  🛳 {duration}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {name}
            </h1>
            <p className="text-white/60 text-base md:text-lg">{dest}{duration ? ' · ' + duration : ''}</p>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm">
        <Link href="/" className="text-gray-500 hover:text-[#D4AF37]">Home</Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link href="/cruises" className="text-gray-500 hover:text-[#D4AF37]">Cruises</Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-[#0A1628] font-medium">{name}</span>
      </nav>

      <SocialShare url={typeof window !== "undefined" ? window.location.href : ""} title={"A9 Global Travel - Cruises"} />

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
              {duration && (
                <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                  <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[#D4AF37] text-2xl font-bold">{duration}</p>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">Duration</p>
                </div>
              )}
              <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold">{dest}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">Destination</p>
              </div>
            </div>

            {/* Description */}
            {description && (
              <div>
                <h2 className="text-2xl font-bold text-[#0A1628] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Cruise Details
                </h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  {description}
                </p>
              </div>
            )}

            {/* Details Card */}
            <div className="bg-[#0A1628] rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Trip Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dest && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wider">Destination</p>
                      <p className="text-white font-medium">{dest}</p>
                    </div>
                  </div>
                )}
                {duration && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wider">Duration</p>
                      <p className="text-white font-medium">{duration}</p>
                    </div>
                  </div>
                )}
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
              </div>
            </div>
          </div>

          {/* Sidebar — Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-2xl border border-[#D4AF37]/20 bg-gray-50 p-6 space-y-5">
                {/* Price Header */}
                <div className="bg-gradient-to-r from-[#0A1628] to-[#162D50] -mx-6 -mt-6 p-6 rounded-t-2xl text-white">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Cruise Price</p>
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
                    <span className="text-gray-400">Destination</span>
                    <span className="text-[#0A1628] font-medium">{dest}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-[#0A1628] font-medium">{duration}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Price (MMK)</span>
                    <span className="text-[#0A1628] font-medium">Ks {priceMMK.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Price (USD)</span>
                    <span className="text-[#0A1628] font-medium">${priceUSD.toLocaleString()}</span>
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
                href="/cruises"
                className="block w-full py-3 rounded-xl text-center font-semibold text-sm border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A1628] transition-all duration-300"
              >
                ← Back to All Cruises
              </Link>
            </div>
          </div>
        </div>
      </section>

      <RelatedItems section="cruises" excludeSlug={slug} destination={typeof dest === "string" ? dest : ""} />
    </main>
  );
}
