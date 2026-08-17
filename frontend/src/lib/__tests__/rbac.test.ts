import { describe, it, expect } from "vitest";
import {
  roleRank,
  sectionsForPath,
  hasSectionAccess,
  decodeTokenPayload,
  ROLE_RANK,
  ALL_AUTHORITIES,
  ADMIN_ROLES,
} from "../auth";

function b64url(o: unknown): string {
  return Buffer.from(JSON.stringify(o), "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

describe("roleRank", () => {
  it("maps roles to expected ranks", () => {
    expect(roleRank("viewer")).toBe(0);
    expect(roleRank("editor")).toBe(1);
    expect(roleRank("staff")).toBe(2);
    expect(roleRank("admin")).toBe(3);
  });
  it("returns -1 for unknown, missing, and empty roles", () => {
    expect(roleRank("superuser")).toBe(-1);
    expect(roleRank(undefined)).toBe(-1);
    expect(roleRank("")).toBe(-1);
  });
  it("ROLE_RANK and ADMIN_ROLES agree", () => {
    for (const r of ADMIN_ROLES) expect(ROLE_RANK[r]).toBeGreaterThanOrEqual(0);
  });
});

describe("sectionsForPath", () => {
  it("maps admin pages to their section authorities", () => {
    expect(sectionsForPath("/admin/dashboard")).toEqual([]);
    expect(sectionsForPath("/admin/about")).toEqual(["about"]);
    expect(sectionsForPath("/admin/site-manager")).toEqual(["site-manager"]);
    expect(sectionsForPath("/admin/tours")).toEqual(["tours"]);
    expect(sectionsForPath("/admin/insurance")).toEqual(["insurances"]);
    expect(sectionsForPath("/admin/sky-lounge")).toEqual(["sky-lounge"]);
    expect(sectionsForPath("/admin/users")).toEqual(["users"]);
    expect(sectionsForPath("/admin/settings")).toEqual(["settings"]);
  });
  it("maps /api/admin/* routes to their section authorities", () => {
    expect(sectionsForPath("/api/admin/tours")).toEqual(["tours"]);
    expect(sectionsForPath("/api/admin/mingalar")).toEqual(["sky-lounge"]);
    expect(sectionsForPath("/api/admin/chat-config")).toEqual(["settings"]);
    expect(sectionsForPath("/api/admin/site-config")).toEqual(["site-manager", "about"]);
    expect(sectionsForPath("/api/admin/insurances")).toEqual(["insurances"]);
  });
  it("handles sub-paths and query strings", () => {
    expect(sectionsForPath("/admin/tours/new")).toEqual(["tours"]);
    expect(sectionsForPath("/admin/tours?sort=name")).toEqual(["tours"]);
    expect(sectionsForPath("/api/admin/tours/abc")).toEqual(["tours"]);
  });
  it("returns [] for unknown paths", () => {
    expect(sectionsForPath("/admin/nonexistent")).toEqual([]);
    expect(sectionsForPath("/api/admin/nope")).toEqual([]);
    expect(sectionsForPath("/something-else")).toEqual([]);
  });
});

describe("hasSectionAccess", () => {
  const admin = { role: "admin", authorities: [] as string[] };
  const staff = { role: "staff", authorities: ["tours"] as string[] };
  const editor = { role: "editor", authorities: ["hotels"] as string[] };
  const editorNoAuth = { role: "editor", authorities: [] as string[] };
  const viewer = { role: "viewer", authorities: ["blog"] as string[] };

  it("allows null payload and empty required list", () => {
    expect(hasSectionAccess(null, [])).toBe(true);
    expect(hasSectionAccess(null, ["tours"])).toBe(true);
    expect(hasSectionAccess(editor, [])).toBe(true);
  });
  it("lets admin (rank >= 3) access everything implicitly", () => {
    expect(hasSectionAccess(admin, ["tours"])).toBe(true);
    expect(hasSectionAccess(admin, ["site-manager", "about"])).toBe(true);
    expect(hasSectionAccess(admin, [])).toBe(true);
  });
  it("grants access when any authority matches a required section", () => {
    expect(hasSectionAccess(staff, ["tours"])).toBe(true);
    expect(hasSectionAccess(staff, ["tours", "hotels"])).toBe(true);
  });
  it("denies access when no authority matches", () => {
    expect(hasSectionAccess(editor, ["tours"])).toBe(false);
    expect(hasSectionAccess(viewer, ["tours"])).toBe(false);
  });
  it("treats empty authorities as full access (fallback)", () => {
    expect(hasSectionAccess(editorNoAuth, ["tours"])).toBe(true);
    expect(hasSectionAccess(editorNoAuth, ["site-manager"])).toBe(true);
  });
});

describe("decodeTokenPayload", () => {
  it("decodes a base64url payload", () => {
    const payload = { id: "u1", email: "a@b.com", role: "editor", authorities: ["tours"] };
    const token = b64url(payload) + ".somesignature";
    expect(decodeTokenPayload(token)).toEqual(payload);
  });
  it("returns null for malformed tokens", () => {
    expect(decodeTokenPayload("")).toBe(null);
    expect(decodeTokenPayload("not-a-jwt")).toBe(null);
    expect(decodeTokenPayload("noDots")).toBe(null);
  });
});

describe("authority constants", () => {
  it("ADMIN_ROLES is the four panel roles", () => {
    expect(ADMIN_ROLES).toEqual(["admin", "staff", "editor", "viewer"]);
  });
  it("ALL_AUTHORITIES has the 15 grantable sections", () => {
    expect(ALL_AUTHORITIES).toEqual([
      "tours", "hotels", "cars", "cruises", "visas", "insurances",
      "bookings", "users", "settings", "blog", "destinations", "sky-lounge",
      "about", "site-manager", "knowledge",
    ]);
  });
});
