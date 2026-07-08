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

  // Remove unused next/image import

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.round(rating) ? 'text-[#D4AF37]' : 'text-gray-600'}`}
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
      className={`group relative rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 ${
        isHovered
          ? 'border-[#D4AF37]/60 shadow-xl shadow-[#D4AF37]/10 scale-[1.02]'
          : 'border-gold/20 shadow-lg shadow-black/20'
      }`}
    >
      {/* Image container */}
      <div className="relative h-[300px] w-full overflow-hidden bg-gray-200">
        <img
          src={displayImage}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImgError(true)}
          loading="lazy"
          style={{ position: 'absolute', inset: 0 }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Destination badge - top left */}
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#D4AF37]/90 text-gray-900 text-xs font-semibold backdrop-blur-sm">
          {tour.destination}
        </span>

        {/* Duration badge - top right */}
        <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-sm border border-white/10">
          {tour.duration} {tour.durationUnit}
        </span>

        {/* Bottom overlay content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3
            className="text-white text-xl font-bold mb-2 line-clamp-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {tour.title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">{renderStars(tour.rating)}</div>
            <div className="text-right">
              <span className="text-[#D4AF37] text-lg font-bold">
                {currencySymbol} {price.toLocaleString()}
              </span>
              <span className="text-gray-400 text-xs ml-1">/person</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities chips */}
      {tour.amenities && tour.amenities.length > 0 && (
        <div className="p-4 flex flex-wrap gap-2">
          {tour.amenities.slice(0, 4).map((amenity, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs border border-[#D4AF37]/20"
            >
              {amenity}
            </span>
          ))}
          {tour.amenities.length > 4 && (
            <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-400 text-xs">
              +{tour.amenities.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* View Details button */}
      <div className="px-4 pb-4">
        <button
          onClick={(e) => { e.stopPropagation(); router.push(`/tours/${tour.slug}`); }}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#E5C048] hover:to-[#D4AF37] text-gray-900 font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/20"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
