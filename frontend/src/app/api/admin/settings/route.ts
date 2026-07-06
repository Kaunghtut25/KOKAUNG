import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/adminStore";

const SETTINGS_KEY = "site_settings";

interface SiteSettings {
  logo: string;
  siteTitle: string;
  tagline: string;
  footerText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  heroImages: {
    home: string;
    tours: string;
    hotels: string;
    cars: string;
    visas: string;
    insurance: string;
  };
}

const defaultSettings: SiteSettings = {
  logo: "",
  siteTitle: "A9 Global Travel",
  tagline: "Your Journey, Our Passion",
  footerText: "© 2026 A9 Global Travel. All rights reserved.",
  contactEmail: "info@a9global.com",
  contactPhone: "+95 9 123 456 789",
  contactAddress: "No. 123, Bogyoke Aung San Road, Yangon, Myanmar",
  socialLinks: {
    facebook: "https://facebook.com/a9global",
    instagram: "https://instagram.com/a9global",
    twitter: "https://twitter.com/a9global",
    youtube: "https://youtube.com/@a9global",
  },
  heroImages: {
    home: "",
    tours: "",
    hotels: "",
    cars: "",
    visas: "",
    insurance: "",
  },
};

export async function GET() {
  try {
    const settingsCol = getCollection("settings");
    const settings = settingsCol.get(SETTINGS_KEY) as SiteSettings | undefined;
    return NextResponse.json(settings || defaultSettings);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const settingsCol = getCollection("settings");
    const existing = settingsCol.get(SETTINGS_KEY) as SiteSettings | undefined;
    const updated: SiteSettings = {
      ...(existing || defaultSettings),
      ...body,
      socialLinks: {
        ...(existing?.socialLinks || defaultSettings.socialLinks),
        ...(body.socialLinks || {}),
      },
      heroImages: {
        ...(existing?.heroImages || defaultSettings.heroImages),
        ...(body.heroImages || {}),
      },
    };
    settingsCol.set(SETTINGS_KEY, updated);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
