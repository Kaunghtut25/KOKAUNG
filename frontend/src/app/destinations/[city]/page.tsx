"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import DestImage from "./DestImage";

interface PopularDestination {
  city: string;
  country: string;
  image: string;
  minPrice: string;
  bestTime?: string;
  description?: string;
  highlights?: string[];
}

const DEST_HERO = "/images_v2/hero-destinations-v2.jpg";

function toSlug(text: string): string {
  return (text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function DestinationPage({ params }: { params: { city: string } }) {
  const router = useRouter();
  const key = params.city.toLowerCase();
  const [dest, setDest] = useState<PopularDestination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch("/api/admin/site-config");
        if (res.ok) {
          const data = await res.json();
          const popularDestinations: PopularDestination[] =
            data.popularDestinations ||
            data.data?.popularDestinations ||
            [];
          const found = popularDestinations.find(
            (d: PopularDestination) => toSlug(d.city) === key
          );
          setDest(found || null);
        }
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, [key]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-20 flex items-center justify-center">
        <div className="text-[#D4AF37]/70 animate-pulse text-lg">Loading destination...</div>
      </main>
    );
  }

  if (!dest) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-20 text-center">
        <h1 className="text-4xl font-bold text-[#0A1628] mb-4">Destination Not Found</h1>
        <p className="text-gray-600 mb-8">
          We couldn&apos;t find details for &quot;{params.city}&quot;. This destination may have been removed or is not yet available.
        </p>
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#D4AF37] text-white hover:bg-[#C19B2F] border border-[#D4AF37] transition-all duration-300 font-medium">
          ← Back
        </button>
      </main>
    );
  }

  // Build highlights from description or leave empty
  const highlights = dest.highlights || (dest.description
    ? dest.description.split(/[,.]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0).slice(0, 6)
    : []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <button onClick={() => router.back()} className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/15 backdrop-blur-md text-white hover:bg-white/25 border border-white/20 transition-all duration-300 font-medium">
          ← Back
        </button>
        <DestImage
          src={dest.image || DEST_HERO}
          alt={dest.city}
          fallback={DEST_HERO}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
          <p className="text-white/70 text-sm uppercase tracking-widest mb-1">
            {dest.country}
          </p>
          <h1
            className="text-3xl md:text-5xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {dest.city}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Description */}
        {dest.description && (
          <section>
            <h2 className="text-2xl font-bold text-[#0A1628] mb-4">
              About {dest.city}
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {dest.description}
            </p>
          </section>
        )}

        {/* Price */}
        {dest.minPrice && (
          <section className="bg-gradient-to-r from-[#D4AF37]/5 to-[#D4AF37]/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-[#0A1628] mb-2">
              Starting Price
            </h2>
            <p className="text-[#D4AF37] font-bold text-2xl">
              {dest.minPrice}
            </p>
          </section>
        )}

        {/* Highlights */}
        {highlights.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[#0A1628] mb-6">
              Top Highlights
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {highlights.map((h: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-[#D4AF37]/30 transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="text-gray-800 font-medium">{h}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Best Time */}
        {dest.bestTime && (
          <section className="bg-gradient-to-r from-[#D4AF37]/5 to-[#D4AF37]/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-[#0A1628] mb-2">
              Best Time to Visit
            </h2>
            <p className="text-gray-700 text-lg">{dest.bestTime}</p>
          </section>
        )}

        {/* CTA */}
        <section className="text-center py-12">
          <h2 className="text-2xl font-bold text-[#0A1628] mb-4">
            Ready to Explore {dest.city}?
          </h2>
          <Link
            href={`/book-now?type=tour&destination=${encodeURIComponent(dest.city)}`}
            className="inline-block bg-[#D4AF37] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#C19B2F] transition-colors"
          >
            Book Your Trip to {dest.city}
          </Link>
        </section>
      </div>
    </main>
  );
}
