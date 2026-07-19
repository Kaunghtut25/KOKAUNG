'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface BlogPost {
  _id: string; slug: string; title: string; content: string; image: string;
  author: string; tags: string[]; createdAt: string;
}

const ALL_POSTS: Record<string, BlogPost> = {
  'top-10-destinations-myanmar': { _id: '1', slug: 'top-10-destinations-myanmar', title: 'Top 10 Must-Visit Destinations in Myanmar',
    content: 'Myanmar is a land of golden pagodas, ancient temples, and breathtaking landscapes. From the ancient plains of Bagan with over 2,000 temples to the serene waters of Inle Lake, Myanmar offers experiences found nowhere else on Earth.\n\n## Yangon\nStart your journey in Yangon, where the magnificent Shwedagon Pagoda dominates the skyline. This 2,500-year-old gilded stupa stands 99 meters tall and is the most sacred Buddhist pagoda in Myanmar. Visit at sunset for an unforgettable golden glow.\n\n## Bagan\nFly to Bagan — a UNESCO World Heritage site with thousands of temples spread across a 42-square-kilometer plain. Rent an e-bike to explore at your own pace. A hot air balloon ride at sunrise (October-March) offers a view you will never forget.\n\n## Mandalay\nThe last royal capital of Myanmar offers the iconic U Bein Bridge — the world\'s longest teak bridge — best photographed at sunset. Visit Mahamuni Pagoda and Shwenandaw Monastery.\n\n## Inle Lake\nFamous for its leg-rowing fishermen, floating gardens, and stilt-house villages. Take a long-tail boat tour to explore floating markets and silk-weaving workshops.\n\n## Golden Rock (Kyaiktiyo)\nA gravity-defying golden boulder perched on a cliff edge — one of Myanmar\'s most sacred pilgrimage sites.\n\nBook with A9 Global Travel and experience the magic of Myanmar!',
    image: '/images_v2/blog1-v2.jpg', author: 'A9 Global Team', tags: ['Myanmar', 'Travel Tips', 'Destinations'], createdAt: '2024-12-15' },
  'flight-deals-guide': { _id: '2', slug: 'flight-deals-guide', title: 'How to Get the Best Flight Deals in 2025',
    content: 'Booking flights can be expensive, but with these insider tips you can save hundreds on your next trip.\n\n## 1. Book at the Right Time\nStudies show that booking 6-8 weeks in advance for international flights yields the best prices. Tuesday and Wednesday afternoons often have lower fares as airlines release weekly deals.\n\n## 2. Use Price Alerts\nSet up alerts on Google Flights and Skyscanner to track price changes for your desired routes. You\'ll get email notifications when prices drop.\n\n## 3. Be Flexible with Dates\nFlying mid-week (Tuesday/Wednesday) and during off-peak seasons can save you 30-50% on airfare. Avoid school holidays and major festivals.\n\n## 4. Consider Nearby Airports\nSometimes flying into a nearby city and taking ground transport is significantly cheaper. For example, fly into Bangkok and take a budget flight to your final destination.\n\n## 5. Clear Your Cookies\nAirlines may raise prices based on your search history. Use incognito mode when searching for flights.\n\n## 6. Book Through A9 Global!\nWe have exclusive partnerships with major airlines — you\'ll often get better rates than booking direct.\n\nContact A9 Global Travel for exclusive flight deals and package discounts!',
    image: '/images_v2/blog2-v2.jpg', author: 'A9 Global Team', tags: ['Flights', 'Travel Tips', 'Budget'], createdAt: '2024-12-20' },
  'visa-guide-2025': { _id: '3', slug: 'visa-guide-2025', title: 'Visa Guide 2025: Everything You Need to Know',
    content: 'Planning an international trip? Our comprehensive visa guide covers requirements for popular destinations from Myanmar.\n\n## Thailand\nMyanmar citizens can enjoy visa-free travel to Thailand for up to 14 days (by air). For longer stays, apply for a 60-day tourist visa at the Thai embassy in Yangon. Processing takes 2-3 working days.\n\n## Singapore\nE-visa available for Myanmar passport holders. Processing takes 3-5 working days. Required: passport (6+ months validity), return ticket, hotel booking, bank statement showing 50+ lakhs.\n\n## Vietnam\nE-visa (30 days) available online. Processing takes 3 working days. Also available: visa on arrival at major airports with pre-approval letter.\n\n## Dubai/UAE\nVisa processing through authorized agencies only. Required: passport copy, photo, bank statement (6 months), hotel booking, return ticket, NOC letter if employed.\n\n## Japan\nTourist visa requires: detailed itinerary, bank statements (6 months), employment letter, tax returns. Processing takes 5-7 working days.\n\n## South Korea\nVisa required. Documents: passport, application form, photo, bank statements, employment letter, travel itinerary.\n\nA9 Global Travel handles ALL visa processing — contact us to get started!',
    image: '/images_v2/blog3-v2.jpg', author: 'A9 Global Team', tags: ['Visa', 'Guide', 'International'], createdAt: '2025-01-05' },
  'best-time-visit-thailand': { _id: '4', slug: 'best-time-visit-thailand', title: 'Best Time to Visit Thailand: Month by Month Guide',
    content: 'Thailand welcomes visitors year-round, but the experience varies dramatically by season.\n\n## November – February (Cool Season)\nThe best time to visit! Temperatures are pleasant (25-30°C), humidity is low, and rainfall is minimal. Perfect for beach holidays in Phuket and Krabi, temple exploration in Bangkok, and trekking in Chiang Mai. Book early — this is peak season.\n\n## March – May (Hot Season)\nTemperatures soar to 35-40°C. The famous Songkran Festival (Thai New Year) in April is an incredible water festival experience not to be missed. Best for: cultural festivals, budget travel (lower hotel prices).\n\n## June – October (Rainy Season)\nLush green landscapes, dramatic skies, fewer tourists, and the lowest prices of the year. Rain usually comes in short, heavy bursts (1-2 hours) with sunshine before and after. Best for: budget travelers, photographers, surfers.\n\nBook your Thailand package with A9 Global starting from Ks 150,000!',
    image: '/images_v2/blog4-v2.jpg', author: 'A9 Global Team', tags: ['Thailand', 'Seasons', 'Travel Tips'], createdAt: '2025-01-10' },
  'top-5-luxury-hotels-yangon': { _id: '5', slug: 'top-5-luxury-hotels-yangon', title: 'Top 5 Luxury Hotels in Yangon for Business Travelers',
    content: 'Yangon offers world-class accommodations blending colonial charm with modern luxury.\n\n## 1. The Strand Yangon\nBuilt in 1901, this legendary colonial-era hotel has been beautifully restored. Expect butler service, fine dining at The Strand Restaurant, and timeless elegance. The Strand has hosted royalty, writers, and dignitaries for over a century.\n\n## 2. Sule Shangri-La Yangon\nPrime location on Sule Pagoda Road with panoramic city views from upper floors. Excellent business center, Horizon Club Lounge, and international dining at Gallery Café. Walking distance to Bogyoke Market.\n\n## 3. Sedona Hotel Yangon\nSpacious suites with Inya Lake views, extensive fitness facilities including tennis courts and swimming pool, and multiple restaurants serving international and local cuisine.\n\n## 4. Novotel Yangon Max\nModern rooms with smart technology, rooftop infinity pool with city views, and excellent value for business travelers. Close to Yangon International Airport.\n\n## 5. Pan Pacific Yangon\nLuxurious rooms with stunning Shwedagon Pagoda views from higher floors, world-class spa, infinity pool, and gourmet dining at Hai Tien Lo.\n\nBook your stay through A9 Global for exclusive corporate rates!',
    image: '/images_v2/hotel1-v2.jpg', author: 'A9 Global Team', tags: ['Hotels', 'Yangon', 'Luxury'], createdAt: '2025-01-15' },
  'dubai-travel-guide': { _id: '6', slug: 'dubai-travel-guide', title: 'Dubai Travel Guide: What to See, Do, and Eat',
    content: 'Dubai is a city of superlatives — the tallest, the largest, the most luxurious. Here is your complete guide.\n\n## Top Attractions\n- **Burj Khalifa**: The world\'s tallest building at 828 meters. Book "At the Top" tickets in advance for observation decks on levels 124-125 and 148.\n- **Palm Jumeirah**: Iconic man-made island with Atlantis The Palm, Aquaventure Waterpark, and The Lost Chambers Aquarium.\n- **The Dubai Mall**: Over 1,200 shops plus Dubai Aquarium, VR Park, and ice rink.\n- **Desert Safari**: Dune bashing, camel rides, sandboarding, and traditional BBQ dinner with belly dancing under the stars.\n- **Dubai Frame**: 150-meter tall picture frame offering old and new Dubai views.\n- **La Mer**: Beachfront destination with restaurants, water sports, and sunset views.\n\n## Food Scene\nFrom Michelin-starred restaurants (Nusr-Et, Nobu) to authentic street food in Deira and Bur Dubai.\n\n## Best Time\nNovember-March for pleasant weather (20-28°C). Avoid June-August (40-50°C).\n\nBook your Dubai package from Ks 680,000 with A9 Global!',
    image: '/images_v2/dest-dubai-v2.jpg', author: 'A9 Global Team', tags: ['Dubai', 'Destinations', 'Guide'], createdAt: '2025-01-20' },
  'travel-insurance-why-need': { _id: '7', slug: 'travel-insurance-why-need', title: 'Why You Need Travel Insurance: Real Stories',
    content: 'Travel insurance is not just paperwork — it can be a lifesaver.\n\n## Medical Emergencies\nA sudden illness or accident abroad can cost thousands in medical bills. Insurance covers hospitalization, emergency evacuation, and repatriation.\n\nReal story: A traveler in Bagan suffered a broken ankle during a temple visit. Without insurance, the air ambulance and surgery would have cost $8,000+. With A9\'s Premium Travel Protect, it was fully covered.\n\n## Trip Cancellation\nFlights get canceled, family emergencies happen. Insurance protects your non-refundable expenses up to the coverage amount.\n\n## Lost Baggage\nAirlines lose millions of bags each year. Insurance covers emergency essentials while you wait for luggage recovery (typically $200-500).\n\n## What A9 Insurance Covers\n- Medical emergency: up to $50,000 (Premium)\n- Trip cancellation: up to full trip cost\n- Baggage loss: up to $1,000\n- Flight delay: $200 per day\n- 24/7 emergency assistance hotline\n\nProtect your trip — get A9 Travel Insurance from just Ks 15,000 per trip!',
    image: '/images_v2/ins1-v2.jpg', author: 'A9 Global Team', tags: ['Insurance', 'Safety', 'Tips'], createdAt: '2025-01-25' },
  'korean-food-guide': { _id: '8', slug: 'korean-food-guide', title: 'Korean Food Lover\'s Guide: 15 Must-Try Dishes',
    content: 'Korean cuisine is taking the world by storm. Here are the dishes you must try in Seoul.\n\n## Korean BBQ (Samgyeopsal)\nThick slices of pork belly grilled at your table, dipped in sesame oil with salt, wrapped in lettuce with ssamjang (spicy paste), garlic, and kimchi. The ultimate Korean dining experience.\n\n## Bibimbap\nA beautiful bowl of warm rice topped with sautéed vegetables (spinach, bean sprouts, carrots, mushrooms), a fried egg, and gochujang (red chili paste). Mix it all together!\n\n## Korean Fried Chicken\nDouble-fried to crispy perfection and coated in sweet-spicy yangnyeom sauce or soy garlic. Better than any fried chicken you have ever had.\n\n## Tteokbokki\nChewy cylindrical rice cakes simmered in spicy-sweet gochujang sauce with fish cakes and boiled eggs. The ultimate Korean street food.\n\n## Other Must-Tries\n- **Kimchi Jjigae**: Hearty kimchi stew with pork and tofu\n- **Japchae**: Glass noodles stir-fried with vegetables and beef\n- **Hotteok**: Sweet pancakes filled with brown sugar, cinnamon, and nuts\n- **Bingsu**: Shaved ice dessert with red bean, fruit, and condensed milk\n\n## Best Food Streets\nMyeongdong for street food, Gwangjang Market for traditional eats, Hongdae for trendy cafes.\n\nBook your Korea food tour with A9 Global from Ks 550,000!',
    image: '/images_v2/dest-korea-v2.jpg', author: 'A9 Global Team', tags: ['Korea', 'Food', 'Culture'], createdAt: '2025-02-01' },
  'sustainable-travel-tips': { _id: '9', slug: 'sustainable-travel-tips', title: '10 Easy Ways to Travel More Sustainably',
    content: 'Sustainable travel does not mean sacrificing comfort.\n\n## 1. Choose Direct Flights\nTakeoffs and landings burn the most fuel. A direct flight is significantly more eco-friendly than connecting flights.\n\n## 2. Pack Light\nLess weight = less fuel burned. Pack only what you need — your back will thank you too.\n\n## 3. Use Public Transport\nBuses, trains, and metros produce far fewer emissions per passenger than taxis or rental cars.\n\n## 4. Stay at Eco-Certified Hotels\nLook for LEED, Green Globe, or EarthCheck certifications. These hotels use renewable energy, reduce water waste, and source locally.\n\n## 5. Bring Reusable Items\nA reusable water bottle, shopping bag, and bamboo utensil set eliminate countless single-use plastics.\n\n## 6. Support Local Businesses\nEat at local restaurants, buy from local artisans, and hire local guides. Money stays in the community.\n\n## 7. Say No to Animal Exploitation\nAvoid elephant rides, tiger selfies, dolphin shows, and any attraction exploiting wild animals.\n\n## 8. Conserve Water & Energy\nReuse hotel towels, turn off lights and AC when leaving, take shorter showers.\n\nTravel responsibly with A9 Global!',
    image: '/images_v2/tour-beach-v2.jpg', author: 'A9 Global Team', tags: ['Sustainability', 'Tips', 'Eco-Travel'], createdAt: '2025-02-05' },
  'singapore-family-holiday': { _id: '10', slug: 'singapore-family-holiday', title: 'Singapore Family Holiday: 5-Day Itinerary',
    content: 'Singapore is the perfect family destination — safe, clean, and packed with attractions for all ages.\n\n## Day 1: Arrival & Marina Bay\nArrive at Changi Airport (an attraction in itself — visit the indoor waterfall!). Check into your hotel. Evening: explore Marina Bay Sands SkyPark Observation Deck, stroll through Gardens by the Bay, and watch the Spectra light show at 8pm.\n\n## Day 2: Sentosa Island\nFull day at Sentosa! Start at Universal Studios Singapore (7 themed zones, 24 rides). After lunch, visit S.E.A. Aquarium (one of the world\'s largest). End the day at Palawan Beach — linked by suspension bridge to Asia\'s closest point to the Equator.\n\n## Day 3: Nature & Wildlife\nMorning at Singapore Zoo (award-winning open-concept zoo). Afternoon at River Wonders (giant pandas!) followed by Night Safari (world\'s first nocturnal zoo).\n\n## Day 4: Culture & Heritage\nMorning: Chinatown (Buddha Tooth Relic Temple, street market). Afternoon: Little India (Tekka Centre, colorful shophouses) and Kampong Glam (Sultan Mosque, Haji Lane). Evening: dinner at a hawker center — try chicken rice, laksa, and satay.\n\n## Day 5: Shopping & Departure\nMorning shopping on Orchard Road. Visit Jewel Changi Airport\'s Rain Vortex (world\'s tallest indoor waterfall) before your flight.\n\nBook your Singapore family package from Ks 250,000 with A9 Global!',
    image: '/images_v2/hero-singapore-v2.jpg', author: 'A9 Global Team', tags: ['Singapore', 'Family', 'Itinerary'], createdAt: '2025-02-10' },
};

