import { getAll } from "@/lib/persistentStore";
import CruisesClient from "./cruisesclient";

async function fetchSiteConfig() {
  try { const items = await getAll("site-config" as any); return items?.[0] || {}; }
  catch { return {}; }
}

export const dynamic = 'force-dynamic';

interface Cruise {
  _id: string;
  id?: string;
  slug?: string;
  title?: string;
  name?: string;
  destination?: string;
  description?: string;
  priceMMK?: number;
  priceUSD?: number;
  duration?: string;
  images?: string[];
  image?: string;
  amenities?: string;
  included?: string;
  excluded?: string;
}

const DEFAULT_CRUISES: Cruise[] = [
  { _id: 'cr1', id: 'cr1', title: 'Halong Bay Cruise', destination: 'Vietnam', description: 'Sail through emerald waters among limestone karsts.', priceMMK: 650000, priceUSD: 310, duration: '3 Days / 2 Nights', images: ['https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609368332_ogdvxh-halong-bay-cruise-DN02hErUVjbA7g5tYyF78PqpvBiLtu.jpg'], amenities: 'Cabin, All Meals, Kayaking', included: 'Cabin, Meals, Excursions', excluded: 'Flights, Tips' },
  { _id: 'cr2', id: 'cr2', title: 'Mekong River Cruise', destination: 'Cambodia', description: 'Journey along the legendary Mekong River.', priceMMK: 920000, priceUSD: 440, duration: '5 Days / 4 Nights', images: ['https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609369635_4qqbgm-mekong-river-cruise-TFX7rfdQd2KizGqwlEVQPbJGlF28Yq.jpg'], amenities: 'Deluxe Cabin, River View', included: 'Cabin, Meals, Tours', excluded: 'Flights, Insurance' },
  { _id: 'cr3', id: 'cr3', title: 'Andaman Sea Cruise', destination: 'Thailand', description: 'Island hopping in the Andaman Sea.', priceMMK: 580000, priceUSD: 276, duration: '4 Days / 3 Nights', images: ['https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609371185_a6d9cm-andaman-sea-cruise-DGrdWrFm1Bd4Gn84CJ4GX6gu1raCvL.jpg'], amenities: 'Beach Cabins, Snorkeling', included: 'Cabin, Meals, Snorkeling', excluded: 'Flights, Tips' },
  { _id: 'cr4', id: 'cr4', title: 'Singapore Strait Cruise', destination: 'Singapore', description: 'Luxury cruise around Singapore.', priceMMK: 1200000, priceUSD: 571, duration: '3 Days / 2 Nights', images: ['https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609372628_tayqki-singapore-strait-cruise-miIWaEO9qvinGxDZs9H2Yc7blMPxEt.jpg'], amenities: 'Suite, Fine Dining, Pool', included: 'Suite, All Meals', excluded: 'Flights, Alcohol' },
  { _id: 'cr5', id: 'cr5', title: 'Maldives Atoll Cruise', destination: 'Maldives', description: 'Sail through pristine atolls and lagoons.', priceMMK: 2500000, priceUSD: 1190, duration: '7 Days / 6 Nights', images: ['https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609373849_qqocr6-maldives-atoll-cruise-4G5XO1nb7DSkWAqaEf6UzHzUKoVh83.jpg'], amenities: 'Overwater Suite, Diving', included: 'Suite, Meals, Diving', excluded: 'Flights, Spa' },
  { _id: 'cr6', id: 'cr6', title: 'Dubai Marina Cruise', destination: 'UAE', description: 'Evening dinner cruise along Dubai Marina.', priceMMK: 180000, priceUSD: 85, duration: 'Evening', images: ['https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609375257_o1rs8j-dubai-marina-cruise-BgrMHFrRlMaplw4wKa6mhDfiJCZocL.jpg'], amenities: 'Dinner Buffet, Live Music', included: 'Dinner, Drinks', excluded: 'Transfers' },
  { _id: 'cr7', id: 'cr7', title: 'Alaska Glacier Cruise', destination: 'Alaska, USA', description: 'Witness towering glaciers and whales.', priceMMK: 4200000, priceUSD: 2000, duration: '7 Days / 6 Nights', images: ['https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609376675_4c233e-alaska-glacier-cruise-OtRwzKuRPnoga7apeB9VGEwvllAvYQ.jpg'], amenities: 'Balcony Cabin, Wildlife Guide', included: 'Cabin, Meals, Excursions', excluded: 'Flights, Tips' },
  { _id: 'cr8', id: 'cr8', title: 'Norwegian Fjords Cruise', destination: 'Norway', description: 'Sail through dramatic fjords.', priceMMK: 3800000, priceUSD: 1810, duration: '7 Days / 6 Nights', images: ['https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609378262_5q6ygv-norwegian-fjords-cruise-j7xFcN4bQ5WnVlHq59E00Y6yaKQV3I.jpg'], amenities: 'Ocean View Cabin, Nordic Spa', included: 'Cabin, Meals, Tours', excluded: 'Flights, Insurance' },
  { _id: 'cr9', id: 'cr9', title: 'Greek Isles Cruise', destination: 'Greece', description: 'Island-hop through Santorini and Mykonos.', priceMMK: 2800000, priceUSD: 1333, duration: '8 Days / 7 Nights', images: ['https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609379660_ztdt36-greek-isles-cruise-2yVStBJzJwAPF3wplYiL95N9MKL5L7.jpg'], amenities: 'Suite, Pool Deck, Greek Cuisine', included: 'Cabin, Meals, Tours', excluded: 'Flights, Tips' },
  { _id: 'cr10', id: 'cr10', title: 'Antarctic Expedition', destination: 'Antarctica', description: 'The ultimate adventure to the last wilderness.', priceMMK: 8500000, priceUSD: 4050, duration: '12 Days / 11 Nights', images: ['https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609380925_9n0iah-antarctic-expedition-3AUnTFu9jcZMpIpkvoQbENDoxuKeqh.jpg'], amenities: 'Expedition Suite, Zodiac Boats', included: 'Cabin, Meals, Gear', excluded: 'Flights, Insurance' },
  { _id: 'cr11', id: 'cr11', title: 'Myanmar Irrawaddy Cruise', destination: 'Myanmar', description: 'Cruise the majestic Irrawaddy River from Mandalay to Bagan, passing ancient temples and riverside villages.', priceMMK: 1550000, priceUSD: 738, duration: '5 Days / 4 Nights', images: ['https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609382352_ryle8t-myanmar-irrawaddy-cruise-Am9kKNeh5003TOiSveDXzysyPqIdgm.jpg'], amenities: 'Deluxe Cabin, Sun Deck, Cultural Shows', included: 'Cabin, All Meals, Shore Excursions', excluded: 'Flights, Tips' },
];

export default async function CruisesPage() {
  const [dbCruises, siteConfig] = await Promise.all([(getAll('cruises') as Promise<Cruise[]>), fetchSiteConfig()]);
  const cruises = dbCruises.length > 0 ? dbCruises : DEFAULT_CRUISES;
  let moduleOn2 = true;
  try { moduleOn2 = siteConfig?.moduleToggles?.["cruises"] !== false; } catch {}
  if (!moduleOn2) return <div className="min-h-screen bg-[#0A1628] flex items-center justify-center"><div className="text-center"><h1 className="text-3xl text-white font-light mb-3">Coming Soon</h1><p className="text-white/40">This section is temporarily unavailable.</p></div></div>;
  return <CruisesClient initialCruises={cruises} siteConfig={siteConfig || {}} />;
}
