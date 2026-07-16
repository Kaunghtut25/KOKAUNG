/**
 * persistentStore.ts — Upstash Redis-backed store with in-memory fallback
 * 
 * Architecture: each collection stored as JSON string under a single key
 * e.g. redis.get("a9:tours") → '[{id:"t1",...}]'
 * 
 * Uses @upstash/redis (already in package.json).
 * Falls back to in-memory Map if no redis env vars configured.
 * 
 * To enable persistence:
 * 1. Create free Upstash Redis database
 * 2. Set env vars: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 */

type Collection = "tours" | "hotels" | "cars" | "cruises" | "visas" | "insurances" | "blog" | "bookings" | "mingalar" | "site-config" | "settings";

// ── Seed data ─────────────────────────────────────────────
const SEEDS: Record<string, any[]> = {
  tours: [
    { id: "t1", title: "Golden Land Explorer", destination: "Bagan", description: "Explore ancient temples of Bagan", priceMMK: 450000, priceUSD: 215, duration: "5 Days / 4 Nights", images: JSON.stringify(["/images_v2/bagan-v2.jpg"]), amenities: "Guide, AC Transport, Breakfast", included: "Hotel, Meals, Guide, Transport", excluded: "Flights, Visa Fees", maxGroupSize: 15, status: "active", featured: true, createdAt: "2025-12-01T00:00:00Z" },
    { id: "t2", title: "Yangon City Lights", destination: "Yangon", description: "Discover colonial charm of Yangon", priceMMK: 250000, priceUSD: 119, duration: "3 Days / 2 Nights", images: JSON.stringify(["/images_v2/yangon-v2.jpg"]), amenities: "Guide, AC Transport, Breakfast", included: "Hotel, Meals, Guide", excluded: "Flights, Visa Fees", maxGroupSize: 12, status: "active", featured: false, createdAt: "2025-12-01T00:00:00Z" },
    { id: "t3", title: "Inle Lake Serenity", destination: "Inle", description: "Floating gardens & markets", priceMMK: 380000, priceUSD: 181, duration: "4 Days / 3 Nights", images: JSON.stringify(["/images_v2/inle-v2.jpg"]), amenities: "Boat, Guide, Breakfast", included: "Hotel, Meals, Boat Tours", excluded: "Flights, Visa Fees", maxGroupSize: 10, status: "active", featured: true, createdAt: "2025-12-01T00:00:00Z" },
    { id: "t4", title: "Ngapali Beach Bliss", destination: "Ngapali", description: "Pristine beach getaway", priceMMK: 520000, priceUSD: 248, duration: "5 Days / 4 Nights", images: JSON.stringify(["/images_v2/ngapali-v2.jpg"]), amenities: "Beach, Pool, Breakfast", included: "Hotel, Meals, Airport Transfer", excluded: "Flights, Visa Fees", maxGroupSize: 8, status: "active", featured: true, createdAt: "2025-12-01T00:00:00Z" },
    { id: "t5", title: "Mandalay Royal Tour", destination: "Mandalay", description: "Last royal capital of Myanmar", priceMMK: 320000, priceUSD: 152, duration: "4 Days / 3 Nights", images: JSON.stringify(["/images_v2/mandalay-v2.jpg"]), amenities: "Guide, AC Transport, Breakfast", included: "Hotel, Meals, Guide", excluded: "Flights, Visa Fees", maxGroupSize: 15, status: "active", featured: false, createdAt: "2025-12-01T00:00:00Z" },
    { id: "t6", title: "Myanmar Grand Tour", destination: "Multi", description: "Complete Myanmar experience", priceMMK: 850000, priceUSD: 405, duration: "10 Days / 9 Nights", images: JSON.stringify(["/images_v2/myanmar-v2.jpg"]), amenities: "Guide, AC Transport, Breakfast, Domestic Flights", included: "Hotels, Meals, Guide, Transport, Flights", excluded: "International Flights, Visa Fees", maxGroupSize: 12, status: "active", featured: true, createdAt: "2025-12-01T00:00:00Z" },
  ],
  hotels: [
    { id: "h1", name: "Sule Shangri-La Yangon", location: "Yangon", address: "223 Sule Pagoda Road, Yangon", description: "Luxury 5-star hotel in downtown Yangon", rating: 5, pricePerNightMMK: 180000, pricePerNightUSD: 86, availableRooms: 20, totalRooms: 280, amenities: "Pool, WiFi, Gym, Restaurant, Spa, Bar", images: JSON.stringify(["/images_v2/hotel1-v3.jpg"]), roomTypes: [{ name: "Deluxe Room", priceMMK: 180000, priceUSD: 86, capacity: 2, available: 10 }, { name: "Executive Suite", priceMMK: 350000, priceUSD: 167, capacity: 3, available: 5 }], status: "active", featured: true, createdAt: "2025-12-01T00:00:00Z" },
    { id: "h2", name: "Aureum Palace Bagan", location: "Bagan", address: "Hotel Zone, Nyaung Oo, Bagan", description: "Boutique luxury resort near Bagan temples", rating: 5, pricePerNightMMK: 220000, pricePerNightUSD: 105, availableRooms: 15, totalRooms: 110, amenities: "Pool, WiFi, Gym, Restaurant, Spa", images: JSON.stringify(["/images_v2/hotel2-v3.jpg"]), roomTypes: [{ name: "Garden Villa", priceMMK: 220000, priceUSD: 105, capacity: 2, available: 8 }], status: "active", featured: true, createdAt: "2025-12-01T00:00:00Z" },
    { id: "h3", name: "Novotel Yangon Max", location: "Yangon", address: "459 Pyay Road, Yangon", description: "Modern international hotel", rating: 4, pricePerNightMMK: 150000, pricePerNightUSD: 71, availableRooms: 30, totalRooms: 250, amenities: "Pool, WiFi, Gym, Restaurant, Bar", images: JSON.stringify(["/images_v2/hotel3-v3.jpg"]), roomTypes: [{ name: "Superior Room", priceMMK: 150000, priceUSD: 71, capacity: 2, available: 15 }], status: "active", featured: false, createdAt: "2025-12-01T00:00:00Z" },
    { id: "h4", name: "Pristine Lotus Inle", location: "Inle", address: "Inle Lake, Nyaungshwe", description: "Overwater bungalows on Inle Lake", rating: 5, pricePerNightMMK: 200000, pricePerNightUSD: 95, availableRooms: 12, totalRooms: 48, amenities: "Pool, WiFi, Restaurant, Boat Tours", images: JSON.stringify(["/images_v2/hotel4-v3.jpg"]), roomTypes: [{ name: "Lake Villa", priceMMK: 200000, priceUSD: 95, capacity: 2, available: 6 }], status: "active", featured: true, createdAt: "2025-12-01T00:00:00Z" },
    { id: "h5", name: "Mandalay Hill Resort", location: "Mandalay", address: "Mandalay Hill Road, Mandalay", description: " Resort at the foot of Mandalay Hill", rating: 4, pricePerNightMMK: 170000, pricePerNightUSD: 81, availableRooms: 25, totalRooms: 200, amenities: "Pool, WiFi, Gym, Restaurant", images: JSON.stringify(["/images_v2/hotel5-v3.jpg"]), roomTypes: [{ name: "Deluxe Room", priceMMK: 170000, priceUSD: 81, capacity: 2, available: 12 }], status: "active", featured: false, createdAt: "2025-12-01T00:00:00Z" },
    { id: "h6", name: "Amazing Ngapali Resort", location: "Ngapali", address: "Ngapali Beach, Thandwe", description: "Beachfront luxury resort", rating: 5, pricePerNightMMK: 250000, pricePerNightUSD: 119, availableRooms: 8, totalRooms: 60, amenities: "Pool, WiFi, Gym, Restaurant, Beach, Spa", images: JSON.stringify(["/images_v2/hotel6-v2.jpg"]), roomTypes: [{ name: "Beach Villa", priceMMK: 250000, priceUSD: 119, capacity: 2, available: 4 }], status: "active", featured: true, createdAt: "2025-12-01T00:00:00Z" },
  ],
  cars: [
    { id: "c1", carType: "Toyota Alphard", description: "Luxury MPV with captain seats", capacity: 7, features: "AC, Leather Seats, WiFi, GPS", images: JSON.stringify(["/images_v2/car1-v2.jpg"]), pricing: [{ duration: "Full Day", priceMMK: 150000, priceUSD: 71 }, { duration: "Half Day", priceMMK: 90000, priceUSD: 43 }], transmission: "Automatic", seats: 7, status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "c2", carType: "Toyota Wish", description: "Affordable family wagon", capacity: 5, features: "AC, GPS, Fuel Efficient", images: JSON.stringify(["/images_v2/car2-v2.jpg"]), pricing: [{ duration: "Full Day", priceMMK: 80000, priceUSD: 38 }], transmission: "Automatic", seats: 5, status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "c3", carType: "Toyota Noah", description: "Spacious 7-seater for groups", capacity: 7, features: "AC, Luggage Space, GPS", images: JSON.stringify(["/images_v2/car3-v2.jpg"]), pricing: [{ duration: "Full Day", priceMMK: 85000, priceUSD: 40 }], transmission: "CVT", seats: 7, status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "c4", carType: "Alphard Executive", description: "Executive-class travel experience", capacity: 6, features: "AC, Massage Seats, Premium Sound", images: JSON.stringify(["/images_v2/car4-v2.jpg"]), pricing: [{ duration: "Full Day", priceMMK: 200000, priceUSD: 95 }], transmission: "Automatic", seats: 6, status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "c5", carType: "Minibus 15-Seater", description: "Perfect for large group trips", capacity: 15, features: "AC, Large Group, Luggage", images: JSON.stringify(["/images_v2/car5-v2.jpg"]), pricing: [{ duration: "Full Day", priceMMK: 120000, priceUSD: 57 }], transmission: "Manual", seats: 15, status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "c6", carType: "Probox Budget", description: "No-frills budget transport", capacity: 4, features: "AC, Budget, Fuel Efficient", images: JSON.stringify(["/images_v2/car6-v2.jpg"]), pricing: [{ duration: "Full Day", priceMMK: 50000, priceUSD: 24 }], transmission: "Automatic", seats: 4, status: "active", createdAt: "2025-12-01T00:00:00Z" },
  ],
  cruises: [
    { id: "cr1", title: "Halong Bay Cruise", destination: "Vietnam", description: "Luxury overnight cruise in Halong Bay", priceMMK: 650000, priceUSD: 310, duration: "3 Days / 2 Nights", images: JSON.stringify(["/images_v2/cruise1-v2.jpg"]), amenities: "AC Cabin, Restaurant, Bar, Sun Deck", included: "Cabin, Meals, Tours, Kayaking", excluded: "Flights, Visa Fees", maxGroupSize: 20, status: "active", featured: true, createdAt: "2025-12-01T00:00:00Z" },
    { id: "cr2", title: "Singapore River Cruise", destination: "Singapore", description: "Scenic river cruise through Singapore", priceMMK: 350000, priceUSD: 167, duration: "1 Day", images: JSON.stringify(["/images_v2/cruise2-v2.jpg"]), amenities: "AC, Refreshments, Guide", included: "Cruise, Meals, Guide", excluded: "Flights, Hotel", maxGroupSize: 30, status: "active", featured: false, createdAt: "2025-12-01T00:00:00Z" },
    { id: "cr3", title: "Irrawaddy River Cruise", destination: "Myanmar", description: "Luxury cruise along the Irrawaddy River", priceMMK: 850000, priceUSD: 405, duration: "7 Days / 6 Nights", images: JSON.stringify(["/images_v2/cruise3-v2.jpg"]), amenities: "AC Cabin, Restaurant, Bar, Pool, Spa", included: "Cabin, Meals, Tours, Guide", excluded: "Flights, Visa Fees", maxGroupSize: 15, status: "active", featured: true, createdAt: "2025-12-01T00:00:00Z" },
  ],
  visas: [
    { id: "v1", country: "Thailand", countryCode: "TH", processingTime: "3-5 Working Days", visaFeeMMK: 60000, visaFeeUSD: 29, requirements: "Passport valid 6+ months, 2 passport photos, Bank statement, Flight itinerary", additionalInfo: "eVisa available online", status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "v2", country: "Singapore", countryCode: "SG", processingTime: "3 Working Days", visaFeeMMK: 45000, visaFeeUSD: 21, requirements: "Passport valid 6+ months, 2 passport photos, Hotel booking, Bank statement", additionalInfo: "eVisa available", status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "v3", country: "Malaysia", countryCode: "MY", processingTime: "2-3 Working Days", visaFeeMMK: 40000, visaFeeUSD: 19, requirements: "Passport valid 6+ months, 2 passport photos, Flight itinerary", additionalInfo: "eVisa available", status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "v4", country: "Vietnam", countryCode: "VN", processingTime: "3-5 Working Days", visaFeeMMK: 55000, visaFeeUSD: 26, requirements: "Passport valid 6+ months, 2 passport photos", additionalInfo: "eVisa or VOA available", status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "v5", country: "Cambodia", countryCode: "KH", processingTime: "3 Working Days", visaFeeMMK: 50000, visaFeeUSD: 24, requirements: "Passport valid 6+ months, 2 passport photos", additionalInfo: "eVisa or VOA", status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "v6", country: "Laos", countryCode: "LA", processingTime: "3-5 Working Days", visaFeeMMK: 45000, visaFeeUSD: 21, requirements: "Passport valid 6+ months, 2 passport photos", additionalInfo: "eVisa or VOA", status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "v7", country: "India", countryCode: "IN", processingTime: "5-7 Working Days", visaFeeMMK: 75000, visaFeeUSD: 36, requirements: "Passport valid 6+ months, 2 passport photos, Bank statement", additionalInfo: "eVisa available", status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "v8", country: "Japan", countryCode: "JP", processingTime: "5-7 Working Days", visaFeeMMK: 55000, visaFeeUSD: 26, requirements: "Passport valid 6+ months, 2 passport photos, Bank statement, Invitation letter", additionalInfo: "Requires physical documents", status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "v9", country: "South Korea", countryCode: "KR", processingTime: "5-7 Working Days", visaFeeMMK: 50000, visaFeeUSD: 24, requirements: "Passport valid 6+ months, 2 passport photos, Bank statement", additionalInfo: "eVisa available", status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "v10", country: "China", countryCode: "CN", processingTime: "5-7 Working Days", visaFeeMMK: 80000, visaFeeUSD: 38, requirements: "Passport valid 6+ months, 2 passport photos, Hotel booking, Flight itinerary", additionalInfo: "Requires physical documents", status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "v11", country: "UAE (Dubai)", countryCode: "AE", processingTime: "5-7 Working Days", visaFeeMMK: 120000, visaFeeUSD: 57, requirements: "Passport valid 6+ months, 2 passport photos, Bank statement, Hotel booking", additionalInfo: "eVisa available", status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "v12", country: "Turkey", countryCode: "TR", processingTime: "3-5 Working Days", visaFeeMMK: 90000, visaFeeUSD: 43, requirements: "Passport valid 6+ months, 2 passport photos", additionalInfo: "eVisa available", status: "active", createdAt: "2025-12-01T00:00:00Z" },
  ],
  insurances: [
    { id: "i1", planName: "Basic Travel Shield", coverageAmountMMK: 5000000, coverageAmountUSD: 2380, premiumPriceMMK: 15000, premiumPriceUSD: 7, duration: "Per Trip (up to 7 days)", benefits: "Medical expenses, Trip delay coverage, Emergency hotline", exclusions: "Pre-existing conditions, Extreme sports, Self-inflicted injuries", status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "i2", planName: "Standard Travel Guard", coverageAmountMMK: 10000000, coverageAmountUSD: 4760, premiumPriceMMK: 25000, premiumPriceUSD: 12, duration: "Per Trip (up to 14 days)", benefits: "Medical expenses, Baggage loss, Trip cancellation, Emergency hotline", exclusions: "Pre-existing conditions, Extreme sports, Alcohol-related incidents", status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "i3", planName: "Premium Travel Protect", coverageAmountMMK: 20000000, coverageAmountUSD: 9520, premiumPriceMMK: 45000, premiumPriceUSD: 21, duration: "Annual (multi-trip)", benefits: "Medical expenses, Trip cancellation, Baggage loss, Evacuation, Family coverage", exclusions: "Pre-existing conditions, War zones, Nuclear incidents", status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "i4", planName: "Family Travel Plan", coverageAmountMMK: 15000000, coverageAmountUSD: 7140, premiumPriceMMK: 60000, premiumPriceUSD: 29, duration: "Per Trip (up to 14 days)", benefits: "Family medical, Trip cancellation, Baggage loss, Child care coverage", exclusions: "Pre-existing conditions, Extreme sports", status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "i5", planName: "Business Travel Cover", coverageAmountMMK: 12000000, coverageAmountUSD: 5710, premiumPriceMMK: 35000, premiumPriceUSD: 17, duration: "Per Trip (up to 10 days)", benefits: "Business equipment coverage, Medical, Trip cancellation", exclusions: "Pre-existing conditions, Leisure sports", status: "active", createdAt: "2025-12-01T00:00:00Z" },
    { id: "i6", planName: "Senior Travel Care", coverageAmountMMK: 18000000, coverageAmountUSD: 8570, premiumPriceMMK: 50000, premiumPriceUSD: 24, duration: "Per Trip (up to 30 days)", benefits: "Medical expenses, Emergency evacuation, Hospital cash allowance", exclusions: "Pre-existing conditions (unless declared), Extreme sports", status: "active", createdAt: "2025-12-01T00:00:00Z" },
  ],
  blog: [
    { _id: "b1", title: "Top 10 Temples in Bagan", content: "Discover the most stunning temples in Bagan, from the majestic Ananda to the mysterious Dhammayangyi.", image: "/images_v2/blog1-v2.jpg", author: "A9 Global Team", tags: ["Myanmar", "Bagan", "Temples", "Travel Guide"], createdAt: "2025-12-01T00:00:00.000Z" },
    { _id: "b2", title: "Yangon Street Food Guide", content: "Explore the vibrant street food scene of Yangon.", image: "/images_v2/blog2-v2.jpg", author: "A9 Global Team", tags: ["Myanmar", "Yangon", "Food", "Guide"], createdAt: "2025-12-05T00:00:00.000Z" },
    { _id: "b3", title: "Inle Lake: A Photographer's Dream", content: "Capture the stunning beauty of Inle Lake.", image: "/images_v2/blog3-v2.jpg", author: "A9 Global Team", tags: ["Myanmar", "Inle", "Photography", "Nature"], createdAt: "2025-12-10T00:00:00.000Z" },
    { _id: "b4", title: "Myanmar Visa Guide 2026", content: "Everything you need to know about getting a Myanmar visa in 2026.", image: "/images_v2/blog4-v2.jpg", author: "A9 Global Team", tags: ["Myanmar", "Visa", "Guide", "International"], createdAt: "2025-12-15T00:00:00.000Z" },
  ],
  mingalar: [
    { id: "m1", title: "Fine Dining", desc: "Premium à la carte dining experience", icon: "🍽️", img: "/images_v2/sky1-v3.jpg" },
    { id: "m2", title: "Open Bar", desc: "Premium spirits, wine & cocktails", icon: "🍸", img: "/images_v2/sky2-v3.jpg" },
    { id: "m3", title: "Private Suite", desc: "Spacious lie-flat seating with privacy", icon: "🛋️", img: "/images_v2/sky3-v3.jpg" },
    { id: "m4", title: "Spa Service", desc: "Pre-flight massage & wellness treatments", icon: "💆", img: "/images_v2/sky-vip-v2.jpg" },
    { id: "m5", title: "Business Center", desc: "Meeting rooms, printing & high-speed WiFi", icon: "💼", img: "/images_v2/sky-business-v2.jpg" },
    { id: "m6", title: "Personal Concierge", desc: "Dedicated concierge for all your travel needs", icon: "🤵", img: "/images_v2/sky-main-v2.jpg" },
  ],
};

