import { NextRequest, NextResponse } from "next/server";
import { create as storeCreate } from "@/lib/persistentStore";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Store inquiry in database
    const inquiry = await storeCreate("bookings", {
      fullName: name,
      email,
      phone: phone || "",
      travelType: "contact",
      specialRequests: `[${subject}] ${message}`,
      status: "New",
      referenceNumber: "A9-MSG-" + Date.now().toString(36).toUpperCase(),
      createdAt: new Date().toISOString(),
    });

    // Try to send email notification (if Resend is configured)
    try {
      const { sendBookingEmail } = await import("@/lib/email");
      await sendBookingEmail({
        fullName: name,
        email,
        phone: phone || "N/A",
        travelType: "Contact Form",
        referenceNumber: inquiry.referenceNumber,
        specialRequests: `[${subject}] ${message}`,
        contactPreference: "email",
      });
    } catch {
      // Email not configured — inquiry still saved in DB
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
      referenceNumber: inquiry.referenceNumber,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
