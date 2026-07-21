'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Newsletter from '@/components/Newsletter';
interface BlogPost {
  _id: string; slug: string; title: string; content: string; image: string;
  author: string; tags: string[]; createdAt: string;
}

const FALLBACK_POSTS: BlogPost[] = [
  { _id: '1', slug: 'top-10-destinations-myanmar', title: 'Top 10 Must-Visit Destinations in Myanmar',
    content: 'Myanmar is a land of golden pagodas, ancient temples, and breathtaking landscapes. From the ancient plains of Bagan with over 2,000 temples to the serene waters of Inle Lake, Myanmar offers experiences found nowhere else on Earth.\n\n## Yangon\nStart your journey in Yangon, where the magnificent Shwedagon Pagoda dominates the skyline. This gilded stupa is the most sacred Buddhist pagoda in Myanmar.\n\n## Bagan\nNext, fly to Bagan — a UNESCO World Heritage site with thousands of temples spread across a vast plain. A hot air balloon ride at sunrise is an absolute must.\n\n## Mandalay\nThe cultural capital offers the iconic U Bein Bridge at sunset and ancient royal palace grounds.\n\n## Inle Lake\nFamous for its leg-rowing fishermen and floating gardens, Inle Lake is one of Southeast Asia\'s most unique landscapes.\n\nBook your Myanmar adventure with A9 Global Travel today!',
    image: '/images_v2/blog1-v2.jpg', author: 'A9 Global Team', tags: ['Myanmar', 'Travel Tips', 'Destinations'], createdAt: '2024-12-15' },
  { _id: '2', slug: 'flight-deals-guide', title: 'How to Get the Best Flight Deals in 2025',
    content: 'Booking flights can be expensive, but with these insider tips you can save hundreds on your next trip.\n\n## Book at the Right Time\nStudies show that booking 6-8 weeks in advance for international flights yields the best prices. Tuesday and Wednesday afternoons often have lower fares.\n\n## Use Price Alerts\nSet up alerts on Google Flights and Skyscanner to track price changes for your desired routes.\n\n## Be Flexible with Dates\nFlying mid-week and during off-peak seasons can save you 30-50% on airfare.\n\n## Consider Nearby Airports\nSometimes flying into a nearby city and taking ground transport is significantly cheaper.\n\nContact A9 Global Travel for exclusive flight deals and package discounts!',
    image: '/images_v2/blog2-v2.jpg', author: 'A9 Global Team', tags: ['Flights', 'Travel Tips', 'Budget'], createdAt: '2024-12-20' },
  { _id: '3', slug: 'visa-guide-2025', title: 'Visa Guide 2025: Everything You Need to Know',
    content: 'Planning an international trip? Our comprehensive visa guide covers requirements for popular destinations.\n\n## Thailand\nMyanmar citizens can enjoy visa-free travel to Thailand for up to 14 days. For longer stays, apply for a tourist visa at the Thai embassy.\n\n## Singapore\nE-visa available for Myanmar passport holders. Processing takes 3-5 working days.\n\n## Vietnam\nVisa on arrival and e-visa options available. E-visa is recommended for smoother entry.\n\n## Dubai/UAE\nVisa processing through authorized agencies. Requires bank statements, hotel bookings, and return tickets.\n\n## Japan\nTourist visa requires detailed itinerary, bank statements, and letter of employment.\n\nA9 Global Travel handles all visa processing — contact us to get started!',
    image: '/images_v2/blog3-v2.jpg', author: 'A9 Global Team', tags: ['Visa', 'Guide', 'International'], createdAt: '2025-01-05' },
  { _id: '4', slug: 'best-time-visit-thailand', title: 'Best Time to Visit Thailand: Month by Month Guide',
    content: 'Thailand welcomes visitors year-round, but the experience varies dramatically by season.\n\n## November – February (Cool Season)\nThe best time to visit. Temperatures are pleasant (25-30°C), humidity is low, and rainfall is minimal. Perfect for beach holidays and temple exploration.\n\n## March – May (Hot Season)\nTemperatures soar to 35-40°C. Songkran (Thai New Year) in April is an incredible water festival experience.\n\n## June – October (Rainy Season)\nLush green landscapes, fewer tourists, and lower prices. Rain usually comes in short bursts. Great for budget travelers.\n\nBook your Thailand package with A9 Global starting from Ks 150,000!',
    image: '/images_v2/blog4-v2.jpg', author: 'A9 Global Team', tags: ['Thailand', 'Seasons', 'Travel Tips'], createdAt: '2025-01-10' },
  { _id: '5', slug: 'top-5-luxury-hotels-yangon', title: 'Top 5 Luxury Hotels in Yangon for Business Travelers',
    content: 'Yangon offers world-class accommodations blending colonial charm with modern luxury.\n\n## 1. The Strand Yangon\nA legendary colonial-era hotel restored to its former glory. Butler service, fine dining, and timeless elegance.\n\n## 2. Sule Shangri-La\nPrime location near Sule Pagoda with panoramic city views, excellent business facilities, and international dining.\n\n## 3. Sedona Hotel Yangon\nSpacious suites with Inya Lake views, extensive fitness facilities, and multiple restaurants.\n\n## 4. Novotel Yangon Max\nModern rooms, rooftop pool, and excellent value for business travelers.\n\n## 5. Pan Pacific Yangon\nLuxurious rooms with stunning Shwedagon views, world-class spa, and gourmet dining.\n\nBook your stay through A9 Global for exclusive corporate rates!',
    image: '/images_v2/hotel1-v2.jpg', author: 'A9 Global Team', tags: ['Hotels', 'Yangon', 'Luxury'], createdAt: '2025-01-15' },
  { _id: '6', slug: 'dubai-travel-guide', title: 'Dubai Travel Guide: What to See, Do, and Eat',
    content: 'Dubai is a city of superlatives — the tallest, the largest, the most luxurious. Here\'s your complete guide to exploring this dazzling metropolis.\n\n## Top Attractions\n- Burj Khalifa: The world\'s tallest building with observation decks on the 124th and 148th floors\n- Palm Jumeirah: Iconic man-made island with luxury resorts and Aquaventure Waterpark\n- Dubai Mall: Over 1,200 shops plus an aquarium, ice rink, and VR park\n- Desert Safari: Dune bashing, camel rides, and traditional BBQ dinner under the stars\n\n## Food Scene\nFrom Michelin-starred restaurants to authentic street food, Dubai is a food lover\'s paradise.\n\nBook your Dubai package from Ks 680,000 with A9 Global!',
    image: '/images_v2/dest-dubai-v2.jpg', author: 'A9 Global Team', tags: ['Dubai', 'Destinations', 'Guide'], createdAt: '2025-01-20' },
  { _id: '7', slug: 'travel-insurance-why-need', title: 'Why You Need Travel Insurance: Real Stories from Travelers',
    content: 'Travel insurance isn\'t just paperwork — it can be a lifesaver. Here are real reasons why every traveler should be covered.\n\n## Medical Emergencies\nA sudden illness or accident abroad can cost thousands in medical bills. Insurance covers hospitalization, emergency evacuation, and repatriation.\n\n## Trip Cancellation\nFlights get canceled, family emergencies happen. Insurance protects your non-refundable expenses.\n\n## Lost Baggage\nAirlines lose millions of bags each year. Insurance covers essentials while you wait for your luggage.\n\n## Real Story\nA traveler in Bagan suffered a broken ankle during a temple visit. Without insurance, the air ambulance evacuation would have cost $8,000. With A9\'s premium insurance, it was fully covered.\n\nProtect your trip — get A9 Travel Insurance from just Ks 15,000 per trip!',
    image: '/images_v2/ins1-v2.jpg', author: 'A9 Global Team', tags: ['Insurance', 'Safety', 'Tips'], createdAt: '2025-01-25' },
  { _id: '8', slug: 'korean-food-guide', title: 'Korean Food Lover\'s Guide: 15 Must-Try Dishes in Seoul',
    content: 'Korean cuisine is taking the world by storm. Here are the dishes you absolutely cannot miss on your Seoul trip.\n\n## Must-Try Dishes\n- Korean BBQ (Samgyeopsal): Grilled pork belly wrapped in lettuce with ssamjang sauce\n- Bibimbap: Mixed rice bowl with vegetables, egg, and gochujang\n- Korean Fried Chicken: Double-fried to crispy perfection with sweet-spicy sauce\n- Tteokbokki: Chewy rice cakes in spicy gochujang sauce\n- Kimchi Jjigae: Hearty kimchi stew — Korea\'s ultimate comfort food\n- Japchae: Glass noodles stir-fried with vegetables\n\n## Food Streets\nVisit Myeongdong for street food, Gwangjang Market for traditional eats, and Hongdae for trendy cafes.\n\nBook your Korea food tour with A9 Global from Ks 550,000!',
    image: '/images_v2/dest-korea-v2.jpg', author: 'A9 Global Team', tags: ['Korea', 'Food', 'Culture'], createdAt: '2025-02-01' },
  { _id: '9', slug: 'sustainable-travel-tips', title: '10 Easy Ways to Travel More Sustainably in 2025',
    content: 'Sustainable travel doesn\'t mean sacrificing comfort. Small changes make a big difference for our planet.\n\n## 1. Choose Direct Flights\nTakeoffs and landings burn the most fuel. Direct flights are more eco-friendly.\n\n## 2. Pack Light\nLess weight = less fuel. Pack only what you need.\n\n## 3. Use Public Transport\nBuses, trains, and metros are greener than taxis.\n\n## 4. Stay at Eco-Certified Hotels\nLook for LEED or Green Globe certifications.\n\n## 5. Bring Reusable Items\nWater bottle, shopping bag, and utensils reduce plastic waste.\n\n## 6. Support Local\nEat local food, buy local crafts, and hire local guides.\n\n## 7. Say No to Animal Tourism\nAvoid elephant rides, dolphin shows, and tiger selfies.\n\nTravel responsibly with A9 Global — we partner with eco-friendly accommodations worldwide!',
    image: '/images_v2/tour-beach-v2.jpg', author: 'A9 Global Team', tags: ['Sustainability', 'Tips', 'Eco-Travel'], createdAt: '2025-02-05' },
  { _id: '10', slug: 'singapore-family-holiday', title: 'Singapore Family Holiday: Complete Itinerary for 5 Days',
    content: 'Singapore is the perfect family destination — safe, clean, and packed with attractions for all ages.\n\n## Day 1: Arrival & Marina Bay\nCheck into your hotel and explore Marina Bay Sands SkyPark, Gardens by the Bay, and the nightly light show.\n\n## Day 2: Sentosa Island\nUniversal Studios Singapore, S.E.A. Aquarium, and beach time at Palawan Beach.\n\n## Day 3: Nature & Wildlife\nSingapore Zoo, River Wonders, and Night Safari — all in one incredible day.\n\n## Day 4: Culture & Heritage\nExplore Chinatown, Little India, and Kampong Glam. Try hawker food at Maxwell Food Centre.\n\n## Day 5: Shopping & Departure\nOrchard Road shopping, Jewel Changi Airport\'s indoor waterfall, and departure.\n\nBook your Singapore family package from Ks 250,000 with A9 Global!',
    image: '/images_v2/hero-singapore-v2.jpg', author: 'A9 Global Team', tags: ['Singapore', 'Family', 'Itinerary'], createdAt: '2025-02-10' },
  { _id: '11', slug: 'bagan-hot-air-balloon-guide', title: 'Bagan Hot Air Balloon Guide: Everything You Need to Know',
    content: 'Soaring above the ancient temples of Bagan in a hot air balloon is one of the most magical travel experiences in the world. Here is everything you need to plan your balloon adventure.\n\n## When to Go\nBalloon season runs from October to March when winds are calm and skies are clear. Book well in advance as spots fill up fast.\n\n## What to Expect\nThe balloon takes off at sunrise, offering breathtaking views of thousands of temples emerging from the morning mist. Flights last about 45-60 minutes.\n\n## Photography Tips\n- Bring a wide-angle lens for landscape shots\n- Use a fast shutter speed to counter balloon movement\n- The golden hour light is perfect for temple silhouettes\n\n## Safety\nAll operators are licensed and follow strict safety protocols. Pilots are internationally certified.\n\nBook your Bagan balloon experience with A9 Global from Ks 280,000!',
    image: '/images_v2/blog1-v2.jpg', author: 'A9 Global Team', tags: ['Bagan', 'Balloon', 'Myanmar', 'Adventure'], createdAt: '2025-02-15' },
];

