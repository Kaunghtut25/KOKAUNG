import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/persistentStore";

export const dynamic = 'force-dynamic';

function transformInsurance(raw: Record<string, unknown>) {
  const rid = (raw.id || raw._id) as string;
  const fallbackImgs: Record<string, string> = { i1: "/images_v2/ins1-v2.jpg", i2: "/images_v2/ins2-v2.jpg", i3: "/images_v2/ins3-v2.jpg", i4: "/images_v2/ins4-v2.jpg" };
  // Parse images properly (handle JSON string)
  let img = (raw.image as string) || '';
  if (!img) {
    const rawImgs = raw.images;
    if (Array.isArray(rawImgs) && rawImgs.length > 0) {
      const first = rawImgs[0];
      if (typeof first === 'string' && first.trim().startsWith('[')) {
        try { const p = JSON.parse(first); if (Array.isArray(p) && p.length > 0) img = p[0]; } catch {}
      }
      if (!img && typeof first === 'string') img = first.trim();
    } else if (typeof rawImgs === 'string' && rawImgs.trim()) {
      const s = rawImgs.trim();
      if (s.startsWith('[')) { try { const p = JSON.parse(s); if (Array.isArray(p) && p.length > 0) img = p[0]; } catch {} }
      if (!img) img = s;
    }
  }
  if (!img) img = fallbackImgs[rid] || "/images_v2/ins1-v2.jpg";
  const benefits = typeof raw.benefits === 'string'
    ? (raw.benefits as string).split(',').map(s => s.trim()).filter(Boolean)
    : Array.isArray(raw.benefits) ? raw.benefits as string[] : [];
  const exclusions = typeof raw.exclusions === 'string'
    ? (raw.exclusions as string).split(',').map(s => s.trim()).filter(Boolean)
    : Array.isArray(raw.exclusions) ? raw.exclusions as string[] : [];
  return {
    _id: rid,
    id: rid,
    planName: (raw.planName as string) || (raw.title as string) || '',
    coverageAmountMMK: Number(raw.coverageAmountMMK) || 0,
    coverageAmountUSD: Number(raw.coverageAmountUSD) || 0,
    // Map premiumPriceMMK -> priceMMK for frontend compatibility
    priceMMK: Number(raw.priceMMK || raw.premiumPriceMMK || raw.premiumMMK) || 0,
    priceUSD: Number(raw.priceUSD || raw.premiumPriceUSD || raw.premiumUSD) || 0,
    coverage: (raw.coverage as string) || '',
    duration: (raw.duration as string) || 'Per Trip',
    benefits,
    exclusions,
    description: (raw.description as string) || '',
    image: img,
    status: (raw.status as string) || 'active',
  };
}

export async function GET() {
  try {
    const plans = await getAll("insurances") as Record<string, unknown>[];
    return NextResponse.json({
      success: true,
      data: plans.map(transformInsurance),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