export default function BlogDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const slug = window.location.pathname.split('/blog/')[1]?.split('?')[0];
    const id = searchParams.get('id');
    
    // Try by slug first, then by id
    let found = slug ? ALL_POSTS[slug] : undefined;
    if (!found && id) {
      found = Object.values(ALL_POSTS).find(p => p._id === id);
    }
    if (!found && slug) {
      // Try partial match
      found = Object.values(ALL_POSTS).find(p => p.slug.includes(slug) || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(slug));
    }
    setPost(found || null);
  }, [searchParams]);

  if (!post) {
    return (
      <main className="min-h-screen bg-white pt-24 text-center">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-30 flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md hover:shadow-lg hover:bg-white transition-all duration-200 text-gray-700 hover:text-[#D4AF37] text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

        <h1 className="text-4xl font-bold text-[#0A1628] mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-8">The blog post you are looking for does not exist.</p>
        <Link href="/blog" className="text-[#D4AF37] font-semibold hover:underline">← Back to Blog</Link>
      </main>
    );
  }

  // Render markdown-like content
  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, i) => {
      if (block.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-bold text-[#0A1628] mt-8 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{block.slice(3)}</h2>;
      }
      if (block.startsWith('- **')) {
        return (
          <div key={i} className="my-2 pl-4 border-l-2 border-[#D4AF37]/30">
            <p className="text-gray-800"><strong className="text-[#0A1628]">{block.slice(4, block.indexOf('**:') + 1)}</strong>{block.slice(block.indexOf('**:') + 2)}</p>
          </div>
        );
      }
      if (block.startsWith('- ')) {
        return <li key={i} className="ml-6 text-gray-700 list-disc my-1">{block.slice(2)}</li>;
      }
      return <p key={i} className="text-gray-700 leading-relaxed mb-4">{block}</p>;
    });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = '/images_v2/hero-blog-v2.jpg'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
          <div className="flex flex-wrap gap-2 mb-3">
            {(post.tags || []).map(tag => (
              <span key={tag} className="px-3 py-1 bg-[#D4AF37]/80 text-white text-xs font-medium rounded-full">{tag}</span>
            ))}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{post.title}</h1>
          <div className="flex items-center gap-4 text-white/70 text-sm">
            <span>{post.author}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          {renderContent(post.content)}
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/20 text-center">
          <h3 className="text-xl font-bold text-[#0A1628] mb-2">Inspired to Travel?</h3>
          <p className="text-gray-600 mb-6">Let A9 Global Travel plan your perfect trip!</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href={"/book-now?type=blog&title=" + encodeURIComponent(post.title) + "&destination=" + encodeURIComponent(post.tags?.join(", ") || "") + "&requests=" + encodeURIComponent("Blog: " + post.title)} className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-full hover:bg-[#C19B2F] transition-colors">Book Now</Link>
            <Link href="/contact" className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] font-semibold rounded-full hover:bg-[#D4AF37]/10 transition-colors">Contact Us</Link>
          </div>
        </div>

        {/* Back */}
        <div className="mt-8 text-center">
          <Link href="/blog" className="text-[#D4AF37] font-semibold hover:underline">← Back to Blog</Link>
        </div>
      </article>
    </main>
  );
}
