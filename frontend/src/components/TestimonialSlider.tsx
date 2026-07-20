'use client';
import { useState, useEffect } from 'react';

interface Review {
  name: string;
  country: string;
  tour: string;
  text: string;
  rating: number;
}

const FALLBACK_REVIEWS: Review[] = [
  { name: 'John Smith', country: 'Australia', tour: 'Bagan Explorer', text: 'Amazing experience! The hot air balloon ride was breathtaking. Professional team from start to finish.', rating: 5 },
  { name: 'Sarah Chen', country: 'Singapore', tour: 'Inle Lake Discovery', text: 'Beautiful lake, friendly people. A9 made everything seamless. Highly recommend!', rating: 5 },
  { name: 'Marcus Weber', country: 'Germany', tour: 'Yangon City Tour', text: 'Rich culture and history. Our guide was knowledgeable and spoke excellent English.', rating: 5 },
  { name: 'Yuki Tanaka', country: 'Japan', tour: 'Ngapali Beach Escape', text: 'Perfect beach vacation. The resort was stunning and transfers were on time.', rating: 5 },
  { name: 'Emily Brown', country: 'UK', tour: 'Mrauk U Adventure', text: 'Off the beaten path experience. A9 knows Myanmar like no other agency.', rating: 5 },
  { name: 'David Lee', country: 'USA', tour: 'Golden Rock Pilgrimage', text: 'Spiritual journey of a lifetime. Everything was well organized and safe.', rating: 5 },
];

export default function TestimonialSlider() {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then(r => r.json())
      .then(config => {
        if (config?.testimonials?.length > 0) {
          setReviews(config.testimonials);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, [reviews]);

  const r = reviews[idx];
  if (!r) return null;

  return (
    <div style={{ background: 'linear-gradient(135deg,#0A1628,#0F2035)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: '#D4AF37', fontFamily: "'Playfair Display',serif", fontSize: 24, marginBottom: 24 }}>What Our Travelers Say</h2>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
          <div style={{ color: '#D4AF37', fontSize: 18, marginBottom: 8 }}>{'★'.repeat(r.rating || 5)}</div>
          <p style={{ color: 'white', fontSize: 16, lineHeight: 1.6, fontStyle: 'italic', marginBottom: 16 }}>"{r.text}"</p>
          <div style={{ color: '#D4AF37', fontWeight: 600 }}>{r.name}</div>
          <div style={{ color: '#999', fontSize: 13 }}>{r.country} — {r.tour}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          {reviews.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{ width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer', background: i===idx ? '#D4AF37' : 'rgba(255,255,255,0.2)', transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
