'use client';
import { useState, useEffect } from 'react';
import { getAll } from '@/lib/persistentStore';
import ScrollingRow from './ScrollingRow';

interface RelatedSection {
  key: string;
  label: string;
  apiPath: string;
  linkPrefix: string;
  nameField: string;
  imageField: string;
  priceField: string;
  matchField: string;
}

const CROSS_SECTIONS: RelatedSection[] = [
  { key: 'tours', label: 'Tours', apiPath: '/api/tours', linkPrefix: '/tours', nameField: 'title', imageField: 'displayImage', priceField: 'priceMMK', matchField: 'destination' },
  { key: 'hotels', label: 'Hotels', apiPath: '/api/hotels', linkPrefix: '/hotels', nameField: 'name', imageField: 'image', priceField: 'pricePerNightMMK', matchField: 'location' },
  { key: 'cars', label: 'Cars', apiPath: '/api/cars', linkPrefix: '/cars', nameField: 'carType', imageField: 'image', priceField: 'priceMMK', matchField: 'location' },
  { key: 'visas', label: 'Visas', apiPath: '/api/visas', linkPrefix: '/visas', nameField: 'country', imageField: 'image', priceField: 'visaFeeMMK', matchField: 'country' },
  { key: 'cruises', label: 'Cruises', apiPath: '/api/cruises', linkPrefix: '/cruises', nameField: 'name', imageField: 'image', priceField: 'priceMMK', matchField: 'destination' },
  { key: 'insurance', label: 'Insurance', apiPath: '/api/insurance', linkPrefix: '/insurance', nameField: 'planName', imageField: 'image', priceField: 'priceMMK', matchField: 'destination' },
  { key: 'mingalar', label: 'Sky Lounge', apiPath: '/api/mingalar', linkPrefix: '/mingalar', nameField: 'title', imageField: 'image', priceField: 'priceMMK', matchField: 'location' },
];

