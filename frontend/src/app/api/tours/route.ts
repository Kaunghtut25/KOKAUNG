import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/persistentStore";

export const dynamic = 'force-dynamic';

const TOUR_IMAGES: Record<string, string> = {
  t1: "/images_v2/tour-bagan-v2.jpg", t2: "/images_v2/tour-yangon-v2.jpg",
  t3: "/images_v2/tour-inle-v2.jpg", t4: "/images_v2/tour-beach-v2.jpg",
  t5: "/images_v2/tour-mandalay-v2.jpg", t6: "/images_v2/tour-grand-v2.jpg",
};
const TOUR_FALLBACK = "/images_v2/hotel1-v2.jpg";

function parseImages(raw: unknown): string[] {
  // Handle array — could be real array or array containing JSON string
  if (Array.isArray(raw)) {
    const out: string[] = [];
    for (const item of raw) {
      if (typeof item === 'string' && item.trim().startsWith('[')) {
        try { const parsed = JSON.parse(item); if (Array.isArray(parsed)) { out.push(...parsed.filter((x: unknown) => typeof x === 'string' && x.trim())); continue; } } catch {}
      }
      if (typeof item === 'string' && item.trim()) out.push(item.trim());
    }
    return out;
  }
  // Handle string — could be JSON array string or single URL
  if (typeof raw === 'string' && raw.trim()) {
    const s = raw.trim();
    if (s.startsWith('[')) {
      try { const parsed = JSON.parse(s); if (Array.isArray(parsed)) return parsed.filter((x: unknown) => typeof x === 'string' && x.trim()); } catch {}
    }
    return [s];
  }
  return [];
}

function getImages(t: Record<string, unknown>, id: string): string[] {
  const imgs = parseImages(t.images);
  if (imgs.length > 0) return imgs;
  if (typeof t.image === 'string' && t.image.trim()) return [t.image as string];
  return [TOUR_IMAGES[id] || TOUR_FALLBACK];
}

function transformTour(t: Record<string, unknown>) {
  const tid = (t.id || t._id) as string;
  return {
    _id: tid,
    slug: ((t.title as string) || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    title: t.title as string || '',
    destination: t.destination as string || '',
    description: t.description as string || '',
    priceMMK: Number(t.priceMMK) || 0,
    priceUSD: Number(t.priceUSD) || 0,
    duration: (t.duration as string) || 'N/A',
    durationUnit: 'days',
    groupSize: Number(t.maxGroupSize) || Number(t.capacity) || 10,
    rating: Number(t.rating) || 4.5,
    reviewCount: Number(t.reviewCount) || Math.floor(Math.random() * 50) + 10,
    images: getImages(t, tid),
    amenities: typeof t.amenities === 'string' ? (t.amenities as string).split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(t.amenities) ? t.amenities as string[] : []),
    itinerary: [],
    included: typeof t.included === 'string' ? (t.included as string).split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(t.included) ? t.included as string[] : []),
    excluded: typeof t.excluded === 'string' ? (t.excluded as string).split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(t.excluded) ? t.excluded as string[] : []),
    featured: t.status === 'featured',
    createdAt: (t.createdAt as string) || new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const destination = searchParams.get('destination') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const currency = searchParams.get('currency') || 'MMK';
    const sort = searchParams.get('sort') || '';

    let rawTours = await getAll("tours") as Record<string, unknown>[];

    if (destination.trim()) {
      const dest = destination.trim().toLowerCase();
      rawTours = rawTours.filter(t => (t.destination as string || '').toLowerCase().includes(dest));
    }

    if (minPrice || maxPrice) {
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;
      const priceKey = currency === 'USD' ? 'priceUSD' : 'priceMMK';
      rawTours = rawTours.filter(t => { const p = (t[priceKey] as number) || 0; return p >= min && p <= max; });
    }

    if (sort === 'price_asc') {
      const k = currency === 'USD' ? 'priceUSD' : 'priceMMK';
      rawTours.sort((a, b) => ((a[k] as number) || 0) - ((b[k] as number) || 0));
    } else if (sort === 'price_desc') {
      const k = currency === 'USD' ? 'priceUSD' : 'priceMMK';
      rawTours.sort((a, b) => ((b[k] as number) || 0) - ((a[k] as number) || 0));
    } else if (sort === 'rating') {
      rawTours.sort((a, b) => ((b.rating as number) || 0) - ((a.rating as number) || 0));
    }

    const tours = rawTours.map(transformTour);

    const total = tours.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const data = tours.slice(start, start + limit);

    return NextResponse.json({ success: true, data, pagination: { page, limit, total, totalPages } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
