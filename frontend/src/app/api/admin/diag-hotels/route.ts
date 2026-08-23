export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAll } from '@/lib/persistentStore';
import { Redis } from '@upstash/redis';

/**
 * TEMPORARY diagnostic route (key-gated) — investigate + restore missing hotels data.
 * DELETE after use. Gate key must match ?key= or x-a9-diag header.
 */
const KEY = process.env.AUTH_SECRET || '';

function authorized(req: NextRequest): boolean {
  const provided = req.nextUrl.searchParams.get('key') || req.headers.get('x-a9-diag') || '';
  return !!KEY && provided === KEY;
}

function mask(v: unknown): string {
  const s = String(v ?? '');
  if (!s) return '(empty)';
  if (s.length <= 12) return s.slice(0, 4) + '***';
  return s.slice(0, 8) + '...' + s.slice(-4);
}

async function redisSizes(redis: Redis | null, cols: string[]): Promise<Record<string, number | string>> {
  const out: Record<string, number | string> = {};
  if (!redis) {
    for (const c of cols) out[c] = 'no-redis-env';
    return out;
  }
  for (const c of cols) {
    try { out[c] = await redis.hlen('a9:' + c); } catch (e) { out[c] = 'err:' + String(e).slice(0, 40); }
  }
  return out;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const envReport = {
    upstashUrl: mask(process.env.UPSTASH_REDIS_REST_URL),
    upstashToken: mask(process.env.UPSTASH_REDIS_REST_TOKEN),
    supabaseUrl: mask(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL),
  };

  let hotelsViaStore: number | string = 'ERR';
  try { hotelsViaStore = (await getAll('hotels' as any)).length; } catch (e) { hotelsViaStore = 'ERR ' + String(e).slice(0, 60); }

  let redis: Redis | null = null;
  const ru = process.env.UPSTASH_REDIS_REST_URL, rt = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (ru && rt) redis = new Redis({ url: ru, token: rt });
  const sizes = await redisSizes(redis, ['tours', 'hotels', 'destinations', 'blog', 'site-config']);

  let audit: any[] = [];
  if (redis) {
    try {
      const h = await redis.hgetall('a9:audit-log');
      if (h && typeof h === 'object') {
        audit = Object.values(h as Record<string, string>).map((v) => {
          try { return JSON.parse(v as string); } catch { return { raw: String(v).slice(0, 60) }; }
        });
        audit.sort((a: any, b: any) => String(b.timestamp || b.createdAt || '').localeCompare(String(a.timestamp || a.createdAt || '')));
        audit = audit.slice(0, 20);
      }
    } catch (e) { audit = [{ err: String(e).slice(0, 60) }]; }
  }

  return NextResponse.json({ envReport, hotelsViaStore, sizes, auditTail: audit });
}

