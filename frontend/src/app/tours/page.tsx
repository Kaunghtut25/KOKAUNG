import { getAll } from "@/lib/persistentStore";
import { getImageFallback } from "@/lib/imageFallback";
import ToursClient from "./toursclient";

export const dynamic = 'force-dynamic';

interface Tour {
  _id: string;
  slug: string;
  title: string;
  destination: string;
  description: string;
  priceMMK: number;
  priceUSD: number;
  duration: string;
  durationUnit: string;
  groupSize: number;
  rating: number;
  reviewCount: number;
  images: string[];
  image: string;
  amenities: string[];
  itinerary: never[];
  included: string[];
  excluded: string[];
  row: number;
  featured: boolean;
  createdAt: string;
}

const FALLBACK_TOURS: Tour[] = [
  { _id: "ft1", slug: "classic-vietnam", title: "Classic Vietnam", destination: "Vietnam", description: "Experience the best of Vietnam from Hanoi to Ho Chi Minh City.", priceMMK: 1850000, priceUSD: 880, duration: "8", durationUnit: "days", groupSize: 12, rating: 4.7, reviewCount: 56, images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609680476_s5uefs-classic-vietnam-pK70kuNwboN1N9xQME7t21UdwsGTb5.jpg"], image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609680476_s5uefs-classic-vietnam-pK70kuNwboN1N9xQME7t21UdwsGTb5.jpg", amenities: [], itinerary: [], included: ["Accommodation", "Meals", "Transport"], excluded: ["Flights", "Insurance"], featured: true, createdAt: "2026-01-01T00:00:00.000Z" },
  { _id: "ft2", slug: "myanmar-highlights", title: "Myanmar Highlights", destination: "Myanmar", description: "Discover ancient temples of Bagan, Inle Lake, and Yangon on this comprehensive tour.", priceMMK: 2450000, priceUSD: 1180, duration: "10", durationUnit: "days", groupSize: 10, rating: 4.8, reviewCount: 72, images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609694137_t5agfa-myanmar-highlights-ubpWeZbxQhJk4D1a4OcRMrvawc7ncC.jpg"], image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609694137_t5agfa-myanmar-highlights-ubpWeZbxQhJk4D1a4OcRMrvawc7ncC.jpg", amenities: [], itinerary: [], included: ["Accommodation", "Guide", "Meals"], excluded: ["Flights"], featured: true, createdAt: "2026-01-02T00:00:00.000Z" },
  { _id: "ft3", slug: "ngapali-beach-retreat", title: "Ngapali Beach Retreat", destination: "Ngapali", description: "Relax on the pristine beaches of Ngapali with crystal clear waters and fresh seafood.", priceMMK: 1650000, priceUSD: 790, duration: "5", durationUnit: "days", groupSize: 8, rating: 4.6, reviewCount: 38, images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609695489_vkfpuq-ngapali-beach-retreat-kyStUlmLrO0QK0ayFWDK3b1mE9I2Ka.jpg"], image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609695489_vkfpuq-ngapali-beach-retreat-kyStUlmLrO0QK0ayFWDK3b1mE9I2Ka.jpg", amenities: [], itinerary: [], included: ["Beach Resort", "Meals", "Spa"], excluded: ["Flights"], featured: false, createdAt: "2026-01-03T00:00:00.000Z" },
  { _id: "ft4", slug: "bagan-temples", title: "Bagan Temples Explorer", destination: "Bagan", description: "Explore over 2000 ancient temples and pagodas in the archaeological wonder of Bagan.", priceMMK: 1950000, priceUSD: 930, duration: "4", durationUnit: "days", groupSize: 10, rating: 4.9, reviewCount: 91, images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609696889_yp7gkk-bagan-temples-0p96vwsL2Y9u1ax4pCN5OyCiKj0XjZ.jpg"], image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609696889_yp7gkk-bagan-temples-0p96vwsL2Y9u1ax4pCN5OyCiKj0XjZ.jpg", amenities: [], itinerary: [], included: ["Hotel", "Guide", "E-bike"], excluded: ["Flights", "Drinks"], featured: true, createdAt: "2026-01-04T00:00:00.000Z" },
  { _id: "ft5", slug: "inle-lake", title: "Inle Lake Discovery", destination: "Inle Lake", description: "Cruise the serene waters of Inle Lake, visit floating gardens and traditional villages.", priceMMK: 1550000, priceUSD: 740, duration: "3", durationUnit: "days", groupSize: 8, rating: 4.5, reviewCount: 45, images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609700732_j8ks3f-inle-lake-JMts6ZAceG083FEYuCr5JuqHItfKml.jpg"], image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609700732_j8ks3f-inle-lake-JMts6ZAceG083FEYuCr5JuqHItfKml.jpg", amenities: [], itinerary: [], included: ["Boat tours", "Hotel", "Meals"], excluded: ["Flights"], featured: false, createdAt: "2026-01-05T00:00:00.000Z" },
  { _id: "ft6", slug: "yangon-city", title: "Yangon City Experience", destination: "Yangon", description: "Explore Myanmar's largest city from Shwedagon Pagoda to colonial architecture.", priceMMK: 1250000, priceUSD: 590, duration: "3", durationUnit: "days", groupSize: 15, rating: 4.4, reviewCount: 33, images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609702189_1h0p4o-yangon-city-spkWOcVtuq6WteKDf32bb1tqGleO5F.jpg"], image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609702189_1h0p4o-yangon-city-spkWOcVtuq6WteKDf32bb1tqGleO5F.jpg", amenities: [], itinerary: [], included: ["Hotel", "City tour", "Meals"], excluded: ["Tips"], featured: false, createdAt: "2026-01-06T00:00:00.000Z" },
  { _id: "ft7", slug: "mandalay-royal", title: "Mandalay Royal Heritage", destination: "Mandalay", description: "Visit the last royal capital of Myanmar with its ancient palaces and monasteries.", priceMMK: 1750000, priceUSD: 840, duration: "5", durationUnit: "days", groupSize: 10, rating: 4.6, reviewCount: 41, images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609703761_wurhtg-mandalay-royal-JNlioN911xeMl4x8M3ZsKgwGd27KAb.jpg"], image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609703761_wurhtg-mandalay-royal-JNlioN911xeMl4x8M3ZsKgwGd27KAb.jpg", amenities: [], itinerary: [], included: ["Hotel", "Guide", "Transport"], excluded: ["Flights"], featured: true, createdAt: "2026-01-07T00:00:00.000Z" },
  { _id: "ft8", slug: "golden-rock", title: "Golden Rock Pilgrimage", destination: "Kyaiktiyo", description: "Visit the miraculous Golden Rock pagoda perched on a cliff edge.", priceMMK: 950000, priceUSD: 450, duration: "2", durationUnit: "days", groupSize: 20, rating: 4.3, reviewCount: 29, images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609705036_hj3cug-golden-rock-Daxv0M6zQQcjNBIQas0y91SoMpQozN.jpg"], image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609705036_hj3cug-golden-rock-Daxv0M6zQQcjNBIQas0y91SoMpQozN.jpg", amenities: [], itinerary: [], included: ["Transport", "Hotel", "Meals"], excluded: ["Personal expenses"], featured: false, createdAt: "2026-01-08T00:00:00.000Z" },
  { _id: "ft9", slug: "pyin-oo-lwin", title: "Pyin Oo Lwin Garden Escape", destination: "Pyin Oo Lwin", description: "Enjoy the cool highland air, botanical gardens and colonial charm of Pyin Oo Lwin.", priceMMK: 1100000, priceUSD: 520, duration: "3", durationUnit: "days", groupSize: 12, rating: 4.5, reviewCount: 27, images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609706490_97v2wt-pyin-oo-lwin-uXZ8EU3yGtFM0u99JgZdxJg42wabGF.jpg"], image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609706490_97v2wt-pyin-oo-lwin-uXZ8EU3yGtFM0u99JgZdxJg42wabGF.jpg", amenities: [], itinerary: [], included: ["Hotel", "Garden tours", "Meals"], excluded: ["Flights"], featured: false, createdAt: "2026-01-09T00:00:00.000Z" },
  { _id: "ft10", slug: "ngwe-saung-beach", title: "Ngwe Saung Beach Getaway", destination: "Ngwe Saung", description: "Unwind on the silver sands of Ngwe Saung Beach with crystal clear waters.", priceMMK: 1350000, priceUSD: 640, duration: "4", durationUnit: "days", groupSize: 8, rating: 4.4, reviewCount: 22, images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609707847_4fyxzj-ngwe-saung-beach-AjX8L5Kf7oqjX5fJDWEGEhavD8SpSt.jpg"], image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609707847_4fyxzj-ngwe-saung-beach-AjX8L5Kf7oqjX5fJDWEGEhavD8SpSt.jpg", amenities: [], itinerary: [], included: ["Resort", "Water sports", "Meals"], excluded: ["Flights"], featured: false, createdAt: "2026-01-10T00:00:00.000Z" },
  { _id: "ft11", slug: "mrauk-u", title: "Mrauk U Ancient Kingdom", destination: "Mrauk U", description: "Discover the forgotten ancient kingdom of Mrauk U with its unique stone temples.", priceMMK: 2250000, priceUSD: 1070, duration: "6", durationUnit: "days", groupSize: 8, rating: 4.7, reviewCount: 18, images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609709199_ui7zze-mrauk-u-6OuNDB37Vb6jZKJcb9Dy8a5P2KroWn.jpg"], image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609709199_ui7zze-mrauk-u-6OuNDB37Vb6jZKJcb9Dy8a5P2KroWn.jpg", amenities: [], itinerary: [], included: ["Hotel", "Guide", "Boat"], excluded: ["Flights"], featured: false, createdAt: "2026-01-11T00:00:00.000Z" },
  { _id: "ft12", slug: "hpa-an-adventure", title: "Hpa An Adventure", destination: "Hpa An", description: "Explore caves, karst mountains and rivers in the stunning landscape of Hpa An.", priceMMK: 1450000, priceUSD: 690, duration: "4", durationUnit: "days", groupSize: 10, rating: 4.6, reviewCount: 31, images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609710510_t0m6vx-hpa-an-adventure-KLJpi5KdWfl4HQTY8fewqQnI2HiGSU.jpg"], image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609710510_t0m6vx-hpa-an-adventure-KLJpi5KdWfl4HQTY8fewqQnI2HiGSU.jpg", amenities: [], itinerary: [], included: ["Hotel", "Guide", "Cave tours"], excluded: ["Flights"], featured: false, createdAt: "2026-01-12T00:00:00.000Z" },
  { _id: "ft13", slug: "putao-trek", title: "Putao Trekking Adventure", destination: "Putao", description: "Trek through the untouched Himalayan foothills in Myanmar's far north.", priceMMK: 3250000, priceUSD: 1550, duration: "10", durationUnit: "days", groupSize: 6, rating: 4.8, reviewCount: 15, images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609712080_9wrqbe-putao-trek-V4BKcMRvJDsZNZf2dGGQnJ6mxNaPuR.jpg"], image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609712080_9wrqbe-putao-trek-V4BKcMRvJDsZNZf2dGGQnJ6mxNaPuR.jpg", amenities: [], itinerary: [], included: ["Camping", "Guide", "Meals", "Porters"], excluded: ["Flights", "Insurance"], featured: false, createdAt: "2026-01-13T00:00:00.000Z" },
  { _id: "ft14", slug: "kawthaung-islands", title: "Kawthaung Island Hopping", destination: "Kawthaung", description: "Hop between pristine islands in the Mergui Archipelago with crystal clear waters.", priceMMK: 2850000, priceUSD: 1360, duration: "7", durationUnit: "days", groupSize: 8, rating: 4.7, reviewCount: 24, images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609713179_3meoxc-kawthaung-islands-Ko77vuURuBRlyr4QzaEnuRMPzNEVWA.jpg"], image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609713179_3meoxc-kawthaung-islands-Ko77vuURuBRlyr4QzaEnuRMPzNEVWA.jpg", amenities: [], itinerary: [], included: ["Resort", "Boat", "Snorkeling", "Meals"], excluded: ["Flights", "Drinks"], featured: false, createdAt: "2026-01-14T00:00:00.000Z" },
  { _id: "ft15", slug: "loikaw-tribal", title: "Loikaw Tribal Heritage", destination: "Loikaw", description: "Meet the Kayan long-neck women and explore the tribal culture of Kayah State.", priceMMK: 1850000, priceUSD: 880, duration: "5", durationUnit: "days", groupSize: 8, rating: 4.5, reviewCount: 19, images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609714098_5nhakz-loikaw-tribal-bFI3GvspVPzXO79KyAlFVTKdblmK5B.jpg"], image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609714098_5nhakz-loikaw-tribal-bFI3GvspVPzXO79KyAlFVTKdblmK5B.jpg", amenities: [], itinerary: [], included: ["Hotel", "Guide", "Tribal visits"], excluded: ["Flights"], featured: false, createdAt: "2026-01-15T00:00:00.000Z" },
  { _id: "ft16", slug: "kalaw-hiking", title: "Kalaw Hill Trekking", destination: "Kalaw", description: "Trek through pine forests and hill tribe villages from Kalaw to Inle Lake.", priceMMK: 1350000, priceUSD: 640, duration: "3", durationUnit: "days", groupSize: 8, rating: 4.6, reviewCount: 35, images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609715530_wou2fh-kalaw-hiking-UkmxLElyH9BWwBBmZqt5D5ehr9b9ry.jpg"], image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609715530_wou2fh-kalaw-hiking-UkmxLElyH9BWwBBmZqt5D5ehr9b9ry.jpg", amenities: [], itinerary: [], included: ["Guide", "Homestay", "Meals"], excluded: ["Flights", "Tips"], featured: false, createdAt: "2026-01-16T00:00:00.000Z" },
];

