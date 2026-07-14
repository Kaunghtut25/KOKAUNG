import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "a9admin2026";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (exclude /api/admin — that's for public booking)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    const auth = request.cookies.get("a9_auth");

    if (auth?.value !== ADMIN_PASSWORD) {
      // Not authenticated — redirect to login
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};