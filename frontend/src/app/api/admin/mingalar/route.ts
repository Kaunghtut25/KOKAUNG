import { NextRequest, NextResponse } from "next/server";
import { getAll, create } from "@/lib/persistentStore";

export async function GET() {
  try { return NextResponse.json({ success: true, data: await await await getAll("mingalar") }); }
  catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try { const data = await req.json(); const item = await await create("mingalar", data); return NextResponse.json({ success: true, data: item }); }
  catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}