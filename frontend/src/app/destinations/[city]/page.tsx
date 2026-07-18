import { Metadata } from "next";
import Link from "next/link";
import DestImage from "./DestImage";

// Destination data
const DESTINATIONS: Record<string, { city: string; country: string; description: string; image: string; highlights: string[]; bestTime: string; tours: { name: string; slug: string; price: string }[] }> = {
  paris: {
    city: "Paris", country: "France", image: "/images_v2/dest-paris-v2.jpg",
    description: "Experience the City of Light — from the iconic Eiffel Tower to world-class museums, charming cafes, and haute couture shopping. Paris offers romance, culture, and gastronomy like no other.",
    highlights: ["Eiffel Tower", "Louvre Museum", "Seine River Cruise", "Notre-Dame Cathedral", "Montmartre", "Champs-Élysées"],
    bestTime: "April-June & September-October",
    tours: [{ name: "Paris Highlights 5 Days", slug: "paris-highlights", price: "Ks 850,000" },{ name: "Paris & Versailles Premium", slug: "paris-versailles", price: "Ks 1,200,000" }],
  },
  dubai: {
    city: "Dubai", country: "UAE", image: "/images_v2/dest-dubai-v2.jpg",
    description: "A dazzling metropolis where ultra-modern architecture meets Arabian tradition. From the world's tallest building to golden deserts, Dubai is a city of superlatives.",
    highlights: ["Burj Khalifa", "Palm Jumeirah", "Desert Safari", "Dubai Mall", "Gold Souk", "Dubai Marina"],
    bestTime: "November-March",
    tours: [{ name: "Dubai Ultimate 4 Days", slug: "dubai-ultimate", price: "Ks 680,000" },{ name: "Dubai & Abu Dhabi Combo", slug: "dubai-abu-dhabi", price: "Ks 950,000" }],
  },
  korea: {
    city: "Korea", country: "South Korea", image: "/images_v2/dest-korea-v2.jpg",
    description: "Discover the perfect blend of ancient traditions and cutting-edge modernity. From Seoul's vibrant streets to tranquil temples, Korea captivates every traveler.",
    highlights: ["Gyeongbokgung Palace", "Myeongdong Shopping", "N Seoul Tower", "Bukchon Hanok Village", "DMZ Tour", "Korean BBQ"],
    bestTime: "March-May & September-November",
    tours: [{ name: "Seoul Explorer 4 Days", slug: "seoul-explorer", price: "Ks 550,000" },{ name: "Korea Full Discovery 7 Days", slug: "korea-discovery", price: "Ks 980,000" }],
  },
  thailand: {
    city: "Thailand", country: "Thailand", image: "/images_v2/hero-thailand-v2.jpg",
    description: "The Land of Smiles welcomes you with stunning beaches, ornate temples, vibrant street food, and warm hospitality. An affordable paradise for every type of traveler.",
    highlights: ["Grand Palace", "Phi Phi Islands", "Floating Market", "Chiang Mai Temples", "Thai Massage", "Street Food Tour"],
    bestTime: "November-February",
    tours: [{ name: "Bangkok & Pattaya 4 Days", slug: "bangkok-pattaya", price: "Ks 150,000" },{ name: "Phuket Beach Holiday", slug: "phuket-beach", price: "Ks 280,000" }],
  },
  singapore: {
    city: "Singapore", country: "Singapore", image: "/images_v2/hero-singapore-v2.jpg",
    description: "A futuristic garden city where cultures blend seamlessly. World-class attractions, incredible food, and pristine streets make Singapore a must-visit destination.",
    highlights: ["Marina Bay Sands", "Gardens by the Bay", "Sentosa Island", "Universal Studios", "Chinatown", "Orchard Road"],
    bestTime: "February-April",
    tours: [{ name: "Singapore Highlights 3 Days", slug: "singapore-highlights", price: "Ks 250,000" },{ name: "Singapore & Sentosa Family", slug: "singapore-sentosa", price: "Ks 420,000" }],
  },
  japan: {
    city: "Japan", country: "Japan", image: "/images_v2/dest-japan-v2.jpg",
    description: "An enchanting land where ancient temples meet neon-lit futures. Japan offers unparalleled cuisine, impeccable hospitality, and breathtaking seasonal beauty.",
    highlights: ["Mount Fuji", "Fushimi Inari Shrine", "Shibuya Crossing", "Arashiyama Bamboo Grove", "Tsukiji Fish Market", "Onsen Hot Springs"],
    bestTime: "March-May (cherry blossoms) & October-November",
    tours: [{ name: "Tokyo & Kyoto 6 Days", slug: "tokyo-kyoto", price: "Ks 780,000" },{ name: "Japan Grand Tour 10 Days", slug: "japan-grand", price: "Ks 1,500,000" }],
  },
  bagan: {
    city: "Bagan", country: "Myanmar", image: "/images_v2/tour-bagan-v2.jpg",
    description: "Step back in time among thousands of ancient temples dotting the vast Bagan plains. A UNESCO World Heritage site and Myanmar's most iconic destination.",
    highlights: ["Ananda Temple", "Shwezigon Pagoda", "Hot Air Balloon", "Sunset at Shwesandaw", "Bagan Archaeological Museum", "Lacquerware Workshops"],
    bestTime: "November-February",
    tours: [{ name: "Bagan Temple Explorer 3 Days", slug: "bagan-explorer", price: "Ks 320,000" }],
  },
  yangon: {
    city: "Yangon", country: "Myanmar", image: "/images_v2/tour-yangon-v2.jpg",
    description: "Myanmar's largest city blends colonial charm with spiritual wonder. The golden Shwedagon Pagoda dominates the skyline while bustling markets and tea shops pulse with life.",
    highlights: ["Shwedagon Pagoda", "Bogyoke Market", "Kandawgyi Lake", "Colonial Architecture", "Yangon Circular Train", "Chinatown"],
    bestTime: "November-February",
    tours: [{ name: "Yangon City Highlights", slug: "yangon-city-lights", price: "Ks 180,000" }],
  },
  mandalay: {
    city: "Mandalay", country: "Myanmar", image: "/images_v2/tour-mandalay-v2.jpg",
    description: "The cultural heart of Myanmar and last royal capital. Explore ancient monasteries, the world's longest teak bridge, and panoramic views from Mandalay Hill.",
    highlights: ["U Bein Bridge", "Mandalay Hill", "Mahamuni Pagoda", "Shwenandaw Monastery", "Kuthodaw Pagoda", "Jade Market"],
    bestTime: "November-February",
    tours: [{ name: "Mandalay Royal Tour", slug: "mandalay-royal", price: "Ks 250,000" }],
  },
  inle: {
    city: "Inle Lake", country: "Myanmar", image: "/images_v2/tour-inle-v2.jpg",
    description: "A serene highland lake famous for its leg-rowing fishermen, floating gardens, and stilt-house villages. One of Southeast Asia's most unique landscapes.",
    highlights: ["Leg-rowing Fishermen", "Floating Gardens", "Phaung Daw Oo Pagoda", "Silk Weaving", "Nga Phe Kyaung Monastery", "Indein Village"],
    bestTime: "October-February",
    tours: [{ name: "Inle Lake Discovery", slug: "inle-discovery", price: "Ks 280,000" }],
  },
};

