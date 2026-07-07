import React from 'react';
import Link from 'next/link';

export default function MingalarPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative pt-24 pb-12 px-4 bg-[#0A1628]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            ✨ Mingalar Sky Lounge
          </h1>
          <p className="text-gray-400 text-lg">
            Premium airport lounge experience at Yangon International
          </p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: '🍽️', title: 'Fine Dining', desc: 'Premium buffet & a la carte menu' },
            { icon: '🍸', title: 'Open Bar', desc: 'Complimentary drinks & cocktails' },
            { icon: '💻', title: 'Workspace', desc: 'High-speed WiFi & work stations' },
            { icon: '🚿', title: 'Shower Suites', desc: 'Refresh before your flight' },
            { icon: '😴', title: 'Nap Pods', desc: 'Rest in private sleeping pods' },
            { icon: '🛎️', title: 'Concierge', desc: 'Priority check-in & boarding' },
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
            Book Lounge Access
          </Link>
        </div>
      </section>
    </main>
  );
}
