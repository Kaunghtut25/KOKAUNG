"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ScrollingRow from "./ScrollingRow";

const FALLBACK_IMG = "/images_v2/cta-bg-v2.jpg";

const FALLBACK_DESTS = [
  { city: "Paris", country: "France", image: "/images_v2/dest-paris-v2.jpg", minPrice: "Ks 850,000", rating: 4.8, reviews: 2340, duration: "5 Days", tags: ["Luxury", "Romance", "Culture"], description: "Iconic Eiffel Tower, Louvre Museum, Seine River cruises and world-class cuisine." },
  { city: "Dubai", country: "United Arab Emirates", image: "/images_v2/dest-dubai-v2.jpg", minPrice: "Ks 680,000", rating: 4.7, reviews: 1890, duration: "4 Days", tags: ["Luxury", "Shopping", "Modern"], description: "Burj Khalifa, desert safaris, gold souks and futuristic architecture." },
  { city: "Seoul", country: "South Korea", image: "/images_v2/dest-korea-v2.jpg", minPrice: "Ks 550,000", rating: 4.6, reviews: 1560, duration: "6 Days", tags: ["Culture", "Food", "K-Pop"], description: "Ancient palaces, vibrant street food, K-pop culture and stunning cherry blossoms." },
  { city: "Bangkok", country: "Thailand", image: "/images_v2/hero-thailand-v2.jpg", minPrice: "Ks 150,000", rating: 4.5, reviews: 3210, duration: "4 Days", tags: ["Beach", "Temple", "Food"], description: "Golden temples, pristine beaches, floating markets and warm Thai hospitality." },
  { city: "Singapore", country: "Singapore", image: "/images_v2/hero-singapore-v2.jpg", minPrice: "Ks 250,000", rating: 4.7, reviews: 1980, duration: "3 Days", tags: ["Modern", "Food", "Shopping"], description: "Marina Bay Sands, Gardens by the Bay, hawker food paradise." },
  { city: "Tokyo", country: "Japan", image: "/images_v2/dest-japan-v2.jpg", minPrice: "Ks 780,000", rating: 4.9, reviews: 2870, duration: "7 Days", tags: ["Culture", "Food", "Nature"], description: "Ancient temples, bullet trains, cherry blossoms, exquisite cuisine." },

];

// Map old country-name cities from Redis to correct city names for detail page matching
const CITY_FIX_MAP: Record<string, string> = {
  "Korea": "Seoul",
  "Thailand": "Bangkok",
  "Japan": "Tokyo",
  "Vietnam": "Ho Chi Minh City"
};

