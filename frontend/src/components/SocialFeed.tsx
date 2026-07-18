export default function SocialFeed() {
  const photos = [
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=300',
    'https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=300',
    'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=300',
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=300',
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=300',
    'https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=300',
  ];
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <h2 style={{ textAlign: 'center', fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#0A1628', marginBottom: 8 }}>Follow Our Journey</h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: 14, marginBottom: 24 }}>@a9globaltravel</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {photos.map((url, i) => (
          <a key={i} href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ position: 'relative', display: 'block', borderRadius: 8, overflow: 'hidden', aspectRatio: '1' }}>
            <img src={url} alt="Travel photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,22,40,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}
              onMouseEnter={(e)=>{e.currentTarget.style.background='rgba(10,22,40,0.5)';}}
              onMouseLeave={(e)=>{e.currentTarget.style.background='rgba(10,22,40,0)';}}>
              <span style={{ fontSize: 24, opacity: 0, transition: 'opacity 0.3s' }}>📷</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
