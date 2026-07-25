import Link from "next/link";
import { notFound } from "next/navigation";
import RelatedItems from '@/components/RelatedItems';
import DestImage from "./DestImage";

export const dynamic = 'force-dynamic';

interface PopularDestination {
  city: string;
  country: string;
  image: string;
  minPrice: string;
  bestTime?: string;
  description?: string;
  highlights?: string[];
}

const DEST_HERO = "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609663178_ta1biy-bangkok-x7Q8kUMuXRvj6qMJAZxBbawKS4zkjI.jpg";

const FALLBACK_DESTINATIONS: PopularDestination[] = [
  {
    city: "Bangkok", country: "Thailand",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609663178_ta1biy-bangkok-x7Q8kUMuXRvj6qMJAZxBbawKS4zkjI.jpg",
    minPrice: "From Ks 120,000",
    bestTime: "November to February (cool season)",
    description: "Bangkok is a vibrant metropolis where ancient temples meet modern skyscrapers. Explore the Grand Palace, cruise the Chao Phraya River, shop at Chatuk Market, and experience world-famous Thai street food.",
    highlights: ["Grand Palace", "Wat Arun", "Floating Markets", "Chatuchak Weekend Market", "Khao San Road", "Thai Street Food"],
  },
  {
    city: "Singapore", country: "Singapore",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609664529_gc0coa-singapore-1I4l0IofxTbJLSLc5dELHgf1XUPxpL.jpg",
    minPrice: "From Ks 250,000",
    bestTime: "February to April (dry season)",
    description: "Singapore is a dazzling city-state of futuristic architecture, lush gardens, and multicultural neighborhoods. Visit Gardens by the Bay, explore Sentosa Island, and enjoy world-class dining.",
    highlights: ["Marina Bay Sands", "Gardens by the Bay", "Sentosa Island", "Universal Studios", "Chinatown", "Orchard Road"],
  },
  {
    city: "Tokyo", country: "Japan",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609665668_3ecvek-tokyo-TYjK5as5wFpIatqF1kbSi4h2t3ZUT1.jpg",
    minPrice: "From Ks 550,000",
    bestTime: "March to May (cherry blossom) or October to November (autumn)",
    description: "Tokyo blends ultramodern technology with ancient traditions. From neon-lit Shibuya to serene Meiji Shrine, the city offers endless discoveries for every traveler.",
    highlights: ["Shibuya Crossing", "Meiji Shrine", "Tsukiji Fish Market", "Akihabara", "Harajuku", "Tokyo Tower"],
  },
  {
    city: "Seoul", country: "South Korea",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609666783_tpdn63-seoul-2vEDeNREwxMmMcKljIrmhIkNRzMx2x.jpg",
    minPrice: "From Ks 550,000",
    bestTime: "March to May and September to November",
    description: "Seoul is a dynamic city where ancient palaces sit alongside K-pop culture. Explore Gyeongbokgung Palace, shop in Myeongdong, and indulge in Korean BBQ and street food.",
    highlights: ["Gyeongbokgung Palace", "Bukchon Hanok Village", "Myeongdong Shopping", "N Seoul Tower", "Hongdae", "Korean Street Food"],
  },
  {
    city: "Dubai", country: "United Arab Emirates",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609667895_nhc8s9-dubai-d3lPglj2ETCLL85cMyDIUrqR87uSJr.jpg",
    minPrice: "From Ks 680,000",
    bestTime: "November to March (mild weather)",
    description: "Dubai is a city of superlatives with the tallest building, largest mall, and most luxurious hotels. Experience desert safaris, world-class shopping, and futuristic architecture.",
    highlights: ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Desert Safari", "Dubai Marina", "Gold Souk"],
  },
  {
    city: "Paris", country: "France",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609669026_5swn98-paris-NP2sb2JVZ4tGQYsaHWnFEQZrwH3W4h.jpg",
    minPrice: "From Ks 850,000",
    bestTime: "April to June and September to October",
    description: "Paris is the city of love, lights, and timeless elegance. From the Eiffel Tower to charming cafes, every corner of Paris tells a story of art, culture, and romance.",
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame", "Montmartre", "Seine River Cruise", "Champs-Elysees"],
  },
  {
    city: "Bali", country: "Indonesia",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609670120_iixb10-bali-e92X2ozIcinwD996tg4B5u2BXS0cdz.jpg",
    minPrice: "From Ks 180,000",
    bestTime: "April to October (dry season)",
    description: "Bali is the Island of Gods, offering stunning beaches, lush rice terraces, ancient temples, and a vibrant arts scene. Perfect for relaxation and cultural exploration.",
    highlights: ["Ubud Rice Terraces", "Tanah Lot Temple", "Seminyak Beach", "Uluwatu Cliff Temple", "Monkey Forest", "Balinese Spa"],
  },
  {
    city: "Maldives", country: "Maldives",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609671009_3evgmu-maldives-hypfQQJCg06kuyANjh41tsEh3jJ1iZ.jpg",
    minPrice: "From Ks 380,000",
    bestTime: "November to April (dry season)",
    description: "The Maldives is a tropical paradise of overwater villas, crystal-clear lagoons, and pristine white-sand beaches. The ultimate luxury getaway for honeymooners and beach lovers.",
    highlights: ["Overwater Villas", "Snorkeling", "Dolphin Watching", "Sandbank Picnics", "Underwater Restaurant", "Sunset Cruises"],
  },
  {
    city: "Yangon", country: "Myanmar",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609672110_hoxenr-yangon-ZR2KEYFv4nTcNHRSbkTYE73ZoXIegP.jpg",
    minPrice: "From Ks 80,000",
    bestTime: "November to February (cool season)",
    description: "Yangon is Myanmar largest city and former capital, home to the magnificent Shwedagon Pagoda. Explore colonial architecture, bustling markets, and authentic Burmese cuisine.",
    highlights: ["Shwedagon Pagoda", "Bogyoke Market", "Kandawgyi Lake", "Colonial Buildings", "Chinatown", "Burmese Tea Shops"],
  },
  {
    city: "Bagan", country: "Myanmar",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609673423_cxib2z-bagan-XuauRMTtDqUuuRh7T11ier0WFheWOP.jpg",
    minPrice: "From Ks 95,000",
    bestTime: "November to February (cool season)",
    description: "Bagan is an archaeological wonderland with over 2,000 ancient temples spread across a vast plain. Hot air balloon rides at sunrise offer unforgettable views.",
    highlights: ["Ananda Temple", "Shwezigon Pagoda", "Sunrise Ballooning", "E-Bike Temple Tour", "Irrawaddy River Sunset", "Lacquerware Workshops"],
  },
  {
    city: "Ho Chi Minh City", country: "Vietnam",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609674645_4crguu-ho-chi-minh-city-BcBT3Ux26O1qAcrfZ3qiJWRIqtF9tM.jpg",
    minPrice: "From Ks 105,000",
    bestTime: "December to April (dry season)",
    description: "Ho Chi Minh City (Saigon) is Vietnam economic powerhouse with vibrant energy. Explore the Cu Chi Tunnels, taste amazing pho, and experience the buzzing nightlife.",
    highlights: ["Cu Chi Tunnels", "Ben Thanh Market", "War Remnants Museum", "Notre-Dame Basilica", "Bui Vien Walking Street", "Vietnamese Coffee"],
  },
  {
    city: "Kuala Lumpur", country: "Malaysia",
    image: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609676271_plrv46-kuala-lumpur-9BY1o9HTEVFgEy8zC00KyY98WYR3Ze.jpg",
    minPrice: "From Ks 150,000",
    bestTime: "May to July and December to February",
    description: "Kuala Lumpur is a melting pot of cultures with the iconic Petronas Twin Towers, colorful Batu Caves, and incredible street food from Malay, Chinese, and Indian traditions.",
    highlights: ["Petronas Twin Towers", "Batu Caves", "Jalan Alor Food Street", "Bukit Bintang", "Merdeka Square", "KL Bird Park"],
  },
];

