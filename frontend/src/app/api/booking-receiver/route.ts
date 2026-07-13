import { NextRequest, NextResponse } from 'next/server';
import { sendBookingEmail } from '@/lib/email';
import { getInquiries, create as storeCreate } from '@/lib/adminStore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const status = searchParams.get('status') || undefined;

    const result = getInquiries(page, limit, status);
    return NextResponse.json(result);
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

    // Store in admin store (in-memory / Vercel-compatible)
    try {
      storeCreate('inquiries', inquiryData);
    } catch (storeErr) {
      console.error('[Booking] Failed to store inquiry:', storeErr);
    }

    // Send email notification to admin
    sendBookingEmail(inquiryData).catch(err => console.error('[Email] Async send failed:', err));

    // Log booking for debugging
    console.log('[Booking]', JSON.stringify(inquiryData));

    return NextResponse.json({
      success: true,
      message: 'Booking inquiry submitted successfully!',
      referenceNumber: ref,
      data: {
        fullName, email, phone, travelType, fromAirport, toAirport,
        departDate: departDate || '', returnDate: returnDate || '',
        passengers: passengers || 1, travelClass: travelClass || 'Economy',
        specialRequests: specialRequests || '', contactPreference: contactPreference || 'email',
        status: 'New', referenceNumber: ref,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}
