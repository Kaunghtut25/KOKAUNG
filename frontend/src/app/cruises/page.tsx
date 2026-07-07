import React from 'react';
import Link from 'next/link';

export default function CruisesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative pt-24 pb-12 px-4 bg-[#0A1628]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            🚢 Cruises
          </h1>
          <p className="text-gray-400 text-lg">
            Luxury cruise packages to world-class destinations
          </p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 py-12">
        <p className="text-center text-gray-500 text-lg">Coming soon — contact us for early bookings.</p>
        <div className="text-center mt-8">
          <Link href="/contact" className="inline-block px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-bold rounded-xl hover:shadow-lg transition-all">
            Inquire Now
          </Link>
        </div>
      </section>
    </main>
  );
}
