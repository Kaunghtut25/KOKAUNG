'use client';
import { useState, useEffect, useRef } from 'react';

export default function StickyBookingBar({ title, priceMMK, priceUSD }: { title: string; priceMMK: number; priceUSD: number }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setShow(!e.isIntersecting), { threshold: 0 });
    const hero = document.querySelector('section');
    if (hero) obs.observe(hero);
    return () => obs.disconnect();
  }, []);
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0A1628', borderTop: '2px solid #D4AF37', padding: '12px 20px', zIndex: 9000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '100%' }}>
      <div style={{ flex: 1 }}>
        <div style={{ color: 'white', fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        <div style={{ color: '#D4AF37', fontSize: 16, fontWeight: 700 }}>Ks {priceMMK.toLocaleString()} <span style={{ color: '#999', fontSize: 13, fontWeight: 400 }}>/ ${priceUSD}</span></div>
      </div>
      <a href="/book-now" style={{ background: '#D4AF37', color: '#0A1628', padding: '10px 28px', borderRadius: 24, textDecoration: 'none', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>Book Now</a>
    </div>
  );
}
