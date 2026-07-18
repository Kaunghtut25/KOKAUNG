// Booking.com Affiliate Integration
// Sign up at: https://affiliate.booking.com
// Get your affiliate ID from the partner dashboard

export const BOOKING_AFFILIATE_ID = process.env.BOOKING_AFFILIATE_ID || "";
export const BOOKING_AFFILIATE_BASE = "https://www.booking.com";

interface HotelSearchParams {
  city?: string;
  checkin?: string;
  checkout?: string;
  guests?: number;
  rooms?: number;
}

// Generate Booking.com search URL with affiliate tracking
export function generateBookingUrl(params: HotelSearchParams): string {
  const url = new URL(BOOKING_AFFILIATE_BASE + "/searchresults.html");
  if (params.city) url.searchParams.set("ss", params.city);
  if (params.checkin) url.searchParams.set("checkin", params.checkin);
  if (params.checkout) url.searchParams.set("checkout", params.checkout);
  if (params.guests) url.searchParams.set("group_adults", String(params.guests));
  if (params.rooms) url.searchParams.set("no_rooms", String(params.rooms));
  if (BOOKING_AFFILIATE_ID) {
    url.searchParams.set("aid", BOOKING_AFFILIATE_ID);
  }
  url.searchParams.set("lang", "en");
  url.searchParams.set("currency", "usd");
  return url.toString();
}

// Generate hotel detail URL with affiliate tracking
export function generateHotelUrl(hotelId: string): string {
  const url = new URL(BOOKING_AFFILIATE_BASE + "/hotel/");
  url.pathname += hotelId + ".html";
  if (BOOKING_AFFILIATE_ID) {
    url.searchParams.set("aid", BOOKING_AFFILIATE_ID);
  }
  url.searchParams.set("lang", "en");
  url.searchParams.set("currency", "usd");
  return url.toString();
}
