import { NextRequest, NextResponse } from "next/server";
import { sendBookingEmail, sendCustomerConfirmationEmail } from "@/lib/email";
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
    const {
      fullName, email, phone, travelType,
      fromAirport, toAirport, departDate, returnDate,
      passengers, travelClass, specialRequests, contactPreference,
      // extra booking-item fields from book-now page
      itemName, amount, currency,
      // flight-specific fields
      airline, airlineCode, flightNo, departTime, arriveTime,
      stops, offerId, clientType, tripType,
    } = body;

    // Validation
    const errors: string[] = [];
    if (!fullName) errors.push('Full name is required');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email is required');
    if (!phone) errors.push('Phone number is required');
    const validTypes = ['flight', 'hotel', 'tour', 'car', 'visa', 'insurance', 'cruise', 'mingalar', 'lounge', 'oneway', 'roundtrip', 'multi-city'];
    if (!travelType || !validTypes.includes(travelType)) {
      errors.push(`Valid travel type is required (${validTypes.join('/')})`);
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, message: 'Validation failed', errors }, { status: 400 });
    }

    // Generate reference number: A9-<TYPE>-<timestamp in base36>
    const typePrefix = travelType.substring(0, 2).toUpperCase();
    const ref = `A9-${typePrefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const inquiryData = {
      fullName, email, phone, travelType,
      fromAirport: fromAirport || '',
      toAirport: toAirport || '',
      departDate: departDate || '',
      returnDate: returnDate || '',
      passengers: passengers || 1,
      travelClass: travelClass || 'Economy',
      specialRequests: specialRequests || '',
      contactPreference: contactPreference || 'email',
      itemName: itemName || '',
      amount: amount || 0,
      currency: currency || 'MMK',
      airline: airline || '',
      airlineCode: airlineCode || '',
      flightNo: flightNo || '',
      departTime: departTime || '',
      arriveTime: arriveTime || '',
      stops: stops || '',
      offerId: offerId || '',
      clientType: clientType || 'local',
      tripType: tripType || 'oneway',
      status: 'New',
      referenceNumber: ref,
      createdAt: new Date().toISOString(),
    };

    // 1. Store in database via Supabase
    let dbSaved = false;
    try {
      await storeCreate('bookings', inquiryData);
      dbSaved = true;
      console.log(`[Booking] Saved ${ref} to database`);
    } catch (storeErr) {
      console.error('[Booking] Failed to store inquiry:', storeErr);
    }

    // 2. Send admin notification email
    let adminEmailSent = false;
    try {
      adminEmailSent = await sendBookingEmail(inquiryData);
    } catch (emailErr) {
      console.error('[Booking] Admin email failed:', emailErr);
    }

    // 3. Send customer confirmation email
    let customerEmailSent = false;
    try {
      customerEmailSent = await sendCustomerConfirmationEmail(inquiryData);
    } catch (emailErr) {
      console.error('[Booking] Customer email failed:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Booking inquiry submitted successfully!',
      referenceNumber: ref,
      dbSaved,
      adminEmailSent,
      customerEmailSent,
      data: inquiryData,
    });
  } catch (err: any) {
    console.error('[Booking] POST error:', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}
