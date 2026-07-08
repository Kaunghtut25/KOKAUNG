// Amadeus Self-Service API client (free tier)
// Sign up at: https://developers.amadeus.com/register
// Documentation: https://developers.amadeus.com/self-service

const AMADEUS_BASE = 'https://test.api.amadeus.com';

interface TokenCache {
  token: string;
  expires: number;
}

let cachedToken: TokenCache | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expires > Date.now() + 60000) {
    return cachedToken.token;
  }

  const key = process.env.AMADEUS_API_KEY || '';
  const secret = process.env.AMADEUS_API_SECRET || '';

  if (!key || !secret) {
    throw new Error('AMADEUS_API_KEY and AMADEUS_API_SECRET required');
  }

  const res = await fetch(`${AMADEUS_BASE}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${encodeURIComponent(key)}&client_secret=${encodeURIComponent(secret)}`,
  });

  if (!res.ok) throw new Error(`Amadeus auth failed: ${res.status}`);
  const data = await res.json();
  cachedToken = { token: data.access_token, expires: Date.now() + (data.expires_in * 1000) };
  return cachedToken.token;
}

export async function searchAirports(keyword: string) {
  const token = await getToken();
  const res = await fetch(
    `${AMADEUS_BASE}/v1/reference-data/locations?subType=AIRPORT&keyword=${encodeURIComponent(keyword)}&page[limit]=20`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  return (data.data || []).map((a: any) => ({
    code: a.iataCode,
    name: a.name,
    city: a.address?.cityName || '',
    country: a.address?.countryName || '',
    lat: a.geoCode?.latitude || 0,
    lon: a.geoCode?.longitude || 0,
  })).filter((a: any) => a.code);
}

export async function searchFlights(params: {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  adults?: number;
}) {
  const token = await getToken();
  const query = new URLSearchParams({
    originLocationCode: params.origin,
    destinationLocationCode: params.destination,
    departureDate: params.departDate,
    adults: String(params.adults || 1),
    max: '20',
    currencyCode: 'USD',
  });
  if (params.returnDate) query.set('returnDate', params.returnDate);

  const res = await fetch(
    `${AMADEUS_BASE}/v2/shopping/flight-offers?${query}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();

  return {
    offers: data.data || [],
    dictionaries: data.dictionaries || {},
    meta: data.meta || {},
  };
}
