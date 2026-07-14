"use client";

import React, { useEffect, useState, useCallback } from "react";

/* ──────────────────────────────────────────────
   A9 Global — Site Manager (Section-by-Section)
   Admin controls every page & section from one panel
────────────────────────────────────────────── */

// ── Types ──
interface HeroSlide { image: string; label: string; title: string; subtitle: string; }
interface ServiceIcon { label: string; icon: string; href: string; enabled: boolean; }
interface NavLink { label: string; href: string; }
interface StatsCard { icon: string; title: string; description: string; }
interface WhyCard { icon: string; title: string; description: string; }
interface PopularDestination { city: string; country: string; image: string; price: string; }
interface ContactInfo { email: string; phone: string; address: string; mapEmbed: string; }
interface SocialLink { platform: string; url: string; }
interface FooterSection { title: string; links: { label: string; href: string }[]; }

interface SiteConfig {
  // Hero
  heroSlides: HeroSlide[];
  heroHeight: { mobile: number; desktop: number };
  // Service icons
  serviceIcons: ServiceIcon[];
  // Navbar
  navLinks: NavLink[];
  siteName: string;
  logoUrl: string;
  // Homepage sections
  statsCards: StatsCard[];
  whyChooseCards: WhyCard[];
  popularDestinations: PopularDestination[];
  // Contact
  contact: ContactInfo;
  socialLinks: SocialLink[];
  // Footer
  footerCopyright: string;
  footerSections: FooterSection[];
  // SEO & Meta
  metaTitle: string;
  metaDescription: string;
}

const API = "/api/admin/site-config";

