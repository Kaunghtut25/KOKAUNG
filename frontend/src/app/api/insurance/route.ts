import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/persistentStore";

export const dynamic = 'force-dynamic';

function transformInsurance(raw: Record<string, unknown>) {
  const rid = (raw.id || raw._id) as string;
  const fallbackImgs: Record<string, string> = { i1: "/images_v2/ins1-v3.jpg", i2: "/images_v2/ins2-v3.jpg", i3: "/images_v2/ins3-v3.jpg", i4: "/images_v2/ins4-v3.jpg" };
  const img = (raw.image as string) || fallbackImgs[rid] || "/images_v2/ins1-v3.jpg";
  const benefits = typeof raw.benefits === 'string'
    ? (raw.benefits as string).split(',').map(s => s.trim()).filter(Boolean)
    : Array.isArray(raw.benefits) ? raw.benefits as string[] : [];
  const exclusions = typeof raw.exclusions === 'string'
    ? (raw.exclusions as string).split(',').map(s => s.trim()).filter(Boolean)
    : Array.isArray(raw.exclusions) ? raw.exclusions as string[] : [];
  return { ...raw, image: img, _id: rid, benefits, exclusions };
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
