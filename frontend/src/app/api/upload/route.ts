import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ message: "File too large (max 10MB)" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ message: "Unsupported file type. Use JPG, PNG, WebP, or GIF" }, { status: 400 });
    }

    // Upload to ImgBB (free, no account needed for basic use)
    // Or use Cloudinary if env vars are set
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      // Cloudinary unsigned upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

      const formData2 = new FormData();
      formData2.append("file", base64);
      formData2.append("upload_preset", "a9-global-unsigned");
      formData2.append("folder", "a9-global");

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData2 }
      );
      const cloudData = await cloudRes.json();

      if (cloudData.secure_url) {
        return NextResponse.json({
          success: true,
          url: cloudData.secure_url,
          publicId: cloudData.public_id,
          width: cloudData.width,
          height: cloudData.height,
        });
      }
    }

    // Fallback: base64 data URL (works but large, stored in Upstash Redis)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    return NextResponse.json({
      success: true,
      url: base64,
      publicId: `local_${Date.now()}`,
      fallback: true,
      message: "Stored as base64 — configure Cloudinary for permanent URLs",
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { message: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