// ── In-memory fallback ────────────────────────────────────
const memoryStore = new Map<string, any[]>();

// ── Lazy Upstash Redis init ───────────────────────────────
let _redis: any = null;
let _redisInitTried = false;

function getRedis(): any {
  if (_redis) return _redis;
  if (_redisInitTried) return null;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      const { Redis } = require("@upstash/redis");
      _redis = new Redis({ url, token });
      console.log("[Store] Upstash Redis connected");
    } catch (e) {
      console.warn("[Store] Upstash Redis init failed:", (e as Error).message.substring(0, 60));
    }
  }
  _redisInitTried = true;
  return _redis;
}

// ── Core store ops ─────────────────────────────────────────
const PREFIX = "a9:";

async function storeGetAll(collection: string): Promise<any[]> {
  const redis = getRedis();
  if (redis) {
    try {
      const raw = await redis.get(`${PREFIX}${collection}`);
      if (raw && Array.isArray(raw) && raw.length > 0) return raw;
    } catch (e) {
      console.warn(`[Store] redis.get ${collection} failed, using fallback`);
    }
  }
  // Memory fallback
  const mem = memoryStore.get(collection);
  if (mem && mem.length > 0) return mem;
  // Seed fallback
  return SEEDS[collection] || [];
}

async function storeSet(collection: string, data: any[]): Promise<void> {
  memoryStore.set(collection, data);
  const redis = getRedis();
  if (redis) {
    try { await redis.set(`${PREFIX}${collection}`, data); } catch (e) { /* silent */ }
  }
}

