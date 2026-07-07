import { NextRequest, NextResponse } from "next/server";
import { getAll, create } from "@/lib/adminStore";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tours = getAll("tours");
    return NextResponse.json(tours);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tour = create("tours", body);
    return NextResponse.json(tour, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
