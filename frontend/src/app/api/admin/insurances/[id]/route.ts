import { NextRequest, NextResponse } from "next/server";
import { getById, update, delete_ } from "@/lib/adminStore";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const insurance = getById("insurances", params.id);
    if (!insurance) {
      return NextResponse.json({ message: "Insurance not found" }, { status: 404 });
    }
    return NextResponse.json(insurance);
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
    const updated = update("insurances", params.id, body);
    if (!updated) {
      return NextResponse.json({ message: "Insurance not found" }, { status: 404 });
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
    const deleted = delete_("insurances", params.id);
    if (!deleted) {
      return NextResponse.json({ message: "Insurance not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Insurance deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
