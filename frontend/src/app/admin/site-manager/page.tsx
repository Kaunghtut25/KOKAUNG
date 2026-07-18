"use client";

import React, { useEffect, useState, useRef } from "react";
import { put } from "@vercel/blob";

interface HeroSlide { image: string; label: string; title: string; subtitle: string; }
interface ServiceIcon { label: string; icon: string; href: string; enabled: boolean; }
interface NavLink { label: string; href: string; }
interface StatsCard { icon: string; title: string; description: string; imgSrc: string; }
interface WhyCard { icon: string; title: string; description: string; }
interface PopularDestination { city: string; country: string; image: string; minPrice: string; }
interface ContactInfo { email: string; phone: string; address: string; whatsapp: string; messenger: string; viber: string; telegram: string; }
interface SocialLink { platform: string; url: string; }
interface FooterLink { label: string; href: string; }
interface FooterSection { title: string; links: FooterLink[]; }

interface SectionLayout { desktop: number; tablet: number; mobile: number; }
interface FaqItem { id: string; question: string; answer: string; }
interface TermItem { id: string; title: string; content: string; }
interface PrivacyItem { id: string; title: string; content: string; }
interface SiteConfig {
  id: string; siteName: string; logoUrl: string;
  metaTitle: string; metaDescription: string;
  footerCopyright: string; footerRegNumbers?: string;
  footerTagline?: string; footerCompanyInfo?: string;
  faqs: FaqItem[];
  terms: TermItem[];
  privacy: PrivacyItem[];
  heroSlides: HeroSlide[]; heroHeightMobile: number; heroHeightDesktop: number;
  serviceIcons: ServiceIcon[]; navLinks: NavLink[];
  statsCards: StatsCard[]; whyChooseCards: WhyCard[];
  popularDestinations: PopularDestination[];
  ctaTitle: string; ctaDescription: string; ctaButtonLabel: string; ctaButtonHref: string;
  contact: ContactInfo; socialLinks: SocialLink[]; footerSections: FooterSection[];
  sectionLayouts?: Record<string, SectionLayout>;
  sectionRows?: Record<string, string[]>;
}
  heroImages?: Record<string, string>;

const API = "/api/admin/site-config";
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  

const defaultFaqs: FaqItem[] = [
  { id: "1", question: "How do I book a tour?", answer: "Simply browse our Tours page, select your preferred tour, click 'Book Now', fill in your details and submit. Our team will contact you within 24 hours to confirm your booking." },
  { id: "2", question: "What documents do I need for a visa application?", answer: "Required documents vary by country. Typically you need: a valid passport (6+ months), passport-size photos, flight itinerary, hotel booking confirmation, and proof of funds. Check each visa's detail page for specific requirements." },
  { id: "3", question: "Can I cancel or modify my booking?", answer: "Yes, bookings can be modified or cancelled. Cancellation fees may apply depending on how close to the departure date. Contact us at info@a9globaltravel.com for assistance." },
  { id: "4", question: "What payment methods do you accept?", answer: "We accept bank transfers, cash payments at our office, and major credit cards. Online payment integration is coming soon." },
  { id: "5", question: "Do you offer travel insurance?", answer: "Yes! We offer 9 different insurance plans ranging from basic travel shields to comprehensive annual coverage. Visit our Insurance page to find the right plan for you." },
  { id: "6", question: "How long does visa processing take?", answer: "Processing times vary by country. Most visas take 3-5 business days, but some may take up to 2 weeks. Check each visa's detail page for estimated processing time." },
  { id: "7", question: "Do you provide airport transfers?", answer: "Yes, we offer airport transfer services with our fleet of vehicles. Book through our Cars section or add it to your tour package." },
  { id: "8", question: "What is included in the Sky Lounge access?", answer: "Sky Lounge access includes premium buffet dining, complimentary drinks, WiFi, work stations, shower facilities, and flight information displays." },
  { id: "9", question: "Are cruise prices per person or per cabin?", answer: "Cruise prices are typically per person based on double occupancy. Single supplements may apply. Contact us for detailed pricing." },
  { id: "10", question: "Can I customize a tour package?", answer: "Absolutely! We specialize in custom itineraries. Contact us with your preferences and our travel experts will create a personalized package for you." },
];

