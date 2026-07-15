import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Use env var with fallback — env var name is ADMIN_PASSWORD
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@a9global.com";
const PASS = process.env.ADMIN_PASSWORD || "a9admin2026";

function makeToken(user: Record<string, unknown>): string {
  const payload = JSON.stringify({
    ...user,
    iat: Date.now(),
    exp: Date.now() + 86400000,
  });
  return Buffer.from(payload).toString("base64");
}

export async function POST(request: NextRequest) {
  try {
    const text = await request.text();
    let body: any;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }

    const email = body.email;
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    if (email !== ADMIN_EMAIL || password !== PASS) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const user = {
      id: "admin-001",
      email: ADMIN_EMAIL,
      name: "A9 Admin",
      role: "admin",
    };

    const token = makeToken(user);

    return NextResponse.json({ success: true, token, user });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
