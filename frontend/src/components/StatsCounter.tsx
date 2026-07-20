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
  }, [target]);
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 36, fontWeight: 700, color: '#D4AF37', fontFamily: "'Playfair Display',serif" }}>{val.toLocaleString()}{suffix}</div>
      <div style={{ fontSize: 13, color: '#aaa', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function parseNumber(title: string): number {
  const match = title.match(/([\d,]+)/);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''), 10) || 0;
  }
  return 0;
}

function extractLabel(title: string): string {
  // Remove leading number patterns like "5,000+ " or "50+ "
  return title.replace(/^[\d,+]+\s*/, '');
}

const FALLBACK_STATS = [
  { target: 5000, label: 'Happy Travelers' },
  { target: 150, label: 'Tour Packages' },
  { target: 30, label: 'Hotel Partners' },
  { target: 15, label: 'Years Experience' },
  { target: 50, label: 'Destinations' },
];

export default function StatsCounter() {
  const [stats, setStats] = useState<{ target: number; label: string }[]>(FALLBACK_STATS);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then(r => r.json())
      .then(config => {
        if (config?.statsCards?.length > 0) {
          const parsed = config.statsCards.map((c: any) => ({
            target: parseNumber(c.title || ''),
            label: extractLabel(c.title || '') || c.description || '',
          }));
          setStats(parsed);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ background: 'linear-gradient(135deg,#0A1628,#0F2035)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 24 }}>
        {stats.map((s, i) => (
          <Counter key={i} target={s.target} label={s.label} />
        ))}
      </div>
    </div>
  );
}
