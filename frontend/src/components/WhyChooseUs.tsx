'use client';
import { useState, useEffect } from 'react';

const FALLBACK_FEATURES = [
  { icon: '🕐', title: '24/7 Customer Support', desc: 'Round-the-clock assistance whenever you need it' },
  { icon: '✈️', title: 'IATA Certified', desc: 'Official accreditation since 2015' },
  { icon: '💰', title: 'Best Price Guarantee', desc: 'Unbeatable rates across all services' },
  { icon: '🏛️', title: 'Local Expertise', desc: '10+ years in Myanmar travel industry' },
  { icon: '🛡️', title: 'Travel Insurance', desc: 'Comprehensive coverage for peace of mind' },
  { icon: '⭐', title: '5000+ Happy Travelers', desc: '98% customer satisfaction rate' },
];

export default function WhyChooseUs() {
  const [features, setFeatures] = useState<{ icon: string; title: string; desc: string }[]>(FALLBACK_FEATURES);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then(r => r.json())
      .then(config => {
        if (config?.whyChooseCards?.length > 0) {
          setFeatures(config.whyChooseCards.map((c: any) => ({
            icon: c.icon || '⭐',
            title: c.title || '',
            desc: c.description || '',
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <h2 style={{ textAlign: 'center', fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#0A1628', marginBottom: 8 }}>Why Choose A9 Global Travel?</h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: 15, marginBottom: 32 }}>Your trusted travel partner in Myanmar since 2015</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
        {features.map(f => (
          <div key={f.title} style={{ background: 'white', borderRadius: 12, padding: 24, textAlign: 'center', border: '1px solid #eee', transition: 'all 0.3s', cursor: 'default' }}
            onMouseEnter={(e: any)=>{e.currentTarget.style.borderColor='#D4AF37';e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';}}
            onMouseLeave={(e: any)=>{e.currentTarget.style.borderColor='#eee';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
            <h3 style={{ fontSize: 16, color: '#0A1628', fontWeight: 600, marginBottom: 6 }}>{f.title}</h3>
            <p style={{ fontSize: 13, color: '#666' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
