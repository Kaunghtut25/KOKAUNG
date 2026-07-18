"use client";

import { useState, useEffect } from "react";

const defaultPrivacy = [
  { id: "p1", title: "Information We Collect", content: "We collect personal information including name, email, phone number, and travel preferences when you make a booking or contact us." },
  { id: "p2", title: "How We Use Your Information", content: "Your information is used to process bookings, provide customer support, send travel updates, and improve our services. We do not sell or rent your personal data." },
  { id: "p3", title: "Data Security", content: "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure." },
  { id: "p4", title: "Contact Us", content: "For privacy concerns, contact us at info@a9globaltravel.com or +95 9 123 456 789." },
];

export default function PrivacyPage() {
  const [privacy, setPrivacy] = useState(defaultPrivacy);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then((r) => r.json())
      .then((data) => {
        if (data.privacy && data.privacy.length > 0) {
          setPrivacy(data.privacy);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <section style={{ position: 'relative', height: 250, overflow: 'hidden' }}>
        <img src="/images_v2/hero-book-now-v2.jpg" alt="Privacy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,22,40,0.9), rgba(10,22,40,0.3))' }} />
        <div style={{ position: 'absolute', bottom: 30, left: 0, right: 0, textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: 'white' }}>Privacy Policy</h1>
        </div>
      </section>
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', lineHeight: 1.8, color: '#555' }}>
          {privacy.map((item) => (
            <div key={item.id}>
              <h2 style={{ color: '#0A1628', fontSize: 20, marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>{item.title}</h2>
              <p style={{ marginBottom: 20 }}>{item.content}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
