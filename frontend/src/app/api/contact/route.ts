import { NextRequest, NextResponse } from "next/server";
import { create as storeCreate, getAll as storeGetAll } from "@/lib/persistentStore";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const dynamic = 'force-dynamic';

// FIX 2026-08-16: contact hardening — server validation, honeypot spam trap, requestId idempotency, rate limit.
export async function POST(request: NextRequest) {
  try {
    const rl = await rateLimit("contact:" + clientIp(request), 10, 60);
    if (!rl.ok) {
      return NextResponse.json(
        { success: false, message: "Too many messages. Please try again later." },
        { status: 429, headers: { "X-RateLimit-Limit": String(rl.limit), "X-RateLimit-Remaining": "0", "Retry-After": String(rl.retryAfterSec) } }
      );
    }
    const body = await request.json();
    const { name, email, phone, subject, message, website, requestId } = body;

    // Honeypot: bots fill the hidden "website" field — silently pretend success, store nothing.
    if (website) {
      return NextResponse.json({ success: true, message: "Message sent successfully! We'll get back to you soon." });
    }

    const errors: string[] = [];
    if (!name || !String(name).trim()) errors.push("Name is required");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) errors.push("A valid email is required");
    if (phone && !/^[+\d][\d\s\-()]{5,20}$/.test(String(phone).trim())) errors.push("A valid phone number is required");
    if (!message || !String(message).trim()) errors.push("Message is required");
    if (message && String(message).length > 5000) errors.push("Message must be 5000 characters or fewer");
    if (errors.length > 0) {
      return NextResponse.json({ success: false, message: "Validation failed", errors }, { status: 400 });
    }

    // Idempotency: same requestId (per form session) never stores a duplicate.
    if (requestId) {
      try {
        const all = await storeGetAll("bookings");
        const existing = all.find((b: any) => b.requestId === requestId && b.travelType === "contact");
        if (existing) {
          return NextResponse.json({ success: true, message: "Message already sent", referenceNumber: existing.referenceNumber, duplicate: true });
        }
      } catch { /* best-effort */ }
    }

    const ref = "A9-MSG-" + Date.now().toString(36).toUpperCase();
    const inquiry = await storeCreate("bookings", {
      fullName: name,
      email,
      phone: phone || "",
      travelType: "contact",
      specialRequests: `[${subject || "General Inquiry"}] ${message}`,
      status: "New",
      referenceNumber: ref,
      requestId: requestId || "",
      createdAt: new Date().toISOString(),
    });

    try {
      const { sendBookingEmail } = await import("@/lib/email");
      await sendBookingEmail({
        fullName: name,
        email,
        phone: phone || "N/A",
        travelType: "Contact Form",
        referenceNumber: inquiry.referenceNumber,
        specialRequests: `[${subject || "General Inquiry"}] ${message}`,
        contactPreference: "email",
      });
    } catch { /* email not configured — inquiry still saved */ }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
      referenceNumber: inquiry.referenceNumber,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
