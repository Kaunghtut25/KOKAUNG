/**
 * persistentStore.ts — Supabase-backed store
 * Replaces in-memory store with real PostgreSQL persistence
 */

import { supabase } from './supabase';
import { Redis } from '@upstash/redis';

type Collection = "tours" | "hotels" | "cars" | "cruises" | "visas" | "insurances" | "blog" | "bookings" | "mingalar" | "site-config" | "settings";

// ── Redis client (lazy) ────────────────────────────────────
let _redis: any = null;
function getRedis(): any {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) { console.warn('[Store] Upstash Redis env vars missing'); return null; }
  _redis = new Redis({ url, token });
  console.warn('[Store] Upstash Redis connected');
  return _redis;
}

async function redisSet(collection: string, data: Record<string, any>): Promise<any> {
  const redis = getRedis(); if (!redis) return null;
  const id = data.id || "gen_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
  const item = { ...data, id, updatedAt: new Date().toISOString() };
  await redis.hset("a9:" + collection, { [id]: JSON.stringify(item) });
  return item;
}
async function redisGetAll(collection: string): Promise<any[] | null> {
  const redis = getRedis(); if (!redis) return null;
  const hash = await redis.hgetall("a9:" + collection);
  if (!hash) return [];
  return Object.values(hash).map((v: any) => { try { return JSON.parse(v); } catch { return v; } });
}
async function redisGetById(collection: string, id: string): Promise<any | null> {
  const redis = getRedis(); if (!redis) return null;
  const raw = await redis.hget("a9:" + collection, id);
  if (!raw) return null;
  try { return JSON.parse(raw as string); } catch { return raw; }
}
async function redisUpdate(collection: string, id: string, data: Record<string, any>): Promise<any | null> {
  const redis = getRedis(); if (!redis) return null;
  const existing = await redisGetById(collection, id);
  if (!existing) return null;
  const updated = { ...existing, ...data, id, updatedAt: new Date().toISOString() };
  await redis.hset("a9:" + collection, { [id]: JSON.stringify(updated) });
  return updated;
}
async function redisDelete(collection: string, id: string): Promise<boolean> {
  const redis = getRedis(); if (!redis) return false;
  await redis.hdel("a9:" + collection, id);
  return true;
}
// Fallback seed data (used if Supabase fails)
const SEEDS: Record<string, any[]> = {
  tours: [
    { id: "t1", title: "Golden Land Explorer", destination: "Bagan", description: "Explore ancient temples of Bagan", priceMMK: 450000, priceUSD: 215, duration: "5 Days / 4 Nights", images: JSON.stringify(["/images_v2/tour-bagan-v2.jpg"]), amenities: "Guide, AC Transport, Breakfast", included: "Hotel, Meals, Guide, Transport", excluded: "Flights, Visa Fees", maxGroupSize: 15, status: "active", featured: true },
    { id: "t2", title: "Yangon City Lights", destination: "Yangon", description: "Discover colonial charm of Yangon", priceMMK: 250000, priceUSD: 119, duration: "3 Days / 2 Nights", images: JSON.stringify(["/images_v2/tour-yangon-v2.jpg"]), amenities: "Guide, AC Transport, Breakfast", included: "Hotel, Meals, Guide", excluded: "Flights, Visa Fees", maxGroupSize: 12, status: "active", featured: false },
    { id: "t3", title: "Inle Lake Serenity", destination: "Inle", description: "Floating gardens & markets", priceMMK: 380000, priceUSD: 181, duration: "4 Days / 3 Nights", images: JSON.stringify(["/images_v2/tour-inle-v2.jpg"]), amenities: "Boat, Guide, Breakfast", included: "Hotel, Meals, Boat Tours", excluded: "Flights, Visa Fees", maxGroupSize: 10, status: "active", featured: true },
    { id: "t4", title: "Ngapali Beach Escape", destination: "Ngapali", description: "Relax on pristine beaches", priceMMK: 550000, priceUSD: 262, duration: "4 Days / 3 Nights", images: JSON.stringify(["/images_v2/tour-beach-v2.jpg"]), amenities: "Beach Resort, Breakfast, Airport Transfer", included: "Hotel, Meals, Transfers", excluded: "Flights, Visa Fees", maxGroupSize: 20, status: "active", featured: true },
    { id: "t5", title: "Mandalay Ancient Capitals", destination: "Mandalay", description: "Visit ancient royal capitals", priceMMK: 320000, priceUSD: 152, duration: "3 Days / 2 Nights", images: JSON.stringify(["/images_v2/tour-mandalay-v2.jpg"]), amenities: "Guide, AC Transport, Breakfast", included: "Hotel, Meals, Guide", excluded: "Flights, Visa Fees", maxGroupSize: 15, status: "active", featured: false },
    { id: "t6", title: "Grand Myanmar Circuit", destination: "Myanmar", description: "12-day grand tour of Myanmar", priceMMK: 1200000, priceUSD: 571, duration: "12 Days / 11 Nights", images: JSON.stringify(["/images_v2/tour-grand-v2.jpg"]), amenities: "Guide, AC Transport, All Meals", included: "Hotels, Meals, Guide, Transport, Domestic Flights", excluded: "International Flights, Visa Fees", maxGroupSize: 10, status: "active", featured: true },
  ],
  hotels: [
    { id: "h1", name: "Sule Shangri-La Yangon", location: "Yangon", address: "223 Sule Pagoda Road", description: "Luxury 5-star hotel in downtown Yangon", rating: 5, pricePerNightMMK: 180000, pricePerNightUSD: 86, availableRooms: 20, totalRooms: 280, amenities: "Pool, WiFi, Gym, Spa, Restaurant", images: JSON.stringify(["/images_v2/hotel1-v3.jpg"]), roomTypes: [], status: "active", featured: true },
    { id: "h2", name: "Aureum Palace Bagan", location: "Bagan", address: "Hotel Zone, Bagan", description: "Boutique luxury resort near ancient temples", rating: 5, pricePerNightMMK: 220000, pricePerNightUSD: 105, availableRooms: 15, totalRooms: 110, amenities: "Pool, WiFi, Spa, Restaurant", images: JSON.stringify(["/images_v2/hotel2-v3.jpg"]), roomTypes: [], status: "active", featured: true },
    { id: "h3", name: "Inle Princess Resort", location: "Inle Lake", address: "Nyaung Shwe, Inle Lake", description: "Eco-friendly resort on Inle Lake", rating: 4, pricePerNightMMK: 160000, pricePerNightUSD: 76, availableRooms: 25, totalRooms: 50, amenities: "Pool, WiFi, Spa, Lake View", images: JSON.stringify(["/images_v2/hotel3-v3.jpg"]), roomTypes: [], status: "active", featured: false },
    { id: "h4", name: "Ngapali Bay Hotel", location: "Ngapali Beach", address: "Ngapali Beach", description: "Beachfront resort with stunning views", rating: 4, pricePerNightMMK: 250000, pricePerNightUSD: 119, availableRooms: 40, totalRooms: 80, amenities: "Pool, WiFi, Beach Access, Spa", images: JSON.stringify(["/images_v2/hotel4-v3.jpg"]), roomTypes: [], status: "active", featured: true },
    { id: "h5", name: "Mandalay Hill Resort", location: "Mandalay", address: "Near Mandalay Hill", description: "Hilltop resort with panoramic views", rating: 4, pricePerNightMMK: 120000, pricePerNightUSD: 57, availableRooms: 55, totalRooms: 200, amenities: "Pool, WiFi, Gym, Hill View", images: JSON.stringify(["/images_v2/hotel5-v3.jpg"]), roomTypes: [], status: "active", featured: false },
    { id: "h6", name: "The Strand Yangon", location: "Yangon", address: "92 Strand Road", description: "Historic colonial-era luxury hotel", rating: 5, pricePerNightMMK: 350000, pricePerNightUSD: 167, availableRooms: 8, totalRooms: 32, amenities: "Butler Service, Spa, Fine Dining", images: JSON.stringify(["/images_v2/hotel-luxury-v2.jpg"]), roomTypes: [], status: "active", featured: true },
  ],
  cars: [
    { id: "c1", carType: "Toyota Alphard", description: "Luxury MPV", capacity: 7, features: "AC, Leather, WiFi", images: JSON.stringify(["/images_v2/car1-v2.jpg"]), pricing: [{ duration: "Full Day", priceMMK: 150000, priceUSD: 71 }], transmission: "Automatic", seats: 7, status: "active" },
    { id: "c2", carType: "Toyota Wish", description: "Family wagon", capacity: 5, features: "AC, GPS", images: JSON.stringify(["/images_v2/car2-v2.jpg"]), pricing: [{ duration: "Full Day", priceMMK: 80000, priceUSD: 38 }], transmission: "Automatic", seats: 5, status: "active" },
    { id: "c3", carType: "Toyota Hiace", description: "Group transport", capacity: 12, features: "AC, Luggage Space", images: JSON.stringify(["/images_v2/car3-v2.jpg"]), pricing: [{ duration: "Full Day", priceMMK: 120000, priceUSD: 57 }], transmission: "Manual", seats: 12, status: "active" },
    { id: "c4", carType: "Honda CR-V", description: "SUV for rough terrain", capacity: 5, features: "AC, 4WD, Sunroof", images: JSON.stringify(["/images_v2/car4-v2.jpg"]), pricing: [{ duration: "Full Day", priceMMK: 95000, priceUSD: 45 }], transmission: "Automatic", seats: 5, status: "active" },
    { id: "c5", carType: "Mercedes S-Class", description: "Executive luxury sedan", capacity: 3, features: "AC, WiFi, Massage Seats", images: JSON.stringify(["/images_v2/car5-v2.jpg"]), pricing: [{ duration: "Full Day", priceMMK: 250000, priceUSD: 119 }], transmission: "Automatic", seats: 3, status: "active" },
    { id: "c6", carType: "Toyota Land Cruiser Prado", description: "Off-road capable SUV", capacity: 7, features: "AC, 4WD, Roof Rack", images: JSON.stringify(["/images_v2/car6-v2.jpg"]), pricing: [{ duration: "Full Day", priceMMK: 180000, priceUSD: 86 }], transmission: "Automatic", seats: 7, status: "active" },
  ],
  cruises: [
    { id: "cr1", title: "Halong Bay Cruise", destination: "Vietnam", description: "Luxury overnight cruise through Halong Bay", priceMMK: 650000, priceUSD: 310, duration: "3 Days / 2 Nights", images: JSON.stringify(["/images_v2/hero-cruises-v2.jpg"]), amenities: "AC Cabin, Restaurant, Sun Deck", included: "Cabin, Meals, Tours, Kayaking", excluded: "Flights, Visa Fees", maxGroupSize: 20, status: "active", featured: true },
    { id: "cr2", title: "Singapore Cruise", destination: "Singapore", description: "Luxury cruise around Singapore", priceMMK: 800000, priceUSD: 381, duration: "4 Days / 3 Nights", images: JSON.stringify(["/images_v2/dest-maldives-v2.jpg"]), amenities: "AC Cabin, Pool, Restaurant", included: "Cabin, Meals, Tours", excluded: "Flights, Visa Fees", maxGroupSize: 15, status: "active", featured: false },
    { id: "cr3", title: "Mekong River Cruise", destination: "Myanmar", description: "Scenic cruise along the Mekong River", priceMMK: 450000, priceUSD: 214, duration: "2 Days / 1 Night", images: JSON.stringify(["/images_v2/cruise1-v3.jpg"]), amenities: "AC Cabin, Local Cuisine, Guide", included: "Cabin, Meals, River Guide", excluded: "Flights, Personal Expenses", maxGroupSize: 30, status: "active", featured: true },
    { id: "cr4", title: "Phuket Island Cruise", destination: "Thailand", description: "Island-hopping cruise around Phuket", priceMMK: 950000, priceUSD: 452, duration: "5 Days / 4 Nights", images: JSON.stringify(["/images_v2/cruise2-v3.jpg"]), amenities: "Pool, Spa, Open Bar", included: "Cabin, Meals, Island Tours, Snorkeling", excluded: "Flights, Visa Fees", maxGroupSize: 25, status: "active", featured: true },
    { id: "cr5", title: "Bali Sunset Cruise", destination: "Indonesia", description: "Romantic sunset cruise around Bali", priceMMK: 550000, priceUSD: 262, duration: "3 Days / 2 Nights", images: JSON.stringify(["/images_v2/cruise3-v3.jpg"]), amenities: "Sun Deck, Live Music, BBQ Dinner", included: "Cabin, Meals, Sunset Tour, Entertainment", excluded: "Flights, Spa Treatments", maxGroupSize: 18, status: "active", featured: false },
    { id: "cr6", title: "Mediterranean Dream", destination: "Greece", description: "Luxury Mediterranean cruise through Greek islands", priceMMK: 2500000, priceUSD: 1190, duration: "7 Days / 6 Nights", images: JSON.stringify(["/images_v2/cruise1-v3.jpg"]), amenities: "Pool, Casino, Theater, Fine Dining", included: "Cabin, All Meals, Shore Excursions, Entertainment", excluded: "Flights, Visa, Premium Drinks", maxGroupSize: 50, status: "active", featured: true },
    { id: "cr7", title: "Dubai Marina Cruise", destination: "UAE", description: "Evening dinner cruise along Dubai Marina", priceMMK: 350000, priceUSD: 167, duration: "1 Day", images: JSON.stringify(["/images_v2/cruise2-v3.jpg"]), amenities: "AC Deck, Live Entertainment, Buffet", included: "Dinner, Live Show, Hotel Transfer", excluded: "Drinks, Personal Expenses", maxGroupSize: 40, status: "active", featured: false },
    { id: "cr8", title: "Maldives Luxury Cruise", destination: "Maldives", description: "Overwater cruise through Maldives atolls", priceMMK: 3200000, priceUSD: 1524, duration: "6 Days / 5 Nights", images: JSON.stringify(["/images_v2/dest-maldives-v2.jpg"]), amenities: "Jacuzzi, Butler Service, Water Sports", included: "Suite, All Meals, Diving, Island Visits", excluded: "Flights, Visa, Spa", maxGroupSize: 12, status: "active", featured: true },
    { id: "cr9", title: "Yangon River Cruise", destination: "Myanmar", description: "Traditional river cruise along Yangon River", priceMMK: 120000, priceUSD: 57, duration: "Half Day", images: JSON.stringify(["/images_v2/cruise3-v3.jpg"]), amenities: "Open Deck, Local Snacks, Guide", included: "Cruise, Snacks, Guided Tour", excluded: "Transport, Personal Expenses", maxGroupSize: 60, status: "active", featured: false },
    { id: "cr10", title: "Caribbean Explorer", destination: "Caribbean", description: "Ultimate Caribbean island-hopping adventure", priceMMK: 4200000, priceUSD: 2000, duration: "10 Days / 9 Nights", images: JSON.stringify(["/images_v2/hero-cruises-v2.jpg"]), amenities: "Pool, Casino, Spa, 5 Restaurants", included: "Suite, All Meals, Island Tours, Water Sports", excluded: "Flights, Visa, Premium Drinks", maxGroupSize: 40, status: "active", featured: true },
  ],
  visas: [
    { id: "v1", country: "Thailand", countryCode: "TH", processingTime: "3-5 Working Days", visaFeeMMK: 60000, visaFeeUSD: 29, requirements: "Passport, Photos, Bank Statement", additionalInfo: "eVisa available", status: "active" },
    { id: "v2", country: "Singapore", countryCode: "SG", processingTime: "3 Working Days", visaFeeMMK: 45000, visaFeeUSD: 21, requirements: "Passport, Photos, Hotel Booking", additionalInfo: "eVisa available", status: "active" },
    { id: "v3", country: "Malaysia", countryCode: "MY", processingTime: "2-3 Working Days", visaFeeMMK: 30000, visaFeeUSD: 14, requirements: "Passport, Photos", additionalInfo: "eVisa available", status: "active" },
    { id: "v4", country: "Japan", countryCode: "JP", processingTime: "7-10 Working Days", visaFeeMMK: 80000, visaFeeUSD: 38, requirements: "Passport, Photos, Bank Statement, Itinerary", additionalInfo: "Single/Multiple entry", status: "active" },
    { id: "v5", country: "South Korea", countryCode: "KR", processingTime: "5-7 Working Days", visaFeeMMK: 70000, visaFeeUSD: 33, requirements: "Passport, Photos, Bank Statement", additionalInfo: "K-ETA available for some", status: "active" },
    { id: "v6", country: "China", countryCode: "CN", processingTime: "4-6 Working Days", visaFeeMMK: 55000, visaFeeUSD: 26, requirements: "Passport, Photos, Invitation Letter", additionalInfo: "Single/Double entry", status: "active" },
  ],
    insurances: [
    { id: "i1", planName: "Basic Travel Shield", coverageAmountMMK: 5000000, coverageAmountUSD: 2380, premiumPriceMMK: 15000, premiumPriceUSD: 7, duration: "Per Trip", coverage: "Medical + Trip Delay", benefits: "Medical, Trip delay", exclusions: "Pre-existing conditions", description: "Essential coverage for short trips", status: "active" },
    { id: "i2", planName: "Standard Travel Guard", coverageAmountMMK: 10000000, coverageAmountUSD: 4760, premiumPriceMMK: 25000, premiumPriceUSD: 12, duration: "Per Trip", coverage: "Medical + Baggage Loss", benefits: "Medical, Baggage Loss, Flight Delay", exclusions: "Pre-existing conditions, Self-inflicted injury", description: "Comprehensive protection plan", status: "active" },
    { id: "i3", planName: "Premium Travel Protect", coverageAmountMMK: 50000000, coverageAmountUSD: 23800, premiumPriceMMK: 45000, premiumPriceUSD: 21, duration: "Annual", coverage: "Medical + Cancellation", benefits: "Unlimited Medical, Trip Cancellation, Concierge", exclusions: "Pre-existing conditions, War, Nuclear", description: "Premium travel coverage", status: "active" },
    { id: "i4", planName: "Family Travel Plan", coverageAmountMMK: 20000000, coverageAmountUSD: 9520, premiumPriceMMK: 60000, premiumPriceUSD: 29, duration: "Per Trip", coverage: "Family Medical + Trip", benefits: "Full Family Cover, Child Medical, Trip Cancellation", exclusions: "Pre-existing conditions, Self-inflicted", description: "Complete family protection", status: "active" },
    { id: "i5", planName: "Senior Travel Cover", coverageAmountMMK: 30000000, coverageAmountUSD: 14280, premiumPriceMMK: 55000, premiumPriceUSD: 26, duration: "Per Trip", coverage: "Medical + Evacuation", benefits: "Medical Emergency, Emergency Evacuation, Repatriation", exclusions: "Pre-existing conditions, Age over 85", description: "Specialized coverage for senior travelers", status: "active" },
    { id: "i6", planName: "Adventure Sports Pack", coverageAmountMMK: 35000000, coverageAmountUSD: 16660, premiumPriceMMK: 85000, premiumPriceUSD: 40, duration: "Per Trip", coverage: "Extreme Sports + Medical", benefits: "Sports Injury, Helicopter Rescue, Equipment Cover", exclusions: "Competitive sports, Base jumping", description: "Coverage for adventure activities", status: "active" },
    { id: "i7", planName: "Business Travel Pro", coverageAmountMMK: 40000000, coverageAmountUSD: 19040, premiumPriceMMK: 75000, premiumPriceUSD: 36, duration: "Annual", coverage: "Medical + Productivity", benefits: "Medical Emergency, Trip Delay, Document Replacement", exclusions: "Pre-existing conditions, War zones", description: "For frequent business travelers", status: "active" },
    { id: "i8", planName: "Student Travel Basic", coverageAmountMMK: 3000000, coverageAmountUSD: 1428, premiumPriceMMK: 12000, premiumPriceUSD: 6, duration: "Per Trip", coverage: "Medical + Baggage", benefits: "Medical Emergency, Baggage Loss, Trip Cancellation", exclusions: "Pre-existing conditions, Study abroad over 6 months", description: "Affordable coverage for students", status: "active" },
    { id: "i9", planName: "Cruise Coverage", coverageAmountMMK: 60000000, coverageAmountUSD: 28560, premiumPriceMMK: 95000, premiumPriceUSD: 45, duration: "Per Trip", coverage: "Medical + Missed Port", benefits: "Medical Emergency, Missed Port, Cabin Cover", exclusions: "Pre-existing conditions, Crew members", description: "Specialized cruise travel insurance", status: "active" },
  ],
    mingalar: [
    { id: "m1", title: "Fine Dining", desc: "Premium buffet & a la carte menu", icon: "🍽️", img: "/images_v2/sky1-v3.jpg" },
    { id: "m2", title: "Open Bar", desc: "Complimentary drinks & cocktails", icon: "🍸", img: "/images_v2/sky2-v3.jpg" },
    { id: "m3", title: "Workspace", desc: "High-speed WiFi & work stations", icon: "💻", img: "/images_v2/sky3-v3.jpg" },
    { id: "m4", title: "Shower Suites", desc: "Refresh before your flight", icon: "🚿", img: "/images_v2/sky1-v3.jpg" },
    { id: "m5", title: "Nap Pods", desc: "Rest in private sleeping pods", icon: "😴", img: "/images_v2/sky2-v3.jpg" },
    { id: "m6", title: "Concierge", desc: "Priority check-in & boarding", icon: "🛎️", img: "/images_v2/sky3-v3.jpg" },
  ],
  blog: [],
  bookings: [],
};

