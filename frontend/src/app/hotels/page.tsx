import { getAll } from "@/lib/persistentStore";
import HotelsClient from "./hotelsclient";

export const dynamic = 'force-dynamic';

interface Hotel {
  _id: string;
  slug: string;
  name: string;
  location: string;
  description: string;
  rating: number;
  reviewCount: number;
  pricePerNightMMK: number;
  pricePerNightUSD: number;
  availableRooms: number;
  totalRooms: number;
  amenities: string[];
  images: string[];
  status: string;
  featured: boolean;
}

async function getInitialHotels(): Promise<Hotel[]> {
  try {
    const rawHotels = await getAll("hotels") as any[];
    return rawHotels.map((h: any) => {
      let images: string[] = [];
      if (Array.isArray(h.images)) {
        for (const item of h.images) {
          if (typeof item === 'string' && item.trim().startsWith('[')) {
            try { const parsed = JSON.parse(item); if (Array.isArray(parsed)) { images.push(...parsed.filter((x: string) => x.trim())); continue; } } catch {}
          }
          if (typeof item === 'string' && item.trim()) images.push(item.trim());
        }
      } else if (typeof h.images === 'string' && h.images.trim()) {
        const s = h.images.trim();
        if (s.startsWith('[')) { try { const parsed = JSON.parse(s); if (Array.isArray(parsed)) images = parsed.filter((x: string) => x.trim()); } catch { images = [s]; } }
        else images = [s];
      }
      if (images.length === 0) images = ['/images_v2/hotel1-v3.jpg'];

      return {
        _id: h.id || h._id || '',
        slug: (h.name || h.location || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        name: h.name || '',
        location: h.location || '',
        description: h.description || '',
        rating: Number(h.rating) || 4.0,
        reviewCount: Number(h.reviewCount) || 0,
        pricePerNightMMK: Number(h.pricePerNightMMK) || 0,
        pricePerNightUSD: Number(h.pricePerNightUSD) || 0,
        availableRooms: Number(h.availableRooms) || 0,
        totalRooms: Number(h.totalRooms) || 0,
        amenities: typeof h.amenities === 'string' ? h.amenities.split(',').map((s: string) => s.trim()).filter(Boolean) : Array.isArray(h.amenities) ? h.amenities : [],
        images,
        status: h.status || 'active',
        featured: h.featured || false,
      };
    });
  } catch {
    return [];
  }
}

export default async function HotelsPage() {
  const initialHotels = await getInitialHotels();
  return <HotelsClient initialHotels={initialHotels} />;
}