"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ label = "Back" }: { label?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-900/80 backdrop-blur-md text-white hover:bg-gray-800 border border-gray-700/40 transition-all duration-300 font-medium shadow-lg"
    >
      ← {label}
    </button>
  );
}
