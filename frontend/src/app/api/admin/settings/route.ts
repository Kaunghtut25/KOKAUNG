import { NextRequest, NextResponse } from "next/server";

// In-memory settings store
let settingsData: any = null;

export async function GET() {
  return NextResponse.json(settingsData || {});
}

export async function PUT(request: NextRequest) {
  try {
    settingsData = await request.json();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}