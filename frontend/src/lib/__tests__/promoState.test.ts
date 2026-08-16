import { describe, it, expect } from "vitest";
import { computePromoStatus, computeCountdown } from "../promoState";

const FUTURE = "2026-12-31T23:59:59Z";
const PAST = "2020-01-01T00:00:00Z";

describe("computePromoStatus", () => {
  it("active when endAt is in the future", () => {
    expect(computePromoStatus(FUTURE, undefined, Date.parse("2026-08-16T00:00:00Z"))).toBe("active");
  });
  it("expired when now is past endAt", () => {
    expect(computePromoStatus(PAST, undefined, Date.parse("2026-08-16T00:00:00Z"))).toBe("expired");
  });
  it("upcoming when startAt is in the future", () => {
    expect(computePromoStatus(FUTURE, "2026-09-01T00:00:00Z", Date.parse("2026-08-16T00:00:00Z"))).toBe("upcoming");
  });
  it("disabled when endAt missing", () => {
    expect(computePromoStatus(undefined, undefined, Date.now())).toBe("disabled");
    expect(computePromoStatus("", undefined, Date.now())).toBe("disabled");
  });
  it("disabled on invalid dates", () => {
    expect(computePromoStatus("not-a-date", undefined, Date.now())).toBe("disabled");
    expect(computePromoStatus("2026-13-99", undefined, Date.now())).toBe("disabled");
  });
  it("timezone: ISO Z vs offset both parse", () => {
    expect(computePromoStatus("2026-12-31T23:59:59+06:30", undefined, Date.parse("2026-08-16T00:00:00Z"))).toBe("active");
  });
  it("expires exactly at endAt boundary", () => {
    expect(computePromoStatus(FUTURE, undefined, Date.parse(FUTURE))).toBe("expired");
  });
});

describe("computeCountdown", () => {
  it("returns d/h/m/s while future", () => {
    const cd = computeCountdown(Date.now() + 90061000, Date.now()); // 1d 1h 1m 1s
    expect(cd).toEqual({ d: 1, h: 1, m: 1, s: 1 });
  });
  it("null when expired", () => {
    expect(computeCountdown(Date.now() - 1000, Date.now())).toBeNull();
  });
});
