'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BackButton from '@/components/BackButton';
import Calendar from '@/components/Calendar';
import SocialShare from '@/components/SocialShare';
import { useI18n } from "@/lib/i18n";
import { mmLookup, mmMingalar } from "@/lib/mm-content";

export const dynamic = 'force-dynamic';

interface MingalarItem {
  id?: string; _id?: string;
  title: string; desc: string; icon: string; img: string;
  slug?: string;
}

const FALLBACK_MINGALAR: MingalarItem[] = [
  { id: "m1", _id: "m1", title: "Fine Dining", desc: "Premium buffet with international cuisine and a la carte menu", icon: "🍽️", img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609571752_1e7bt9-fine-dining-4jxXMQKzbQzKIbXm4mcE1z3zQR0oJM.jpg", slug: "fine-dining" },
  { id: "m2", _id: "m2", title: "Open Bar", desc: "Complementary premium drinks, cocktails and mocktails", icon: "🍸", img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609572987_j5u2mo-open-bar-hxaaHaxfeopFIZLffZWqTuWxukB3PU.jpg", slug: "open-bar" },
  { id: "m3", _id: "m3", title: "Workspace", desc: "High-speed WiFi, work stations and private meeting pods", icon: "💼", img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609574070_alr2wx-workspace-YQe7TYFmvPD3EGLaSpVrT2fYJT7RqJ.jpg", slug: "workspace" },
  { id: "m4", _id: "m4", title: "Shower Suites", desc: "Refresh with premium toiletries before your flight", icon: "🚿", img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609575245_w0hq5r-shower-suites-KIW0G94JlVbzJpyaA6szYb6IF1uah7.jpg", slug: "shower-suites" },
  { id: "m5", _id: "m5", title: "Business Center", desc: "Meeting rooms, printing and executive services", icon: "🖥️", img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609576449_bra3sd-business-center-6YrWwQ9wheGpdctcqdLvdsbo1oL5R9T.jpg", slug: "business-center" },
  { id: "m6", _id: "m6", title: "VIP Lounge", desc: "Exclusive VIP area with personalized butler service", icon: "👑", img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609577709_scuw7m-vip-lounge-O01NOtpjZppBUGNp37lGP7MLx4g8yv.jpg", slug: "vip-lounge" },
  { id: "m7", _id: "m7", title: "Nap Pods", desc: "Private sleeping pods for restful pre-flight naps", icon: "😴", img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609578940_mfhzqa-nap-pods-Bz8sXDKlTJj8UNWi0XnaW8fwA0Oluz.jpg", slug: "nap-pods" },
  { id: "m8", _id: "m8", title: "Concierge", desc: "Priority check-in, boarding and personalized assistance", icon: "🛎️", img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609580087_1bkb16-concierge-VB9tbHBZZcIjevepAWjyO5YzsNpbbn.jpg", slug: "concierge" },
];

export default function MingalarDetailPage({ params }: { params: { slug: string } }) {
  const { t, lang } = useI18n();
  const slug = params.slug;
  const [rawItem, setRawItem] = useState<MingalarItem | null>(null);
  const item = useMemo(() => {
    if (lang !== "mm" || !rawItem) return rawItem;
    return { ...rawItem, ...mmLookup(mmMingalar, rawItem) };
  }, [rawItem, lang]);
  const [loading, setLoading] = useState(true);
  const [travelers, setTravelers] = useState(1);
  const [travelDate, setTravelDate] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/mingalar', { cache: 'no-store' })
      .then(r => r.json())
      .then((j: any) => {
        if (cancelled) return;
        const data: MingalarItem[] = (j && (j.data || j)) || [];
        const list = [...data, ...FALLBACK_MINGALAR];
        const found = list.find(
          (d: MingalarItem) =>
            d.slug === slug ||
            d.id === slug ||
            d._id === slug ||
            (d.title || '').toLowerCase().replace(/\s+/g, '-') === slug
        );
        setRawItem(found || null);
      })
      .catch(() => { if (!cancelled) setRawItem(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTravelDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-24 text-center">
        <div className="text-gray-500 py-16">{t("mingalar.loading")}</div>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-white pt-24 text-center">
        <BackButton />
        <h1 className="text-4xl font-bold text-[#0A1628] mb-4">{t("mingalar.notFound")}</h1>
        <p className="text-gray-600 mb-8">{t("mingalar.notFoundDesc")}</p>
        <Link href="/mingalar" className="text-[#8A6C0B] font-semibold hover:underline">← {t("mingalar.backToMingalar")}</Link>
      </main>
    );
  }

  const name = item.title || '';
  const desc = item.desc || '';
  const heroImg = item.img || FALLBACK_MINGALAR.find(f => f.title === name)?.img || '/images_v2/hero-cruises-v2.jpg';

  const handleBookNow = () => {
    const bookUrl = new URL('/book-now', window.location.origin);
    bookUrl.searchParams.set('type', 'mingalar');
    bookUrl.searchParams.set('title', name);
    bookUrl.searchParams.set('travelers', String(travelers));
    bookUrl.searchParams.set('travelDate', travelDate);
    window.location.href = bookUrl.toString();
  };

  return (
    <main className="min-h-screen bg-white">
      <BackButton label={t("mingalar.backToMingalar")} />

      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <Image src={heroImg} alt={name} width={1200} height={630} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_70%)]" />
        <Link href="/mingalar" className="absolute top-6 left-4 md:top-8 md:left-8 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all text-sm">
          ← {t("mingalar.backToMingalar")}
        </Link>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold border border-[#D4AF37]/30 backdrop-blur-sm">
                {item.icon} {t("mingalar.skyLounge")}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 text-white/80 text-xs font-semibold border border-[#D4AF37]/30 backdrop-blur-sm">
                Airport Lounge
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {name}
            </h1>
            <p className="text-white/60 text-base md:text-lg">{desc}</p>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm">
        <Link href="/" className="text-gray-500 hover:text-[#D4AF37]">{t("mingalar.home")}</Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link href="/mingalar" className="text-gray-500 hover:text-[#D4AF37]">{t("mingalar.mingalar")}</Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-[#0A1628] font-medium">{name}</span>
      </nav>

      <SocialShare url={typeof window !== "undefined" ? window.location.href : ""} title={"A9 Global Travel - Mingalar Sky Lounge"} />

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                <span className="text-3xl">{item.icon}</span>
                <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">{t("mingalar.experience")}</p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-[#8A6C0B] text-2xl font-bold">{t("mingalar.mingalar")}</p>
                <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">{t("mingalar.location")}</p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <p className="text-[#8A6C0B] text-2xl font-bold">{t("mingalar.skyLounge")}</p>
                <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">{t("mingalar.category")}</p>
              </div>
            </div>

            {/* Description */}
            {desc && (
              <div>
                <h2 className="text-2xl font-bold text-[#0A1628] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {t("mingalar.aboutExperience")}
                </h2>
                <p className="text-gray-600 leading-relaxed text-base">{desc}</p>
              </div>
            )}

            {/* Details Card */}
            <div className="bg-[#0A1628] rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {t("mingalar.experienceDetails")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">{t("mingalar.category")}</p>
                    <p className="text-white font-medium">{t("mingalar.skyLounge")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">{t("mingalar.location")}</p>
                    <p className="text-white font-medium">{t("mingalar.mingalar")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0 text-xl">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">{t("mingalar.signature")}</p>
                    <p className="text-white font-medium">{name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Interactive Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="rounded-2xl border border-[#D4AF37]/20 bg-white p-6 space-y-5 shadow-lg shadow-[#D4AF37]/5 mb-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-[#8A6C0B]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {t("mingalar.mingalar")} {t("mingalar.skyLounge")}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">{t("common.perPerson")}</span>
                  </div>
                </div>
                <hr className="border-[#D4AF37]/10" />

                {/* Info Rows */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">{t("mingalar.category")}</span>
                    <span className="text-[#0A1628] font-medium">{t("mingalar.skyLounge")}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">{t("mingalar.location")}</span>
                    <span className="text-[#0A1628] font-medium">{t("mingalar.mingalar")}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">{t("mingalar.groupSize")}</span>
                    <span className="text-[#0A1628] font-medium">{t("mingalar.upToPeople", { n: 12 })}</span>
                  </div>
                </div>
                <hr className="border-[#D4AF37]/10" />

                {/* Booking Form */}
                <div className="space-y-3">
                  <div>
                    <Calendar value={travelDate} onChange={setTravelDate} label={t("mingalar.travelDate")} />
                  </div>
                  <div>
                    <label className="text-gray-600 text-xs mb-1 block">{t("mingalar.travelers")}</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        className="w-9 h-9 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-12 text-center text-[#0A1628] font-semibold">{travelers}</span>
                      <button
                        type="button"
                        onClick={() => setTravelers(Math.min(12, travelers + 1))}
                        className="w-9 h-9 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Book Now Button */}
                <button
                  onClick={handleBookNow}
                  className="block w-full py-3.5 rounded-xl text-center font-bold text-lg bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:scale-[1.02] transition-all duration-300 active:scale-[0.98]"
                >
                  {t("common.bookNow")}
                </button>
                <p className="text-center text-gray-500 text-xs">{t("mingalar.noPayment")}</p>
              </div>

              {/* Back Link */}
              <Link
                href="/mingalar"
                className="block w-full py-3 rounded-xl text-center font-semibold text-sm border-2 border-[#D4AF37] text-[#8A6C0B] hover:bg-[#D4AF37] hover:text-[#0A1628] transition-all duration-300"
              >
                ← {t("mingalar.backToAll")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
