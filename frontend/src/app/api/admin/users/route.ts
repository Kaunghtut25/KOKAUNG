import { NextRequest, NextResponse } from "next/server";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const ADMIN_ROLES = ["admin", "staff", "editor", "viewer"] as const;
export const ALL_AUTHORITIES = [
  "tours", "hotels", "cars", "cruises", "visas", "insurances",
  "bookings", "users", "settings", "blog", "destinations", "sky-lounge",
] as const;

// ── scrypt password hashing (same scheme as auth/register) ──
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return salt + ":" + hash;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = String(stored || "").split(":");
    if (!salt || !hash) return false;
    const test = scryptSync(password, salt, 64);
    return timingSafeEqual(test, Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

function safeUser(u: any) {
  if (!u) return u;
  const { passwordHash, ...rest } = u;
  return rest;
}

function normalizeRole(role: unknown): string {
  return (ADMIN_ROLES as readonly string[]).includes(String(role)) ? String(role) : "admin";
}

function normalizeAuthorities(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return (raw as string[]).filter((x) => (ALL_AUTHORITIES as readonly string[]).includes(x));
}

// GET /api/admin/users — list all users (no password hashes); primary admin first
export async function GET() {
  try {
    const store = await import("@/lib/persistentStore");
    const users = (await store.getAll("users" as any)) || [];

    // Primary admin: env-configured account, overridable via stored admin-001 record
    const primary = users.find((u: any) => u.id === "admin-001" || u._id === "admin-001");
    const primaryRow = {
      id: "admin-001",
      name: primary?.name || "Primary Admin",
      email: primary?.email || process.env.ADMIN_EMAIL || "",
      role: "admin",
      authorities: normalizeAuthorities(primary?.authorities),
      isPrimary: true,
      createdAt: primary?.createdAt,
    };

    const others = users
      .filter((u: any) => !(u.id === "admin-001" || u._id === "admin-001"))
      .map(safeUser);

    return NextResponse.json([primaryRow, ...others]);
  } catch (err) {
    console.error("[admin/users] GET error:", err);
    return NextResponse.json({ success: false, message: "Failed to load users" }, { status: 500 });
  }
}

// POST /api/admin/users — create a new admin/staff user with authorities
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const role = normalizeRole(body.role);
    const authorities = normalizeAuthorities(body.authorities);

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Name, email, and password are required" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid email address" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
    }

    const store = await import("@/lib/persistentStore");
    const users = (await store.getAll("users" as any)) || [];
    if (users.find((u: any) => String(u.email || "").toLowerCase() === email)) {
      return NextResponse.json({ success: false, message: "A user with this email already exists" }, { status: 409 });
    }

    const user = await store.create("users" as any, {
      name,
      email,
      passwordHash: hashPassword(password),
      role,
      authorities,
      status: "active",
    });
    return NextResponse.json({ success: true, user: safeUser(user) }, { status: 201 });
  } catch (err) {
    console.error("[admin/users] POST error:", err);
    return NextResponse.json({ success: false, message: "Failed to create user" }, { status: 500 });
  }
}

// PUT /api/admin/users?id=xxx — update name/email/role/authorities/optional password
export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Missing user id" }, { status: 400 });
    }
    const body = await request.json();
    const store = await import("@/lib/persistentStore");
    const users = (await store.getAll("users" as any)) || [];

    const isPrimary = id === "admin-001";
    const existing = users.find((u: any) => u.id === id || u._id === id);
    if (!existing && !isPrimary) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const email = body.email !== undefined ? String(body.email).trim().toLowerCase() : undefined;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid email address" }, { status: 400 });
    }
    if (email) {
      const clash = users.find(
        (u: any) => (u.id !== id && u._id !== id) && String(u.email || "").toLowerCase() === email
      );
      if (clash) {
        return NextResponse.json({ success: false, message: "A user with this email already exists" }, { status: 409 });
      }
    }

    const updates: any = {};
    if (body.name !== undefined) updates.name = String(body.name).trim();
    if (email) updates.email = email;
    if (body.role !== undefined) updates.role = normalizeRole(body.role);
    if (body.authorities !== undefined) updates.authorities = normalizeAuthorities(body.authorities);
    if (body.password && String(body.password).length >= 6) {
      updates.passwordHash = hashPassword(String(body.password));
    } else if (body.password !== undefined && String(body.password).length > 0 && String(body.password).length < 6) {
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Primary admin: creating the override for the first time requires a password
    if (isPrimary && !existing && !updates.passwordHash) {
      return NextResponse.json(
        { success: false, message: "Enter a new password to set up the primary admin credentials." },
        { status: 400 }
      );
    }

    let saved;
    if (isPrimary && !existing) {
      saved = await store.create("users" as any, {
        id: "admin-001",
        name: updates.name || "Primary Admin",
        email: updates.email || process.env.ADMIN_EMAIL || "",
        passwordHash: updates.passwordHash,
        role: "admin",
        authorities: updates.authorities || [],
        isPrimary: true,
        status: "active",
      });
    } else {
      saved = await store.update("users" as any, existing ? existing.id || existing._id : id, updates);
    }

    return NextResponse.json({ success: true, user: safeUser(saved) });
  } catch (err) {
    console.error("[admin/users] PUT error:", err);
    return NextResponse.json({ success: false, message: "Failed to update user" }, { status: 500 });
  }
}

// DELETE /api/admin/users?id=xxx — remove a user (primary admin cannot be deleted)
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Missing user id" }, { status: 400 });
    }
    if (id === "admin-001") {
      return NextResponse.json({ success: false, message: "The primary admin cannot be deleted" }, { status: 400 });
    }
    const store = await import("@/lib/persistentStore");
    await store.delete_("users" as any, id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/users] DELETE error:", err);
    return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 });
  }
}
