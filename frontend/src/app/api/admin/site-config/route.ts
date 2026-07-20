export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getAll, create } from "@/lib/persistentStore";

export async function GET() {
  try {
    const cfg = await getAll("site-config" as any);
    // Merge: stored config overrides defaults, but we pick up any code-level changes
    // Stored data overrides defaults, but branding fields always use code defaults
    const stored = cfg?.[0] || {};
    const merged = { ...defaultConfig, ...stored, siteName: defaultConfig.siteName, footerCopyright: defaultConfig.footerCopyright, metaTitle: defaultConfig.metaTitle, contact: { ...defaultConfig.contact, ...(stored.contact || {}), phone: defaultConfig.contact.phone, email: defaultConfig.contact.email } };
    return NextResponse.json(merged);
  } catch {
    return NextResponse.json(defaultConfig);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const store = await import("@/lib/persistentStore");
    const items = await store.getAll("site-config" as any);
    const record = { ...body, id: "site-config", updatedAt: new Date().toISOString() };
    for (const item of items) {
      try { await store.delete_("site-config" as any, item.id || item._id); } catch {}
    }
    await store.create("site-config" as any, record);
    return NextResponse.json({ success: true, message: "Site configuration saved successfully!" });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON" }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Replace single site-config record
    const store = await import("@/lib/persistentStore");
    const items = await store.getAll("site-config" as any);
    // Remove old entries, insert the new one
    const record = { ...body, id: "site-config", updatedAt: new Date().toISOString() };
    for (const item of items) {
      try { await store.delete_("site-config" as any, item.id || item._id); } catch {}
    }
    await store.create("site-config" as any, record);
    return NextResponse.json({ success: true, message: "Site configuration saved successfully!" });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON" }, { status: 400 });
  }
}

