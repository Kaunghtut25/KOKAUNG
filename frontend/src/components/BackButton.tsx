'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BackButton({ label = "Back", bookNowUrl, bookNowLabel = "Book Now" }: { label?: string; bookNowUrl?: string; bookNowLabel?: string }) {
  const router = useRouter();
  return (
    <div className="fixed top-20 left-4 z-30 flex items-center gap-3">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900/80 backdrop-blur-md text-white hover:bg-gray-800 border border-gray-700/40 transition-all duration-300 font-medium shadow-lg text-sm"
      >
        ← {label}
      </button>
      {bookNowUrl && (
        <Link
          href={bookNowUrl}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] hover:shadow-lg hover:shadow-[#D4AF37]/30 hover:scale-105 transition-all duration-300 font-bold text-sm"
        >
          {bookNowLabel}
        </Link>
      )}
    </div>
  );
}
