"use client";

import React from "react";
import Link from "next/link";

const teamMembers = [
  { name: "U Aung Kyaw", role: "Founder & CEO", image: `/images_v2/team-ceo-v2.jpg` },
  { name: "Daw Su Myat", role: "Operations Director", image: `/images_v2/team-ops-v2.jpg` },
  { name: "U Zaw Htun", role: "Head of Tours", image: `/images_v2/team-tours-v2.jpg` },
  { name: "Daw Hnin Si", role: "Customer Relations", image: `/images_v2/team-cr-v2.jpg` },
];

const values = [
  { title: "Customer First", desc: "We place our customers at the center of everything we do and strive to deliver exceptional service experiences.", icon: "🎯" },
  { title: "Integrity", desc: "We conduct our business with honesty, transparency, and professionalism.", icon: "🤝" },
  { title: "Reliability", desc: "We provide dependable travel solutions and responsive support whenever our customers need us.", icon: "🛡️" },
  { title: "Innovation", desc: "We continuously improve our services and embrace new technologies to enhance customer experience.", icon: "💡" },
  { title: "Teamwork", desc: "We believe collaboration and partnership are the foundation of long-term success.", icon: "🤲" },
];

const services = [
  "International Air Ticketing",
  "Domestic Air Ticketing",
  "Corporate Travel Management",
  "Marine and Offshore Travel",
  "Visa Assistance",
  "Hotel Reservations",
  "Tours and Holiday Packages",
  "MICE Services",
  "Airport Transfers and Ground Transportation",
];

