import { NextRequest, NextResponse } from "next/server";
import { create, getAll, update, delete_ } from "@/lib/persistentStore";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const visas = await getAll("visas");
    return NextResponse.json(visas);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });
    const updated = await update("visas", id, body);
    if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const visa = await create("visas", body);
    return NextResponse.json(visa, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const id = segments[segments.length - 1];
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });
    const ok = await delete_("visas", id);
    if (!ok) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
