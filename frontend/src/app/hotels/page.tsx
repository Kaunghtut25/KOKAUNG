import { getAll } from "@/lib/persistentStore";
import HotelsClient from "./hotelsclient";

async function fetchSiteConfig() {
  try {
    const r = await fetch((process.env.SITE_URL || "http://localhost:3000") + "/api/admin/site-config", { next: { revalidate: 60 }, cache: "no-store" });
    return await r.json();
  } catch { return {}; }
}

export const dynamic = 'force-dynamic';

interface Hotel {
  _id: string;
  slug: string;
  name: string;
  location: string;
  description: string;
  rating: number;
  reviewCount: number;
  pricePerNightMMK: number;
  pricePerNightUSD: number;
  availableRooms: number;
  totalRooms: number;
  amenities: string[];
  images: string[];
  row: number;
  status: string;
  featured: boolean;
}

const FALLBACK_HOTELS: Hotel[] = [
  { _id: "fh1", slug: "sedona-hotel-yangon", name: "Sedona Hotel Yangon", location: "Yangon", description: "Luxury hotel with stunning views of Inya Lake and world-class amenities.", rating: 4.5, reviewCount: 128, pricePerNightMMK: 185000, pricePerNightUSD: 88, availableRooms: 45, totalRooms: 120, amenities: ["Pool", "Spa", "Gym", "Restaurant", "WiFi"], images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609659318_584n8t-sedona-hotel-yangon-TH1oViBuVSJ34XOPNSFhO81fABJOjy.jpg"], status: "active", featured: true },
  { _id: "fh2", slug: "aureum-palace-bagan", name: "Aureum Palace Bagan", location: "Bagan", description: "Luxury resort amidst ancient temples with a stunning pool and spa.", rating: 4.7, reviewCount: 95, pricePerNightMMK: 245000, pricePerNightUSD: 118, availableRooms: 20, totalRooms: 80, amenities: ["Pool", "Spa", "Restaurant", "WiFi", "Bar"], images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609660415_v1gl8v-aureum-palace-bagan-Ghe5sw6UqDFfSDv8hRuxzrx1NQqS6E.jpg"], status: "active", featured: true },
  { _id: "fh3", slug: "inle-princess-resort", name: "Inle Princess Resort", location: "Inle Lake", description: "Beautiful lakeside resort with traditional architecture and stunning views.", rating: 4.6, reviewCount: 72, pricePerNightMMK: 220000, pricePerNightUSD: 105, availableRooms: 15, totalRooms: 50, amenities: ["Lake View", "Spa", "Restaurant", "WiFi"], images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609661253_gbt9t7-inle-princess-resort-Tf2iomat4GCBCLc5oGhbawstAUUkfl.jpg"], status: "active", featured: true },
  { _id: "fh4", slug: "mandalay-hill-resort", name: "Mandalay Hill Resort", location: "Mandalay", description: "Elegant resort at the foot of Mandalay Hill with panoramic city views.", rating: 4.4, reviewCount: 63, pricePerNightMMK: 195000, pricePerNightUSD: 93, availableRooms: 30, totalRooms: 90, amenities: ["Pool", "Gym", "Restaurant", "WiFi", "Spa"], images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609662399_o6n09l-mandalay-hill-resort-f9wOV1Opcaj861HpFfJetMJcmoS1js.jpg"], status: "active", featured: true },
  { _id: "fh5", slug: "ngapali-bay-villas", name: "Ngapali Bay Villas", location: "Ngapali", description: "Beachfront villas with private pools and stunning Bay of Bengal views.", rating: 4.8, reviewCount: 54, pricePerNightMMK: 320000, pricePerNightUSD: 152, availableRooms: 10, totalRooms: 25, amenities: ["Beach", "Pool", "Restaurant", "WiFi", "Spa"], images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609663545_tbkyst-ngapali-bay-villas-JmHvRpi0G4SXGKCL06Cf87nuS3yQ4U.jpg"], status: "active", featured: true },
  { _id: "fh6", slug: "strand-hotel-yangon", name: "The Strand Yangon", location: "Yangon", description: "Iconic colonial-era luxury hotel in the heart of downtown Yangon.", rating: 4.6, reviewCount: 210, pricePerNightMMK: 280000, pricePerNightUSD: 134, availableRooms: 12, totalRooms: 32, amenities: ["Restaurant", "Bar", "Spa", "WiFi", "Butler"], images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609664766_kwy0r0-strand-hotel-yangon-1XiJRt2CPH0ssLMslT6NBfI9fLiXmk.jpg"], status: "active", featured: true },
  { _id: "fh7", slug: "amazing-ngapali-resort", name: "Amazing Ngapali Resort", location: "Ngapali", description: "Tropical beachfront resort with lush gardens and exceptional service.", rating: 4.5, reviewCount: 48, pricePerNightMMK: 265000, pricePerNightUSD: 126, availableRooms: 18, totalRooms: 45, amenities: ["Beach", "Pool", "Restaurant", "WiFi", "Diving"], images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609666082_nvs4v0-amazing-ngapali-resort-rm8svgy00MGY6gXvRbJfb9gOewhLm0.jpg"], status: "active", featured: false },
  { _id: "fh8", slug: "bagan-thiripyitsaya", name: "Bagan Thiripyitsaya Sanctuary", location: "Bagan", description: "Riverside sanctuary with breathtaking views of the Irrawaddy River and temples.", rating: 4.7, reviewCount: 67, pricePerNightMMK: 235000, pricePerNightUSD: 112, availableRooms: 22, totalRooms: 60, amenities: ["River View", "Pool", "Restaurant", "WiFi", "Spa"], images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609667453_9ssisk-bagan-thiripyitsaya-r1Cj9tyf5xN8LykQspGd6ct6UDngrV.jpg"], status: "active", featured: true },
  { _id: "fh9", slug: "novotel-yangon-max", name: "Novotel Yangon Max", location: "Yangon", description: "Modern business hotel with rooftop pool and panoramic city views.", rating: 4.3, reviewCount: 185, pricePerNightMMK: 165000, pricePerNightUSD: 79, availableRooms: 55, totalRooms: 200, amenities: ["Pool", "Gym", "Restaurant", "WiFi", "Business Center"], images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609668748_yegf0r-novotel-yangon-max-YrkKC3ZYojpjbEFFrFiEzxLhpk9j36.jpg"], status: "active", featured: false },
  { _id: "fh10", slug: "chatrium-hotel-yangon", name: "Chatrium Hotel Yangon", location: "Yangon", description: "Elegant riverside hotel with spacious suites and excellent dining options.", rating: 4.4, reviewCount: 142, pricePerNightMMK: 175000, pricePerNightUSD: 84, availableRooms: 35, totalRooms: 150, amenities: ["River View", "Pool", "Restaurant", "WiFi", "Gym"], images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609670088_0ath12-chatrium-hotel-yangon-mgTQyLQZ2b0I3qwJUyzbnCgV0QJcNd.jpg"], status: "active", featured: false },
  { _id: "fh11", slug: "pullman-yangon-centrepoint", name: "Pullman Yangon Centrepoint", location: "Yangon", description: "Contemporary luxury hotel in the heart of Yangon's business district.", rating: 4.5, reviewCount: 98, pricePerNightMMK: 195000, pricePerNightUSD: 93, availableRooms: 40, totalRooms: 180, amenities: ["Pool", "Gym", "Restaurant", "WiFi", "Spa"], images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609671272_wosa2t-pullman-yangon-centrepoint-c7bmESkki0wpI0VZUDinUGQODqUULn.jpg"], status: "active", featured: false },
  { _id: "fh12", slug: "kandawgyi-palace", name: "Kandawgyi Palace Hotel", location: "Yangon", description: "Lakeside palace hotel with traditional Myanmar architecture and stunning views.", rating: 4.6, reviewCount: 112, pricePerNightMMK: 210000, pricePerNightUSD: 100, availableRooms: 20, totalRooms: 80, amenities: ["Lake View", "Pool", "Spa", "Restaurant", "WiFi"], images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609672425_tzj7zy-kandawgyi-palace-RZScV2AtSK6B2LFh7tbvWK31XVtbOd.jpg"], status: "active", featured: true },
  { _id: "fh13", slug: "sule-shangri-la-yangon", name: "Sule Shangri-La Yangon", location: "Yangon", description: "Iconic landmark hotel in the heart of Yangon with panoramic views of Sule Pagoda and the city skyline.", rating: 4.5, reviewCount: 176, pricePerNightMMK: 205000, pricePerNightUSD: 98, availableRooms: 30, totalRooms: 130, amenities: ["Pool", "Spa", "Gym", "Restaurant", "WiFi", "Bar"], images: ["https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609673824_cn22l9-sule-shangri-la-yangon-nxg781v1SPebP4YJFnCQxpZP6ZOrw3.jpg"], status: "active", featured: true },
];

async function getInitialHotels(): Promise<Hotel[]> {
  try {
    const rawHotels = await getAll("hotels") as any[];
    if (!rawHotels || rawHotels.length === 0) return FALLBACK_HOTELS;
    return rawHotels.map((h: any) => {
      let images: string[] = [];
      if (Array.isArray(h.images)) {
        for (const item of h.images) {
          if (typeof item === 'string' && item.trim().startsWith('[')) {
            try { const parsed = JSON.parse(item); if (Array.isArray(parsed)) { images.push(...parsed.filter((x: string) => x.trim())); continue; } } catch {}
          }
          if (typeof item === 'string' && item.trim()) images.push(item.trim());
        }
      } else if (typeof h.images === 'string' && h.images.trim()) {
        const s = h.images.trim();
        if (s.startsWith('[')) { try { const parsed = JSON.parse(s); if (Array.isArray(parsed)) images = parsed.filter((x: string) => x.trim()); } catch { images = [s]; } }
        else images = [s];
      }
      if (images.length === 0) images = ['https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609659318_584n8t-sedona-hotel-yangon-TH1oViBuVSJ34XOPNSFhO81fABJOjy.jpg'];

      return {
        _id: h.id || h._id || '',
        slug: (h.name || h.location || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        name: h.name || '',
        location: h.location || '',
        description: h.description || '',
        rating: Number(h.rating) || 4.0,
        reviewCount: Number(h.reviewCount) || 0,
        row: Number(h.row) || 1,
        pricePerNightMMK: Number(h.pricePerNightMMK) || 0,
        pricePerNightUSD: Number(h.pricePerNightUSD) || 0,
        availableRooms: Number(h.availableRooms) || 0,
        totalRooms: Number(h.totalRooms) || 0,
        amenities: typeof h.amenities === 'string' ? h.amenities.split(',').map((s: string) => s.trim()).filter(Boolean) : Array.isArray(h.amenities) ? h.amenities : [],
        images,
        status: h.status || 'active',
        featured: h.featured || false,
      };
    });
  } catch {
    return FALLBACK_HOTELS;
  }
}

export default async function HotelsPage() {
  const initialHotels = await getInitialHotels();
  const moduleOn = siteConfig?.moduleToggles?.["hotels"] !== false;
  if (siteConfig?.moduleToggles?.hotels === false) return <div className="min-h-screen bg-[#0A1628] flex items-center justify-center"><div className="text-center"><h1 className="text-3xl text-white font-light mb-3">Coming Soon</h1><p className="text-white/40">This section is temporarily unavailable.</p></div></div>;
  return <HotelsClient initialHotels={initialHotels} />;
}