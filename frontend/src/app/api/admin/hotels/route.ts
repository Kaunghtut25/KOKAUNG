import { NextRequest, NextResponse } from "next/server";
import { getAll, create } from "@/lib/adminStore";

export async function GET() {
  try {
    const hotels = getAll("hotels");
    return NextResponse.json(hotels);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const hotel = create("hotels", body);
    return NextResponse.json(hotel, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