const defaultTerms: TermItem[] = [
  { id: "t1", title: "1. Bookings and Reservations", content: "All bookings are subject to availability and confirmation by A9 Global Travel and Tours. A booking is only confirmed once full payment or deposit is received." },
  { id: "t2", title: "2. Cancellation Policy", content: "Cancellations made 7+ days before departure: full refund minus processing fee. Cancellations within 7 days: 50% refund. No-show: no refund." },
  { id: "t3", title: "3. Travel Documents", content: "Passengers are responsible for ensuring they have valid passports, visas, and other required travel documents. A9 Global Travel is not liable for denied boarding due to incomplete documents." },
  { id: "t4", title: "4. Pricing", content: "All prices are in Myanmar Kyat (MMK) or US Dollars (USD). Prices are subject to change without notice due to currency fluctuations, fuel surcharges, or other factors beyond our control." },
  { id: "t5", title: "5. Privacy", content: "We respect your privacy. Personal information collected during bookings is used solely for processing your reservation and will not be shared with third parties without your consent." },
  { id: "t6", title: "6. Liability", content: "A9 Global Travel and Tours acts as an agent for various service providers. We are not liable for accidents, injuries, delays, or losses caused by third-party providers." },
];

const defaultPrivacy: PrivacyItem[] = [
  { id: "p1", title: "Information We Collect", content: "We collect personal information including name, email, phone number, and travel preferences when you make a booking or contact us." },
  { id: "p2", title: "How We Use Your Information", content: "Your information is used to process bookings, provide customer support, send travel updates, and improve our services. We do not sell or rent your personal data." },
  { id: "p3", title: "Data Security", content: "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure." },
  { id: "p4", title: "Contact Us", content: "For privacy concerns, contact us at info@a9globaltravel.com or +95 9 123 456 789." },
];

const defaultCfg: SiteConfig = {
  id: "site-config", siteName: "A9 Global Travels & Tours", logoUrl: "/logo.jpeg",
  metaTitle: "A9 Global Travel | Luxury Travel Myanmar", metaDescription: "Premium travel experiences in Myanmar.",
  footerCopyright: "© 2026 A9 Global Travels & Tours.", footerRegNumbers: "Company Reg: 126395248 | IATA: 05301026",
  footerTagline: "Where every journey is a story waiting to be told!", footerCompanyInfo: "Your premier IATA-accredited travel partner.",
  faqs: defaultFaqs,
  terms: defaultTerms,
  privacy: defaultPrivacy,
  heroSlides: [{ image: "", label: "", title: "", subtitle: "" }], heroHeightMobile: 500, heroHeightDesktop: 680,
  serviceIcons: [], navLinks: [], statsCards: [], whyChooseCards: [], popularDestinations: [],
  ctaTitle: "", ctaDescription: "", ctaButtonLabel: "Book Now", ctaButtonHref: "/book-now",
  contact: { email: "", phone: "", address: "", whatsapp: "", messenger: "", viber: "", telegram: "" },
  socialLinks: [], footerSections: [],
  sectionLayouts: {
    hotels: { desktop: 4, tablet: 2, mobile: 1 },
    tours: { desktop: 3, tablet: 2, mobile: 1 },
    cars: { desktop: 3, tablet: 2, mobile: 1 },
    cruises: { desktop: 3, tablet: 2, mobile: 1 },
    visas: { desktop: 4, tablet: 3, mobile: 2 },
    insurance: { desktop: 3, tablet: 2, mobile: 1 },
    skyLounge: { desktop: 3, tablet: 2, mobile: 1 },
  },
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
  sectionRows: {
    hotels: ["Featured Hotels", "Budget Friendly", "Popular Hotels", "Row 4", "Row 5"],
    tours: ["Featured Tours", "Popular Destinations", "Adventure", "Row 4", "Row 5"],
    cars: ["Popular Cars", "SUVs & Family", "Luxury & Sedans", "Row 4", "Row 5"],
  },
};

type Tab = "layout" | "rows" | "faq" | "terms" | "privacy" | "hero" | "heroImages" | "services" | "nav" | "stats" | "why" | "destinations" | "cta" | "contact" | "social" | "footer" | "meta";

