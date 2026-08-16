import { NextRequest, NextResponse } from "next/server";
import { getAll as storeGetAll, update as storeUpdate } from "@/lib/persistentStore";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const PAYMENT_METHODS = new Set(["kbzpay", "wavepay", "bank", "bank_transfer"]);
    const paymentMethod = body.paymentMethod;
    if (typeof paymentMethod !== "string" || !PAYMENT_METHODS.has(paymentMethod)) {
      return NextResponse.json({ success: false, message: "Invalid payment method" }, { status: 400 });
    }
    const transactionId = body.paymentMetadata?.transactionId || body.transactionId || "";

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

    return NextResponse.json({ success: true, data: { paymentStatus: "Recorded", booking: updated || booking } });
  } catch (err: any) {
    console.error("[Bookings] pay error:", err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
