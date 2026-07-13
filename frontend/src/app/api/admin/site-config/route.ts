import { NextRequest, NextResponse } from "next/server";

// Simple in-memory store (resets on cold start — use KV in production)
let config: any = null;

export async function GET() {
  try {
    return NextResponse.json(config || {});
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    config = body;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON" }, { status: 400 });
  }
}