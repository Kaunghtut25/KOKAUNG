import { getAll } from "@/lib/persistentStore";
import VisasClient from "./visasclient";

export const dynamic = 'force-dynamic';

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

async function getInitialVisas(): Promise<VisaService[]> {
  try {
    const rawVisas = await getAll("visas") as any[];
    if (rawVisas.length === 0) return [];
    return rawVisas.map((v: any) => ({
      _id: v._id || v.id || '',
      country: v.country || '',
      countryCode: v.countryCode || '',
      processingTime: v.processingTime || '3-5 Days',
      visaFeeMMK: Number(v.visaFeeMMK) || 0,
      visaFeeUSD: Number(v.visaFeeUSD) || 0,
      requirements: typeof v.requirements === 'string'
        ? v.requirements.split(',').map((s: string) => s.trim()).filter(Boolean)
        : Array.isArray(v.requirements) ? v.requirements : [],
      additionalInfo: v.additionalInfo || '',
      image: v.image || undefined,
    }));
  } catch {
    return [];
  }
}

export default async function VisasPage() {
  const initialVisas = await getInitialVisas();
  return <VisasClient initialVisas={initialVisas} />;
}