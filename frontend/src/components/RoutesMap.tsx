'use client';
export default function RoutesMap() {
  const dests = [
    { name: 'Yangon', x: 50, y: 80, tours: 15 },
    { name: 'Bagan', x: 35, y: 45, tours: 12 },
    { name: 'Mandalay', x: 45, y: 30, tours: 10 },
    { name: 'Inle Lake', x: 55, y: 50, tours: 8 },
    { name: 'Ngapali', x: 20, y: 70, tours: 5 },
    { name: 'Kyaiktiyo', x: 60, y: 85, tours: 4 },
  ];
  return (
    <div style={{ background: 'linear-gradient(135deg,#0A1628,#0F2035)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: '#D4AF37', fontFamily: "'Playfair Display',serif", fontSize: 24, marginBottom: 8 }}>Popular Destinations</h2>
        <p style={{ color: '#aaa', fontSize: 14, marginBottom: 24 }}>Explore Myanmar's best travel spots</p>
        <div style={{ position: 'relative', width: '100%', height: 350, background: 'rgba(255,255,255,0.05)', borderRadius: 16, overflow: 'hidden' }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
            {dests.map((d, i) => dests.slice(i+1).map((d2, j) => (
              <line key={`${i}-${j}`} x1={d.x} y1={d.y} x2={d2.x} y2={d2.y} stroke="rgba(212,175,55,0.15)" strokeWidth="0.3" />
            )))}
          </svg>
          {dests.map(d => (
            <div key={d.name} style={{ position: 'absolute', left: `${d.x}%`, top: `${d.y}%`, transform: 'translate(-50%,-50%)' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#D4AF37', boxShadow: '0 0 8px rgba(212,175,55,0.5)' }} />
              <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', color: 'white', fontSize: 11, fontWeight: 600 }}>{d.name}</div>
              <div style={{ position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', color: '#D4AF37', fontSize: 10 }}>{d.tours} tours</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
