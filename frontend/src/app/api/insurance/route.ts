import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/adminStore";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const plans = getAll("insurances");
    return NextResponse.json({
      success: true,
      data: plans,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