function toSlug(text: string): string {
  return (text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default async function DestinationPage({ params }: { params: { city: string } }) {
  const key = params.city.toLowerCase();
  const dest = FALLBACK_DESTINATIONS.find(
    (d) => toSlug(d.city) === key
  );

  if (!dest) notFound();

  const highlights = dest.highlights || (dest.description
    ? dest.description.split(/[,.]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0).slice(0, 6)
    : []);

  return (
    <main className="min-h-screen bg-white">
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Link href="/#popular-destinations" className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all text-sm">
          ← Back to Destinations
        </Link>
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

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 text-sm">
        <Link href="/" className="text-gray-500 hover:text-[#D4AF37]">Home</Link>
        <span className="mx-2 text-gray-300">/</span>
        <Link href="/#popular-destinations" className="text-gray-500 hover:text-[#D4AF37]">Destinations</Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-[#0A1628] font-medium">{dest.city}</span>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
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

        {dest.bestTime && (
          <section className="bg-gradient-to-r from-[#D4AF37]/5 to-[#D4AF37]/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-[#0A1628] mb-2">
              Best Time to Visit
            </h2>
            <p className="text-gray-700 text-lg">{dest.bestTime}</p>
          </section>
        )}

          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-[#0A1628] to-[#162D50] p-6 text-white">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Starting from</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold" style={{"fontFamily": "'Playfair Display', Georgia, serif"}}>
                      {dest.minPrice}
                    </span>
                  </div>
                  {dest.bestTime && (<p className="text-white/50 text-sm mt-1">Best time: {dest.bestTime}</p>)}
                </div>
                <div className="p-6 space-y-4">
                  <Link
                    href={`/book-now?type=tour&destination=${encodeURIComponent(dest.city)}`}
                    className="block w-full py-3.5 rounded-xl text-center font-bold text-base bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:scale-[1.02] transition-all duration-300"
                  >
                    Explore {dest.city}
                  </Link>
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {dest.city}, {dest.country}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      {dest.highlights ? dest.highlights.length + " Highlights" : "Popular Destination"}
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href="/#popular-destinations"
                className="block w-full py-3 rounded-xl text-center font-semibold text-sm border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A1628] transition-all duration-300"
              >
                ← Back to Destinations
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#D4AF37]/10">
          <h2 className="text-2xl font-bold text-[#0A1628] mb-6" style={{"fontFamily": "'Playfair Display', Georgia, serif"}}>
            Discover {dest.city}
          </h2>
          <RelatedItems section="destinations" excludeSlug={params.city} destination={(dest.city || "") + ", " + (dest.country || "")} />
        </div>

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
