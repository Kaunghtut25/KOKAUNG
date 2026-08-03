import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/auth/verify-otp  { email, otp }
 * Verifies the OTP (5 attempts max), then issues a SHORT-LIVED one-time reset token
 * (HMAC-signed, purpose=password-reset, 10 min) and registers it in the store so it
 * can be consumed exactly once by /api/auth/reset-password.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const otp = String(body.otp || "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{6}$/.test(otp)) {
      return NextResponse.json({ success: false, message: "Enter the 6-digit code sent to your email." }, { status: 400 });
    }

    const { verifyOtp, storeResetToken } = await import("@/lib/passwordReset");
    const result = await verifyOtp(email, otp);

    if (!result.ok) {
      if (result.reason === "too-many") {
        return NextResponse.json({ success: false, message: "Too many incorrect attempts. Request a new code." }, { status: 429 });
      }
      if (result.reason === "expired") {
        return NextResponse.json({ success: false, message: "This code has expired. Request a new one." }, { status: 400 });
      }
      return NextResponse.json({
        success: false,
        message: `Incorrect code. ${result.attemptsLeft != null ? result.attemptsLeft + " attempts left." : "Try again."}`,
      }, { status: 400 });
    }

    // OTP correct → issue one-time reset token (10 min)
    const resetToken = await signToken({
      purpose: "password-reset",
      email,
      iat: Date.now(),
      exp: Date.now() + 10 * 60 * 1000,
    });
    await storeResetToken(resetToken);

    return NextResponse.json({ success: true, token: resetToken, email });
  } catch (err) {
    console.error("[verify-otp] error:", err);
    return NextResponse.json({ success: false, message: "Server error. Please try again." }, { status: 500 });
  }
}
