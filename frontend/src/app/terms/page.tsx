"use client";

import { useState, useEffect } from "react";

const defaultTerms = [
  { id: "t1", title: "1. Bookings and Reservations", content: "All bookings are subject to availability and confirmation by A9 Global Travel and Tours. A booking is only confirmed once full payment or deposit is received." },
  { id: "t2", title: "2. Cancellation Policy", content: "Cancellations made 7+ days before departure: full refund minus processing fee. Cancellations within 7 days: 50% refund. No-show: no refund." },
  { id: "t3", title: "3. Travel Documents", content: "Passengers are responsible for ensuring they have valid passports, visas, and other required travel documents. A9 Global Travel is not liable for denied boarding due to incomplete documents." },
  { id: "t4", title: "4. Pricing", content: "All prices are in Myanmar Kyat (MMK) or US Dollars (USD). Prices are subject to change without notice due to currency fluctuations, fuel surcharges, or other factors beyond our control." },
  { id: "t5", title: "5. Privacy", content: "We respect your privacy. Personal information collected during bookings is used solely for processing your reservation and will not be shared with third parties without your consent." },
  { id: "t6", title: "6. Liability", content: "A9 Global Travel and Tours acts as an agent for various service providers. We are not liable for accidents, injuries, delays, or losses caused by third-party providers." },
];

export default function TermsPage() {
  const [terms, setTerms] = useState(defaultTerms);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then((r) => r.json())
      .then((data) => {
        if (data.terms && data.terms.length > 0) {
          setTerms(data.terms);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <section style={{ position: 'relative', height: 250, overflow: 'hidden' }}>
        <img src="/images_v2/hero-book-now-v2.jpg" alt="Terms" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,22,40,0.9), rgba(10,22,40,0.3))' }} />
        <div style={{ position: 'absolute', bottom: 30, left: 0, right: 0, textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: 'white' }}>Terms and Conditions</h1>
        </div>
      </section>
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', lineHeight: 1.8, color: '#555' }}>
          {terms.map((item) => (
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
