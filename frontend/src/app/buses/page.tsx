import { getAll } from "@/lib/persistentStore";
import BusesClient from "./busesclient";

async function fetchSiteConfig() {
  try { const items = await getAll("site-config" as any); return items?.[0] || {}; }
  catch { return {}; }
}

export const dynamic = "force-dynamic";

interface BusRoute {
  _id: string;
  from: string;
  to: string;
  priceMMK: number;
  duration: string;
  operators: string[];
  route: string;
}

const FALLBACK_BUS_ROUTES: BusRoute[] = [
  { _id: "bus1", from: "Yangon", to: "Mandalay", priceMMK: 25000, duration: "9 hours", operators: ["JJ Express", "Elite Express"], route: "Yangon → Mandalay" },
  { _id: "bus2", from: "Yangon", to: "Bagan", priceMMK: 22000, duration: "10 hours", operators: ["Shwe Mandalar", "Famous Express"], route: "Yangon → Bagan" },
  { _id: "bus3", from: "Yangon", to: "Taunggyi", priceMMK: 28000, duration: "12 hours", operators: ["JJ Express"], route: "Yangon → Taunggyi (Inle)" },
  { _id: "bus4", from: "Yangon", to: "Naypyitaw", priceMMK: 15000, duration: "5 hours", operators: ["Elite Express", "Shwe Mandalar"], route: "Yangon → Naypyitaw" },
  { _id: "bus5", from: "Mandalay", to: "Bagan", priceMMK: 12000, duration: "4 hours", operators: ["Shwe Mandalar", "Famous Express"], route: "Mandalay → Bagan" },
  { _id: "bus6", from: "Yangon", to: "Pyay", priceMMK: 18000, duration: "6 hours", operators: ["Famous Express"], route: "Yangon → Pyay" },
  { _id: "bus7", from: "Yangon", to: "Mawlamyine", priceMMK: 20000, duration: "7 hours", operators: ["Elite Express"], route: "Yangon → Mawlamyine" },
  { _id: "bus8", from: "Yangon", to: "Pathein", priceMMK: 16000, duration: "6 hours", operators: ["Shwe Mandalar"], route: "Yangon → Pathein" },
  { _id: "bus9", from: "Mandalay", to: "Taunggyi", priceMMK: 18000, duration: "8 hours", operators: ["JJ Express"], route: "Mandalay → Taunggyi" },
  { _id: "bus10", from: "Yangon", to: "Hpa-An", priceMMK: 15000, duration: "6 hours", operators: ["Famous Express"], route: "Yangon → Hpa-An" },
];

async function getInitialBusRoutes(): Promise<BusRoute[]> {
  try {
    const rawRoutes = await getAll("bus-routes") as any[];
    if (!rawRoutes || rawRoutes.length === 0) return FALLBACK_BUS_ROUTES;
    return rawRoutes.map((v: any) => ({
      _id: v._id || v.id || "",
      from: v.from || "",
      to: v.to || "",
      priceMMK: Number(v.priceMMK) || 0,
      duration: v.duration || "",
      operators: Array.isArray(v.operators) ? v.operators : typeof v.operators === "string" ? v.operators.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      route: v.route || `${v.from || ""} → ${v.to || ""}`,
    }));
  } catch {
    return FALLBACK_BUS_ROUTES;
  }
}

export default async function BusesPage() {
  const [initialRoutes, siteConfig] = await Promise.all([getInitialBusRoutes(), fetchSiteConfig()]);
  let moduleOn = true;
  try { moduleOn = siteConfig?.moduleToggles?.["buses"] !== false; } catch {}
  if (!moduleOn) return <div className="min-h-screen bg-[#0A1628] flex items-center justify-center"><div className="text-center"><h1 className="text-3xl text-white font-light mb-3">Coming Soon</h1><p className="text-white/40">This section is temporarily unavailable.</p></div></div>;
  return <BusesClient initialRoutes={initialRoutes} siteConfig={siteConfig || {}} />;
}
