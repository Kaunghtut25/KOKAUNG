import { NextRequest, NextResponse } from "next/server";
import { isAdminToken, verifyToken, roleRank } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin pages
  if (pathname.startsWith("/admin") && !pathname.startsWith("/api/")) {
    const auth = request.cookies.get("a9_admin_token");
    const header = request.headers.get("authorization");

    let token: string | undefined;
    if (auth?.value) {
      token = auth.value;
    } else if (header?.startsWith("Bearer ")) {
      token = header.slice(7);
    }

    if (!(await isAdminToken(token))) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /api/admin/* routes — EXCEPT public GET on site-config and settings
  if (pathname.startsWith("/api/admin/")) {
    // Allow public GET on site-config and settings (needed for Footer, Navbar, Contact, etc.)
    // FIX: 2026-08-04 removed /api/admin/seed from public GET whitelist (was leaking catalog data)
    const isPublicRead = request.method === "GET" && (
      pathname === "/api/admin/site-config" ||
      pathname === "/api/admin/settings"
    );

    if (!isPublicRead) {
      const header = request.headers.get("authorization");
      const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

      if (!(await isAdminToken(token))) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      // Role-gated writes: viewer read-only; users/settings admin-only;
      // site-config + bookings staff+; all other content editor+
      if (request.method !== "GET") {
        const payload = await verifyToken(token);
        const rank = roleRank(payload?.role);
        if (rank < 1) {
          return NextResponse.json({ message: "Read-only role: writes not allowed" }, { status: 403 });
        }
        if ((pathname === "/api/admin/users" || pathname === "/api/admin/settings") && rank < 3) {
          return NextResponse.json({ message: "Admin role required for this action" }, { status: 403 });
        }
        if (
          (pathname === "/api/admin/site-config" || pathname.startsWith("/api/admin/bookings")) &&
          rank < 2
        ) {
          return NextResponse.json({ message: "Staff role or higher required for this action" }, { status: 403 });
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
