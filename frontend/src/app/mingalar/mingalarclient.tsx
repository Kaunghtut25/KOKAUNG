"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DealsBanner from '@/components/DealsBanner';
import FAQAccordion from '@/components/FAQAccordion';
import TestimonialSlider from '@/components/TestimonialSlider';
interface LoungeItem {
  slug?: string;
  id?: string;
  img: string;
  icon: string;
  title: string;
  desc: string;
}

interface MingalarClientProps {
  initialCards: LoungeItem[];
}

export default function MingalarClient({ initialCards, siteConfig }: MingalarClientProps & { siteConfig?: any }) {
  const router = useRouter();
  const heroImage = siteConfig?.heroImages?.mingalar || "/images_v2/sky1-v3.jpg";
  const layout = siteConfig?.sectionLayouts?.skyLounge || { desktop: 3, tablet: 2, mobile: 1 };
  const [loungeCards, setLoungeCards] = useState<LoungeItem[]>(initialCards);


  const renderCard = (item: LoungeItem, i: number) => {
    const slug = item.slug || item.id || ('m' + (i + 1));
    return (
      <div key={i} onClick={() => router.push("/mingalar/" + (item.slug || item.id || ("m" + (i + 1))))} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#D4AF37]/40 transition-all group cursor-pointer">
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
          <p className="text-gray-500 text-sm mb-4">{item.desc}</p>
          <div className="flex gap-2">
            <Link
              href={'/mingalar/' + slug}
              className="flex-1 px-3 py-2 border border-[#D4AF37] text-[#D4AF37] text-sm font-semibold rounded-full text-center hover:bg-[#D4AF37] hover:text-white transition-colors"
            >
              View Details
            </Link>
            <button
              onClick={() => router.push('/book-now?type=lounge&name=' + encodeURIComponent(item.title) + '&id=' + slug)}
              className="flex-1 px-3 py-2 bg-[#D4AF37] text-white text-sm font-semibold rounded-full hover:bg-[#C19B2F] transition-colors"
            >
              Book Now
            </button>
          </div>
          <button
            onClick={() => router.push('/contact?subject=' + encodeURIComponent('Sky Lounge Inquiry') + '&item=' + encodeURIComponent(item.title))}
            className="w-full mt-2 py-2 text-sm text-gray-600 hover:text-[#D4AF37] transition-colors"
          >
            Contact Us
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <img src={heroImage} alt="Airport Lounge" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images_v2/sky1-v3.jpg"; }} />
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
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6`}>
          {loungeCards.slice(0, 3).map((item, i) => renderCard(item, i))}
        </div>
        {/* Row 2 */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10`}>
          {loungeCards.slice(3, 6).map((item, i) => renderCard(item, i + 3))}
        </div>
        <div className="text-center">
          <Link href="/contact" className="inline-block px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-gray-900 font-bold rounded-xl hover:shadow-lg transition-all">
            Book Lounge Access
          </Link>
        </div>
      </section>
      <DealsBanner />
      <FAQAccordion section="mingalar" />
      <TestimonialSlider />
    </main>
  );
}
