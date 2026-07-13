'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CruisesPage() {
  // Fetch from admin database
  const [apiData, setApiData] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    fetch('/api/cruises').then(r => r.json()).then(data => {
      const items = data?.data || data || [];
      if (items.length > 0) { setApiData(items); setDataLoaded(true); }
    }).catch(() => {});
  }, []);

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

      {/* Info Cards with Images */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: '🛳️', img: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80', title: 'Luxury Liners', desc: 'World-class cruise ships with premium amenities' },
            { icon: '🏝️', img: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600&q=80', title: 'Exotic Routes', desc: 'Mediterranean, Caribbean, Alaska & more' },
            { icon: '🍽️', img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80', title: 'All-Inclusive', desc: 'Fine dining, drinks, entertainment included' },
            { icon: '🎭', img: 'https://images.unsplash.com/photo-1516496636080-14fb876e029d?w=600&q=80', title: 'Entertainment', desc: 'Live shows, casinos, pools & theatre' },
            { icon: '👨‍👩‍👧‍👦', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', title: 'Family Friendly', desc: 'Kids clubs, family suites & activities' },
            { icon: '🌊', img: 'https://images.unsplash.com/photo-1559030623-0226b1241edd?w=600&q=80', title: 'Shore Excursions', desc: 'Curated tours at every port of call' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-[#D4AF37]/40 transition-all group">
              <div className="relative h-40 overflow-hidden">
                <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-5 text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-[#0A1628] mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
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
