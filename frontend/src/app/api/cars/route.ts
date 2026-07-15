import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/persistentStore";

export const dynamic = 'force-dynamic';

const CAR_IMAGES: Record<string, string> = {
  c1: "/images_v2/car1-v2.jpg", c2: "/images_v2/car2-v2.jpg", c3: "/images_v2/car3-v2.jpg",
  c4: "/images_v2/car4-v2.jpg", c5: "/images_v2/car5-v2.jpg", c6: "/images_v2/car6-v2.jpg",
};
const CAR_FALLBACK = "/images_v2/car1-v2.jpg";

function getImages(c: Record<string, unknown>, id: string): string[] {
  if (Array.isArray(c.images) && (c.images as string[]).length > 0) return c.images as string[];
  if (typeof c.images === 'string' && c.images.trim()) return [c.images as string];
  if (typeof c.image === 'string' && c.image.trim()) return [c.image as string];
  return [CAR_IMAGES[id] || CAR_FALLBACK];
}

function transformCar(c: Record<string, unknown>) {
  const cid = (c.id || c._id) as string;
  const pricingArr = Array.isArray(c.pricing) ? c.pricing as Record<string, unknown>[] : [];
  return {
    _id: cid,
    slug: ((c.carType as string) || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    carType: c.carType as string || '',
    capacity: Number(c.capacity) || 4,
    images: getImages(c, cid),
    features: typeof c.features === 'string' ? (c.features as string).split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(c.features) ? c.features as string[] : []),
    pricingWithDriver: pricingArr.map((p: Record<string, unknown>) => ({
      duration: (p.duration as string) || 'Full Day',
      priceMMK: Number(p.priceMMK) || 0,
      priceUSD: Number(p.priceUSD) || 0,
    })),
    description: (c.description as string) || '',
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const carType = searchParams.get('carType') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const currency = searchParams.get('currency') || 'MMK';
    const sort = searchParams.get('sort') || '';

    let rawCars = await getAll("cars") as Record<string, unknown>[];

    // Filter on raw data before transforming
    if (carType.trim() && carType !== 'All') {
      const ct = carType.trim().toLowerCase();
      rawCars = rawCars.filter(c => (c.carType as string || '').toLowerCase().includes(ct));
    }

    if (minPrice || maxPrice) {
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;
      const priceKey = currency === 'USD' ? 'priceUSD' : 'priceMMK';
      rawCars = rawCars.filter(c => {
        const pricingArr = Array.isArray(c.pricing) ? c.pricing as Record<string, unknown>[] : [];
        if (!pricingArr.length) return false;
        const p = (pricingArr[0] as Record<string, unknown>)[priceKey] as number || 0;
        return p >= min && p <= max;
      });
    }

    // Sort on raw data
    if (sort === 'price_asc' || sort === 'price_desc') {
      const priceKey = currency === 'USD' ? 'priceUSD' : 'priceMMK';
      rawCars.sort((a, b) => {
        const pa = (Array.isArray(a.pricing) && a.pricing.length > 0 ? ((a.pricing as Record<string, unknown>[])[0] as Record<string, unknown>)[priceKey] as number : 0) || 0;
        const pb = (Array.isArray(b.pricing) && b.pricing.length > 0 ? ((b.pricing as Record<string, unknown>[])[0] as Record<string, unknown>)[priceKey] as number : 0) || 0;
        return sort === 'price_asc' ? pa - pb : pb - pa;
      });
    }

    // Transform
    const cars = rawCars.map(transformCar);

    const total = cars.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const data = cars.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data,
      pagination: { page, limit, total, totalPages },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
