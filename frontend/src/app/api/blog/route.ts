import { NextResponse } from "next/server";
import { getAll } from "@/lib/persistentStore";

export async function GET() {
  try {
    const posts = getAll("blog");
    return NextResponse.json({ success: true, data: posts });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}