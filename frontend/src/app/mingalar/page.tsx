import { getAll } from "@/lib/persistentStore";
import MingalarClient from "./mingalarclient";

async function fetchSiteConfig() {
  try {
    const r = await fetch((process.env.SITE_URL || "http://localhost:3000") + "/api/admin/site-config", { next: { revalidate: 60 }, cache: "no-store" });
    return await r.json();
  } catch { return {}; }
}

export const dynamic = "force-dynamic";

interface LoungeItem {
  img: string;
  icon: string;
  title: string;
  desc: string;
}

const FALLBACK_MINGALAR: LoungeItem[] = [
  { img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609571752_1e7bt9-fine-dining-4jxXMQKzbQzKIbXm4mcE1z3zQR0oJM.jpg", icon: "🍽️", title: "Fine Dining", desc: "Premium buffet with international cuisine and a la carte menu" },
  { img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609572987_j5u2mo-open-bar-hxaaHaxfeopFIZLffZWqTuWxukB3PU.jpg", icon: "🍸", title: "Open Bar", desc: "Complimentary premium drinks, cocktails and mocktails" },
  { img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609574070_alr2wx-workspace-YQe7TYFmvPD3EGLaSpVrT2fYJT7RqJ.jpg", icon: "💻", title: "Workspace", desc: "High-speed WiFi, work stations and private meeting pods" },
  { img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609575245_w0hq5r-shower-suites-KIW0G94JlVbzJpyaA6szYb6IF1uah7.jpg", icon: "🚿", title: "Shower Suites", desc: "Refresh with premium toiletries before your flight" },
  { img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609576449_bra3sd-business-center-6YrWwQ9wheGpdtcqdLvdsbo1oL5R9T.jpg", icon: "💼", title: "Business Center", desc: "Meeting rooms, printing and executive services" },
  { img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609577709_scuw7m-vip-lounge-O01NOtpjZppBUGNp37lGP7MLx4g8yv.jpg", icon: "👑", title: "VIP Lounge", desc: "Exclusive VIP area with personalized butler service" },
  { img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609578940_mfhzqa-nap-pods-Bz8sXDKlTJj8UNWi0XnaW8fwA0Oluz.jpg", icon: "😴", title: "Nap Pods", desc: "Private sleeping pods for restful pre-flight naps" },
  { img: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609580087_1bkb16-concierge-VB9tbHBZZcIjevepAWjyO5YzsNpbbn.jpg", icon: "🛎️", title: "Concierge", desc: "Priority check-in, boarding and personalized assistance" },
];

async function getInitialLounge(): Promise<LoungeItem[]> {
  try {
    const raw = await getAll("mingalar") as any[];
    if (!raw || raw.length === 0) return FALLBACK_MINGALAR;
    return raw.map((item: any) => ({
      img: item.img || item.image || "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609571752_1e7bt9-fine-dining-4jxXMQKzbQzKIbXm4mcE1z3zQR0oJM.jpg",
      icon: item.icon || "✨",
      title: item.title || "Sky Lounge",
      desc: item.desc || item.description || "",
    }));
  } catch {
    return FALLBACK_MINGALAR;
  }
}

export default async function MingalarPage() {
  const [initialCards, siteConfig] = await Promise.all([getInitialLounge(), fetchSiteConfig()]);
  return <MingalarClient initialCards={initialCards} siteConfig={siteConfig || {}} />;
}
