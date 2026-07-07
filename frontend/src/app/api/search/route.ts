import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/adminStore";

export const dynamic = 'force-dynamic';

// ─── Helpers ─────────────────────────────────────────────────

function makeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseStringList(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === "string") return val.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function parseImages(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === "string") return val.split(" ").filter(Boolean).length > 1
    ? val.split(" ").filter(Boolean)
    : [val];
  return [];
}

function toNumber(v: unknown, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function matchesQuery(text: string, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase().trim();
  return text.toLowerCase().includes(q);
}

// ─── Transformers ─────────────────────────────────────────────

function transformTour(raw: Record<string, unknown>) {
  return {
    _id: raw.id as string,
    slug: makeSlug(raw.title as string),
    title: raw.title as string,
    destination: raw.destination as string || "",
    description: raw.description as string || "",
    priceMMK: toNumber(raw.priceMMK, 0),
    priceUSD: toNumber(raw.priceUSD, 0),
    duration: (raw.duration as string) || "N/A",
    durationUnit: "days",
    groupSize: toNumber(raw.maxGroupSize, toNumber(raw.capacity, 10)),
    rating: toNumber(raw.rating, 4.5),
    reviewCount: toNumber(raw.reviewCount, Math.floor(Math.random() * 50) + 10),
    images: parseImages(raw.images),
    amenities: parseStringList(raw.amenities),
    itinerary: [],
    included: parseStringList(raw.included),
    excluded: parseStringList(raw.excluded),
    featured: raw.status === "featured",
    createdAt: (raw.createdAt as string) || new Date().toISOString(),
  };
}

function transformHotel(raw: Record<string, unknown>) {
  return {
    _id: raw.id as string,
    slug: makeSlug(raw.name as string),
    name: raw.name as string,
    location: raw.location as string || "",
    rating: toNumber(raw.rating, 4.0),
    reviewCount: toNumber(raw.reviewCount, Math.floor(Math.random() * 30) + 5),
    pricePerNightMMK: toNumber(raw.pricePerNightMMK, 0),
    pricePerNightUSD: toNumber(raw.pricePerNightUSD, 0),
    images: parseImages(raw.images),
    amenities: parseStringList(raw.amenities),
    availableRooms: toNumber(raw.availableRooms, 5),
    description: raw.description as string || "",
  };
}

function transformCar(raw: Record<string, unknown>) {
  const pricingArr = Array.isArray(raw.pricing) ? raw.pricing : [];
  const pricingWithDriver = pricingArr.map((p: Record<string, unknown>) => ({
    duration: (p.duration as string) || "Full Day",
    priceMMK: toNumber(p.priceMMK, 0),
    priceUSD: toNumber(p.priceUSD, 0),
  }));

  return {
    _id: raw.id as string,
    slug: makeSlug(raw.carType as string),
    carType: raw.carType as string,
    capacity: toNumber(raw.capacity, 4),
    images: parseImages(raw.images),
    features: parseStringList(raw.features),
    pricingWithDriver,
    description: raw.description as string || "",
  };
}

// ─── GET handler ──────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const query = url.searchParams.get("query") || "";
    const destination = url.searchParams.get("destination") || "";
    const type = url.searchParams.get("type") || "all";
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");
    const currency = url.searchParams.get("currency") || "MMK";

    // Fetch raw data
    const rawTours = getAll("tours") as Record<string, unknown>[];
    const rawHotels = getAll("hotels") as Record<string, unknown>[];
    const rawCars = getAll("cars") as Record<string, unknown>[];

    // Transform
    let tours = rawTours.map(transformTour);
    let hotels = rawHotels.map(transformHotel);
    let cars = rawCars.map(transformCar);

    // Filter by query (search in name/title, destination/location, description)
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      tours = tours.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
      hotels = hotels.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q)
      );
      cars = cars.filter(
        (c) =>
          c.carType.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    // Filter by destination
    if (destination.trim()) {
      const dest = destination.trim().toLowerCase();
      tours = tours.filter((t) => t.destination.toLowerCase().includes(dest));
      hotels = hotels.filter((h) => h.location.toLowerCase().includes(dest));
    }

    // Filter by price
    if (minPrice || maxPrice) {
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;

      const priceKey = currency === "USD" ? "priceUSD" : "priceMMK";
      const hotelPriceKey = currency === "USD" ? "pricePerNightUSD" : "pricePerNightMMK";

      tours = tours.filter((t) => {
        const p = (t as Record<string, unknown>)[priceKey] as number;
        return p >= min && p <= max;
      });

      hotels = hotels.filter((h) => {
        const p = (h as Record<string, unknown>)[hotelPriceKey] as number;
        return p >= min && p <= max;
      });

      cars = cars.filter((c) => {
        // Use first pricing entry
        const pricing = c.pricingWithDriver;
        if (!pricing || pricing.length === 0) return false;
        const p = pricing[0][priceKey as keyof typeof pricing[0]] as number;
        return p >= min && p <= max;
      });
    }

    // Filter by type
    if (type === "tours") {
      hotels = [];
      cars = [];
    } else if (type === "hotels") {
      tours = [];
      cars = [];
    } else if (type === "cars") {
      tours = [];
      hotels = [];
    }

    return NextResponse.json({
      success: true,
      data: { tours, hotels, cars },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
