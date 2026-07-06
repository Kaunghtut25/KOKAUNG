"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ── Destination data ────────────────────────────────────────────────────────

interface Destination {
  name: string;
  imageUrl: string;
}

const DESTINATIONS: Destination[] = [
  { name: "Paris", imageUrl: "https://picsum.photos/seed/a9dest-paris/400/300" },
  { name: "Dubai", imageUrl: "https://picsum.photos/seed/a9dest-dubai/400/300" },
  { name: "Malaysia", imageUrl: "https://picsum.photos/seed/a9dest-malaysia/400/300" },
  { name: "Korea", imageUrl: "https://picsum.photos/seed/a9dest-korea/400/300" },
  { name: "Vietnam", imageUrl: "https://picsum.photos/seed/a9dest-vietnam/400/300" },
  { name: "Myanmar", imageUrl: "https://picsum.photos/seed/a9dest-myanmar/400/300" },
  { name: "Australia", imageUrl: "https://picsum.photos/seed/a9dest-australia/400/300" },
  { name: "Turkey", imageUrl: "https://picsum.photos/seed/a9dest-turkey/400/300" },
  { name: "Netherlands", imageUrl: "https://picsum.photos/seed/a9dest-netherlands/400/300" },
  { name: "Thailand", imageUrl: "https://picsum.photos/seed/a9dest-thailand/400/300" },
  { name: "Nepal", imageUrl: "https://picsum.photos/seed/a9dest-nepal/400/300" },
];

const FALLBACK_IMG = `https://picsum.photos/seed/a9dest-fallback/400/300`;

const imgUrl = (imageUrl: string) => imageUrl;

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
        src={imgError ? fallbackImg : imgUrl(dest.imageUrl)}
        alt={dest.name}
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
          {dest.name}
        </h3>
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
          <DestinationCard key={`${rowIndex}-${dest.name}`} dest={dest} />
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

        {/* Single scrollable row with all 11 destinations */}
        <div>
          <ScrollRow destinations={DESTINATIONS} rowIndex={0} />
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

