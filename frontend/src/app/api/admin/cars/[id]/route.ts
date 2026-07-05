import { NextRequest, NextResponse } from "next/server";
import { getById, update, delete_ } from "@/lib/adminStore";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const car = getById("cars", params.id);
    if (!car) {
      return NextResponse.json({ message: "Car not found" }, { status: 404 });
    }
    return NextResponse.json(car);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = update("cars", params.id, body);
    if (!updated) {
      return NextResponse.json({ message: "Car not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = delete_("cars", params.id);
    if (!deleted) {
      return NextResponse.json({ message: "Car not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Car deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
