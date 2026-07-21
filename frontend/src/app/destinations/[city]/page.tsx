"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import DestImage from "./DestImage";

interface PopularDestination {
  city: string;
  country: string;
  image: string;
  minPrice: string;
  bestTime?: string;
  description?: string;
  highlights?: string[];
}

const DEST_HERO = "/images_v2/hero-destinations-v2.jpg";

const FALLBACK_DESTINATIONS: PopularDestination[] = [
  {
    city: "Bangkok", country: "Thailand",
    image: "/images_v2/dest-thailand-v2.jpg",
    minPrice: "From Ks 120,000",
    bestTime: "November to February (cool season)",
    description: "Bangkok is a vibrant metropolis where ancient temples meet modern skyscrapers. Explore the Grand Palace, cruise the Chao Phraya River, shop at Chatuchak Market, and experience world-famous Thai street food.",
    highlights: ["Grand Palace", "Wat Arun", "Floating Markets", "Chatuchak Weekend Market", "Khao San Road", "Thai Street Food"],
  },
  {
    city: "Singapore", country: "Singapore",
    image: "/images_v2/hero-singapore-v2.jpg",
    minPrice: "From Ks 250,000",
    bestTime: "February to April (dry season)",
    description: "Singapore is a dazzling city-state of futuristic architecture, lush gardens, and multicultural neighborhoods. Visit Gardens by the Bay, explore Sentosa Island, and enjoy world-class dining.",
    highlights: ["Marina Bay Sands", "Gardens by the Bay", "Sentosa Island", "Universal Studios", "Chinatown", "Orchard Road"],
  },
  {
    city: "Tokyo", country: "Japan",
    image: "/images_v2/dest-japan-v2.jpg",
    minPrice: "From Ks 550,000",
    bestTime: "March to May (cherry blossom) or October to November (autumn)",
    description: "Tokyo blends ultramodern technology with ancient traditions. From neon-lit Shibuya to serene Meiji Shrine, the city offers endless discoveries for every traveler.",
    highlights: ["Shibuya Crossing", "Meiji Shrine", "Tsukiji Fish Market", "Akihabara", "Harajuku", "Tokyo Tower"],
  },
  {
    city: "Seoul", country: "South Korea",
    image: "/images_v2/dest-korea-v2.jpg",
    minPrice: "From Ks 550,000",
    bestTime: "March to May and September to November",
    description: "Seoul is a dynamic city where ancient palaces sit alongside K-pop culture. Explore Gyeongbokgung Palace, shop in Myeongdong, and indulge in Korean BBQ and street food.",
    highlights: ["Gyeongbokgung Palace", "Bukchon Hanok Village", "Myeongdong Shopping", "N Seoul Tower", "Hongdae", "Korean Street Food"],
  },
  {
    city: "Dubai", country: "United Arab Emirates",
    image: "/images_v2/dest-dubai-v2.jpg",
    minPrice: "From Ks 680,000",
    bestTime: "November to March (mild weather)",
    description: "Dubai is a city of superlatives with the tallest building, largest mall, and most luxurious hotels. Experience desert safaris, world-class shopping, and futuristic architecture.",
    highlights: ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Desert Safari", "Dubai Marina", "Gold Souk"],
  },
  {
    city: "Paris", country: "France",
    image: "/images_v2/dest-paris-v2.jpg",
    minPrice: "From Ks 850,000",
    bestTime: "April to June and September to October",
    description: "Paris is the city of love, lights, and timeless elegance. From the Eiffel Tower to charming cafes, every corner of Paris tells a story of art, culture, and romance.",
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame", "Montmartre", "Seine River Cruise", "Champs-Elysees"],
  },
  {
    city: "Bali", country: "Indonesia",
    image: "/images_v2/hero-thailand-v2.jpg",
    minPrice: "From Ks 180,000",
    bestTime: "April to October (dry season)",
    description: "Bali is the Island of Gods, offering stunning beaches, lush rice terraces, ancient temples, and a vibrant arts scene. Perfect for relaxation and cultural exploration.",
    highlights: ["Ubud Rice Terraces", "Tanah Lot Temple", "Seminyak Beach", "Uluwatu Cliff Temple", "Monkey Forest", "Balinese Spa"],
  },
  {
    city: "Maldives", country: "Maldives",
    image: "/images_v2/dest-maldives-v2.jpg",
    minPrice: "From Ks 380,000",
    bestTime: "November to April (dry season)",
    description: "The Maldives is a tropical paradise of overwater villas, crystal-clear lagoons, and pristine white-sand beaches. The ultimate luxury getaway for honeymooners and beach lovers.",
    highlights: ["Overwater Villas", "Snorkeling", "Dolphin Watching", "Sandbank Picnics", "Underwater Restaurant", "Sunset Cruises"],
  },
  {
    city: "Yangon", country: "Myanmar",
    image: "/images_v2/dest-yangon-v2.jpg",
    minPrice: "From Ks 80,000",
    bestTime: "November to February (cool season)",
    description: "Yangon is Myanmar largest city and former capital, home to the magnificent Shwedagon Pagoda. Explore colonial architecture, bustling markets, and authentic Burmese cuisine.",
    highlights: ["Shwedagon Pagoda", "Bogyoke Market", "Kandawgyi Lake", "Colonial Buildings", "Chinatown", "Burmese Tea Shops"],
  },
  {
    city: "Bagan", country: "Myanmar",
    image: "/images_v2/tour-bagan-v2.jpg",
    minPrice: "From Ks 95,000",
    bestTime: "November to February (cool season)",
    description: "Bagan is an archaeological wonderland with over 2,000 ancient temples spread across a vast plain. Hot air balloon rides at sunrise offer unforgettable views.",
    highlights: ["Ananda Temple", "Shwezigon Pagoda", "Sunrise Ballooning", "E-Bike Temple Tour", "Irrawaddy River Sunset", "Lacquerware Workshops"],
  },
  {
    city: "Ho Chi Minh City", country: "Vietnam",
    image: "/images_v2/visa4-v3.jpg",
    minPrice: "From Ks 105,000",
    bestTime: "December to April (dry season)",
    description: "Ho Chi Minh City (Saigon) is Vietnam economic powerhouse with vibrant energy. Explore the Cu Chi Tunnels, taste amazing pho, and experience the buzzing nightlife.",
    highlights: ["Cu Chi Tunnels", "Ben Thanh Market", "War Remnants Museum", "Notre-Dame Basilica", "Bui Vien Walking Street", "Vietnamese Coffee"],
  },
  {
    city: "Kuala Lumpur", country: "Malaysia",
    image: "/images_v2/dest-maldives-v2.jpg",
    minPrice: "From Ks 150,000",
    bestTime: "May to July and December to February",
    description: "Kuala Lumpur is a melting pot of cultures with the iconic Petronas Twin Towers, colorful Batu Caves, and incredible street food from Malay, Chinese, and Indian traditions.",
    highlights: ["Petronas Twin Towers", "Batu Caves", "Jalan Alor Food Street", "Bukit Bintang", "Merdeka Square", "KL Bird Park"],
  },
];

