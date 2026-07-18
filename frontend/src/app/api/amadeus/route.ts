import { NextRequest, NextResponse } from 'next/server';

const AMADEUS_BASE = process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com';

let cachedToken: { token: string; expires: number } | null = null;

async function getAmadeusToken(): Promise<string> {
  if (cachedToken && cachedToken.expires > Date.now() + 60000) {
    return cachedToken.token;
  }

  const key = process.env.AMADEUS_API_KEY || '';
  const secret = process.env.AMADEUS_API_SECRET || '';

  if (!key || !secret) {
    throw new Error('Amadeus API credentials not configured. Please set AMADEUS_API_KEY and AMADEUS_API_SECRET in your environment.');
  }

  const res = await fetch(`${AMADEUS_BASE}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${encodeURIComponent(key)}&client_secret=${encodeURIComponent(secret)}`,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Amadeus auth failed: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  cachedToken = { token: data.access_token, expires: Date.now() + (data.expires_in * 1000) };
  return cachedToken.token;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  // Check credentials early for helpful error messages
  const key = process.env.AMADEUS_API_KEY || '';
  const secret = process.env.AMADEUS_API_SECRET || '';
  if (!key || !secret) {
    return NextResponse.json({
      error: 'Amadeus API is not configured yet.',
      message: 'Please visit https://developers.amadeus.com/register to get your free API key and secret, then add them to your .env.local file.',
      help: 'Set AMADEUS_API_KEY and AMADEUS_API_SECRET in .env.local',
    }, { status: 503 });
  }

  try {
    const token = await getAmadeusToken();

    switch (action) {
      case 'airports': {
        const keyword = searchParams.get('keyword') || '';
        const res = await fetch(
          `${AMADEUS_BASE}/v1/reference-data/locations?subType=AIRPORT&keyword=${encodeURIComponent(keyword)}&page[limit]=15`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        const airports = (data.data || []).map((a: any) => ({
          code: a.iataCode,
          name: a.name,
          city: a.address?.cityName || '',
          country: a.address?.countryName || '',
          lat: a.geoCode?.latitude || 0,
          lon: a.geoCode?.longitude || 0,
        })).filter((a: any) => a.code);
        return NextResponse.json({ airports });
      }

      case 'search': {
        const origin = searchParams.get('origin') || '';
        const destination = searchParams.get('destination') || '';
        const departDate = searchParams.get('departDate') || '';
        const returnDate = searchParams.get('returnDate') || '';
        const adults = searchParams.get('adults') || '1';
        const travelClass = searchParams.get('travelClass') || 'ECONOMY';

        if (!origin || !destination || !departDate) {
          return NextResponse.json({
            error: 'Missing required parameters.',
            message: 'origin, destination, and departDate are required.',
          }, { status: 400 });
        }

        const params = new URLSearchParams({
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDate: departDate,
          adults,
          max: '10',
          currencyCode: 'USD',
          travelClass,
        });
        if (returnDate) params.set('returnDate', returnDate);

        const res = await fetch(
          `${AMADEUS_BASE}/v2/shopping/flight-offers?${params}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();

        if (!res.ok) {
          return NextResponse.json({
            error: `Amadeus API error: ${res.status}`,
            details: data,
          }, { status: res.status });
        }

        return NextResponse.json({
          offers: data.data || [],
          dictionaries: data.dictionaries || {},
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action. Use "airports" or "search".' }, { status: 400 });
    }
  } catch (err: any) {
    console.error('Amadeus API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
