/** Image fallback — maps IDs to real v2 images */
const MAP: Record<string, string> = {
  // Tours (all real photos)
  t1:"/images_v2/tour-bagan-v2.jpg", t2:"/images_v2/tour-yangon-v2.jpg", t3:"/images_v2/tour-mandalay-v2.jpg", t4:"/images_v2/tour-inle-v2.jpg", t5:"/images_v2/tour-beach-v2.jpg", t6:"/images_v2/tour-grand-v2.jpg", t7:"/images_v2/tour-bagan-v2.jpg", t8:"/images_v2/tour-yangon-v2.jpg", t9:"/images_v2/tour-mandalay-v2.jpg", t10:"/images_v2/tour-inle-v2.jpg",
  // Hotels (all real photos)
  h1:"/images_v2/hotel1-v2.jpg", h2:"/images_v2/hotel2-v2.jpg", h3:"/images_v2/hotel3-v2.jpg", h4:"/images_v2/hotel4-v2.jpg", h5:"/images_v2/hotel5-v2.jpg", h6:"/images_v2/hotel6-v2.jpg", h7:"/images_v2/hotel-luxury-v2.jpg", h8:"/images_v2/hotel-budget-v2.jpg", h9:"/images_v2/hotel-city-v2.jpg", h10:"/images_v2/hotel-resort-v2.jpg",
  // Cars (all real photos)
  c1:"/images_v2/car1-v2.jpg", c2:"/images_v2/car2-v2.jpg", c3:"/images_v2/car3-v2.jpg", c4:"/images_v2/car4-v2.jpg", c5:"/images_v2/car5-v2.jpg", c6:"/images_v2/car6-v2.jpg",
  // Visas → country-specific real photos
  v1:"/images_v2/visa-china-v2.jpg", v2:"/images_v2/visa-thailand-v2.jpg", v3:"/images_v2/visa-singapore-v2.jpg", v4:"/images_v2/visa-malaysia-v2.jpg", v5:"/images_v2/visa-uae-v2.jpg", v6:"/images_v2/visa-india-v2.jpg",
  // Insurance → named real photos
  i1:"/images_v2/ins-travel-v2.jpg", i2:"/images_v2/ins-health-v2.jpg", i3:"/images_v2/ins-family-v2.jpg", i4:"/images_v2/ins-marine-v2.jpg", i5:"/images_v2/ins-travel-v2.jpg", i6:"/images_v2/ins-health-v2.jpg", i7:"/images_v2/ins-family-v2.jpg", i8:"/images_v2/ins-marine-v2.jpg", i9:"/images_v2/ins-travel-v2.jpg",
  // Sky Lounge → named real photos
  m1:"/images_v2/sky-main-v2.jpg", m2:"/images_v2/sky-vip-v2.jpg", m3:"/images_v2/sky-business-v2.jpg", m4:"/images_v2/sky-main-v2.jpg", m5:"/images_v2/sky-vip-v2.jpg", m6:"/images_v2/sky-business-v2.jpg",
  // Blog
  b1:"/images_v2/blog1-v2.jpg", b2:"/images_v2/blog2-v2.jpg", b3:"/images_v2/blog3-v2.jpg", b4:"/images_v2/blog4-v2.jpg",
  // Cruises
  cr1:"/images_v2/hero-cruises-v2.jpg", cr2:"/images_v2/hero-singapore-v2.jpg", cr3:"/images_v2/dest-paris-v2.jpg", cr4:"/images_v2/hero-thailand-v2.jpg", cr5:"/images_v2/tour-bagan-v2.jpg", cr6:"/images_v2/dest-dubai-v2.jpg", cr7:"/images_v2/dest-japan-v2.jpg", cr8:"/images_v2/dest-korea-v2.jpg", cr9:"/images_v2/dest-paris-v2.jpg", cr10:"/images_v2/hero-singapore-v2.jpg",
  // Destinations
  d1:"/images_v2/dest-paris-v2.jpg", d2:"/images_v2/dest-japan-v2.jpg", d3:"/images_v2/dest-korea-v2.jpg", d4:"/images_v2/dest-dubai-v2.jpg", d5:"/images_v2/dest-maldives-v2.jpg", d6:"/images_v2/dest-italy-v2.jpg", d7:"/images_v2/dest-uk-v2.jpg", d8:"/images_v2/dest-usa-v2.jpg", d9:"/images_v2/dest-australia-v2.jpg", d10:"/images_v2/dest-spain-v2.jpg",
};
const FB = "/images_v2/unsplash-2-v2.jpg";

export function getImageFallback(id?: string, images?: string | string[]): string {
  // FIX: 2026-08-23 cars-blob-images - accept absolute http(s) URLs (Vercel Blob uploads), not just root-relative paths
  const isUsableImage = (s: string): boolean => s.startsWith('/') || s.startsWith('http://') || s.startsWith('https://');
  if (Array.isArray(images) && images.length > 0 && typeof images[0] === 'string' && isUsableImage(images[0])) return images[0];
  if (typeof images === 'string' && isUsableImage(images)) return images;
  if (id && MAP[id]) return MAP[id];
  return FB;
}
