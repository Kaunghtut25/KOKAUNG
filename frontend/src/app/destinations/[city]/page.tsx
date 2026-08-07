'use client';

﻿import React, { useState, useEffect, useMemo } from 'react';
import Link from "next/link";
import { useRouter, useParams } from 'next/navigation';
import BackButton from '@/components/BackButton';
import Calendar from '@/components/Calendar';
import CurrencyToggle from '@/components/CurrencyToggle';
import DestImage from "./DestImage";
import { useI18n } from "@/lib/i18n";
import { mmLookup, mmDestinations } from "@/lib/mm-content";

/* FIX: 2026-07-30 add-rating-reviews-tags-duration-to-detail-page */

interface PopularDestination {
  city: string;
  country: string;
  image: string;
  minPrice: string;
  rating?: number;
  reviews?: number;
  duration?: string;
  tags?: string[];
  bestTime?: string;
  description?: string;
  highlights?: string[];
}

const DEST_HERO = "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609663178_ta1biy-bangkok-x7Q8kUMuXRvj6qMJAZxBbawKS4zkjI.jpg";

const FALLBACK_DESTINATIONS: PopularDestination[] = [
  {
    city: "Paris", country: "France",
    image: "/images_v2/dest-paris-v2.jpg",
    minPrice: "Ks 850,000",
    rating: 4.8, reviews: 2340, duration: "5 Days",
    tags: ["Luxury", "Romance", "Culture"],
    bestTime: "April to June and September to October",
    description: "Iconic Eiffel Tower, Louvre Museum, Seine River cruises and world-class cuisine. Paris is the city of love, lights, and timeless elegance.",
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame", "Montmartre", "Seine River Cruise", "Champs-Elysees"],
  },
  {
    city: "Dubai", country: "United Arab Emirates",
    image: "/images_v2/dest-dubai-v2.jpg",
    minPrice: "Ks 680,000",
    rating: 4.7, reviews: 1890, duration: "4 Days",
    tags: ["Luxury", "Shopping", "Modern"],
    bestTime: "November to March (mild weather)",
    description: "Burj Khalifa, desert safaris, gold souks and futuristic architecture. Dubai is a city of superlatives with the tallest building and largest mall.",
    highlights: ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Desert Safari", "Dubai Marina", "Gold Souk"],
  },
  {
    city: "Seoul", country: "South Korea",
    image: "/images_v2/dest-korea-v2.jpg",
    minPrice: "Ks 550,000",
    rating: 4.6, reviews: 1560, duration: "6 Days",
    tags: ["Culture", "Food", "K-Pop"],
    bestTime: "March to May and September to November",
    description: "Ancient palaces, vibrant street food, K-pop culture and stunning cherry blossoms. Seoul is a dynamic city where ancient palaces sit alongside modern culture.",
    highlights: ["Gyeongbokgung Palace", "Bukchon Hanok Village", "Myeongdong Shopping", "N Seoul Tower", "Hongdae", "Korean Street Food"],
  },
  {
    city: "Bangkok", country: "Thailand",
    image: "/images_v2/hero-thailand-v2.jpg",
    minPrice: "Ks 150,000",
    rating: 4.5, reviews: 3210, duration: "4 Days",
    tags: ["Beach", "Temple", "Food"],
    bestTime: "November to February (cool season)",
    description: "Golden temples, pristine beaches, floating markets and warm Thai hospitality. Bangkok is a vibrant metropolis where ancient temples meet modern skyscrapers.",
    highlights: ["Grand Palace", "Wat Arun", "Floating Markets", "Chatuchak Weekend Market", "Khao San Road", "Thai Street Food"],
  },
  {
    city: "Singapore", country: "Singapore",
    image: "/images_v2/hero-singapore-v2.jpg",
    minPrice: "Ks 250,000",
    rating: 4.7, reviews: 1980, duration: "3 Days",
    tags: ["Modern", "Food", "Shopping"],
    bestTime: "February to April (dry season)",
    description: "Marina Bay Sands, Gardens by the Bay, hawker food paradise. Singapore is a dazzling city-state of futuristic architecture and multicultural neighborhoods.",
    highlights: ["Marina Bay Sands", "Gardens by the Bay", "Sentosa Island", "Universal Studios", "Chinatown", "Orchard Road"],
  },
  {
    city: "Tokyo", country: "Japan",
    image: "/images_v2/dest-japan-v2.jpg",
    minPrice: "Ks 780,000",
    rating: 4.9, reviews: 2870, duration: "7 Days",
    tags: ["Culture", "Food", "Nature"],
    bestTime: "March to May (cherry blossom) or October to November (autumn)",
    description: "Ancient temples, bullet trains, cherry blossoms, exquisite cuisine. Tokyo blends ultramodern technology with ancient traditions.",
    highlights: ["Shibuya Crossing", "Meiji Shrine", "Tsukiji Fish Market", "Akihabara", "Harajuku", "Tokyo Tower"],
  },
  {
    city: "Bali", country: "Indonesia",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609670120_iixb10-bali-e92X2ozIcinwD996tg4B5u2BXS0cdz.jpg",
    minPrice: "From Ks 180,000",
    rating: 4.6, reviews: 1230, duration: "5 Days",
    tags: ["Beach", "Nature", "Culture"],
    bestTime: "April to October (dry season)",
    description: "Bali is the Island of Gods, offering stunning beaches, lush rice terraces, ancient temples, and a vibrant arts scene. Perfect for relaxation and cultural exploration.",
    highlights: ["Ubud Rice Terraces", "Tanah Lot Temple", "Seminyak Beach", "Uluwatu Cliff Temple", "Monkey Forest", "Balinese Spa"],
  },
  {
    city: "Maldives", country: "Maldives",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609671009_3evgmu-maldives-hypfQQJCg06kuyANjh41tsEh3jJ1iZ.jpg",
    minPrice: "From Ks 380,000",
    rating: 4.9, reviews: 890, duration: "4 Days",
    tags: ["Beach", "Luxury", "Romance"],
    bestTime: "November to April (dry season)",
    description: "The Maldives is a tropical paradise of overwater villas, crystal-clear lagoons, and pristine white-sand beaches. The ultimate luxury getaway.",
    highlights: ["Overwater Villas", "Snorkeling", "Dolphin Watching", "Sandbank Picnics", "Underwater Restaurant", "Sunset Cruises"],
  },
  {
    city: "Yangon", country: "Myanmar",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609672110_hoxenr-yangon-ZR2KEYFv4nTcNHRSbkTYE73ZoXIegP.jpg",
    minPrice: "From Ks 80,000",
    rating: 4.3, reviews: 670, duration: "3 Days",
    tags: ["Culture", "History", "Temple"],
    bestTime: "November to February (cool season)",
    description: "Yangon is Myanmar''s largest city and former capital, home to the magnificent Shwedagon Pagoda. Explore colonial architecture and authentic Burmese cuisine.",
    highlights: ["Shwedagon Pagoda", "Bogyoke Market", "Kandawgyi Lake", "Colonial Buildings", "Chinatown", "Burmese Tea Shops"],
  },
  {
    city: "Bagan", country: "Myanmar",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609673423_cxib2z-bagan-XuauRMTtDqUuuRh7T11ier0WFheWOP.jpg",
    minPrice: "From Ks 95,000",
    rating: 4.7, reviews: 540, duration: "3 Days",
    tags: ["History", "Culture", "Nature"],
    bestTime: "November to February (cool season)",
    description: "Bagan is an archaeological wonderland with over 2,000 ancient temples spread across a vast plain. Hot air balloon rides at sunrise offer unforgettable views.",
    highlights: ["Ananda Temple", "Shwezigon Pagoda", "Sunrise Ballooning", "E-Bike Temple Tour", "Irrawaddy River Sunset", "Lacquerware Workshops"],
  },
  {
    city: "Ho Chi Minh City", country: "Vietnam",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609674645_4crguu-ho-chi-minh-city-BcBT3Ux26O1qAcrfZ3qiJWRIqtF9tM.jpg",
    minPrice: "From Ks 105,000",
    rating: 4.4, reviews: 780, duration: "4 Days",
    tags: ["Food", "History", "Culture"],
    bestTime: "December to April (dry season)",
    description: "Ho Chi Minh City (Saigon) is Vietnam''s economic powerhouse with vibrant energy. Explore the Cu Chi Tunnels, taste amazing pho, and experience the buzzing nightlife.",
    highlights: ["Cu Chi Tunnels", "Ben Thanh Market", "War Remnants Museum", "Notre-Dame Basilica", "Bui Vien Walking Street", "Vietnamese Coffee"],
  },
  {
    city: "Kuala Lumpur", country: "Malaysia",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609676271_plrv46-kuala-lumpur-9BY1o9HTEVFgEy8zC00KyY98WYR3Ze.jpg",
    minPrice: "From Ks 150,000",
    rating: 4.5, reviews: 920, duration: "4 Days",
    tags: ["Modern", "Food", "Shopping"],
    bestTime: "May to July and December to February",
    description: "Kuala Lumpur is a melting pot of cultures with the iconic Petronas Twin Towers, colorful Batu Caves, and incredible street food from Malay, Chinese, and Indian traditions.",
    highlights: ["Petronas Twin Towers", "Batu Caves", "Jalan Alor Food Street", "Bukit Bintang", "Merdeka Square", "KL Bird Park"],
  },
];

