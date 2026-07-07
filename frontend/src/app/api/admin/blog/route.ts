import { NextRequest, NextResponse } from "next/server";
import { getAll, getById, create, update, delete_ } from "@/lib/adminStore";

export async function GET() {
  try {
    const posts = getAll("blog");
    return NextResponse.json({ success: true, data: posts });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const post = create("blog", body);
    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
