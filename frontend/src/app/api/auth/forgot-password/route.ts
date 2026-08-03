import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/auth/forgot-password  { email }
 * Validates the account exists (stored user OR env primary admin), issues a 6-digit
 * OTP, and emails it via Resend. Always responds 200-style to avoid user enumeration
 * (even unknown emails get a generic "if an account exists" message).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Enter a valid email address." }, { status: 400 });
    }

    // Resolve the account: stored user (incl. admin-001 override) OR env primary admin
    let account: { email: string; id?: string; name?: string } | null = null;
    try {
      const store = await import("@/lib/persistentStore");
      const users = (await store.getAll("users" as any)) || [];
      const found = users.find((u: any) => String(u.email || "").toLowerCase() === email);
      if (found) {
        account = { email: String(found.email), id: found.id || found._id, name: found.name };
      }
    } catch (err) {
      console.error("[forgot-password] users check failed:", err);
    }
    if (!account && email === String(process.env.ADMIN_EMAIL || "").toLowerCase()) {
      account = { email, id: "admin-001", name: "Primary Admin" };
    }

    // Generic success response regardless — never reveal whether the account exists.
    if (!account) {
      return NextResponse.json({
        success: true,
        message: "If an account exists for that email, a reset code has been sent.",
      });
    }

    // Rate limit: 1 per minute per email, max 5/hour per IP
    const ip = (request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
    const { issueOtp, canSendOtp, recordOtpSend } = await import("@/lib/passwordReset");
    const gate = await canSendOtp(account.email, ip);
    if (!gate.ok) {
      return NextResponse.json({ success: false, message: gate.reason }, { status: 429 });
    }

    const { otp } = await issueOtp(account.email);
    await recordOtpSend(account.email, ip);

    // Send email via Resend (best-effort: if mail fails, still show generic success)
    let emailSent = false;
    try {
      const { sendPasswordResetOtp } = await import("@/lib/email");
      emailSent = await sendPasswordResetOtp(account.email, otp);
    } catch (err) {
      console.error("[forgot-password] email send failed:", (err as any)?.message || err);
    }

    // FIX: 2026-08-04 forgot-password — never return the OTP in the response body.
    console.log(`[forgot-password] OTP issued for ${account.email} (sent=${emailSent})`);
    return NextResponse.json({
      success: true,
      message: emailSent
        ? "Reset code sent. Check your inbox (and spam folder)."
        : "If an account exists for that email, a reset code has been sent.",
    });
  } catch (err) {
    console.error("[forgot-password] error:", err);
    return NextResponse.json({ success: false, message: "Server error. Please try again." }, { status: 500 });
  }
}
