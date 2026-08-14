import { getAll } from "@/lib/persistentStore";
import DestinationsClient from "./DestinationsClient";

export const dynamic = "force-dynamic";

interface Destination {
  _id?: string;
  city: string;
  country: string;
  image: string;
  minPrice: string;
  bestTime?: string;
  description?: string;
  highlights?: string[];
  rating?: number;
  reviews?: number;
  duration?: string;
  tags?: string[];
}

async function fetchDestinations(): Promise<Destination[]> {
  try {
    const items = await getAll("destinations" as any) as any[];
    if (!items || items.length === 0) return [];
    return items.map((item: any) => ({
      _id: item.id || item._id,
      city: item.city || "",
      country: item.country || "",
      image: typeof item.images === "string" ? JSON.parse(item.images)[0] : (Array.isArray(item.images) ? item.images[0] : (item.image || item.img || "")),
      minPrice: item.minPrice || "",
      bestTime: item.bestTime || "",
      description: item.description || "",
      highlights: typeof item.highlights === "string" ? item.highlights.split(",").map((s: string) => s.trim()).filter(Boolean) : (Array.isArray(item.highlights) ? item.highlights : []),
      rating: typeof item.rating === "number" ? item.rating : (typeof item.rating === "string" ? parseFloat(item.rating) : undefined),
      reviews: typeof item.reviews === "number" ? item.reviews : (typeof item.reviews === "string" ? parseInt(item.reviews, 10) : undefined),
      duration: item.duration || "",
      tags: typeof item.tags === "string" ? item.tags.split(",").map((s: string) => s.trim()).filter(Boolean) : (Array.isArray(item.tags) ? item.tags : []),
    }));
  } catch {
    return [];
  }
}

async function fetchSiteConfig() {
  try { const items = await getAll("site-config" as any); return items?.[0] || null; }
  catch { return null; }
}

export default async function DestinationsPage() {
  const [destinations, siteConfig] = await Promise.all([fetchDestinations(), fetchSiteConfig()]);
  // Admin-deleted destinations must NOT reappear: pass store data as-is.
  return <DestinationsClient initialDestinations={destinations} siteConfig={siteConfig || {}} />;
}