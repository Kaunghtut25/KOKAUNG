import { NextResponse } from "next/server";
import { getAll } from "@/lib/persistentStore";

export const dynamic = 'force-dynamic';

function parseImages(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    const out: string[] = [];
    for (const item of raw) {
      if (typeof item === 'string' && item.trim().startsWith('[')) {
        try { const parsed = JSON.parse(item); if (Array.isArray(parsed)) { out.push(...parsed.filter((x: unknown) => typeof x === 'string' && x.trim())); continue; } } catch {}
      }
      if (typeof item === 'string' && item.trim()) out.push(item.trim());
    }
    return out;
  }
  if (typeof raw === 'string' && raw.trim()) {
    const s = raw.trim();
    if (s.startsWith('[')) {
      try { const parsed = JSON.parse(s); if (Array.isArray(parsed)) return parsed.filter((x: unknown) => typeof x === 'string' && x.trim()); } catch {}
    }
    return [s];
  }
  return [];
}

const CRUISE_FALLBACKS: Record<string, string> = {
  cr1: "/images_v2/hero-cruises-v2.jpg",
};

export async function GET() {
  try {
    const items = await getAll("cruises") as any[];
    const data = items.map((c: any) => {
      const cid = (c.id || c._id || '') as string;
      let images = parseImages(c.images);
      if (images.length === 0 && c.image) images = [c.image];
      if (images.length === 0) images = [CRUISE_FALLBACKS[cid] || "/images_v2/hero-cruises-v2.jpg"];
      return {
        ...c,
        _id: cid,
        images,
        image: images[0],
      };
    });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
