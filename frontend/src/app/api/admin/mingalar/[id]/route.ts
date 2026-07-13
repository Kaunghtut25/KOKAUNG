import { NextRequest, NextResponse } from "next/server";
import { getById, update, delete_ } from "@/lib/persistentStore";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try { const item = await await getById("mingalar", params.id); if (!item) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 }); return NextResponse.json({ success: true, data: item }); }
  catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try { const data = await req.json(); const item = await await update("mingalar", params.id, data); return NextResponse.json({ success: true, data: item }); }
  catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try { await await delete_("mingalar", params.id); return NextResponse.json({ success: true }); }
  catch (err: any) { return NextResponse.json({ success: false, message: err.message }, { status: 500 }); }
}