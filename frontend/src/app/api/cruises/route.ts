import { NextResponse } from "next/server";
import { getAll } from "@/lib/persistentStore";

export async function GET() {
  try {
    const items = getAll("cruises");
    return NextResponse.json({ success: true, data: items });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}