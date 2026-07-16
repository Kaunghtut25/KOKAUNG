import { NextRequest, NextResponse } from "next/server";
import { sendBookingEmail } from "@/lib/email";
import { create as storeCreate, getAll as storeGetAll } from "@/lib/persistentStore";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const status = searchParams.get('status') || undefined;

    let bookings = await storeGetAll("bookings");

    if (status) {
      bookings = bookings.filter((b: any) => b.status === status);
    }

    const total = bookings.length;
    const start = (page - 1) * limit;
    const data = bookings.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data,
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, travelType, fromAirport, toAirport, departDate, returnDate, passengers, travelClass, specialRequests, contactPreference } = body;

    // Validation
    const errors: string[] = [];
    if (!fullName) errors.push('Full name is required');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email is required');
    if (!phone) errors.push('Phone number is required');
    const validTypes = ['flight', 'hotel', 'tour', 'car', 'visa', 'insurance', 'cruise', 'mingalar'];
    if (!travelType || !validTypes.includes(travelType)) {
      errors.push(`Valid travel type is required (${validTypes.join('/')})`);
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, message: 'Validation failed', errors }, { status: 400 });
    }

    // Generate reference number
    const ref = 'A9-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    const inquiryData = {
      fullName, email, phone, travelType, fromAirport: fromAirport || '', toAirport: toAirport || '',
      departDate: departDate || '', returnDate: returnDate || '',
      passengers: passengers || 1, travelClass: travelClass || 'Economy',
      specialRequests: specialRequests || '', contactPreference: contactPreference || 'email',
      status: 'New', referenceNumber: ref,
      createdAt: new Date().toISOString(),
    };

    // Store in database
    try {
      await storeCreate('bookings', inquiryData);
    } catch (storeErr) {
      console.error('[Booking] Failed to store inquiry:', storeErr);
    }

    // Send email notification to admin
    let emailSent = false;
    try {
      emailSent = await sendBookingEmail(inquiryData);
    } catch {
      // Email not configured — booking still saved
    }

    return NextResponse.json({
      success: true,
      message: 'Booking inquiry submitted successfully!',
      referenceNumber: ref,
      emailSent,
      data: inquiryData,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}
