'use client';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <div style={{ background: 'linear-gradient(135deg,#0A1628,#0F2035)', borderTop: '2px solid #D4AF37', padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <h3 style={{ color: '#D4AF37', fontSize: 20, fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>Subscribe to Get Travel Deals & Updates</h3>
        <p style={{ color: '#aaa', fontSize: 14, marginBottom: 16 }}>Get exclusive offers and travel inspiration delivered to your inbox</p>
        {done ? (
          <p style={{ color: '#D4AF37', fontSize: 16, fontWeight: 600 }}>✓ Thank you for subscribing!</p>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if(email) setDone(true); }} style={{ display: 'flex', gap: 8 }}>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Your email address" required style={{ flex:1, padding:'10px 16px', borderRadius:24, border:'1px solid #D4AF37', background:'white', color:'#333', fontSize:14, outline:'none' }} />
            <button type="submit" style={{ padding:'10px 24px', borderRadius:24, background:'#D4AF37', color:'#0A1628', border:'none', fontWeight:700, cursor:'pointer', fontSize:14 }}>Subscribe</button>
          </form>
        )}
      </div>
    </div>
  );
}
