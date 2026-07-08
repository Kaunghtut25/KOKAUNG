import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const loungeCards = [
  {
    img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
    icon: '🍽️', title: 'Fine Dining',
    desc: 'Premium buffet & a la carte menu'
  },
  {
    img: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80',
    icon: '🍸', title: 'Open Bar',
    desc: 'Complimentary drinks & cocktails'
  },
  {
    img: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=600&q=80',
    icon: '💻', title: 'Workspace',
    desc: 'High-speed WiFi & work stations'
  },
  {
    img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80',
    icon: '🚿', title: 'Shower Suites',
    desc: 'Refresh before your flight'
  },
  {
    img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
    icon: '😴', title: 'Nap Pods',
    desc: 'Rest in private sleeping pods'
  },
  {
    img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80',
    icon: '🛎️', title: 'Concierge',
    desc: 'Priority check-in & boarding'
  },
];

export default function MingalarPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <Image
          src="/images/hero-mingalar.jpg"
          alt="Airport Lounge"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/90 via-[#0A1628]/40 to-[#0A1628]/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            ✨ Mingalar Sky Lounge
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Premium airport lounge experience at Yangon International
          </p>
        </div>
      </section>

      {/* Lounge Cards with Images */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {loungeCards.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#D4AF37]/40 transition-all group">
              <div className="relative h-48 w-full overflow-hidden">
                <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-4 text-3xl drop-shadow-lg">{item.icon}</div>
              </div>
              <div className="p-5 text-center">
                <h3 className="font-semibold text-[#0A1628] mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
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
