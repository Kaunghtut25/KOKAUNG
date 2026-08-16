import { NextRequest, NextResponse } from "next/server";
import { create as storeCreate, getAll as storeGetAll } from "@/lib/persistentStore";
import { sendBookingEmail, sendCustomerConfirmationEmail } from "@/lib/email";
import { validateBookingInput } from "@/lib/bookingValidation";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

// FIX 2026-08-16: /api/bookings previously did not exist — BookingModal and booking/page.tsx
// were posting here and getting 404. This route restores the contract with validation + idempotency.
export async function POST(request: NextRequest) {
  try {
    const rl = await rateLimit("booking:" + clientIp(request), 10, 60);
    if (!rl.ok) {
      return NextResponse.json({ success: false, message: "Too many booking attempts. Please try again later." }, { status: 429, headers: { "X-RateLimit-Limit": String(rl.limit), "X-RateLimit-Remaining": "0", "Retry-After": String(rl.retryAfterSec) } });
    }
    const body = await request.json();
    const errors = validateBookingInput(body);
    if (errors.length > 0) return NextResponse.json({ success: false, message: "Validation failed", errors }, { status: 400 });

    const requestId = body.requestId;
    if (requestId) {
      try {
        const all = await storeGetAll("bookings");
        const existing = all.find((b: any) => b.requestId === requestId && b.travelType === String(body.travelType || body.itemType));
        if (existing) {
          return NextResponse.json({ success: true, message: "Booking already submitted", data: { _id: existing._id, bookingId: existing.referenceNumber, referenceNumber: existing.referenceNumber }, duplicate: true });
        }
      } catch { /* dedup check is best-effort */ }
    }

    const ref = "A9-BK-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    const inquiryData = {
      fullName: body.fullName || body.name || body.customerName,
      email: body.email || body.customerEmail,
      phone: body.phone || body.customerPhone,
      travelType: body.travelType || body.itemType,
      itemName: body.itemName || "",
      itemId: body.itemId || "",
      totalPrice: body.totalPrice ?? body.totalAmount ?? 0,
      currency: body.currency || "MMK",
      travelDate: body.travelDate || body.departDate || "",
      travelers: body.travelers ?? body.passengers ?? 1,
      quantity: body.quantity ?? 1,
      specialRequests: body.specialRequests || "",
      paymentMethod: body.paymentMethod || "",
      transactionId: body.transactionId || "",
      status: "New",
      referenceNumber: ref,
      requestId: requestId || "",
      createdAt: new Date().toISOString(),
    };

    let dbSaved = false;
    let saved: any = null;
    try {
      saved = await storeCreate("bookings", inquiryData);
      dbSaved = true;
    } catch (e) { console.error("[Bookings] store failed:", e); }

    try { await sendBookingEmail(inquiryData); } catch (e) { console.error("[Bookings] admin email failed:", e); }
    try { await sendCustomerConfirmationEmail(inquiryData); } catch (e) { console.error("[Bookings] customer email failed:", e); }

    const _id = saved?._id || "bk-" + Date.now();
    return NextResponse.json({ success: true, message: "Booking submitted successfully!", dbSaved, data: { _id, bookingId: ref, referenceNumber: ref } }, { status: 201 });
  } catch (err: any) {
    console.error("[Bookings] POST error:", err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
