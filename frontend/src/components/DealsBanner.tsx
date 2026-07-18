'use client';
import { useState, useEffect } from 'react';

export default function DealsBanner() {
  const [time, setTime] = useState({ d:0, h:0, m:0, s:0 });
  useEffect(() => {
    const target = Date.now() + 30*24*60*60*1000;
    const t = setInterval(() => {
      const diff = target - Date.now();
      setTime({
        d: Math.floor(diff/86400000), h: Math.floor(diff/3600000)%24,
        m: Math.floor(diff/60000)%60, s: Math.floor(diff/1000)%60,
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ background: 'linear-gradient(135deg,#0A1628,#0F2035)', borderBottom: '3px solid #D4AF37', padding: '24px 20px', textAlign: 'center' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <span style={{ color: '#D4AF37', fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>⏰ LIMITED TIME OFFER</span>
        <h2 style={{ color: 'white', fontSize: 24, fontWeight: 700, margin: '8px 0' }}>30% OFF Bagan Explorer Tour</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '12px 0' }}>
          {[{l:'Days',v:time.d},{l:'Hours',v:time.h},{l:'Mins',v:time.m},{l:'Secs',v:time.s}].map(t => (
            <div key={t.l} style={{ background: 'rgba(212,175,55,0.15)', borderRadius: 8, padding: '8px 12px', minWidth: 60 }}>
              <div style={{ color: '#D4AF37', fontSize: 22, fontWeight: 700 }}>{String(t.v).padStart(2,'0')}</div>
              <div style={{ color: '#999', fontSize: 10 }}>{t.l}</div>
            </div>
          ))}
        </div>
        <a href="/book-now" style={{ display:'inline-block', background:'#D4AF37', color:'#0A1628', padding:'10px 28px', borderRadius:24, textDecoration:'none', fontWeight:700, fontSize:14 }}>Book Now</a>
      </div>
    </div>
  );
}
