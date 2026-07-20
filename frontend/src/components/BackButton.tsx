"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ label = "Back" }: { label?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/15 backdrop-blur-md text-white hover:bg-white/25 border border-white/20 transition-all duration-300 font-medium"
    >
      ← {label}
    </button>
  );
}