function toSlug(text: string): string {
  return (text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function DestinationPage() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const routeParams = useParams();
  const cityParam = (routeParams?.city as string) || '';

  // ─── Booking sidebar state ───
  const [currency, setCurrency] = useState<'MMK' | 'USD'>('MMK');
  const [travelers, setTravelers] = useState(1);
  const [travelDate, setTravelDate] = useState('');

  const key = cityParam.toLowerCase();
  const [rawStoreDest, setRawStoreDest] = useState<PopularDestination | null>(null);
  const storeDest = useMemo(() => {
    if (lang !== "mm" || !rawStoreDest) return rawStoreDest;
    return { ...rawStoreDest, ...mmLookup(mmDestinations, rawStoreDest) };
  }, [rawStoreDest, lang]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('/api/destinations');
        const d = await r.json();
        const arr = Array.isArray(d) ? d : (d.data || d.items || []);
        const found = arr.find((x: any) => toSlug(x.city || x.name || '') === key || (x.slug || '') === key);
        if (found && !cancelled) {
          setRawStoreDest({
            city: found.city || found.name || '',
            country: found.country || '',
            image: found.image || '',
            minPrice: found.minPrice || '',
            rating: found.rating,
            reviews: found.reviews,
            duration: found.duration,
            tags: found.tags,
            bestTime: found.bestTime,
            description: found.description,
            highlights: found.highlights,
          });
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [key]);

  const fallbackDest = FALLBACK_DESTINATIONS.find(
    (d) => toSlug(d.city) === key
  );
  const dest = storeDest || fallbackDest;

  if (!dest) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0A1628] mb-2">{t("dest.notFound")}</h1>
          <p className="text-gray-500 mb-4">{t("dest.notFoundDesc")}</p>
          <Link href="/destinations" className="text-[#D4AF37] hover:underline font-semibold">
            {lang === "mm" ? "← ခရီးစဉ်များသို့ ပြန်သွားရန်" : "← Back to Destinations"}
          </Link>
        </div>
      </div>
    );
  }

  const rating = dest.rating ?? 4.5;
  const reviews = dest.reviews ?? 1000;
  const duration = dest.duration ?? "5 Days";
  const tags = dest.tags ?? [];

  // Parse numeric price from minPrice string like "Ks 850,000" or "From Ks 150,000"
  const parsePriceMMK = (priceStr: string): number => {
    const match = priceStr.match(/([\d,]+)/);
    if (!match) return 0;
    return parseInt(match[1].replace(/,/g, ''), 10);
  };

  const priceMMK = parsePriceMMK(dest.minPrice);
  const priceUSD = Math.round(priceMMK / 2100);
  const price = currency === 'MMK' ? priceMMK : priceUSD;
  const currencySymbol = currency === 'MMK' ? 'Ks' : '$';
  const totalPrice = price * travelers;

  const highlights = dest.highlights || (dest.description
    ? dest.description.split(/[,.]/).map(s => s.trim()).filter(s => s.length > 0).slice(0, 6)
    : []);

  const handleBookNow = () => {
    const bookUrl = new URL('/book-now', window.location.origin);
    bookUrl.searchParams.set('type', 'destination');
    bookUrl.searchParams.set('title', dest.city);
    bookUrl.searchParams.set('destination', dest.country);
    bookUrl.searchParams.set('duration', dest.duration || '');
    bookUrl.searchParams.set('price', String(price));
    bookUrl.searchParams.set('currency', currency);
    window.location.href = bookUrl.toString();
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Back Button - absolute positioned over hero */}
      <div className="absolute top-4 left-4 z-30">
        <BackButton label={t("dest.backToDestinations")} />
      </div>

      {/* Hero Section */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <DestImage
          src={dest.image || DEST_HERO}
          alt={dest.city}
          fallback={DEST_HERO}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
          <p className="text-white/70 text-sm uppercase tracking-widest mb-1">
            {dest.country}
          </p>
          <h1
            className="text-3xl md:text-5xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {dest.city}
          </h1>
        </div>
      </div>

      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 text-sm">
        <Link href="/" className="text-gray-500 hover:text-[#D4AF37]">{t("dest.home")}</Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link href="/destinations" className="text-gray-500 hover:text-[#D4AF37]">{t("dest.destinations")}</Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-[#0A1628] font-medium">{dest.city}</span>
      </nav>

      {/* Info Card - Rating, Reviews, Duration, Price, Tags */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-wrap items-center justify-between gap-4">
          {/* Rating + Reviews */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < Math.round(rating) ? 'text-[#D4AF37]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div>
              <p className="text-[#0A1628] font-bold text-lg">{rating}</p>
              <p className="text-gray-400 text-xs">({reviews.toLocaleString()} {lang === "mm" ? "သုံးသပ်ချက်" : "reviews"})</p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-10 bg-gray-200" />

          {/* Duration */}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-[#0A1628] font-bold text-lg">{duration}</p>
              <p className="text-gray-400 text-xs">{t("dest.duration")}</p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-10 bg-gray-200" />

          {/* Price */}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-[#D4AF37] font-bold text-lg">{dest.minPrice}</p>
              <p className="text-gray-400 text-xs">{t("dest.perPerson")}</p>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <>
              <div className="hidden lg:block w-px h-10 bg-gray-200" />
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#B8960F] text-xs font-medium border border-[#D4AF37]/20">
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Book Now Button */}
          <button
            onClick={handleBookNow}
            className="ml-auto inline-flex items-center gap-2 px-6 py-3 rounded-xl text-center font-bold text-sm bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:scale-[1.02] transition-all duration-300"
          >
            {t("common.bookNow")}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            {dest.description && (
              <section>
                <h2 className="text-2xl font-bold text-[#0A1628] mb-4">
                  About {dest.city}
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {dest.description}
                </p>
                {highlights.length > 0 && (
                  <p className="text-gray-600 leading-relaxed mt-3 text-lg">
                    Must-see experiences include {highlights.slice(0, 5).join(", ")} — perfect for
                    first-time visitors and returning travelers alike. Whether you prefer
                    guided sightseeing, cultural tours, or free time to explore at your own
                    pace, we can tailor the perfect itinerary for you.
                  </p>
                )}
              </section>
            )}

            {highlights.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-[#0A1628] mb-6">
                  Top Highlights
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-[#D4AF37]/30 transition-colors"
                    >
                      <span className="w-8 h-8 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </span>
                      <span className="text-gray-800 font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {dest.bestTime && (
              <section className="bg-gradient-to-r from-[#D4AF37]/5 to-[#D4AF37]/10 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-[#0A1628] mb-2">
                  {lang === "mm" ? "လည်ပတ်ရန် အကောင်းဆုံးအချိန်" : "Best Time to Visit"}
                </h2>
                <p className="text-gray-700 text-lg">{dest.bestTime}</p>
                <p className="text-gray-600 leading-relaxed mt-3 text-lg">
                  During this window the weather is at its most pleasant for sightseeing, with
                  comfortable temperatures and clearer skies. Popular periods can get busy, so
                  we recommend booking your flights and hotel early to lock in the best rates
                  and availability for your trip to {dest.city}.
                </p>
              </section>
            )}
          </div>

          {/* Sidebar — Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-6">
                {/* Price */}
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{t("dest.startingFrom")}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {currencySymbol} {price.toLocaleString()}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">{t("dest.perPersonShort")}</span>
                    </div>
                    <CurrencyToggle activeCurrency={currency} onToggle={setCurrency} />
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Quick info */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("dest.duration")}</span>
                    <span className="text-[#0A1628] font-medium">{duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("dest.groupSize")}</span>
                    <span className="text-[#0A1628] font-medium">{t("dest.upToPeople", { n: 10 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("dest.rating")}</span>
                    <span className="text-[#0A1628] font-medium flex items-center gap-1">
                      <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {rating}
                    </span>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Booking form */}
                <div className="space-y-4">
                  <div>
                                        <Calendar
                      value={travelDate}
                      onChange={setTravelDate}
                      label={t("dest.travelDate")}
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs mb-1.5 block">{t("dest.travelers")}</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        className="w-9 h-9 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-[#D4AF37] transition-all flex items-center justify-center text-lg"
                      >
                        −
                      </button>
                      <span className="w-12 text-center text-[#0A1628] font-bold text-lg">{travelers}</span>
                      <button
                        type="button"
                        onClick={() => setTravelers(travelers + 1)}
                        className="w-9 h-9 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-[#D4AF37] transition-all flex items-center justify-center text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-3 border-t border-gray-100">
                  <span className="text-gray-700 font-medium">{t("dest.total")}</span>
                  <span className="text-2xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {currencySymbol} {totalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Book Now */}
                <button
                  onClick={handleBookNow}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5A623] hover:from-[#E5C048] hover:to-[#FFB833] text-[#0A1628] font-bold text-base shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 transition-all duration-300 active:scale-[0.98]"
                >
                  {t("common.bookNow")}
                </button>

                <p className="text-center text-gray-400 text-xs">{t("dest.noPayment")}</p>
              </div>

              {/* Back link */}
              <Link
                href="/destinations"
                className="block w-full py-3 rounded-xl text-center font-semibold text-sm border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A1628] transition-all duration-300"
              >
                {lang === "mm" ? "← ခရီးစဉ်များအားလုံးသို့ ပြန်သွားရန်" : "← Back to All Destinations"}
              </Link>

              {/* Trip Style tags */}
              {tags.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
                  <h3 className="text-sm font-bold text-[#0A1628] mb-3 uppercase tracking-wider">{t("dest.tripStyle")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-full bg-[#D4AF37]/10 text-[#B8960F] text-sm font-medium border border-[#D4AF37]/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related destinations removed per user request — "Discover {city}" showed other cities */}

        {/* Bottom CTA */}
        <section className="text-center py-12">
          <h2 className="text-2xl font-bold text-[#0A1628] mb-4">
            {t("dest.readyToExplore", { city: dest.city })}
          </h2>
          <p className="text-gray-500 mb-6 max-w-xl mx-auto">
            {t("dest.ctaDesc", { city: dest.city })}
          </p>
          <button
            onClick={handleBookNow}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-center font-bold text-base bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:scale-[1.02] transition-all duration-300"
          >
            {t("dest.bookTrip", { city: dest.city })}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </section>
      </div>
    </main>
  );
}