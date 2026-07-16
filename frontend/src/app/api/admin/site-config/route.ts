export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getAll, create } from "@/lib/persistentStore";

export async function GET() {
  try {
    const cfg = await getAll("site-config" as any);
    return NextResponse.json(cfg?.[0] || defaultConfig);
  } catch {
    return NextResponse.json(defaultConfig);
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
  siteName: "A9 Global Travels & Tours",
  logoUrl: "/logo.jpeg",
  metaTitle: "A9 Global Travels & Tours | Luxury Travel Myanmar",
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
    { icon: "⭐", title: "IATA Accredited", description: "Internationally certified travel agency since 2015", imgSrc: "" },
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
    phone: "09 694 320 111",
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

  // Company info in footer
  footerCompanyInfo: "Your premier IATA-accredited luxury travel partner in Myanmar. Since our founding, we have been dedicated to crafting extraordinary travel experiences.",
  footerTagline: "Where every journey is a story waiting to be told!",
  footerRegNumbers: "Company Reg: 126395248 | IATA: 05301026 | T/I(YGN)-2889 | T/O(YGN)-0946",
};
