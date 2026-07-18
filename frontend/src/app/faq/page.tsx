"use client";

import { useState, useEffect } from "react";

const defaultFaqs = [
  { q: "How do I book a tour?", a: "Simply browse our Tours page, select your preferred tour, click 'Book Now', fill in your details and submit. Our team will contact you within 24 hours to confirm your booking." },
  { q: "What documents do I need for a visa application?", a: "Required documents vary by country. Typically you need: a valid passport (6+ months), passport-size photos, flight itinerary, hotel booking confirmation, and proof of funds. Check each visa's detail page for specific requirements." },
  { q: "Can I cancel or modify my booking?", a: "Yes, bookings can be modified or cancelled. Cancellation fees may apply depending on how close to the departure date. Contact us at info@a9globaltravel.com for assistance." },
  { q: "What payment methods do you accept?", a: "We accept bank transfers, cash payments at our office, and major credit cards. Online payment integration is coming soon." },
  { q: "Do you offer travel insurance?", a: "Yes! We offer 9 different insurance plans ranging from basic travel shields to comprehensive annual coverage. Visit our Insurance page to find the right plan for you." },
  { q: "How long does visa processing take?", a: "Processing times vary by country. Most visas take 3-5 business days, but some may take up to 2 weeks. Check each visa's detail page for estimated processing time." },
  { q: "Do you provide airport transfers?", a: "Yes, we offer airport transfer services with our fleet of vehicles. Book through our Cars section or add it to your tour package." },
  { q: "What is included in the Sky Lounge access?", a: "Sky Lounge access includes premium buffet dining, complimentary drinks, WiFi, work stations, shower facilities, and flight information displays." },
  { q: "Are cruise prices per person or per cabin?", a: "Cruise prices are typically per person based on double occupancy. Single supplements may apply. Contact us for detailed pricing." },
  { q: "Can I customize a tour package?", a: "Absolutely! We specialize in custom itineraries. Contact us with your preferences and our travel experts will create a personalized package for you." },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState(defaultFaqs);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then((r) => r.json())
      .then((data) => {
        if (data.faqs && data.faqs.length > 0) {
          setFaqs(data.faqs);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <section style={{ position: 'relative', height: 300, overflow: 'hidden' }}>
        <img src="/images_v2/hero-book-now-v2.jpg" alt="FAQ" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,22,40,0.9), rgba(10,22,40,0.3))' }} />
        <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', padding: '0 20px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, color: 'white', marginBottom: 8 }}>Frequently Asked Questions</h1>
          <p style={{ color: '#D4AF37', fontSize: 18 }}>Everything you need to know</p>
        </div>
      </section>

      <section style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        {faqs.map((faq, i) => (
          <details key={i} style={{ background: 'white', borderRadius: 12, marginBottom: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <summary style={{ padding: '20px 24px', cursor: 'pointer', fontWeight: 600, fontSize: 16, color: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {faq.q}
              <span style={{ color: '#D4AF37', fontSize: 20 }}>+</span>
            </summary>
            <div style={{ padding: '0 24px 20px', color: '#555', lineHeight: 1.8, fontSize: 15 }}>{faq.a}</div>
          </details>
        ))}
      </section>
    </main>
  );
}
