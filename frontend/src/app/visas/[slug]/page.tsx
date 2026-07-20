import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAll } from '@/lib/persistentStore';
import SocialShare from '@/components/SocialShare';
import RelatedItems from '@/components/RelatedItems';
import BackButton from '@/components/BackButton';
export const dynamic = 'force-dynamic';

interface PageProps { params: { slug: string } }

const FALLBACK_VISAS = [
  { _id: 'v1', country: 'Thailand', processingTime: '3-5 Days', visaFeeMMK: 85000, visaFeeUSD: 40, requirements: ['Passport 6m','2 Photos'] },
  { _id: 'v2', country: 'Singapore', processingTime: '5-7 Days', visaFeeMMK: 120000, visaFeeUSD: 57, requirements: ['Passport 6m','Bank Statement'] },
  { _id: 'v3', country: 'Vietnam', processingTime: '3-5 Days', visaFeeMMK: 95000, visaFeeUSD: 45, requirements: ['Passport 6m','Flight Booking'] },
  { _id: 'v4', country: 'China', processingTime: '5-7 Days', visaFeeMMK: 150000, visaFeeUSD: 71, requirements: ['Passport 6m','Hotel Reservation'] },
  { _id: 'v5', country: 'Malaysia', processingTime: '3-5 Days', visaFeeMMK: 75000, visaFeeUSD: 36, requirements: ['Passport 6m','Photos'] },
  { _id: 'v6', country: 'Japan', processingTime: '5-7 Days', visaFeeMMK: 130000, visaFeeUSD: 62, requirements: ['Passport 6m','Employment Letter'] },
  { _id: 'v7', country: 'South Korea', processingTime: '5-7 Days', visaFeeMMK: 115000, visaFeeUSD: 55, requirements: ['Passport 6m','Bank Statement'] },
  { _id: 'v8', country: 'India', processingTime: '5-7 Days', visaFeeMMK: 110000, visaFeeUSD: 52, requirements: ['Passport 6m','eVisa'] },
  { _id: 'v9', country: 'Cambodia', processingTime: '2-3 Days', visaFeeMMK: 65000, visaFeeUSD: 31, requirements: ['Passport 6m','Flight'] },
  { _id: 'v10', country: 'Indonesia', processingTime: '3-5 Days', visaFeeMMK: 80000, visaFeeUSD: 38, requirements: ['Passport 6m','Bank Statement'] },
  { _id: 'v11', country: 'Myanmar', processingTime: '3-5 Days', visaFeeMMK: 90000, visaFeeUSD: 43, requirements: ['Passport 6m','Hotel'] },
  { _id: 'v12', country: 'Australia', processingTime: '10-15 Days', visaFeeMMK: 280000, visaFeeUSD: 133, requirements: ['Passport 6m','Bank 6m'] },
  { _id: 'v13', country: 'UK', processingTime: '10-15 Days', visaFeeMMK: 320000, visaFeeUSD: 152, requirements: ['Passport 6m','Bank 6m'] },
  { _id: 'v14', country: 'Hong Kong', processingTime: '3-5 Days', visaFeeMMK: 85000, visaFeeUSD: 40, requirements: ['Passport 6m','Hotel'] },
  { _id: 'v15', country: 'Maldives', processingTime: '2-3 Days', visaFeeMMK: 70000, visaFeeUSD: 33, requirements: ['Passport 6m','Hotel'] },
  { _id: 'v16', country: 'Sri Lanka', processingTime: '3-5 Days', visaFeeMMK: 95000, visaFeeUSD: 45, requirements: ['Passport 6m','Bank'] },
  { _id: 'v17', country: 'Nepal', processingTime: '3-5 Days', visaFeeMMK: 75000, visaFeeUSD: 36, requirements: ['Passport 6m','Flight'] },
  { _id: 'v18', country: 'Laos', processingTime: '2-3 Days', visaFeeMMK: 60000, visaFeeUSD: 29, requirements: ['Passport 6m','Flight'] },
  { _id: 'v19', country: 'Brunei', processingTime: '5-7 Days', visaFeeMMK: 100000, visaFeeUSD: 48, requirements: ['Passport 6m','Bank'] },
  { _id: 'v20', country: 'Philippines', processingTime: '5-7 Days', visaFeeMMK: 90000, visaFeeUSD: 43, requirements: ['Passport 6m','Photos'] },
  { _id: 'v21', country: 'Taiwan', processingTime: '5-7 Days', visaFeeMMK: 105000, visaFeeUSD: 50, requirements: ['Passport 6m','Employment'] },
  { _id: 'v22', country: 'Macau', processingTime: '3-5 Days', visaFeeMMK: 80000, visaFeeUSD: 38, requirements: ['Passport 6m','Flight'] },
  { _id: 'v23', country: 'UAE', processingTime: '3-5 Days', visaFeeMMK: 140000, visaFeeUSD: 67, requirements: ['Passport 6m','Bank Statement'] },
];

