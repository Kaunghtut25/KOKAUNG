import { NextRequest, NextResponse } from "next/server";
import { getById, update, delete_ } from "@/lib/adminStore";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hotel = getById("hotels", params.id);
    if (!hotel) {
      return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
    }
    return NextResponse.json(hotel);
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
    const updated = update("hotels", params.id, body);
    if (!updated) {
      return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
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
    const deleted = delete_("hotels", params.id);
    if (!deleted) {
      return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Hotel deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
