'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car } from '@/lib/api';
import { generateCarSVG } from '@/lib/svgGenerator';

interface CarCardProps {
  car: Car;
  currency?: 'MMK' | 'USD';
}

export default function CarCard({ car, currency = 'MMK' }: CarCardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const carType = car.carType || (car as any).title || '';
  const carId = (car._id || (car as any).id) as string;
  const svgImage = generateCarSVG(carType || 'Car');
  const cheapestOption = (car.pricingWithDriver && car.pricingWithDriver.length > 0)
    ? car.pricingWithDriver.reduce((prev, curr) =>
        (currency === 'MMK' ? curr.priceMMK < prev.priceMMK : curr.priceUSD < prev.priceUSD) ? curr : prev)
    : (car as any).pricePerDayMMK ? { duration: 'Full Day', priceMMK: (car as any).pricePerDayMMK, priceUSD: (car as any).pricePerDayUSD || 0 } : null;
  const currencySymbol = currency === 'MMK' ? 'Ks' : '$';
  const displayPrice = cheapestOption
    ? (currency === 'MMK' ? cheapestOption.priceMMK : cheapestOption.priceUSD) : 0;
  const displayDuration = cheapestOption ? cheapestOption.duration : 'Contact us';
  const features = (car.features && car.features.length > 0) ? car.features :
    ((car as any).type ? [((car as any).type)] : []);
  const visibleFeatures = features.slice(0, 3);
  const extraCount = features.length - 3;

  return (
    <div
      onClick={() => router.push(`/cars/${car.slug}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer w-full h-full"
      style={{ perspective: '1200px' }}
    >
      <div
        className={`relative rounded-2xl overflow-hidden bg-white h-full flex flex-col transition-all duration-500 ease-out ${
          isHovered ? 'shadow-2xl shadow-black/30 -translate-y-2' : 'shadow-lg shadow-black/10'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered ? 'rotateX(2deg) translateZ(6px)' : 'rotateX(0deg) translateZ(0)',
        }}
      >
        {/* Gold bracket frame - top left */}
        <div className="absolute top-0 left-0 z-30 pointer-events-none">
          <div className="absolute top-0 left-0 h-[10px] w-[55px] bg-gradient-to-r from-[#D4AF37] via-[#D4AF37] to-transparent rounded-tl-xl shadow-[0_2px_6px_rgba(212,175,55,0.35)]" />
          <div className="absolute top-0 left-0 w-[10px] h-[40px] bg-gradient-to-b from-[#D4AF37] via-[#D4AF37] to-transparent rounded-tl-xl shadow-[2px_0_6px_rgba(212,175,55,0.25)]" />
          <div className="absolute top-[1px] left-[1px] w-[7px] h-[7px] bg-[#F5A623] rounded-full shadow-[0_0_4px_rgba(245,166,35,0.6)]" />
        </div>
        {/* Gold bracket frame - top right */}
        <div className="absolute top-0 right-0 z-30 pointer-events-none">
          <div className="absolute top-0 right-0 h-[10px] w-[55px] bg-gradient-to-l from-[#D4AF37] via-[#D4AF37] to-transparent rounded-tr-xl shadow-[0_2px_6px_rgba(212,175,55,0.35)]" />
          <div className="absolute top-0 right-0 w-[10px] h-[40px] bg-gradient-to-b from-[#D4AF37] via-[#D4AF37] to-transparent rounded-tr-xl shadow-[-2px_0_6px_rgba(212,175,55,0.25)]" />
          <div className="absolute top-[1px] right-[1px] w-[7px] h-[7px] bg-[#F5A623] rounded-full shadow-[0_0_4px_rgba(245,166,35,0.6)]" />
        </div>

        {/* Image Section */}
        <div className="relative h-[280px] w-full overflow-hidden bg-gray-200">
          <img src={svgImage} alt={carType} className="w-full h-full object-cover transition-transform duration-700 ease-out" style={{ position: 'absolute', inset: 0, transform: isHovered ? 'scale(1.08)' : 'scale(1)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
          {/* Car type badge */}
          <div className="absolute top-7 left-3 z-20">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#0A1628]/85 text-[#D4AF37] text-[11px] font-semibold backdrop-blur-sm border border-[#D4AF37]/40 shadow-lg shadow-black/30">
              🚗 {carType}
            </span>
          </div>
          {/* Capacity badge */}
          <div className="absolute top-7 right-3 z-20">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[11px] font-medium backdrop-blur-sm border border-white/15">
              <svg className="w-3 h-3 inline mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {car.capacity} seats
            </span>
          </div>
        </div>

        {/* Navy-to-White Gradient */}
        <div className="h-4 bg-gradient-to-b from-[#0A1628] to-white" />

        {/* Info */}
        <div className="px-4 pt-2 pb-1 space-y-1.5 flex-1">
          <h3 className="text-[#0A1628] text-base font-bold leading-tight line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {carType}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-[11px]">{displayDuration}</span>
            <div className="text-right">
              <span className="text-[#0A1628] text-base font-bold">{currencySymbol} {displayPrice.toLocaleString()}</span>
              {cheapestOption && <span className="text-gray-400 text-[11px] ml-0.5">/{displayDuration}</span>}
            </div>
          </div>
          {features.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {visibleFeatures.map((feature, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#B8960F] text-[10px] font-medium border border-[#D4AF37]/20">{feature}</span>
              ))}
              {extraCount > 0 && <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 text-[10px]">+{extraCount} more</span>}
            </div>
          )}
        </div>

        {/* Button */}
        <div className="px-4 pb-4 pt-1.5">
          <div className={`w-full py-2.5 rounded-xl text-center font-bold text-sm transition-all duration-400 ${
            isHovered ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] shadow-lg shadow-[#D4AF37]/40 scale-[1.02]' : 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-[#0A1628] shadow-md shadow-[#D4AF37]/20'
          }`}>
            Book Now
          </div>
        </div>
      </div>
    </div>
  );
}