const d: SiteConfig = {
  heroSlides: [
    { image: "", label: "Golden Land", title: "Bagan Temples", subtitle: "Over 2,000 ancient pagodas" },
    { image: "", label: "Lion City", title: "Singapore Marina Bay", subtitle: "Futuristic skyline" },
  ],
  heroHeight: { mobile: 450, desktop: 500 },
  serviceIcons: [
    { label: "Flights", icon: "✈️", href: "/", enabled: true },
    { label: "Tours", icon: "🏔️", href: "/tours", enabled: true },
    { label: "Hotels", icon: "🏨", href: "/hotels", enabled: true },
    { label: "Cars", icon: "🚗", href: "/cars", enabled: true },
    { label: "Visas", icon: "🛂", href: "/visas", enabled: true },
    { label: "Insurance", icon: "🛡️", href: "/insurance", enabled: true },
    { label: "Cruises", icon: "🚢", href: "/cruises", enabled: true },
    { label: "Sky Lounge", icon: "✨", href: "/mingalar", enabled: true },
    { label: "Blog", icon: "📝", href: "/blog", enabled: true },
  ],
  navLinks: [
    { label: "Flights", href: "/" },
    { label: "Tours", href: "/tours" },
    { label: "Hotels", href: "/hotels" },
    { label: "Cars", href: "/cars" },
    { label: "Visas", href: "/visas" },
    { label: "Insurance", href: "/insurance" },
    { label: "Cruises", href: "/cruises" },
    { label: "Blog", href: "/blog" },
    { label: "Sky Lounge", href: "/mingalar" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  siteName: "A9 Global Travel",
  logoUrl: "",
  statsCards: [
    { icon: "🌍", title: "50+ Destinations", description: "Across Asia and beyond" },
    { icon: "✈️", title: "10K+ Flights", description: "Booked annually" },
    { icon: "🏨", title: "500+ Hotels", description: "From budget to luxury" },
    { icon: "😊", title: "15K+ Happy Clients", description: "And counting" },
  ],
  whyChooseCards: [
    { icon: "💰", title: "Best Price Guarantee", description: "We match or beat any competitor's price" },
    { icon: "🛡️", title: "Secure Booking", description: "Your data and payments are always protected" },
    { icon: "📞", title: "24/7 Support", description: "Myanmar-based team ready to help anytime" },
    { icon: "⭐", title: "Trusted by Thousands", description: "Rated 4.8/5 by over 15,000 travelers" },
  ],
  popularDestinations: [
    { city: "Bangkok", country: "Thailand", image: "", price: "From $89" },
    { city: "Singapore", country: "Singapore", image: "", price: "From $120" },
    { city: "Kuala Lumpur", country: "Malaysia", image: "", price: "From $75" },
    { city: "Bali", country: "Indonesia", image: "", price: "From $150" },
    { city: "Hanoi", country: "Vietnam", image: "", price: "From $65" },
    { city: "Siem Reap", country: "Cambodia", image: "", price: "From $55" },
  ],
  contact: {
    email: "info@a9global.com",
    phone: "+95 9 123 456 789",
    address: "No. 123, Bogyoke Aung San Road, Yangon, Myanmar",
    mapEmbed: "",
  },
  socialLinks: [
    { platform: "Facebook", url: "https://facebook.com/a9global" },
    { platform: "Instagram", url: "https://instagram.com/a9global" },
    { platform: "Twitter", url: "https://twitter.com/a9global" },
    { platform: "YouTube", url: "https://youtube.com/@a9global" },
  ],
  footerCopyright: "© 2026 A9 Global Travel. All rights reserved.",
  footerSections: [
    { title: "Services", links: [{ label: "Flights", href: "/" }, { label: "Tours", href: "/tours" }, { label: "Hotels", href: "/hotels" }, { label: "Cars", href: "/cars" }] },
    { title: "Support", links: [{ label: "Contact", href: "/contact" }, { label: "About", href: "/about" }, { label: "FAQ", href: "/faq" }] },
    { title: "Legal", links: [{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms", href: "/terms" }] },
  ],
  metaTitle: "A9 Global Travel — Your Asian Journey Starts Here",
  metaDescription: "Book flights, tours, hotels, cars, visas, insurance & cruises across Asia. Best prices from Myanmar.",
};

// ── Section accordion component ──
function Section({ title, emoji, children, className }: { title: string; emoji: string; children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={"bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden " + (className || "")}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
        <h3 className="text-lg font-bold text-[#0A1628] flex items-center gap-2"><span className="text-xl">{emoji}</span>{title}</h3>
        <span className={"text-gray-400 transition-transform " + (open ? "rotate-180" : "")}>▼</span>
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-100 pt-4">{children}</div>}
    </div>
  );
}

// ── Inline field ──
function Field({ label, value, onChange, type, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all" />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type || "text"}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-all" />
      )}
    </div>
  );
}

// ── Editable array item ──
function ArrayEditor<T extends Record<string, any>>({ items, onChange, fields, label }: {
  items: T[]; onChange: (items: T[]) => void; fields: { key: string; label: string; placeholder?: string; type?: string }[];
  label: string;
}) {
  const add = () => {
    const empty: any = {};
    fields.forEach(f => { empty[f.key] = ""; });
    onChange([...items, empty as T]);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, key: string, val: string) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [key]: val };
    onChange(copy);
  };
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <button onClick={add} className="text-xs text-[#D4AF37] hover:underline cursor-pointer">+ Add</button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="bg-gray-50 rounded-lg p-3 mb-2 relative">
          <button onClick={() => remove(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs cursor-pointer">✕</button>
          <div className="grid grid-cols-2 gap-2">
            {fields.map(f => (
              <div key={f.key}>
                <label className="block text-[10px] text-gray-500 mb-0.5">{f.label}</label>
                <input value={item[f.key] || ""} onChange={e => update(i, f.key, e.target.value)} placeholder={f.placeholder}
                  className="w-full border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-[#D4AF37]" type={f.type || "text"} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SiteManagerPage() {
  const [config, setConfig] = useState<SiteConfig>(d);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("homepage");

  useEffect(() => {
    fetch(API).then(r => r.json()).then(data => {
      if (data?.heroSlides) setConfig({ ...d, ...data });
    }).catch(() => {});
  }, []);

  const save = async () => {
    await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) });
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { id: "homepage", label: "🏠 Homepage", emoji: "🏠" },
    { id: "navbar", label: "🧭 Navbar", emoji: "🧭" },
    { id: "hero", label: "🖼️ Hero", emoji: "🖼️" },
    { id: "pages", label: "📄 Pages", emoji: "📄" },
    { id: "contact", label: "📞 Contact", emoji: "📞" },
    { id: "footer", label: "📌 Footer", emoji: "📌" },
    { id: "seo", label: "🔍 SEO", emoji: "🔍" },
    { id: "raw", label: "📋 Raw JSON", emoji: "📋" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0A1628]">⚙️ Site Manager</h2>
        <div className="flex gap-2">
          <button onClick={save} className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-white font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-all cursor-pointer">
            {saved ? "✅ Saved!" : "💾 Save All"}
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={"px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer " + (activeTab === t.id ? "bg-white shadow text-[#D4AF37]" : "text-gray-600 hover:text-gray-900")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Homepage Tab ── */}
      {activeTab === "homepage" && (
        <div className="space-y-4">
          <Section title="Stats Cards" emoji="📊">
            <ArrayEditor items={config.statsCards} onChange={v => setConfig({ ...config, statsCards: v })}
              fields={[{ key: "icon", label: "Emoji" }, { key: "title", label: "Title" }, { key: "description", label: "Description" }]}
              label="Stats cards (4 items shown on homepage)" />
          </Section>
          <Section title="Why Choose Us Cards" emoji="⭐">
            <ArrayEditor items={config.whyChooseCards} onChange={v => setConfig({ ...config, whyChooseCards: v })}
              fields={[{ key: "icon", label: "Emoji" }, { key: "title", label: "Title" }, { key: "description", label: "Description" }]}
              label="Why Choose Us (4 cards)" />
          </Section>
          <Section title="Popular Destinations" emoji="🌏">
            <ArrayEditor items={config.popularDestinations} onChange={v => setConfig({ ...config, popularDestinations: v })}
              fields={[{ key: "city", label: "City" }, { key: "country", label: "Country" }, { key: "image", label: "Image URL" }, { key: "price", label: "Price text" }]}
              label="Popular Destinations cards" />
          </Section>
          <Section title="Service Icons Bar" emoji="🎯">
            <ArrayEditor items={config.serviceIcons.filter(s => s.enabled)} onChange={v => {
              const updated = config.serviceIcons.map(s => v.find(x => x.label === s.label) || s);
              setConfig({ ...config, serviceIcons: updated });
            }}
              fields={[{ key: "label", label: "Label" }, { key: "icon", label: "Emoji" }, { key: "href", label: "Link" }]}
              label="Service navigation icons (visible on homepage hero)" />
          </Section>
        </div>
      )}

      {/* ── Navbar Tab ── */}
      {activeTab === "navbar" && (
        <div className="space-y-4">
          <Field label="Site Name" value={config.siteName} onChange={v => setConfig({ ...config, siteName: v })} />
          <Field label="Logo URL" value={config.logoUrl} onChange={v => setConfig({ ...config, logoUrl: v })} placeholder="/images/logo.png" />
          <Section title="Navigation Links" emoji="🧭">
            <ArrayEditor items={config.navLinks} onChange={v => setConfig({ ...config, navLinks: v })}
              fields={[{ key: "label", label: "Label" }, { key: "href", label: "Path" }]} label="Navbar links" />
          </Section>
        </div>
      )}

      {/* ── Hero Tab ── */}
      {activeTab === "hero" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <label className="text-sm font-bold text-[#0A1628] mb-1 block">Hero Min-Height</label>
              <div className="flex gap-2">
                <div><span className="text-xs text-gray-500">Mobile</span>
                  <input type="number" value={config.heroHeight.mobile} onChange={e => setConfig({ ...config, heroHeight: { ...config.heroHeight, mobile: +e.target.value } })}
                    className="w-24 border rounded px-2 py-1 text-sm" /></div>
                <div><span className="text-xs text-gray-500">Desktop</span>
                  <input type="number" value={config.heroHeight.desktop} onChange={e => setConfig({ ...config, heroHeight: { ...config.heroHeight, desktop: +e.target.value } })}
                    className="w-24 border rounded px-2 py-1 text-sm" /></div>
              </div>
            </div>
          </div>
          <Section title="Hero Slides" emoji="🖼️">
            <ArrayEditor items={config.heroSlides} onChange={v => setConfig({ ...config, heroSlides: v })}
              fields={[
                { key: "image", label: "Image URL" },
                { key: "label", label: "Badge" },
                { key: "title", label: "Title" },
                { key: "subtitle", label: "Subtitle" },
              ]} label="Hero slider images (shown on homepage)" />
          </Section>
        </div>
      )}

      {/* ── Pages Tab ── */}
      {activeTab === "pages" && (
        <div className="space-y-4">
          <Section title="Tours Page" emoji="🏔️">
            <Field label="Hero Image URL" value="" onChange={() => {}} placeholder="/images_v2/hero-tours-v2.jpg" />
            <Field label="Page Title" value="" onChange={() => {}} placeholder="Explore Our Tours" />
            <Field label="Page Subtitle" value="" onChange={() => {}} placeholder="Discover amazing destinations across Asia" />
          </Section>
          <Section title="Hotels Page" emoji="🏨">
            <Field label="Hero Image URL" value="" onChange={() => {}} placeholder="/images_v2/hero-hotels-v2.jpg" />
          </Section>
          <Section title="Cars Page" emoji="🚗">
            <Field label="Hero Image URL" value="" onChange={() => {}} placeholder="/images_v2/hero-cars-v2.jpg" />
          </Section>
          <Section title="Cruises Page" emoji="🚢">
            <Field label="Hero Image URL" value="" onChange={() => {}} placeholder="/images_v2/hero-cruises-v2.jpg" />
          </Section>
          <Section title="Blog Page" emoji="📝">
            <Field label="Hero Image URL" value="" onChange={() => {}} placeholder="/images_v2/hero-blog-v2.jpg" />
          </Section>
        </div>
      )}

      {/* ── Contact Tab ── */}
      {activeTab === "contact" && (
        <div className="space-y-4">
          <Section title="Contact Information" emoji="📞">
            <Field label="Email" value={config.contact.email} onChange={v => setConfig({ ...config, contact: { ...config.contact, email: v } })} />
            <Field label="Phone" value={config.contact.phone} onChange={v => setConfig({ ...config, contact: { ...config.contact, phone: v } })} />
            <Field label="Address" value={config.contact.address} onChange={v => setConfig({ ...config, contact: { ...config.contact, address: v } })} type="textarea" />
            <Field label="Google Maps Embed URL" value={config.contact.mapEmbed} onChange={v => setConfig({ ...config, contact: { ...config.contact, mapEmbed: v } })} />
          </Section>
          <Section title="Social Media Links" emoji="🔗">
            <ArrayEditor items={config.socialLinks} onChange={v => setConfig({ ...config, socialLinks: v })}
              fields={[{ key: "platform", label: "Platform" }, { key: "url", label: "URL" }]} label="Social links" />
          </Section>
        </div>
      )}

      {/* ── Footer Tab ── */}
      {activeTab === "footer" && (
        <div className="space-y-4">
          <Field label="Copyright Text" value={config.footerCopyright} onChange={v => setConfig({ ...config, footerCopyright: v })} />
          <Section title="Footer Link Sections" emoji="📌">
            {config.footerSections.map((sec, i) => (
              <div key={i} className="mb-4 p-3 bg-gray-50 rounded-lg">
                <Field label="Section Title" value={sec.title} onChange={v => {
                  const copy = [...config.footerSections]; copy[i] = { ...copy[i], title: v };
                  setConfig({ ...config, footerSections: copy });
                }} />
                <ArrayEditor items={sec.links} onChange={v => {
                  const copy = [...config.footerSections]; copy[i] = { ...copy[i], links: v };
                  setConfig({ ...config, footerSections: copy });
                }}
                  fields={[{ key: "label", label: "Label" }, { key: "href", label: "Path" }]} label="Links" />
              </div>
            ))}
          </Section>
        </div>
      )}

      {/* ── SEO Tab ── */}
      {activeTab === "seo" && (
        <div className="space-y-4">
          <Section title="Meta Tags" emoji="🔍">
            <Field label="Meta Title" value={config.metaTitle} onChange={v => setConfig({ ...config, metaTitle: v })} />
            <Field label="Meta Description" value={config.metaDescription} onChange={v => setConfig({ ...config, metaDescription: v })} type="textarea" />
          </Section>
        </div>
      )}

      {/* ── Raw JSON Tab ── */}
      {activeTab === "raw" && (
        <div className="space-y-4">
          <Section title="Site Configuration (JSON)" emoji="📋">
            <textarea value={JSON.stringify(config, null, 2)} onChange={e => { try { setConfig(JSON.parse(e.target.value)); } catch {} }}
              className="w-full h-96 font-mono text-xs border border-gray-300 rounded-lg p-4 outline-none focus:border-[#D4AF37]" />
          </Section>
        </div>
      )}
    </div>
  );
}
