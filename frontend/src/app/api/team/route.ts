import { NextRequest, NextResponse } from "next/server";
import { getAll, create, update, delete_ } from "@/lib/persistentStore";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [departments, members] = await Promise.all([
      getAll("team_departments"),
      getAll("team_members")
    ]);
    return NextResponse.json({ departments, members });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { type, ...data } = await req.json();
    if (!type || !['department', 'member'].includes(type)) {
      return NextResponse.json({ message: "type must be 'department' or 'member'" }, { status: 400 });
    }
    const collection = type === 'department' ? "team_departments" : "team_members";
    const item = await create(collection, data);
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");
    if (!id || !type || !['department', 'member'].includes(type)) {
      return NextResponse.json({ message: "Missing id or type ('department'|'member')" }, { status: 400 });
    }
    const data = await req.json();
    const collection = type === 'department' ? "team_departments" : "team_members";
    const item = await update(collection, id, data);
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");
    if (!id || !type || !['department', 'member'].includes(type)) {
      return NextResponse.json({ message: "Missing id or type ('department'|'member')" }, { status: 400 });
    }
    const collection = type === 'department' ? "team_departments" : "team_members";
    const deleted = await delete_(collection, id);
    if (!deleted) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
