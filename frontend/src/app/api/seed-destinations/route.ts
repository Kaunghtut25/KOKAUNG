import { NextRequest, NextResponse } from "next/server";
import { getAll, create } from "@/lib/persistentStore";

export const dynamic = 'force-dynamic';

/* FIX: 2026-08-12 — Seed the destinations DB with the 12 fallback destinations so
   Admin → Manage Destinations shows real editable records (was 0 / empty DB).
   Temporary route — call once with ?key=..., then it can be left (idempotent). */

const SEED_KEY = "A9DestSeed2026";

const DESTINATIONS = [
  { city: "Bangkok", country: "Thailand", image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609663178_ta1biy-bangkok-x7Q8kUMuXRvj6qMJAZxBbawKS4zkjI.jpg", minPrice: "Ks 150,000", bestTime: "November to February (cool season)", description: "Bangkok is a vibrant metropolis where ancient temples meet modern skyscrapers. Explore the Grand Palace, cruise the Chao Phraya River, and experience world-famous Thai street food.", highlights: ["Grand Palace", "Wat Arun", "Floating markets", "Chao Phraya cruise", "Street food tours"], rating: 4.6, reviews: 3210, duration: "4 Days", tags: ["Temple", "Food", "Shopping", "Culture"], groupSize: 10 },
  { city: "Singapore", country: "Singapore", image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609664529_gc0coa-singapore-1I4l0IofxTbJLSLc5dELHgf1XUPxpL.jpg", minPrice: "Ks 250,000", bestTime: "February to April (dry season)", description: "Singapore is a dazzling city-state of futuristic architecture, lush gardens, and multicultural neighborhoods. Visit Gardens by the Bay and enjoy world-class dining.", highlights: ["Marina Bay Sands", "Gardens by the Bay", "Sentosa Island", "Hawker food trails"], rating: 4.7, reviews: 1980, duration: "3 Days", tags: ["Modern", "Food", "Shopping"], groupSize: 10 },
  { city: "Tokyo", country: "Japan", image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609665668_3ecvek-tokyo-TYjK5as5wFpIatqF1kbSi4h2t3ZUT1.jpg", minPrice: "Ks 780,000", bestTime: "March to May (cherry blossom) or October to November (autumn)", description: "Tokyo blends ultramodern technology with ancient traditions. From neon-lit Shibuya to serene Meiji Shrine, the city offers endless discoveries for every traveler.", highlights: ["Shibuya Crossing", "Meiji Shrine", "Senso-ji Temple", "Tsukiji Outer Market"], rating: 4.9, reviews: 2870, duration: "7 Days", tags: ["Culture", "Food", "Nature"], groupSize: 10 },
  { city: "Seoul", country: "South Korea", image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609666783_tpdn63-seoul-2vEDeNREwxMmMcKljIrmhIkNRzMx2x.jpg", minPrice: "Ks 550,000", bestTime: "March to May and September to November", description: "Seoul is a dynamic city where ancient palaces sit alongside K-pop culture. Explore Gyeongbokgung Palace, shop in Myeongdong, and indulge in Korean BBQ.", highlights: ["Gyeongbokgung Palace", "Myeongdong", "N Seoul Tower", "Bukchon Hanok Village"], rating: 4.6, reviews: 1560, duration: "6 Days", tags: ["Culture", "Food", "K-Pop"], groupSize: 10 },
  { city: "Dubai", country: "United Arab Emirates", image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609667895_nhc8s9-dubai-d3lPglj2ETCLL85cMyDIUrqR87uSJr.jpg", minPrice: "Ks 680,000", bestTime: "November to March (mild weather)", description: "Dubai is a city of superlatives with the tallest building, largest mall, and most luxurious hotels. Experience desert safaris and futuristic architecture.", highlights: ["Burj Khalifa", "Desert safari", "Dubai Mall", "Gold souk"], rating: 4.7, reviews: 1890, duration: "4 Days", tags: ["Luxury", "Shopping", "Modern"], groupSize: 10 },
  { city: "Paris", country: "France", image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609669026_5swn98-paris-NP2sb2JVZ4tGQYsaHWnFEQZrwH3W4h.jpg", minPrice: "Ks 850,000", bestTime: "April to June and September to October", description: "Paris is the city of love, lights, and timeless elegance. From the Eiffel Tower to charming cafes, every corner tells a story of art and romance.", highlights: ["Eiffel Tower", "Louvre Museum", "Seine River cruise", "Montmartre"], rating: 4.8, reviews: 2340, duration: "5 Days", tags: ["Luxury", "Romance", "Culture"], groupSize: 10 },
  { city: "Bali", country: "Indonesia", image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609670120_iixb10-bali-e92X2ozIcinwD996tg4B5u2BXS0cdz.jpg", minPrice: "Ks 180,000", bestTime: "April to October (dry season)", description: "Bali is the Island of Gods, offering stunning beaches, lush rice terraces, ancient temples, and a vibrant arts scene. Perfect for relaxation.", highlights: ["Uluwatu Temple", "Tegallalang Rice Terraces", "Ubud Art Market", "Nusa Penida"], rating: 4.7, reviews: 2140, duration: "6 Days", tags: ["Beach", "Nature", "Culture"], groupSize: 10 },
  { city: "Maldives", country: "Maldives", image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609671009_3evgmu-maldives-hypfQQJCg06kuyANjh41tsEh3jJ1iZ.jpg", minPrice: "Ks 380,000", bestTime: "November to April (dry season)", description: "The Maldives is a tropical paradise of overwater villas, crystal-clear lagoons, and pristine white-sand beaches. The ultimate luxury getaway.", highlights: ["Overwater villas", "Snorkeling", "Sunset cruises", "Private islands"], rating: 4.9, reviews: 1760, duration: "5 Days", tags: ["Luxury", "Beach", "Honeymoon"], groupSize: 10 },
  { city: "Yangon", country: "Myanmar", image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609672110_hoxenr-yangon-ZR2KEYFv4nTcNHRSbkTYE73ZoXIegP.jpg", minPrice: "Ks 80,000", bestTime: "November to February (cool season)", description: "Yangon is Myanmar largest city and former capital, home to the magnificent Shwedagon Pagoda. Explore colonial architecture and authentic Burmese cuisine.", highlights: ["Shwedagon Pagoda", "Sule Pagoda", "Bogyoke Market", "Kandawgyi Lake"], rating: 4.5, reviews: 980, duration: "3 Days", tags: ["Culture", "Heritage", "Food"], groupSize: 10 },
  { city: "Bagan", country: "Myanmar", image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609673423_cxib2z-bagan-XuauRMTtDqUuuRh7T11ier0WFheWOP.jpg", minPrice: "Ks 95,000", bestTime: "November to February (cool season)", description: "Bagan is an archaeological wonderland with over 2,000 ancient temples spread across a vast plain. Hot air balloon rides at sunrise offer unforgettable views.", highlights: ["Hot air balloon", "Ananda Temple", "Shwesandaw Pagoda", "Sunset temples"], rating: 4.8, reviews: 1240, duration: "4 Days", tags: ["Heritage", "Temple", "Adventure"], groupSize: 10 },
  { city: "Ho Chi Minh City", country: "Vietnam", image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609674645_4crguu-ho-chi-minh-city-BcBT3Ux26O1qAcrfZ3qiJWRIqtF9tM.jpg", minPrice: "Ks 105,000", bestTime: "December to April (dry season)", description: "Ho Chi Minh City (Saigon) is Vietnam economic powerhouse with vibrant energy. Explore the Cu Chi Tunnels and experience the buzzing nightlife.", highlights: ["Cu Chi Tunnels", "Ben Thanh Market", "Notre Dame Cathedral", "Bui Vien Street"], rating: 4.5, reviews: 1420, duration: "4 Days", tags: ["History", "Food", "Nightlife"], groupSize: 10 },
  { city: "Kuala Lumpur", country: "Malaysia", image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609676271_plrv46-kuala-lumpur-9BY1o9HTEVFgEy8zC00KyY98WYR3Ze.jpg", minPrice: "Ks 150,000", bestTime: "May to July and December to February", description: "Kuala Lumpur is a melting pot of cultures with the iconic Petronas Twin Towers, colorful Batu Caves, and incredible street food from Malay, Chinese, and Indian traditions.", highlights: ["Petronas Towers", "Batu Caves", "Batu Caves", "KL Tower"], rating: 4.6, reviews: 1180, duration: "4 Days", tags: ["Modern", "Food", "Culture"], groupSize: 10 },
];

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (key !== SEED_KEY) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const existing = await getAll("destinations" as any);
    const existingCities = new Set((existing || []).map((d: any) => (d.city || "").toLowerCase()));
    let created = 0, skipped = 0, errors = 0;
    for (const dest of DESTINATIONS) {
      const city = (dest.city || "").toLowerCase();
      if (existingCities.has(city)) { skipped++; continue; }
      try {
        await create("destinations" as any, { ...dest, status: "active" });
        created++;
      } catch (e: any) { errors++; console.warn("seed dest fail:", city, e?.message?.slice(0, 60)); }
    }
    const after = await getAll("destinations" as any);
    return NextResponse.json({
      success: true, created, skipped, errors,
      totalInDb: (after || []).length,
      cities: (after || []).map((d: any) => d.city),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Server error" }, { status: 500 });
  }
}
