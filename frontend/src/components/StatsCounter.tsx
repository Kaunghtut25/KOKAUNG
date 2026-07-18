'use client';
import { useState, useEffect, useRef } from 'react';

function Counter({ target, label, suffix = '+' }: { target: number; label: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 2000; const start = Date.now();
        const t = setInterval(() => {
          const p = Math.min((Date.now()-start)/dur, 1);
          setVal(Math.floor(target * (1 - Math.pow(1-p, 3))));
          if (p >= 1) clearInterval(t);
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 36, fontWeight: 700, color: '#D4AF37', fontFamily: "'Playfair Display',serif" }}>{val.toLocaleString()}{suffix}</div>
      <div style={{ fontSize: 13, color: '#aaa', marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function StatsCounter() {
  return (
    <div style={{ background: 'linear-gradient(135deg,#0A1628,#0F2035)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 24 }}>
        <Counter target={5000} label="Happy Travelers" />
        <Counter target={150} label="Tour Packages" />
        <Counter target={30} label="Hotel Partners" />
        <Counter target={15} label="Years Experience" />
        <Counter target={50} label="Destinations" />
      </div>
    </div>
  );
}
