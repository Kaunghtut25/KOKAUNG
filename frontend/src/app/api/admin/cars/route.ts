import { NextRequest, NextResponse } from "next/server";
import { create, getAll, update } from "@/lib/persistentStore";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cars = await getAll("cars");
    return NextResponse.json(cars);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });
    const updated = await update("cars", id, body);
    if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const car = await create("cars", body);
    return NextResponse.json(car, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