function slugify(v: any): string {
  return String(v || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function matchesDestination(item: any, matchField: string, destination: string, country: string): boolean {
  if (!destination && !country) return false;
  const val = (item?.[matchField] || '').toLowerCase();
  const dest = (destination || '').toLowerCase();
  const ctry = (country || '').toLowerCase();
  return (dest && val.includes(dest)) || (ctry && val.includes(ctry));
}

const RELATED_CARD_WIDTH = 200;
const RELATED_CONTAINER_WIDTH = 4 * (RELATED_CARD_WIDTH + 16) + 4;

export default function RelatedItems({ section, excludeSlug, destination, country }: { section: string; excludeSlug?: string; destination?: string; country?: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [crossItems, setCrossItems] = useState<{section: RelatedSection; items: any[]}[]>([]);

  // Same-section
  useEffect(() => {
    const fetchSame = async () => {
      try {
        // Read site config for maxItems
        let maxItems = 6;
        try {
          const cfgs = await getAll("site-config" as any);
          const cfg = cfgs?.[0] || {};
          maxItems = cfg.relatedItems?.maxItems ?? 6;
        } catch {}

        const r = await fetch(`/api/${section}`);
        const data = await r.json();
        const arr = Array.isArray(data) ? data : (data.items || data.data || []);
        const filtered = arr.filter((x: any) => x?.slug !== excludeSlug).slice(0, maxItems);
        setItems(filtered);
      } catch { setItems([]); }
    };
    fetchSame();
  }, [section, excludeSlug]);

  // Cross-section
  useEffect(() => {
    if (!destination && !country) return;
    const fetchCross = async () => {
      // Read site config for cross-section settings
      let crossConfig: Record<string, { enabled: boolean; maxItems: number }> = {};
      try {
        const cfgs = await getAll("site-config" as any);
        const cfg = cfgs?.[0] || {};
        crossConfig = cfg.relatedItems?.crossSections || {};
      } catch {}

      const results: {section: RelatedSection; items: any[]}[] = [];
      for (const s of CROSS_SECTIONS) {
        if (s.key === section) continue;
        const sc = crossConfig[s.key] || { enabled: true, maxItems: 4 };
        if (sc.enabled === false) continue;
        const sliceCount = sc.maxItems || 4;
        try {
          const res = await fetch(s.apiPath);
          const data = await res.json();
          const arr = Array.isArray(data) ? data : (data.items || data.data || []);
          const matched = arr.filter((x: any) => matchesDestination(x, s.matchField, destination || '', country || '')).slice(0, sliceCount);
          if (matched.length > 0) {
            results.push({ section: s, items: matched });
          }
        } catch(e) {}
      }
      setCrossItems(results);
    };
    fetchCross();
  }, [section, destination, country]);

  if (!items?.length && !crossItems.length) return null;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      {/* Same-section "You May Also Like" */}
      {items.length > 0 && (
        <>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: '#0A1628', marginBottom: 16 }}>You May Also Like</h2>
          <ScrollingRow containerWidth={RELATED_CONTAINER_WIDTH}>
            {(items ?? []).map((item, i) => (
              <a key={i} href={`/${section}/${item.slug || slugify(item.name || item.title || item.planName) || item._id || item.id}`} className="flex-shrink-0 snap-start" style={{ width: RELATED_CARD_WIDTH, textDecoration: 'none' }}>
                <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #eee' }}>
                  <img src={item.image || item.displayImage || (Array.isArray(item.images) ? item.images[0] : (typeof item.images === "string" ? item.images : "")) || `/images_v2/hero-${section}-v2.jpg`} alt={item.name || item.title} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                  <div style={{ padding: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0A1628', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name || item.title || item.planName || item.carType || item.country}</div>
                    <div style={{ fontSize: 12, color: '#D4AF37', fontWeight: 600, marginTop: 4 }}>{item.priceMMK ? 'Ks ' + item.priceMMK.toLocaleString() : item.priceUSD ? '$' + item.priceUSD : item.pricePerNightMMK ? 'Ks ' + item.pricePerNightMMK.toLocaleString() + '/night' : item.pricePerNightUSD ? '$' + item.pricePerNightUSD + '/night' : item.visaFeeMMK ? 'Ks ' + item.visaFeeMMK.toLocaleString() : ''}</div>
                  </div>
                </div>
              </a>
            ))}
          </ScrollingRow>
        </>
      )}

      {/* Cross-section "Explore in [Destination]" */}
      {crossItems.map(({ section: s, items: sItems }) => (
        <div key={s.key} style={{ marginTop: 32 }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#D4AF37', marginBottom: 12 }}>
            {s.label} {destination ? `in ${destination}` : country ? `for ${country}` : ''}
          </h3>
          <ScrollingRow containerWidth={RELATED_CONTAINER_WIDTH}>
            {sItems.map((item, i) => (
              <a key={i} href={`${s.linkPrefix}/${item.slug || slugify(item[s.nameField] || item.name || item.title || item.planName) || item._id || item.id}`} className="flex-shrink-0 snap-start" style={{ width: 180, textDecoration: 'none' }}>
                <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #eee', background: 'white' }}>
                  <img src={item[s.imageField] || item.image || item.displayImage || (Array.isArray(item.images) ? item.images[0] : (typeof item.images === "string" ? item.images : "")) || `/images_v2/hero-${s.key}-v2.jpg`} alt={item[s.nameField] || ''} style={{ width: '100%', height: 110, objectFit: 'cover' }} />
                  <div style={{ padding: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#0A1628', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item[s.nameField] || item.name || item.title || item.planName || item.carType || ''}</div>
                    <div style={{ fontSize: 11, color: '#D4AF37', fontWeight: 600, marginTop: 4 }}>{item[s.priceField] ? (s.key === 'hotels' ? 'Ks ' + (item[s.priceField] || 0).toLocaleString() + '/night' : 'Ks ' + (item[s.priceField] || 0).toLocaleString()) : ''}</div>
                  </div>
                </div>
              </a>
            ))}
          </ScrollingRow>
        </div>
      ))}
    </div>
  );
}
