'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tour } from '@/lib/api';

interface TourCardProps {
  tour: Tour;
  currency?: 'MMK' | 'USD';
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop';

function getImages(images: string | string[] | undefined): string[] {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  return images.split(' ').filter(Boolean);
}

export default function TourCard({ tour, currency = 'MMK' }: TourCardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const price = currency === 'MMK' ? tour.priceMMK : tour.priceUSD;
  const currencySymbol = currency === 'MMK' ? 'Ks' : '$';

  const mainImage = getImages(tour.images)[0] || FALLBACK_IMAGE;
  const displayImage = imgError ? FALLBACK_IMAGE : mainImage;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.round(rating) ? 'text-[#D4AF37]' : 'text-gray-400'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div
      onClick={() => router.push(`/tours/${tour.slug}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer"
      style={{ perspective: '1200px' }}
    >
      {/* 3D Card Body */}
      <div
        className={`relative rounded-2xl overflow-hidden bg-white transition-all duration-500 ease-out ${
          isHovered
            ? 'shadow-2xl shadow-black/30 -translate-y-2 rotateY-0'
            : 'shadow-lg shadow-black/10'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered ? 'rotateX(2deg) translateZ(10px)' : 'rotateX(0deg) translateZ(0)',
        }}
      >
        {/* ── Top Gold Bracket Frame ── */}
        {/* Left corner bracket */}
        <div className="absolute top-0 left-0 z-30 pointer-events-none">
          {/* Horizontal arm */}
          <div className="absolute top-0 left-0 h-[14px] w-[80px] bg-gradient-to-r from-[#D4AF37] via-[#D4AF37] to-transparent rounded-tl-xl shadow-[0_3px_8px_rgba(212,175,55,0.4)]" />
          {/* Vertical arm */}
          <div className="absolute top-0 left-0 w-[14px] h-[60px] bg-gradient-to-b from-[#D4AF37] via-[#D4AF37] to-transparent rounded-tl-xl shadow-[3px_0_8px_rgba(212,175,55,0.3)]" />
          {/* Corner accent dot */}
          <div className="absolute top-[2px] left-[2px] w-[10px] h-[10px] bg-[#F5A623] rounded-full shadow-[0_0_6px_rgba(245,166,35,0.7)]" />
          {/* Inner corner cut */}
          <div className="absolute top-[12px] left-[12px] w-[52px] h-[52px] border-t-[3px] border-l-[3px] border-[#D4AF37]/60 rounded-tl-lg shadow-[inset_2px_2px_4px_rgba(212,175,55,0.2)]" />
          {/* 3D highlight bar */}
          <div className="absolute top-[3px] left-[16px] h-[2px] w-[60px] bg-gradient-to-r from-white/80 to-transparent rounded-full" />
          <div className="absolute top-[16px] left-[3px] w-[2px] h-[40px] bg-gradient-to-b from-white/80 to-transparent rounded-full" />
        </div>

        {/* Right corner bracket */}
        <div className="absolute top-0 right-0 z-30 pointer-events-none">
          {/* Horizontal arm */}
          <div className="absolute top-0 right-0 h-[14px] w-[80px] bg-gradient-to-l from-[#D4AF37] via-[#D4AF37] to-transparent rounded-tr-xl shadow-[0_3px_8px_rgba(212,175,55,0.4)]" />
          {/* Vertical arm */}
          <div className="absolute top-0 right-0 w-[14px] h-[60px] bg-gradient-to-b from-[#D4AF37] via-[#D4AF37] to-transparent rounded-tr-xl shadow-[-3px_0_8px_rgba(212,175,55,0.3)]" />
          {/* Corner accent dot */}
          <div className="absolute top-[2px] right-[2px] w-[10px] h-[10px] bg-[#F5A623] rounded-full shadow-[0_0_6px_rgba(245,166,35,0.7)]" />
          {/* Inner corner cut */}
          <div className="absolute top-[12px] right-[12px] w-[52px] h-[52px] border-t-[3px] border-r-[3px] border-[#D4AF37]/60 rounded-tr-lg shadow-[inset_-2px_2px_4px_rgba(212,175,55,0.2)]" />
          {/* 3D highlight bar */}
          <div className="absolute top-[3px] right-[16px] h-[2px] w-[60px] bg-gradient-to-l from-white/80 to-transparent rounded-full" />
          <div className="absolute top-[16px] right-[3px] w-[2px] h-[40px] bg-gradient-to-b from-white/80 to-transparent rounded-full" />
        </div>

        {/* ── Image Section ── */}
        <div className="relative h-[280px] w-full overflow-hidden">
          <img
            src={displayImage}
            alt={tour.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out"
            style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
            onError={() => setImgError(true)}
            loading="lazy"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

          {/* Destination badge — top left */}
          <div className="absolute top-[34px] left-5 z-20">
            <span className="inline-block px-3 py-1 rounded-full bg-[#0A1628]/85 text-[#D4AF37] text-xs font-semibold backdrop-blur-sm border border-[#D4AF37]/40 shadow-lg shadow-black/30">
              📍 {tour.destination}
            </span>
          </div>

          {/* Duration badge — top right */}
          <div className="absolute top-[34px] right-5 z-20">
            <span className="inline-block px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-sm border border-white/15">
              {tour.duration} {tour.durationUnit || 'D'}
            </span>
          </div>

          {/* Featured badge */}
          {tour.featured && (
            <div className="absolute top-[34px] left-1/2 -translate-x-1/2 z-20">
              <span className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/90 text-[#0A1628] text-[10px] font-bold uppercase tracking-wider shadow-lg">
                ⭐ Featured
              </span>
            </div>
          )}
        </div>

        {/* ── Navy-to-White Gradient Transition ── */}
        <div
          className="h-6 bg-gradient-to-b from-[#0A1628] to-white"
          style={{
            boxShadow: isHovered
              ? '0 -4px 16px rgba(10,22,40,0.25)'
              : '0 -2px 8px rgba(10,22,40,0.12)',
            transition: 'box-shadow 0.5s ease-out',
          }}
        />

        {/* ── Info Section ── */}
        <div className="px-5 pt-3 pb-2 space-y-2">
          {/* Tour Title */}
          <h3
            className="text-[#0A1628] text-lg font-bold leading-tight line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {tour.title}
          </h3>

          {/* Rating + Price Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">{renderStars(tour.rating)}</div>
              <span className="text-gray-400 text-xs">({tour.reviewCount})</span>
            </div>
            <div className="text-right">
              <span className="text-[#0A1628] text-xl font-bold">
                {currencySymbol} {price.toLocaleString()}
              </span>
              <span className="text-gray-400 text-xs ml-0.5">/person</span>
            </div>
          </div>

          {/* Amenities inline */}
          {tour.amenities && tour.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tour.amenities.slice(0, 3).map((amenity, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#B8960F] text-[11px] font-medium border border-[#D4AF37]/20"
                >
                  {amenity}
                </span>
              ))}
              {tour.amenities.length > 3 && (
                <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[11px]">
                  +{tour.amenities.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── View Details Button (Gold background) ── */}
        <div className="px-5 pb-5 pt-2">
          <div
            className={`w-full py-3 rounded-xl text-center font-bold text-sm transition-all duration-400 ${
              isHovered
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] shadow-lg shadow-[#D4AF37]/40 scale-[1.02]'
                : 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-[#0A1628] shadow-md shadow-[#D4AF37]/20'
            }`}
          >
            <span className="flex items-center justify-center gap-1">
              View Details
              <svg
                className={`w-4 h-4 transition-transform duration-400 ${isHovered ? 'translate-x-1' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