async function getInitialTours(): Promise<Tour[]> {
  try {
    const rawTours = await getAll("tours") as any[];
    if (!rawTours || rawTours.length === 0) return FALLBACK_TOURS;
    return rawTours.map((t: any) => {
      let images: string[] = [];
      if (Array.isArray(t.images)) {
        for (const item of t.images) {
          if (typeof item === 'string' && item.trim().startsWith('[')) {
            try { const parsed = JSON.parse(item); if (Array.isArray(parsed)) { images.push(...parsed.filter((x: string) => x.trim())); continue; } } catch {}
          }
          if (typeof item === 'string' && item.trim()) images.push(item.trim());
        }
      } else if (typeof t.images === 'string' && t.images.trim()) {
        const s = t.images.trim();
        if (s.startsWith('[')) { try { const parsed = JSON.parse(s); if (Array.isArray(parsed)) images = parsed.filter((x: string) => x.trim()); } catch { images = [s]; } }
        else images = [s];
      }
      if (images.length === 0 && t.image) images = [t.image as string];
      if (images.length === 0) images = ['https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609696889_yp7gkk-bagan-temples-0p96vwsL2Y9u1ax4pCN5OyCiKj0XjZ.jpg'];

      return {
        _id: t.id || t._id || '',
        slug: (t.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        title: t.title || '',
        destination: t.destination || '',
        description: t.description || '',
        priceMMK: Number(t.priceMMK) || 0,
        priceUSD: Number(t.priceUSD) || 0,
        duration: t.duration || 'N/A',
        durationUnit: 'days',
        groupSize: Number(t.maxGroupSize) || 10,
        rating: Number(t.rating) || 4.5,
        reviewCount: Number(t.reviewCount) || 0,
        row: Number(t.row) || 1,
        images,
        image: images[0],
        amenities: typeof t.amenities === 'string' ? t.amenities.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        itinerary: [],
        included: typeof t.included === 'string' ? t.included.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        excluded: typeof t.excluded === 'string' ? t.excluded.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        featured: t.status === 'featured' || t.featured,
        createdAt: t.createdAt || new Date().toISOString(),
      };
    });
  } catch {
    return FALLBACK_TOURS;
  }
}

type PreloadMap = Record<string, string>;

export default async function ToursPage() {
  const initialTours = await getInitialTours();
  
  const preloadMap: PreloadMap = {};
  for (const tour of initialTours) {
    const img = getImageFallback(tour._id, tour.images);
    preloadMap[tour._id || tour.slug] = img;
  }
  
  return <ToursClient initialTours={initialTours} preloadMap={preloadMap} />;
}