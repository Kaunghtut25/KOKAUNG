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
      className="cursor-pointer w-full"
    >
      <div
        className={`relative rounded-2xl overflow-hidden bg-white h-full flex flex-col transition-all duration-500 ease-out ${
          isHovered ? "shadow-2xl shadow-black/30 -translate-y-2" : "shadow-lg shadow-black/10"
        }`}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={imgError ? FALLBACK_IMG : dest.image}
            alt={dest.city}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/70 via-transparent to-transparent" />
          {/* Price tag */}
          {dest.minPrice && (
            <div className="absolute top-3 right-3 bg-[#D4AF37] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
              from {dest.minPrice}
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-[#0A1628] mb-1 leading-tight group-hover:text-[#D4AF37] transition-colors">
            {dest.city}
          </h3>
          <p className="text-sm text-gray-500 mb-3">{dest.country}</p>
          <div className="mt-auto flex items-center gap-2 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>View Details →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PopularDestinations() {
  const [dests, setDests] = useState<any[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/site-config").then(r=>r.json()).then(d=>{
      if (d?.popularDestinations != null) {
        setDests(d.popularDestinations);
      } else {
        setDests(FALLBACK_DESTS);
      }
    }).catch(()=>{ setDests(FALLBACK_DESTS); });
  }, []);

  // Loading state
  if (dests === null) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0A1628] mb-2" style={{fontFamily:"'Playfair Display', Georgia, serif"}}>Explore The World</h2>
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