const DEST_HERO = "/images_v2/hero-destinations-v2.jpg";

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const dest = DESTINATIONS[params.city.toLowerCase()];
  if (!dest) return { title: "Destination | A9 Travel" };
  return { title: `${dest.city}, ${dest.country} | A9 Travel`, description: dest.description.slice(0, 160) };
}

export default function DestinationPage({ params }: { params: { city: string } }) {
  const key = params.city.toLowerCase();
  const dest = DESTINATIONS[key];

  if (!dest) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-20 text-center">
        <h1 className="text-4xl font-bold text-[#0A1628] mb-4">Destination Not Found</h1>
        <p className="text-gray-600 mb-8">We couldn't find details for "{params.city}".</p>
        <Link href="/" className="inline-block bg-[#D4AF37] text-white font-semibold px-8 py-3 rounded-full">Back to Home</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <DestImage src={dest.image} alt={dest.city} fallback={DEST_HERO} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
          <p className="text-white/70 text-sm uppercase tracking-widest mb-1">{dest.country}</p>
          <h1 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{dest.city}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Description */}
        <section>
          <h2 className="text-2xl font-bold text-[#0A1628] mb-4">About {dest.city}</h2>
          <p className="text-gray-700 leading-relaxed text-lg">{dest.description}</p>
        </section>

        {/* Highlights */}
        {dest.highlights.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[#0A1628] mb-6">Top Highlights</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {dest.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-[#D4AF37]/30 transition-colors">
                  <span className="w-8 h-8 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center text-sm font-bold">{i + 1}</span>
                  <span className="text-gray-800 font-medium">{h}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Best Time */}
        <section className="bg-gradient-to-r from-[#D4AF37]/5 to-[#D4AF37]/10 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#0A1628] mb-2">Best Time to Visit</h2>
          <p className="text-gray-700 text-lg">{dest.bestTime}</p>
        </section>

        {/* Available Tours */}
        {dest.tours.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[#0A1628] mb-6">Available Tours in {dest.city}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dest.tours.map((t, i) => (
                <Link key={i} href={`/tours/${t.slug}`} className="group flex items-center justify-between bg-white border border-gray-200 rounded-xl p-6 hover:border-[#D4AF37]/40 hover:shadow-lg transition-all">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A1628] group-hover:text-[#D4AF37] transition-colors">{t.name}</h3>
                    <p className="text-[#D4AF37] font-bold mt-1">{t.price}</p>
                  </div>
                  <span className="text-[#D4AF37] group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="text-center py-12">
          <h2 className="text-2xl font-bold text-[#0A1628] mb-4">Ready to Explore {dest.city}?</h2>
          <Link href={`/book-now?type=tour&destination=${encodeURIComponent(dest.city)}`} className="inline-block bg-[#D4AF37] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#C19B2F] transition-colors">
            Book Your Trip to {dest.city}
          </Link>
        </section>
      </div>
    </main>
  );
}
