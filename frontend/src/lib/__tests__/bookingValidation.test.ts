import { describe, it, expect } from "vitest";
import { validateBookingInput, VALID_TRAVEL_TYPES } from "../bookingValidation";

const valid = { fullName: "Test User", email: "a@b.com", phone: "123456", travelType: "tour" };

describe("validateBookingInput", () => {
  it("accepts a valid payload", () => {
    expect(validateBookingInput(valid)).toEqual([]);
  });
  it("accepts booking/page shape (customerName/customerEmail/itemType)", () => {
    expect(validateBookingInput({ customerName: "A", customerEmail: "a@b.com", customerPhone: "1", itemType: "hotel", travelers: 2 })).toEqual([]);
  });
  it("rejects missing name", () => {
    const errs = validateBookingInput({ ...valid, fullName: "" });
    expect(errs).toContain("Full name is required");
  });
  it("rejects bad email", () => {
    expect(validateBookingInput({ ...valid, email: "nope" })).toContain("A valid email is required");
  });
  it("rejects missing phone", () => {
    expect(validateBookingInput({ ...valid, phone: "" })).toContain("Phone number is required");
  });
  it("rejects invalid travelType", () => {
    expect(validateBookingInput({ ...valid, travelType: "spaceship" })[0]).toMatch(/^Valid travel type is required/);
    expect(VALID_TRAVEL_TYPES).toContain("tour");
  });
  it("rejects bad dates", () => {
    expect(validateBookingInput({ ...valid, departDate: "16/08/2026" })).toContain("Depart date must be YYYY-MM-DD");
  });
  it("rejects passengers 0 / 15 / non-integer", () => {
    expect(validateBookingInput({ ...valid, passengers: 0 })).toContain("Passengers must be a whole number between 1 and 9");
    expect(validateBookingInput({ ...valid, passengers: 15 })).toContain("Passengers must be a whole number between 1 and 9");
    expect(validateBookingInput({ ...valid, travelers: 2.5 })).toContain("Passengers must be a whole number between 1 and 9");
  });
  it("accepts passengers 9 and rejects negative amount", () => {
    expect(validateBookingInput({ ...valid, passengers: 9 })).toEqual([]);
    expect(validateBookingInput({ ...valid, amount: -5 })).toContain("Amount must be a non-negative number");
  });
});