// ── Public API ────────────────────────────────────────────

export async function getAll(collection: Collection): Promise<any[]> {
  return await storeGetAll(collection);
}

export async function getById(collection: Collection, id: string): Promise<any | null> {
  const items = await storeGetAll(collection);
  return items.find((item: any) => item.id === id || item._id === id) || null;
}

export async function create(collection: Collection, data: Record<string, any>): Promise<any> {
  const items = await storeGetAll(collection);
  const id = data.id || `gen_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const item = { ...data, id, createdAt: data.createdAt || new Date().toISOString() };
  items.push(item);
  await storeSet(collection, items);
  return item;
}

export async function update(collection: Collection, id: string, data: Record<string, any>): Promise<any | null> {
  const items = await storeGetAll(collection);
  const idx = items.findIndex((item: any) => item.id === id || item._id === id);
  if (idx === -1) return null;
  const updated = { ...items[idx], ...data, id: items[idx].id, updatedAt: new Date().toISOString() };
  items[idx] = updated;
  await storeSet(collection, items);
  return updated;
}

export const delete_ = async (collection: Collection, id: string): Promise<boolean> => {
  const items = await storeGetAll(collection);
  const idx = items.findIndex((item: any) => item.id === id || item._id === id);
  if (idx === -1) return false;
  items.splice(idx, 1);
  await storeSet(collection, items);
  return true;
};

export async function getBookings(): Promise<any[]> {
  return await storeGetAll("bookings");
}

export async function getDashboardStats(): Promise<Record<string, number>> {
  const [tours, hotels, cars, cruises, visas, insurances, blog, bookings, mingalar] = await Promise.all([
    storeGetAll("tours"), storeGetAll("hotels"), storeGetAll("cars"), storeGetAll("cruises"),
    storeGetAll("visas"), storeGetAll("insurances"), storeGetAll("blog"), storeGetAll("bookings"),
    storeGetAll("mingalar"),
  ]);
  return {
    tours: tours.length, hotels: hotels.length, cars: cars.length,
    cruises: cruises.length, visas: visas.length, insurances: insurances.length,
    blog: blog.length, bookings: bookings.length, mingalar: mingalar.length,
  };
}

export const updateById = update;
export const deleteById = delete_;
