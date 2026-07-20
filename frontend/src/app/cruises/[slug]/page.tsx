import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAll } from '@/lib/persistentStore';
import SocialShare from '@/components/SocialShare';
import BackButton from '@/components/BackButton';
import RelatedItems from '@/components/RelatedItems';
export const dynamic = 'force-dynamic';

interface PageProps { params: { id: string } }

export default async function CruiseDetailPage({ params }: PageProps) {
  const cruises = await getAll('cruises') as any[];
  const cruise = cruises.find((c: any) => c.id === params.id || c._id === params.id || c.slug === params.id);
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

        <Link href={`/book-now?type=cruise&name=${encodeURIComponent(name)}&id=${encodeURIComponent(cruise.id||cruise._id||params.id)}&priceMMK=${priceMMK}&priceUSD=${priceUSD}&destination=${encodeURIComponent(dest)}`}
          style={{ display: 'block', textAlign: 'center', padding: '16px 0', borderRadius: 14, background: 'linear-gradient(to right, #D4AF37, #F5A623)', color: '#0A1628', fontWeight: 'bold', fontSize: 16, textDecoration: 'none' }}>Book Now</Link>
      </section>
      <RelatedItems section="cruises" />
</main>
  );
}
