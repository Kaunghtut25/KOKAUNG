import { getAll } from "@/lib/persistentStore";
import CruisesClient from "./cruisesclient";

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
  { _id: 'cr1', id: 'cr1', title: 'Halong Bay Cruise', destination: 'Vietnam', description: 'Sail through emerald waters among limestone karsts.', priceMMK: 650000, priceUSD: 310, duration: '3 Days / 2 Nights', images: ['/images_v2/hero-cruises-v2.jpg'], amenities: 'Cabin, All Meals, Kayaking', included: 'Cabin, Meals, Excursions', excluded: 'Flights, Tips' },
  { _id: 'cr2', id: 'cr2', title: 'Mekong River Cruise', destination: 'Cambodia', description: 'Journey along the legendary Mekong River.', priceMMK: 920000, priceUSD: 440, duration: '5 Days / 4 Nights', images: ['/images_v2/dest-vietnam-v2.jpg'], amenities: 'Deluxe Cabin, River View', included: 'Cabin, Meals, Tours', excluded: 'Flights, Insurance' },
  { _id: 'cr3', id: 'cr3', title: 'Andaman Sea Cruise', destination: 'Thailand', description: 'Island hopping in the Andaman Sea.', priceMMK: 580000, priceUSD: 276, duration: '4 Days / 3 Nights', images: ['/images_v2/dest-thailand-v2.jpg'], amenities: 'Beach Cabins, Snorkeling', included: 'Cabin, Meals, Snorkeling', excluded: 'Flights, Tips' },
  { _id: 'cr4', id: 'cr4', title: 'Singapore Strait Cruise', destination: 'Singapore', description: 'Luxury cruise around Singapore.', priceMMK: 1200000, priceUSD: 571, duration: '3 Days / 2 Nights', images: ['/images_v2/dest-singapore-v2.jpg'], amenities: 'Suite, Fine Dining, Pool', included: 'Suite, All Meals', excluded: 'Flights, Alcohol' },
  { _id: 'cr5', id: 'cr5', title: 'Maldives Atoll Cruise', destination: 'Maldives', description: 'Sail through pristine atolls and lagoons.', priceMMK: 2500000, priceUSD: 1190, duration: '7 Days / 6 Nights', images: ['/images_v2/dest-maldives-v2.jpg'], amenities: 'Overwater Suite, Diving', included: 'Suite, Meals, Diving', excluded: 'Flights, Spa' },
  { _id: 'cr6', id: 'cr6', title: 'Dubai Marina Cruise', destination: 'UAE', description: 'Evening dinner cruise along Dubai Marina.', priceMMK: 180000, priceUSD: 85, duration: 'Evening', images: ['/images_v2/dest-dubai-v2.jpg'], amenities: 'Dinner Buffet, Live Music', included: 'Dinner, Drinks', excluded: 'Transfers' },
  { _id: 'cr7', id: 'cr7', title: 'Alaska Glacier Cruise', destination: 'Alaska, USA', description: 'Witness towering glaciers and whales.', priceMMK: 4200000, priceUSD: 2000, duration: '7 Days / 6 Nights', images: ['/images_v2/dest-japan-v2.jpg'], amenities: 'Balcony Cabin, Wildlife Guide', included: 'Cabin, Meals, Excursions', excluded: 'Flights, Tips' },
  { _id: 'cr8', id: 'cr8', title: 'Norwegian Fjords Cruise', destination: 'Norway', description: 'Sail through dramatic fjords.', priceMMK: 3800000, priceUSD: 1810, duration: '7 Days / 6 Nights', images: ['/images_v2/dest-korea-v2.jpg'], amenities: 'Ocean View Cabin, Nordic Spa', included: 'Cabin, Meals, Tours', excluded: 'Flights, Insurance' },
  { _id: 'cr9', id: 'cr9', title: 'Greek Isles Cruise', destination: 'Greece', description: 'Island-hop through Santorini and Mykonos.', priceMMK: 2800000, priceUSD: 1333, duration: '8 Days / 7 Nights', images: ['/images_v2/dest-paris-v2.jpg'], amenities: 'Suite, Pool Deck, Greek Cuisine', included: 'Cabin, Meals, Tours', excluded: 'Flights, Tips' },
  { _id: 'cr10', id: 'cr10', title: 'Antarctic Expedition', destination: 'Antarctica', description: 'The ultimate adventure to the last wilderness.', priceMMK: 8500000, priceUSD: 4050, duration: '12 Days / 11 Nights', images: ['/images_v2/hero-cruises-v2.jpg'], amenities: 'Expedition Suite, Zodiac Boats', included: 'Cabin, Meals, Gear', excluded: 'Flights, Insurance' },
];

export default function CruisesPage() {
  const dbCruises = getAll('cruises') as Cruise[];
  const cruises = dbCruises.length > 0 ? dbCruises : DEFAULT_CRUISES;
  return <CruisesClient initialCruises={cruises} />;
}
