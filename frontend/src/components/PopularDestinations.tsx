"use client";

import { useState } from "react";
import ScrollingRow from "./ScrollingRow";

// ── Destination data ────────────────────────────────────────────────────────

interface Destination {
  name: string;
  imageUrl: string;
}

const TOP_PICKS: Destination[] = [
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
];

const EXPLORE_MORE: Destination[] = [
  { name: "Nepal", imageUrl: "https://picsum.photos/seed/a9dest-nepal/400/300" },
  { name: "Singapore", imageUrl: "https://picsum.photos/seed/a9dest-singapore/400/300" },
  { name: "Japan", imageUrl: "https://picsum.photos/seed/a9dest-japan/400/300" },
  { name: "Egypt", imageUrl: "https://picsum.photos/seed/a9dest-egypt/400/300" },
  { name: "Italy", imageUrl: "https://picsum.photos/seed/a9dest-italy/400/300" },
  { name: "Spain", imageUrl: "https://picsum.photos/seed/a9dest-spain/400/300" },
  { name: "Maldives", imageUrl: "https://picsum.photos/seed/a9dest-maldives/400/300" },
  { name: "India", imageUrl: "https://picsum.photos/seed/a9dest-india/400/300" },
  { name: "USA", imageUrl: "https://picsum.photos/seed/a9dest-usa/400/300" },
  { name: "UK", imageUrl: "https://picsum.photos/seed/a9dest-uk/400/300" },
];

const FALLBACK_IMG = "https://picsum.photos/seed/a9dest-fallback/400/300";

// ── Destination Card ────────────────────────────────────────────────────────

function DestinationCard({ dest }: { dest: Destination }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="relative w-[220px] h-[280px] rounded-2xl overflow-hidden flex-shrink-0 snap-start group cursor-pointer select-none">
      {/* Loading skeleton */}
      {!imgLoaded && !imgError && (
        <div className="absolute inset-0 bg-white/10 animate-pulse rounded-2xl" />
      )}

      {/* Background image */}
      <img
        src={imgError ? FALLBACK_IMG : dest.imageUrl}
        alt={dest.name}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
        onLoad={() => setImgLoaded(true)}
        onError={() => { setImgError(true); setImgLoaded(true); }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Country name */}
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

// ── Row label ───────────────────────────────────────────────────────────────

function RowLabel({ emoji, text }: { emoji: string; text: string }) {
  return (
    <h3 className="text-xl font-semibold text-[#0A1628] mb-4 flex items-center gap-2">
      <span>{emoji}</span> {text}
    </h3>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function PopularDestinations() {
  return (
    <section className="w-full bg-white pt-4 pb-16 md:pt-6 md:pb-24 overflow-hidden">
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

        {/* Row 1: Top Picks */}
        <div className="mb-10">
          <RowLabel emoji="🌟" text="Top Picks" />
          <ScrollingRow>
            {TOP_PICKS.map((dest) => (
              <DestinationCard key={dest.name} dest={dest} />
            ))}
          </ScrollingRow>
        </div>

        {/* Row 2: Explore More */}
        <div>
          <RowLabel emoji="🌏" text="Explore More" />
          <ScrollingRow>
            {EXPLORE_MORE.map((dest) => (
              <DestinationCard key={dest.name} dest={dest} />
            ))}
          </ScrollingRow>
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
