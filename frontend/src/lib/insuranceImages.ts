/**
 * Insurance card images — unique per plan.
 * Every insurance plan card shows its own distinct image (like visa cards do),
 * even when plans in the DB share generic stock defaults. Real admin uploads
 * (blob URLs or any non-pool path) are always preserved.
 */
export const INSURANCE_IMAGE_POOL = [
  "/images_v2/ins1-v3.jpg",
  "/images_v2/ins2-v3.jpg",
  "/images_v2/ins3-v3.jpg",
  "/images_v2/ins4-v3.jpg",
  "/images_v2/ins1-v2.jpg",
  "/images_v2/ins2-v2.jpg",
  "/images_v2/ins3-v2.jpg",
  "/images_v2/ins4-v2.jpg",
  "/images_v2/ins-travel-v2.jpg",
  "/images_v2/ins-health-v2.jpg",
  "/images_v2/ins-family-v2.jpg",
  "/images_v2/ins-marine-v2.jpg",
];

const GENERIC = new Set(INSURANCE_IMAGE_POOL);

export function isGenericInsuranceImage(img?: string): boolean {
  return !!img && GENERIC.has(img);
}

/** Assign a unique image to every plan. Preserves real uploads; reassigns
 *  generic/duplicate/missing images from the pool (no duplicates per call). */
export function uniqueInsuranceImages<T extends { image?: string }>(plans: T[]): T[] {
  const used = new Set<string>();
  const out: T[] = [];
  let poolIdx = 0;
  for (const p of plans) {
    const img = p.image || '';
    if (img && !used.has(img) && !isGenericInsuranceImage(img)) {
      used.add(img);
      out.push(p);
      continue;
    }
    let cand = INSURANCE_IMAGE_POOL[poolIdx % INSURANCE_IMAGE_POOL.length];
    let guard = 0;
    while (used.has(cand) && guard < INSURANCE_IMAGE_POOL.length * 2) {
      poolIdx++;
      cand = INSURANCE_IMAGE_POOL[poolIdx % INSURANCE_IMAGE_POOL.length];
      guard++;
    }
    poolIdx++;
    used.add(cand);
    out.push({ ...p, image: cand });
  }
  return out;
}
