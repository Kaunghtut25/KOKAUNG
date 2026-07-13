import { NextRequest, NextResponse } from "next/server";
import { getAll, create } from "@/lib/adminStore";
import { update } from "@/lib/adminStore";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const hotels = getAll("hotels");
    return NextResponse.json(hotels);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}


export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });
    const updated = update("hotels", id, body);
    if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
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
