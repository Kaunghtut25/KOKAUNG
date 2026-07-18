export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getAll, create, delete_ } from "@/lib/persistentStore";

const COLLECTION = "settings" as any;

export async function GET() {
  try {
    const items = await getAll(COLLECTION);
    return NextResponse.json(items?.[0] || {});
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    // Remove old entries
    const items = await getAll(COLLECTION);
    for (const item of items) {
      try { await delete_(COLLECTION, item.id || item._id); } catch {}
    }
    const record = { ...body, id: "settings", updatedAt: new Date().toISOString() };
    await create(COLLECTION, record);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}