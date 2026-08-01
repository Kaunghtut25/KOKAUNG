export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";

// Settings page ⇄ site-config adapter.
// The public site reads ONLY the "site-config" record, so Admin → Settings
// must read/write that same record for edits to appear publicly.

const heroKeyMap: Record<string, string> = {
  home: "home", tours: "tours", hotels: "hotels", cars: "cars",
  visas: "visas", insurance: "insurance", flights: "flights", cruises: "cruises",
};

export async function GET() {
  try {
    const store = await import("@/lib/persistentStore");
    const cfg = (await store.getAll("site-config" as any))?.[0] || {};
    const c = cfg.contact || {};
    return NextResponse.json({
      logo: cfg.logoUrl || "",
      siteTitle: cfg.siteName || "A9 Global Travel",
      tagline: cfg.tagline || "",
      footerText: cfg.footerCopyright || "",
      contactEmail: c.email || "",
      contactPhone: c.phone || "",
      contactAddress: c.address || "",
      socialLinks: cfg.socialLinks || { facebook: "", instagram: "", twitter: "", youtube: "" },
      heroImages: cfg.heroImages || {},
      certifications: cfg.certifications || [],
    });
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const store = await import("@/lib/persistentStore");
    const items = await store.getAll("site-config" as any);
    const cfg = { ...(items?.[0] || {}) };
    // Map settings-shape → site-config-shape (preserve all existing config)
    const heroImages = { ...(cfg.heroImages || {}) };
    for (const [k, v] of Object.entries(body.heroImages || {})) {
      const target = heroKeyMap[k] || k;
      if (v) heroImages[target] = v;
    }
    const record = {
      ...cfg,
      id: "site-config",
      logoUrl: body.logo || cfg.logoUrl,
      siteName: body.siteTitle || cfg.siteName,
      tagline: body.tagline || cfg.tagline,
      footerCopyright: body.footerText || cfg.footerCopyright,
      socialLinks: { ...(cfg.socialLinks || {}), ...(body.socialLinks || {}) },
      heroImages,
      certifications: body.certifications != null ? body.certifications : cfg.certifications,
      contact: {
        ...(cfg.contact || {}),
        email: body.contactEmail || cfg.contact?.email,
        phone: body.contactPhone || cfg.contact?.phone,
        address: body.contactAddress || cfg.contact?.address,
      },
      updatedAt: new Date().toISOString(),
    };
    for (const item of items) {
      try { await store.delete_("site-config" as any, item.id || item._id); } catch {}
    }
    await store.create("site-config" as any, record);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
