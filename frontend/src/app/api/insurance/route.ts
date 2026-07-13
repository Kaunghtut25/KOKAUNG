import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/adminStore";

export const dynamic = 'force-dynamic';

function transformInsurance(raw: Record<string, unknown>) {
  const benefits = typeof raw.benefits === 'string'
    ? (raw.benefits as string).split(',').map(s => s.trim()).filter(Boolean)
    : Array.isArray(raw.benefits) ? raw.benefits as string[] : [];
  const exclusions = typeof raw.exclusions === 'string'
    ? (raw.exclusions as string).split(',').map(s => s.trim()).filter(Boolean)
    : Array.isArray(raw.exclusions) ? raw.exclusions as string[] : [];
  return { ...raw, benefits, exclusions };
}

export async function GET() {
  try {
    const plans = getAll("insurances") as Record<string, unknown>[];
    return NextResponse.json({
      success: true,
      data: plans.map(transformInsurance),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
