'use client';
import { useState, useEffect } from 'react';

// v79: fully configurable — title, tagline, card width, and card images come from site-config
const DEFAULT_WHY = {
  title: 'Why Choose A9 Global Travel?',
  tagline: 'Your trusted travel partner in Myanmar since 2015',
  cardWidth: 280,
};

const FALLBACK_FEATURES = [
  { icon: '🕐', title: '24/7 Customer Support', desc: 'Round-the-clock assistance whenever you need it', image: '' },
  { icon: '✈️', title: 'IATA Certified', desc: 'Official accreditation since 2015', image: '' },
  { icon: '💰', title: 'Best Price Guarantee', desc: 'Unbeatable rates across all services', image: '' },
  { icon: '🏛️', title: 'Local Expertise', desc: '10+ years in Myanmar travel industry', image: '' },
  { icon: '🛡️', title: 'Travel Insurance', desc: 'Comprehensive coverage for peace of mind', image: '' },
  { icon: '⭐', title: '5000+ Happy Travelers', desc: '98% customer satisfaction rate', image: '' },
];

export default function WhyChooseUs() {
  const [features, setFeatures] = useState<{ icon: string; title: string; desc: string; image: string }[]>(FALLBACK_FEATURES);
  const [title, setTitle] = useState(DEFAULT_WHY.title);
  const [tagline, setTagline] = useState(DEFAULT_WHY.tagline);
  const [cardWidth, setCardWidth] = useState(DEFAULT_WHY.cardWidth);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then(r => r.json())
      .then(config => {
        if (config?.whyChooseCards?.length > 0) {
          setFeatures(config.whyChooseCards.map((c: any) => ({
            icon: c.icon || '⭐',
            title: c.title || '',
            desc: c.description || '',
            image: c.image || '',
          })));
        }
        if (config?.whyChooseTitle) setTitle(config.whyChooseTitle);
        if (config?.whyChooseTagline) setTagline(config.whyChooseTagline);
        if (config?.whyChooseCardWidth) setCardWidth(Number(config.whyChooseCardWidth) || DEFAULT_WHY.cardWidth);
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      <h2 style={{ textAlign: 'center', fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#0A1628', marginBottom: 8 }}>{title}</h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: 15, marginBottom: 32 }}>{tagline}</p>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(${cardWidth}px,1fr))`, gap: 20 }}>
        {features.map(f => (
          <div key={f.title} style={{ background: 'white', borderRadius: 12, padding: 24, textAlign: 'center', border: '1px solid #eee', transition: 'all 0.3s', cursor: 'default' }}
            onMouseEnter={(e: any)=>{e.currentTarget.style.borderColor='#D4AF37';e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';}}
            onMouseLeave={(e: any)=>{e.currentTarget.style.borderColor='#eee';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
            {f.image ? (
              <div style={{ width: 72, height: 72, margin: '0 auto 12px', borderRadius: '50%', overflow: 'hidden', background: '#FFFDF5', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={f.image} alt={f.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
            ) : (
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
            )}
            <h3 style={{ fontSize: 16, color: '#0A1628', fontWeight: 600, marginBottom: 6 }}>{f.title}</h3>
            <p style={{ fontSize: 13, color: '#666' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
