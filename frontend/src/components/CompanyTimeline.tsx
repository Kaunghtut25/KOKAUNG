export default function CompanyTimeline() {
  const milestones = [
    { year: '2015', title: 'Founded', desc: 'A9 Global Travel & Tours established in Yangon' },
    { year: '2017', title: 'IATA Accreditation', desc: 'Official IATA certification received' },
    { year: '2019', title: 'Expansion', desc: 'Grew to 30+ tour packages across Myanmar' },
    { year: '2020', title: 'Digital Transformation', desc: 'Launched online booking platform' },
    { year: '2022', title: 'Sky Lounge', desc: 'Premium airport lounge service launched' },
    { year: '2024', title: '5000+ Travelers', desc: 'Milestone of 5000 happy customers reached' },
    { year: '2026', title: 'Premium Relaunch', desc: 'Next-generation travel platform' },
  ];
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      <h2 style={{ textAlign: 'center', fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#0A1628', marginBottom: 32 }}>Our Journey</h2>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: '#D4AF37', transform: 'translateX(-50%)' }} />
        {milestones.map((m, i) => (
          <div key={m.year} style={{ display: 'flex', justifyContent: i%2===0 ? 'flex-start' : 'flex-end', marginBottom: 24 }}>
            <div style={{ width: '45%', background: 'white', borderRadius: 12, padding: 16, border: '1px solid #eee', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 16, right: i%2===0 ? -20 : 'auto', left: i%2!==0 ? -20 : 'auto', width: 12, height: 12, borderRadius: '50%', background: '#D4AF37' }} />
              <div style={{ color: '#D4AF37', fontSize: 18, fontWeight: 700 }}>{m.year}</div>
              <div style={{ color: '#0A1628', fontSize: 15, fontWeight: 600, marginTop: 4 }}>{m.title}</div>
              <div style={{ color: '#666', fontSize: 13, marginTop: 4 }}>{m.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