export default function BlogPage() {
  const [heroImage, setHeroImage] = useState("/images_v2/hero-blog-v2.jpg");
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/admin/settings").then(r => r.json()).then(d => { if (d?.heroImages?.blog) setHeroImage(d.heroImages.blog); }).catch(() => {}); }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blog');
        const data = await res.json();
        const raw = data?.data || data || [];
        if (Array.isArray(raw) && raw.length > 0) {
          setPosts(raw.map((p: any) => ({
            _id: p._id || p.id || '',
            slug: p.slug || (p.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            title: p.title || '',
            content: p.content || '',
            image: p.image || '',
            author: p.author || 'A9 Global Team',
            tags: Array.isArray(p.tags) ? p.tags : [],
            createdAt: p.createdAt || new Date().toISOString(),
          })));
        } else {
          setPosts(FALLBACK_POSTS);
        }
      } catch { setPosts(FALLBACK_POSTS); }
      finally { setLoading(false); }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[300px] md:h-[380px] w-full overflow-hidden">
        <img src={heroImage} alt="A9 Global Blog" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images_v2/hero-blog-v2.jpg"; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/90 via-[#0A1628]/40 to-[#0A1628]/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>A9 Global Blog</h1>
          <p className="text-gray-300 text-lg max-w-xl">Travel tips, destination guides, and the latest news from around the world</p>
        </div>
      </section>

      {/* Posts */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post._id}
              onClick={() => router.push('/blog/' + post.slug + '?id=' + post._id)}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#D4AF37]/40 transition-all cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images_v2/cta-bg-v2.jpg'; }}
                />
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-1 mb-3">
                  {(post.tags || []).slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-medium rounded-full">{tag}</span>
                  ))}
                </div>
                <h2 className="text-lg font-bold text-[#0A1628] mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{post.title}</h2>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4">{post.content.replace(/[#*]/g, '')}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{post.author}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ========== Social Feed ========== */}
      <Newsletter />
</main>
  );
}
