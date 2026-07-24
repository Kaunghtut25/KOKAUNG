import { getAll } from "@/lib/persistentStore";
import CarsClient from "./carsclient";

async function fetchSiteConfig() {
  try {
    const r = await fetch((process.env.SITE_URL || "http://localhost:3000") + "/api/admin/site-config", { next: { revalidate: 60 }, cache: "no-store" });
    return await r.json();
  } catch { return {}; }
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

const FALLBACK_CARS: Car[] = [
  {
    _id: "fc1", slug: "toyota-alphard-suv", carType: "Toyota Alphard",
    description: "Premium SUV with spacious interior, perfect for families and groups. Professional driver included.",
    capacity: 7, seats: 7, transmission: "Automatic",
    features: ["AC", "WiFi", "Leather Seats", "DVD Player", "Sunroof", "USB Charging"],
    images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784610058381_q4qegc-toyota-alphard-suv-cRNm9aeXGDnkkML37fJoWS3vwtpY5V.jpg"],
    pricingWithDriver: [{ duration: "Full Day", priceMMK: 220000, priceUSD: 105 }],
    status: "active",
  },
  {
    _id: "fc2", slug: "toyota-probox-sedan", carType: "Toyota Probox",
    description: "Reliable and fuel-efficient sedan, ideal for city travel and airport transfers.",
    capacity: 4, seats: 4, transmission: "Automatic",
    features: ["AC", "USB Charging", "Power Windows", "ABS"],
    images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784610059612_w5wesf-toyota-probox-sedan-gzyCPke6np9gsrqcQtBBaoXm8BsTvq.jpg"],
    pricingWithDriver: [{ duration: "Full Day", priceMMK: 120000, priceUSD: 57 }],
    status: "active",
  },
  {
    _id: "fc3", slug: "toyota-hiace-minivan", carType: "Toyota HiAce",
    description: "Spacious minivan for larger groups, tours, and airport shuttles. Comfortable seating for all.",
    capacity: 12, seats: 12, transmission: "Manual",
    features: ["AC", "Ample Luggage Space", "Reclining Seats", "USB Charging"],
    images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784610060976_ty1sm6-toyota-hiace-minivan-8RqUCv8sGoilCiCCQvmrT8zG9nB1ia.jpg"],
    pricingWithDriver: [{ duration: "Full Day", priceMMK: 180000, priceUSD: 86 }],
    status: "active",
  },
  {
    _id: "fc4", slug: "mercedes-benz-luxury", carType: "Mercedes-Benz S-Class",
    description: "Ultimate luxury sedan for VIP transfers, business meetings, and special occasions.",
    capacity: 4, seats: 4, transmission: "Automatic",
    features: ["AC", "Leather Seats", "WiFi", "Privacy Glass", "Premium Sound", "Butler Service"],
    images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784610062470_2pmyr1-mercedes-benz-luxury-jehbAaa2t2fneSXu8zlOPni1xJhfn6.jpg"],
    pricingWithDriver: [{ duration: "Full Day", priceMMK: 450000, priceUSD: 214 }],
    status: "active",
  },
  {
    _id: "fc5", slug: "suzuki-swift-economy", carType: "Suzuki Swift",
    description: "Compact and economical hatchback, perfect for city navigation and short trips.",
    capacity: 4, seats: 4, transmission: "Automatic",
    features: ["AC", "USB Charging", "Power Steering", "Fuel Efficient"],
    images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784610063411_d34llz-suzuki-swift-economy-LchgUcJukdw6avW2eW0M6n6PywkRlh.jpg"],
    pricingWithDriver: [{ duration: "Full Day", priceMMK: 95000, priceUSD: 45 }],
    status: "active",
  },
  {
    _id: "fc6", slug: "toyota-land-cruiser-4x4", carType: "Toyota Land Cruiser",
    description: "Powerful 4x4 SUV for off-road adventures, mountain trips, and rough terrain.",
    capacity: 7, seats: 7, transmission: "Automatic",
    features: ["4x4", "AC", "GPS", "WiFi", "Leather Seats", "Sunroof", "Tow Package"],
    images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784610064497_xj4uy4-toyota-land-cruiser-4x4-7MlHWpNQYXMdvRyLhblNoNsbXB0Ey8.jpg"],
    pricingWithDriver: [{ duration: "Full Day", priceMMK: 280000, priceUSD: 133 }],
    status: "active",
  },
  {
    _id: "fc7", slug: "honda-crv-suv", carType: "Honda CR-V",
    description: "Versatile compact SUV with excellent fuel economy and comfortable ride quality.",
    capacity: 5, seats: 5, transmission: "Automatic",
    features: ["AC", "WiFi", "Cruise Control", "Lane Assist", "USB Charging"],
    images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784610065721_qk76y7-honda-crv-suv-vjJiZlmfuIT4zVYu2N7jLC918JjHVq.jpg"],
    pricingWithDriver: [{ duration: "Full Day", priceMMK: 200000, priceUSD: 95 }],
    status: "active",
  },
  {
    _id: "fc8", slug: "toyota-commuter-bus", carType: "Toyota Commuter",
    description: "Large passenger van for group tours, corporate outings, and airport group transfers.",
    capacity: 15, seats: 15, transmission: "Manual",
    features: ["AC", "Reclining Seats", "Luggage Space", "USB Charging", "PA System"],
    images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784610066672_zlkvfy-toyota-commuter-bus-rUraDuGND80PfhYCfF1EZK1lUkiil5.jpg"],
    pricingWithDriver: [{ duration: "Full Day", priceMMK: 250000, priceUSD: 119 }],
    status: "active",
  },
];

async function getInitialCars(): Promise<Car[]> {
  try {
    const rawCars = await getAll("cars") as any[];
    if (!rawCars || rawCars.length === 0) return FALLBACK_CARS;
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
    return FALLBACK_CARS;
  }
}

export default async function CarsPage() {
  const [initialCars, siteConfig] = await Promise.all([getInitialCars(), fetchSiteConfig()]);
  const moduleOn = siteConfig?.moduleToggles?.["cars"] !== false;
  if (!moduleOn) return <div className="min-h-screen bg-[#0A1628] flex items-center justify-center"><div className="text-center"><h1 className="text-3xl text-white font-light mb-3">Coming Soon</h1><p className="text-white/40">This section is temporarily unavailable.</p></div></div>;
  return <CarsClient initialCars={initialCars} siteConfig={siteConfig || {}} />;
}