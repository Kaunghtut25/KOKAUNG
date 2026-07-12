"use client";

import { useState } from "react";
import ScrollingRow from "./ScrollingRow";

// ── Destination data ────────────────────────────────────────────────────────

interface Destination {
  name: string;
  imageUrl: string;
}

const TOP_PICKS: Destination[] = [
  { name: "Paris", imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80" },
  { name: "Dubai", imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80" },
  { name: "Malaysia", imageUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80" },
  { name: "Korea", imageUrl: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400&q=80" },
  { name: "Vietnam", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=80" },
  { name: "Myanmar", imageUrl: "https://images.unsplash.com/photo-1570168001899-b7d3b500a1c7?w=400&q=80" },
  { name: "Australia", imageUrl: "https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?w=400&q=80" },
  { name: "Turkey", imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80" },
  { name: "Netherlands", imageUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&q=80" },
  { name: "Thailand", imageUrl: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&q=80" },
];

const EXPLORE_MORE: Destination[] = [
  { name: "Nepal", imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&q=80" },
  { name: "Singapore", imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80" },
  { name: "Japan", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80" },
  { name: "Egypt", imageUrl: "https://images.unsplash.com/photo-1539768942893-d1a84abb6882?w=400&q=80" },
  { name: "Italy", imageUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=80" },
  { name: "Spain", imageUrl: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=400&q=80" },
  { name: "Maldives", imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80" },
  { name: "India", imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80" },
  { name: "USA", imageUrl: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&q=80" },
  { name: "UK", imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80" },
];

const FALLBACK_IMG = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80";

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
