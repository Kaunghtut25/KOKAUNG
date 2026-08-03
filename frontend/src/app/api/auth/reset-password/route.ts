import { NextRequest, NextResponse } from "next/server";
import { randomBytes, scryptSync } from "crypto";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return salt + ":" + hash;
}

/**
 * POST /api/auth/reset-password  { token, password }
 * Consumes the one-time reset token, then updates the stored user's password hash
 * (admin-001 override or any stored user). If the email is the env primary admin
 * and no stored override exists yet, creates the admin-001 override so the new
 * password takes effect.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const token = String(body.token || "");
    const password = String(body.password || "");

    if (!token) {
      return NextResponse.json({ success: false, message: "Reset token missing. Start over." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters." }, { status: 400 });
    }

    // Verify signature + purpose + expiry
    const payload = await verifyToken(token);
    if (!payload || payload.purpose !== "password-reset" || !payload.email) {
      return NextResponse.json({ success: false, message: "Invalid or expired reset link. Start over." }, { status: 400 });
    }
    const email = String(payload.email).toLowerCase();

    // Single-use: consume the reset token (must exist in the registry)
    const { consumeResetToken } = await import("@/lib/passwordReset");
    const consumed = await consumeResetToken(token);
    if (!consumed) {
      return NextResponse.json({ success: false, message: "This reset link was already used. Request a new one." }, { status: 400 });
    }

    const passwordHash = hashPassword(password);
    const store = await import("@/lib/persistentStore");
    const users = (await store.getAll("users" as any)) || [];
    const found = users.find((u: any) => String(u.email || "").toLowerCase() === email);
    const isPrimaryEnv = email === String(process.env.ADMIN_EMAIL || "").toLowerCase();

    if (found) {
      // Update existing stored user (admin-001 override or staff/editor/viewer)
      const id = found.id || found._id;
      const updated = await store.update("users" as any, id, { passwordHash });
      if (!updated) {
        return NextResponse.json({ success: false, message: "Failed to update password. Try again." }, { status: 500 });
      }
      console.log(`[reset-password] password updated for ${email}`);
    } else if (isPrimaryEnv) {
      // Env primary admin without stored record: create the admin-001 override.
      // From now on the stored record owns the account (env fallback disabled in login).
      const created = await store.create("users" as any, {
        id: "admin-001",
        name: "Primary Admin",
        email,
        passwordHash,
        role: "admin",
        authorities: [],
        isPrimary: true,
        status: "active",
      });
      if (!created) {
        return NextResponse.json({ success: false, message: "Failed to update password. Try again." }, { status: 500 });
      }
      console.log(`[reset-password] created admin-001 override for ${email}`);
    } else {
      return NextResponse.json({ success: false, message: "Account not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Password updated. You can now sign in." });
  } catch (err) {
    console.error("[reset-password] error:", err);
    return NextResponse.json({ success: false, message: "Server error. Please try again." }, { status: 500 });
  }
}
