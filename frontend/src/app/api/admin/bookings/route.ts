import { NextRequest, NextResponse } from "next/server";
import { getBookings, update } from "@/lib/persistentStore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || undefined;

    const all = await getBookings();
    const items = status ? all.filter((b) => String(b.status || b.paymentStatus || "") === status) : all;
    return NextResponse.json(items.slice((page - 1) * limit, page * limit));
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
