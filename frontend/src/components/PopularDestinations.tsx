"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const FALLBACK_IMG = "/images_v2/cta-bg-v2.jpg";

const FALLBACK_DESTS = [
  { city: "Paris", country: "France", image: "/images_v2/dest-paris-v2.jpg", minPrice: "Ks 850,000" },
  { city: "Dubai", country: "UAE", image: "/images_v2/dest-dubai-v2.jpg", minPrice: "Ks 680,000" },
  { city: "Korea", country: "South Korea", image: "/images_v2/dest-korea-v2.jpg", minPrice: "Ks 550,000" },
  { city: "Thailand", country: "Thailand", image: "/images_v2/hero-thailand-v2.jpg", minPrice: "Ks 150,000" },
  { city: "Singapore", country: "Singapore", image: "/images_v2/hero-singapore-v2.jpg", minPrice: "Ks 250,000" },
  { city: "Japan", country: "Japan", image: "/images_v2/dest-japan-v2.jpg", minPrice: "Ks 780,000" },
];

function DestinationCard({ dest }: { dest: { city: string; country: string; image: string; minPrice: string } }) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/destinations/" + encodeURIComponent(dest.city.toLowerCase().replace(/\s+/g, "-")))}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer w-full h-full"
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
            className="text-[#0A1628] text-base font-bold leading-tight line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {dest.city}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">{dest.country}</span>
            <div className="text-right">
              <span className="text-[#0A1628] text-base font-bold">{dest.minPrice}</span>
              <span className="text-gray-400 text-[11px] ml-0.5">/person</span>
            </div>
          </div>
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
  const [dests, setDests] = useState<any[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/site-config").then(r => r.json()).then(d => {
      if (d?.popularDestinations != null) {
        setDests(d.popularDestinations);
      } else {
        setDests(FALLBACK_DESTS);
      }
    }).catch(() => { setDests(FALLBACK_DESTS); });
  }, []);

  if (dests === null) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0A1628] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Explore The World</h2>
        <p className="text-gray-500">Popular Destinations</p>
      </div>
      {dests.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {dests.map((d, i) => <DestinationCard key={i} dest={d} />)}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-8">No destinations yet. Add some from the admin panel!</p>
      )}
    </section>
  );
}