import { getAll } from "@/lib/persistentStore";
import VisasClient from "./visasclient";

export const dynamic = "force-dynamic";

interface VisaService {
  _id: string;
  country: string;
  countryCode: string;
  processingTime: string;
  visaFeeMMK: number;
  visaFeeUSD: number;
  requirements: string[];
  additionalInfo: string;
  image?: string;
}

const FALLBACK_VISAS: VisaService[] = [
  { _id: "v1", country: "Thailand", countryCode: "TH", processingTime: "3-5 Days", visaFeeMMK: 85000, visaFeeUSD: 40, requirements: ["Passport 6m", "2 Photos", "Flight Booking"], additionalInfo: "Visa-free for ASEAN nationals. Tourist visa available for Myanmar citizens.", image: "/images_v2/visa1-v3.jpg" },
  { _id: "v2", country: "Singapore", countryCode: "SG", processingTime: "5-7 Days", visaFeeMMK: 120000, visaFeeUSD: 57, requirements: ["Passport 6m", "Bank Statement", "Hotel Booking", "Flight Ticket"], additionalInfo: "E-visa available for Myanmar passport holders.", image: "/images_v2/visa2-v3.jpg" },
  { _id: "v3", country: "Vietnam", countryCode: "VN", processingTime: "3-5 Days", visaFeeMMK: 95000, visaFeeUSD: 45, requirements: ["Passport 6m", "Flight Booking", "Hotel Reservation"], additionalInfo: "Visa on arrival and e-visa options available. E-visa recommended for smoother entry.", image: "/images_v2/visa3-v3.jpg" },
  { _id: "v4", country: "China", countryCode: "CN", processingTime: "5-7 Days", visaFeeMMK: 150000, visaFeeUSD: 71, requirements: ["Passport 6m", "Hotel Reservation", "Flight Booking", "Bank Statement"], additionalInfo: "Tourist visa (L) requires detailed itinerary and hotel bookings.", image: "/images_v2/visa4-v3.jpg" },
  { _id: "v5", country: "Malaysia", countryCode: "MY", processingTime: "3-5 Days", visaFeeMMK: 75000, visaFeeUSD: 36, requirements: ["Passport 6m", "2 Photos", "Flight Booking"], additionalInfo: "Visa-free for ASEAN nationals up to 30 days.", image: "/images_v2/visa5-v3.jpg" },
  { _id: "v6", country: "Japan", countryCode: "JP", processingTime: "5-7 Days", visaFeeMMK: 130000, visaFeeUSD: 62, requirements: ["Passport 6m", "Employment Letter", "Bank Statement 6m", "Itinerary"], additionalInfo: "Tourist visa requires detailed itinerary, bank statements, and letter of employment.", image: "/images_v2/visa6-v3.jpg" },
  { _id: "v7", country: "South Korea", countryCode: "KR", processingTime: "5-7 Days", visaFeeMMK: 115000, visaFeeUSD: 55, requirements: ["Passport 6m", "Bank Statement", "Employment Letter", "Hotel Booking"], additionalInfo: "K-ETA may be required for eligible nationalities. Tourist visa available.", image: "/images_v2/visa1-v3.jpg" },
  { _id: "v8", country: "United Arab Emirates", countryCode: "AE", processingTime: "3-5 Days", visaFeeMMK: 140000, visaFeeUSD: 67, requirements: ["Passport 6m", "Bank Statement", "Hotel Booking", "Return Ticket"], additionalInfo: "Dubai/UAE visa processing through authorized agencies.", image: "/images_v2/visa2-v3.jpg" },
  { _id: "v9", country: "Cambodia", countryCode: "KH", processingTime: "2-3 Days", visaFeeMMK: 65000, visaFeeUSD: 31, requirements: ["Passport 6m", "Flight Booking", "2 Photos"], additionalInfo: "Visa on arrival and e-visa available for most nationalities.", image: "/images_v2/visa3-v3.jpg" },
  { _id: "v10", country: "Indonesia", countryCode: "ID", processingTime: "3-5 Days", visaFeeMMK: 80000, visaFeeUSD: 38, requirements: ["Passport 6m", "Bank Statement", "Flight Booking"], additionalInfo: "Visa on arrival available for many nationalities. E-visa recommended.", image: "/images_v2/visa4-v3.jpg" },
  { _id: "v11", country: "Taiwan", countryCode: "TW", processingTime: "5-7 Days", visaFeeMMK: 105000, visaFeeUSD: 50, requirements: ["Passport 6m", "Employment Letter", "Bank Statement", "Hotel Booking"], additionalInfo: "E-visa available for eligible travelers. Processing time varies by nationality.", image: "/images_v2/visa5-v3.jpg" },
  { _id: "v12", country: "Philippines", countryCode: "PH", processingTime: "5-7 Days", visaFeeMMK: 90000, visaFeeUSD: 43, requirements: ["Passport 6m", "2 Photos", "Flight Booking", "Bank Statement"], additionalInfo: "Visa-free for ASEAN nationals. Tourist visa available for others.", image: "/images_v2/visa6-v3.jpg" },
];

async function getInitialVisas(): Promise<VisaService[]> {
  try {
    const rawVisas = await getAll("visas") as any[];
    if (!rawVisas || rawVisas.length === 0) return FALLBACK_VISAS;
    return rawVisas.map((v: any) => ({
      _id: v._id || v.id || "",
      country: v.country || "",
      countryCode: v.countryCode || "",
      processingTime: v.processingTime || "3-5 Days",
      visaFeeMMK: Number(v.visaFeeMMK) || 0,
      visaFeeUSD: Number(v.visaFeeUSD) || 0,
      requirements: typeof v.requirements === "string"
        ? v.requirements.split(",").map((s: string) => s.trim()).filter(Boolean)
        : Array.isArray(v.requirements) ? v.requirements : [],
      additionalInfo: v.additionalInfo || "",
      image: v.image || undefined,
    }));
  } catch {
    return FALLBACK_VISAS;
  }
}

export default async function VisasPage() {
  const initialVisas = await getInitialVisas();
  return <VisasClient initialVisas={initialVisas} />;
}