export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";

// Upstash Redis-backed image store
// Architecture: file → base64 → store in Redis key "a9:uploads" 
// Serve via /api/upload?id=X to get base64-decoded image

function getRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const { Redis } = require("@upstash/redis");
    return new Redis({ url, token });
  } catch { return null; }
}

const UPLOADS_KEY = "a9:uploads";

// In-memory fallback
let memoryUploads: any[] = [];

async function getAllUploads(): Promise<any[]> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const raw = await redis.get(UPLOADS_KEY);
      if (raw && Array.isArray(raw) && raw.length > 0) return raw;
    } catch {}
  }
  return memoryUploads;
}

async function saveUploads(data: any[]) {
  memoryUploads = data;
  const redis = getRedisClient();
  if (redis) {
    try { await redis.set(UPLOADS_KEY, data); } catch {}
  }
}

// POST /api/upload — upload image(s)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const uploads = await getAllUploads();
    const results: any[] = [];

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const buffer = Buffer.from(await value.arrayBuffer());
        const base64 = buffer.toString("base64");
        const mimeType = value.type || "image/jpeg";
        const id = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const upload = {
          id,
          name: value.name,
          mimeType,
          base64,
          size: buffer.length,
          createdAt: new Date().toISOString(),
        };
        uploads.push(upload);
        results.push({ id, name: value.name, size: buffer.length });
      }
    }

    await saveUploads(uploads);
    return NextResponse.json({ success: true, uploads: results, total: uploads.length });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// GET /api/upload?id=img_xxx — serve image binary
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const uploads = await getAllUploads();

  if (!id) {
    // Return list of all uploads (without base64 data for efficiency)
    const list = uploads.map(({ base64, ...rest }: any) => rest);
    return NextResponse.json({ uploads: list });
  }

  const found = uploads.find((u: any) => u.id === id);
  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = Buffer.from(found.base64, "base64");
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": found.mimeType || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
