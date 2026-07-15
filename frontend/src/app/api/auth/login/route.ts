import { NextRequest, NextResponse } from "next/server";

// In production, set these in Vercel environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@a9global.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "a9admin2026";

// Create a simple JWT-like token (base64 payload)
function createToken(user: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
  const payload = Buffer.from(JSON.stringify({
    ...user,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
  })).toString("base64");
  const secret = ADMIN_PASSWORD.slice(0, 16);
  const signature = Buffer.from(`${header}.${payload}.${secret}`).toString("base64");
  return `${header}.${payload}.${signature}`;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Simple credential check
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = {
      id: "admin-001",
      email: ADMIN_EMAIL,
      name: "A9 Admin",
      role: "admin",
    };

    const token = createToken(user);

    return NextResponse.json({
      success: true,
      token,
      user,
    });
  } catch {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
