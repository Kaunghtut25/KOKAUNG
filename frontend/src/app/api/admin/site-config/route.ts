import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/persistentStore";

export async function GET() {
  try {
    const cfg = await getAll("site-config" as any);
    return NextResponse.json(cfg?.[0] || {});
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { create } = await import("@/lib/persistentStore");
    await create("site-config" as any, body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON" }, { status: 400 });
  }
}