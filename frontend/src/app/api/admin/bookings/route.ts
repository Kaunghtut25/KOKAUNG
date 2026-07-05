import { NextRequest, NextResponse } from "next/server";
import { getBookings } from "@/lib/adminStore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || undefined;

    const result = getBookings(page, limit, status);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
