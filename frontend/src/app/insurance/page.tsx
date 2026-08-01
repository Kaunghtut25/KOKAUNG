import { getAll } from '@/lib/persistentStore';
import InsuranceClient from './insuranceclient';

async function fetchSiteConfig() {
  try { const items = await getAll('site-config' as any); return items?.[0] || null; }
  catch { return null; }
}

export const dynamic = 'force-dynamic';

interface InsurancePlan {
  _id: string;
  planName: string;
  title: string;
  coverage: string;
  duration: string;
  priceMMK: number;
  priceUSD: number;
  benefits: string[];
  description: string;
  image?: string;
  images?: string[];
}

const FALLBACK_9: InsurancePlan[] = [
  { _id: 'i1', planName: 'Basic Travel Shield', title: 'Basic Travel Shield', coverage: 'Medical + Trip Delay', duration: 'Per trip', priceMMK: 15000, priceUSD: 7, benefits: ['Medical Emergency','Trip Cancellation','Lost Baggage'], description: 'Essential coverage for short trips', image: 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609531641_uver3p-basic-travel-shield-T2ygRijeSdrdErfWcIDaKHLYEvM6fn.jpg' },
  { _id: 'i2', planName: 'Standard Travel Guard', title: 'Standard Travel Guard', coverage: 'Medical + Baggage', duration: 'Per trip', priceMMK: 25000, priceUSD: 12, benefits: ['Medical Emergency','Baggage Loss','Flight Delay'], description: 'Comprehensive protection plan', image: 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609532468_q2vls0-standard-travel-guard-19U05JT0ey2qHioAeRi7jniKj7myYa.jpg' },
  { _id: 'i3', planName: 'Premium Travel Protect', title: 'Premium Travel Protect', coverage: 'Medical + Cancellation', duration: 'Annual', priceMMK: 45000, priceUSD: 21, benefits: ['Unlimited Medical','Trip Cancellation','Concierge'], description: 'Premium travel coverage', image: 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609534060_a6mbdb-premium-travel-protect-rLdj9GNBwbJDKcbgBWqXJjaUtoeOwS.jpg' },
  { _id: 'i4', planName: 'Family Travel Plan', title: 'Family Travel Plan', coverage: 'Family Medical + Trip', duration: 'Per trip', priceMMK: 60000, priceUSD: 29, benefits: ['Full Family Cover','Child Medical','Trip Cancellation'], description: 'Complete family protection', image: 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609535185_q2bpym-family-travel-plan-HJAyVgfzCNc1sbE2mvLJ7p4KtDFtTS.jpg' },
  { _id: 'i5', planName: 'Senior Travel Cover', title: 'Senior Travel Cover', coverage: 'Medical + Evacuation', duration: 'Per trip', priceMMK: 55000, priceUSD: 26, benefits: ['Medical Emergency','Emergency Evacuation','Repatriation'], description: 'Specialized coverage for senior travelers', image: 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609536314_azg4za-senior-travel-cover-F34Bo4DhYkbsCeTCXJIFWmqNQSkqpI.jpg' },
  { _id: 'i6', planName: 'Adventure Sports Pack', title: 'Adventure Sports Pack', coverage: 'Extreme Sports + Medical', duration: 'Per trip', priceMMK: 85000, priceUSD: 40, benefits: ['Sports Injury','Helicopter Rescue','Equipment Cover'], description: 'Coverage for adventure activities', image: 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609537350_p58age-adventure-sports-pack-ayt9YV02NfFMXewoqrFU57apK2Sdjz.jpg' },
  { _id: 'i7', planName: 'Business Travel Pro', title: 'Business Travel Pro', coverage: 'Medical + Productivity', duration: 'Annual', priceMMK: 75000, priceUSD: 36, benefits: ['Medical Emergency','Trip Delay','Document Replacement'], description: 'For frequent business travelers', image: 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609538483_zq4axu-business-travel-pro-rqciakKDXwTNi5QhCWsHZb41A1DZhl.jpg' },
  { _id: 'i8', planName: 'Student Travel Basic', title: 'Student Travel Basic', coverage: 'Medical + Baggage', duration: 'Per trip', priceMMK: 12000, priceUSD: 6, benefits: ['Medical Emergency','Baggage Loss','Trip Cancellation'], description: 'Affordable coverage for students', image: 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609539609_wjvzj2-student-travel-basic-pdduPb6dMYNeX4YEhRhrcMvlX1NdOh.jpg' },
  { _id: 'i9', planName: 'Cruise Coverage', title: 'Cruise Coverage', coverage: 'Medical + Missed Port', duration: 'Per trip', priceMMK: 95000, priceUSD: 45, benefits: ['Medical Emergency','Missed Port','Cabin Cover'], description: 'Specialized cruise travel insurance', image: 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609540692_587a1j-cruise-coverage-9wTSp6pcELNEotZnpBRT9bGPbR2NK9.jpg' },
  { _id: 'i10', planName: 'Honeymoon Bliss Cover', title: 'Honeymoon Bliss Cover', coverage: 'Medical + Trip + Wedding', duration: 'Per trip', priceMMK: 110000, priceUSD: 52, benefits: ['Medical Emergency','Trip Cancellation','Lost Rings Cover','Honeymoon Upgrade'], description: 'Romantic getaway protection with wedding coverage', image: 'https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609541555_hgzo1n-honeymoon-bliss-cover-roVCq0l8Pg9mfwTvjYbUZUvvYHR6Xu.jpg' },
];

async function getInitialPlans(): Promise<InsurancePlan[]> {
  try {
    const raw = await getAll('insurances') as any[];
    if (raw.length === 0) return FALLBACK_9;
    return raw.map((p: any) => ({
      _id: p._id || p.id || '',
      planName: p.title || p.planName || p.name || '',
      title: p.title || '',
      coverage: p.coverage || '',
      duration: p.duration || 'Per Trip',
      priceMMK: Number(p.priceMMK || p.premiumPriceMMK || p.premiumMMK || p.price || 0),
      priceUSD: Number(p.priceUSD || p.premiumPriceUSD || p.premiumUSD || 0),
      benefits: Array.isArray(p.benefits) ? p.benefits : (typeof p.benefits === 'string' ? p.benefits.split(',').map((s:string) => s.trim()).filter(Boolean) : []),
      description: p.description || '',
      image: p.image || undefined,
      images: p.images || undefined,
    }));
  } catch {
    return FALLBACK_9;
  }
}

export default async function InsurancePage() {
  const [initialPlans, siteConfig] = await Promise.all([getInitialPlans(), fetchSiteConfig()]);
  let moduleOn2 = true;
  try { moduleOn2 = siteConfig?.moduleToggles?.["insurance"] !== false; } catch {}
  if (!moduleOn2) return <div className="min-h-screen bg-[#0A1628] flex items-center justify-center"><div className="text-center"><h1 className="text-3xl text-white font-light mb-3">Coming Soon</h1><p className="text-white/40">This section is temporarily unavailable.</p></div></div>;
  return <InsuranceClient initialPlans={initialPlans} siteConfig={siteConfig || {}} />;
}
