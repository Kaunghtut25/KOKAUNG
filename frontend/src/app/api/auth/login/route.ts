import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const ADMIN_EMAIL = "admin@a9global.com";
const ADMIN_PASSWORD = "a9admin2026";

export async function POST(request: NextRequest) {
  try {
    const text = await request.text();
    let body: any;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ message: "Invalid JSON body received: " + text.substring(0, 100) }, { status: 400 });
    }

    const email = body.email;
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const user = {
      id: "admin-001",
      email: ADMIN_EMAIL,
      name: "A9 Admin",
      role: "admin",
    };

    const token = Buffer.from(JSON.stringify({ ...user, exp: Date.now() + 86400000 })).toString("base64");

    return NextResponse.json({ success: true, token, user });
  } catch (err) {
    return NextResponse.json({ message: "Server error: " + String(err) }, { status: 500 });
  }
}
