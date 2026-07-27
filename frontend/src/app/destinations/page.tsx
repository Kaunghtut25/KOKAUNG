import { getAll } from "@/lib/persistentStore";
import DestinationsClient from "./DestinationsClient";

export const dynamic = "force-dynamic";

interface Destination {
  city: string;
  country: string;
  image: string;
  minPrice: string;
  bestTime?: string;
  description?: string;
  highlights?: string[];
}

const FALLBACK_DESTINATIONS: Destination[] = [
  {
    city: "Bangkok", country: "Thailand",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609663178_ta1biy-bangkok-x7Q8kUMuXRvj6qMJAZxBbawKS4zkjI.jpg",
    minPrice: "From Ks 120,000",
    bestTime: "November to February (cool season)",
    description: "Bangkok is a vibrant metropolis where ancient temples meet modern skyscrapers. Explore the Grand Palace, cruise the Chao Phraya River, and experience world-famous Thai street food.",
  },
  {
    city: "Singapore", country: "Singapore",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609664529_gc0coa-singapore-1I4l0IofxTbJLSLc5dELHgf1XUPxpL.jpg",
    minPrice: "From Ks 250,000",
    bestTime: "February to April (dry season)",
    description: "Singapore is a dazzling city-state of futuristic architecture, lush gardens, and multicultural neighborhoods. Visit Gardens by the Bay and enjoy world-class dining.",
  },
  {
    city: "Tokyo", country: "Japan",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609665668_3ecvek-tokyo-TYjK5as5wFpIatqF1kbSi4h2t3ZUT1.jpg",
    minPrice: "From Ks 550,000",
    bestTime: "March to May (cherry blossom) or October to November (autumn)",
    description: "Tokyo blends ultramodern technology with ancient traditions. From neon-lit Shibuya to serene Meiji Shrine, the city offers endless discoveries for every traveler.",
  },
  {
    city: "Seoul", country: "South Korea",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609666783_tpdn63-seoul-2vEDeNREwxMmMcKljIrmhIkNRzMx2x.jpg",
    minPrice: "From Ks 550,000",
    bestTime: "March to May and September to November",
    description: "Seoul is a dynamic city where ancient palaces sit alongside K-pop culture. Explore Gyeongbokgung Palace, shop in Myeongdong, and indulge in Korean BBQ.",
  },
  {
    city: "Dubai", country: "United Arab Emirates",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609667895_nhc8s9-dubai-d3lPglj2ETCLL85cMyDIUrqR87uSJr.jpg",
    minPrice: "From Ks 680,000",
    bestTime: "November to March (mild weather)",
    description: "Dubai is a city of superlatives with the tallest building, largest mall, and most luxurious hotels. Experience desert safaris and futuristic architecture.",
  },
  {
    city: "Paris", country: "France",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609669026_5swn98-paris-NP2sb2JVZ4tGQYsaHWnFEQZrwH3W4h.jpg",
    minPrice: "From Ks 850,000",
    bestTime: "April to June and September to October",
    description: "Paris is the city of love, lights, and timeless elegance. From the Eiffel Tower to charming cafes, every corner tells a story of art and romance.",
  },
  {
    city: "Bali", country: "Indonesia",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609670120_iixb10-bali-e92X2ozIcinwD996tg4B5u2BXS0cdz.jpg",
    minPrice: "From Ks 180,000",
    bestTime: "April to October (dry season)",
    description: "Bali is the Island of Gods, offering stunning beaches, lush rice terraces, ancient temples, and a vibrant arts scene. Perfect for relaxation.",
  },
  {
    city: "Maldives", country: "Maldives",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609671009_3evgmu-maldives-hypfQQJCg06kuyANjh41tsEh3jJ1iZ.jpg",
    minPrice: "From Ks 380,000",
    bestTime: "November to April (dry season)",
    description: "The Maldives is a tropical paradise of overwater villas, crystal-clear lagoons, and pristine white-sand beaches. The ultimate luxury getaway.",
  },
  {
    city: "Yangon", country: "Myanmar",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609672110_hoxenr-yangon-ZR2KEYFv4nTcNHRSbkTYE73ZoXIegP.jpg",
    minPrice: "From Ks 80,000",
    bestTime: "November to February (cool season)",
    description: "Yangon is Myanmar largest city and former capital, home to the magnificent Shwedagon Pagoda. Explore colonial architecture and authentic Burmese cuisine.",
  },
  {
    city: "Bagan", country: "Myanmar",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609673423_cxib2z-bagan-XuauRMTtDqUuuRh7T11ier0WFheWOP.jpg",
    minPrice: "From Ks 95,000",
    bestTime: "November to February (cool season)",
    description: "Bagan is an archaeological wonderland with over 2,000 ancient temples spread across a vast plain. Hot air balloon rides at sunrise offer unforgettable views.",
  },
  {
    city: "Ho Chi Minh City", country: "Vietnam",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609674645_4crguu-ho-chi-minh-city-BcBT3Ux26O1qAcrfZ3qiJWRIqtF9tM.jpg",
    minPrice: "From Ks 105,000",
    bestTime: "December to April (dry season)",
    description: "Ho Chi Minh City (Saigon) is Vietnam economic powerhouse with vibrant energy. Explore the Cu Chi Tunnels and experience the buzzing nightlife.",
  },
  {
    city: "Kuala Lumpur", country: "Malaysia",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609676271_plrv46-kuala-lumpur-9BY1o9HTEVFgEy8zC00KyY98WYR3Ze.jpg",
    minPrice: "From Ks 150,000",
    bestTime: "May to July and December to February",
    description: "Kuala Lumpur is a melting pot of cultures with the iconic Petronas Twin Towers, colorful Batu Caves, and incredible street food from Malay, Chinese, and Indian traditions.",
  },
];

async function fetchSiteConfig() {
  try { const items = await getAll("site-config" as any); return items?.[0] || {}; }
  catch { return {}; }
}

async function getInitialDestinations(): Promise<Destination[]> {
  try {
    const raw = await getAll("destinations") as any[];
    if (!raw || raw.length === 0) return FALLBACK_DESTINATIONS;
    return raw.map((d: any) => ({
      city: d.city || d.name || "",
      country: d.country || "",
      image: (Array.isArray(d.images) ? d.images[0] : d.image || d.img) || FALLBACK_DESTINATIONS[0].image,
      minPrice: d.minPrice || ("From Ks " + (d.priceMMK ? Number(d.priceMMK).toLocaleString() : "150,000")),
      bestTime: d.bestTime || "",
      description: d.description || "",
      highlights: Array.isArray(d.highlights) ? d.highlights : [],
    }));
  } catch {
    return FALLBACK_DESTINATIONS;
  }
}

export default async function DestinationsPage() {
  const [initialDestinations, siteConfig] = await Promise.all([getInitialDestinations(), fetchSiteConfig()]);
  if (siteConfig?.moduleToggles?.destinations === false) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl text-white font-light mb-3">Coming Soon</h1>
          <p className="text-white/40">This section is temporarily unavailable.</p>
        </div>
      </div>
    );
  }
  return <DestinationsClient initialDestinations={initialDestinations} siteConfig={siteConfig} />;
}