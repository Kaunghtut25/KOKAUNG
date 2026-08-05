import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = 'force-dynamic';

// FIX: 2026-08-05 seed outbound tours into live Redis (temporary route — remove after seeding)
const SEED_KEY = "6O7h8CnGX5BISkWAIburHWfWZR51jYFY";

const OUTBOUND = [
  { slug: "bangkok-chiang-mai-discovery", title: "Bangkok & Chiang Mai Discovery", destination: "Thailand", description: "From Bangkok's golden temples to Chiang Mai's mountain mist — the ultimate Thailand experience with islands, street food, and culture.", priceMMK: 1850000, priceUSD: 880, duration: "8 Days / 7 Nights", groupSize: 12, rating: 4.7, reviewCount: 214, images: ["/images_v2/hero-thailand-v2.jpg", "/images_v2/hero-tours-v2.jpg"], amenities: "AC Transport, English Guide, Breakfast, Temple Visits", included: "Hotels, Meals, Guide, Transport, Boat tours", excluded: "Flights, Visa fees, Personal expenses", featured: true, status: "active", tourType: "outbound" },
  { slug: "classic-vietnam-hanoi-saigon", title: "Classic Vietnam: Hanoi to Saigon", destination: "Vietnam", description: "Cruise Ha Long Bay, wander Hoi An's lantern streets, and explore Saigon — Vietnam's greatest hits in one journey.", priceMMK: 1950000, priceUSD: 930, duration: "10 Days / 9 Nights", groupSize: 12, rating: 4.8, reviewCount: 187, images: ["/images_v2/hero-vietnam-v2.jpg", "/images_v2/hero-tours-v2.jpg"], amenities: "AC Transport, English Guide, Breakfast, Cruise", included: "Hotels, Meals, Guide, Ha Long cruise", excluded: "Flights, Visa fees, Tips", featured: true, status: "active", tourType: "outbound" },
  { slug: "singapore-city-escape", title: "Singapore City Escape", destination: "Singapore", description: "Gardens by the Bay, Sentosa, hawker feasts and Marina Bay lights — a clean, safe, world-class city break.", priceMMK: 1250000, priceUSD: 595, duration: "5 Days / 4 Nights", groupSize: 12, rating: 4.6, reviewCount: 156, images: ["/images_v2/hero-singapore-v2.jpg", "/images_v2/hero-tours-v2.jpg"], amenities: "AC Transport, English Guide, Breakfast, City Tour", included: "Hotel, Meals, Guide, Attraction passes", excluded: "Flights, Visa fees, Personal expenses", featured: false, status: "active", tourType: "outbound" },
  { slug: "japan-tokyo-kyoto-fuji", title: "Japan: Tokyo, Kyoto & Mt Fuji", destination: "Japan", description: "Neon Tokyo, ancient Kyoto temples, and iconic Mt Fuji — a journey through old and new Japan.", priceMMK: 3850000, priceUSD: 1835, duration: "9 Days / 8 Nights", groupSize: 12, rating: 4.9, reviewCount: 342, images: ["/images_v2/dest-japan-v2.jpg", "/images_v2/hero-tours-v2.jpg"], amenities: "Bullet Train, English Guide, Breakfast, Temple Tours", included: "Hotels, Meals, Guide, JR Pass", excluded: "Flights, Visa fees, Lunches/Dinners", featured: true, status: "active", tourType: "outbound" },
  { slug: "dubai-desert-skyline", title: "Dubai Desert & Skyline", destination: "UAE", description: "Burj Khalifa, desert safaris, gold souks and futuristic architecture — luxury meets adventure in Dubai.", priceMMK: 2650000, priceUSD: 1260, duration: "6 Days / 5 Nights", groupSize: 12, rating: 4.7, reviewCount: 203, images: ["/images_v2/dest-dubai-v2.jpg", "/images_v2/hero-tours-v2.jpg"], amenities: "AC Transport, English Guide, Breakfast, Desert Safari", included: "Hotel, Meals, Guide, Desert safari", excluded: "Flights, Visa fees, Luxury add-ons", featured: false, status: "active", tourType: "outbound" },
  { slug: "maldives-island-retreat", title: "Maldives Island Retreat", destination: "Maldives", description: "Overwater villas, turquoise lagoons and pure relaxation — the ultimate tropical escape.", priceMMK: 4550000, priceUSD: 2170, duration: "6 Days / 5 Nights", groupSize: 12, rating: 4.9, reviewCount: 178, images: ["/images_v2/dest-maldives-v2.jpg", "/images_v2/hero-tours-v2.jpg"], amenities: "Seaplane Transfer, All Meals, Snorkeling, Spa Credit", included: "Resort, All meals, Seaplane, Water sports", excluded: "Flights, Visa fees, Spa extras", featured: false, status: "active", tourType: "outbound" },
  { slug: "bali-island-hopping", title: "Bali Island Hopping", destination: "Indonesia", description: "Temples, rice terraces, beaches and Ubud's artistic soul — the magic of Bali in one unforgettable trip.", priceMMK: 1750000, priceUSD: 835, duration: "7 Days / 6 Nights", groupSize: 12, rating: 4.7, reviewCount: 231, images: ["/images_v2/hero-indonesia-v2.jpg", "/images_v2/hero-tours-v2.jpg"], amenities: "AC Transport, English Guide, Breakfast, Temple Tours", included: "Hotels, Meals, Guide, Boat trips", excluded: "Flights, Visa fees, Personal expenses", featured: false, status: "active", tourType: "outbound" },
  { slug: "angkor-wat-cambodia", title: "Angkor Wat & Cambodia Highlights", destination: "Cambodia", description: "Sunrise at Angkor Wat, Siem Reap's old town and Phnom Penh's history — the Kingdom of Wonder.", priceMMK: 1450000, priceUSD: 690, duration: "6 Days / 5 Nights", groupSize: 12, rating: 4.6, reviewCount: 143, images: ["/images_v2/hero-cambodia-v2.jpg", "/images_v2/hero-tours-v2.jpg"], amenities: "AC Transport, English Guide, Breakfast, Temple Pass", included: "Hotels, Meals, Guide, Angkor pass", excluded: "Flights, Visa fees, Drinks", featured: false, status: "active", tourType: "outbound" },
  { slug: "kuala-lumpur-langkawi", title: "Kuala Lumpur & Langkawi", destination: "Malaysia", description: "Petronas Towers, Batu Caves and Langkawi's beaches — Malaysia's city-meets-island combo.", priceMMK: 1350000, priceUSD: 640, duration: "6 Days / 5 Nights", groupSize: 12, rating: 4.5, reviewCount: 128, images: ["/images_v2/hero-malaysia-v2.jpg", "/images_v2/hero-tours-v2.jpg"], amenities: "AC Transport, English Guide, Breakfast, Island Tour", included: "Hotels, Meals, Guide, Ferry", excluded: "Flights, Visa fees, Personal expenses", featured: false, status: "active", tourType: "outbound" },
  { slug: "seoul-busan-express", title: "Seoul & Busan Express", destination: "South Korea", description: "Palaces, K-pop streets, Busan's beaches and Korean BBQ — South Korea's dynamic duo.", priceMMK: 2250000, priceUSD: 1070, duration: "7 Days / 6 Nights", groupSize: 12, rating: 4.7, reviewCount: 167, images: ["/images_v2/dest-korea-v2.jpg", "/images_v2/hero-tours-v2.jpg"], amenities: "AC Transport, English Guide, Breakfast, City Tours", included: "Hotels, Meals, Guide, KTX train", excluded: "Flights, Visa fees, Personal expenses", featured: false, status: "active", tourType: "outbound" },
];

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (key !== SEED_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return NextResponse.json({ message: "Redis env missing", url: !!url, token: !!token }, { status: 500 });

    const redis = new Redis({ url, token });
    const hash = await redis.hgetall("a9:tours");
    const existing: any[] = Object.values(hash || {}).map((v: any) => { try { return JSON.parse(v); } catch { return v; } });
    const existingSlugs = new Set(existing.map((t: any) => (t.slug || "").toLowerCase()));
    const existingTitles = new Set(existing.map((t: any) => (t.title || "").toLowerCase()));

    let created = 0, skipped = 0;
    for (const tour of OUTBOUND) {
      const slug = (tour.slug || "").toLowerCase();
      const title = (tour.title || "").toLowerCase();
      if (existingSlugs.has(slug) || existingTitles.has(title)) { skipped++; continue; }
      const id = "gen_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
      const item = { ...tour, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      await redis.hset("a9:tours", { [id]: JSON.stringify(item) });
      created++;
    }
    return NextResponse.json({ ok: true, created, skipped, totalNow: existing.length + created });
  } catch (err: any) {
    return NextResponse.json({ message: "Seed error", error: (err as Error).message?.substring(0, 200) }, { status: 500 });
  }
}
