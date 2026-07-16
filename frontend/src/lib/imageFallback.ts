/**
 * getImageFallback — single source for card images
 * Every card component MUST use this. Never returns empty.
 */
const FALLBACK_MAP: Record<string, string> = {
  // Hotels
  h1: "/images_v2/hotel1-v3.jpg", h2: "/images_v2/hotel2-v3.jpg",
  h3: "/images_v2/hotel3-v3.jpg", h4: "/images_v2/hotel4-v3.jpg",
  h5: "/images_v2/hotel5-v3.jpg",
  // Cars
  c1: "/images_v2/car1-v2.jpg", c2: "/images_v2/car2-v2.jpg",
  c3: "/images_v2/car3-v2.jpg", c4: "/images_v2/car4-v2.jpg",
  c5: "/images_v2/car5-v2.jpg", c6: "/images_v2/car6-v2.jpg",
  // Visas
  v1: "/images_v2/visa1-v3.jpg", v2: "/images_v2/visa2-v3.jpg",
  v3: "/images_v2/visa3-v3.jpg", v4: "/images_v2/visa4-v3.jpg",
  v5: "/images_v2/visa5-v3.jpg", v6: "/images_v2/visa6-v3.jpg",
  // Insurance
  i1: "/images_v2/ins1-v3.jpg", i2: "/images_v2/ins2-v3.jpg",
  i3: "/images_v2/ins3-v3.jpg", i4: "/images_v2/ins4-v3.jpg",
  // Sky Lounge
  m1: "/images_v2/sky1-v3.jpg", m2: "/images_v2/sky2-v3.jpg",
  m3: "/images_v2/sky3-v3.jpg",
  // Blog
  b1: "/images_v2/blog1-v2.jpg", b2: "/images_v2/blog2-v2.jpg",
  b3: "/images_v2/blog3-v2.jpg", b4: "/images_v2/blog4-v2.jpg",
};

const UNIVERAL_FALLBACK = "/images_v2/unsplash-2-v2.jpg";

export function getImageFallback(
  id: string | undefined,
  images: string | string[] | undefined,
  imageField?: string,
): string {
  // 1) From images array — could contain JSON string elements
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === 'string') {
      const s = first.trim();
      if (s.startsWith('[')) {
        try { const parsed = JSON.parse(s); if (Array.isArray(parsed) && parsed.length > 0) return parsed[0]; } catch {}
      }
      if (s) return s;
    }
    return first as string;
  }
  // 2) From string images — could be JSON array string or single URL
  if (typeof images === "string" && images.trim()) {
    const s = images.trim();
    if (s.startsWith("[")) {
      try { const parsed = JSON.parse(s); if (Array.isArray(parsed) && parsed.length > 0) return parsed[0]; } catch {}
    }
    return s;
  }
  // 3) From single image field
  if (imageField && imageField.trim()) return imageField.trim();
  // 4) From ID-based fallback map
  if (id && FALLBACK_MAP[id]) return FALLBACK_MAP[id];
  // 5) Universal fallback
  return UNIVERAL_FALLBACK;
}
