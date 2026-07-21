export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { put, list, del } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

const INDEX_PATHNAME = 'uploads/index.json';

// -- Helpers --

async function getNameIndex(): Promise<Record<string, BlobEntry>> {
  try {
    const { blobs } = await list({ prefix: INDEX_PATHNAME });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url);
      if (res.ok) return await res.json();
    }
  } catch { /* fall through */ }
  return {};
}

async function saveNameIndex(index: Record<string, BlobEntry>) {
  await put(INDEX_PATHNAME, JSON.stringify(index), {
    access: 'public',
    contentType: 'application/json',
    allowOverwrite: true,
  });
}

interface BlobEntry {
  id: string;
  name: string;
  url: string;
  pathname: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

// -- POST /api/upload -- upload images to Vercel Blob --

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const nameIndex = await getNameIndex();
    const results: UploadResult[] = [];

    for (const [, value] of formData.entries()) {
      if (!(value instanceof File)) continue;

      const buffer = Buffer.from(await value.arrayBuffer());
      const mimeType = value.type || 'image/jpeg';
      const id = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const safeName = value.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const pathname = `uploads/${id}-${safeName}`;

      const blob = await put(pathname, buffer, { 
        addRandomSuffix: true,
        access: 'public',
        contentType: mimeType,
        allowOverwrite: true,
      });

      const entry: BlobEntry = {
        id,
        name: value.name,
        url: blob.url,
        pathname: blob.pathname,
        mimeType,
        size: buffer.length,
        createdAt: new Date().toISOString(),
      };
      nameIndex[id] = entry;

      results.push({ id, name: value.name, url: blob.url, size: buffer.length });
    }

    await saveNameIndex(nameIndex);

    return NextResponse.json({ success: true, uploads: results, total: Object.keys(nameIndex).length });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// -- GET /api/upload?name=... | ?id=... | (no params -> list) --

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name');
  const id = request.nextUrl.searchParams.get('id');

  const nameIndex = await getNameIndex();

  // List all (metadata only, no base64)
  if (!id && !name) {
    const items = Object.values(nameIndex).map(({ url, ...rest }) => rest);
    return NextResponse.json({ uploads: items });
  }

  // Resolve entry by id or name
  let entry: BlobEntry | undefined;
  if (id) {
    entry = Object.values(nameIndex).find((v) => v.id === id);
  } else if (name) {
    entry = Object.values(nameIndex).find((v) => v.name === name);
  }

  if (!entry) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Proxy the blob bytes with correct Content-Type
  try {
    const imageRes = await fetch(entry.url);
    if (!imageRes.ok) throw new Error('Blob fetch failed');
    const buffer = Buffer.from(await imageRes.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': entry.mimeType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Blob not accessible' }, { status: 404 });
  }
}

// -- DELETE /api/upload?url=... | ?name=... --

export async function DELETE(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');
    const name = request.nextUrl.searchParams.get('name');

    if (!url && !name) {
      return NextResponse.json({ success: false, error: 'Provide ?url= or ?name=' }, { status: 400 });
    }

    const nameIndex = await getNameIndex();

    if (url) {
      await del(url);
      for (const [key, entry] of Object.entries(nameIndex)) {
        if (entry.url === url) {
          delete nameIndex[key];
          break;
        }
      }
    } else if (name) {
      const entry = Object.values(nameIndex).find((v) => v.name === name);
      if (!entry) {
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
      }
      await del(entry.url);
      delete nameIndex[entry.id];
    }

    await saveNameIndex(nameIndex);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

interface UploadResult {
  id: string;
  name: string;
  url: string;
  size: number;
}
