"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface LoungeItem {
  img: string;
  icon: string;
  title: string;
  desc: string;
}

interface MingalarClientProps {
  initialCards: LoungeItem[];
}

export default function MingalarClient({ initialCards }: MingalarClientProps) {
  const [loungeCards, setLoungeCards] = useState<LoungeItem[]>(initialCards);

  useEffect(() => {
    fetch('/api/admin/mingalar').then(r => {
      if (!r.ok) throw new Error('Not authed');
      return r.json();
    }).then(data => {
      if (data?.data?.length > 0) {
        const mapped = data.data.map((item: any) => ({
          img: item.img || item.image || '/images_v2/sky1-v3.jpg',
          icon: item.icon || '✨',
          title: item.title || 'Sky Lounge',
          desc: item.desc || item.description || '',
        }));
        setLoungeCards(mapped);
      }
    }).catch(() => {});
  }, []);

  const renderCard = (item: LoungeItem, i: number) => (
    <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#D4AF37]/40 transition-all group">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = '/images_v2/sky1-v3.jpg'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-4 text-3xl drop-shadow-lg">{item.icon}</div>
      </div>
      <div className="p-5 text-center">
        <h3 className="font-semibold text-[#0A1628] mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{item.title}</h3>
        <p className="text-gray-500 text-sm">{item.desc}</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-white">
      <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <img src="/images_v2/hero-mingalar-v2.jpg" alt="Airport Lounge" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/90 via-[#0A1628]/40 to-[#0A1628]/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            ✨ Mingalar Sky Lounge
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">Premium airport lounge experience at Yangon International</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {loungeCards.slice(0, 3).map((item, i) => renderCard(item, i))}
        </div>
        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {loungeCards.slice(3, 6).map((item, i) => renderCard(item, i + 3))}
        </div>
        <div className="text-center">
          <Link href="/contact" className="inline-block px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-bold rounded-xl hover:shadow-lg transition-all">
            Book Lounge Access
          </Link>
        </div>
      </section>
    </main>
  );
}