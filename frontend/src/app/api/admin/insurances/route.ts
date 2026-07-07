import { NextRequest, NextResponse } from "next/server";
import { getAll, create } from "@/lib/adminStore";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const insurances = getAll("insurances");
    return NextResponse.json(insurances);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const insurance = create("insurances", body);
    return NextResponse.json(insurance, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
