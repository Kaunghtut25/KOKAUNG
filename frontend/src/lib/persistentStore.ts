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

type Collection = "tours" | "hotels" | "cars" | "cruises" | "visas" | "insurances" | "blog" | "bookings" | "mingalar";

// ── Seed data ─────────────────────────────────────────────
const SEEDS: Record<string, any[]> = {
  tours: [
    { id: "t1", title: "Golden Land Explorer", destination: "Bagan",  priceMMK: 450000,  priceUSD: 215,  duration: "5 days", image: "/images/bagan.jpg",        description: "Explore ancient temples", category: "Cultural", featured: true  },
    { id: "t2", title: "Yangon City Lights",   destination: "Yangon", priceMMK: 250000,  priceUSD: 119,  duration: "3 days", image: "/images/yangon.jpg",       description: "Discover colonial charm", category: "City",     featured: false },
    { id: "t3", title: "Inle Lake Serenity",   destination: "Inle",   priceMMK: 380000,  priceUSD: 181,  duration: "4 days", image: "/images/inle.jpg",         description: "Floating gardens & markets", category: "Nature",   featured: true  },
    { id: "t4", title: "Ngapali Beach Bliss",  destination: "Ngapali",priceMMK: 520000,  priceUSD: 248,  duration: "5 days", image: "/images/ngapali.jpg",      description: "Pristine beach getaway",   category: "Beach",    featured: true  },
    { id: "t5", title: "Mandalay Royal Tour",  destination: "Mandalay",priceMMK:320000,  priceUSD: 152,  duration: "4 days", image: "/images/mandalay.jpg",     description: "Last royal capital",       category: "Cultural", featured: false },
    { id: "t6", title: "Myanmar Grand Tour",   destination: "Multi",   priceMMK: 850000,  priceUSD: 405,  duration: "10 days",image: "/images/myanmar.jpg",       description: "Complete Myanmar experience", category: "Multi",    featured: true  },
  ],
  hotels: [
    { id: "h1", title: "Sule Shangri-La Yangon",   destination: "Yangon", priceMMK: 180000, priceUSD: 86,  rating: 4.5, reviewCount: 320, image: "/images/hotel1.jpg" },
    { id: "h2", title: "Aureum Palace Bagan",      destination: "Bagan",  priceMMK: 220000, priceUSD: 105, rating: 4.7, reviewCount: 180, image: "/images/hotel2.jpg" },
    { id: "h3", title: "Novotel Yangon Max",       destination: "Yangon", priceMMK: 150000, priceUSD: 71,  rating: 4.3, reviewCount: 250, image: "/images/hotel3.jpg" },
    { id: "h4", title: "Pristine Lotus Inle",      destination: "Inle",   priceMMK: 200000, priceUSD: 95,  rating: 4.6, reviewCount: 150, image: "/images/hotel4.jpg" },
    { id: "h5", title: "Mandalay Hill Resort",     destination: "Mandalay",priceMMK:170000,priceUSD: 81,  rating: 4.4, reviewCount: 200, image: "/images/hotel5.jpg" },
    { id: "h6", title: "Amazing Ngapali Resort",   destination: "Ngapali",priceMMK: 250000,priceUSD: 119, rating: 4.8, reviewCount: 90,  image: "/images/hotel6.jpg" },
  ],
  cars: [
    { id: "c1", title: "Toyota Alphard",        type: "Luxury",   pricePerDayMMK: 150000, pricePerDayUSD: 71,  passengers: 7, image: "/images/car1.jpg" },
    { id: "c2", title: "Toyota Wish",           type: "Standard", pricePerDayMMK: 80000,  pricePerDayUSD: 38,  passengers: 5, image: "/images/car2.jpg" },
    { id: "c3", title: "Toyota Noah",           type: "Standard", pricePerDayMMK: 85000,  pricePerDayUSD: 40,  passengers: 7, image: "/images/car3.jpg" },
    { id: "c4", title: "Alphard Executive",     type: "Premium",  pricePerDayMMK: 200000, pricePerDayUSD: 95,  passengers: 6, image: "/images/car4.jpg" },
    { id: "c5", title: "Minibus 15-Seater",     type: "Group",    pricePerDayMMK: 120000, pricePerDayUSD: 57,  passengers: 15,image: "/images/car5.jpg" },
    { id: "c6", title: "Probox Budget",         type: "Economy",  pricePerDayMMK: 50000,  pricePerDayUSD: 24,  passengers: 4, image: "/images/car6.jpg" },
  ],
  cruises: [],
  visas: [
    { id: "v1",  country: "Thailand",      visaType: "Tourist",       feeMMK: 60000,  feeUSD: 29,  processingTime: "3-5 days", notes: "eVisa available" },
    { id: "v2",  country: "Singapore",     visaType: "Tourist",       feeMMK: 45000,  feeUSD: 21,  processingTime: "3 days",   notes: "eVisa available" },
    { id: "v3",  country: "Malaysia",      visaType: "Tourist",       feeMMK: 40000,  feeUSD: 19,  processingTime: "2-3 days", notes: "eVisa available" },
    { id: "v4",  country: "Vietnam",       visaType: "Tourist",       feeMMK: 55000,  feeUSD: 26,  processingTime: "3-5 days", notes: "eVisa available" },
    { id: "v5",  country: "Cambodia",      visaType: "Tourist",       feeMMK: 50000,  feeUSD: 24,  processingTime: "3 days",   notes: "eVisa or VOA" },
    { id: "v6",  country: "Laos",          visaType: "Tourist",       feeMMK: 45000,  feeUSD: 21,  processingTime: "3-5 days", notes: "eVisa or VOA" },
    { id: "v7",  country: "India",         visaType: "Tourist",       feeMMK: 75000,  feeUSD: 36,  processingTime: "5-7 days", notes: "eVisa available" },
    { id: "v8",  country: "Japan",         visaType: "Tourist",       feeMMK: 55000,  feeUSD: 26,  processingTime: "5-7 days", notes: "Requires docs" },
    { id: "v9",  country: "South Korea",   visaType: "Tourist",       feeMMK: 50000,  feeUSD: 24,  processingTime: "5-7 days", notes: "eVisa available" },
    { id: "v10", country: "China",         visaType: "Tourist",       feeMMK: 80000,  feeUSD: 38,  processingTime: "5-7 days", notes: "Requires docs" },
    { id: "v11", country: "UK",            visaType: "Tourist",       feeMMK: 250000, feeUSD: 119, processingTime: "10-15 days",notes: "Full docs required" },
    { id: "v12", country: "USA",           visaType: "Tourist",       feeMMK: 320000, feeUSD: 152, processingTime: "10-15 days",notes: "Interview required" },
    { id: "v13", country: "Australia",     visaType: "Tourist",       feeMMK: 280000, feeUSD: 133, processingTime: "10-15 days",notes: "Full docs required" },
    { id: "v14", country: "UAE (Dubai)",   visaType: "Tourist",       feeMMK: 120000, feeUSD: 57,  processingTime: "5-7 days", notes: "eVisa available" },
    { id: "v15", country: "Turkey",        visaType: "Tourist",       feeMMK: 90000,  feeUSD: 43,  processingTime: "3-5 days", notes: "eVisa available" },
    { id: "v16", country: "Thailand",      visaType: "Business",      feeMMK: 120000, feeUSD: 57,  processingTime: "5-7 days", notes: "Company docs required" },
    { id: "v17", country: "Singapore",     visaType: "Business",      feeMMK: 100000, feeUSD: 48,  processingTime: "5-7 days", notes: "Sponsor letter required" },
    { id: "v18", country: "Malaysia",      visaType: "Business",      feeMMK: 95000,  feeUSD: 45,  processingTime: "5-7 days", notes: "Sponsor letter required" },
    { id: "v19", country: "South Korea",   visaType: "Work (E-7)",    feeMMK: 180000, feeUSD: 86,  processingTime: "10-15 days",notes: "Contract + sponsor docs" },
    { id: "v20", country: "Japan",         visaType: "Work",          feeMMK: 150000, feeUSD: 71,  processingTime: "10-15 days",notes: "COE required" },
    { id: "v21", country: "Canada",        visaType: "Student",       feeMMK: 280000, feeUSD: 133, processingTime: "15-20 days",notes: "LOA + funds proof" },
    { id: "v22", country: "UK",            visaType: "Student",       feeMMK: 300000, feeUSD: 143, processingTime: "15-20 days",notes: "CAS letter required" },
    { id: "v23", country: "Australia",     visaType: "Student",       feeMMK: 320000, feeUSD: 152, processingTime: "15-20 days",notes: "COE required" },
  ],
  insurances: [
    { id: "i1", title: "Basic Travel Shield",     coverage: "Medical + Trip Delay", priceMMK: 15000,  priceUSD: 7,   duration: "Per trip" },
    { id: "i2", title: "Standard Travel Guard",   coverage: "Medical + Baggage",    priceMMK: 25000,  priceUSD: 12,  duration: "Per trip" },
    { id: "i3", title: "Premium Travel Protect",  coverage: "Medical + Cancellation",priceMMK:45000,  priceUSD: 21,  duration: "Annual" },
    { id: "i4", title: "Family Travel Plan",      coverage: "Family Medical + Trip",priceMMK: 60000,  priceUSD: 29,  duration: "Per trip" },
    { id: "i5", title: "Business Travel Cover",   coverage: "Business + Medical",   priceMMK: 35000,  priceUSD: 17,  duration: "Per trip" },
    { id: "i6", title: "Senior Travel Care",      coverage: "Medical + Evacuation",  priceMMK: 50000,  priceUSD: 24,  duration: "Per trip" },
  ],
  blog: [
    { id: "b1", title: "Top 10 Temples in Bagan",           slug: "top-10-temples-bagan",           image: "/images/blog1.jpg", excerpt: "Discover the most stunning temples...",     content: "Full article here...", category: "Travel Guide", date: "2025-12-01" },
    { id: "b2", title: "Yangon Street Food Guide",          slug: "yangon-street-food-guide",       image: "/images/blog2.jpg", excerpt: "Best street food spots in Yangon...",    content: "Full article here...", category: "Food",         date: "2025-12-05" },
    { id: "b3", title: "Inle Lake: A Photographer's Dream", slug: "inle-lake-photographers-dream",  image: "/images/blog3.jpg", excerpt: "Capture the beauty of Inle Lake...",     content: "Full article here...", category: "Photography",  date: "2025-12-10" },
    { id: "b4", title: "Myanmar Visa Guide 2026",           slug: "myanmar-visa-guide-2026",        image: "/images/blog4.jpg", excerpt: "Everything you need to know...",         content: "Full article here...", category: "Guide",        date: "2025-12-15" },
  ],
  mingalar: [
    { id: "m1", title: "Fine Dining",          description: "Premium à la carte dining experience",               icon: "🍽️",  price: "Included" },
    { id: "m2", title: "Open Bar",             description: "Premium spirits, wine & cocktails",                   icon: "🍸",  price: "Included" },
    { id: "m3", title: "Private Suite",        description: "Spacious lie-flat seating with privacy",              icon: "🛋️",  price: "Included" },
    { id: "m4", title: "Spa Service",          description: "Pre-flight massage & wellness treatments",             icon: "💆",  price: "From \$50" },
    { id: "m5", title: "Business Center",      description: "Meeting rooms, printing & high-speed WiFi",            icon: "💼",  price: "Included" },
    { id: "m6", title: "Personal Concierge",   description: "Dedicated concierge for all your travel needs",       icon: "🤵",  price: "Included" },
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