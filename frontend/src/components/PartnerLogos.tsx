'use client';
import { useState, useEffect } from 'react';

const FALLBACK_PARTNERS = [
  'Shangri-La', 'Sedona Hotel', 'Sule Palace', 'Melia Hotel',
  'Myanmar Airways', 'Thai Airways', 'Singapore Airlines', 'Emirates',
  'AIA Insurance', 'CB Insurance', 'Great Eastern',
  'Myanmar Tourism Federation', 'ASEAN Tourism',
];

export default function PartnerLogos() {
  const [partners, setPartners] = useState<string[]>(FALLBACK_PARTNERS);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then(r => r.json())
      .then(config => {
        if (config?.partners?.length > 0) {
          setPartners(config.partners);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ background: '#f8f9fa', padding: '32px 20px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: '#0A1628', marginBottom: 24 }}>Our Trusted Partners</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
          {partners.map(p => (
            <div key={p} style={{ padding: '8px 18px', borderRadius: 20, border: '1px solid #D4AF37', background: 'white', fontSize: 13, color: '#0A1628', fontWeight: 500 }}>{p}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
