import { getAll } from "@/lib/persistentStore";
import HotelsClient from "./hotelsclient";

async function fetchSiteConfig() {
  try { const items = await getAll("site-config" as any); return items?.[0] || {}; }
  catch { return {}; }
}

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
  row?: number;
  status: string;
  featured: boolean;
}

async function getInitialHotels(): Promise<Hotel[]> {
  try {
    const rawHotels = await getAll("hotels") as any[];
    if (!rawHotels || rawHotels.length === 0) return [];
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
      if (images.length === 0) images = ['/images_v2/hotel1-v2.jpg'];

      return {
        _id: h.id || h._id || '',
        slug: (h.name || h.location || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        name: h.name || '',
        location: h.location || '',
        description: h.description || '',
        rating: Number(h.rating) || 4.0,
        reviewCount: Number(h.reviewCount) || 0,
        row: Number(h.row) || 1,
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
  const [siteConfig] = await Promise.all([fetchSiteConfig()]);
  if (siteConfig?.moduleToggles?.hotels === false) return <div className="min-h-screen bg-[#0A1628] flex items-center justify-center"><div className="text-center"><h1 className="text-3xl text-white font-light mb-3">Coming Soon</h1><p className="text-white/40">This section is temporarily unavailable.</p></div></div>;
  return <HotelsClient siteConfig={siteConfig} initialHotels={initialHotels} />;
}