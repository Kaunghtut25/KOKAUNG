import { getAll } from "@/lib/persistentStore";
import ToursClient from "./toursclient";

export const dynamic = 'force-dynamic';

async function getInitialTours() {
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

export default async function ToursPage() {
  const initialTours = await getInitialTours();
  return <ToursClient initialTours={initialTours} />;
}
