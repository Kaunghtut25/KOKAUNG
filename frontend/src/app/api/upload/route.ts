export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";

function getRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const { Redis } = require("@upstash/redis");
    return new Redis({ url, token });
  } catch { return null; }
}

const UPLOADS_KEY = "***";
const NAME_INDEX_KEY = "***"; // filename → upload_id

// In-memory fallback
let memoryUploads: any[] = [];
let memoryNameIndex: Record<string, string> = {};

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

async function getNameIndex(): Promise<Record<string, string>> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const raw = await redis.get(NAME_INDEX_KEY);
      if (raw) return raw as Record<string, string>;
    } catch {}
  }
  return memoryNameIndex;
}

async function saveUploads(data: any[]) {
  memoryUploads = data;
  const redis = getRedisClient();
  if (redis) {
    try { await redis.set(UPLOADS_KEY, data); } catch {}
  }
}

async function saveNameIndex(idx: Record<string, string>) {
  memoryNameIndex = idx;
  const redis = getRedisClient();
  if (redis) {
    try { await redis.set(NAME_INDEX_KEY, idx); } catch {}
  }
}

// POST /api/upload — upload image(s)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const uploads = await getAllUploads();
    const nameIndex = await getNameIndex();
    const results: any[] = [];

    for (const [, value] of formData.entries()) {
      if (value instanceof File) {
        const buffer = Buffer.from(await value.arrayBuffer());
        const base64 = buffer.toString("base64");
        const mimeType = value.type || "image/jpeg";
        const id = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        // Replace existing entry with same name
        const existingIdx = uploads.findIndex((u: any) => u.name === value.name);
        if (existingIdx >= 0) {
          uploads[existingIdx] = { ...uploads[existingIdx], base64, size: buffer.length, mimeType, updatedAt: new Date().toISOString() };
        } else {
          uploads.push({ id, name: value.name, mimeType, base64, size: buffer.length, createdAt: new Date().toISOString() });
        }
        nameIndex[value.name] = existingIdx >= 0 ? uploads[existingIdx].id : id;
        results.push({ id: existingIdx >= 0 ? uploads[existingIdx].id : id, name: value.name, size: buffer.length });
      }
    }

    await saveUploads(uploads);
    await saveNameIndex(nameIndex);
    return NextResponse.json({ success: true, uploads: results, total: uploads.length });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// GET /api/upload?id=xxx OR /api/upload?name=hero-bagan.jpg
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const name = request.nextUrl.searchParams.get("name");

  // List all uploads (without base64)
  if (!id && !name) {
    const uploads = await getAllUploads();
    const list = uploads.map(({ base64, ...rest }: any) => rest);
    return NextResponse.json({ uploads: list });
  }

  // Lookup by name
  let resolvedId = id;
  if (name && !id) {
    const nameIndex = await getNameIndex();
    resolvedId = nameIndex[name];
  }

  if (!resolvedId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const uploads = await getAllUploads();
  const found = uploads.find((u: any) => u.id === resolvedId);
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
