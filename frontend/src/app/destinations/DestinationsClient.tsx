'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DealsBanner from '@/components/DealsBanner';
import FAQAccordion from '@/components/FAQAccordion';
import TestimonialSlider from '@/components/TestimonialSlider';

interface Destination {
  city: string;
  country: string;
  image: string;
  minPrice: string;
  bestTime?: string;
  description?: string;
  highlights?: string[];
}

interface Props {
  initialDestinations: Destination[];
  siteConfig?: any;
}

function toSlug(text: string): string {
  return (text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function DestinationsClient({ initialDestinations, siteConfig }: Props) {
  const router = useRouter();
  const heroImage = siteConfig?.heroImages?.destinations || "/images_v2/hero-destinations-v2.jpg";
  const dt = siteConfig?.heroText?.destinations || {};
  const dTitle = dt.title || "";
  const dSubtitle = dt.subtitle || "";
  const dTitleFont = dt.titleFont || "'Playfair Display', Georgia, serif";
  const dTitleSize = dt.titleSize || "3rem";
  const dSubtitleSize = dt.subtitleSize || "1.2rem";

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative pt-24 pb-12 px-4 overflow-hidden"
        style={{ height: (siteConfig?.heroDimensions?.destinations?.desktop || 400) + "px" }}
      >
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Explore Destinations"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = "/images_v2/hero-destinations-v2.jpg"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="font-bold mb-4 text-white" style={{ fontFamily: dTitleFont, fontSize: dTitleSize }}>
            {dTitle || "Popular Destinations"}
          </h1>
          {dSubtitle ? (
            <p className="text-white/70 text-lg max-w-2xl mx-auto" style={{ fontSize: dSubtitleSize }}>
              {dSubtitle}
            </p>
          ) : (
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Explore our curated selection of incredible destinations across Asia and beyond
            </p>
          )}
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {initialDestinations.map((dest, i) => {
            const slug = toSlug(dest.city);
            const shortDesc = (dest.description || "").length > 100
              ? (dest.description || "").substring(0, 100) + "..."
              : (dest.description || "");

            return (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#D4AF37]/40 transition-all group cursor-pointer"
                onClick={() => router.push("/destinations/" + slug)}
              >
                {/* Card Image */}
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609663178_ta1biy-bangkok-x7Q8kUMuXRvj6qMJAZxBbawKS4zkjI.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#D4AF37]/90 text-[#0A1628] text-xs font-bold">
                    {dest.country}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3
                    className="font-bold text-[#0A1628] text-lg mb-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {dest.city}
                  </h3>
                  {shortDesc && (
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{shortDesc}</p>
                  )}
                  {dest.minPrice && (
                    <p className="text-[#D4AF37] text-sm font-semibold mb-4">{dest.minPrice}</p>
                  )}
                  <div className="flex gap-2">
                    <Link
                      href={"/destinations/" + slug}
                      className="flex-1 px-3 py-2 border border-[#D4AF37] text-[#D4AF37] text-sm font-semibold rounded-full text-center hover:bg-[#D4AF37] hover:text-white transition-colors"
                    >
                      View Details
                    </Link>
                    <Link
                      href={"/book-now?type=tour&destination=" + encodeURIComponent(dest.city)}
                      className="flex-1 px-3 py-2 bg-[#D4AF37] text-white text-sm font-semibold rounded-full text-center hover:bg-[#C19B2F] transition-colors"
                    >
                      Book Trip
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <DealsBanner />
      <FAQAccordion section="destinations" />
      <TestimonialSlider />
    </main>
  );
}