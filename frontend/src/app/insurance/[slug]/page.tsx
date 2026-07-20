import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAll } from '@/lib/persistentStore';
import SocialShare from '@/components/SocialShare';
import BackButton from '@/components/BackButton';
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
  let plans = await getAll('insurances') as any[];
  if (plans.length === 0) plans = FALLBACK_PLANS;
  const plan = plans.find((p: any) => ((p.planName || p.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')) === params.slug || p.id === params.slug || p._id === params.slug);
  if (!plan) notFound();

  const name = plan.planName || plan.title || '';
  const displayImage = (plan.images && Array.isArray(plan.images) && plan.images[0]) || plan.image || '/images_v2/ins1-v2.jpg';
  const priceMMK = plan.priceMMK || 0;
  const priceUSD = plan.priceUSD || 0;
  const coverage = plan.coverage || '';
  const benefits: string[] = Array.isArray(plan.benefits) ? plan.benefits : (typeof plan.benefits === 'string' ? plan.benefits.split(',') : []);
  const duration = plan.duration || 'Per Trip';

  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Back Button */}
      <BackButton />

      <section style={{ position: 'relative', height: 400, overflow: 'hidden' }}>
        <Image src={displayImage} alt={name} width={1200} height={630} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,22,40,0.9), rgba(10,22,40,0.3))' }} />
        <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', padding: '0 20px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, color: 'white', marginBottom: 8 }}>{name}</h1>
          <p style={{ color: '#D4AF37', fontSize: 18 }}>{duration}</p>
        </div>
      </section>

      
        <SocialShare url={typeof window !== "undefined" ? window.location.href : ""} title={"A9 Global Travel - Insurance"} />
<section style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div><div style={{ color: '#0A1628', fontSize: 24, fontWeight: 'bold' }}>Ks {priceMMK.toLocaleString()}</div><div style={{ color: '#D4AF37', fontSize: 16 }}>${priceUSD}</div></div>
          <span style={{ padding: '8px 16px', borderRadius: 20, background: '#0A1628', color: '#D4AF37', fontSize: 14, fontWeight: 600 }}>{duration}</span>
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#0A1628', marginBottom: 12 }}>Coverage</h2>
          <p style={{ color: '#555', fontSize: 16, lineHeight: 1.8 }}>{coverage}</p>
        </div>

        {benefits.length > 0 && (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#0A1628', marginBottom: 12 }}>Included</h2>
            <ul style={{ paddingLeft: 20 }}>{benefits.map((b: string, i: number) => <li key={i} style={{ color: '#555', padding: '6px 0', borderBottom: '1px solid #eee' }}>✅ {b}</li>)}</ul>
          </div>
        )}

        <Link href={`/book-now?type=insurance&plan=${encodeURIComponent(name)}&id=${encodeURIComponent(plan.id||plan._id||params.slug)}&priceMMK=${priceMMK}&priceUSD=${priceUSD}`}
          style={{ display: 'block', textAlign: 'center', padding: '16px 0', borderRadius: 14, background: 'linear-gradient(to right, #D4AF37, #F5A623)', color: '#0A1628', fontWeight: 'bold', fontSize: 16, textDecoration: 'none' }}>Book Now</Link>
      </section>
      <RelatedItems section="insurance" />
</main>
  );
}
