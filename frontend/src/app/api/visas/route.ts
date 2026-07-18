import { NextRequest, NextResponse } from "next/server";
import { getAll } from "@/lib/persistentStore";

export const dynamic = 'force-dynamic';

const fallbackImages: Record<string, string> = {
  v1: "/images_v2/visa1-v2.jpg",
  v2: "/images_v2/visa2-v2.jpg",
  v3: "/images_v2/visa3-v2.jpg",
  v4: "/images_v2/visa4-v2.jpg",
  v5: "/images_v2/visa5-v2.jpg",
  v6: "/images_v2/visa6-v2.jpg",
  v7: "/images_v2/visa5-v2.jpg",
  v8: "/images_v2/visa1-v2.jpg",
  v9: "/images_v2/visa2-v2.jpg",
  v10: "/images_v2/visa4-v2.jpg",
  v11: "/images_v2/visa1-v2.jpg",
  v12: "/images_v2/visa2-v2.jpg",
  v13: "/images_v2/visa3-v2.jpg",
  v14: "/images_v2/visa6-v2.jpg",
  v15: "/images_v2/visa1-v2.jpg",
};

export async function GET() {
  try {
    const visas = await getAll("visas") as any[];
    const data = visas.map((v: any) => {
      const vid = (v.id || v._id || '') as string;
      return {
        ...v,
        _id: vid,
        image: v.image || fallbackImages[vid] || "/images_v2/visa1-v2.jpg",
      };
    });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}
