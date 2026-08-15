import { NextRequest, NextResponse } from "next/server";
import { create, getAll, update, delete_ } from "@/lib/persistentStore";

// FIX 2026-08-16: publish validation — a tour must have a price or be Quote Required; prices must be non-negative numbers.
function validateTour(body: any, partial = false): string[] {
  const errors: string[] = [];
  const mmk = body?.priceMMK, usd = body?.priceUSD;
  if (mmk !== undefined && mmk !== null && mmk !== '') {
    const n = Number(mmk);
    if (!Number.isFinite(n) || n < 0) errors.push('priceMMK must be a non-negative number');
  }
  if (usd !== undefined && usd !== null && usd !== '') {
    const n = Number(usd);
    if (!Number.isFinite(n) || n < 0) errors.push('priceUSD must be a non-negative number');
  }
  if (!partial || body?.title !== undefined) {
    if (!body?.title || !String(body.title).trim()) errors.push('Title is required');
  }
  const priceFieldsPresent = !partial || 'priceMMK' in (body || {}) || 'priceUSD' in (body || {}) || 'quote_required' in (body || {}) || 'quoteRequired' in (body || {});
  if (priceFieldsPresent) {
    const hasPrice = Number(mmk) > 0 || Number(usd) > 0;
    if (!body?.quote_required && !body?.quoteRequired && !hasPrice) {
      errors.push('A tour needs a price (MMK or USD) or "Quote Required" enabled — cannot save a tour with no price');
    }
  }
  return errors;
}


export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tours = await getAll("tours");
    return NextResponse.json(tours);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const errors = validateTour(body);
    if (errors.length > 0) return NextResponse.json({ message: errors.join('; ') }, { status: 400 });
    const tour = await create("tours", body);
    return NextResponse.json(tour, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });
    const errors = validateTour(body, true);
    if (errors.length > 0) return NextResponse.json({ message: errors.join('; ') }, { status: 400 });
    const updated = await update("tours", id, body);
    if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
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
    const ok = await delete_("tours", id);
    if (!ok) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}