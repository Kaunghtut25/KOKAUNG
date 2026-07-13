import { NextResponse } from "next/server";
import { getDashboardStats, getAll } from "@/lib/persistentStore";

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (err: any) {
    console.error("[stats] Error:", err?.message || err);
    // Fallback: count from individual APIs
    const [tours, hotels, cars, cruises, visas, insurances, blog, bookings, mingalar] = await Promise.all([
      getAll("tours"), getAll("hotels"), getAll("cars"), getAll("cruises"),
      getAll("visas"), getAll("insurances"), getAll("blog"), getAll("bookings"), getAll("mingalar"),
    ]);
    return NextResponse.json({
      tours: tours.length, hotels: hotels.length, cars: cars.length,
      cruises: cruises.length, visas: visas.length, insurances: insurances.length,
      blog: blog.length, bookings: bookings.length, mingalar: mingalar.length,
    });
  }
}