// ── Public API ────────────────────────────────────────────

export async function getAll(collection: Collection): Promise<any[]> {
  try {
    const { data, error } = await supabase.from(collection).select('*').order('createdAt', { ascending: false });
    if (!error && data) return data;
  } catch (err) {
    console.warn(`[Store] Supabase getAll(${collection}) failed, trying Redis:`, (err as Error).message?.substring(0, 80));
  }
  const redisData = await redisGetAll(collection);
  if (redisData !== null && redisData.length > 0) return redisData;
  console.warn(`[Store] Using seed data for ${collection}`);
  return SEEDS[collection] || [];
}

export async function getById(collection: Collection, id: string): Promise<any | null> {
  try {
    const { data, error } = await supabase.from(collection).select('*').eq('id', id).single();
    if (!error && data) return data;
  } catch (err) {
    console.warn(`[Store] Supabase getById(${collection}, ${id}) failed:`, (err as Error).message?.substring(0, 80));
  }
  const redisItem = await redisGetById(collection, id);
  if (redisItem) return redisItem;
  const items = SEEDS[collection] || [];
  return items.find((item: any) => item.id === id || item._id === id) || null;
}

export async function create(collection: Collection, data: Record<string, any>): Promise<any> {
  const id = data.id || `gen_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const item = { ...data, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  try {
    const { data: result, error } = await supabase.from(collection).insert(item).select().single();
    if (!error && result) return result;
  } catch (err) {
    console.warn(`[Store] Supabase create(${collection}) failed, trying Redis:`, (err as Error).message?.substring(0, 80));
  }
  const redisResult = await redisSet(collection, item);
  if (redisResult) { console.warn(`[Store] Saved ${collection}/${id} to Upstash Redis`); return redisResult; }
  console.warn(`[Store] Saving ${collection}/${id} to memory (won't survive cold start)`);
  const items = SEEDS[collection] || []; items.push(item); return item;
}

export async function update(collection: Collection, id: string, data: Record<string, any>): Promise<any | null> {
  const payload = { ...data, updatedAt: new Date().toISOString() };
  try {
    const { data: result, error } = await supabase.from(collection).update(payload).eq('id', id).select().single();
    if (!error && result) return result;
  } catch (err) {
    console.warn(`[Store] Supabase update(${collection}, ${id}) failed, trying Redis:`, (err as Error).message?.substring(0, 80));
  }
  const redisResult = await redisUpdate(collection, id, payload);
  if (redisResult) { console.warn(`[Store] Updated ${collection}/${id} in Upstash Redis`); return redisResult; }
  return null;
}

export const delete_ = async (collection: Collection, id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from(collection).delete().eq('id', id);
    if (!error) return true;
  } catch (err) {
    console.warn(`[Store] Supabase delete(${collection}, ${id}) failed:`, (err as Error).message?.substring(0, 80));
  }
  const redisOk = await redisDelete(collection, id);
  if (redisOk) { console.warn(`[Store] Deleted ${collection}/${id} from Upstash Redis`); return true; }
  const items = SEEDS[collection] || []; const idx = items.findIndex((item: any) => item.id === id || item._id === id);
  if (idx >= 0) { items.splice(idx, 1); return true; } return false;
};

export async function getBookings(): Promise<any[]> {
  return getAll("bookings");
}

export async function getDashboardStats(): Promise<Record<string, number>> {
  try {
    const [tours, hotels, cars, cruises, visas, insurances, blog, bookings, mingalar] = await Promise.all([
      getAll("tours"), getAll("hotels"), getAll("cars"), getAll("cruises"),
      getAll("visas"), getAll("insurances"), getAll("blog"), getAll("bookings"), getAll("mingalar"),
    ]);
    return {
      tours: tours.length, hotels: hotels.length, cars: cars.length,
      cruises: cruises.length, visas: visas.length, insurances: insurances.length,
      blog: blog.length, bookings: bookings.length, mingalar: mingalar.length,
    };
  } catch {
    return {
      tours: 0, hotels: 0, cars: 0, cruises: 0, visas: 0,
      insurances: 0, blog: 0, bookings: 0, mingalar: 0,
    };
  }
}

export const updateById = update;
export const deleteById = delete_;