// ── Full default site config ────────────────────────────────
const defaultConfig = {
  id: "site-config",
  siteName: "𝐀𝟗 𝐆𝐥𝐨𝐛𝐚𝐥 𝐓𝐫𝐚𝐯𝐞𝐥𝐬 & 𝐓𝐨𝐮𝐫𝐬",
  logoUrl: "/logo.jpeg",
  metaTitle: "𝐀𝟗 𝐆𝐥𝐨𝐛𝐚𝐥 𝐓𝐫𝐚𝐯𝐞𝐥𝐬 & 𝐓𝐨𝐮𝐫𝐬 | Luxury Travel Myanmar",
  metaDescription: "Premium travel experiences in Myanmar.",
  footerCopyright: "© 2026 𝐀𝟗 𝐆𝐥𝐨𝐛𝐚𝐥 Travels & Tours. All rights reserved.",

  // Hero Section
  heroSlides: [
    { image: "/images_v2/hero-bagan-v2.jpg", label: "Golden Land", title: "Myanmar — Bagan Temples", subtitle: "Over 2,000 ancient pagodas across a mystical plain" },
    { image: "/images_v2/hero-singapore-v2.jpg", label: "Lion City", title: "Singapore — Marina Bay", subtitle: "Futuristic skyline meets lush garden city living" },
    { image: "/images_v2/hero-thailand-v2.jpg", label: "Land of Smiles", title: "Thailand — Grand Palace", subtitle: "Golden spires and ornate temples in Bangkok" },
  ],
  heroHeightMobile: 340,
  heroHeightDesktop: 460,

  // Hero Images (per-page hero banners)
  heroImages: {
    about: "/images_v2/about-hero-v2.jpg",
    mingalar: "/images_v2/sky1-v3.jpg",
    blog: "/images_v2/hero-blog-v2.jpg",
    contact: "/images_v2/hero-book-now-v2.jpg",
    faq: "/images_v2/hero-bagan-v2.jpg",
    terms: "/images_v2/hero-bagan-v2.jpg",
    privacy: "/images_v2/hero-bagan-v2.jpg",
    bookNow: "/images_v2/hero-book-now-v2.jpg",
    flights: "/images_v2/hero-book-now-v2.jpg",
    cruises: "/images_v2/cruise1-v2.jpg",
    cars: "/images_v2/hero-cars-v2.jpg",
    hotels: "/images_v2/hero-hotels-v2.jpg",
    tours: "/images_v2/hero-tours-v2.jpg",
    insurance: "/images_v2/ins1-v3.jpg",
    visas: "/images_v2/visa1-v3.jpg",
  },

  // Service Icons Bar
  serviceIcons: [
    { label: "Flights", icon: "✈️", href: "/", enabled: true },
    { label: "Tours", icon: "🏔️", href: "/tours", enabled: true },
    { label: "Hotels", icon: "🏨", href: "/hotels", enabled: true },
    { label: "Cars", icon: "🚗", href: "/cars", enabled: true },
    { label: "Visas", icon: "🛂", href: "/visas", enabled: true },
    { label: "Insurance", icon: "🛡️", href: "/insurance", enabled: true },
    { label: "Cruises", icon: "🚢", href: "/cruises", enabled: true },
    { label: "Sky Lounge", icon: "✨", href: "/mingalar", enabled: true },
  ],

  // Nav Links
  navLinks: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
  ],

  // Stats Cards (Why Us section)
  statsCards: [
    { icon: "⭐", title: "IATA Accredited", description: "Internationally certified travel agency since 2015", imgSrc: "/images_v2/hero-home-v2.jpg" },
    { icon: "👥", title: "5,000+ Happy Travelers", description: "Trusted by thousands of satisfied customers worldwide", imgSrc: "" },
    { icon: "🗺️", title: "50+ Destinations", description: "From Myanmar to Southeast Asia and beyond", imgSrc: "" },
    { icon: "🕐", title: "24/7 Support", description: "Round-the-clock assistance wherever you are", imgSrc: "" },
  ],

  // Why Choose Us cards
  whyChooseCards: [
    { icon: "🤝", title: "Trusted Partner", description: "IATA accredited with decade-long industry expertise." },
    { icon: "🎯", title: "Tailored Itineraries", description: "Every trip custom-designed to match your unique preferences." },
    { icon: "💰", title: "Best Price Guarantee", description: "Competitive pricing without compromising on quality and service." },
    { icon: "🛡️", title: "Secure Payments", description: "Bank-grade encryption protecting all your transactions." },
  ],

  // Popular Destinations
  popularDestinations: [
    { city: "Bagan", country: "Myanmar", image: "/images_v2/dest-bagan-v2.jpg", minPrice: "Ks 200,000" },
    { city: "Bangkok", country: "Thailand", image: "/images_v2/dest-bangkok-v2.jpg", minPrice: "Ks 150,000" },
    { city: "Singapore", country: "Singapore", image: "/images_v2/dest-singapore-v2.jpg", minPrice: "Ks 250,000" },
    { city: "Kuala Lumpur", country: "Malaysia", image: "/images_v2/dest-kl-v2.jpg", minPrice: "Ks 180,000" },
  ],

  // CTA Section
  ctaTitle: "Ready to Start Your Journey?",
  ctaDescription: "Let us help you plan the trip of a lifetime. Our team is ready to create a custom itinerary just for you.",
  ctaButtonLabel: "Book Now",
  ctaButtonHref: "/book-now",

  // Contact Info
  contact: {
    email: "a9ticketing@a9globaltravel.com.mm",
    phone: "959 694 320 111",
    address: "No-18, Ground Floor, Zayya Waddy Street, Baho Road, Sanchaung Tsp, Yangon, Myanmar",
    whatsapp: "+959694320111",
    messenger: "https://m.me/a9globaltravel",
    viber: "+959694320111",
    telegram: "https://t.me/a9globaltravel",
  },

  // Social Links
  socialLinks: [
    { platform: "facebook", url: "https://facebook.com/a9global" },
    { platform: "instagram", url: "https://instagram.com/a9global" },
    { platform: "telegram", url: "https://t.me/a9globaltravel" },
  ],

  // Testimonials
  testimonials: [
    { name: "John Smith", country: "Australia", tour: "Bagan Explorer", text: "Amazing experience! The hot air balloon ride was breathtaking. Professional team from start to finish.", rating: 5 },
    { name: "Sarah Chen", country: "Singapore", tour: "Inle Lake Discovery", text: "Beautiful lake, friendly people. A9 made everything seamless. Highly recommend!", rating: 5 },
    { name: "Marcus Weber", country: "Germany", tour: "Yangon City Tour", text: "Rich culture and history. Our guide was knowledgeable and spoke excellent English.", rating: 5 },
    { name: "Yuki Tanaka", country: "Japan", tour: "Ngapali Beach Escape", text: "Perfect beach vacation. The resort was stunning and transfers were on time.", rating: 5 },
  ],

  // Partners
  partners: [
    "Shangri-La", "Sedona Hotel", "Sule Palace", "Melia Hotel",
    "Myanmar Airways", "Thai Airways", "Singapore Airlines", "Emirates",
  ],
  // Footer Sections
  footerSections: [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "Tours", href: "/tours" },
        { label: "Hotels", href: "/hotels" },
        { label: "Car Rentals", href: "/cars" },
        { label: "Visa Services", href: "/visas" },
        { label: "Travel Insurance", href: "/insurance" },
      ],
    },
  ],

  sectionLayouts: {
    hotels: { desktop: 4, tablet: 2, mobile: 1 },
    tours: { desktop: 3, tablet: 2, mobile: 1 },
    cars: { desktop: 3, tablet: 2, mobile: 1 },
    cruises: { desktop: 3, tablet: 2, mobile: 1 },
    visas: { desktop: 4, tablet: 3, mobile: 2 },
    insurance: { desktop: 3, tablet: 2, mobile: 1 },
    skyLounge: { desktop: 3, tablet: 2, mobile: 1 },
  },

  sectionRows: {
    hotels: ["Featured Hotels", "Budget Friendly", "Popular Hotels", "Row 4", "Row 5"],
    tours: ["Featured Tours", "Popular Destinations", "Adventure", "Row 4", "Row 5"],
    cars: ["Popular Cars", "SUVs & Family", "Luxury & Sedans", "Row 4", "Row 5"],
  },

  // Company info in footer
  footerCompanyInfo: "Your premier IATA-accredited luxury travel partner in Myanmar. Since our founding, we have been dedicated to crafting extraordinary travel experiences.",
  footerTagline: "Where every journey is a story waiting to be told!",
  footerRegNumbers: "Company Reg: 126395248 | IATA: 05301026 | T/I(YGN)-2889 | T/O(YGN)-0946",

  faqs: [
    { id: "1", q: "How do I book a tour?", a: "Simply browse our Tours page, select your preferred tour, click 'Book Now', fill in your details and submit. Our team will contact you within 24 hours to confirm your booking." },
    { id: "2", q: "What documents do I need for a visa application?", a: "Required documents vary by country. Typically you need: a valid passport (6+ months), passport-size photos, flight itinerary, hotel booking confirmation, and proof of funds. Check each visa's detail page for specific requirements." },
    { id: "3", q: "Can I cancel or modify my booking?", a: "Yes, bookings can be modified or cancelled. Cancellation fees may apply depending on how close to the departure date. Contact us at info@a9globaltravel.com for assistance." },
    { id: "4", q: "What payment methods do you accept?", a: "We accept bank transfers, cash payments at our office, and major credit cards. Online payment integration is coming soon." },
    { id: "5", q: "Do you offer travel insurance?", a: "Yes! We offer 9 different insurance plans ranging from basic travel shields to comprehensive annual coverage. Visit our Insurance page to find the right plan for you." },
    { id: "6", q: "How long does visa processing take?", a: "Processing times vary by country. Most visas take 3-5 business days, but some may take up to 2 weeks. Check each visa's detail page for estimated processing time." },
    { id: "7", q: "Do you provide airport transfers?", a: "Yes, we offer airport transfer services with our fleet of vehicles. Book through our Cars section or add it to your tour package." },
    { id: "8", q: "What is included in the Sky Lounge access?", a: "Sky Lounge access includes premium buffet dining, complimentary drinks, WiFi, work stations, shower facilities, and flight information displays." },
    { id: "9", q: "Are cruise prices per person or per cabin?", a: "Cruise prices are typically per person based on double occupancy. Single supplements may apply. Contact us for detailed pricing." },
    { id: "10", q: "Can I customize a tour package?", a: "Absolutely! We specialize in custom itineraries. Contact us with your preferences and our travel experts will create a personalized package for you." },
  ],
  terms: [
    { id: "t1", title: "1. Bookings and Reservations", content: "All bookings are subject to availability and confirmation by A9 Global Travel and Tours. A booking is only confirmed once full payment or deposit is received." },
    { id: "t2", title: "2. Cancellation Policy", content: "Cancellations made 7+ days before departure: full refund minus processing fee. Cancellations within 7 days: 50% refund. No-show: no refund." },
    { id: "t3", title: "3. Travel Documents", content: "Passengers are responsible for ensuring they have valid passports, visas, and other required travel documents. A9 Global Travel is not liable for denied boarding due to incomplete documents." },
    { id: "t4", title: "4. Pricing", content: "All prices are in Myanmar Kyat (MMK) or US Dollars (USD). Prices are subject to change without notice due to currency fluctuations, fuel surcharges, or other factors beyond our control." },
    { id: "t5", title: "5. Privacy", content: "We respect your privacy. Personal information collected during bookings is used solely for processing your reservation and will not be shared with third parties without your consent." },
    { id: "t6", title: "6. Liability", content: "A9 Global Travel and Tours acts as an agent for various service providers. We are not liable for accidents, injuries, delays, or losses caused by third-party providers." },
  ],
  privacy: [
    { id: "p1", title: "Information We Collect", content: "We collect personal information including name, email, phone number, and travel preferences when you make a booking or contact us." },
    { id: "p2", title: "How We Use Your Information", content: "Your information is used to process bookings, provide customer support, send travel updates, and improve our services. We do not sell or rent your personal data." },
    { id: "p3", title: "Data Security", content: "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure." },
    { id: "p4", title: "Contact Us", content: "For privacy concerns, contact us at info@a9globaltravel.com or +95 9 123 456 789." },
  ],
};