export default async function VisaDetailPage({ params }: PageProps) {
  let visas = await getAll('visas') as any[];
  if (visas.length === 0) visas = FALLBACK_VISAS;
  const visa = visas.find((v: any) => ((v.country || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')) === params.slug || v.id === params.slug || v._id === params.slug);
  if (!visa) notFound();

  const country = visa.country || visa.title || '';
  const displayImage = (visa.images && Array.isArray(visa.images) && visa.images[0]) || '/images_v2/visa1-v2.jpg';
  const feeMMK = visa.visaFeeMMK || visa.priceMMK || 0;
  const feeUSD = visa.visaFeeUSD || visa.priceUSD || 0;
  const processing = visa.processingTime || '3-5 Business Days';
  const requirements = visa.requirements || [];

  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Back Button */}
      <BackButton />

      <section style={{ position: 'relative', height: 400, overflow: 'hidden' }}>
        <Image src={displayImage} alt={country} width={1200} height={630} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,22,40,0.9), rgba(10,22,40,0.3))' }} />
        <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', padding: '0 20px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, color: 'white', marginBottom: 8 }}>Visa to {country}</h1>
          <p style={{ color: '#D4AF37', fontSize: 18 }}>Visa Processing Service</p>
        </div>
      </section>

      
        <SocialShare url={typeof window !== "undefined" ? window.location.href : ""} title={"A9 Global Travel - Visas"} />
<section style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        {/* Price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ color: '#0A1628', fontSize: 24, fontWeight: 'bold' }}>Ks {feeMMK.toLocaleString()}</div>
            <div style={{ color: '#D4AF37', fontSize: 16 }}>${feeUSD}</div>
          </div>
          <span style={{ padding: '8px 16px', borderRadius: 20, background: 'rgba(212,175,55,0.15)', color: '#B8960F', fontSize: 14, fontWeight: 600 }}>
            ⏱ {processing}
          </span>
        </div>

        {/* Processing Time */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#0A1628', marginBottom: 12 }}>Processing Time</h2>
          <p style={{ color: '#555', fontSize: 18 }}>Estimated processing: <strong>{processing}</strong></p>
          <p style={{ color: '#888', marginTop: 8, fontSize: 14 }}>Processing time may vary depending on embassy workload and document completeness.</p>
        </div>

        {/* Requirements */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#0A1628', marginBottom: 12 }}>Required Documents</h2>
          <ul style={{ paddingLeft: 20 }}>
            {(Array.isArray(requirements) ? requirements : [requirements]).map((req: string, i: number) => (
              <li key={i} style={{ color: '#555', padding: '6px 0', borderBottom: '1px solid #eee' }}>📋 {req}</li>
            ))}
          </ul>
        </div>

        {/* Description if available */}
        {visa.description && (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#0A1628', marginBottom: 12 }}>About This Visa</h2>
            <p style={{ color: '#555', lineHeight: 1.8 }}>{visa.description}</p>
          </div>
        )}

        <Link href={`/book-now?type=visa&country=${encodeURIComponent(country)}&id=${encodeURIComponent(visa.id||visa._id||params.slug)}&feeMMK=${feeMMK}&feeUSD=${feeUSD}&processingTime=${encodeURIComponent(processing)}`}
          style={{ display: 'block', textAlign: 'center', padding: '16px 0', borderRadius: 14, background: 'linear-gradient(to right, #D4AF37, #F5A623)', color: '#0A1628', fontWeight: 'bold', fontSize: 16, textDecoration: 'none' }}>
          Book Now
        </Link>
      </section>
      <RelatedItems section="visas" />
</main>
  );
}
