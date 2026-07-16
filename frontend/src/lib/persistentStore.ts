/**
 * persistentStore.ts — Supabase-backed store
 * Replaces in-memory store with real PostgreSQL persistence
 */

import { supabase } from './supabase';

type Collection = "tours" | "hotels" | "cars" | "cruises" | "visas" | "insurances" | "blog" | "bookings" | "mingalar" | "site-config" | "settings";

// Fallback seed data (used if Supabase fails)
const SEEDS: Record<string, any[]> = {
  tours: [
    { id: "t1", title: "Golden Land Explorer", destination: "Bagan", description: "Explore ancient temples of Bagan", priceMMK: 450000, priceUSD: 215, duration: "5 Days / 4 Nights", images: JSON.stringify(["/images_v2/bagan-v2.jpg"]), amenities: "Guide, AC Transport, Breakfast", included: "Hotel, Meals, Guide, Transport", excluded: "Flights, Visa Fees", maxGroupSize: 15, status: "active", featured: true },
    { id: "t2", title: "Yangon City Lights", destination: "Yangon", description: "Discover colonial charm of Yangon", priceMMK: 250000, priceUSD: 119, duration: "3 Days / 2 Nights", images: JSON.stringify(["/images_v2/yangon-v2.jpg"]), amenities: "Guide, AC Transport, Breakfast", included: "Hotel, Meals, Guide", excluded: "Flights, Visa Fees", maxGroupSize: 12, status: "active", featured: false },
    { id: "t3", title: "Inle Lake Serenity", destination: "Inle", description: "Floating gardens & markets", priceMMK: 380000, priceUSD: 181, duration: "4 Days / 3 Nights", images: JSON.stringify(["/images_v2/inle-v2.jpg"]), amenities: "Boat, Guide, Breakfast", included: "Hotel, Meals, Boat Tours", excluded: "Flights, Visa Fees", maxGroupSize: 10, status: "active", featured: true },
  ],
  hotels: [
    { id: "h1", name: "Sule Shangri-La Yangon", location: "Yangon", address: "223 Sule Pagoda Road", description: "Luxury 5-star hotel", rating: 5, pricePerNightMMK: 180000, pricePerNightUSD: 86, availableRooms: 20, totalRooms: 280, amenities: "Pool, WiFi, Gym", images: JSON.stringify(["/images_v2/hotel1-v3.jpg"]), roomTypes: [], status: "active", featured: true },
    { id: "h2", name: "Aureum Palace Bagan", location: "Bagan", address: "Hotel Zone, Bagan", description: "Boutique luxury resort", rating: 5, pricePerNightMMK: 220000, pricePerNightUSD: 105, availableRooms: 15, totalRooms: 110, amenities: "Pool, WiFi, Spa", images: JSON.stringify(["/images_v2/hotel2-v3.jpg"]), roomTypes: [], status: "active", featured: true },
  ],
  cars: [
    { id: "c1", carType: "Toyota Alphard", description: "Luxury MPV", capacity: 7, features: "AC, Leather, WiFi", images: JSON.stringify(["/images_v2/car1-v2.jpg"]), pricing: [], transmission: "Automatic", seats: 7, status: "active" },
    { id: "c2", carType: "Toyota Wish", description: "Family wagon", capacity: 5, features: "AC, GPS", images: JSON.stringify(["/images_v2/car2-v2.jpg"]), pricing: [], transmission: "Automatic", seats: 5, status: "active" },
  ],
  cruises: [
    { id: "cr1", title: "Halong Bay Cruise", destination: "Vietnam", description: "Luxury overnight cruise", priceMMK: 650000, priceUSD: 310, duration: "3 Days / 2 Nights", images: JSON.stringify(["/images_v2/cruise1-v2.jpg"]), amenities: "AC Cabin, Restaurant", included: "Cabin, Meals, Tours", excluded: "Flights", maxGroupSize: 20, status: "active", featured: true },
  ],
  visas: [
    { id: "v1", country: "Thailand", countryCode: "TH", processingTime: "3-5 Working Days", visaFeeMMK: 60000, visaFeeUSD: 29, requirements: "Passport, Photos", additionalInfo: "eVisa available", status: "active" },
    { id: "v2", country: "Singapore", countryCode: "SG", processingTime: "3 Working Days", visaFeeMMK: 45000, visaFeeUSD: 21, requirements: "Passport, Photos", additionalInfo: "eVisa available", status: "active" },
  ],
  insurances: [
    { id: "i1", planName: "Basic Travel Shield", coverageAmountMMK: 5000000, coverageAmountUSD: 2380, premiumPriceMMK: 15000, premiumPriceUSD: 7, duration: "Per Trip", benefits: "Medical, Trip delay", exclusions: "Pre-existing conditions", status: "active" },
  ],
  mingalar: [
    { id: "m1", title: "Fine Dining", desc: "Premium dining", icon: "🍽️", img: "/images_v2/sky1-v3.jpg" },
    { id: "m2", title: "Open Bar", desc: "Premium spirits", icon: "🍸", img: "/images_v2/sky2-v3.jpg" },
  ],
  blog: [],
  bookings: [],
};

// ── Public API ────────────────────────────────────────────

export async function getAll(collection: Collection): Promise<any[]> {
  try {
    const { data, error } = await supabase.from(collection).select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn(`[Store] Supabase getAll(${collection}) failed, using seed:`, (err as Error).message?.substring(0, 80));
    return SEEDS[collection] || [];
  }
}

export async function getById(collection: Collection, id: string): Promise<any | null> {
  try {
    const { data, error } = await supabase.from(collection).select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn(`[Store] Supabase getById(${collection}, ${id}) failed:`, (err as Error).message?.substring(0, 80));
    const items = SEEDS[collection] || [];
    return items.find((item: any) => item.id === id || item._id === id) || null;
  }
}

export async function create(collection: Collection, data: Record<string, any>): Promise<any> {
  try {
    const { data: result, error } = await supabase.from(collection).insert(data).select().single();
    if (error) throw error;
    return result;
  } catch (err) {
    console.warn(`[Store] Supabase create(${collection}) failed:`, (err as Error).message?.substring(0, 80));
    // Fallback to in-memory
    const items = SEEDS[collection] || [];
    const id = data.id || `gen_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const item = { ...data, id, createdAt: new Date().toISOString() };
    items.push(item);
    return item;
  }
}

export async function update(collection: Collection, id: string, data: Record<string, any>): Promise<any | null> {
  try {
    const { data: result, error } = await supabase.from(collection).update({ ...data, updatedAt: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return result;
  } catch (err) {
    console.warn(`[Store] Supabase update(${collection}, ${id}) failed:`, (err as Error).message?.substring(0, 80));
    return null;
  }
}

export const delete_ = async (collection: Collection, id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from(collection).delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn(`[Store] Supabase delete(${collection}, ${id}) failed:`, (err as Error).message?.substring(0, 80));
    return false;
  }
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
