'use client';
import { useState, useEffect } from 'react';

export default function RelatedItems({ section, excludeSlug }: { section: string; excludeSlug?: string }) {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch(`/api/${section}`).then(r => r.json()).then(data => {
      const arr = Array.isArray(data) ? data : (data.items || data.data || []);
      setItems(arr.filter((x: any) => x.slug !== excludeSlug).slice(0, 6));
    }).catch(() => setItems([]));
  }, [section, excludeSlug]);
  if (!items.length) return null;
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: '#0A1628', marginBottom: 16 }}>You May Also Like</h2>
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
        {items.map((item, i) => (
          <a key={i} href={`/${section}/${item.slug}`} style={{ minWidth: 200, maxWidth: 200, textDecoration: 'none' }}>
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #eee' }}>
              <img src={item.image || item.displayImage || `/images_v2/hero-${section}-v2.jpg`} alt={item.name || item.title} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
              <div style={{ padding: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0A1628', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name || item.title || item.country}</div>
                <div style={{ fontSize: 12, color: '#D4AF37', fontWeight: 600, marginTop: 4 }}>{item.priceMMK ? 'Ks ' + item.priceMMK.toLocaleString() : item.priceUSD ? '$' + item.priceUSD : ''}</div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
