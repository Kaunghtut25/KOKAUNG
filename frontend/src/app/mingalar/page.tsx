import { getAll } from "@/lib/persistentStore";
import MingalarClient from "./mingalarclient";

export const dynamic = 'force-dynamic';

interface LoungeItem {
  img: string;
  icon: string;
  title: string;
  desc: string;
}

const DEFAULT_CARDS: LoungeItem[] = [
  { img: '/images_v2/sky1-v3.jpg', icon: '🍽️', title: 'Fine Dining', desc: 'Premium buffet & a la carte menu' },
  { img: '/images_v2/sky2-v3.jpg', icon: '🍸', title: 'Open Bar', desc: 'Complimentary drinks & cocktails' },
  { img: '/images_v2/sky3-v3.jpg', icon: '💻', title: 'Workspace', desc: 'High-speed WiFi & work stations' },
  { img: '/images_v2/sky1-v3.jpg', icon: '🚿', title: 'Shower Suites', desc: 'Refresh before your flight' },
  { img: '/images_v2/sky2-v3.jpg', icon: '😴', title: 'Nap Pods', desc: 'Rest in private sleeping pods' },
  { img: '/images_v2/sky3-v3.jpg', icon: '🛎️', title: 'Concierge', desc: 'Priority check-in & boarding' },
];

async function getInitialLounge(): Promise<LoungeItem[]> {
  try {
    const raw = await getAll("mingalar") as any[];
    if (raw.length === 0) return DEFAULT_CARDS;
    return raw.map((item: any) => ({
      img: item.img || item.image || '/images_v2/sky1-v3.jpg',
      icon: item.icon || '✨',
      title: item.title || 'Sky Lounge',
      desc: item.desc || item.description || '',
    }));
  } catch {
    return DEFAULT_CARDS;
  }
}

export default async function MingalarPage() {
  const initialCards = await getInitialLounge();
  return <MingalarClient initialCards={initialCards} />;
}