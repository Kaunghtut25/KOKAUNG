'use client';
import { useState, useEffect, useRef } from 'react';

function Counter({ target, label, suffix = '' }: { target: number; label: string; suffix?: string }) {
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

// Parse a stats title like "5,000+ Happy Travelers", "50+ Destinations", "24/7 Support" or "IATA Accredited".
// Returns { num, suffix, label } when a clean integer prefix exists, otherwise { num: null, label: title }.
function parseStat(title: string): { num: number | null; suffix: string; label: string } {
  const m = title.match(/^([\d,.]+(?:\/\d+)?)\s*(\+)?\s*(.*)$/);
  if (!m) return { num: null, suffix: '', label: title };
  const head = m[1];
  const suffix = m[2] || '';
  const rest = m[3] || '';
  if (head.includes('/')) {
    // e.g. "24/7 Support" — render the whole head statically, never "24+ /7 Support"
    return { num: null, suffix: '', label: (head + (suffix ? ' ' + suffix : '') + (rest ? ' ' + rest : '')).trim() };
  }
  const num = parseInt(head.replace(/,/g, ''), 10);
  if (isNaN(num)) return { num: null, suffix: '', label: title };
  return { num, suffix, label: rest };
}

const FALLBACK_STATS = [
  { num: 5000, suffix: '+', label: 'Happy Travelers' },
  { num: 150, suffix: '+', label: 'Tour Packages' },
  { num: 30, suffix: '+', label: 'Hotel Partners' },
  { num: 15, suffix: '+', label: 'Years Experience' },
  { num: 50, suffix: '+', label: 'Destinations' },
];

export default function StatsCounter() {
  const [stats, setStats] = useState<{ num: number | null; suffix: string; label: string }[]>(FALLBACK_STATS);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then(r => r.json())
      .then(config => {
        if (config?.statsCards?.length > 0) {
          setStats(config.statsCards.map((c: any) => parseStat(c.title || '')));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ background: 'linear-gradient(135deg,#0A1628,#0F2035)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 24 }}>
        {stats.map((s, i) =>
          s.num != null ? (
            <Counter key={i} target={s.num} label={s.label} suffix={s.suffix} />
          ) : (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#D4AF37', fontFamily: "'Playfair Display',serif", lineHeight: 1.4 }}>{s.label}</div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
