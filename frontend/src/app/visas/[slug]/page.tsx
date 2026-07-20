import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAll } from '@/lib/persistentStore';
import SocialShare from '@/components/SocialShare';
import RelatedItems from '@/components/RelatedItems';
export const dynamic = 'force-dynamic';

interface PageProps { params: { slug: string } }

export default async function VisaDetailPage({ params }: PageProps) {
  const visas = await getAll('visas') as any[];
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
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-30 flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md hover:shadow-lg hover:bg-white transition-all duration-200 text-gray-700 hover:text-[#D4AF37] text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

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
