import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/adminStore";

export async function GET() {
  try {
    const posts = getAll("blog") as Record<string, unknown>[];
    const sorted = posts.sort(
      (a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
    );
    return NextResponse.json({ success: true, data: sorted });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
