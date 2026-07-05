"use client";

import React from "react";
import Link from "next/link";

const unsplashBase = "https://images.unsplash.com";

const teamMembers = [
  {
    name: "U Aung Kyaw",
    role: "Founder & CEO",
    image: `${unsplashBase}/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&q=80`,
  },
  {
    name: "Daw Su Myat",
    role: "Operations Director",
    image: `${unsplashBase}/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face&q=80`,
  },
  {
    name: "U Zaw Htun",
    role: "Head of Tours",
    image: `${unsplashBase}/photo-1506794778202-cad84cf45f1f?w=200&h=200&fit=crop&crop=face&q=80`,
  },
  {
    name: "Daw Hnin Si",
    role: "Customer Relations",
    image: `${unsplashBase}/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face&q=80`,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* ========== HERO ========== */}
      <section className="relative py-20 sm:py-28 px-4 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[#D4AF37] text-sm uppercase tracking-widest mb-4 font-semibold">
            Our Story
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">
              About A9 Global
            </span>
            <br />
            <span className="text-white">Travels &amp; Tours</span>
          </h1>
          <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto">
            Your trusted partner for luxury travel in Myanmar and beyond
          </p>
        </div>
      </section>

      {/* ========== COMPANY STORY ========== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="text-white">Our </span>
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">
                Journey
              </span>
            </h2>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>
                Founded with a passion for creating unforgettable travel experiences,
                A9 Global Travels &amp; Tours has grown into one of Myanmar&rsquo;s most
                trusted travel agencies. For over a decade, we have been connecting
                travelers with the best that Myanmar and the world have to offer.
              </p>
              <p>
                We believe travel is more than just moving from one place to
                another — it&rsquo;s about creating memories that last a lifetime.
                Our team of experienced travel professionals works tirelessly to
                craft bespoke itineraries that cater to your unique preferences,
                whether you&rsquo;re seeking adventure, relaxation, or cultural
                immersion.
              </p>
              <p>
                From our humble beginnings in Yangon, we have built a reputation
                for excellence, reliability, and personalized service. Today, we
                proudly serve thousands of happy travelers each year, offering a
                comprehensive range of services including tour packages, hotel
                bookings, car rentals, visa processing, and travel insurance.
              </p>
            </div>
          </div>

          {/* Company Story Image */}
          <div className="relative">
            <div className="w-full h-80 sm:h-96 rounded-2xl border-2 border-[#D4AF37]/30 overflow-hidden">
              <img
                src={`${unsplashBase}/photo-1469854523086-cc02fe5d8800?w=800&q=80`}
                alt="A9 Global travel team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-[#D4AF37] font-semibold text-lg">A9 Global</p>
                <p className="text-white/80 text-sm">
                  Connecting Myanmar to the World
                </p>
              </div>
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl border border-[#D4AF37]/10 -z-10" />
          </div>
        </div>
      </section>

      {/* ========== MISSION / VISION / VALUES ========== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mission */}
          <div className="glass-card p-8 text-center hover:border-[#D4AF37]/40 transition-all duration-300 group">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
              <svg
                className="w-8 h-8 text-[#D4AF37]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                />
              </svg>
            </div>
            <h3
              className="text-xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Mission
            </h3>
            <p className="text-white/60 leading-relaxed">
              Providing exceptional travel experiences with personalized service
              that exceeds expectations. We are committed to making every journey
              seamless, memorable, and truly extraordinary.
            </p>
          </div>

          {/* Vision */}
          <div className="glass-card p-8 text-center hover:border-[#D4AF37]/40 transition-all duration-300 group">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
              <svg
                className="w-8 h-8 text-[#D4AF37]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3
              className="text-xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Vision
            </h3>
            <p className="text-white/60 leading-relaxed">
              Becoming Myanmar&rsquo;s leading luxury travel agency by setting
              the standard for quality, innovation, and customer satisfaction
              across all our services and destinations.
            </p>
          </div>

          {/* Values */}
          <div className="glass-card p-8 text-center hover:border-[#D4AF37]/40 transition-all duration-300 group">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
              <svg
                className="w-8 h-8 text-[#D4AF37]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <h3
              className="text-xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Values
            </h3>
            <div className="space-y-2 text-white/60 text-sm">
              <p>
                <span className="text-[#D4AF37] font-semibold">Integrity</span> —
                Honest and transparent in everything we do
              </p>
              <p>
                <span className="text-[#D4AF37] font-semibold">Excellence</span> —
                Striving for the highest quality in every service
              </p>
              <p>
                <span className="text-[#D4AF37] font-semibold">Innovation</span> —
                Embracing new ideas to enhance your travel experience
              </p>
              <p>
                <span className="text-[#D4AF37] font-semibold">Customer First</span> —
                Your satisfaction is our top priority
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CREDENTIALS ========== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="text-center mb-10">
          <h2
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">
              Accreditations &amp; Licenses
            </span>
          </h2>
          <p className="text-white/50">Officially recognized and fully licensed</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-[#D4AF37]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
            </div>
            <h4 className="text-white font-semibold mb-1">IATA Accredited</h4>
            <p className="text-[#D4AF37] text-sm font-mono">05301026</p>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-[#D4AF37]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <h4 className="text-white font-semibold mb-1">Licensed Tour Operator</h4>
            <p className="text-[#D4AF37] text-sm font-mono">T/O(YGN)-0946</p>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-[#D4AF37]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <h4 className="text-white font-semibold mb-1">Company Registration</h4>
            <p className="text-[#D4AF37] text-sm font-mono">126395248</p>
          </div>
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className="border-y border-white/5 bg-[#1B2A4A]/50 backdrop-blur">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div
                className="text-4xl sm:text-5xl font-bold text-[#D4AF37] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                10+
              </div>
              <p className="text-white/50 text-sm uppercase tracking-wider">
                Years of Experience
              </p>
            </div>
            <div>
              <div
                className="text-4xl sm:text-5xl font-bold text-[#D4AF37] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                5,000+
              </div>
              <p className="text-white/50 text-sm uppercase tracking-wider">
                Happy Travelers
              </p>
            </div>
            <div>
              <div
                className="text-4xl sm:text-5xl font-bold text-[#D4AF37] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                50+
              </div>
              <p className="text-white/50 text-sm uppercase tracking-wider">
                Destinations
              </p>
            </div>
            <div>
              <div
                className="text-4xl sm:text-5xl font-bold text-[#D4AF37] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                24/7
              </div>
              <p className="text-white/50 text-sm uppercase tracking-wider">
                Support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TEAM SECTION ========== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">
              Our Expert Team
            </span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Passionate professionals dedicated to crafting your perfect journey
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="glass-card p-6 text-center hover:border-[#D4AF37]/30 transition-all duration-300 group"
            >
              {/* Team member photo */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-white/10 group-hover:border-[#D4AF37]/30 transition-colors overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
              <h4 className="text-white font-semibold text-lg mb-1">{member.name}</h4>
              <p className="text-[#D4AF37] text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="glass-card p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#F5A623]/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4 text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ready to Start Your Journey?
            </h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              Let us help you plan the trip of a lifetime. Our team is ready to
              create a custom itinerary just for you.
            </p>
            <Link
              href="/tours"
              className="inline-block px-8 py-3.5 rounded-xl font-semibold text-white
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