const whyChooseUs = [
  "Experienced travel professionals",
  "Competitive pricing and corporate travel solutions",
  "Dedicated account management",
  "Fast response and personalized service",
  "Flexible and customized travel programs",
  "24/7 emergency support for urgent travel requirements",
  "Strong partnerships with airlines, hotels, and travel suppliers worldwide",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ========== HERO WITH BACKGROUND IMAGE ========== */}
      <section className="relative pt-28 pb-20 sm:pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images_v2/about-hero-v2.jpg" alt="A9 Global Travel & Tours" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/85 via-[#0A1628]/70 to-[#0A1628]/85" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-[#D4AF37] text-sm uppercase tracking-widest mb-4 font-semibold">
            About Us
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">
              Welcome to
            </span>
            <br />
            <span className="text-white">A9 Global Travel &amp; Tours</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            A professional travel management company based in Myanmar, providing comprehensive travel solutions for individuals, businesses, marine and organizations.
          </p>
        </div>
      </section>

      {/* ========== WHO WE ARE ========== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#0A1628]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Who <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">We Are</span>
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                With extensive experience in the travel industry, we specialize in delivering reliable, efficient, and cost-effective travel services tailored to the needs of our customers. From flight reservations and hotel bookings to visa assistance and corporate travel management, we are committed to making every journey smooth and hassle-free.
              </p>
              <p>
                Our expertise extends beyond leisure travel to include corporate travel management, marine and offshore travel, MICE services, and customized travel programs designed to support businesses and travelers alike.
              </p>
              <p>
                We are a team of experienced travel professionals dedicated to providing exceptional service and personalized travel solutions. Our industry knowledge, global partnerships, and customer-focused approach allow us to deliver value and convenience to our clients.
              </p>
              <p className="text-[#B8960F] italic font-medium">
                At A9 Global Travel &amp; Tours, we believe that travel is more than simply moving from one destination to another — it is about creating opportunities, building connections, and supporting business growth.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-80 sm:h-96 rounded-2xl border-2 border-[#D4AF37]/30 overflow-hidden shadow-lg">
              <img src="/images_v2/about-hero-v2.jpg" alt="A9 Global travel team" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-[#D4AF37] font-semibold text-lg">A9 Global</p>
                <p className="text-white/80 text-sm">Connecting Myanmar to the World</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl border border-[#D4AF37]/20 -z-10" />
          </div>
        </div>
      </section>

      {/* ========== MISSION & VISION ========== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 hover:border-[#D4AF37]/40 hover:shadow-lg transition-all duration-300 group">
            <div className="w-16 h-16 mb-5 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
              <svg className="w-8 h-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#0A1628] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To provide professional, reliable, and innovative travel solutions that exceed customer expectations and create long-term value for our clients and partners.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 hover:border-[#D4AF37]/40 hover:shadow-lg transition-all duration-300 group">
            <div className="w-16 h-16 mb-5 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
              <svg className="w-8 h-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#0A1628] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To become one of Myanmar&rsquo;s leading travel management companies, recognized for service excellence, innovation, and customer satisfaction across local and international markets.
            </p>
          </div>
        </div>
      </section>

      {/* ========== OUR VALUES ========== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 sm:pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-[#0A1628]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Our <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">Values</span>
          </h2>
          <p className="text-gray-500">The principles that guide everything we do</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {values.map((v) => (
            <div key={v.title} className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:border-[#D4AF37]/40 hover:shadow-md transition-all duration-300 group">
              <div className="text-3xl mb-3">{v.icon}</div>
              <h4 className="text-[#0A1628] font-semibold mb-2">{v.title}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== OUR SERVICES ========== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 sm:pb-20">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">Services</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.map((svc) => (
              <div key={svc} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all duration-200">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] flex-shrink-0" />
                <span className="text-[#0A1628] text-sm font-medium">{svc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY CHOOSE US ========== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 sm:pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Why Choose <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">A9 Global?</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {whyChooseUs.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-200 hover:border-[#D4AF37]/30 hover:shadow-sm transition-all">
              <svg className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========== CREDENTIALS ========== */}
      <section className="bg-[#0A1628] py-16 sm:py-20">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">Accreditations &amp; Licenses</span>
            </h2>
            <p className="text-white/50">Officially recognized and fully licensed</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "IATA Accredited", code: "05301026", svg: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /> },
              { title: "Licensed Tour Operator", code: "T/O(YGN)-0946", svg: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /> },
              { title: "Company Registration", code: "126395248", svg: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /> },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 text-center hover:border-[#D4AF37]/30 transition-all">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{item.svg}</svg>
                </div>
                <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                <p className="text-[#D4AF37] text-sm font-mono">{item.code}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className="bg-[#0A1628] border-t border-white/5">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "10+", label: "Years of Experience" },
              { num: "5,000+", label: "Happy Travelers" },
              { num: "50+", label: "Destinations" },
              { num: "24/7", label: "Support" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-4xl sm:text-5xl font-bold text-[#D4AF37] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{s.num}</div>
                <p className="text-white/50 text-sm uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TEAM ========== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-[#0A1628]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Our <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">Expert Team</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Passionate professionals dedicated to crafting your perfect journey
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:border-[#D4AF37]/40 hover:shadow-lg transition-all duration-300 group">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-gray-200 group-hover:border-[#D4AF37]/40 transition-colors overflow-hidden">
                <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover" />
              </div>
              <h4 className="text-[#0A1628] font-semibold text-lg mb-1">{member.name}</h4>
              <p className="text-[#D4AF37] text-sm font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== OUR COMMITMENT ========== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 sm:pb-20">
        <div className="bg-[#0A1628] rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#F5A623]/5 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Our Commitment</h2>
            <p className="text-white/60 mb-6 max-w-2xl mx-auto leading-relaxed">
              At A9 Global Travel &amp; Tours, our commitment is simple: to deliver seamless travel experiences with professionalism, reliability, and care.
            </p>
            <p className="text-white/50 mb-8 max-w-2xl mx-auto leading-relaxed">
              Whether you are planning a business trip, family holiday, corporate event, or marine crew movement, we are here to support your journey every step of the way.
            </p>
            <Link
              href="/book-now"
              className="inline-block px-8 py-3.5 rounded-xl font-semibold text-[#0A1628]
                         bg-gradient-to-r from-[#D4AF37] to-[#F5A623]
                         hover:from-[#C4A037] hover:to-[#E59620]
                         transition-all duration-200 shadow-lg shadow-[#D4AF37]/20"
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
