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
  featured: boolean;
  createdAt: string;
}

async function getInitialTours(): Promise<Tour[]> {
  try {
    const rawTours = await getAll("tours") as any[];
    return rawTours.map((t: any) => {
      let images: string[] = [];
      if (Array.isArray(t.images)) images = t.images;
      else if (typeof t.images === 'string' && t.images.trim()) {
        try { images = JSON.parse(t.images); } catch { images = [t.images]; }
      }
      if (images.length === 0 && t.image) images = [t.image];
      if (images.length === 0) images = ['/images_v2/bagan-v2.jpg'];

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
        rating: 4.5,
        reviewCount: 42,
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
    return [];
  }
}

type PreloadMap = Record<string, string>;

export default async function ToursPage() {
  const initialTours = await getInitialTours();
  
  // Build preload map of image URLs for server-side delivery
  const preloadMap: PreloadMap = {};
  for (const tour of initialTours) {
    const img = getImageFallback(tour._id, tour.images);
    preloadMap[tour._id || tour.slug] = img;
  }
  
  return <ToursClient initialTours={initialTours} preloadMap={preloadMap} />;
}
