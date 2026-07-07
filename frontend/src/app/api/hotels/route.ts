import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/adminStore";

export const dynamic = 'force-dynamic';

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

    let hotels = getAll("hotels") as Record<string, unknown>[];

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

    const total = hotels.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const data = hotels.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data,
      pagination: { page, limit, total, totalPages },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
