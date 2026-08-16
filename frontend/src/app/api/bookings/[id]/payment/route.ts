import { NextRequest, NextResponse } from "next/server";
import { getAll as storeGetAll, update as storeUpdate } from "@/lib/persistentStore";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const paymentMethod = body.paymentMethod || "bank";
    const transactionId = body.transactionId || "";

    const all = await storeGetAll("bookings");
    const booking = all.find((b: any) => String(b._id) === id || b.referenceNumber === id);
    if (!booking) return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });

    const updated = await storeUpdate("bookings", booking._id, {
      ...booking,
      paymentMethod,
      transactionId,
      paymentStatus: "Recorded",
      paidAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: { paymentStatus: "Recorded" }, booking: updated || booking });
  } catch (err: any) {
    console.error("[Bookings] payment error:", err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
