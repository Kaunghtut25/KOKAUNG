"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ScrollingRow from "./ScrollingRow";
import { useI18n } from "@/lib/i18n";
import { mmDestinations, mmLookup } from "@/lib/mm-content";

const FALLBACK_IMG = "/images_v2/cta-bg-v2.jpg";


const CITY_FIX_MAP: Record<string, string> = {
  "Korea": "Seoul",
  "Thailand": "Bangkok",
  "Japan": "Tokyo",
  "Vietnam": "Ho Chi Minh City"
};

function DestinationCard({ dest, destText = {} }: { dest: { city: string; country: string; image: string; minPrice: string; rating?: number; reviews?: number; duration?: string; tags?: string[]; description?: string } }) {
  const { t, lang } = useI18n();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const d = lang === "mm" ? { ...dest, ...mmLookup(mmDestinations, dest) } : dest;

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
            <Image
              src={d.image}
              alt={d.city}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="w-full h-full object-cover transition-transform duration-700 ease-out"
              style={{ transform: isHovered ? "scale(1.08)" : "scale(1)" }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] to-[#1a2744] flex items-center justify-center">
              <div className="text-center">
                <span className="text-3xl mb-2 block">📍</span>
                <span className="text-[#D4AF37] text-sm font-semibold block">{d.city}</span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
          <div className="absolute top-7 left-3 z-20">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#0A1628]/85 text-[#D4AF37] text-[11px] font-semibold backdrop-blur-sm border border-[#D4AF37]/40 shadow-lg shadow-black/30">
              📍 {d.city}
            </span>
          </div>
          <div className="absolute top-7 right-3 z-20">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[11px] font-medium backdrop-blur-sm border border-white/15">
              {d.country}
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
            {d.city}
          </h3>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <svg key={i} className={`w-3 h-3 ${i < Math.round(dest.rating || 4.5) ? 'text-[#D4AF37]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-500 text-[10px]">({(dest.reviews || 1500).toLocaleString()})</span>
            <span className="text-gray-300 text-[10px] mx-1">·</span>
            <span className="text-gray-500 text-[10px]">{d.duration || "5 Days"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs">{d.country}</span>
            <div className="text-right">
              <span className="text-[#0A1628] text-base font-bold">{d.minPrice}</span>
              <span className="text-gray-500 text-[11px] ml-0.5">/person</span>
            </div>
          </div>
          {d.description ? (
            <p className="text-gray-500 text-[11px] leading-relaxed text-gray-500 text-[11px] leading-relaxed">{d.description}</p>
          ) : (
            <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">{lang === "mm" ? `ထင်ရှားသော အထင်ကရနေရာများ၊ တက်ကြွသော ယဉ်ကျေးမှုနှင့် မမေ့နိုင်သော အတွေ့အကြုံများကို ${d.city} တွင် A9 Global Travels နှင့်အတူ ရှာဖွေတွေ့ရှိပါ။` : `Discover the best of ${d.city}'s iconic landmarks, vibrant culture, and unforgettable experiences with A9 Global Travels.`}</p>
          )}
          {Array.isArray(dest.tags) && dest.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {dest.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#7A5F08] text-[10px] font-medium border border-[#D4AF37]/20">
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
              {t("common.viewDetails")}
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

export default function PopularDestinations({ siteConfig }: { siteConfig?: any } = {}) {
  const { t, lang } = useI18n();
  const [dests, setDests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [destText, setDestText] = useState<any>({});

  const cardWidth = 300;
  const cardHeight = 420;
  const containerWidth = 6 * (cardWidth + 16);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    // FIX 2026-08-12: prefer the destinations DB (editable via Admin → Destinations)
    Promise.all([
      fetch("/api/destinations").then(r => r.json()).catch(() => null),
      fetch("/api/admin/site-config").then(r => r.json()).catch(() => null),
    ]).then(([destsData, cfgData]) => {
      const arr = Array.isArray(destsData) ? destsData : (destsData?.data || destsData?.items || []);
      const dt = cfgData?.destinationsText || (Array.isArray(cfgData) ? cfgData[0]?.destinationsText : null) || {};
      setDestText(dt || {});
      if (Array.isArray(arr) && arr.length > 0) {
        const mapped = arr.map((d: any) => {
          const img = typeof d.images === "string" ? (JSON.parse(d.images)[0] || d.image || "") : (Array.isArray(d.images) ? d.images[0] : (d.image || d.img || ""));
          return {
            city: CITY_FIX_MAP[d.city] || d.city || d.name || "",
            country: d.country || "",
            image: img || d.image || FALLBACK_IMG,
            minPrice: d.minPrice || "",
            rating: typeof d.rating === "number" ? d.rating : (d.rating ? parseFloat(d.rating) : undefined),
            reviews: typeof d.reviews === "number" ? d.reviews : (d.reviews ? parseInt(d.reviews, 10) : undefined),
            duration: d.duration || "",
            tags: typeof d.tags === "string" ? d.tags.split(",").map((s: string) => s.trim()).filter(Boolean) : (Array.isArray(d.tags) ? d.tags : []),
            description: d.description || "",
          };
        }).filter((d: any) => d.city);
        if (mapped.length > 0) { setDests(mapped); return; }
      }
      // Admin-deleted destinations must NOT reappear: no fallback lists.
      setDests([]);
    }).catch(() => { setDests([]); }).finally(() => { setLoaded(true); setLoading(false); });
  }, []);

  // Hide the whole section when there is nothing to show (admin deleted all).
  if (!loading && dests.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="font-bold mb-2" style={{ fontFamily: destText?.titleFont || "'Playfair Display', Georgia, serif", fontSize: destText?.titleSize || "2.5rem", color: destText?.titleColor || "#0A1628" }}>{lang === "mm" ? t("home.exploreWorld") : (destText?.title || t("home.exploreWorld"))}</h2>
        <p style={{ fontSize: destText?.subtitleSize || "1rem" }} className="text-gray-500">{lang === "mm" ? t("home.popularDestinations") : (destText?.subtitle || t("home.popularDestinations"))}</p>
      </div>
      {loading && dests.length === 0 ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex-shrink-0 animate-pulse" style={{ width: cardWidth, height: cardHeight }}>
              <div className="rounded-2xl overflow-hidden bg-white h-full flex flex-col shadow-lg shadow-black/10">
                <div className="h-[280px] bg-gray-300 rounded-t-2xl" />
                <div className="h-4 bg-gradient-to-b from-gray-200 to-transparent" />
                <div className="px-4 pt-4 pb-3 space-y-3 flex-1">
                  <div className="h-5 bg-gray-300 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : dests.length > 0 ? (
        <ScrollingRow containerWidth={containerWidth}>
          {dests.map((d, i) => (
            <div key={i} className="flex-shrink-0 snap-start" style={{ width: cardWidth }}>
              <DestinationCard dest={d} destText={destText} />
            </div>
          ))}
        </ScrollingRow>
      ) : (
        <p className="text-center text-gray-400 py-8">No destinations yet. Add some from the admin panel!</p>
      )}
    </section>
  );
}
