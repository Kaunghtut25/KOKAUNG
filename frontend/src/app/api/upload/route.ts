import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ message: 'File must be an image' }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `a9_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filename, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('[Upload] Supabase error:', error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filename);

    return NextResponse.json({ 
      url: urlData.publicUrl,
      path: data?.path || filename,
    });
  } catch (err: any) {
    console.error('[Upload] Error:', err);
    return NextResponse.json({ message: err.message || 'Upload failed' }, { status: 500 });
  }
}
