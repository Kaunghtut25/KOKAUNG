'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const cruiseImages = [
  { src: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80', alt: 'Luxury cruise ship', label: 'Ocean Voyager' },
  { src: 'https://images.unsplash.com/photo-1559131625-ad5a17a4db5e?w=800&q=80', alt: 'Caribbean cruise', label: 'Caribbean Dream' },
  { src: 'https://images.unsplash.com/photo-1516496636080-14fb876e029d?w=800&q=80', alt: 'Mediterranean cruise', label: 'Mediterranean Queen' },
  { src: 'https://images.unsplash.com/photo-1559030623-0226b1241edd?w=800&q=80', alt: 'Alaska cruise', label: 'Alaska Explorer' },
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', alt: 'Tropical beach cruise', label: 'Tropical Escape' },
  { src: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=80', alt: 'Cruise pool deck', label: 'Horizon Suite' },
  { src: 'https://images.unsplash.com/photo-1569263979104-715ab7cd79d0?w=800&q=80', alt: 'Cruise at sunset', label: 'Sunset Serenade' },
  { src: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80', alt: 'Greek islands cruise', label: 'Aegean Odyssey' },
  { src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80', alt: 'Cruise dining', label: 'Grand Voyager' },
  { src: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=800&q=80', alt: 'Norwegian fjords cruise', label: 'Nordic Star' },
];

export default function CruisesPage() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => setCurrent(c => (c + 1) % cruiseImages.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + cruiseImages.length) % cruiseImages.length), []);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(next, 3500);
    return () => clearInterval(t);
  }, [isPaused, next]);

  return (
    <main className="min-h-screen bg-white">
      <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1600&q=85"
          alt="Luxury Cruise Ship"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/90 via-[#0A1628]/40 to-[#0A1628]/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            🚢 Cruises
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Luxury cruise packages to world-class destinations
          </p>
        </div>
      </section>

      {/* Image Carousel */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl bg-[#0A1628]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative aspect-[21/9] md:aspect-[21/7]">
            {cruiseImages.map((img, i) => (
              <div key={i}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" priority={i === 0} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-10">
                  <span className="text-white text-lg md:text-2xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{img.label}</span>
                  <p className="text-gray-300 text-xs md:text-sm mt-1">{img.alt}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Arrows */}
          <button onClick={prev} className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={next} className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {cruiseImages.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-[#D4AF37] scale-125' : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: '🛳️', title: 'Luxury Liners', desc: 'World-class cruise ships with premium amenities' },
            { icon: '🏝️', title: 'Exotic Routes', desc: 'Mediterranean, Caribbean, Alaska & more' },
            { icon: '🍽️', title: 'All-Inclusive', desc: 'Fine dining, drinks, entertainment included' },
            { icon: '🎭', title: 'Entertainment', desc: 'Live shows, casinos, pools & theatre' },
            { icon: '👨‍👩‍👧‍👦', title: 'Family Friendly', desc: 'Kids clubs, family suites & activities' },
            { icon: '🌊', title: 'Shore Excursions', desc: 'Curated tours at every port of call' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 text-center hover:shadow-md hover:border-[#D4AF37]/40 transition-all">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-[#0A1628] mb-1">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/contact" className="inline-block px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-bold rounded-xl hover:shadow-lg transition-all">
            Book Your Cruise
          </Link>
        </div>
      </section>
    </main>
  );
}
