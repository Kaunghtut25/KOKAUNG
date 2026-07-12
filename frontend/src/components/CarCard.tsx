'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car } from '@/lib/api';

interface CarCardProps {
  car: Car;
  currency?: 'MMK' | 'USD';
}

const FALLBACK_IMAGE = 'https://picsum.photos/seed/a9car-fallback/600/400';

function getImages(images: string | string[] | undefined): string[] {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  return images.split(' ').filter(Boolean);
}

export default function CarCard({ car, currency = 'MMK' }: CarCardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mainImage = getImages(car.images)[0] || FALLBACK_IMAGE;
  const displayImage = imgError ? FALLBACK_IMAGE : mainImage;

  const cheapestOption =
    car.pricingWithDriver && car.pricingWithDriver.length > 0
      ? car.pricingWithDriver.reduce((prev, curr) =>
          (currency === 'MMK' ? curr.priceMMK < prev.priceMMK : curr.priceUSD < prev.priceUSD)
            ? curr
            : prev
        )
      : null;

  const currencySymbol = currency === 'MMK' ? 'Ks' : '$';
  const displayPrice = cheapestOption
    ? currency === 'MMK' ? cheapestOption.priceMMK : cheapestOption.priceUSD
    : 0;

  const features = car.features || [];
  const visibleFeatures = features.slice(0, 3);
  const extraCount = features.length - 3;

  return (
    <div
      onClick={() => router.push(`/cars/${car.slug}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 ${
        isHovered
          ? 'border-[#D4AF37]/60 shadow-xl shadow-[#D4AF37]/10 scale-[1.02]'
          : 'border-gray-200 shadow-lg shadow-black/10'
      }`}
    >
      {/* Image container */}
      <div className="relative h-[300px] w-full overflow-hidden bg-gray-200">
        <img
          src={displayImage}
          alt={car.carType}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImgError(true)}
          loading="lazy"
          style={{ position: 'absolute', inset: 0 }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Car type badge */}
        <span className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/90 text-gray-900 text-[11px] font-semibold backdrop-blur-sm">
          {car.carType}
        </span>

        {/* Capacity badge */}
        <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[11px] font-medium backdrop-blur-sm border border-white/10 inline-flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {car.capacity} seats
        </span>

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3
            className="text-white text-xl font-bold mb-1 line-clamp-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {car.carType}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-xs">
              {cheapestOption ? cheapestOption.duration : 'Contact us'}
            </span>
            <div className="text-right">
              <span className="text-[#D4AF37] text-lg font-bold">
                {currencySymbol} {displayPrice.toLocaleString()}
              </span>
              {cheapestOption && (
                <span className="text-gray-400 text-[11px] ml-0.5">/{cheapestOption.duration}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      {features.length > 0 && (
        <div className="p-4 flex flex-wrap gap-1.5">
          {visibleFeatures.map((feature, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#B8960F] text-[10px] font-medium border border-[#D4AF37]/20"
            >
              {feature}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-400 text-[10px]">
              +{extraCount} more
            </span>
          )}
        </div>
      )}

      {/* Book Now button */}
      <div className="px-4 pb-4">
        <button
          onClick={(e) => { e.stopPropagation(); router.push('/contact'); }}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#E5C048] hover:to-[#D4AF37] text-gray-900 font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/20"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
