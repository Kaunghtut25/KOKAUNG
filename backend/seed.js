require('dotenv').config();
const bcrypt = require('bcryptjs');

// Use models — they auto-initialize via lib/db.js
const User = require('./models/user');
const TourPackage = require('./models/tourpackage');
const Hotel = require('./models/hotel');
const CarRental = require('./models/carrental');
const VisaService = require('./models/visaservice');
const TravelInsurance = require('./models/travelinsurance');
const Booking = require('./models/booking');
const BookingInquiry = require('./models/bookinginquiry');

// ──────────────────────── Seed Data ────────────────────────

async function seed() {
  console.log('[Seed] Starting JSON file store seed...');

  // ─── Drop existing data ───
  console.log('\n🗑️  Dropping existing data...');
  await Promise.all([
    User.deleteMany({}),
    TourPackage.deleteMany({}),
    Hotel.deleteMany({}),
    CarRental.deleteMany({}),
    VisaService.deleteMany({}),
    TravelInsurance.deleteMany({}),
    Booking.deleteMany({}),
    BookingInquiry.deleteMany({}),
  ]);
  console.log('✅ All existing data dropped.');

  // ─── 1. USERS ───
  console.log('\n👤 Creating users...');
  const hashedAdminPw = await bcrypt.hash('admin123', 10);
  const hashedCustomerPw = await bcrypt.hash('test123', 10);

  const admin = await User.create({
    name: 'Admin A9',
    email: 'admin@a9global.com',
    password: hashedAdminPw,
    role: 'admin',
    phone: '09781617333',
  });
  console.log('  ✅ Admin:', admin.name, `(${admin.email})`);

  const customer = await User.create({
    name: 'Ko Kaung',
    email: 'customer@test.com',
    password: hashedCustomerPw,
    role: 'customer',
    phone: '09781234567',
  });
  console.log('  ✅ Customer:', customer.name, `(${customer.email})`);

  // ─── 2. TOUR PACKAGES ───
  console.log('\n🌏 Creating tour packages...');

  const usd = (mmk) => Math.round(mmk / 2100);

  function makeSlug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      + '-' + Date.now().toString(36);
  }

  const tours = await TourPackage.insertMany([
    {
      title: 'Golden Land Explorer',
      slug: makeSlug('Golden Land Explorer'),
      description: 'Embark on an unforgettable journey through Myanmar\'s most iconic destinations. From the golden spires of Yangon\'s Shwedagon Pagoda to the ancient temple plains of Bagan, the royal palace of Mandalay, and the tranquil floating gardens of Inle Lake — this comprehensive tour captures the very soul of the Golden Land.',
      priceMMK: 1850000,
      priceUSD: Math.round(1850000 / 2100),
      duration: '8D/7N',
      destination: 'Yangon - Bagan - Mandalay - Inle',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: [
        'Hotel Accommodation (4★ & 5★)',
        'Daily Breakfast & Welcome Dinner',
        'Airport Transfers',
        'English Speaking Guide',
        'Sightseeing Entry Fees',
        'Domestic Flights (Yangon-Bagan, Mandalay-Heho)',
        'Inle Lake Boat Tour',
        'Drinking Water & Refreshments',
      ],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance'],
      itinerary: [
        { day: 1, title: 'Arrival in Yangon', description: 'Welcome at Yangon International Airport. Transfer to hotel for check-in. Evening visit to Shwedagon Pagoda, the crown jewel of Myanmar, glowing in golden sunset hues. Welcome dinner at a traditional Burmese restaurant.' },
        { day: 2, title: 'Yangon Heritage & Fly to Bagan', description: 'Morning walking tour of Yangon\'s colonial downtown, Sule Pagoda, and Bogyoke Market. Afternoon flight to Bagan. Check into resort and enjoy sunset from Shwesandaw Pagoda.' },
        { day: 3, title: 'Bagan Temple Trail', description: 'Full day exploring Bagan\'s archaeological wonderland. Visit Ananda Temple, Thatbyinnyu, Dhammayangyi, and Sulamani. Watch artisans at a traditional lacquerware workshop. Sunset boat cruise on the Irrawaddy River.' },
        { day: 4, title: 'Bagan Sunrise & Fly to Mandalay', description: 'Optional hot air balloon ride at sunrise over Bagan\'s temple plains. Visit Nyaung U morning market. Afternoon flight to Mandalay. Visit Mahamuni Buddha image and watch sunset from Mandalay Hill.' },
        { day: 5, title: 'Mandalay Royal Heritage', description: 'Morning visit to the Royal Palace and Shwenandaw Monastery (Golden Teak Monastery). Afternoon trip to Amarapura to see the Mahagandayon Monastery. Walk across U Bein Bridge — the world\'s longest teak bridge — at sunset.' },
        { day: 6, title: 'Mingun & Sagaing', description: 'Boat trip across the Irrawaddy to Mingun, home of the giant Mingun Bell and unfinished pagoda. Afternoon visit to Sagaing Hill with its countless white-and-gold stupas and panoramic river views.' },
        { day: 7, title: 'Fly to Inle Lake', description: 'Morning flight to Heho. Scenic drive to Nyaung Shwe. Boat tour of Inle Lake: floating gardens, leg-rowing fishermen, Phaung Daw Oo Pagoda, and traditional silk and silver workshops.' },
        { day: 8, title: 'Indein & Departure', description: 'Morning visit to the ancient Indein pagoda complex with hundreds of hidden stupas. Transfer to Heho airport for departure flight. Farewell and safe travels!' },
      ],
      images: [
        'https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558704475-1428913b4c6b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1590474251443-ea19bb0f4e89?w=800&h=600&fit=crop',
      ],
      status: 'featured',
      rating: 4.8,
      reviewCount: 142,
      maxGroupSize: 20,
    },
    {
      title: 'Bagan Sunrise Discovery',
      slug: makeSlug('Bagan Sunrise Discovery'),
      description: 'Witness the breathtaking sunrise over Bagan\'s ancient temple plains, where thousands of pagodas emerge from the morning mist. This immersive tour lets you experience the spiritual heart of Myanmar through its most awe-inspiring archaeological wonder.',
      priceMMK: 950000, priceUSD: Math.round(950000 / 2100), duration: '5D/4N',
      destination: 'Bagan',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Hotel Accommodation (4★)', 'Daily Breakfast', 'Airport Transfers (Nyaung U)', 'English Speaking Guide', 'Sightseeing Entry Fees', 'E-Bike Rental (2 Days)', 'Sunset Boat Cruise', 'Drinking Water'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance', 'Hot Air Balloon (optional)'],
      itinerary: [
        { day: 1, title: 'Arrival in Bagan', description: 'Transfer from Nyaung U Airport to hotel. Evening orientation walk through the temple plains and sunset viewing from a scenic pagoda.' },
        { day: 2, title: 'E-Bike Temple Exploration', description: 'Full day exploring Bagan\'s archaeological zone by e-bike. Visit the most significant temples: Ananda, Thatbyinnyu, Dhammayangyi, and Gubyaukgyi cave temple with its exquisite murals.' },
        { day: 3, title: 'Hot Air Balloon & Local Life', description: 'Optional early morning hot air balloon ride (seasonal). Visit Myinkaba village for traditional lacquerware and sand painting. Afternoon trip to Mount Popa — the sacred volcano monastery.' },
        { day: 4, title: 'Hidden Temples & River Cruise', description: 'Morning discovery of lesser-known temples and local villages. Afternoon visit to Nyaung U Market. Evening sunset cruise on the Irrawaddy River with champagne.' },
        { day: 5, title: 'Sunrise Farewell', description: 'Final sunrise view from a peaceful temple before transfer to airport. Depart with unforgettable memories of the temple plain.' },
      ],
      images: ['https://images.unsplash.com/photo-1558704475-1428913b4c6b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1583431815168-55a35bfefbd3?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=800&h=600&fit=crop'],
      status: 'featured', rating: 4.9, reviewCount: 98, maxGroupSize: 15,
    },
    {
      title: 'Mandalay Royal Heritage',
      slug: makeSlug('Mandalay Royal Heritage'),
      description: 'Step into Myanmar\'s last royal capital and explore the rich cultural tapestry of Mandalay, Amarapura, and Sagaing. From golden pagodas to ancient teak monasteries, this tour reveals the artistry and devotion of Upper Myanmar.',
      priceMMK: 750000, priceUSD: Math.round(750000 / 2100), duration: '4D/3N',
      destination: 'Mandalay - Amarapura - Sagaing',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Hotel Accommodation (4★)', 'Daily Breakfast', 'Airport Transfers', 'English Speaking Guide', 'Sightseeing Entry Fees', 'Boat Trip to Mingun', 'Drinking Water'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance'],
      itinerary: [
        { day: 1, title: 'Arrival & Mandalay Hill Sunset', description: 'Airport pickup and hotel check-in. Afternoon visit to Mahamuni Buddha Temple. Sunset panorama from Mandalay Hill with 360° views of the city and Irrawaddy River.' },
        { day: 2, title: 'Royal Palace & Amarapura', description: 'Morning tour of the reconstructed Royal Palace and Shwenandaw Golden Teak Monastery. Afternoon trip to Amarapura: Mahagandayon Monastery and U Bein Bridge at sunset.' },
        { day: 3, title: 'Mingun & Sagaing', description: 'Morning boat to Mingun to see the massive unfinished pagoda and world\'s largest ringing bell. Afternoon exploration of Sagaing Hill — hundreds of stupas, nunneries, and magnificent river views.' },
        { day: 4, title: 'Artisan Workshops & Departure', description: 'Visit traditional gold-leaf beating workshops, marble carving studios, and tapestry weavers. Transfer to airport for departure flight.' },
      ],
      images: ['https://images.unsplash.com/photo-1590474251443-ea19bb0f4e89?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1558704475-1428913b4c6b?w=800&h=600&fit=crop'],
      status: 'active', rating: 4.6, reviewCount: 67, maxGroupSize: 20,
    },
    {
      title: 'Inle Lake Serenity',
      slug: makeSlug('Inle Lake Serenity'),
      description: 'Glide across the serene waters of Inle Lake, where floating gardens bloom and leg-rowing fishermen dance on one leg. Discover a world where life unfolds on water — stilt villages, floating markets, and centuries-old Buddhist traditions.',
      priceMMK: 1100000, priceUSD: Math.round(1100000 / 2100), duration: '5D/4N',
      destination: 'Inle Lake - Indein',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Hotel Accommodation (4★ Boutique)', 'Daily Breakfast', 'Airport Transfers (Heho)', 'English Speaking Guide', 'Private Boat Tours', 'Sightseeing Entry Fees', 'Canoe Trip at Indein', 'Drinking Water'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance'],
      itinerary: [
        { day: 1, title: 'Arrival in Inle', description: 'Pickup from Heho Airport. Scenic drive through Shan hills to Nyaung Shwe. Afternoon boat ride to resort on the lake. Sunset views over floating gardens.' },
        { day: 2, title: 'Lake Life Discovery', description: 'Full-day boat tour: leg-rowing fishermen at sunrise, floating vegetable gardens, Phaung Daw Oo Pagoda, and traditional workshops — silk weaving from lotus stems, silversmiths, and cheroot rolling.' },
        { day: 3, title: 'Floating Market & Villages', description: 'Visit the rotating 5-day market (location varies by day). Explore stilt villages and see daily lake life up close. Afternoon visit to Nga Phe Kyaung monastery, the "Jumping Cat Monastery."' },
        { day: 4, title: 'Indein Ancient Pagodas', description: 'Morning boat trip to Indein village. Walk through the forest of ancient stupas — hundreds of pagodas hidden among bamboo groves, some dating back to the 12th century. Afternoon canoe ride through narrow water channels.' },
        { day: 5, title: 'Shan Hills & Departure', description: 'Morning visit to a local Shan village for tea tasting. Transfer to Heho Airport for departure flight.' },
      ],
      images: ['https://images.unsplash.com/photo-1583431815168-55a35bfefbd3?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1558704475-1428913b4c6b?w=800&h=600&fit=crop'],
      status: 'featured', rating: 4.7, reviewCount: 85, maxGroupSize: 16,
    },
    {
      title: 'Ngapali Beach Escape',
      slug: makeSlug('Ngapali Beach Escape'),
      description: 'Escape to Myanmar\'s premier beach destination — Ngapali. Crystal-clear turquoise waters, powder-white sand stretching for kilometers, and fresh seafood under swaying palm trees. The perfect tropical paradise for relaxation and rejuvenation.',
      priceMMK: 1350000, priceUSD: Math.round(1350000 / 2100), duration: '4D/3N',
      destination: 'Ngapali Beach',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Beachfront Resort Accommodation (5★)', 'Daily Breakfast & 1 Seafood Dinner', 'Airport Transfers (Thandwe)', 'Snorkeling Trip', 'Fishing Village Tour', 'Beach Activities'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance', 'Spa Treatments'],
      itinerary: [
        { day: 1, title: 'Arrival at Paradise', description: 'Flight to Thandwe Airport. Transfer to beachfront resort. Afternoon at leisure: swim, sunbathe, or stroll along 3 km of pristine white sand. Welcome seafood dinner on the beach.' },
        { day: 2, title: 'Snorkeling Adventure', description: 'Morning boat trip to nearby islands for snorkeling in crystal-clear waters. Colorful coral reefs and tropical fish. Afternoon visit to a traditional fishing village. Sunset cocktails on the beach.' },
        { day: 3, title: 'Relaxation Day', description: 'Free day to enjoy the resort facilities: infinity pool, spa treatments (optional), kayaking, or simply relaxing under palm trees. Optional bicycle tour through nearby villages.' },
        { day: 4, title: 'Farewell Paradise', description: 'Final morning swim and breakfast on the beach. Transfer to Thandwe Airport for departure. Take the coastal serenity with you.' },
      ],
      images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&h=600&fit=crop'],
      status: 'active', rating: 4.5, reviewCount: 52, maxGroupSize: 18,
    },
    {
      title: 'Yangon Cultural Tour',
      slug: makeSlug('Yangon Cultural Tour'),
      description: 'Dive deep into the cultural heart of Myanmar\'s largest city. From the breathtaking Shwedagon Pagoda — one of Buddhism\'s most sacred sites — to colonial-era architecture and bustling markets, experience Yangon\'s unique blend of tradition and urban energy.',
      priceMMK: 450000, priceUSD: Math.round(450000 / 2100), duration: '3D/2N',
      destination: 'Yangon',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Hotel Accommodation (4★)', 'Daily Breakfast', 'Airport Transfers', 'English Speaking Guide', 'Sightseeing Entry Fees', 'Circular Train Ride', 'Tea Shop Experience'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance'],
      itinerary: [
        { day: 1, title: 'Arrival & Shwedagon at Sunset', description: 'Airport pickup and hotel check-in. Afternoon orientation walk. Evening visit to Shwedagon Pagoda — witness the golden stupa glow at sunset, with 27 metric tons of gold leaf and thousands of diamonds.' },
        { day: 2, title: 'Colonial Yangon & Local Life', description: 'Morning walking tour of downtown\'s colonial architecture: City Hall, High Court, Strand Hotel. Visit Bogyoke Aung San Market for souvenirs. Afternoon Circular Train ride through Yangon\'s suburbs. Evening at a traditional tea shop.' },
        { day: 3, title: 'Chauk Htat Gyi & Departure', description: 'Morning visit to Chauk Htat Gyi — the giant reclining Buddha (65 meters long). Last-minute shopping at Scott Market. Transfer to airport for departure.' },
      ],
      images: ['https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1590474251443-ea19bb0f4e89?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1558704475-1428913b4c6b?w=800&h=600&fit=crop'],
      status: 'active', rating: 4.4, reviewCount: 43, maxGroupSize: 25,
    },
    {
      title: 'Myeik Archipelago Adventure',
      slug: makeSlug('Myeik Archipelago Adventure'),
      description: 'Explore the untouched paradise of the Myeik (Mergui) Archipelago — over 800 pristine islands scattered across the Andaman Sea. White sand beaches, vibrant coral reefs, and the unique culture of the Moken sea gypsies await the adventurous traveler.',
      priceMMK: 2200000, priceUSD: Math.round(2200000 / 2100), duration: '6D/5N',
      destination: 'Myeik Archipelago',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Resort & Boat Accommodation', 'All Meals During Cruise', 'Airport Transfers (Myeik)', 'English Speaking Guide', 'Snorkeling & Kayaking Equipment', 'Island Hopping Boat Trips', 'Fishing Activities', 'Marine Park Entry Fees'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance', 'Diving (optional)'],
      itinerary: [
        { day: 1, title: 'Arrival in Myeik', description: 'Flight to Myeik. City orientation: visit Theindawgyi Pagoda and bustling harbor. Overnight at Myeik hotel with seafood dinner at a waterfront restaurant.' },
        { day: 2, title: 'Island Hopping Begins', description: 'Board private boat and cruise into the archipelago. First stop: Dome Nyaung Island with pristine beaches. Snorkeling among vibrant coral gardens. Beach BBQ lunch. Overnight on boat or island bungalow.' },
        { day: 3, title: 'Moken Village & Hidden Lagoons', description: 'Visit a Moken (sea gypsy) village — learn about their nomadic maritime culture. Explore hidden lagoons and mangroves by kayak. Afternoon at Nyaung Wee Island for sunset.' },
        { day: 4, title: 'Snorkeling Paradise', description: 'Full-day snorkeling expedition to the best reef sites. Rainbow corals, clownfish, sea turtles, and reef sharks. Beach picnic on a deserted island. Night squid fishing.' },
        { day: 5, title: 'Exploration & Relaxation', description: 'Morning hike to a panoramic viewpoint. Visit Smart Island and its pearl farm. Afternoon free for swimming, beachcombing, and photography. Farewell dinner on the boat.' },
        { day: 6, title: 'Return & Departure', description: 'Morning cruise back to Myeik. Visit local market for souvenirs. Transfer to airport for departure flight.' },
      ],
      images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop'],
      status: 'featured', rating: 4.9, reviewCount: 37, maxGroupSize: 12,
    },
    {
      title: 'Golden Triangle Explorer',
      slug: makeSlug('Golden Triangle Explorer'),
      description: 'Journey through the legendary Golden Triangle where Myanmar, Thailand, and Laos converge along the Mekong River. This epic 10-day adventure takes you through border towns, hill tribe villages, and the ancient trade routes that shaped Southeast Asia.',
      priceMMK: 3500000, priceUSD: Math.round(3500000 / 2100), duration: '10D/9N',
      destination: 'Myanmar - Thailand - Laos (Golden Triangle)',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Hotel Accommodation (4★ & 5★)', 'Daily Breakfast & Select Dinners', 'All Border Crossings & Transfers', 'English Speaking Guide', 'Sightseeing Entry Fees', 'Mekong River Cruise', 'Hill Tribe Village Visits'],
      excluded: ['International Flights', 'Visa Fees (Myanmar, Thailand, Laos)', 'Personal Expenses', 'Travel Insurance'],
      itinerary: [
        { day: 1, title: 'Arrival in Tachileik', description: 'Cross from Mae Sai (Thailand) into Tachileik. Orientation tour and visit to Shwedagon Pagoda replica. Evening at local market.' },
        { day: 2, title: 'Kengtung Exploration', description: 'Drive through scenic Shan mountains to Kengtung. Visit Naung Tung Lake and Wat Zom Kham monastery. Evening walking tour of the old town.' },
        { day: 3, title: 'Hill Tribe Villages', description: 'Full day visiting Akha, Ann, and Lahu hill tribe villages around Kengtung. Traditional handicrafts and unique cultures. Sunset at Lone Tree Hill.' },
        { day: 4, title: 'To Chiang Rai', description: 'Cross back into Thailand at Mae Sai. Drive to Chiang Rai. Visit the iconic White Temple (Wat Rong Khun) and Blue Temple. Night market exploration.' },
        { day: 5, title: 'Chiang Rai Discovery', description: 'Visit Doi Tung Royal Villa and Mae Fah Luang Garden. Afternoon at the Golden Triangle Park — stand where three countries meet. Opium Museum visit.' },
        { day: 6, title: 'Mekong River Cruise', description: 'Boat cruise along the Mekong River, the lifeline of Southeast Asia. Stop at riverside villages. Continue to Chiang Khong border town.' },
        { day: 7, title: 'Into Laos — Huay Xai', description: 'Cross the Mekong into Laos at Huay Xai. Visit traditional Lao temples. Afternoon trek to nearby waterfalls. Lao welcome dinner.' },
        { day: 8, title: 'Luang Namtha Adventure', description: 'Drive to Luang Namtha through lush jungle landscapes. Visit Nam Ha National Protected Area. Evening at night market sampling Lao street food.' },
        { day: 9, title: 'Jungle Trek & Return', description: 'Morning jungle trek with local guide. Visit Khmu and Lanten villages. Afternoon drive back toward the border region.' },
        { day: 10, title: 'Farewell Golden Triangle', description: 'Return journey with stops at scenic viewpoints. Transfer to departure point. Farewell to the Golden Triangle!' },
      ],
      images: ['https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1583431815168-55a35bfefbd3?w=800&h=600&fit=crop'],
      status: 'active', rating: 4.6, reviewCount: 29, maxGroupSize: 15,
    },
    {
      title: 'Bangkok-Pattaya Luxury',
      slug: makeSlug('Bangkok-Pattaya Luxury'),
      description: 'Experience the best of Thailand — from Bangkok\'s glittering temples and vibrant street life to Pattaya\'s sun-soaked beaches and world-class entertainment. A perfect blend of culture, luxury, and tropical relaxation.',
      priceMMK: 1650000, priceUSD: Math.round(1650000 / 2100), duration: '5D/4N',
      destination: 'Bangkok - Pattaya',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Hotel Accommodation (4★ & 5★)', 'Daily Breakfast & 2 Dinners', 'Airport Transfers', 'English Speaking Guide', 'Sightseeing Entry Fees', 'Coral Island Speedboat Trip', 'Bangkok-Pattaya Transport'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance'],
      itinerary: [
        { day: 1, title: 'Arrival in Bangkok', description: 'Welcome at Suvarnabhumi Airport. Transfer to hotel. Evening visit to Asiatique Riverside night market for shopping and dining.' },
        { day: 2, title: 'Bangkok Temple Tour', description: 'Visit the Grand Palace, Temple of the Emerald Buddha (Wat Phra Kaew), Wat Pho (Reclining Buddha), and Wat Arun (Temple of Dawn). Afternoon canal tour through Bangkok\'s klongs. Drive to Pattaya in the evening.' },
        { day: 3, title: 'Coral Island Adventure', description: 'Speedboat to Koh Larn (Coral Island). Snorkeling, parasailing, jet skiing, and beach time. Fresh seafood lunch on the beach. Evening at leisure on Pattaya Beach.' },
        { day: 4, title: 'Pattaya Discoveries', description: 'Visit Nong Nooch Tropical Garden with its spectacular landscaped gardens and cultural shows. Afternoon at Khao Chi Chan (Buddha Mountain). Evening Alcazar cabaret show.' },
        { day: 5, title: 'Bangkok Shopping & Departure', description: 'Return to Bangkok. Last-minute shopping at Siam Paragon or MBK Center. Transfer to airport for departure flight.' },
      ],
      images: ['https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&h=600&fit=crop'],
      status: 'active', rating: 4.5, reviewCount: 76, maxGroupSize: 22,
    },
    {
      title: 'Singapore City Lights',
      slug: makeSlug('Singapore City Lights'),
      description: 'Discover Singapore — a dazzling city-state where futuristic skyscrapers meet lush tropical gardens, and world-class cuisine blends Chinese, Malay, and Indian influences. From Gardens by the Bay to Sentosa Island, Singapore sparkles day and night.',
      priceMMK: 2100000, priceUSD: Math.round(2100000 / 2100), duration: '4D/3N',
      destination: 'Singapore',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Hotel Accommodation (4★)', 'Daily Breakfast', 'Airport Transfers', 'English Speaking Guide', 'Gardens by the Bay Entry', 'Sentosa Island Tour', 'City Night Tour', 'MRT Pass (3 Days)'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance', 'Universal Studios (optional)'],
      itinerary: [
        { day: 1, title: 'Arrival & Marina Bay', description: 'Welcome at Changi Airport. Hotel check-in. Evening at Marina Bay Sands SkyPark Observation Deck for panoramic views. Gardens by the Bay light show — Supertree Grove comes alive with Garden Rhapsody.' },
        { day: 2, title: 'Cultural Singapore', description: 'Morning at Merlion Park and the Esplanade. Explore Chinatown, Little India, and Kampong Glam (Arab Street). Visit Buddha Tooth Relic Temple and Sri Mariamman Temple. Afternoon at Singapore Botanic Gardens (UNESCO).' },
        { day: 3, title: 'Sentosa Island Fun', description: 'Full day at Sentosa Island: S.E.A. Aquarium, Adventure Cove Waterpark, and relaxing at Palawan Beach. Optional: Universal Studios Singapore. Evening wings of Time light and water show.' },
        { day: 4, title: 'Orchard Road & Departure', description: 'Morning shopping along Orchard Road. Visit Jewel Changi Airport (indoor waterfall and rainforest) before departure. Safe travels!' },
      ],
      images: ['https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop'],
      status: 'active', rating: 4.7, reviewCount: 63, maxGroupSize: 18,
    },
    {
      title: 'Angkor Wat Discovery',
      slug: makeSlug('Angkor Wat Discovery'),
      description: 'Step into the magnificent world of Angkor — the largest religious monument on Earth and the crown jewel of Cambodia\'s ancient Khmer Empire. Explore mysterious temple ruins reclaimed by jungle, intricate stone carvings, and the vibrant culture of Siem Reap.',
      priceMMK: 1450000, priceUSD: Math.round(1450000 / 2100), duration: '4D/3N',
      destination: 'Siem Reap - Angkor',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Hotel Accommodation (4★)', 'Daily Breakfast', 'Airport Transfers (Siem Reap)', 'English Speaking Guide', 'Angkor Pass (3 Days)', 'Tuk-Tuk Transport to Temples', 'Floating Village Boat Trip'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance'],
      itinerary: [
        { day: 1, title: 'Arrival & Siem Reap Evening', description: 'Airport pickup and hotel check-in. Evening at Pub Street and Angkor Night Market. Apsara dance show with traditional Khmer dinner.' },
        { day: 2, title: 'Angkor Wat & Angkor Thom', description: 'Sunrise at Angkor Wat — the iconic silhouette reflected in the lotus pond. Tour the temple galleries with 3,000 heavenly nymphs carved in stone. Afternoon at Angkor Thom: Bayon\'s smiling faces and the Terrace of the Elephants.' },
        { day: 3, title: 'Jungle Temples', description: 'Visit Ta Prohm — the "Tomb Raider temple" where massive tree roots embrace ancient stones. Continue to Preah Khan and Neak Pean. Afternoon at Banteay Srei, the "Citadel of Women" with exquisite pink sandstone carvings.' },
        { day: 4, title: 'Tonlé Sap & Departure', description: 'Morning boat trip on Tonlé Sap Lake to visit floating villages. See life on the water — schools, markets, and temples. Transfer to airport for departure.' },
      ],
      images: ['https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1583431815168-55a35bfefbd3?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=800&h=600&fit=crop'],
      status: 'active', rating: 4.5, reviewCount: 54, maxGroupSize: 20,
    },
    {
      title: 'Vietnam Heritage Trail',
      slug: makeSlug('Vietnam Heritage Trail'),
      description: 'Traverse Vietnam from north to south on this heritage-rich journey. From Hanoi\'s thousand-year-old streets to the emerald waters of Ha Long Bay, and the lantern-lit charm of Hoi An — experience Vietnam\'s timeless beauty and vibrant culture.',
      priceMMK: 2400000, priceUSD: Math.round(2400000 / 2100), duration: '7D/6N',
      destination: 'Hanoi - Ha Long - Hoi An',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Hotel Accommodation (4★ & 5★)', 'Daily Breakfast & 2 Dinners', 'Airport Transfers & Domestic Flight', 'English Speaking Guide', 'Sightseeing Entry Fees', 'Ha Long Bay Overnight Cruise', 'Hoi An Cooking Class'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance'],
      itinerary: [
        { day: 1, title: 'Arrival in Hanoi', description: 'Welcome at Noi Bai Airport. Transfer to hotel in Hanoi\'s Old Quarter. Evening walking tour through the 36 streets and Hoan Kiem Lake. Water puppet show at Thang Long theatre.' },
        { day: 2, title: 'Hanoi Heritage', description: 'Visit Ho Chi Minh Mausoleum, One Pillar Pagoda, and Temple of Literature — Vietnam\'s first university. Afternoon at the Museum of Ethnology. Evening street food tour through Hanoi\'s bustling alleyways.' },
        { day: 3, title: 'Ha Long Bay Cruise', description: 'Scenic drive to Ha Long Bay — a UNESCO World Heritage site. Board traditional junk boat for an overnight cruise. Kayaking among limestone karsts, swimming, and squid fishing under the stars.' },
        { day: 4, title: 'Ha Long Sunrise & Fly to Hoi An', description: 'Tai Chi at sunrise on deck. Visit Surprise Cave. Brunch on board before returning to port. Fly to Da Nang and transfer to Hoi An. Evening lantern walk through the ancient town.' },
        { day: 5, title: 'Hoi An Ancient Town', description: 'Morning Vietnamese cooking class at a riverside herb garden. Afternoon tour of Hoi An\'s UNESCO-listed old town: Japanese Covered Bridge, Phuc Kien Assembly Hall, and tailor shops. Sunset boat ride on Thu Bon River.' },
        { day: 6, title: 'My Son Sanctuary', description: 'Morning excursion to My Son Sanctuary — ancient Cham temple complex dating to the 4th century. Afternoon free for cycling through rice paddies or relaxing at An Bang Beach.' },
        { day: 7, title: 'Farewell Vietnam', description: 'Morning at leisure for last-minute exploration or custom tailoring pickup. Transfer to Da Nang Airport for departure flight. Cam on and safe travels!' },
      ],
      images: ['https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop'],
      status: 'featured', rating: 4.8, reviewCount: 82, maxGroupSize: 18,
    },
    // ─── NEW TOURS (10 more) ───
    {
      title: 'Yangon-Mandalay Express',
      slug: makeSlug('Yangon-Mandalay Express'),
      description: 'A fast-paced 3-day journey connecting Myanmar\'s two largest cities. Explore colonial Yangon, the sacred Shwedagon Pagoda, and the royal heritage of Mandalay in one compact adventure.',
      priceMMK: 550000, priceUSD: usd(550000), duration: '3D/2N',
      destination: 'Yangon - Mandalay',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Hotel Accommodation (4★)', 'Daily Breakfast', 'Airport Transfers', 'English Speaking Guide', 'Sightseeing Entry Fees', 'Domestic Flight (Yangon-Mandalay)', 'Drinking Water'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance'],
      itinerary: [
        { day: 1, title: 'Yangon Arrival & Shwedagon', description: 'Airport pickup. Afternoon visit to Chauk Htat Gyi reclining Buddha. Evening at Shwedagon Pagoda — Myanmar\'s holiest site glowing in gold at sunset.' },
        { day: 2, title: 'Fly to Mandalay & Royal Palace', description: 'Morning flight to Mandalay. Visit the Royal Palace, Shwenandaw Golden Teak Monastery, and Kuthodaw Pagoda. Sunset from Mandalay Hill.' },
        { day: 3, title: 'U Bein Bridge & Departure', description: 'Early morning visit to U Bein Bridge at sunrise. Transfer to Mandalay airport for departure.' },
      ],
      images: ['https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1590474251443-ea19bb0f4e89?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1558704475-1428913b4c6b?w=800&h=600&fit=crop'],
      status: 'active', rating: 4.3, reviewCount: 38, maxGroupSize: 22,
    },
    {
      title: 'Shan Highland Trek',
      slug: makeSlug('Shan Highland Trek'),
      description: 'Trek through the stunning Shan Highlands from Kalaw to Inle Lake. Rolling green hills, tea plantations, Pa-O and Danu tribal villages, and breathtaking panoramic views.',
      priceMMK: 850000, priceUSD: usd(850000), duration: '5D/4N',
      destination: 'Kalaw - Inle Lake',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Guesthouse & Village Homestay', 'All Meals During Trek', 'English Speaking Trekking Guide', 'Porter Service', 'Transfer to Trek Start', 'Inle Lake Boat at End', 'Drinking Water'],
      excluded: ['International Flights', 'Visa Fees', 'Travel Insurance', 'Personal Equipment'],
      itinerary: [
        { day: 1, title: 'Arrival in Kalaw', description: 'Arrive in the cool hill station of Kalaw. Explore the colonial-era town, colorful market, and Thein Taung Pagoda. Trek briefing.' },
        { day: 2, title: 'Trek Day 1: Kalaw to Pane Hne Pin', description: 'Begin trek through pine forests and tea plantations. Visit Pa-O villages. Overnight at a village homestay with traditional Shan dinner.' },
        { day: 3, title: 'Trek Day 2: Pane Hne Pin to Hti Thein', description: 'Continue through rolling hills and farmland. Visit Danu tribal villages. Panoramic ridge views. Homestay with local family.' },
        { day: 4, title: 'Trek Day 3: Hti Thein to Inle Lake', description: 'Final trek day descending toward Inle Lake. First glimpses of the shimmering lake from hilltops. Boat transfer to Nyaung Shwe.' },
        { day: 5, title: 'Inle Lake Tour & Departure', description: 'Morning boat tour of Inle Lake: floating gardens, leg-rowing fishermen, Phaung Daw Oo Pagoda. Transfer to Heho Airport.' },
      ],
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1583431815168-55a35bfefbd3?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1558704475-1428913b4c6b?w=800&h=600&fit=crop'],
      status: 'featured', rating: 4.8, reviewCount: 45, maxGroupSize: 12,
    },
    {
      title: 'Mrauk U Ancient Kingdoms',
      slug: makeSlug('Mrauk U Ancient Kingdoms'),
      description: 'Journey to the remote archaeological wonder of Mrauk U in Rakhine State. These mist-shrouded, fortress-like temples rival Angkor Wat in grandeur and mystery.',
      priceMMK: 950000, priceUSD: usd(950000), duration: '4D/3N',
      destination: 'Mrauk U - Rakhine',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Hotel Accommodation', 'Daily Breakfast', 'Airport Transfers (Sittwe)', 'Boat Transfer to Mrauk U', 'English Speaking Guide', 'Sightseeing Entry Fees', 'Chin Village Visit'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance'],
      itinerary: [
        { day: 1, title: 'Arrive Sittwe & Boat to Mrauk U', description: 'Flight to Sittwe. Scenic boat journey up the Kaladan River. Arrive at the ancient capital. Sunset at Shittaung Temple.' },
        { day: 2, title: 'Temple Exploration', description: 'Full day exploring fortress temples: Shittaung (Temple of 80,000 Buddhas), Htukkanthein, Koe-thaung, and Andaw Thein.' },
        { day: 3, title: 'Chin Villages & Local Life', description: 'Excursion to nearby Chin tribal villages. Traditional face-tattooed elders (dwindling tradition). Visit local market and weaving workshops.' },
        { day: 4, title: 'Sunrise & Return', description: 'Dawn at Shittaung Temple — mist rolling across temple-studded hills. Boat back to Sittwe. Fly to Yangon.' },
      ],
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1558704475-1428913b4c6b?w=800&h=600&fit=crop'],
      status: 'active', rating: 4.7, reviewCount: 24, maxGroupSize: 12,
    },
    {
      title: 'Hpa-An Cave Explorer',
      slug: makeSlug('Hpa-An Cave Explorer'),
      description: 'Discover the dramatic karst landscapes of Hpa-An in Kayin State — towering limestone mountains riddled with sacred caves, emerald rice paddies, and the serene Thanlwin River.',
      priceMMK: 420000, priceUSD: usd(420000), duration: '3D/2N',
      destination: 'Hpa-An - Kayin State',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Hotel Accommodation (3★)', 'Daily Breakfast', 'Transport from Yangon', 'English Speaking Guide', 'Sightseeing Entry Fees', 'Boat Trip on Thanlwin River', 'Cave Tours'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance'],
      itinerary: [
        { day: 1, title: 'Yangon to Hpa-An', description: 'Morning drive from Yangon through Bago region. Arrive Hpa-An. Evening visit to Kyauk Ka Lat Pagoda at sunset.' },
        { day: 2, title: 'Sacred Caves & Mountain Views', description: 'Visit Sadan Cave with hidden lake, Kawgun Cave with thousands of Buddha images, and Yathaypyan Cave. Sunset hike up Mount Zwegabin.' },
        { day: 3, title: 'Thanlwin River & Return', description: 'Morning boat trip on the Thanlwin River. Visit Lumbini Garden with 1,000 Buddha statues. Drive back to Yangon.' },
      ],
      images: ['https://images.unsplash.com/photo-1570167574777-7e5c2c5e60b5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1558704475-1428913b4c6b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1583431815168-55a35bfefbd3?w=800&h=600&fit=crop'],
      status: 'active', rating: 4.5, reviewCount: 31, maxGroupSize: 18,
    },
    {
      title: 'Pyin Oo Lwin Flower Festival',
      slug: makeSlug('Pyin Oo Lwin Flower Festival'),
      description: 'Escape to Pyin Oo Lwin — Myanmar\'s charming British hill station. Cool mountain air, colonial-era botanical gardens with 480+ flower species, and horse-drawn carriage rides.',
      priceMMK: 550000, priceUSD: usd(550000), duration: '4D/3N',
      destination: 'Pyin Oo Lwin - Mandalay',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Hotel Accommodation (Colonial-era 4★)', 'Daily Breakfast', 'Transport from Mandalay', 'English Speaking Guide', 'Kandawgyi Gardens Entry', 'Waterfall Visit', 'Coffee Plantation Tour'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance'],
      itinerary: [
        { day: 1, title: 'Mandalay to Pyin Oo Lwin', description: 'Scenic drive from Mandalay up the winding mountain road. Check into a colonial-era hotel. Evening horse-drawn carriage ride.' },
        { day: 2, title: 'Kandawgyi Botanical Gardens', description: 'Full morning at the National Kandawgyi Gardens — 480 species of flowers, orchid garden, swan lake. Afternoon at Peik Chin Myaung Cave.' },
        { day: 3, title: 'Waterfalls & Coffee', description: 'Morning visit to Anisakan Falls — a 120m cascade through lush forest. Afternoon tour of a local coffee plantation. Fresh strawberry picking (seasonal).' },
        { day: 4, title: 'Colonial Heritage & Return', description: 'Visit Purcell Tower, All Saints Church, and the old Governor\'s House. Drive back to Mandalay for departure.' },
      ],
      images: ['https://images.unsplash.com/photo-1585320806297-9794b3e4c2ab?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1590474251443-ea19bb0f4e89?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1558704475-1428913b4c6b?w=800&h=600&fit=crop'],
      status: 'active', rating: 4.4, reviewCount: 27, maxGroupSize: 18,
    },
    {
      title: 'Bali Paradise Escape',
      slug: makeSlug('Bali Paradise Escape'),
      description: 'Experience the enchanting Island of Gods — Bali. From ancient temples perched on dramatic cliffs to terraced rice paddies, world-class surfing beaches, and the spiritual heart of Ubud.',
      priceMMK: 1950000, priceUSD: usd(1950000), duration: '5D/4N',
      destination: 'Bali - Indonesia',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Resort Accommodation (4★)', 'Daily Breakfast & 1 Dinner', 'Airport Transfers (Ngurah Rai)', 'English Speaking Guide', 'Temple Entry Fees', 'Rice Terrace Tour', 'Kecak Fire Dance Show'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance'],
      itinerary: [
        { day: 1, title: 'Arrival in Bali', description: 'Welcome at Ngurah Rai Airport. Transfer to hotel in Ubud. Evening at Ubud Art Market. Welcome Balinese massage.' },
        { day: 2, title: 'Ubud Cultural Heart', description: 'Visit Tegalalang Rice Terrace, Sacred Monkey Forest, and Ubud Palace. Afternoon at Tegenungan Waterfall. Evening Kecak fire dance.' },
        { day: 3, title: 'Temple Trail', description: 'Visit Tanah Lot sea temple, Ulun Danu Bratan Temple on Lake Bratan, and Jatiluwih Rice Terrace (UNESCO).' },
        { day: 4, title: 'Beach & Relaxation', description: 'Morning at Seminyak Beach: surfing, sunbathing. Afternoon at Jimbaran Bay for fresh seafood barbecue at sunset.' },
        { day: 5, title: 'Departure', description: 'Morning at leisure. Last-minute souvenir shopping. Transfer to airport. Sampai jumpa!' },
      ],
      images: ['https://images.unsplash.com/photo-1537996194471-e657f9e13f57?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop'],
      status: 'featured', rating: 4.7, reviewCount: 59, maxGroupSize: 16,
    },
    {
      title: 'Japan Cherry Blossom Tour',
      slug: makeSlug('Japan Cherry Blossom Tour'),
      description: 'Experience the magic of Japan during cherry blossom season. From Tokyo\'s neon wonderland to Kyoto\'s ancient temples framed in pink sakura, and the iconic Mount Fuji.',
      priceMMK: 3850000, priceUSD: usd(3850000), duration: '7D/6N',
      destination: 'Tokyo - Hakone - Kyoto',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Hotel Accommodation (4★)', 'Daily Breakfast & 2 Kaiseki Dinners', 'Airport Transfers', 'English Speaking Guide', 'JR Pass (7 Days)', 'Sightseeing Entry Fees', 'Tea Ceremony', 'Mount Fuji Day Trip'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance'],
      itinerary: [
        { day: 1, title: 'Arrival in Tokyo', description: 'Welcome at Narita/Haneda Airport. Transfer to Shinjuku. Evening walking tour of neon-lit Kabukicho.' },
        { day: 2, title: 'Tokyo Highlights', description: 'Visit Meiji Shrine, Harajuku, and Shibuya Crossing. Afternoon at Asakusa Senso-ji Temple. Cherry blossom viewing at Ueno Park.' },
        { day: 3, title: 'Mount Fuji & Hakone', description: 'Day trip to Fuji Five Lakes region. Views of Mount Fuji. Hakone ropeway over Owakudani Valley. Lake Ashi cruise.' },
        { day: 4, title: 'Bullet Train to Kyoto', description: 'Shinkansen to Kyoto. Afternoon at Fushimi Inari Shrine. Evening walk through Gion geisha district.' },
        { day: 5, title: 'Kyoto Temple Trail', description: 'Kinkaku-ji (Golden Pavilion), Ryoan-ji Zen garden, Arashiyama Bamboo Grove. Traditional tea ceremony. Cherry blossoms at Maruyama Park.' },
        { day: 6, title: 'Nara Day Trip', description: 'Excursion to Nara: Todai-ji Temple, friendly deer in Nara Park, Kasuga Taisha shrine. Afternoon at Nishiki Market.' },
        { day: 7, title: 'Farewell Japan', description: 'Morning at Philosopher\'s Path. Transfer to Kansai Airport. Sayonara!' },
      ],
      images: ['https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1540959733332-eab4a01c9c82?w=800&h=600&fit=crop'],
      status: 'featured', rating: 4.9, reviewCount: 72, maxGroupSize: 14,
    },
    {
      title: 'Maldives Honeymoon Special',
      slug: makeSlug('Maldives Honeymoon Special'),
      description: 'The ultimate romantic escape — overwater villas, turquoise lagoons, and white sand beaches in the Maldives. Perfect for honeymooners and couples seeking paradise.',
      priceMMK: 3200000, priceUSD: usd(3200000), duration: '4D/3N',
      destination: 'Maldives',
      amenities: ['Resort', 'Breakfast', 'Guide', 'Transport'],
      included: ['Overwater Villa (5★)', 'Full Board (All Meals)', 'Speedboat Transfers', 'Sunset Dolphin Cruise', 'Couples Spa Treatment', 'Snorkeling Equipment', 'Romantic Beach Dinner'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Diving (optional)'],
      itinerary: [
        { day: 1, title: 'Arrival in Paradise', description: 'Welcome at Velana Airport. Speedboat transfer over crystal-clear waters. Sunset on your private overwater villa deck.' },
        { day: 2, title: 'Romance & Relaxation', description: 'Morning couples spa treatment. Afternoon snorkeling among manta rays and sea turtles. Romantic candlelit dinner on a sandbank.' },
        { day: 3, title: 'Dolphin Cruise & Island Life', description: 'Morning dolphin watching cruise. Afternoon at leisure: infinity pool, kayaking. Sunset fishing trip.' },
        { day: 4, title: 'Farewell Paradise', description: 'Final floating breakfast in your villa\'s pool. Last swim in the lagoon. Speedboat back to airport.' },
      ],
      images: ['https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop'],
      status: 'featured', rating: 4.9, reviewCount: 44, maxGroupSize: 2,
    },
    {
      title: 'South Korea Discovery',
      slug: makeSlug('South Korea Discovery'),
      description: 'From Seoul\'s high-tech urban energy to Gyeongju\'s ancient Silla dynasty heritage and Jeju Island\'s volcanic wonders — experience the best of South Korea.',
      priceMMK: 2950000, priceUSD: usd(2950000), duration: '6D/5N',
      destination: 'Seoul - Gyeongju - Jeju',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Hotel Accommodation (4★)', 'Daily Breakfast', 'Airport Transfers', 'English Speaking Guide', 'Sightseeing Entry Fees', 'KORAIL Pass', 'Jeju Flight', 'K-Pop Dance Class'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance'],
      itinerary: [
        { day: 1, title: 'Arrival in Seoul', description: 'Welcome at Incheon Airport. Evening at N Seoul Tower for panoramic city views. Korean BBQ welcome dinner.' },
        { day: 2, title: 'Seoul Highlights', description: 'Gyeongbokgung Palace (in hanbok), Bukchon Hanok Village, Insadong. K-pop dance class. Evening at Hongdae.' },
        { day: 3, title: 'DMZ & Fly to Jeju', description: 'Morning DMZ tour. Afternoon flight to Jeju Island. Check into seaside resort. Sunset at Hyeopjae Beach.' },
        { day: 4, title: 'Jeju Wonders', description: 'Seongsan Ilchulbong (Sunrise Peak — UNESCO), Manjang Cave, Cheonjiyeon Waterfall. Jeju black pork dinner.' },
        { day: 5, title: 'Gyeongju Ancient Capital', description: 'Flight to Gyeongju. Bulguksa Temple, Seokguram Grotto (UNESCO), Daereungwon tomb complex. Evening at Anapji Pond.' },
        { day: 6, title: 'Seoul Shopping & Departure', description: 'Return to Seoul. Last-minute shopping at Namdaemun Market. Transfer to airport. Annyeonghi gaseyo!' },
      ],
      images: ['https://images.unsplash.com/photo-1534274988757-a0bf53023472?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1506815444479-bfdb1e96c566?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop'],
      status: 'active', rating: 4.6, reviewCount: 41, maxGroupSize: 16,
    },
    {
      title: 'Dubai Luxury Experience',
      slug: makeSlug('Dubai Luxury Experience'),
      description: 'Experience the glittering opulence of Dubai — the city of superlatives. From the world\'s tallest building to desert safaris, gold souks, and man-made islands.',
      priceMMK: 2750000, priceUSD: usd(2750000), duration: '5D/4N',
      destination: 'Dubai - UAE',
      amenities: ['Hotel', 'Breakfast', 'Guide', 'Transport'],
      included: ['Hotel Accommodation (5★)', 'Daily Breakfast & 1 Dinner', 'Airport Transfers', 'English Speaking Guide', 'Burj Khalifa 124th Floor', 'Desert Safari with BBQ', 'Dhow Cruise Dinner', 'Dubai Mall Aquarium'],
      excluded: ['International Flights', 'Visa Fees', 'Personal Expenses', 'Travel Insurance'],
      itinerary: [
        { day: 1, title: 'Arrival in Dubai', description: 'Welcome at DXB Airport. Evening at Dubai Mall and Burj Khalifa — sunset from the world\'s highest observation deck.' },
        { day: 2, title: 'City of Gold', description: 'Jumeirah Mosque, Burj Al Arab, Palm Jumeirah. Afternoon at Gold Souk and Spice Souk. Evening Dhow dinner cruise on Dubai Creek.' },
        { day: 3, title: 'Desert Safari', description: 'Morning at leisure. Afternoon desert safari: dune bashing, camel riding, sandboarding, Arabian BBQ dinner under the stars.' },
        { day: 4, title: 'Modern Dubai', description: 'Dubai Frame, Museum of the Future, La Mer beach. Afternoon at The View at Palm. Evening at Dubai Marina Walk.' },
        { day: 5, title: 'Farewell Dubai', description: 'Morning at Miracle Garden (seasonal). Shopping at Mall of the Emirates. Transfer to airport. Ma\'a salama!' },
      ],
      images: ['https://images.unsplash.com/photo-1512453979796-25f96bf5c0fe?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop'],
      status: 'active', rating: 4.7, reviewCount: 88, maxGroupSize: 20,
    },

  ]);
  console.log(`  ✅ ${tours.length} tour packages created.`);

  // ─── 3. HOTELS ───
  console.log('\n🏨 Creating hotels...');

  const hotels = await Hotel.insertMany([
    {
      name: 'Sule Shangri-La Yangon', slug: makeSlug('Sule Shangri-La Yangon'),
      location: 'Yangon', address: '223 Sule Pagoda Road, Pabedan Township, Yangon, Myanmar',
      description: 'An iconic luxury hotel in the heart of Yangon, located adjacent to the historic Sule Pagoda. The Sule Shangri-La offers world-class hospitality with elegant rooms, exceptional dining, and panoramic city views.',
      stars: 5,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Room Service', 'Bar', 'Business Center'],
      roomTypes: [
        { name: 'Deluxe Room', priceMMK: 180000, capacity: 2, available: 20 },
        { name: 'Horizon Club Room', priceMMK: 280000, capacity: 2, available: 15 },
        { name: 'Executive Suite', priceMMK: 420000, capacity: 3, available: 10 },
      ],
      pricePerNightMMK: 180000, pricePerNightUSD: usd(180000), pricePerNight: 180000, totalRooms: 45,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop'],
      status: 'featured',
    },
    {
      name: 'Aureum Palace Bagan', slug: makeSlug('Aureum Palace Bagan'),
      location: 'Bagan', address: 'Bagan-Nyaung U Airport Road, Bagan, Mandalay Region, Myanmar',
      description: 'Nestled within the mystical temple plains of Bagan, the Aureum Palace offers a luxurious retreat surrounded by ancient pagodas.',
      stars: 5,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Room Service', 'Bar'],
      roomTypes: [
        { name: 'Deluxe Villa', priceMMK: 220000, capacity: 2, available: 12 },
        { name: 'Temple View Suite', priceMMK: 350000, capacity: 3, available: 10 },
        { name: 'Presidential Villa', priceMMK: 550000, capacity: 4, available: 8 },
      ],
      pricePerNightMMK: 220000, pricePerNightUSD: usd(220000), pricePerNight: 220000, totalRooms: 30,
      images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'],
      status: 'featured',
    },
    // ─── NEW HOTELS (7 more) ───
    {
      name: 'The Strand Yangon', slug: makeSlug('The Strand Yangon'),
      location: 'Yangon', rating: 4.9, reviewCount: 412,
      pricePerNightMMK: 350000, pricePerNightUSD: usd(350000),
      pricePerNightMMK: 350000, pricePerNightUSD: usd(350000), pricePerNight: 350000,
      description: 'A legendary colonial-era landmark built in 1901 by the Sarkies Brothers. The Strand Yangon has hosted royalty, writers, and dignitaries for over a century.',
      stars: 5, totalRooms: 32, availableRooms: 8,
      amenities: ['WiFi', 'Butler Service', 'Spa', 'Fine Dining', 'Bar', 'Room Service', 'Business Center'],
      roomTypes: [
        { name: 'Superior Suite', priceMMK: 350000, capacity: 2, available: 20 },
        { name: 'Deluxe Suite', priceMMK: 480000, capacity: 2, available: 10 },
        { name: 'Strand Suite', priceMMK: 750000, capacity: 3, available: 2 },
      ],
      images: ['https://images.unsplash.com/photo-1566665798629-69f7e7ba6ecf?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'],
      status: 'featured',
    },
    {
      name: 'PARKROYAL Yangon', slug: makeSlug('PARKROYAL Yangon'),
      location: 'Yangon', rating: 4.4, reviewCount: 168,
      pricePerNightMMK: 160000, pricePerNightUSD: usd(160000),
      pricePerNightMMK: 160000, pricePerNightUSD: usd(160000), pricePerNight: 160000,
      description: 'A modern 5-star hotel centrally located near Bogyoke Market and Sule Pagoda. Rooftop pool and panoramic city views.',
      stars: 5, totalRooms: 334, availableRooms: 120,
      amenities: ['WiFi', 'Rooftop Pool', 'Spa', 'Restaurant', 'Gym', 'Room Service', 'Bar', 'Business Center'],
      roomTypes: [
        { name: 'Deluxe Room', priceMMK: 160000, capacity: 2, available: 80 },
        { name: 'Club Room', priceMMK: 240000, capacity: 2, available: 30 },
        { name: 'Suite', priceMMK: 380000, capacity: 3, available: 10 },
      ],
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop'],
      status: 'active',
    },
    {
      name: 'Bagan Thande Hotel', slug: makeSlug('Bagan Thande Hotel'),
      location: 'Bagan', rating: 4.2, reviewCount: 98,
      pricePerNightMMK: 95000, pricePerNightUSD: usd(95000),
      pricePerNightMMK: 95000, pricePerNightUSD: usd(95000), pricePerNight: 95000,
      description: 'A historic riverside hotel set in beautiful gardens on the banks of the Irrawaddy River. Famous for its 100-year-old acacia tree.',
      stars: 3, totalRooms: 60, availableRooms: 25,
      amenities: ['WiFi', 'Riverside Restaurant', 'Bar', 'Room Service', 'Garden', 'Bicycle Rental', 'Sunset Deck'],
      roomTypes: [
        { name: 'Garden View Room', priceMMK: 95000, capacity: 2, available: 30 },
        { name: 'River View Room', priceMMK: 140000, capacity: 2, available: 20 },
        { name: 'Suite', priceMMK: 220000, capacity: 3, available: 10 },
      ],
      images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'],
      status: 'active',
    },
    {
      name: 'Pristine Lotus Spa Resort', slug: makeSlug('Pristine Lotus Spa Resort'),
      location: 'Inle Lake', rating: 4.5, reviewCount: 87,
      pricePerNightMMK: 210000, pricePerNightUSD: usd(210000),
      pricePerNightMMK: 210000, pricePerNightUSD: usd(210000), pricePerNight: 210000,
      description: 'A luxury spa resort on the shores of Inle Lake with natural hot spring pools. Surrounded by the blue Shan mountains.',
      stars: 5, totalRooms: 22, availableRooms: 9,
      amenities: ['WiFi', 'Hot Spring Pool', 'Spa', 'Restaurant', 'Yoga Studio', 'Room Service', 'Bar'],
      roomTypes: [
        { name: 'Villa with Hot Spring', priceMMK: 210000, capacity: 2, available: 10 },
        { name: 'Lake View Villa', priceMMK: 290000, capacity: 2, available: 8 },
        { name: 'Presidential Villa', priceMMK: 450000, capacity: 4, available: 4 },
      ],
      images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'],
      status: 'active',
    },
    {
      name: 'Amazing Ngapali Resort', slug: makeSlug('Amazing Ngapali Resort'),
      location: 'Ngapali Beach', rating: 4.4, reviewCount: 115,
      pricePerNightMMK: 195000, pricePerNightUSD: usd(195000),
      pricePerNightMMK: 195000, pricePerNightUSD: usd(195000), pricePerNight: 195000,
      description: 'A beachfront paradise with traditional Rakhine architecture and modern luxury. Infinity pool overlooking the Andaman Sea.',
      stars: 4, totalRooms: 48, availableRooms: 18,
      amenities: ['WiFi', 'Infinity Pool', 'Spa', 'Restaurant', 'Gym', 'Room Service', 'Bar', 'Beach Access', 'Water Sports'],
      roomTypes: [
        { name: 'Deluxe Garden View', priceMMK: 195000, capacity: 2, available: 20 },
        { name: 'Beachfront Bungalow', priceMMK: 290000, capacity: 2, available: 18 },
        { name: 'Family Suite', priceMMK: 380000, capacity: 4, available: 10 },
      ],
      images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop'],
      status: 'active',
    },
    {
      name: 'Chatrium Hotel Royal Lake', slug: makeSlug('Chatrium Hotel Royal Lake'),
      location: 'Yangon', rating: 4.5, reviewCount: 220,
      pricePerNightMMK: 175000, pricePerNightUSD: usd(175000),
      pricePerNightMMK: 175000, pricePerNightUSD: usd(175000), pricePerNight: 175000,
      description: 'Overlooking Kandawgyi Lake and Shwedagon Pagoda, Chatrium offers spacious suites with stunning views.',
      stars: 5, totalRooms: 303, availableRooms: 90,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Room Service', 'Bar', 'Business Center', 'Lake View'],
      roomTypes: [
        { name: 'Deluxe Room', priceMMK: 175000, capacity: 2, available: 60 },
        { name: 'Grand Suite', priceMMK: 280000, capacity: 2, available: 25 },
        { name: 'Royal Suite', priceMMK: 480000, capacity: 3, available: 5 },
      ],
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop'],
      status: 'active',
    },
    {
      name: 'Hotel G Yangon', slug: makeSlug('Hotel G Yangon'),
      location: 'Yangon', rating: 4.1, reviewCount: 95,
      pricePerNightMMK: 85000, pricePerNightUSD: usd(85000),
      pricePerNightMMK: 85000, pricePerNightUSD: usd(85000), pricePerNight: 85000,
      description: 'A trendy boutique hotel for the modern traveler. Stylish rooms, vibrant social spaces, and a rooftop bar with views of Sule Pagoda.',
      stars: 4, totalRooms: 85, availableRooms: 35,
      amenities: ['WiFi', 'Rooftop Bar', 'Restaurant', 'Gym', 'Room Service', 'Co-working Space', 'Bicycle Rental'],
      roomTypes: [
        { name: 'Good Room', priceMMK: 85000, capacity: 2, available: 40 },
        { name: 'Great Room', priceMMK: 120000, capacity: 2, available: 30 },
        { name: 'Greater Suite', priceMMK: 180000, capacity: 3, available: 15 },
      ],
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop'],
      status: 'active',
    },
    {
      name: 'Mandalay Hill Resort', slug: makeSlug('Mandalay Hill Resort'),
      location: 'Mandalay', address: '9 Kwin 416B, 10th Street, Mandalay, Myanmar',
      description: 'Perched at the foot of the sacred Mandalay Hill, this elegant resort offers breathtaking views.',
      stars: 4,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Room Service'],
      roomTypes: [
        { name: 'Superior Room', priceMMK: 120000, capacity: 2, available: 25 },
        { name: 'Deluxe Room', priceMMK: 180000, capacity: 2, available: 20 },
        { name: 'Junior Suite', priceMMK: 260000, capacity: 3, available: 10 },
      ],
      pricePerNightMMK: 120000, pricePerNightUSD: usd(120000), pricePerNight: 120000, totalRooms: 55,
      images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'],
      status: 'active',
    },
    {
      name: 'Inle Princess Resort', slug: makeSlug('Inle Princess Resort'),
      location: 'Inle Lake', address: 'Magyizin Village, Inle Lake, Nyaung Shwe Township, Shan State, Myanmar',
      description: 'A serene eco-resort floating on the tranquil waters of Inle Lake, accessible only by boat.',
      stars: 4,
      amenities: ['WiFi', 'Spa', 'Restaurant', 'Room Service', 'Bar', 'Lake Access'],
      roomTypes: [
        { name: 'Lake View Chalet', priceMMK: 160000, capacity: 2, available: 10 },
        { name: 'Floating Villa', priceMMK: 240000, capacity: 2, available: 8 },
        { name: 'Family Suite', priceMMK: 320000, capacity: 4, available: 7 },
      ],
      pricePerNightMMK: 160000, pricePerNightUSD: usd(160000), pricePerNight: 160000, totalRooms: 25,
      images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'],
      status: 'active',
    },
    {
      name: 'Ngapali Bay Hotel', slug: makeSlug('Ngapali Bay Hotel'),
      location: 'Ngapali Beach', address: 'Ngapali Beach, Lintha Village, Thandwe Township, Rakhine State, Myanmar',
      description: 'A luxury beachfront resort on Myanmar\'s most beautiful coastline.',
      stars: 5,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Room Service', 'Bar', 'Beach Access', 'Water Sports'],
      roomTypes: [
        { name: 'Garden View Room', priceMMK: 250000, capacity: 2, available: 15 },
        { name: 'Ocean View Suite', priceMMK: 380000, capacity: 3, available: 15 },
        { name: 'Beachfront Villa', priceMMK: 520000, capacity: 4, available: 10 },
      ],
      pricePerNightMMK: 250000, pricePerNightUSD: usd(250000), pricePerNight: 250000, totalRooms: 40,
      images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop'],
      status: 'active',
    },
    {
      name: 'Sedona Hotel Yangon', slug: makeSlug('Sedona Hotel Yangon'),
      location: 'Yangon', address: '1 Kaba Aye Pagoda Road, Yankin Township, Yangon, Myanmar',
      description: 'A prestigious 5-star hotel overlooking the serene Inya Lake.',
      stars: 5,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Room Service', 'Bar', 'Tennis Court', 'Business Center'],
      roomTypes: [
        { name: 'Deluxe Lake View', priceMMK: 200000, capacity: 2, available: 25 },
        { name: 'Club Room', priceMMK: 310000, capacity: 2, available: 20 },
        { name: 'Ambassador Suite', priceMMK: 480000, capacity: 3, available: 15 },
      ],
      pricePerNightMMK: 200000, pricePerNightUSD: usd(200000), pricePerNight: 200000, totalRooms: 60,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop'],
      status: 'active',
    },
    {
      name: 'Bagan Lodge', slug: makeSlug('Bagan Lodge'),
      location: 'Bagan', address: 'Myat Lay Road, New Bagan, Mandalay Region, Myanmar',
      description: 'A charming 4-star lodge offering a luxurious glamping experience on the edge of the Bagan temple plains.',
      stars: 4,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Room Service', 'Bicycle Rental'],
      roomTypes: [
        { name: 'Deluxe Room', priceMMK: 150000, capacity: 2, available: 15 },
        { name: 'Premium Suite', priceMMK: 220000, capacity: 3, available: 12 },
        { name: 'Family Lodge', priceMMK: 300000, capacity: 4, available: 8 },
      ],
      pricePerNightMMK: 150000, pricePerNightUSD: usd(150000), pricePerNight: 150000, totalRooms: 35,
      images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'],
      status: 'active',
    },
    {
      name: 'Novotel Yangon Max', slug: makeSlug('Novotel Yangon Max'),
      location: 'Yangon', address: '459 Pyay Road, Kamayut Township, Yangon, Myanmar',
      description: 'A contemporary 4-star hotel in the heart of Yangon\'s business district.',
      stars: 4,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Room Service', 'Bar'],
      roomTypes: [
        { name: 'Superior Room', priceMMK: 140000, capacity: 2, available: 20 },
        { name: 'Executive Room', priceMMK: 210000, capacity: 2, available: 18 },
        { name: 'Suite', priceMMK: 350000, capacity: 3, available: 12 },
      ],
      pricePerNightMMK: 140000, pricePerNightUSD: usd(140000), pricePerNight: 140000, totalRooms: 50,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop'],
      status: 'active',
    },
  ]);
  console.log(`  ✅ ${hotels.length} hotels created.`);

  // ─── 4. CAR RENTALS ───
  console.log('\n🚗 Creating car rentals...');

  const cars = await CarRental.insertMany([
    {
      name: 'Toyota Alphard', slug: makeSlug('Toyota Alphard'), carType: 'Toyota Alphard',
      description: 'Premium luxury MPV perfect for VIP guests, families, and business travelers.',
      capacity: 6, features: ['AC', 'Leather Seats', 'WiFi', 'Water Bottles', 'English Speaking Driver', 'Captain Seats'],
      pricing: { halfDay: 60000, fullDay: 100000, airportTransfer: 50000 },
      pricingWithDriver: [
        { duration: 'Half Day', priceMMK: 60000, priceUSD: usd(60000) },
        { duration: 'Full Day', priceMMK: 100000, priceUSD: usd(100000) },
        { duration: 'Airport Transfer', priceMMK: 50000, priceUSD: usd(50000) },
      ],
      images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop'],
      status: 'available',
    },
    {
      name: 'Toyota Vios', slug: makeSlug('Toyota Vios'), carType: 'Toyota Vios',
      description: 'Reliable and fuel-efficient sedan for city travel and short trips.',
      capacity: 4, features: ['AC', 'Water Bottles', 'English Speaking Driver', 'GPS'],
      pricing: { halfDay: 35000, fullDay: 60000, airportTransfer: 25000 },
      pricingWithDriver: [
        { duration: 'Half Day', priceMMK: 35000, priceUSD: usd(35000) },
        { duration: 'Full Day', priceMMK: 60000, priceUSD: usd(60000) },
        { duration: 'Airport Transfer', priceMMK: 25000, priceUSD: usd(25000) },
      ],
      images: ['https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'],
      status: 'available',
    },
    {
      name: 'Toyota Hiace', slug: makeSlug('Toyota Hiace'), carType: 'Toyota Hiace',
      description: 'Spacious 12-seater van for group tours, family trips, and corporate events.',
      capacity: 12, features: ['AC', 'Water Bottles', 'English Speaking Driver', 'Luggage Space', 'Reclining Seats'],
      pricing: { halfDay: 80000, fullDay: 140000 },
      pricingWithDriver: [
        { duration: 'Half Day', priceMMK: 80000, priceUSD: usd(80000) },
        { duration: 'Full Day', priceMMK: 140000, priceUSD: usd(140000) },
      ],
      pricingWithDriver: [
        { duration: 'Half Day', priceMMK: 80000, priceUSD: usd(80000) },
        { duration: 'Full Day', priceMMK: 140000, priceUSD: usd(140000) },
      ],
      images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop'],
      status: 'available',
    },
    {
      name: 'Honda CR-V', slug: makeSlug('Honda CR-V'), carType: 'Honda CR-V',
      description: 'Versatile SUV perfect for Myanmar\'s diverse road conditions.',
      capacity: 5, features: ['AC', 'Leather Seats', 'Water Bottles', 'English Speaking Driver', 'Sunroof'],
      pricing: { halfDay: 50000, fullDay: 85000 },
      pricingWithDriver: [
        { duration: 'Half Day', priceMMK: 50000, priceUSD: usd(50000) },
        { duration: 'Full Day', priceMMK: 85000, priceUSD: usd(85000) },
      ],
      images: ['https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'],
      status: 'available',
    },
    {
      name: 'Mercedes S-Class', slug: makeSlug('Mercedes S-Class'), carType: 'Mercedes S-Class',
      description: 'Ultimate luxury sedan for VIP transfers and special occasions.',
      capacity: 3, features: ['AC', 'Leather Seats', 'WiFi', 'Water Bottles', 'English Speaking Driver', 'Massage Seats', 'Privacy Glass'],
      pricing: { fullDay: 250000, airportVIP: 120000 },
      pricingWithDriver: [
        { duration: 'Full Day', priceMMK: 250000, priceUSD: usd(250000) },
        { duration: 'Airport VIP', priceMMK: 120000, priceUSD: usd(120000) },
      ],
      images: ['https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'],
      status: 'available',
    },
    {
      name: 'Toyota Probox', slug: makeSlug('Toyota Probox'), carType: 'Toyota Probox',
      description: 'Economical and practical wagon for budget-conscious travelers.',
      capacity: 4, features: ['AC', 'Water Bottles', 'English Speaking Driver'],
      pricing: { halfDay: 25000, fullDay: 45000 },
      pricingWithDriver: [
        { duration: 'Half Day', priceMMK: 25000, priceUSD: usd(25000) },
        { duration: 'Full Day', priceMMK: 45000, priceUSD: usd(45000) },
      ],
      pricingWithDriver: [
        { duration: 'Half Day', priceMMK: 25000, priceUSD: usd(25000) },
        { duration: 'Full Day', priceMMK: 45000, priceUSD: usd(45000) },
      ],
      images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop'],
      status: 'available',
    },
  
    // ─── NEW CARS (9 more) ───
    {
      carType: 'Toyota Crown', slug: makeSlug('Toyota Crown'),
      description: 'Elegant executive sedan combining Toyota reliability with premium comfort. Ideal for business travelers and corporate clients.',
      capacity: 4, features: ['AC', 'Leather Seats', 'WiFi', 'Water Bottles', 'English Speaking Driver', 'Rear AC Control'],
      pricingWithDriver: [
        { duration: 'Half Day', priceMMK: 55000, priceUSD: usd(55000) },
        { duration: 'Full Day', priceMMK: 95000, priceUSD: usd(95000) },
        { duration: 'Airport Transfer', priceMMK: 40000, priceUSD: usd(40000) },
      ],
      pricing: { halfDay: 55000, fullDay: 95000, airportTransfer: 40000 },
      images: ['https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'],
      status: 'available',
    },
    {
      carType: 'Suzuki Ertiga', slug: makeSlug('Suzuki Ertiga'),
      description: 'Versatile 7-seater MPV at an affordable price. Perfect for family outings, small group tours, and airport runs.',
      capacity: 7, features: ['AC', 'Water Bottles', 'English Speaking Driver', 'Flexible Seating', 'Rear AC'],
      pricingWithDriver: [
        { duration: 'Half Day', priceMMK: 45000, priceUSD: usd(45000) },
        { duration: 'Full Day', priceMMK: 75000, priceUSD: usd(75000) },
        { duration: 'Airport Transfer', priceMMK: 30000, priceUSD: usd(30000) },
      ],
      pricing: { halfDay: 45000, fullDay: 75000, airportTransfer: 30000 },
      images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop'],
      status: 'available',
    },
    {
      carType: 'Honda Fit', slug: makeSlug('Honda Fit'),
      description: 'Compact yet surprisingly spacious hatchback. Excellent fuel economy — perfect for city navigation and short trips.',
      capacity: 5, features: ['AC', 'Water Bottles', 'English Speaking Driver', 'Foldable Rear Seats', 'Compact & Nimble'],
      pricingWithDriver: [
        { duration: 'Half Day', priceMMK: 30000, priceUSD: usd(30000) },
        { duration: 'Full Day', priceMMK: 50000, priceUSD: usd(50000) },
        { duration: 'Airport Transfer', priceMMK: 20000, priceUSD: usd(20000) },
      ],
      pricing: { halfDay: 30000, fullDay: 50000, airportTransfer: 20000 },
      images: ['https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'],
      status: 'available',
    },
    {
      carType: 'Toyota Land Cruiser Prado', slug: makeSlug('Toyota Land Cruiser Prado'),
      description: 'The ultimate adventure SUV. Exceptional off-road capability and luxurious interior. Ideal for remote destinations like Mrauk U or highland treks.',
      capacity: 7, features: ['AC', 'Leather Seats', 'WiFi', 'Water Bottles', 'English Speaking Driver', '4WD', 'Sunroof', 'Premium Sound'],
      pricingWithDriver: [
        { duration: 'Full Day', priceMMK: 180000, priceUSD: usd(180000) },
        { duration: 'Multi-Day (per day)', priceMMK: 160000, priceUSD: usd(160000) },
      ],
      pricing: { fullDay: 180000, multiDay: 160000 },
      images: ['https://images.unsplash.com/photo-1533106418989-88406c7cc4c1?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop'],
      status: 'available',
    },
    {
      carType: 'Nissan X-Trail', slug: makeSlug('Nissan X-Trail'),
      description: 'Stylish mid-size SUV with excellent comfort and road presence. Great for family trips and outstation journeys.',
      capacity: 5, features: ['AC', 'Leather Seats', 'Water Bottles', 'English Speaking Driver', 'Panoramic Roof', '360° Camera'],
      pricingWithDriver: [
        { duration: 'Half Day', priceMMK: 60000, priceUSD: usd(60000) },
        { duration: 'Full Day', priceMMK: 100000, priceUSD: usd(100000) },
        { duration: 'Airport Transfer', priceMMK: 40000, priceUSD: usd(40000) },
      ],
      pricing: { halfDay: 60000, fullDay: 100000, airportTransfer: 40000 },
      images: ['https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'],
      status: 'available',
    },
    {
      carType: 'Toyota Hiace Commuter', slug: makeSlug('Toyota Hiace Commuter'),
      description: 'Extra-large 15-seater van for big groups, corporate shuttles, and wedding transport. Plenty of room for passengers and luggage.',
      capacity: 15, features: ['AC', 'Water Bottles', 'English Speaking Driver', 'Luggage Space', 'Reclining Seats', 'PA System'],
      pricingWithDriver: [
        { duration: 'Half Day', priceMMK: 100000, priceUSD: usd(100000) },
        { duration: 'Full Day', priceMMK: 170000, priceUSD: usd(170000) },
      ],
      pricing: { halfDay: 100000, fullDay: 170000 },
      images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop'],
      status: 'available',
    },
    {
      carType: 'Hyundai Starex', slug: makeSlug('Hyundai Starex'),
      description: 'Premium 8-seater MPV with exceptional comfort. Popular for VIP group transfers, family vacations, and corporate hospitality.',
      capacity: 8, features: ['AC', 'Leather Seats', 'WiFi', 'Water Bottles', 'English Speaking Driver', 'Individual AC Vents', 'Premium Sound'],
      pricingWithDriver: [
        { duration: 'Half Day', priceMMK: 70000, priceUSD: usd(70000) },
        { duration: 'Full Day', priceMMK: 120000, priceUSD: usd(120000) },
        { duration: 'Airport Transfer', priceMMK: 50000, priceUSD: usd(50000) },
      ],
      pricing: { halfDay: 70000, fullDay: 120000, airportTransfer: 50000 },
      images: ['https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'],
      status: 'available',
    },
    {
      carType: 'Ford Ranger', slug: makeSlug('Ford Ranger'),
      description: 'Rugged and powerful pickup truck. Perfect for adventurers, photographers, and those heading to remote locations.',
      capacity: 5, features: ['AC', 'Water Bottles', 'English Speaking Driver', '4WD', 'High Ground Clearance', 'Bed Cover'],
      pricingWithDriver: [
        { duration: 'Full Day', priceMMK: 120000, priceUSD: usd(120000) },
        { duration: 'Multi-Day (per day)', priceMMK: 100000, priceUSD: usd(100000) },
      ],
      pricing: { fullDay: 120000, multiDay: 100000 },
      images: ['https://images.unsplash.com/photo-1533106418989-88406c7cc4c1?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop'],
      status: 'available',
    },
    {
      carType: 'Toyota Wish', slug: makeSlug('Toyota Wish'),
      description: 'Practical 7-seater MPV at a great price point. Popular choice for airport transfers and family outings. Comfortable and reliable.',
      capacity: 7, features: ['AC', 'Water Bottles', 'English Speaking Driver', 'Flexible Seating', 'Fuel Efficient'],
      pricingWithDriver: [
        { duration: 'Half Day', priceMMK: 40000, priceUSD: usd(40000) },
        { duration: 'Full Day', priceMMK: 70000, priceUSD: usd(70000) },
        { duration: 'Airport Transfer', priceMMK: 28000, priceUSD: usd(28000) },
      ],
      pricing: { halfDay: 40000, fullDay: 70000, airportTransfer: 28000 },
      images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=600&fit=crop'],
      status: 'available',
    },
  ]);
  console.log(`  ✅ ${cars.length} car rentals created.`);

  // ─── 5. VISA SERVICES ───
  console.log('\n🛂 Creating visa services...');

  const visas = await VisaService.insertMany([
    {
      country: 'Thailand', countryCode: 'TH', processingTime: '3-5 Business Days', visaFeeMMK: 85000, visaFeeUSD: usd(85000), visaFee: 85000,
      requirements: ['Passport (6 months validity)', '2 Passport Photos (3.5 x 4.5 cm, white background)', 'Application Form (completed & signed)', 'Flight Booking (confirmed round-trip)', 'Hotel Reservation (confirmed)'],
      additionalInfo: 'Thailand offers visa-free entry for 14 days for Myanmar passport holders. For longer stays, a tourist visa is required. Express applications in 1-2 business days for additional fee.',
    },
    {
      country: 'Singapore', countryCode: 'SG', processingTime: '5-7 Business Days', visaFeeMMK: 120000, visaFeeUSD: usd(120000), visaFee: 120000,
      requirements: ['Passport (6 months validity)', '2 Passport Photos (3.5 x 4.5 cm, white background)', 'Application Form (Form 14A)', 'Flight Booking (confirmed round-trip)', 'Hotel Reservation (confirmed)', 'Bank Statement (last 3 months, min SGD 1,000)'],
      additionalInfo: 'Singapore visa applications require biometrics at VFS center in Yangon. A9 Global assists with appointment booking.',
    },
    {
      country: 'Vietnam', countryCode: 'VN', processingTime: '3-5 Business Days', visaFeeMMK: 95000, visaFeeUSD: usd(95000), visaFee: 95000,
      requirements: ['Passport (6 months validity)', '2 Passport Photos (4 x 6 cm, white background)', 'Application Form', 'Flight Booking (confirmed round-trip)', 'Hotel Reservation (confirmed)'],
      additionalInfo: 'Vietnam also offers e-visa for Myanmar passport holders (30 days, single entry). Express processing in 1-2 business days.',
    },
    {
      country: 'China', countryCode: 'CN', processingTime: '5-7 Business Days', visaFeeMMK: 150000, visaFeeUSD: usd(150000), visaFee: 150000,
      requirements: ['Passport (6 months validity, 2 blank pages)', '2 Passport Photos (3.3 x 4.8 cm)', 'Application Form', 'Flight Booking (confirmed round-trip)', 'Hotel Reservation (confirmed)', 'Bank Statement (last 3 months)', 'Travel Itinerary'],
      additionalInfo: 'China visa applications require in-person biometric submission. Processing may extend during Chinese holidays.',
    },
    {
      country: 'Malaysia', countryCode: 'MY', processingTime: '3-5 Business Days', visaFeeMMK: 75000, visaFeeUSD: usd(75000), visaFee: 75000,
      requirements: ['Passport (6 months validity)', '2 Passport Photos (3.5 x 5 cm)', 'Application Form', 'Flight Booking (confirmed round-trip)', 'Hotel Reservation (confirmed)'],
      additionalInfo: 'Malaysia offers visa-free entry for Myanmar nationals for up to 30 days. E-visa also available for eligible travelers.',
    },
    { country: 'India', countryCode: 'IN', processingTime: '5-7 Business Days', visaFeeMMK: 110000, visaFeeUSD: usd(110000), visaFee: 110000,
      requirements: ['Passport (6 months validity, 2 blank pages)', '2 Passport Photos (5 x 5 cm)', 'Online Application Form', 'Flight Booking (confirmed round-trip)', 'Hotel Reservation (confirmed)'],
      additionalInfo: 'India offers e-visa for Myanmar passport holders. E-visa typically processed within 72 hours.',
    },
    // ─── NEW VISA SERVICES (9 more) ───
    {
      country: 'Japan', countryCode: 'JP', slug: makeSlug('Japan Visa'),
      processingTime: '5-7 Business Days', visaFeeMMK: 130000, visaFeeUSD: usd(130000), visaFee: 130000,
      requirements: ['Passport (6 months validity)', '2 Passport Photos (4.5 x 4.5 cm)', 'Application Form', 'Flight Booking (confirmed round-trip)', 'Hotel Reservation (confirmed)', 'Bank Statement (last 3 months)', 'Employment Letter', 'Tax Return (last year)'],
      additionalInfo: 'Japan visa requires detailed itinerary and proof of financial means. A9 Global assists with all documentation preparation.',
    },
    {
      country: 'South Korea', countryCode: 'KR', slug: makeSlug('South Korea Visa'),
      processingTime: '5-7 Business Days', visaFeeMMK: 115000, visaFeeUSD: usd(115000), visaFee: 115000,
      requirements: ['Passport (6 months validity)', '2 Passport Photos (3.5 x 4.5 cm)', 'Application Form', 'Flight Booking (confirmed round-trip)', 'Hotel Reservation (confirmed)', 'Bank Statement (last 3 months)', 'Employment Certificate'],
      additionalInfo: 'South Korea offers visa-free entry to Jeju Island for Myanmar passport holders. Express processing available.',
    },
    {
      country: 'United Arab Emirates', countryCode: 'AE', slug: makeSlug('UAE Visa'),
      processingTime: '3-5 Business Days', visaFeeMMK: 140000, visaFeeUSD: usd(140000), visaFee: 140000,
      requirements: ['Passport (6 months validity)', '2 Passport Photos (4.3 x 5.5 cm, white background)', 'Application Form', 'Flight Booking (confirmed round-trip)', 'Hotel Reservation (confirmed)', 'Bank Statement (last 3 months)'],
      additionalInfo: 'UAE offers 30-day and 90-day tourist visas. Express 24-hour processing available for additional fee.',
    },
    {
      country: 'Australia', countryCode: 'AU', slug: makeSlug('Australia Visa'),
      processingTime: '10-15 Business Days', visaFeeMMK: 280000, visaFeeUSD: usd(280000), visaFee: 280000,
      requirements: ['Passport (6 months validity)', '2 Passport Photos (3.5 x 4.5 cm)', 'Application Form', 'Flight Booking (confirmed round-trip)', 'Hotel Reservation (confirmed)', 'Bank Statement (last 6 months)', 'Employment Letter', 'Travel History'],
      additionalInfo: 'Australia requires biometrics submission at VFS center. Processing times may extend during holiday seasons.',
    },
    {
      country: 'United Kingdom', countryCode: 'GB', slug: makeSlug('UK Visa'),
      processingTime: '10-15 Business Days', visaFeeMMK: 320000, visaFeeUSD: usd(320000), visaFee: 320000,
      requirements: ['Passport (6 months validity, 2 blank pages)', '2 Passport Photos (3.5 x 4.5 cm)', 'Online Application Form', 'Flight Booking (confirmed round-trip)', 'Hotel Reservation (confirmed)', 'Bank Statement (last 6 months)', 'Employment Letter', 'Travel History'],
      additionalInfo: 'UK visa requires in-person biometrics at VFS center in Yangon. Priority service (5-7 days) available for additional fee.',
    },
    {
      country: 'Cambodia', countryCode: 'KH', slug: makeSlug('Cambodia Visa'),
      processingTime: '2-3 Business Days', visaFeeMMK: 65000, visaFeeUSD: usd(65000), visaFee: 65000,
      requirements: ['Passport (6 months validity)', '2 Passport Photos (4 x 6 cm)', 'Application Form', 'Flight Booking (confirmed round-trip)', 'Hotel Reservation (confirmed)'],
      additionalInfo: 'Cambodia offers e-visa and visa-on-arrival for Myanmar passport holders. E-visa processed within 3 business days.',
    },
    {
      country: 'Indonesia', countryCode: 'ID', slug: makeSlug('Indonesia Visa'),
      processingTime: '3-5 Business Days', visaFeeMMK: 80000, visaFeeUSD: usd(80000), visaFee: 80000,
      requirements: ['Passport (6 months validity)', '2 Passport Photos (4 x 6 cm)', 'Application Form', 'Flight Booking (confirmed round-trip)', 'Hotel Reservation (confirmed)', 'Bank Statement (last 3 months)'],
      additionalInfo: 'Indonesia offers visa-free entry for 30 days to Myanmar passport holders. Tourist visa extendable up to 60 days.',
    },
    {
      country: 'Taiwan', countryCode: 'TW', slug: makeSlug('Taiwan Visa'),
      processingTime: '5-7 Business Days', visaFeeMMK: 105000, visaFeeUSD: usd(105000), visaFee: 105000,
      requirements: ['Passport (6 months validity)', '2 Passport Photos (3.5 x 4.5 cm)', 'Application Form', 'Flight Booking (confirmed round-trip)', 'Hotel Reservation (confirmed)', 'Bank Statement (last 3 months)', 'Employment Certificate'],
      additionalInfo: 'Taiwan offers e-visa for eligible travelers. A9 Global handles all documentation.',
    },
    {
      country: 'Philippines', countryCode: 'PH', slug: makeSlug('Philippines Visa'),
      processingTime: '5-7 Business Days', visaFeeMMK: 90000, visaFeeUSD: usd(90000), visaFee: 90000,
      requirements: ['Passport (6 months validity)', '2 Passport Photos (3.5 x 4.5 cm)', 'Application Form', 'Flight Booking (confirmed round-trip)', 'Hotel Reservation (confirmed)', 'Bank Statement (last 3 months)'],
      additionalInfo: 'Philippines offers visa-free entry for ASEAN nationals for up to 30 days. Beautiful beaches await!',
    },
  ]);
  console.log(`  ✅ ${visas.length} visa services created.`);

  // ─── 6. INSURANCE PLANS ───
  console.log('\n🛡️  Creating insurance plans...');

  const insurances = await TravelInsurance.insertMany([
    {
      planName: 'Basic Travel Shield', slug: makeSlug('Basic Travel Shield'),
      coverageAmountMMK: 5000000, coverageAmountUSD: usd(5000000), coverageAmount: 5000000, premiumMMK: 15000, premiumUSD: usd(15000), premiumPrice: 15000, duration: 'Per Trip',
      description: 'Affordable essential coverage for short trips and domestic travel. Perfect for budget-conscious travelers who want basic protection.',
      benefits: ['Medical Expenses (up to MMK 5,000,000)', 'Emergency Medical Evacuation', 'Personal Accident Cover', '24/7 Emergency Assistance'],
      exclusions: ['Pre-existing medical conditions', 'High-risk adventure sports', 'Travel to restricted areas'],
    },
    {
      planName: 'Silver Travel Guard', slug: makeSlug('Silver Travel Guard'),
      coverageAmountMMK: 15000000, coverageAmountUSD: usd(15000000), coverageAmount: 15000000, premiumMMK: 35000, premiumUSD: usd(35000), premiumPrice: 35000, duration: 'Per Trip',
      description: 'Comprehensive protection for international travelers. Suitable for families and holiday-makers who want peace of mind.',
      benefits: ['Medical Expenses (up to MMK 15,000,000)', 'Trip Cancellation & Interruption', 'Baggage Loss & Delay', 'Personal Accident Cover', 'Emergency Medical Evacuation', '24/7 Emergency Assistance'],
      exclusions: ['Pre-existing medical conditions', 'Extreme sports (skydiving, bungee jumping)', 'Travel against government advice'],
    },
    {
      planName: 'Gold Travel Elite', slug: makeSlug('Gold Travel Elite'),
      coverageAmountMMK: 50000000, coverageAmountUSD: usd(50000000), coverageAmount: 50000000, premiumMMK: 75000, premiumUSD: usd(75000), premiumPrice: 75000, duration: 'Per Trip',
      description: 'Premium coverage for discerning travelers. Ideal for business trips, luxury holidays, and long-haul destinations.',
      benefits: ['Medical Expenses (up to MMK 50,000,000)', 'Trip Cancellation & Interruption', 'Baggage Loss, Theft & Delay', 'Personal Accident Cover', 'Emergency Medical Evacuation & Repatriation', 'Flight Delay Compensation', 'Personal Liability Cover', '24/7 Concierge Service'],
      exclusions: ['Pre-existing medical conditions', 'War zones & civil unrest'],
    },
    {
      planName: 'Platinum Global Cover', slug: makeSlug('Platinum Global Cover'),
      coverageAmountMMK: 100000000, coverageAmountUSD: usd(100000000), coverageAmount: 100000000, premiumMMK: 150000, premiumUSD: usd(150000), premiumPrice: 150000, duration: 'Annual Multi-Trip',
      description: 'Our most comprehensive annual plan for frequent travelers. One plan covers all your trips throughout the year. Ultimate peace of mind.',
      benefits: ['Medical Expenses (up to MMK 100,000,000)', 'Unlimited Trip Cancellation', 'Baggage Loss & Delay', 'Personal Accident Cover', 'Emergency Evacuation', 'Flight Delay & Missed Connection', 'Personal Liability', 'Rental Vehicle Excess', 'Winter Sports Cover', '24/7 VIP Concierge'],
      exclusions: ['Pre-existing medical conditions not declared'],
    },
  ]);
  console.log(`  ✅ ${insurances.length} insurance plans created.`);

  // ─── 7. SAMPLE BOOKINGS ───
  console.log('\n📋 Creating sample bookings...');

  const bookings = await Booking.insertMany([
    {
      user: customer._id,
      itemType: 'TourPackage',
      item: tours[0]._id,
      itemModel: 'TourPackage',
      quantity: 1,
      travelers: 2,
      totalPrice: 1850000,
      totalAmount: 1850000,
      paymentMethod: 'kbzpay',
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      bookingDate: new Date('2026-06-15').toISOString(),
    },
    {
      user: customer._id,
      itemType: 'Hotel',
      item: hotels[0]._id,
      itemModel: 'Hotel',
      quantity: 3,
      travelers: 2,
      totalPrice: 540000,
      totalAmount: 540000,
      paymentMethod: 'wavemoney',
      paymentStatus: 'pending',
      bookingStatus: 'confirmed',
      bookingDate: new Date('2026-07-01').toISOString(),
    },
  ]);
  console.log(`  ✅ ${bookings.length} sample bookings created.`);

  // ─── SUMMARY ───
  console.log('\n═════════════════════════════════════════');
  console.log('  🌏 A9 Global Database Seed Complete!');
  console.log('═════════════════════════════════════════');
  console.log(`  👤 Users:        2 (Admin + Customer)`);
  console.log(`  🌏 Tours:        ${tours.length}`);
  console.log(`  🏨 Hotels:       ${hotels.length}`);
  console.log(`  🚗 Cars:         ${cars.length}`);
  console.log(`  🛂 Visas:        ${visas.length}`);
  console.log(`  🛡️  Insurance:    ${insurances.length}`);
  console.log(`  📋 Bookings:     ${bookings.length}`);
  console.log('═════════════════════════════════════════\n');

  console.log('✅ Seeding complete!');
}

seed().then(() => {
  console.log('[Seed] Done');
  process.exit(0);
}).catch(e => {
  console.error('[Seed] Error:', e);
  process.exit(1);
});

module.exports = seed;