function toSlug(text: string): string {
  return (text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function DestinationPage({ params }: { params: { city: string } }) {
  const router = useRouter();
  const key = params.city.toLowerCase();
  const [dest, setDest] = useState<PopularDestination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch("/api/admin/site-config");
        if (res.ok) {
          const data = await res.json();
          const popularDestinations: PopularDestination[] =
            data.popularDestinations ||
            data.data?.popularDestinations ||
            [];
          const found = popularDestinations.find(
            (d: PopularDestination) => toSlug(d.city) === key
          );
          if (found) {
            setDest(found);
          } else {
            // Fallback: check static FALLBACK_DESTINATIONS
            const fb = FALLBACK_DESTINATIONS.find(
              (d: PopularDestination) => toSlug(d.city) === key
            );
            setDest(fb || null);
          }
        } else {
          // API failed, try fallback
          const fb = FALLBACK_DESTINATIONS.find(
            (d: PopularDestination) => toSlug(d.city) === key
          );
          setDest(fb || null);
        }
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
        // Try fallback on error
        const fb = FALLBACK_DESTINATIONS.find(
          (d: PopularDestination) => toSlug(d.city) === key
        );
        setDest(fb || null);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, [key]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-20 flex items-center justify-center">
        <div className="text-[#D4AF37]/70 animate-pulse text-lg">Loading destination...</div>
      </main>
    );
  }

  if (!dest) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-20 text-center">
        <h1 className="text-4xl font-bold text-[#0A1628] mb-4">Destination Not Found</h1>
        <p className="text-gray-600 mb-8">
          We could not find details for "{params.city}". This destination may have been removed or is not yet available.
        </p>
        <BackButton />
      </main>
    );
  }

  // Build highlights from description or leave empty
  const highlights = dest.highlights || (dest.description
    ? dest.description.split(/[,.]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0).slice(0, 6)
    : []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <BackButton />

        <DestImage
          src={dest.image || DEST_HERO}
          alt={dest.city}
          fallback={DEST_HERO}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
          <p className="text-white/70 text-sm uppercase tracking-widest mb-1">
            {dest.country}
          </p>
          <h1
            className="text-3xl md:text-5xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {dest.city}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Description */}
        {dest.description && (
          <section>
            <h2 className="text-2xl font-bold text-[#0A1628] mb-4">
              About {dest.city}
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {dest.description}
            </p>
          </section>
        )}

        {/* Price */}
        {dest.minPrice && (
          <section className="bg-gradient-to-r from-[#D4AF37]/5 to-[#D4AF37]/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-[#0A1628] mb-2">
              Starting Price
            </h2>
            <p className="text-[#D4AF37] font-bold text-2xl">
              {dest.minPrice}
            </p>
          </section>
        )}

        {/* Highlights */}
        {highlights.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[#0A1628] mb-6">
              Top Highlights
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {highlights.map((h: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-[#D4AF37]/30 transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="text-gray-800 font-medium">{h}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Best Time */}
        {dest.bestTime && (
          <section className="bg-gradient-to-r from-[#D4AF37]/5 to-[#D4AF37]/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-[#0A1628] mb-2">
              Best Time to Visit
            </h2>
            <p className="text-gray-700 text-lg">{dest.bestTime}</p>
          </section>
        )}

        {/* CTA */}
        <section className="text-center py-12">
          <h2 className="text-2xl font-bold text-[#0A1628] mb-4">
            Ready to Explore {dest.city}?
          </h2>
          <Link
            href={`/book-now?type=tour&destination=${encodeURIComponent(dest.city)}`}
            className="inline-block bg-[#D4AF37] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#C19B2F] transition-colors"
          >
            Book Your Trip to {dest.city}
          </Link>
        </section>
      </div>
    </main>
  );
}