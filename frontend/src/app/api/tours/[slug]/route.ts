import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/persistentStore";

export const dynamic = 'force-dynamic';

const TOUR_IMAGES: Record<string, string> = {
  t1: "/images_v2/tour-bagan-v2.jpg", t2: "/images_v2/tour-yangon-v2.jpg",
  t3: "/images_v2/tour-inle-v2.jpg", t4: "/images_v2/tour-beach-v2.jpg",
  t5: "/images_v2/tour-mandalay-v2.jpg", t6: "/images_v2/tour-grand-v2.jpg",
};
const TOUR_FALLBACK = "/images_v2/hotel1-v3.jpg";

function parseImages(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    const out: string[] = [];
    for (const item of raw) {
      if (typeof item === 'string' && item.trim().startsWith('[')) {
        try { const parsed = JSON.parse(item); if (Array.isArray(parsed)) { out.push(...parsed.filter((x: unknown) => typeof x === 'string' && x.trim())); continue; } } catch { /* skip */ }
      }
      if (typeof item === 'string' && item.trim()) out.push(item.trim());
    }
    return out;
  }
  if (typeof raw === 'string' && raw.trim()) {
    const s = raw.trim();
    if (s.startsWith('[')) {
      try { const parsed = JSON.parse(s); if (Array.isArray(parsed)) return parsed.filter((x: unknown) => typeof x === 'string' && x.trim()); } catch { /* skip */ }
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
    reviewCount: Number(t.reviewCount) || 42,
    images: getImages(t, tid),
    amenities: typeof t.amenities === 'string' ? (t.amenities as string).split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(t.amenities) ? t.amenities as string[] : []),
    itinerary: [],
    included: typeof t.included === 'string' ? (t.included as string).split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(t.included) ? t.included as string[] : []),
    excluded: typeof t.excluded === 'string' ? (t.excluded as string).split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(t.excluded) ? t.excluded as string[] : []),
    featured: t.status === 'featured',
    createdAt: (t.createdAt as string) || new Date().toISOString(),
  };
}

const ACTIVITIES = [
  { title: 'Arrival & City Tour', desc: 'Welcome! Airport transfer and afternoon city exploration including key landmarks and local markets.' },
  { title: 'Cultural Heritage Day', desc: 'Visit ancient temples, pagodas, and monasteries. Explore the rich cultural heritage with a local guide.' },
  { title: 'Nature & Scenic Tour', desc: 'Discover natural wonders with a scenic tour. Visit lakes, mountains, or gardens nearby.' },
  { title: 'Local Experience Day', desc: 'Immerse in local culture with cooking classes, traditional craft workshops, and village visits.' },
  { title: 'Free Day & Shopping', desc: 'Enjoy a free day for personal exploration, shopping for souvenirs, or optional activities.' },
  { title: 'Adventure Day', desc: 'Optional adventure activities - boat trips, hiking, or hot air balloon rides depending on the season.' },
  { title: 'Sunset & Farewell', desc: 'Spectacular sunset experience and farewell dinner. Transfer to airport for departure.' },
];

const DEFAULT_INCLUDED = [
  'Airport transfers (arrival & departure)',
  'Hotel accommodation with breakfast',
  'English-speaking local guide',
  'All entrance fees & activity tickets',
  'Private transportation (AC vehicle)',
  'Bottled water & refreshments',
  'Travel insurance coverage',
];

const DEFAULT_EXCLUDED = [
  'International flights',
  'Personal expenses & tips',
  'Meals not mentioned in itinerary',
  'Visa fees (if applicable)',
  'Optional activities & excursions',
  'Camera fees at certain sites',
];

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const rawTours = await getAll("tours") as Record<string, unknown>[];
    const tours = rawTours.map(transformTour);
    const tour = tours.find(t => t.slug === slug || t._id === slug);

    if (!tour) {
      return NextResponse.json({ success: false, message: "Tour not found" }, { status: 404 });
    }

    // Add sample itinerary if empty
    if (!tour.itinerary || tour.itinerary.length === 0) {
      const durStr = String(tour.duration || '5');
      const daysMatch = durStr.match(/(\d+)/); const days = daysMatch ? Math.min(parseInt(daysMatch[1]), 10) : 5;
      const dest = tour.destination || 'Myanmar';
      tour.itinerary = Array.from({ length: days }, (_, i) => {
        const act = ACTIVITIES[i % ACTIVITIES.length];
        return {
          day: i + 1,
          title: act.title,
          description: act.desc,
          meals: i % 2 === 0 ? ['Breakfast', 'Lunch'] : ['Breakfast'],
          accommodation: i < days - 1 ? `${dest} Premium Hotel` : undefined,
        };
      });
    }

    // Add sample included/excluded if empty
    if (!tour.included || tour.included.length === 0) {
      tour.included = [...DEFAULT_INCLUDED];
    }
    if (!tour.excluded || tour.excluded.length === 0) {
      tour.excluded = [...DEFAULT_EXCLUDED];
    }

    return NextResponse.json({ success: true, data: tour });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
