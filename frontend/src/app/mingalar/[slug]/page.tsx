'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface MingalarItem {
  id?: string; _id?: string;
  title: string; desc: string; icon: string; img: string;
  slug?: string;
}


const FALLBACK_MINGALAR: MingalarItem[] = [
  { id: "m1", _id: "m1", title: "Fine Dining", desc: "Premium buffet with international cuisine and a la carte menu", icon: "🍽️", img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609571752_1e7bt9-fine-dining-4jxXMQKzbQzKIbXm4mcE1z3zQR0oJM.jpg", slug: "fine-dining" },
  { id: "m2", _id: "m2", title: "Open Bar", desc: "Complimentary premium drinks, cocktails and mocktails", icon: "🍸", img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609572987_j5u2mo-open-bar-hxaaHaxfeopFIZLffZWqTuWxukB3PU.jpg", slug: "open-bar" },
  { id: "m3", _id: "m3", title: "Workspace", desc: "High-speed WiFi, work stations and private meeting pods", icon: "💻", img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609574070_alr2wx-workspace-YQe7TYFmvPD3EGLaSpVrT2fYJT7RqJ.jpg", slug: "workspace" },
  { id: "m4", _id: "m4", title: "Shower Suites", desc: "Refresh with premium toiletries before your flight", icon: "🚿", img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609575245_w0hq5r-shower-suites-KIW0G94JlVbzJpyaA6szYb6IF1uah7.jpg", slug: "shower-suites" },
  { id: "m5", _id: "m5", title: "Business Center", desc: "Meeting rooms, printing and executive services", icon: "💼", img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609576449_bra3sd-business-center-6YrWwQ9wheGpdtcqdLvdsbo1oL5R9T.jpg", slug: "business-center" },
  { id: "m6", _id: "m6", title: "VIP Lounge", desc: "Exclusive VIP area with personalized butler service", icon: "👑", img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609577709_scuw7m-vip-lounge-O01NOtpjZppBUGNp37lGP7MLx4g8yv.jpg", slug: "vip-lounge" },
  { id: "m7", _id: "m7", title: "Nap Pods", desc: "Private sleeping pods for restful pre-flight naps", icon: "😴", img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609578940_mfhzqa-nap-pods-Bz8sXDKlTJj8UNWi0XnaW8fwA0Oluz.jpg", slug: "nap-pods" },
  { id: "m8", _id: "m8", title: "Concierge", desc: "Priority check-in, boarding and personalized assistance", icon: "🛎️", img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609580087_1bkb16-concierge-VB9tbHBZZcIjevepAWjyO5YzsNpbbn.jpg", slug: "concierge" },
];

export default function MingalarDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [travelers, setTravelers] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [item, setItem] = useState<MingalarItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mingalar', { cache: 'no-store' })
      .then(r => r.json())
      .then((j: any) => {
        const data: MingalarItem[] = (j && (j.data || j)) || [];
        const items = [...data, ...FALLBACK_MINGALAR];
        const found = items.find(
          (d: MingalarItem) =>
            d.slug === slug ||
            d.id === slug ||
            d._id === slug ||
            (d.title || '').toLowerCase().replace(/\s+/g, '-') === slug
        );
        setItem(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTravelDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60 text-lg">Loading...</div>
      </div>
    );
  }

  if (!item) {
    notFound();
  }

  const handleBookNow = () => {
    const bookUrl = new URL('/book-now', window.location.origin);
    bookUrl.searchParams.set('type', 'mingalar');
    bookUrl.searchParams.set('title', item.title);
    bookUrl.searchParams.set('travelers', String(travelers));
    bookUrl.searchParams.set('travelDate', travelDate);
    window.location.href = bookUrl.toString();
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Image */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <img
          src={item.img}
          alt={item.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8">
          <Link href="/mingalar" className="text-white/60 hover:text-[#D4AF37] text-sm mb-3 inline-block transition">
            ← Back to Mingalar
          </Link>
          <h1 className="text-5xl font-light text-white mb-2">{item.title}</h1>
          <p className="text-white/60 text-lg">{item.desc}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Details */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">{item.icon}</span>
              <h2 className="text-2xl text-white font-light">{item.title}</h2>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">{item.desc}</p>
          </div>

          {/* Booking Card */}
          <div className="w-full md:w-80 bg-[#0A1628] border border-white/10 rounded-2xl p-6 h-fit sticky top-24">
            <h3 className="text-white font-semibold text-lg mb-4">Book Now</h3>

            <div className="space-y-4">
              <div>
                <label className="text-white/50 text-xs mb-1 block">Date</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={e => setTravelDate(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div>
                <label className="text-white/50 text-xs mb-1 block">Travelers</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="w-10 h-10 rounded-lg border border-white/10 text-white hover:border-[#D4AF37] transition"
                  >
                    −
                  </button>
                  <span className="text-white text-lg w-8 text-center">{travelers}</span>
                  <button
                    onClick={() => setTravelers(travelers + 1)}
                    className="w-10 h-10 rounded-lg border border-white/10 text-white hover:border-[#D4AF37] transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full bg-[#D4AF37] text-[#0A1628] py-3 rounded-xl font-semibold hover:bg-[#C4A030] transition mt-2"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
