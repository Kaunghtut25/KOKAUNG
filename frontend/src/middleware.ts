import { NextRequest, NextResponse } from "next/server";

const PASS = process.env.ADMIN_PASSWORD || "a9admin2026";

function isAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    return decoded.role === "admin" && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin pages (not /api/)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/api/")) {
    const auth = request.cookies.get("a9_admin_token");
    const header = request.headers.get("authorization");

    let token: string | undefined;
    if (auth?.value) {
      token = auth.value;
    } else if (header?.startsWith("Bearer ")) {
      token = header.slice(7);
    }

    if (!isAdminToken(token)) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /api/admin/* routes
  if (pathname.startsWith("/api/admin/")) {
    const header = request.headers.get("authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

    if (!isAdminToken(token)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
