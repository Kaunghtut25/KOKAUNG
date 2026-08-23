import { getAll } from "@/lib/persistentStore";
import CarsClient from "./carsclient";

async function fetchSiteConfig() {
  try { const items = await getAll("site-config" as any); return items?.[0] || {}; }
  catch { return {}; }
}

export const dynamic = "force-dynamic";

interface Car {
  _id: string;
  slug: string;
  carType: string;
  description: string;
  capacity: number;
  seats: number;
  transmission: string;
  features: string[];
  images: string[];
  pricingWithDriver: { duration: string; priceMMK: number; priceUSD: number }[];
  status: string;
}



async function getInitialCars(): Promise<Car[]> {
  try {
    const rawCars = await getAll("cars") as any[];
    if (!rawCars || rawCars.length === 0) return []; // FIX 2026-08-23: no hidden demo data — empty store shows empty page
    return rawCars.map((c: any) => {
      let images: string[] = [];
      if (Array.isArray(c.images)) {
        for (const item of c.images) {
          if (typeof item === "string" && item.trim().startsWith("[")) {
            try { const parsed = JSON.parse(item); if (Array.isArray(parsed)) { images.push(...parsed.filter((x: string) => x.trim())); continue; } } catch {}
          }
          if (typeof item === "string" && item.trim()) images.push(item.trim());
        }
      } else if (typeof c.images === "string" && c.images.trim()) {
        const s = c.images.trim();
        if (s.startsWith("[")) { try { const parsed = JSON.parse(s); if (Array.isArray(parsed)) images = parsed.filter((x: string) => x.trim()); } catch { images = [s]; } }
        else images = [s];
      }
      if (images.length === 0) images = ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784610058381_q4qegc-toyota-alphard-suv-cRNm9aeXGDnkkML37fJoWS3vwtpY5V.jpg"];

      const pricing = Array.isArray(c.pricing) && c.pricing.length > 0
        ? c.pricing.map((p: any) => ({
            duration: p.duration || p.name || "Full Day",
            priceMMK: Number(p.priceMMK || p.price_mmk || 0),
            priceUSD: Number(p.priceUSD || p.price_usd || 0),
          }))
        : Array.isArray(c.pricingWithDriver) && c.pricingWithDriver.length > 0
          ? c.pricingWithDriver
          : [{ duration: "Full Day", priceMMK: 0, priceUSD: 0 }];

      return {
        _id: c.id || c._id || "",
        slug: (c.carType || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        carType: c.carType || "",
        description: c.description || "",
        capacity: Number(c.capacity || c.seats || 5),
        seats: Number(c.seats || c.capacity || 5),
        transmission: c.transmission || "Automatic",
        features: typeof c.features === "string" ? c.features.split(",").map((s: string) => s.trim()).filter(Boolean) : Array.isArray(c.features) ? c.features : [],
        images,
        pricingWithDriver: pricing,
        status: c.status || "active",
      };
    });
  } catch {
    return []; // FIX 2026-08-23
  }
}

export default async function CarsPage() {
  const [initialCars, siteConfig] = await Promise.all([getInitialCars(), fetchSiteConfig()]);
  let moduleOn2 = true;
  try { moduleOn2 = siteConfig?.moduleToggles?.["cars"] !== false; } catch {}
  if (!moduleOn2) return <div className="min-h-screen bg-[#0A1628] flex items-center justify-center"><div className="text-center"><h1 className="text-3xl text-white font-light mb-3">Coming Soon</h1><p className="text-white/40">This section is temporarily unavailable.</p></div></div>;
  return <CarsClient initialCars={initialCars} siteConfig={siteConfig || {}} />;
}