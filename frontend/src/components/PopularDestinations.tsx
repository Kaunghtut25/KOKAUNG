"use client";

import { useState } from "react";
import ScrollingRow from "./ScrollingRow";

// ── Destination data ────────────────────────────────────────────────────────

interface Destination {
  name: string;
  imageUrl: string;
}

const TOP_PICKS: Destination[] = [
  { name: "Paris", imageUrl: "/images_v2/dest-paris-v2.jpg" },
  { name: "Dubai", imageUrl: "/images_v2/dest-dubai-v2.jpg" },
  { name: "Malaysia", imageUrl: "/images_v2/hero-malaysia-v2.jpg" },
  { name: "Korea", imageUrl: "/images_v2/dest-korea-v2.jpg" },
  { name: "Vietnam", imageUrl: "/images_v2/hero-vietnam-v2.jpg" },
  { name: "Myanmar", imageUrl: "/images_v2/dest-myanmar-v2.jpg" },
  { name: "Australia", imageUrl: "/images_v2/dest-australia-v2.jpg" },
  { name: "Turkey", imageUrl: "/images_v2/dest-turkey-v2.jpg" },
  { name: "Netherlands", imageUrl: "/images_v2/dest-netherlands-v2.jpg" },
  { name: "Thailand", imageUrl: "/images_v2/hero-thailand-v2.jpg" },
];

const EXPLORE_MORE: Destination[] = [
  { name: "Nepal", imageUrl: "/images_v2/dest-nepal-v2.jpg" },
  { name: "Singapore", imageUrl: "/images_v2/hero-singapore-v2.jpg" },
  { name: "Japan", imageUrl: "/images_v2/dest-japan-v2.jpg" },
  { name: "Egypt", imageUrl: "/images_v2/dest-egypt-v2.jpg" },
  { name: "Italy", imageUrl: "/images_v2/dest-italy-v2.jpg" },
  { name: "Spain", imageUrl: "/images_v2/dest-spain-v2.jpg" },
  { name: "Maldives", imageUrl: "/images_v2/dest-maldives-v2.jpg" },
  { name: "India", imageUrl: "/images_v2/dest-india-v2.jpg" },
  { name: "USA", imageUrl: "/images_v2/dest-usa-v2.jpg" },
  { name: "UK", imageUrl: "/images_v2/dest-uk-v2.jpg" },
];

const FALLBACK_IMG = "/images_v2/cta-bg-v2.jpg";

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
