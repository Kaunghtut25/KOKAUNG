import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/adminStore";

export const dynamic = 'force-dynamic';

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

    let tours = getAll("tours") as Record<string, unknown>[];

    // Filter by destination
    if (destination.trim()) {
      const dest = destination.trim().toLowerCase();
      tours = tours.filter(t => 
        (t.destination as string || '').toLowerCase().includes(dest)
      );
    }

    // Filter by price
    if (minPrice || maxPrice) {
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;
      const priceKey = currency === 'USD' ? 'priceUSD' : 'priceMMK';
      tours = tours.filter(t => {
        const p = (t[priceKey] as number) || 0;
        return p >= min && p <= max;
      });
    }

    // Sort
    if (sort === 'price_asc') {
      const priceKey = currency === 'USD' ? 'priceUSD' : 'priceMMK';
      tours.sort((a, b) => ((a[priceKey] as number) || 0) - ((b[priceKey] as number) || 0));
    } else if (sort === 'price_desc') {
      const priceKey = currency === 'USD' ? 'priceUSD' : 'priceMMK';
      tours.sort((a, b) => ((b[priceKey] as number) || 0) - ((a[priceKey] as number) || 0));
    } else if (sort === 'rating') {
      tours.sort((a, b) => ((b.rating as number) || 0) - ((a.rating as number) || 0));
    }

    const total = tours.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const data = tours.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data,
      pagination: { page, limit, total, totalPages },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
