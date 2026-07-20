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
  let cruises = await getAll('cruises') as any[];
  if (cruises.length === 0) cruises = FALLBACK_CRUISES;
  const cruise = cruises.find((c: any) => ((c.title || c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')) === params.slug || c.id === params.slug || c._id === params.slug || c.slug === params.slug);
  if (!cruise) notFound();

  const name = cruise.title || cruise.name || '';
  const displayImage = (cruise.images && Array.isArray(cruise.images) && cruise.images[0]) || '/images_v2/hero-cruises-v2.jpg';
  const priceMMK = cruise.priceMMK || 0;
  const priceUSD = cruise.priceUSD || 0;
  const dest = cruise.destination || '';
  const duration = cruise.duration || '';

  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Back Button */}
      <BackButton />

      <section style={{ position: 'relative', height: 400, overflow: 'hidden' }}>
        <Image src={displayImage} alt={name} width={1200} height={630} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,22,40,0.9), rgba(10,22,40,0.3))' }} />
        <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', padding: '0 20px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, color: 'white', marginBottom: 8 }}>{name}</h1>
          <p style={{ color: '#D4AF37', fontSize: 18 }}>{dest}{duration ? ' • ' + duration : ''}</p>
        </div>
      </section>

      
        <SocialShare url={typeof window !== "undefined" ? window.location.href : ""} title={"A9 Global Travel - Cruises"} />
<section style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div><div style={{ color: '#0A1628', fontSize: 24, fontWeight: 'bold' }}>Ks {priceMMK.toLocaleString()}</div><div style={{ color: '#D4AF37', fontSize: 16 }}>${priceUSD}</div></div>
          {duration && <span style={{ padding: '8px 16px', borderRadius: 20, background: 'rgba(212,175,55,0.15)', color: '#B8960F', fontSize: 14 }}>🛳 {duration}</span>}
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#0A1628', marginBottom: 12 }}>Cruise Details</h2>
          {cruise.description && <p style={{ color: '#555', lineHeight: 1.8, marginBottom: 16 }}>{cruise.description}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {dest && <p style={{ color: '#555' }}>📍 <strong>{dest}</strong></p>}
            {duration && <p style={{ color: '#555' }}>📅 <strong>{duration}</strong></p>}
          </div>
        </div>

        <Link href={`/book-now?type=cruise&name=${encodeURIComponent(name)}&id=${encodeURIComponent(cruise.id||cruise._id||params.slug)}&priceMMK=${priceMMK}&priceUSD=${priceUSD}&destination=${encodeURIComponent(dest)}`}
          style={{ display: 'block', textAlign: 'center', padding: '16px 0', borderRadius: 14, background: 'linear-gradient(to right, #D4AF37, #F5A623)', color: '#0A1628', fontWeight: 'bold', fontSize: 16, textDecoration: 'none' }}>Book Now</Link>
      </section>
      <RelatedItems section="cruises" />
</main>
  );
}
