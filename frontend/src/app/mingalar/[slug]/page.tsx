import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAll } from '@/lib/persistentStore';
import SocialShare from '@/components/SocialShare';
import BackButton from '@/components/BackButton';
import RelatedItems from '@/components/RelatedItems';
export const dynamic = 'force-dynamic';

interface PageProps { params: { slug: string } }

export default async function MingalarDetailPage({ params }: PageProps) {
  const items = await getAll('mingalar') as any[];
  const item = items.find((m: any) => ((m.title || m.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')) === params.slug || m.id === params.slug || m._id === params.slug);
  if (!item) notFound();

  const title = item.title || item.name || '';
  const displayImage = item.img || item.image || '/images_v2/sky1-v2.jpg';
  const desc = item.desc || item.description || '';

  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Back Button */}
      <BackButton />

      <section style={{ position: 'relative', height: 400, overflow: 'hidden' }}>
        <Image src={displayImage} alt={title} width={1200} height={630} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,22,40,0.9), rgba(10,22,40,0.3))' }} />
        <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', padding: '0 20px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, color: 'white', marginBottom: 8 }}>{item.icon || '✨'} {title}</h1>
          <p style={{ color: '#D4AF37', fontSize: 18 }}>Sky Lounge at Yangon International</p>
        </div>
      </section>

      
        <SocialShare url={typeof window !== "undefined" ? window.location.href : ""} title={"A9 Global Travel - Mingalar"} />
<section style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#0A1628', marginBottom: 12 }}>About This Service</h2>
          <p style={{ color: '#555', lineHeight: 1.8, fontSize: 16 }}>{desc}</p>
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#0A1628', marginBottom: 12 }}>Location and Hours</h2>
          <p style={{ color: '#555' }}>📍 Yangon International Airport, Terminal 1</p>
          <p style={{ color: '#555', marginTop: 8 }}>🕐 Open daily: 6:00 AM — 11:00 PM</p>
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#0A1628', marginBottom: 12 }}>Included</h2>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ color: '#555', padding: '4px 0' }}>✅ Premium buffet and dining</li>
            <li style={{ color: '#555', padding: '4px 0' }}>✅ Complimentary drinks and cocktails</li>
            <li style={{ color: '#555', padding: '4px 0' }}>✅ High-speed WiFi and work stations</li>
            <li style={{ color: '#555', padding: '4px 0' }}>✅ Shower facilities and rest areas</li>
            <li style={{ color: '#555', padding: '4px 0' }}>✅ Flight information displays</li>
          </ul>
        </div>

        <Link href={`/book-now?type=lounge&name=${encodeURIComponent(title)}&id=${encodeURIComponent(item.id||item._id||params.slug)}`}
          style={{ display: 'block', textAlign: 'center', padding: '16px 0', borderRadius: 14, background: 'linear-gradient(to right, #D4AF37, #F5A623)', color: '#0A1628', fontWeight: 'bold', fontSize: 16, textDecoration: 'none' }}>Book Now</Link>
      </section>
      <RelatedItems section="mingalar" />
</main>
  );
}
