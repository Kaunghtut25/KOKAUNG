import { getAll } from "@/lib/persistentStore";
import MingalarClient from "./mingalarclient";

export const dynamic = "force-dynamic";

interface LoungeItem {
  img: string;
  icon: string;
  title: string;
  desc: string;
}

const FALLBACK_MINGALAR: LoungeItem[] = [
  { img: "/images_v2/sky1-v2.jpg", icon: "🍽️", title: "Fine Dining", desc: "Premium buffet with international cuisine and a la carte menu" },
  { img: "/images_v2/sky2-v2.jpg", icon: "🍸", title: "Open Bar", desc: "Complimentary premium drinks, cocktails and mocktails" },
  { img: "/images_v2/sky3-v2.jpg", icon: "💻", title: "Workspace", desc: "High-speed WiFi, work stations and private meeting pods" },
  { img: "/images_v2/sky-main-v2.jpg", icon: "🚿", title: "Shower Suites", desc: "Refresh with premium toiletries before your flight" },
  { img: "/images_v2/sky-business-v2.jpg", icon: "💼", title: "Business Center", desc: "Meeting rooms, printing and executive services" },
  { img: "/images_v2/sky-vip-v2.jpg", icon: "👑", title: "VIP Lounge", desc: "Exclusive VIP area with personalized butler service" },
  { img: "/images_v2/sky1-v2.jpg", icon: "😴", title: "Nap Pods", desc: "Private sleeping pods for restful pre-flight naps" },
  { img: "/images_v2/sky2-v2.jpg", icon: "🛎️", title: "Concierge", desc: "Priority check-in, boarding and personalized assistance" },
];

async function getInitialLounge(): Promise<LoungeItem[]> {
  try {
    const raw = await getAll("mingalar") as any[];
    if (!raw || raw.length === 0) return FALLBACK_MINGALAR;
    return raw.map((item: any) => ({
      img: item.img || item.image || "/images_v2/sky1-v2.jpg",
      icon: item.icon || "✨",
      title: item.title || "Sky Lounge",
      desc: item.desc || item.description || "",
    }));
  } catch {
    return FALLBACK_MINGALAR;
  }
}

export default async function MingalarPage() {
  const initialCards = await getInitialLounge();
  return <MingalarClient initialCards={initialCards} />;
}