import { NextRequest, NextResponse } from "next/server";
import { getAll, create, updateById, deleteById } from "@/lib/persistentStore";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const items = getAll('tours') as any[];
    const item = items.find((i: any) => i._id === params.id || i.id === params.id);
    if (!item) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    updateById('tours', params.id, body);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    deleteById('tours', params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}