"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ── Destination data ────────────────────────────────────────────────────────

interface Destination {
  city: string;
  country: string;
  imageId: string;
}

const ROW_1: Destination[] = [
  { city: "Bangkok", country: "Thailand", imageId: "photo-1508009603885-50cf7c579365" },
  { city: "Singapore", country: "Singapore", imageId: "photo-1525625293386-3f8f99389edd" },
  { city: "Tokyo", country: "Japan", imageId: "photo-1503899036084-c55cdd92da26" },
  { city: "Paris", country: "France", imageId: "photo-1511739005466-8b40bb5925bd" },
  { city: "Dubai", country: "UAE", imageId: "photo-1549877452365-83ae770a5c3d" },
  { city: "Bali", country: "Indonesia", imageId: "photo-1555400038-63f5ba517a47" },
  { city: "London", country: "UK", imageId: "photo-1513026705753-bc3fffca8bf4" },
  { city: "Kuala Lumpur", country: "Malaysia", imageId: "photo-1536053392961-5736fc69a246" },
  { city: "Seoul", country: "Korea", imageId: "photo-1546872869-f0c7f4f2f0b2" },
  { city: "Hanoi", country: "Vietnam", imageId: "photo-1504214208698-10e1f9c5e5cf" },
];

const ROW_2: Destination[] = [
  { city: "Bagan", country: "Myanmar", imageId: "photo-1570167574777-7e5c2c5e60b5" },
  { city: "Maldives", country: "Maldives", imageId: "photo-1573843981267-be1999ff37cd" },
  { city: "Rome", country: "Italy", imageId: "photo-1525874684015-58379d421a52" },
  { city: "Hong Kong", country: "Hong Kong", imageId: "photo-1565967511849-76a60a516170" },
  { city: "Sydney", country: "Australia", imageId: "photo-1515886651714-6f8bc0de6011" },
  { city: "Istanbul", country: "Turkey", imageId: "photo-1524221757912-89f4d75c4a28" },
  { city: "Amsterdam", country: "Netherlands", imageId: "photo-1512470876300-832aa0e9b011" },
  { city: "Phuket", country: "Thailand", imageId: "photo-1537956160437-43e09e55e666" },
  { city: "Kathmandu", country: "Nepal", imageId: "photo-1605649181962-51db716c0671" },
  { city: "Siem Reap", country: "Cambodia", imageId: "photo-1559128010-7c1ad6e1b6a5" },
];

const FALLBACK_IMG = `https://images.unsplash.com/photo-1500835556837-99d25a2f248b?w=400&h=500&fit=crop&auto=format&q=80`;

const imgUrl = (imageId: string) =>
  `https://images.unsplash.com/${imageId}?w=400&h=500&fit=crop`;

// ── Constants ────────────────────────────────────────────────────────────────

const CARD_WIDTH = 220;
const CARD_GAP = 16;
const STEP = CARD_WIDTH + CARD_GAP;
const AUTOPLAY_MS = 3000;

// ── Sub-components ───────────────────────────────────────────────────────────

function DestinationCard({ dest }: { dest: Destination }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const fallbackImg = FALLBACK_IMG;

  return (
    <div className="relative w-[220px] h-[280px] rounded-2xl overflow-hidden flex-shrink-0 snap-start group cursor-pointer select-none">
      {/* Loading skeleton */}
      {!imgLoaded && !imgError && (
        <div className="absolute inset-0 bg-white/10 animate-pulse rounded-2xl" />
      )}

      {/* Background image */}
      <img
        src={imgError ? fallbackImg : imgUrl(dest.imageId)}
        alt={`${dest.city}, ${dest.country}`}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        onLoad={() => setImgLoaded(true)}
        onError={() => { setImgError(true); setImgLoaded(true); }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3
          className="text-white text-xl leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {dest.city}
        </h3>
        <p className="mt-1 text-sm tracking-wider uppercase" style={{ color: "#D4AF37" }}>
          {dest.country}
        </p>
      </div>
    </div>
  );
}

interface ScrollRowProps {
  destinations: Destination[];
  rowIndex: number;
}

function ScrollRow({ destinations, rowIndex }: ScrollRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const target =
      direction === "left" ? el.scrollLeft - STEP : el.scrollLeft + STEP;
    el.scrollTo({ left: target, behavior: "smooth" });
  }, []);

  const autoScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 4) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      scroll("right");
    }
  }, [scroll]);

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(autoScroll, AUTOPLAY_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, autoScroll]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    return () => el.removeEventListener("scroll", updateArrows);
  }, [updateArrows]);

  return (
    <div
      className="relative group/row"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-all duration-300 ${
          canScrollLeft
            ? "opacity-0 group-hover/row:opacity-100 hover:bg-white hover:scale-110"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ marginLeft: -20 }}
      >
        <ChevronLeft className="w-5 h-5 text-[#0A1628]" />
      </button>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {destinations.map((dest) => (
          <DestinationCard key={`${rowIndex}-${dest.city}`} dest={dest} />
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-all duration-300 ${
          canScrollRight
            ? "opacity-0 group-hover/row:opacity-100 hover:bg-white hover:scale-110"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ marginRight: -20 }}
      >
        <ChevronRight className="w-5 h-5 text-[#0A1628]" />
      </button>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function PopularDestinations() {
  return (
    <section className="w-full bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section heading */}
        <div className="text-center mb-12">
          <span
            className="inline-block text-sm uppercase tracking-[0.25em] font-semibold mb-3"
            style={{ color: "#D4AF37" }}
          >
            Explore The World
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ color: "#0A1628", fontFamily: "'Playfair Display', serif" }}
          >
            Popular Destinations
          </h2>
          <div className="mt-4 mx-auto w-20 h-0.5 rounded" style={{ backgroundColor: "#D4AF37" }} />
        </div>

        {/* Row 1 */}
        <div className="mb-8">
          <ScrollRow destinations={ROW_1} rowIndex={0} />
        </div>

        {/* Row 2 */}
        <div>
          <ScrollRow destinations={ROW_2} rowIndex={1} />
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

