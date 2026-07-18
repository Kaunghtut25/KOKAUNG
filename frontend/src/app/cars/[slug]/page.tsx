import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAll } from "@/lib/persistentStore";
import SocialShare from '@/components/SocialShare';
import RelatedItems from '@/components/RelatedItems';
export const dynamic = 'force-dynamic';

interface CarData {
  id: string;
  carType: string;
  description: string;
  capacity: number;
  seats: number;
  transmission: string;
  features: string[];
  images: string[];
  pricing: { duration: string; priceMMK: number; priceUSD: number }[];
  status: string;
}

const CAR_IMAGE_FALLBACKS: Record<string, string> = {
  c1: "/images_v2/car1-v2.jpg",
  c2: "/images_v2/car2-v2.jpg",
  c3: "/images_v2/car3-v2.jpg",
  c4: "/images_v2/car4-v2.jpg",
  c5: "/images_v2/car5-v2.jpg",
  c6: "/images_v2/car6-v2.jpg",
};
const DEFAULT_CAR_IMG = "/images_v2/car1-v2.jpg";

async function getCarBySlug(slug: string): Promise<CarData | null> {
  try {
    const rawCars = await getAll("cars") as any[];
    const found = rawCars.find((c: any) => {
      const s = (c.carType || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return s === slug || c.id === slug || c._id === slug;
    });
    if (!found) return null;

    let images: string[] = [];
    if (Array.isArray(found.images)) {
      for (const item of found.images) {
        if (typeof item === 'string' && item.trim().startsWith('[')) {
          try { const parsed = JSON.parse(item); if (Array.isArray(parsed)) { images.push(...parsed.filter((x: string) => x.trim())); continue; } } catch {}
        }
        if (typeof item === 'string' && item.trim()) images.push(item.trim());
      }
    } else if (typeof found.images === 'string' && found.images.trim()) {
      const s = found.images.trim();
      if (s.startsWith('[')) { try { const parsed = JSON.parse(s); if (Array.isArray(parsed)) images = parsed.filter((x: string) => x.trim()); } catch { images = [s]; } }
      else images = [s];
    }
    if (images.length === 0) {
      const fallbackKey = found.id || found._id || '';
      images = [CAR_IMAGE_FALLBACKS[fallbackKey] || DEFAULT_CAR_IMG];
    }

    const pricing = Array.isArray(found.pricing) && found.pricing.length > 0
      ? found.pricing.map((p: any) => ({
          duration: p.duration || p.name || 'Full Day',
          priceMMK: Number(p.priceMMK || p.price_mmk || 0),
          priceUSD: Number(p.priceUSD || p.price_usd || 0),
        }))
      : Array.isArray(found.pricingWithDriver) && found.pricingWithDriver.length > 0
        ? found.pricingWithDriver
        : [{ duration: 'Full Day', priceMMK: 0, priceUSD: 0 }];

    const features = typeof found.features === 'string'
      ? found.features.split(',').map((s: string) => s.trim()).filter(Boolean)
      : Array.isArray(found.features) ? found.features : [];

    return {
      id: found.id || found._id || '',
      carType: found.carType || '',
      description: found.description || '',
      capacity: Number(found.capacity || found.seats || 5),
      seats: Number(found.seats || found.capacity || 5),
      transmission: found.transmission || 'Automatic',
      features,
      images,
      pricing,
      status: found.status || 'active',
    };
  } catch {
    return null;
  }
}


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const car = await getCarBySlug(params.slug);
  if (!car) return { title: 'Car Not Found' };
  const title = car.carType + ' - A9 Global Travel';
  const description = car.description || 'Rent ' + car.carType + ' with professional driver. Premium car rental with A9 Global Travel.';
  const imageUrl = car.images[0] || '/images_v2/car1-v2.jpg';
  return {
    title,
    description: description.substring(0, 160),
    openGraph: {
      title,
      description: description.substring(0, 160),
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: 'website',
    },
  };
}

