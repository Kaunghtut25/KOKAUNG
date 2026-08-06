"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

export default function BackButton({ label }: { label?: string }) {
  const router = useRouter();
  const { t } = useI18n();
  const resolved = label ?? t("common.back");
  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-900/80 backdrop-blur-md text-white hover:bg-gray-800 border border-gray-700/40 transition-all duration-300 font-medium shadow-lg"
    >
      ← {resolved}
    </button>
  );
}
