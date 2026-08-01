import { NextRequest, NextResponse } from "next/server";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ── scrypt password hashing (same scheme as auth/register) ──
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return salt + ":" + hash;
}

function safeUser(u: any) {
  if (!u) return u;
  const { passwordHash, ...rest } = u;
  return rest;
}

// GET /api/admin/users — list all users (no password hashes)
export async function GET() {
  try {
    const store = await import("@/lib/persistentStore");
    const users = await store.getAll("users" as any);
    return NextResponse.json((users || []).map(safeUser));
  } catch (err) {
    console.error("[admin/users] GET error:", err);
    return NextResponse.json({ success: false, message: "Failed to load users" }, { status: 500 });
  }
}

// POST /api/admin/users — create a new admin user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const role = body.role === "admin" ? "admin" : "admin"; // admin panel users are admins

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
      status: "active",
    });
    return NextResponse.json({ success: true, user: safeUser(user) }, { status: 201 });
  } catch (err) {
    console.error("[admin/users] POST error:", err);
    return NextResponse.json({ success: false, message: "Failed to create user" }, { status: 500 });
  }
}

// DELETE /api/admin/users?id=xxx — remove a user
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Missing user id" }, { status: 400 });
    }
    const store = await import("@/lib/persistentStore");
    await store.delete_("users" as any, id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/users] DELETE error:", err);
    return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 });
  }
}

export { verifyPassword };
function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = String(stored || "").split(":");
    if (!salt || !hash) return false;
    const test = scryptSync(password, salt, 64);
    return timingSafeEqual(test, Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}
