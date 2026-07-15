import { NextRequest, NextResponse } from "next/server";

// In production, use environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@a9global.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "A9Admin2024!";

// Create a simple JWT-like token (base64 payload)
function createToken(user: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    ...user,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
  }));
  const secret = ADMIN_PASSWORD.slice(0, 16);
  const signature = btoa(`${header}.${payload}.${secret}`);
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
