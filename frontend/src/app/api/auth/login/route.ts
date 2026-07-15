import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@a9global.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "a9admin2026";

function makeToken(user: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
  const payload = Buffer.from(JSON.stringify({
    ...user,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400,
  })).toString("base64");
  const secret = ADMIN_PASSWORD.slice(0, 16);
  const sig = Buffer.from(header + "." + payload + "." + secret).toString("base64");
  return header + "." + payload + "." + sig;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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

    const token = makeToken(user);

    return NextResponse.json({ success: true, token, user });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}