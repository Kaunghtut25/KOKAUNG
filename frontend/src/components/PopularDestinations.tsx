"use client";

import { useState, useEffect } from "react";
import ScrollingRow from "./ScrollingRow";

const FALLBACK_IMG = "/images_v2/cta-bg-v2.jpg";

function DestinationCard({ dest }: { dest: { city: string; country: string; image: string; minPrice: string } }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="flex-shrink-0 w-[300px] rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md hover:border-[#D4AF37]/40 transition-all group cursor-pointer">
      <img src={imgError ? FALLBACK_IMG : dest.image} alt={dest.city} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" onError={()=>setImgError(true)} loading="lazy" />
      <div className="p-3 text-center bg-white">
        <p className="text-lg font-semibold text-[#0A1628] group-hover:text-[#D4AF37] transition-colors">{dest.city}</p>
        <p className="text-xs text-gray-400">{dest.country}</p>
        {dest.minPrice && <p className="text-sm text-[#D4AF37] font-medium mt-1">from {dest.minPrice}</p>}
      </div>
    </div>
  );
}

export default function PopularDestinations() {
  const [dests, setDests] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/site-config').then(r=>r.json()).then(d=>{
      if (d?.popularDestinations?.length) setDests(d.popularDestinations);
    }).catch(()=>{});
  }, []);

  if (!dests.length) {
    // Static fallback
    const fallback = [
      { city: "Paris", country: "France", image: "/images_v2/dest-paris-v2.jpg", minPrice: "Ks 850,000" },
      { city: "Dubai", country: "UAE", image: "/images_v2/dest-dubai-v2.jpg", minPrice: "Ks 680,000" },
      { city: "Korea", country: "South Korea", image: "/images_v2/dest-korea-v2.jpg", minPrice: "Ks 550,000" },
      { city: "Thailand", country: "Thailand", image: "/images_v2/hero-thailand-v2.jpg", minPrice: "Ks 150,000" },
      { city: "Singapore", country: "Singapore", image: "/images_v2/hero-singapore-v2.jpg", minPrice: "Ks 250,000" },
      { city: "Japan", country: "Japan", image: "/images_v2/dest-japan-v2.jpg", minPrice: "Ks 780,000" },
    ];
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10"><h2 className="text-3xl md:text-4xl font-bold text-[#0A1628] mb-2" style={{fontFamily:"'Playfair Display', Georgia, serif"}}>Explore The World</h2><p className="text-gray-500">Popular Destinations</p></div>
        <ScrollingRow>{fallback.map((d,i)=><DestinationCard key={i} dest={d} />)}</ScrollingRow>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10"><h2 className="text-3xl md:text-4xl font-bold text-[#0A1628] mb-2" style={{fontFamily:"'Playfair Display', Georgia, serif"}}>Explore The World</h2><p className="text-gray-500">Popular Destinations</p></div>
      <ScrollingRow>{dests.map((d,i)=><DestinationCard key={i} dest={d} />)}</ScrollingRow>
    </section>
  );
}
