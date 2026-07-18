import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 120, color: '#D4AF37', margin: 0, lineHeight: 1 }}>404</h1>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: 'white', marginTop: 16, marginBottom: 8 }}>Page Not Found</h2>
      <p style={{ color: '#999', fontSize: 16, marginBottom: 32 }}>The page you are looking for does not exist or has been moved.</p>
      <Link href="/" style={{ padding: '14px 40px', borderRadius: 12, background: 'linear-gradient(to right, #D4AF37, #F5A623)', color: '#0A1628', fontWeight: 'bold', fontSize: 16, textDecoration: 'none' }}>
        Back to Home
      </Link>
    </main>
  );
}
