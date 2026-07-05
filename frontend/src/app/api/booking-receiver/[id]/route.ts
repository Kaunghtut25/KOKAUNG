import { NextRequest, NextResponse } from "next/server";
import { getById, update } from "@/lib/adminStore";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const existing = getById("inquiries", params.id);
    if (!existing) {
      return NextResponse.json({ success: false, message: "Inquiry not found" }, { status: 404 });
    }

    const updated = update("inquiries", params.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