const SEED_HOTELS = [
  { name: "Sule Shangri-La Yangon", slug: "sule-shangri-la-yangon", location: "Yangon", description: "Luxury 5-star hotel in downtown Yangon with panoramic city views, next to Sule Pagoda. World-class dining and butler service.", rating: 5, reviewCount: 482, pricePerNightMMK: 180000, pricePerNightUSD: 86, availableRooms: 20, totalRooms: 280, amenities: ["Pool", "WiFi", "Gym", "Spa", "Restaurant", "Bar"], images: ["/images_v2/hotel1-v3.jpg", "/images_v2/hotel-budget-v2.jpg"], status: "active", featured: true, address: "223 Sule Pagoda Road, Kyauktada Township", phone: "01-242828", email: "reservations.sule@shangri-la.com" },
  { name: "Aureum Palace Bagan", slug: "aureum-palace-bagan", location: "Bagan", description: "Boutique luxury resort nestled among ancient pagodas. Private villas, infinity pool overlooking temple plains, and traditional spa treatments.", rating: 5, reviewCount: 367, pricePerNightMMK: 220000, pricePerNightUSD: 105, availableRooms: 15, totalRooms: 110, amenities: ["Pool", "WiFi", "Spa", "Restaurant", "Bar", "Temple View"], images: ["/images_v2/hotel2-v3.jpg", "/images_v2/hotel-city-v2.jpg"], status: "active", featured: true, address: "Hotel Zone, Bagan, Mandalay Region", phone: "061-60525", email: "reservations@aureumpalacebagan.com" },
  { name: "Inle Princess Resort", slug: "inle-princess-resort", location: "Inle Lake", description: "Eco-friendly floating resort on Inle Lake. Traditional architecture meets modern comfort. Lakeside dining and sunset boat excursions.", rating: 4, reviewCount: 243, pricePerNightMMK: 160000, pricePerNightUSD: 76, availableRooms: 25, totalRooms: 50, amenities: ["Pool", "WiFi", "Spa", "Lake View", "Restaurant", "Boat Service"], images: ["/images_v2/hotel3-v3.jpg", "/images_v2/hotel-luxury-v2.jpg"], status: "active", featured: true, address: "Nyaung Shwe, Inle Lake, Shan State", phone: "081-209055", email: "info@inleprincessresort.com" },
  { name: "Ngapali Bay Hotel", slug: "ngapali-bay-hotel", location: "Ngapali Beach", description: "Beachfront resort with stunning sunset views over the Bay of Bengal. Private beach access, seafood grill, and water sports center.", rating: 4, reviewCount: 198, pricePerNightMMK: 250000, pricePerNightUSD: 119, availableRooms: 40, totalRooms: 80, amenities: ["Pool", "WiFi", "Beach Access", "Spa", "Restaurant", "Diving Center"], images: ["/images_v2/hotel4-v3.jpg", "/images_v2/hotel-resort-v2.jpg"], status: "active", featured: true, address: "Ngapali Beach, Rakhine State", phone: "043-42345", email: "reservations@ngapalibayhotel.com" },
  { name: "Mandalay Hill Resort", slug: "mandalay-hill-resort", location: "Mandalay", description: "Hilltop resort with panoramic views of Mandalay city and the Irrawaddy River. Traditional Myanmar architecture, pool, and sunset terrace.", rating: 4, reviewCount: 215, pricePerNightMMK: 120000, pricePerNightUSD: 57, availableRooms: 55, totalRooms: 200, amenities: ["Pool", "WiFi", "Gym", "Hill View", "Restaurant", "Bar"], images: ["/images_v2/hotel5-v3.jpg", "/images_v2/hotel-budget-v2.jpg"], status: "active", featured: true, address: "Near Mandalay Hill, Mandalay", phone: "02-35638", email: "info@mandalayhillresort.com" },
  { name: "The Strand Yangon", slug: "the-strand-yangon", location: "Yangon", description: "Historic colonial-era luxury hotel dating to 1901. Butler service, fine dining, and timeless elegance in the heart of Yangon.", rating: 5, reviewCount: 521, pricePerNightMMK: 350000, pricePerNightUSD: 167, availableRooms: 8, totalRooms: 32, amenities: ["Butler", "Spa", "Fine Dining", "Bar", "WiFi", "Concierge"], images: ["/images_v2/hotel6-v3.jpg", "/images_v2/hotel-luxury-v2.jpg"], status: "active", featured: true, address: "92 Strand Road, Kyauktada Township, Yangon", phone: "01-243377", email: "reservations@thestrand.com.mm" },
  { name: "Novotel Yangon Max", slug: "novotel-yangon-max", location: "Yangon", description: "Modern business hotel in Yangon's commercial district. Rooftop pool, fitness center, and multiple dining options near shopping malls.", rating: 4, reviewCount: 176, pricePerNightMMK: 145000, pricePerNightUSD: 69, availableRooms: 60, totalRooms: 250, amenities: ["Pool", "WiFi", "Gym", "Restaurant", "Bar", "Business Center"], images: ["/images_v2/hotel1-v3.jpg", "/images_v2/hotel-city-v2.jpg"], status: "active", featured: false, address: "459 Pyay Road, Kamayut Township, Yangon", phone: "01-2305858", email: "H9463@accor.com" },
  { name: "Bagan Lodge", slug: "bagan-lodge", location: "Bagan", description: "Safari-style luxury lodge with spacious tented villas. Two pools, spa, and authentic Burmese cuisine surrounded by ancient temples.", rating: 4, reviewCount: 152, pricePerNightMMK: 195000, pricePerNightUSD: 93, availableRooms: 18, totalRooms: 85, amenities: ["Pool", "WiFi", "Spa", "Restaurant", "Bar", "Garden"], images: ["/images_v2/hotel2-v3.jpg", "/images_v2/hotel-resort-v2.jpg"], status: "active", featured: false, address: "Bagan-Nyaung U Airport Road, Bagan", phone: "061-60999", email: "info@baganlodge.com" },
  { name: "Sanctum Inle Resort", slug: "sanctum-inle-resort", location: "Inle Lake", description: "Monastery-inspired luxury resort with monastery-style architecture. Infinity pool, organic gardens, lake views, and silent retreats.", rating: 5, reviewCount: 89, pricePerNightMMK: 280000, pricePerNightUSD: 133, availableRooms: 12, totalRooms: 42, amenities: ["Pool", "WiFi", "Spa", "Lake View", "Restaurant", "Yoga"], images: ["/images_v2/hotel3-v3.jpg", "/images_v2/hotel-luxury-v2.jpg"], status: "active", featured: false, address: "Maing Thauk Village, Inle Lake, Shan State", phone: "081-209266", email: "info@sanctum-inle.com" },
  { name: "Amazing Ngapali Resort", slug: "amazing-ngapali-resort", location: "Ngapali Beach", description: "Beachfront boutique resort with tropical gardens. Thatched roof bungalows, beach bar, and fresh seafood daily.", rating: 4, reviewCount: 134, pricePerNightMMK: 210000, pricePerNightUSD: 100, availableRooms: 22, totalRooms: 45, amenities: ["Pool", "WiFi", "Beach Access", "Restaurant", "Bar", "Garden"], images: ["/images_v2/hotel4-v3.jpg", "/images_v2/hotel-resort-v2.jpg"], status: "active", featured: false, address: "Zee Phyu Gone Village, Ngapali Beach", phone: "043-42266", email: "info@amazingngapali.com" },
  { name: "Eastern Palace Mandalay", slug: "eastern-palace-mandalay", location: "Mandalay", description: "Boutique hotel blending traditional Myanmar craftsmanship with contemporary luxury. Great location for exploring Mandalay's royal heritage.", rating: 3, reviewCount: 88, pricePerNightMMK: 85000, pricePerNightUSD: 40, availableRooms: 35, totalRooms: 120, amenities: ["WiFi", "Restaurant", "Bar", "Concierge", "Laundry", "Parking"], images: ["/images_v2/hotel5-v3.jpg", "/images_v2/hotel-budget-v2.jpg"], status: "active", featured: false, address: "68th Street, Between 26th and 27th, Mandalay", phone: "02-68268", email: "info@easternpalace.com.mm" },
  { name: "Chatrium Hotel Yangon", slug: "chatrium-hotel-yangon", location: "Yangon", description: "Riverside luxury near Shwedagon Pagoda. Spacious suites, infinity pool, and breathtaking views of Yangon's golden skyline.", rating: 5, reviewCount: 312, pricePerNightMMK: 205000, pricePerNightUSD: 98, availableRooms: 30, totalRooms: 200, amenities: ["Pool", "WiFi", "Gym", "Spa", "Restaurant", "River View"], images: ["/images_v2/hotel6-v3.jpg", "/images_v2/hotel-city-v2.jpg"], status: "active", featured: true, address: "40 Natmauk Road, Tamwe Township, Yangon", phone: "01-544500", email: "info@chatrium.com" },
];

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  // Only seed hotels that are actually missing (idempotent by slug)
  const existing = await getAll('hotels' as any);
  const existingNames = new Set(existing.map((h: any) => h.name));
  const { create } = await import('@/lib/persistentStore');
  let added = 0;
  for (const h of SEED_HOTELS) {
    if (!existingNames.has(h.name)) {
      await create('hotels' as any, h);
      added++;
    }
  }
  const after = await getAll('hotels' as any);
  return NextResponse.json({ success: true, addedBefore: existing.length, added, countAfter: after.length });
}
