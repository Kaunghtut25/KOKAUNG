import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAll } from '@/lib/persistentStore';
import SocialShare from '@/components/SocialShare';
import BackButton from '@/components/BackButton';
import RelatedItems from '@/components/RelatedItems';
export const dynamic = 'force-dynamic';

const FALLBACK_ITEMS = [
  { id: 'm1', _id: 'm1', title: 'Fine Dining', img: '/images_v2/sky1-v3.jpg', icon: '🍽️', desc: 'Premium buffet & a la carte menu' },
  { id: 'm2', _id: 'm2', title: 'Open Bar', img: '/images_v2/sky2-v3.jpg', icon: '🍸', desc: 'Complimentary drinks & cocktails' },
  { id: 'm3', _id: 'm3', title: 'Workspace', img: '/images_v2/sky3-v3.jpg', icon: '💻', desc: 'High-speed WiFi & work stations' },
  { id: 'm4', _id: 'm4', title: 'Shower Suites', img: '/images_v2/sky1-v3.jpg', icon: '🚿', desc: 'Refresh before your flight' },
  { id: 'm5', _id: 'm5', title: 'Nap Pods', img: '/images_v2/sky2-v3.jpg', icon: '😴', desc: 'Rest in private sleeping pods' },
  { id: 'm6', _id: 'm6', title: 'Concierge', img: '/images_v2/sky3-v3.jpg', icon: '🛎️', desc: 'Priority check-in & boarding' },
  { id: 'm7', _id: 'm7', title: 'Spa & Wellness', img: '/images_v2/sky1-v3.jpg', icon: '💆', desc: 'Relaxing spa treatments and massage services' },
];

const FALLBACK_SLUG_MAP: Record<string, number> = {
  'fine-dining': 0, 'open-bar': 1, 'workspace': 2, 'shower-suites': 3, 'nap-pods': 4, 'concierge': 5,
  'spa-wellness': 6,
};

interface PageProps { params: Promise<{ slug: string }> }

async function getItemBySlug(slug: string) {
  const items = await getAll('mingalar') as any[];
  let item = items.find((m: any) => ((m.title || m.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug || m.id === slug || m._id === slug));
  if (!item) {
    const slugLower = slug.toLowerCase();
    if (FALLBACK_SLUG_MAP[slugLower] !== undefined) {
      item = FALLBACK_ITEMS[FALLBACK_SLUG_MAP[slugLower]];
    } else if (/^m\d+$/.test(slugLower)) {
      const idx = parseInt(slugLower.substring(1), 10) - 1;
      if (idx >= 0 && idx < FALLBACK_ITEMS.length) item = FALLBACK_ITEMS[idx];
    }
    if (!item) {
      item = FALLBACK_ITEMS.find((f: any) => f.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slugLower);
    }
  }
  return item || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) return { title: 'Service Not Found' };
  const title = (item.title || item.name || '') + ' - A9 Global Travel';
  const description = item.desc || item.description || 'Sky Lounge service at Yangon International Airport.';
  const imageUrl = item.img || item.image || '/images_v2/sky1-v2.jpg';
  return {
    title,
    description: description.substring(0, 160),
    openGraph: {
      title,
      description: description.substring(0, 160),
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: 'website',
    },
  };
}

export default async function MingalarDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) notFound();

  const title = item.title || item.name || '';
  const displayImage = item.img || item.image || '/images_v2/sky1-v2.jpg';
  const desc = item.desc || item.description || '';
  const icon = item.icon || '✨';

  const bookNowUrl = '/book-now?type=lounge&name=' + encodeURIComponent(title) + '&id=' + encodeURIComponent(item.id || item._id || slug);

  return (
    <main className="min-h-screen bg-white">
      {/* Back Button */}
      <BackButton bookNowUrl={`/book-now?type=mingalar&name=${encodeURIComponent(title || slug)}&id=${encodeURIComponent(item.id || item._id || slug)}&destination=${encodeURIComponent(title || slug)}`} />

      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <Image src={displayImage} alt={title} width={1200} height={630} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_70%)]" />
        <Link href="/mingalar" className="absolute top-6 left-4 md:top-8 md:left-8 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all text-sm">
          ← Back to Sky Lounge
        </Link>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold border border-[#D4AF37]/30 backdrop-blur-sm">
                ✨ Sky Lounge
              </span>
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 text-white/80 text-xs font-semibold border border-[#D4AF37]/30 backdrop-blur-sm">
                🕐 6 AM – 11 PM
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {icon} {title}
            </h1>
            <p className="text-white/60 text-base md:text-lg">Sky Lounge at Yangon International Airport</p>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm">
        <Link href="/" className="text-gray-500 hover:text-[#D4AF37]">Home</Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link href="/mingalar" className="text-gray-500 hover:text-[#D4AF37]">Sky Lounge</Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-[#0A1628] font-medium">{title}</span>
      </nav>

      <SocialShare url={typeof window !== "undefined" ? window.location.href : ""} title={"A9 Global Travel - Mingalar"} />

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* About */}
            <div>
              <h2 className="text-2xl font-bold text-[#0A1628] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                About This Service
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">
                {desc || 'Enjoy premium lounge services at Yangon International Airport.'}
              </p>
            </div>

            {/* Location & Hours */}
            <div className="bg-[#0A1628] rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Location & Hours
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">Location</p>
                    <p className="text-white font-medium">Yangon International Airport, Terminal 1</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">Hours</p>
                    <p className="text-white font-medium">Daily: 6:00 AM – 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Included Amenities */}
            <div>
              <h2 className="text-2xl font-bold text-[#0A1628] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Included Amenities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Premium buffet and dining',
                  'Complimentary drinks and cocktails',
                  'High-speed WiFi and work stations',
                  'Shower facilities and rest areas',
                  'Flight information displays',
                ].map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/15 text-[#0A1628] text-sm font-medium hover:bg-[#D4AF37]/10 transition-colors">
                    <svg className="w-4 h-4 text-[#D4AF37] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar — Info Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-2xl border border-[#D4AF37]/20 bg-gray-50 p-6 space-y-5">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0A1628] to-[#162D50] -mx-6 -mt-6 p-6 rounded-t-2xl text-white">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Sky Lounge</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {icon}
                    </span>
                  </div>
                  <p className="text-white/50 text-sm mt-1">
                    {title}
                  </p>
                </div>

                {/* Info Rows */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Service</span>
                    <span className="text-[#0A1628] font-medium">{title}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Location</span>
                    <span className="text-[#0A1628] font-medium">Yangon Airport T1</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Hours</span>
                    <span className="text-[#0A1628] font-medium">6 AM – 11 PM</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Amenities</span>
                    <span className="text-[#0A1628] font-medium">5 included</span>
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
                href="/mingalar"
                className="block w-full py-3 rounded-xl text-center font-semibold text-sm border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A1628] transition-all duration-300"
              >
                ← Back to Sky Lounge
              </Link>
            </div>
          </div>
        </div>
      </section>

      <RelatedItems section="mingalar" excludeSlug={slug} />
    </main>
  );
}
