import { NextResponse } from "next/server";
import { getAll } from "@/lib/persistentStore";

export const dynamic = 'force-dynamic';

// Public endpoint — returns lounge cards for display on the website
export async function GET() {
  try {
    const items = await getAll("mingalar");
    return NextResponse.json({ success: true, data: items });
  } catch (err: any) {
    return NextResponse.json({ success: true, data: [] }, { status: 200 });
  }
}
