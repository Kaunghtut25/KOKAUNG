'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Hotel } from "@/lib/api";
import { getImageFallback } from "@/lib/imageFallback";



interface HotelCardProps {
  hotel: Hotel;
  currency?: "MMK" | "USD";
}

export default function HotelCard({ hotel, currency = "MMK" }: HotelCardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const price = currency === "MMK" ? hotel.pricePerNightMMK : hotel.pricePerNightUSD;
  const currencySymbol = currency === "MMK" ? "Ks" : "$";
  const displayImage = (() => {
    if (hotel.images && Array.isArray(hotel.images) && hotel.images.length > 0 && typeof hotel.images[0] === "string" && hotel.images[0].startsWith("/")) return hotel.images[0];
    if (typeof hotel.images === "string" && hotel.images.startsWith("/")) return hotel.images;
    const map: Record<string,string> = {h1:"/images_v2/hotel1-v2.jpg",h2:"/images_v2/hotel2-v2.jpg",h3:"/images_v2/hotel3-v2.jpg",h4:"/images_v2/hotel4-v2.jpg",h5:"/images_v2/hotel5-v2.jpg",h6:"/images_v2/hotel6-v2.jpg",h7:"/images_v2/hotel-luxury-v2.jpg",h8:"/images_v2/hotel-budget-v2.jpg",h9:"/images_v2/hotel-city-v2.jpg",h10:"/images_v2/hotel-resort-v2.jpg"};
    return map[hotel._id as string] || "/images_v2/hotel1-v2.jpg";
  })();
  const roomsAvailable = hotel.availableRooms ?? 0;
  const roomsLabel = roomsAvailable === 0 ? "Sold Out" : roomsAvailable <= 3 ? `Only ${roomsAvailable} left` : `${roomsAvailable} rooms`;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(rating) ? "text-[#D4AF37]" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div
      onClick={() => router.push(`/hotels/${hotel.slug}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer w-full h-full"
      style={{ perspective: "1200px" }}
    >
      <div
        className={`relative rounded-2xl overflow-hidden bg-white h-full flex flex-col transition-all duration-500 ease-out ${
          isHovered ? "shadow-2xl shadow-black/30 -translate-y-2" : "shadow-lg shadow-black/10"
        }`}
        style={{
          transformStyle: "preserve-3d",
          transform: isHovered ? "rotateX(2deg) translateZ(6px)" : "rotateX(0deg) translateZ(0)",
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
          <img src={displayImage} alt={hotel.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
          {/* Location badge */}
          <div className="absolute top-7 left-3 z-20">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#0A1628]/85 text-[#D4AF37] text-[11px] font-semibold backdrop-blur-sm border border-[#D4AF37]/40 shadow-lg shadow-black/30">
              📍 {hotel.location}
            </span>
          </div>
          {/* Rooms badge */}
          <div className="absolute top-7 right-3 z-20">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium backdrop-blur-sm border ${
              roomsAvailable === 0 ? "bg-red-500/20 text-red-400 border-red-500/30" :
              roomsAvailable <= 3 ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
              "bg-green-500/20 text-green-400 border-green-500/30"
            }`}>
              {roomsLabel}
            </span>
          </div>
        </div>

        {/* Navy-to-White Gradient */}
        <div className="h-4 bg-gradient-to-b from-[#0A1628] to-white" />

        {/* Info */}
        <div className="px-4 pt-2 pb-1 space-y-1.5 flex-1">
          <h3 className="text-[#0A1628] text-base font-bold leading-tight line-clamp-2 group-hover:text-[#D4AF37] transition-colors duration-300" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {hotel.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">{renderStars(hotel.rating)}</div>
              <span className="text-gray-400 text-[11px]">({hotel.reviewCount})</span>
            </div>
            <div className="text-right">
              <span className="text-[#0A1628] text-base font-bold">{currencySymbol} {price.toLocaleString()}</span>
              <span className="text-gray-400 text-[11px] ml-0.5">/night</span>
            </div>
          </div>
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#B8960F] text-[10px] font-medium border border-[#D4AF37]/20">{amenity}</span>
              ))}
              {hotel.amenities.length > 3 && <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 text-[10px]">+{hotel.amenities.length - 3}</span>}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="px-4 pb-4 pt-1.5 space-y-2">
          <div
            onClick={(e) => { e.stopPropagation(); router.push("/book-now?type=hotel&name=" + encodeURIComponent(hotel.name) + "&id=" + encodeURIComponent(hotel._id||hotel.id||"") + "&priceMMK=" + (hotel.priceMMK||0) + "&priceUSD=" + (hotel.priceUSD||0) + "&location=" + encodeURIComponent(hotel.location||"")); }}
            className={`w-full py-2.5 rounded-xl text-center font-bold text-sm transition-all duration-400 ${
              isHovered ? "bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] shadow-lg shadow-[#D4AF37]/40 scale-[1.02]" : "bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-[#0A1628] shadow-md shadow-[#D4AF37]/20"
            }`}>
            Book Now
          </div>
          {/* View Details button */}
          <div
            onClick={(e) => { e.stopPropagation(); router.push("/hotels/" + hotel.slug); }}
            className={`w-full py-2.5 rounded-xl text-center font-semibold text-sm transition-all duration-400 border ${
              isHovered ? "bg-[#0A1628] text-[#D4AF37] border-[#D4AF37] shadow-lg shadow-[#0A1628]/20 scale-[1.02]" : "bg-white text-[#0A1628] border-[#D4AF37]/50"
            }`}>
            View Details →
          </div>
        </div>
      </div>
    </div>
  );
}






