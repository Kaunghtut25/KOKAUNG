import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/persistentStore";
import { verifyToken, roleRank } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/audit-log — admin-only (rank >= 3). Returns the 200 most recent entries.
export async function GET(req: NextRequest) {
  try {
    const header = req.headers.get("authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
    const payload = await verifyToken(token);
    if (!payload || roleRank(payload?.role) < 3) {
      return NextResponse.json({ message: "Admin role required" }, { status: 403 });
    }
    const items = (await getAll("audit-log")) || [];
    const sorted = [...items].sort((a: any, b: any) =>
      String(b.at || "").localeCompare(String(a.at || ""))
    );
    return NextResponse.json(sorted.slice(0, 200));
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || "Server error" }, { status: 500 });
  }
}
