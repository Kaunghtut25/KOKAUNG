import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const IMAGE_DIR = path.join(process.cwd(), 'public', 'images_v2');

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (!file || file.includes('..') || file.includes('/')) {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }

  const filePath = path.join(IMAGE_DIR, file);

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const buf = await readFile(filePath);
    const ext = path.extname(file).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
    };

    return new NextResponse(buf, {
      headers: {
        'Content-Type': mimeTypes[ext] || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Content-Disposition': `inline; filename="${file}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Read error' }, { status: 500 });
  }
}
