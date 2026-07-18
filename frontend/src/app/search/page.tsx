import Link from 'next/link';
import { getAll } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams.q || '').toLowerCase().trim();

  if (!query) {
    return (
      <main style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#0A1628' }}>Search A9 Global Travel</h1>
          <p style={{ color: '#666', marginTop: 8 }}>Use the search bar above to find tours, hotels, cars, visas and more.</p>
        </div>
      </main>
    );
  }

  // Fetch all data
  const [tours, hotels, cars, visas, cruises] = await Promise.all([
    getAll('tours').catch(() => []),
    getAll('hotels').catch(() => []),
    getAll('cars').catch(() => []),
    getAll('visas').catch(() => []),
    getAll('cruises').catch(() => []),
  ]);

  const results: { type: string; title: string; desc: string; href: string }[] = [];

  for (const t of tours as any[]) {
    if ((t.title||'').toLowerCase().includes(query) || (t.destination||'').toLowerCase().includes(query) || (t.description||'').toLowerCase().includes(query)) {
      results.push({ type: 'Tour', title: t.title || '', desc: t.destination || '', href: '/tours/' + (t.slug || t.id || t._id) });
    }
  }
  for (const h of hotels as any[]) {
    if ((h.name||'').toLowerCase().includes(query) || (h.location||'').toLowerCase().includes(query)) {
      results.push({ type: 'Hotel', title: h.name || '', desc: h.location || '', href: '/hotels/' + (h.slug || h.id || h._id) });
    }
  }
  for (const c of cars as any[]) {
    if ((c.carType||'').toLowerCase().includes(query) || (c.name||'').toLowerCase().includes(query)) {
      results.push({ type: 'Car', title: c.carType || c.name || '', desc: c.transmission || '', href: '/cars/' + (c.slug || c.id || c._id) });
    }
  }
  for (const v of visas as any[]) {
    if ((v.country||'').toLowerCase().includes(query)) {
      results.push({ type: 'Visa', title: 'Visa to ' + (v.country || ''), desc: v.processingTime || '', href: '/visas/' + (v._id || v.id) });
    }
  }
  for (const cr of cruises as any[]) {
    if ((cr.title||'').toLowerCase().includes(query) || (cr.destination||'').toLowerCase().includes(query)) {
      results.push({ type: 'Cruise', title: cr.title || '', desc: cr.destination || '', href: '/cruises/' + (cr.slug || cr.id || cr._id) });
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <section style={{ background: '#0A1628', padding: '60px 20px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: 'white' }}>Search Results</h1>
        <p style={{ color: '#D4AF37', fontSize: 16, marginTop: 8 }}>Found {results.length} results for "{query}"</p>
      </section>
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <p style={{ color: '#666', fontSize: 18 }}>No results found. Try a different search term.</p>
            <Link href="/" style={{ display: 'inline-block', marginTop: 16, color: '#D4AF37', textDecoration: 'none' }}>Back to Home</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {results.map((r, i) => (
              <Link key={i} href={r.href} style={{ display: 'block', background: 'white', borderRadius: 12, padding: 20, textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #D4AF37' }}>
                <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 12, background: 'rgba(212,175,55,0.1)', color: '#B8960F', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{r.type}</span>
                <h3 style={{ color: '#0A1628', fontSize: 18, fontWeight: 600, margin: '4px 0' }}>{r.title}</h3>
                <p style={{ color: '#666', fontSize: 14 }}>{r.desc}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
