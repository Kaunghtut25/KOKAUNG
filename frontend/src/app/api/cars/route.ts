import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/adminStore";

export const dynamic = 'force-dynamic';

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

    let cars = getAll("cars") as Record<string, unknown>[];

    // Filter by car type
    if (carType.trim() && carType !== 'All') {
      const ct = carType.trim().toLowerCase();
      cars = cars.filter(c => 
        (c.carType as string || '').toLowerCase().includes(ct)
      );
    }

    // Filter by price (using first pricing entry)
    if (minPrice || maxPrice) {
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;
      const priceKey = currency === 'USD' ? 'priceUSD' : 'priceMMK';
      cars = cars.filter(c => {
        const pricingArr = Array.isArray(c.pricing) ? c.pricing : [];
        if (!pricingArr || pricingArr.length === 0) return false;
        const p = (pricingArr[0] as Record<string, unknown>)[priceKey] as number || 0;
        return p >= min && p <= max;
      });
    }

    // Sort
    if (sort === 'price_asc') {
      const priceKey = currency === 'USD' ? 'priceUSD' : 'priceMMK';
      cars.sort((a, b) => {
        const pa = Array.isArray(a.pricing) && a.pricing.length > 0 ? ((a.pricing[0] as Record<string, unknown>)[priceKey] as number) || 0 : 0;
        const pb = Array.isArray(b.pricing) && b.pricing.length > 0 ? ((b.pricing[0] as Record<string, unknown>)[priceKey] as number) || 0 : 0;
        return pa - pb;
      });
    } else if (sort === 'price_desc') {
      const priceKey = currency === 'USD' ? 'priceUSD' : 'priceMMK';
      cars.sort((a, b) => {
        const pa = Array.isArray(a.pricing) && a.pricing.length > 0 ? ((a.pricing[0] as Record<string, unknown>)[priceKey] as number) || 0 : 0;
        const pb = Array.isArray(b.pricing) && b.pricing.length > 0 ? ((b.pricing[0] as Record<string, unknown>)[priceKey] as number) || 0 : 0;
        return pb - pa;
      });
    }

    const total = cars.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const data = cars.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data,
      pagination: { page, limit, total, totalPages },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