function DestinationCard({ dest, destText = {} }: { dest: { city: string; country: string; image: string; minPrice: string; rating?: number; reviews?: number; duration?: string; tags?: string[]; description?: string } }) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/destinations/" + encodeURIComponent(dest.city.toLowerCase().replace(/\s+/g, "-")))}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer h-full"
      style={{ perspective: "1200px" }}
    >
      <div
        className={`relative rounded-2xl overflow-hidden bg-white h-full flex flex-col transition-all duration-500 ease-out ${
          isHovered ? "shadow-2xl shadow-black/30 -translate-y-2" : "shadow-lg shadow-black/10"
        }`}
        style={{
          transformStyle: "preserve-3d",
          transform: isHovered ? "rotateX(2deg) translateZ(6px)" : "rotateX(0deg) translateZ(0)",
        }}
      >
        {/* Gold bracket frame - top left */}
        <div className="absolute top-0 left-0 z-30 pointer-events-none">
          <div className="absolute top-0 left-0 h-[10px] w-[55px] bg-gradient-to-r from-[#D4AF37] via-[#D4AF37] to-transparent rounded-tl-xl shadow-[0_2px_6px_rgba(212,175,55,0.35)]" />
          <div className="absolute top-0 left-0 w-[10px] h-[40px] bg-gradient-to-b from-[#D4AF37] via-[#D4AF37] to-transparent rounded-tl-xl shadow-[2px_0_6px_rgba(212,175,55,0.25)]" />
          <div className="absolute top-[1px] left-[1px] w-[7px] h-[7px] bg-[#F5A623] rounded-full shadow-[0_0_4px_rgba(245,166,35,0.6)]" />
        </div>
        {/* Gold bracket frame - top right */}
        <div className="absolute top-0 right-0 z-30 pointer-events-none">
          <div className="absolute top-0 right-0 h-[10px] w-[55px] bg-gradient-to-l from-[#D4AF37] via-[#D4AF37] to-transparent rounded-tr-xl shadow-[0_2px_6px_rgba(212,175,55,0.35)]" />
          <div className="absolute top-0 right-0 w-[10px] h-[40px] bg-gradient-to-b from-[#D4AF37] via-[#D4AF37] to-transparent rounded-tr-xl shadow-[-2px_0_6px_rgba(212,175,55,0.25)]" />
          <div className="absolute top-[1px] right-[1px] w-[7px] h-[7px] bg-[#F5A623] rounded-full shadow-[0_0_4px_rgba(245,166,35,0.6)]" />
        </div>

        {/* Image Section */}
        <div className="relative h-[280px] w-full overflow-hidden bg-gray-200">
          {!imgError ? (
            <img
              src={dest.image}
              alt={dest.city}
              className="w-full h-full object-cover transition-transform duration-700 ease-out"
              style={{ position: "absolute", inset: 0, transform: isHovered ? "scale(1.08)" : "scale(1)" }}
              onError={() => setImgError(true)}
              loading="eager"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] to-[#1a2744] flex items-center justify-center">
              <div className="text-center">
                <span className="text-3xl mb-2 block">📍</span>
                <span className="text-[#D4AF37] text-sm font-semibold block">{dest.city}</span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
          <div className="absolute top-7 left-3 z-20">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#0A1628]/85 text-[#D4AF37] text-[11px] font-semibold backdrop-blur-sm border border-[#D4AF37]/40 shadow-lg shadow-black/30">
              📍 {dest.city}
            </span>
          </div>
          <div className="absolute top-7 right-3 z-20">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[11px] font-medium backdrop-blur-sm border border-white/15">
              {dest.country}
            </span>
          </div>
        </div>

        {/* Navy-to-White Gradient */}
        <div className="h-4 bg-gradient-to-b from-[#0A1628] to-white" />

        {/* Info */}
        <div className="px-4 pt-2 pb-1 space-y-1.5 flex-1">
          <h3
            className="text-[#0A1628] text-base font-bold leading-tight line-clamp-1 group-hover:text-[#D4AF37] transition-colors duration-300"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {dest.city}
          </h3>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <svg key={i} className={`w-3 h-3 ${i < Math.round(dest.rating || 4.5) ? 'text-[#D4AF37]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-400 text-[10px]">({(dest.reviews || 1500).toLocaleString()})</span>
            <span className="text-gray-300 text-[10px] mx-1">·</span>
            <span className="text-gray-400 text-[10px]">{dest.duration || "5 Days"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">{dest.country}</span>
            <div className="text-right">
              <span className="text-[#0A1628] text-base font-bold">{dest.minPrice}</span>
              <span className="text-gray-400 text-[11px] ml-0.5">/person</span>
            </div>
          </div>
          {dest.description ? (
            <p className="text-gray-500 text-[11px] leading-relaxed text-gray-500 text-[11px] leading-relaxed">{dest.description}</p>
          ) : (
            <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">Discover the best of {dest.city}'s iconic landmarks, vibrant culture, and unforgettable experiences with A9 Global Travels.</p>
          )}
          {Array.isArray(dest.tags) && dest.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {dest.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#B8960F] text-[10px] font-medium border border-[#D4AF37]/20">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Button */}
        <div className="px-4 pb-4 pt-1.5">
          <div
            className={`w-full py-2.5 rounded-xl text-center font-bold text-sm transition-all duration-400 ${
              isHovered
                ? "bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] shadow-lg shadow-[#D4AF37]/40 scale-[1.02]"
                : "bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-[#0A1628] shadow-md shadow-[#D4AF37]/20"
            }`}
          >
            <span className="flex items-center justify-center gap-1">
              View Details
              <svg className={`w-4 h-4 transition-transform duration-400 ${isHovered ? "translate-x-1" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PopularDestinations() {
  const [dests, setDests] = useState<any[]>(FALLBACK_DESTS);
  const [destText, setDestText] = useState<any>({});

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetch("/api/admin/site-config").then(r => r.json()).then(d => {
      if (d?.popularDestinations != null) {
        const fixed = d.popularDestinations.map((dest: any) => ({ ...dest, city: CITY_FIX_MAP[dest.city] || dest.city })); setDests(fixed);
      const dt = d.destinationsText;
      setDestText(dt || {});
      } else {
        setDests(FALLBACK_DESTS);
      }
    }).catch(() => { setDests(FALLBACK_DESTS); }).finally(() => { setLoaded(true); });
  }, []);


  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="font-bold mb-2" style={{ fontFamily: destText?.titleFont || "'Playfair Display', Georgia, serif", fontSize: destText?.titleSize || "2.5rem", color: destText?.titleColor || "#0A1628" }}>{destText?.title || "Explore The World"}</h2>
        <p style={{ fontSize: destText?.subtitleSize || "1rem" }} className="text-gray-500">{destText?.subtitle || "Popular Destinations"}</p>
      </div>
      {dests.length > 0 ? (
        <div className="space-y-5">
          <ScrollingRow>
            {dests.slice(0, 6).map((d, i) => (
              <div key={i} className="flex-shrink-0 w-[300px] snap-start"><DestinationCard dest={d} destText={destText} /></div>
            ))}
          </ScrollingRow>
          <ScrollingRow>
            {dests.slice(6, 12).map((d, i) => (
              <div key={i + 6} className="flex-shrink-0 w-[300px} snap-start"><DestinationCard dest={d} destText={destText} /></div>
            ))}
          </ScrollingRow>
        </div>
      ) : (
        <p className="text-center text-gray-400 py-8">No destinations yet. Add some from the admin panel!</p>
      )}
    </section>
  );
}