export default async function CarDetailPage({ params }: { params: { slug: string } }) {
  const car = await getCarBySlug(params.slug);

  if (!car) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl text-[#0A1628] font-semibold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Car Not Found</h2>
          <p className="text-gray-400">The vehicle you&apos;re looking for is no longer available.</p>
          <a href="/cars" className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-[#D4AF37] text-[#0A1628] font-bold hover:bg-[#C5A028] transition-colors">
            ← Back to Cars
          </a>
        </div>
      </main>
    );
  }

  const heroImage = car.images[0] || DEFAULT_CAR_IMG;
  const cheapestPricing = car.pricing.reduce((prev, curr) =>
    curr.priceMMK < prev.priceMMK ? curr : prev, car.pricing[0]);
  const fuelTypes = car.features.filter(f =>
    /diesel|petrol|gasoline|electric|hybrid|fuel/i.test(f)
  );
  const fuelType = fuelTypes.length > 0 ? fuelTypes[0] : 'Not specified';
  const otherFeatures = car.features.filter(f => !fuelTypes.includes(f));

  const bookNowHref = '/book-now?type=car&name=' + encodeURIComponent(car.carType) + '&id=' + encodeURIComponent(car.id) + '&priceMMK=' + (cheapestPricing?.priceMMK || 0) + '&priceUSD=' + (cheapestPricing?.priceUSD || 0) + '&features=' + encodeURIComponent(car.features.join(', '));

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src={heroImage}
          alt={car.carType}
          width={1200}
          height={630}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#0A1628] text-sm font-bold">
              🚗 {car.carType}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-[#0A1628] text-sm backdrop-blur-sm border border-gray-200">
              {car.transmission}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-[#0A1628] text-sm backdrop-blur-sm border border-gray-200">
              {fuelType}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl text-[#0A1628] font-bold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {car.carType}
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl">
            {car.description || 'Experience the comfort of our ' + car.carType + '. Professional driver service included.'}
          </p>
        </div>
      </section>

      {/* Content */}
      
        <SocialShare url={typeof window !== "undefined" ? window.location.href : ""} title={"A9 Global Travel - Cars"} />
<section className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold">{car.capacity}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Capacity</p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold">{car.transmission}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Transmission</p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold capitalize">{fuelType}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Fuel</p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 border border-[#D4AF37]/10 text-center hover:border-[#D4AF37]/30 transition-colors">
                <svg className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-[#D4AF37] text-2xl font-bold">{car.seats}</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Seats</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl text-[#0A1628] font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <span className="w-8 h-0.5 bg-[#D4AF37] inline-block" />
                About This Vehicle
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">
                {car.description || 'Experience comfort and reliability with our ' + car.carType + '. Perfect for your travel needs in Myanmar, this vehicle comes with a professional driver and comprehensive insurance coverage.'}
              </p>
            </div>

            {/* Features */}
            {otherFeatures.length > 0 && (
              <div>
                <h2 className="text-xl text-[#0A1628] font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  <span className="w-8 h-0.5 bg-[#D4AF37] inline-block" />
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {otherFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl border border-[#D4AF37]/20 bg-gray-50 hover:border-[#D4AF37]/40 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing */}
            {car.pricing.length > 0 && (
              <div>
                <h2 className="text-xl text-[#0A1628] font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  <span className="w-8 h-0.5 bg-[#D4AF37] inline-block" />
                  Pricing
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {car.pricing.map((tier, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-[#D4AF37]/20 bg-gray-50 text-center hover:border-[#D4AF37]/40 transition-colors">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{tier.duration}</p>
                      <div className="space-y-0.5">
                        <p className="text-[#D4AF37] text-xl font-bold">{tier.priceMMK.toLocaleString()} Ks</p>
                        <p className="text-gray-500 text-sm">${tier.priceUSD.toLocaleString()} USD</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-[#D4AF37]/20 bg-gray-50 backdrop-blur-sm p-6 space-y-5 relative">
              {/* Price Header */}
              <div className="text-center">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Starting from</p>
                <p className="text-3xl font-bold text-[#D4AF37]">
                  {cheapestPricing.priceMMK.toLocaleString()} <span className="text-lg">Ks</span>
                </p>
                <p className="text-gray-500 text-sm mt-0.5">
                  ${cheapestPricing.priceUSD.toLocaleString()} USD / {cheapestPricing.duration}
                </p>
              </div>

              {/* Divider with gold */}
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
              </div>

              {/* Info Rows */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Vehicle Type</span>
                  <span className="text-[#0A1628] font-medium">{car.carType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Capacity</span>
                  <span className="text-[#0A1628] font-medium">{car.capacity} passengers</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Transmission</span>
                  <span className="text-[#0A1628] font-medium">{car.transmission}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Fuel Type</span>
                  <span className="text-[#0A1628] font-medium capitalize">{fuelType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Driver</span>
                  <span className="text-green-400 font-medium">Included ✓</span>
                </div>
                {otherFeatures.length > 0 && (
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Features</span>
                    <span className="text-[#0A1628] font-medium">{otherFeatures.length}</span>
                  </div>
                )}
              </div>

              {/* Book Now Button */}
              <a
                href={bookNowHref}
                className="block w-full py-3.5 rounded-xl text-center font-bold text-base bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#E5C048] hover:to-[#D4AF37] text-[#0A1628] shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 transition-all duration-300"
              >
                Book Now
              </a>

              <p className="text-center text-gray-500 text-xs">No payment required to book</p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-[#D4AF37]/10 text-center">
          <a href="/cars" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to All Cars
          </a>
        </div>
      </section>
      <RelatedItems section="cars" />
</main>
  );
}