export default function SiteManagerPage() {
  const [cfg, setCfg] = useState(defaultCfg);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("hero");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  useEffect(() => {
    fetch(API).then(r => r.json()).then(d => { setCfg({ ...defaultCfg, ...d }); }).catch(() => { }).finally(() => setLoading(false));
  }, []);

  const uploadFile = async (file: File, field: string, index?: number) => {
    if (!file.type.startsWith("image/")) { setUploadError("Only image files are accepted."); return; }
    setUploading(true); setUploadError("");
    try {
      const blob = await put(file.name, file, { access: 'public' });
      const url = blob.url;
      if (index !== undefined) {
        const arr = [...(cfg as any)[field]];
        arr[index] = { ...arr[index], image: url };
        setCfg(p => ({ ...p, [field]: arr }));
      } else {
        setCfg(p => ({ ...p, [field]: url }));
      }
      showToast("Image uploaded!");
    } catch (err: any) {
      setUploadError("Upload failed. Try URL paste instead.");
    } finally { setUploading(false); }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number) => {
    const file = e.target.files?.[0]; if (!file) return;
    await uploadFile(file, field, index);
  };

  const handleDrop = (e: React.DragEvent, field: string, index?: number) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0]; if (!file) return;
    handleFileChange({ target: { files: [file] } } as any, field, index);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await fetch(API, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }, body: JSON.stringify({ ...cfg, id: "site-config" }) });
      if (r.ok) showToast("Changes saved and live!"); else showToast("Save failed", "error");
    } catch { showToast("Network error", "error"); }
    setSaving(false);
  };

  const set = <K extends keyof SiteConfig>(k: K, v: SiteConfig[K]) => setCfg(p => ({ ...p, [k]: v }));

  // Image upload zone component
  const ImageZone = ({ field, index, label }: { field: string; index?: number; label: string }) => {
    const currentVal = index !== undefined ? (cfg as any)[field]?.[index]?.image : (cfg as any)[field];
    return (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div
          onDrop={(e) => handleDrop(e, field, index)}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#D4AF37] transition-colors"
          onClick={() => fileInputRefs.current[`${field}_${index ?? ''}`]?.click()}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={(el) => { fileInputRefs.current[`${field}_${index ?? ''}`] = el; }}
            onChange={(e) => handleFileChange(e, field, index)}
          />
          {currentVal ? (
            <img src={currentVal} alt="Preview" className="mx-auto mt-2 w-full h-28 object-cover rounded" />
          ) : (
            <p className="text-sm text-gray-500">Drag &amp; drop or click to upload</p>
          )}
          {uploading && <p className="text-xs text-[#D4AF37] mt-1">Uploading...</p>}
          {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
          <p className="text-xs text-gray-400 mt-1">Recommended: 1200x630px (JPEG, max 2MB)</p>
        </div>
        <input
          type="text"
          placeholder="Or paste image URL (https://...)"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mt-2"
          value={imageUrlInput || currentVal || ""}
          onChange={(e) => {
            setImageUrlInput(e.target.value);
            if (index !== undefined) {
              const arr = [...(cfg as any)[field]];
              arr[index] = { ...arr[index], image: e.target.value };
              setCfg(p => ({ ...p, [field]: arr }));
            } else {
              setCfg(p => ({ ...p, [field]: e.target.value }));
            }
          }}
        />
      </div>
    );
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full" /></div>;

  const sectionKeys: { key: string; label: string }[] = [
  { key: "hotels", label: "Hotels" },
  { key: "tours", label: "Tours" },
  { key: "cars", label: "Cars" },
  { key: "cruises", label: "Cruises" },
  { key: "visas", label: "Visas" },
  { key: "insurance", label: "Insurance" },
  { key: "skyLounge", label: "Sky Lounge" },
];

const rowSectionKeys: { key: string; label: string }[] = [
  { key: "hotels", label: "Hotels" },
  { key: "tours", label: "Tours" },
  { key: "cars", label: "Cars" },
];

const tabs: { key: Tab; label: string }[] = [
  { key: "layout", label: "Layout" },
  { key: "rows", label: "Rows" },
  { key: "faq", label: "FAQ" },
  { key: "terms", label: "Terms" },
  { key: "privacy", label: "Privacy" },
    { key: "hero", label: "Hero Slides" },
    { key: "heroImages", label: "Hero Images" }, { key: "services", label: "Service Icons" },
    { key: "nav", label: "Nav Links" }, { key: "stats", label: "Stats Cards" },
    { key: "why", label: "Why Choose Us" }, { key: "destinations", label: "Destinations" },
    { key: "cta", label: "CTA Section" }, { key: "contact", label: "Contact Info" },
    { key: "social", label: "Social Links" }, { key: "footer", label: "Footer" },
    { key: "meta", label: "Meta & SEO" },
  ];

  const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0A1628]" style={{ fontFamily: "'Playfair Display', serif" }}>Site Manager</h1>
            <p className="text-gray-500 text-sm">Control every section of your website</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="px-6 py-2.5 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#B8941F] disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>

        {toast && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${toast.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {toast.msg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white p-3 rounded-xl shadow-sm">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? "bg-[#0A1628] text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {tab === "hero" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#0A1628]">Hero Slides</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Mobile Height</label>
                  <input type="number" className={inputCls} value={cfg.heroHeightMobile} onChange={e => set("heroHeightMobile", parseInt(e.target.value) || 500)} />
                </div>
                <div>
                  <label className={labelCls}>Desktop Height</label>
                  <input type="number" className={inputCls} value={cfg.heroHeightDesktop} onChange={e => set("heroHeightDesktop", parseInt(e.target.value) || 680)} />
                </div>
              </div>
              {cfg.heroSlides.map((slide, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-[#0A1628]">Slide {i + 1}</h3>
                    <button onClick={() => set("heroSlides", cfg.heroSlides.filter((_, idx) => idx !== i))} className="text-red-500 text-sm">Delete</button>
                  </div>
                  <ImageZone field="heroSlides" index={i} label="Slide Image" />
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelCls}>Label</label><input className={inputCls} value={slide.label} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, label: e.target.value }; set("heroSlides", a); }} /></div>
                    <div><label className={labelCls}>Title</label><input className={inputCls} value={slide.title} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, title: e.target.value }; set("heroSlides", a); }} /></div>
                  </div>
                  <div><label className={labelCls}>Subtitle</label><input className={inputCls} value={slide.subtitle} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, subtitle: e.target.value }; set("heroSlides", a); }} /></div>
                </div>
              ))}
              <button onClick={() => set("heroSlides", [...cfg.heroSlides, { image: "", label: "", title: "", subtitle: "" }])} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200">+ Add Slide</button>

          {tab === "heroImages" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#0A1628]">Hero Images (Per-Page Banners)</h2>
              <p className="text-sm text-gray-500">Set the hero banner image for each public page. Used by About, Sky Lounge, Blog, Contact, FAQ, Terms, Privacy, Book Now, Flights, Cruises, Cars, Hotels, Tours, Insurance, and Visas.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "about", label: "About Page" },
                  { key: "mingalar", label: "Sky Lounge (Mingalar)" },
                  { key: "blog", label: "Blog" },
                  { key: "contact", label: "Contact" },
                  { key: "faq", label: "FAQ" },
                  { key: "terms", label: "Terms & Conditions" },
                  { key: "privacy", label: "Privacy Policy" },
                  { key: "bookNow", label: "Book Now" },
                  { key: "flights", label: "Flights" },
                  { key: "cruises", label: "Cruises" },
                  { key: "cars", label: "Cars" },
                  { key: "hotels", label: "Hotels" },
                  { key: "tours", label: "Tours" },
                  { key: "insurance", label: "Insurance" },
                  { key: "visas", label: "Visas" },
                ].map(({ key, label }) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <h3 className="font-medium text-[#0A1628]">{label}</h3>
                    <ImageZone field="heroImages" index={undefined} label={`${label} Hero Image`} />
                    <input
                      type="text"
                      placeholder="Or paste image URL"
                      className={inputCls}
                      value={(cfg.heroImages && cfg.heroImages[key]) || ""}
                      onChange={(e) => {
                        setCfg((p) => ({
                          ...p,
                          heroImages: { ...(p.heroImages || {}), [key]: e.target.value },
                        }));
                      }}
                    />
                    {(cfg.heroImages && cfg.heroImages[key]) && (
                      <img
                        src={cfg.heroImages[key]}
                        alt={`${label} preview`}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
            </div>
          )}

          {tab === "services" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#0A1628]">Service Icons</h2>
              {cfg.serviceIcons.map((s, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-3 grid grid-cols-4 gap-3 items-center">
                  <input className={inputCls} placeholder="Icon (emoji)" value={s.icon} onChange={e => { const a = [...cfg.serviceIcons]; a[i] = { ...s, icon: e.target.value }; set("serviceIcons", a); }} />
                  <input className={inputCls} placeholder="Label" value={s.label} onChange={e => { const a = [...cfg.serviceIcons]; a[i] = { ...s, label: e.target.value }; set("serviceIcons", a); }} />
                  <input className={inputCls} placeholder="Link" value={s.href} onChange={e => { const a = [...cfg.serviceIcons]; a[i] = { ...s, href: e.target.value }; set("serviceIcons", a); }} />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={s.enabled} onChange={e => { const a = [...cfg.serviceIcons]; a[i] = { ...s, enabled: e.target.checked }; set("serviceIcons", a); }} />
                    <button onClick={() => set("serviceIcons", cfg.serviceIcons.filter((_, idx) => idx !== i))} className="text-red-500 text-sm">Delete</button>
                  </div>
                </div>
              ))}
              <button onClick={() => set("serviceIcons", [...cfg.serviceIcons, { label: "", icon: "", href: "/", enabled: true }])} className="px-4 py-2 bg-gray-100 rounded-lg text-sm">+ Add</button>
            </div>
          )}

          {tab === "nav" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#0A1628]">Navigation Links</h2>
              {cfg.navLinks.map((n, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input className={inputCls} placeholder="Label" value={n.label} onChange={e => { const a = [...cfg.navLinks]; a[i] = { ...n, label: e.target.value }; set("navLinks", a); }} />
                  <input className={inputCls} placeholder="URL" value={n.href} onChange={e => { const a = [...cfg.navLinks]; a[i] = { ...n, href: e.target.value }; set("navLinks", a); }} />
                  <button onClick={() => set("navLinks", cfg.navLinks.filter((_, idx) => idx !== i))} className="text-red-500 text-sm">Delete</button>
                </div>
              ))}
              <button onClick={() => set("navLinks", [...cfg.navLinks, { label: "", href: "/" }])} className="px-4 py-2 bg-gray-100 rounded-lg text-sm">+ Add</button>
            </div>
          )}

          {tab === "stats" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#0A1628]">Stats Cards</h2>
              {cfg.statsCards.map((s, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between"><h3 className="font-medium">Card {i + 1}</h3><button onClick={() => set("statsCards", cfg.statsCards.filter((_, idx) => idx !== i))} className="text-red-500 text-sm">Delete</button></div>
                  <div className="grid grid-cols-3 gap-3">
                    <input className={inputCls} placeholder="Icon" value={s.icon} onChange={e => { const a = [...cfg.statsCards]; a[i] = { ...s, icon: e.target.value }; set("statsCards", a); }} />
                    <input className={inputCls} placeholder="Title" value={s.title} onChange={e => { const a = [...cfg.statsCards]; a[i] = { ...s, title: e.target.value }; set("statsCards", a); }} />
                    <input className={inputCls} placeholder="Description" value={s.description} onChange={e => { const a = [...cfg.statsCards]; a[i] = { ...s, description: e.target.value }; set("statsCards", a); }} />
                  </div>
                  <ImageZone field="statsCards" index={i} label="Card Image" />
                </div>
              ))}
              <button onClick={() => set("statsCards", [...cfg.statsCards, { icon: "", title: "", description: "", imgSrc: "" }])} className="px-4 py-2 bg-gray-100 rounded-lg text-sm">+ Add</button>
            </div>
          )}

          {tab === "why" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#0A1628]">Why Choose Us Cards</h2>
              {cfg.whyChooseCards.map((w, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-3 grid grid-cols-3 gap-3">
                  <input className={inputCls} placeholder="Icon" value={w.icon} onChange={e => { const a = [...cfg.whyChooseCards]; a[i] = { ...w, icon: e.target.value }; set("whyChooseCards", a); }} />
                  <input className={inputCls} placeholder="Title" value={w.title} onChange={e => { const a = [...cfg.whyChooseCards]; a[i] = { ...w, title: e.target.value }; set("whyChooseCards", a); }} />
                  <input className={inputCls} placeholder="Description" value={w.description} onChange={e => { const a = [...cfg.whyChooseCards]; a[i] = { ...w, description: e.target.value }; set("whyChooseCards", a); }} />
                  <button onClick={() => set("whyChooseCards", cfg.whyChooseCards.filter((_, idx) => idx !== i))} className="text-red-500 text-sm col-span-3 text-right">Delete</button>
                </div>
              ))}
              <button onClick={() => set("whyChooseCards", [...cfg.whyChooseCards, { icon: "", title: "", description: "" }])} className="px-4 py-2 bg-gray-100 rounded-lg text-sm">+ Add</button>
            </div>
          )}

          {tab === "destinations" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#0A1628]">Popular Destinations</h2>
              {cfg.popularDestinations.map((d, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between"><h3 className="font-medium">{d.city || `Destination ${i + 1}`}</h3><button onClick={() => set("popularDestinations", cfg.popularDestinations.filter((_, idx) => idx !== i))} className="text-red-500 text-sm">Delete</button></div>
                  <div className="grid grid-cols-3 gap-3">
                    <input className={inputCls} placeholder="City" value={d.city} onChange={e => { const a = [...cfg.popularDestinations]; a[i] = { ...d, city: e.target.value }; set("popularDestinations", a); }} />
                    <input className={inputCls} placeholder="Country" value={d.country} onChange={e => { const a = [...cfg.popularDestinations]; a[i] = { ...d, country: e.target.value }; set("popularDestinations", a); }} />
                    <input className={inputCls} placeholder="Min Price" value={d.minPrice} onChange={e => { const a = [...cfg.popularDestinations]; a[i] = { ...d, minPrice: e.target.value }; set("popularDestinations", a); }} />
                  </div>
                  <ImageZone field="popularDestinations" index={i} label="Destination Image" />
                </div>
              ))}
              <button onClick={() => set("popularDestinations", [...cfg.popularDestinations, { city: "", country: "", image: "", minPrice: "" }])} className="px-4 py-2 bg-gray-100 rounded-lg text-sm">+ Add</button>
            </div>
          )}

          {tab === "cta" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#0A1628]">Call-to-Action Section</h2>
              <div><label className={labelCls}>Title</label><input className={inputCls} value={cfg.ctaTitle} onChange={e => set("ctaTitle", e.target.value)} /></div>
              <div><label className={labelCls}>Description</label><textarea className={inputCls} rows={3} value={cfg.ctaDescription} onChange={e => set("ctaDescription", e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Button Label</label><input className={inputCls} value={cfg.ctaButtonLabel} onChange={e => set("ctaButtonLabel", e.target.value)} /></div>
                <div><label className={labelCls}>Button Link</label><input className={inputCls} value={cfg.ctaButtonHref} onChange={e => set("ctaButtonHref", e.target.value)} /></div>
              </div>
            </div>
          )}

          {tab === "contact" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#0A1628]">Contact Information</h2>
              <p className="text-sm text-gray-500">This controls phone/email/address shown on Contact page, Footer, and LiveChat widget.</p>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Phone</label><input className={inputCls} value={cfg.contact.phone} onChange={e => set("contact", { ...cfg.contact, phone: e.target.value })} /></div>
                <div><label className={labelCls}>Email</label><input className={inputCls} value={cfg.contact.email} onChange={e => set("contact", { ...cfg.contact, email: e.target.value })} /></div>
              </div>
              <div><label className={labelCls}>Address</label><input className={inputCls} value={cfg.contact.address} onChange={e => set("contact", { ...cfg.contact, address: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>WhatsApp</label><input className={inputCls} value={cfg.contact.whatsapp} onChange={e => set("contact", { ...cfg.contact, whatsapp: e.target.value })} /></div>
                <div><label className={labelCls}>Messenger</label><input className={inputCls} value={cfg.contact.messenger} onChange={e => set("contact", { ...cfg.contact, messenger: e.target.value })} /></div>
                <div><label className={labelCls}>Viber</label><input className={inputCls} value={cfg.contact.viber} onChange={e => set("contact", { ...cfg.contact, viber: e.target.value })} /></div>
                <div><label className={labelCls}>Telegram</label><input className={inputCls} value={cfg.contact.telegram} onChange={e => set("contact", { ...cfg.contact, telegram: e.target.value })} /></div>
              </div>
              <ImageZone field="logoUrl" label="Site Logo" />
            </div>
          )}

          {tab === "social" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#0A1628]">Social Media Links</h2>
              {cfg.socialLinks.map((s, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input className={inputCls} placeholder="Platform (Facebook, Instagram...)" value={s.platform} onChange={e => { const a = [...cfg.socialLinks]; a[i] = { ...s, platform: e.target.value }; set("socialLinks", a); }} />
                  <input className={inputCls} placeholder="URL" value={s.url} onChange={e => { const a = [...cfg.socialLinks]; a[i] = { ...s, url: e.target.value }; set("socialLinks", a); }} />
                  <button onClick={() => set("socialLinks", cfg.socialLinks.filter((_, idx) => idx !== i))} className="text-red-500 text-sm">Delete</button>
                </div>
              ))}
              <button onClick={() => set("socialLinks", [...cfg.socialLinks, { platform: "", url: "" }])} className="px-4 py-2 bg-gray-100 rounded-lg text-sm">+ Add</button>
            </div>
          )}

          {tab === "footer" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#0A1628]">Footer Settings</h2>
              <div><label className={labelCls}>Copyright Text</label><input className={inputCls} value={cfg.footerCopyright} onChange={e => set("footerCopyright", e.target.value)} /></div>
              <div><label className={labelCls}>Registration Numbers</label><input className={inputCls} value={cfg.footerRegNumbers || ""} onChange={e => set("footerRegNumbers", e.target.value)} /></div>
              <div><label className={labelCls}>Tagline</label><input className={inputCls} value={cfg.footerTagline || ""} onChange={e => set("footerTagline", e.target.value)} /></div>
              <div><label className={labelCls}>Company Info</label><textarea className={inputCls} rows={2} value={cfg.footerCompanyInfo || ""} onChange={e => set("footerCompanyInfo", e.target.value)} /></div>
              {cfg.footerSections.map((sec, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between">
                    <input className={inputCls} placeholder="Section Title" value={sec.title} onChange={e => { const a = [...cfg.footerSections]; a[i] = { ...sec, title: e.target.value }; set("footerSections", a); }} />
                    <button onClick={() => set("footerSections", cfg.footerSections.filter((_, idx) => idx !== i))} className="text-red-500 text-sm ml-2">Delete</button>
                  </div>
                  {sec.links.map((link, j) => (
                    <div key={j} className="flex gap-2">
                      <input className={inputCls} placeholder="Label" value={link.label} onChange={e => { const a = [...cfg.footerSections]; a[i].links[j] = { ...link, label: e.target.value }; set("footerSections", [...a]); }} />
                      <input className={inputCls} placeholder="URL" value={link.href} onChange={e => { const a = [...cfg.footerSections]; a[i].links[j] = { ...link, href: e.target.value }; set("footerSections", [...a]); }} />
                      <button onClick={() => { const a = [...cfg.footerSections]; a[i].links = a[i].links.filter((_, idx) => idx !== j); set("footerSections", a); }} className="text-red-500 text-sm">X</button>
                    </div>
                  ))}
                  <button onClick={() => { const a = [...cfg.footerSections]; a[i].links.push({ label: "", href: "" }); set("footerSections", a); }} className="text-sm text-[#D4AF37]">+ Add Link</button>
                </div>
              ))}
              <button onClick={() => set("footerSections", [...cfg.footerSections, { title: "", links: [] }])} className="px-4 py-2 bg-gray-100 rounded-lg text-sm">+ Add Section</button>
            </div>
          )}

          {tab === "layout" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#0A1628]">Section Layout — Items Per Row</h2>
              <p className="text-sm text-gray-500">Control how many cards appear per row on each public section page, for desktop, tablet, and mobile viewports.</p>
              {sectionKeys.map(sk => {
                const sl = cfg.sectionLayouts?.[sk.key] || { desktop: 3, tablet: 2, mobile: 1 };
                return (
                  <div key={sk.key} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <h3 className="font-medium text-[#0A1628]">{sk.label}</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Desktop</label>
                        <select className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" value={sl.desktop} onChange={e => {
                          const v = parseInt(e.target.value);
                          setCfg(p => ({ ...p, sectionLayouts: { ...p.sectionLayouts, [sk.key]: { ...sl, desktop: v } } }));
                        }}>
                          {[3,4,5].map(n => <option key={n} value={n}>{n} columns</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tablet</label>
                        <select className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" value={sl.tablet} onChange={e => {
                          const v = parseInt(e.target.value);
                          setCfg(p => ({ ...p, sectionLayouts: { ...p.sectionLayouts, [sk.key]: { ...sl, tablet: v } } }));
                        }}>
                          {[2,3].map(n => <option key={n} value={n}>{n} columns</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Mobile</label>
                        <select className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" value={sl.mobile} onChange={e => {
                          const v = parseInt(e.target.value);
                          setCfg(p => ({ ...p, sectionLayouts: { ...p.sectionLayouts, [sk.key]: { ...sl, mobile: v } } }));
                        }}>
                          {[1,2].map(n => <option key={n} value={n}>{n} column{n > 1 ? "s" : ""}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "rows" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#0A1628]">Section Row Titles</h2>
              <p className="text-sm text-gray-500">Set custom row titles for Hotels, Tours, and Cars section pages. Each row can have up to 6 cards with horizontal scrolling.</p>
              {rowSectionKeys.map(sk => {
                const titles = cfg.sectionRows?.[sk.key] || ["Row 1", "Row 2", "Row 3", "Row 4", "Row 5"];
                return (
                  <div key={sk.key} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <h3 className="font-medium text-[#0A1628]">{sk.label} Row Titles</h3>
                    {titles.map((title, i) => (
                      <div key={i}>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Row {i + 1}</label>
                        <input
                          className={inputCls}
                          value={title}
                          placeholder={`Row ${i + 1} title`}
                          onChange={e => {
                            const newTitles = [...titles];
                            newTitles[i] = e.target.value;
                            setCfg(p => ({
                              ...p,
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
  sectionRows: { ...p.sectionRows, [sk.key]: newTitles }
                            }));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
          {tab === "faq" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#0A1628]">FAQ Management</h2>
              <p className="text-sm text-gray-500">Manage frequently asked questions displayed on the FAQ page.</p>
              {cfg.faqs.map((faq, i) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-[#0A1628]">FAQ #{i + 1}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const el = document.getElementById(`faq-question-${faq.id}`) as HTMLTextAreaElement;
                          if (el) el.focus();
                        }}
                        className="text-[#D4AF37] hover:text-[#B8941F] text-sm"
                        title="Edit"
                      >&#9998;</button>
                      <button
                        onClick={() => set("faqs", cfg.faqs.filter((_, idx) => idx !== i))}
                        className="text-red-500 text-sm"
                        title="Delete"
                      >&#128465;</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Question</label>
                    <textarea
                      id={`faq-question-${faq.id}`}
                      className={inputCls}
                      rows={2}
                      value={faq.question}
                      onChange={e => {
                        const a = [...cfg.faqs];
                        a[i] = { ...faq, question: e.target.value };
                        set("faqs", a);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Answer</label>
                    <textarea
                      className={inputCls}
                      rows={3}
                      value={faq.answer}
                      onChange={e => {
                        const a = [...cfg.faqs];
                        a[i] = { ...faq, answer: e.target.value };
                        set("faqs", a);
                      }}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => set("faqs", [...cfg.faqs, { id: crypto.randomUUID(), question: "", answer: "" }])}
                className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
              >
                + Add FAQ
              </button>
            </div>
          )}

          {tab === "terms" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#0A1628]">Terms and Conditions</h2>
              <p className="text-sm text-gray-500">Manage terms and conditions displayed on the Terms page.</p>
              {cfg.terms.map((item, i) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-[#0A1628]">{item.title || `Section ${i + 1}`}</h3>
                    <button
                      onClick={() => set("terms", cfg.terms.filter((_, idx) => idx !== i))}
                      className="text-red-500 text-sm"
                    >Delete</button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                    <input
                      className={inputCls}
                      value={item.title}
                      onChange={e => {
                        const a = [...cfg.terms];
                        a[i] = { ...item, title: e.target.value };
                        set("terms", a);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Content</label>
                    <textarea
                      className={inputCls}
                      rows={4}
                      value={item.content}
                      onChange={e => {
                        const a = [...cfg.terms];
                        a[i] = { ...item, content: e.target.value };
                        set("terms", a);
                      }}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => set("terms", [...cfg.terms, { id: crypto.randomUUID(), title: "", content: "" }])}
                className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
              >
                + Add Section
              </button>
            </div>
          )}

          {tab === "privacy" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#0A1628]">Privacy Policy</h2>
              <p className="text-sm text-gray-500">Manage privacy policy sections displayed on the Privacy page.</p>
              {cfg.privacy.map((item, i) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-[#0A1628]">{item.title || `Section ${i + 1}`}</h3>
                    <button
                      onClick={() => set("privacy", cfg.privacy.filter((_, idx) => idx !== i))}
                      className="text-red-500 text-sm"
                    >Delete</button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                    <input
                      className={inputCls}
                      value={item.title}
                      onChange={e => {
                        const a = [...cfg.privacy];
                        a[i] = { ...item, title: e.target.value };
                        set("privacy", a);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Content</label>
                    <textarea
                      className={inputCls}
                      rows={4}
                      value={item.content}
                      onChange={e => {
                        const a = [...cfg.privacy];
                        a[i] = { ...item, content: e.target.value };
                        set("privacy", a);
                      }}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => set("privacy", [...cfg.privacy, { id: crypto.randomUUID(), title: "", content: "" }])}
                className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
              >
                + Add Section
              </button>
            </div>
          )}

          {tab === "meta" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#0A1628]">Meta & SEO</h2>
              <div><label className={labelCls}>Site Name</label><input className={inputCls} value={cfg.siteName} onChange={e => set("siteName", e.target.value)} /></div>
              <div><label className={labelCls}>Meta Title</label><input className={inputCls} value={cfg.metaTitle} onChange={e => set("metaTitle", e.target.value)} /></div>
              <div><label className={labelCls}>Meta Description</label><textarea className={inputCls} rows={3} value={cfg.metaDescription} onChange={e => set("metaDescription", e.target.value)} /></div>
              <ImageZone field="logoUrl" label="Site Logo" />
            </div>
          )}
        </div>

        {uploading && <div className="fixed bottom-4 right-4 bg-[#0A1628] text-white px-4 py-2 rounded-lg shadow-lg text-sm">Uploading image...</div>}
      </div>
    </main>
  );
}
