"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const defaultPrivacy = [
  { id: "p1", title: "Information We Collect", content: "We collect personal information including name, email, phone number, and travel preferences when you make a booking or contact us." },
  { id: "p2", title: "How We Use Your Information", content: "Your information is used to process bookings, provide customer support, send travel updates, and improve our services. We do not sell or rent your personal data." },
  { id: "p3", title: "Data Security", content: "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure." },
  { id: "p4", title: "Contact Us", content: "For privacy concerns, contact us at info@a9globaltravel.com or +95 9 781 617 111." },
];

export default function PrivacyClient({ siteConfig }: { siteConfig: any }) {
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
      <section className="relative w-full overflow-hidden" style={{ height: (siteConfig?.heroDimensions?.privacy?.desktop || 320) + "px" }}>
        <Image alt="Privacy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={siteConfig?.heroImages?.privacy || "/images_v2/hero-bagan-v2.jpg"} width={1600} height={900} sizes="100vw" />
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

          {/* GDPR Compliance section - FIX: 2026-08-08 audit (Legal 71) */}
          <div style={{ marginTop: 32, paddingTop: 28, borderTop: '1px solid #eee' }}>
            <h2 style={{ color: '#0A1628', fontSize: 22, marginBottom: 12, fontFamily: "'Playfair Display', serif" }}>GDPR Compliance</h2>
            <p style={{ marginBottom: 16 }}>
              A9 Global Travels &amp; Tours processes the personal data of visitors from the European Economic Area (EEA)
              in accordance with the General Data Protection Regulation (GDPR, EU 2016/679). This section explains how we
              process your data and the rights you hold.
            </p>

            <h3 style={{ color: '#0A1628', fontSize: 17, marginBottom: 8, marginTop: 18 }}>Legal Basis for Processing</h3>
            <p style={{ marginBottom: 16 }}>
              We process personal data on the following legal bases: <strong>consent</strong> (when you contact us or submit a
              form), <strong>performance of a contract</strong> (when we process a booking or purchase), <strong>legitimate
              interest</strong> (customer service and improving our services), and <strong>legal obligation</strong> (tax and
              accounting records).
            </p>

            <h3 style={{ color: '#0A1628', fontSize: 17, marginBottom: 8, marginTop: 18 }}>Data We Process</h3>
            <p style={{ marginBottom: 16 }}>
              We may process your name, email address, phone number, passport or ID details (required for visa and travel
              services), travel itinerary information, and payment details. We never sell or rent personal data to third
              parties.
            </p>

            <h3 style={{ color: '#0A1628', fontSize: 17, marginBottom: 8, marginTop: 18 }}>Your Rights</h3>
            <p style={{ marginBottom: 16 }}>
              Under the GDPR you have the right to: <strong>access</strong> your personal data, <strong>rectify</strong> inaccurate
              data, <strong>erase</strong> your data ("right to be forgotten"), <strong>restrict</strong> processing,
              <strong>data portability</strong>, <strong>object</strong> to processing, and <strong>withdraw consent</strong> at
              any time. You also have the right to lodge a complaint with your local supervisory authority.
            </p>

            <h3 style={{ color: '#0A1628', fontSize: 17, marginBottom: 8, marginTop: 18 }}>Data Retention</h3>
            <p style={{ marginBottom: 16 }}>
              Personal data is retained only for as long as necessary to fulfil the purposes described above, meet legal and
              accounting requirements, and resolve disputes. When data is no longer required, it is securely deleted or
              anonymised.
            </p>

            <h3 style={{ color: '#0A1628', fontSize: 17, marginBottom: 8, marginTop: 18 }}>Exercising Your Rights</h3>
            <p style={{ marginBottom: 16 }}>
              To exercise any of your rights, or for any GDPR-related request, contact us at
              <strong> info@a9globaltravel.com</strong> or <strong>+95 9 781 617 111</strong> (A9 Global Travels &amp; Tours,
              Yangon, Myanmar). We respond to all requests within 30 days.
            </p>
            <h3 style={{ color: '#0A1628', fontSize: 17, marginBottom: 8, marginTop: 18 }}>Data Sharing &amp; International Transfers</h3>
            <p style={{ marginBottom: 16 }}>
              We share personal data only with the parties necessary to provide the services you request &mdash; such as hotels,
              airlines, bus operators, visa processors and insurance providers &mdash; and only to the extent required to
              complete your booking or request. Where a service requires it, data may be transferred to providers outside the
              EEA; we rely on appropriate safeguards, including standard contractual clauses where applicable. We never sell or
              rent your personal data.
            </p>

            <h3 style={{ color: '#0A1628', fontSize: 17, marginBottom: 8, marginTop: 18 }}>Cookies &amp; Local Storage</h3>
            <p style={{ marginBottom: 16 }}>
              We use local storage in your browser to remember your language preference and search selections, and Google
              Analytics (anonymised) to understand how visitors use our website. We do not use advertising trackers or
              third-party marketing cookies. You can clear this data at any time through your browser settings.
            </p>

            <h3 style={{ color: '#0A1628', fontSize: 17, marginBottom: 8, marginTop: 18 }}>Policy Updates &amp; Contact</h3>
            <p style={{ marginBottom: 16 }}>
              We may update this policy from time to time; the latest version will always be published on this page with its
              effective date. If you have any question about this policy or our use of your data, or would like to raise a
              data-protection request on behalf of your organisation, write to <strong>info@a9globaltravel.com</strong> or call
              <strong> +95 9 781 617 111</strong>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
