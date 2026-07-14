"use client";

import { useState } from "react";
import ScrollingRow from "./ScrollingRow";

// ── Destination data ────────────────────────────────────────────────────────

interface Destination {
  name: string;
  imageUrl: string;
}

const TOP_PICKS: Destination[] = [
  { name: "Paris", imageUrl: "/images/dest-paris.jpg" },
  { name: "Dubai", imageUrl: "/images/dest-dubai.jpg" },
  { name: "Malaysia", imageUrl: "/images/hero-malaysia.jpg" },
  { name: "Korea", imageUrl: "/images/dest-korea.jpg" },
  { name: "Vietnam", imageUrl: "/images/hero-vietnam.jpg" },
  { name: "Myanmar", imageUrl: "/images/dest-myanmar.jpg" },
  { name: "Australia", imageUrl: "/images/dest-australia.jpg" },
  { name: "Turkey", imageUrl: "/images/dest-turkey.jpg" },
  { name: "Netherlands", imageUrl: "/images/dest-netherlands.jpg" },
  { name: "Thailand", imageUrl: "/images/hero-thailand.jpg" },
];

const EXPLORE_MORE: Destination[] = [
  { name: "Nepal", imageUrl: "/images/dest-nepal.jpg" },
  { name: "Singapore", imageUrl: "/images/hero-singapore.jpg" },
  { name: "Japan", imageUrl: "/images/dest-japan.jpg" },
  { name: "Egypt", imageUrl: "/images/dest-egypt.jpg" },
  { name: "Italy", imageUrl: "/images/dest-italy.jpg" },
  { name: "Spain", imageUrl: "/images/dest-spain.jpg" },
  { name: "Maldives", imageUrl: "/images/dest-maldives.jpg" },
  { name: "India", imageUrl: "/images/dest-india.jpg" },
  { name: "USA", imageUrl: "/images/dest-usa.jpg" },
  { name: "UK", imageUrl: "/images/dest-uk.jpg" },
];

const FALLBACK_IMG = "/images/cta-bg.jpg";

// ── Destination Card ────────────────────────────────────────────────────────

function DestinationCard({ dest }: { dest: Destination }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex-shrink-0 w-[300px] rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md hover:border-[#D4AF37]/40 transition-all group cursor-pointer">
      {/* Background image */}
      <img
        src={imgError ? FALLBACK_IMG : dest.imageUrl}
        alt={dest.name}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        onError={() => setImgError(true)}
        loading="lazy"
      />
      <div className="p-2 text-center bg-white">
        <p className="text-lg font-semibold text-[#0A1628] group-hover:text-[#D4AF37] transition-colors">{dest.name}</p>
      </div>
    </div>
  );
}

// ── Section Component ───────────────────────────────────────────────────────

function DestinationSection({ title, destinations }: { title: string; destinations: Destination[] }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 px-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
        {title}
      </h3>
      <ScrollingRow>
        {destinations.map((dest, i) => (
          <DestinationCard key={i} dest={dest} />
        ))}
      </ScrollingRow>
    </div>
  );
}

// ── Main Export ─────────────────────────────────────────────────────────────

export default function PopularDestinations() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0A1628] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Explore The World
        </h2>
        <p className="text-gray-500">Popular Destinations</p>
      </div>
      <DestinationSection title="🌟 Top Picks" destinations={TOP_PICKS} />
      <DestinationSection title="🌏 Explore More" destinations={EXPLORE_MORE} />
    </section>
  );
}
