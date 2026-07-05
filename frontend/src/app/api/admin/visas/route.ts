import { NextRequest, NextResponse } from "next/server";
import { getAll, create } from "@/lib/adminStore";

export async function GET() {
  try {
    const visas = getAll("visas");
    return NextResponse.json(visas);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const visa = create("visas", body);
    return NextResponse.json(visa, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
