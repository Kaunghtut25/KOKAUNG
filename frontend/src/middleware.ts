import { NextRequest, NextResponse } from "next/server";

function isAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    // Edge runtime doesn't have Buffer — use atob
    const binary = atob(token);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const jsonStr = new TextDecoder("utf-8").decode(bytes);
    const decoded = JSON.parse(jsonStr);
    return decoded.role === "admin" && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
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

    if (!isAdminToken(token)) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /api/admin/* routes — EXCEPT public GET on site-config and settings
  if (pathname.startsWith("/api/admin/")) {
    // Allow public GET on site-config and settings (needed for Footer, Navbar, Contact, etc.)
    const isPublicRead = request.method === "GET" && (
      pathname === "/api/admin/site-config" ||
      pathname === "/api/admin/settings"
    );

    if (!isPublicRead) {
      const header = request.headers.get("authorization");
      const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

      if (!isAdminToken(token)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
