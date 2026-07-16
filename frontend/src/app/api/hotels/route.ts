import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/persistentStore";

export const dynamic = 'force-dynamic';

function parseImages(raw: unknown): string[] {
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
  if (typeof raw === 'string' && raw.trim()) {
    const s = raw.trim();
    if (s.startsWith('[')) {
      try { const parsed = JSON.parse(s); if (Array.isArray(parsed)) return parsed.filter((x: unknown) => typeof x === 'string' && x.trim()); } catch {}
    }
    return [s];
  }
  return [];
}

function transformHotel(h: Record<string, unknown>) {
  const hid = (h.id || h._id) as string;
  const hotelName = (h.name || h.title) as string || '';
  const loc = (h.location || h.destination) as string || '';
  const fallbackImages: Record<string, string[]> = {
    h1: ["/images_v2/hotel1-v3.jpg"], h2: ["/images_v2/hotel2-v3.jpg"],
    h3: ["/images_v2/hotel3-v3.jpg"], h4: ["/images_v2/hotel4-v3.jpg"],
    h5: ["/images_v2/hotel5-v3.jpg"], h6: ["/images_v2/hotel5-v3.jpg"],
  };
  let images = parseImages(h.images);
  if (images.length === 0 && typeof h.image === 'string' && (h.image as string).trim()) images = [(h.image as string).trim()];
  if (images.length === 0) images = fallbackImages[hid] || ["/images_v2/hotel1-v3.jpg"];
  return {
    _id: hid,
    slug: hotelName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    name: hotelName,
    location: loc,
    rating: Number(h.rating) || 4.0,
    reviewCount: Number(h.reviewCount) || Math.floor(Math.random() * 30) + 5,
    pricePerNightMMK: Number(h.pricePerNightMMK || h.priceMMK) || 0,
    pricePerNightUSD: Number(h.pricePerNightUSD || h.priceUSD) || 0,
    images,
    amenities: typeof h.amenities === 'string' ? (h.amenities as string).split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(h.amenities) ? h.amenities as string[] : []),
    availableRooms: Number(h.availableRooms) || 5,
    description: (h.description as string) || '',
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const location = searchParams.get('location') || '';
    const rating = searchParams.get('rating');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const currency = searchParams.get('currency') || 'MMK';
    const sort = searchParams.get('sort') || '';

    let hotels = await getAll("hotels") as Record<string, unknown>[];

    // Filter by location
    if (location.trim()) {
      const loc = location.trim().toLowerCase();
      hotels = hotels.filter(h => 
        (h.location as string || '').toLowerCase().includes(loc)
      );
    }

    // Filter by rating
    if (rating) {
      const minRating = Number(rating);
      hotels = hotels.filter(h => ((h.rating as number) || 0) >= minRating);
    }

    // Filter by price
    if (minPrice || maxPrice) {
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;
      const priceKey = currency === 'USD' ? 'pricePerNightUSD' : 'pricePerNightMMK';
      hotels = hotels.filter(h => {
        const p = (h[priceKey] as number) || 0;
        return p >= min && p <= max;
      });
    }

    // Sort
    if (sort === 'price_asc') {
      const priceKey = currency === 'USD' ? 'pricePerNightUSD' : 'pricePerNightMMK';
      hotels.sort((a, b) => ((a[priceKey] as number) || 0) - ((b[priceKey] as number) || 0));
    } else if (sort === 'price_desc') {
      const priceKey = currency === 'USD' ? 'pricePerNightUSD' : 'pricePerNightMMK';
      hotels.sort((a, b) => ((b[priceKey] as number) || 0) - ((a[priceKey] as number) || 0));
    } else if (sort === 'rating') {
      hotels.sort((a, b) => ((b.rating as number) || 0) - ((a.rating as number) || 0));
    }

    const transformed = hotels.map(transformHotel);

    const total = transformed.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const data = transformed.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data,
      pagination: { page, limit, total, totalPages },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
