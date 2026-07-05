import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, travelType, fromAirport, toAirport, departDate, returnDate, passengers, travelClass, specialRequests, contactPreference } = body;

    // Validation
    const errors: string[] = [];
    if (!fullName) errors.push('Full name is required');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email is required');
    if (!phone) errors.push('Phone number is required');
    const validTypes = ['flight', 'hotel', 'tour', 'car', 'visa', 'insurance'];
    if (!travelType || !validTypes.includes(travelType)) {
      errors.push(`Valid travel type is required (${validTypes.join('/')})`);
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, message: 'Validation failed', errors }, { status: 400 });
    }

    // Generate reference number
    const ref = 'A9-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    // Log booking for now (in production, save to DB / send email)
    console.log('[Booking]', JSON.stringify({ referenceNumber: ref, fullName, email, phone, travelType, fromAirport, toAirport, departDate, returnDate, passengers, travelClass, specialRequests, contactPreference, createdAt: new Date().toISOString() }));

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
