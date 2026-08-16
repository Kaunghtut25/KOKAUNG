// FIX 2026-08-16: single source of truth for booking input validation (shared by booking routes).
export const VALID_TRAVEL_TYPES = ["flight", "hotel", "tour", "car", "visa", "insurance", "cruise", "mingalar", "lounge", "oneway", "roundtrip", "multi-city"];

export function validateBookingInput(body: Record<string, unknown>): string[] {
  const errors: string[] = [];
  const displayName = body.fullName || body.name || body.customerName;
  const email = body.email || body.customerEmail;
  const phone = body.phone || body.customerPhone;
  const travelType = body.travelType || body.itemType;
  const departDate = body.departDate;
  const returnDate = body.returnDate;
  const passengers = body.passengers ?? body.travelers;
  const amount = body.amount ?? body.totalAmount ?? body.totalPrice;

  if (!displayName || !String(displayName).trim()) errors.push("Full name is required");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) errors.push("A valid email is required");
  if (!phone) errors.push("Phone number is required");
  if (!travelType || !VALID_TRAVEL_TYPES.includes(String(travelType))) {
    errors.push(`Valid travel type is required (${VALID_TRAVEL_TYPES.join("/")})`);
  }
  if (departDate && !/^\d{4}-\d{2}-\d{2}$/.test(String(departDate))) errors.push("Depart date must be YYYY-MM-DD");
  if (returnDate && !/^\d{4}-\d{2}-\d{2}$/.test(String(returnDate))) errors.push("Return date must be YYYY-MM-DD");
  if (passengers !== undefined && passengers !== null && passengers !== "") {
    const pax = Number(passengers);
    if (!Number.isInteger(pax) || pax < 1 || pax > 9) errors.push("Passengers must be a whole number between 1 and 9");
  }
  if (amount !== undefined && amount !== null && amount !== "") {
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt < 0) errors.push("Amount must be a non-negative number");
  }
  return errors;
}
