import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// FIX 2026-08-17: public self-registration is closed.
// Accounts are created by admins only, via /admin/users (POST /api/admin/users).
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { success: false, message: "Registration is closed. Please contact A9 Global to create an account." },
    { status: 403 }
  );
}
