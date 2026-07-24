"use client";

import React, { useEffect, useState, useRef } from "react";

interface HeroSlide { image: string; label: string; title: string; subtitle: string; titleFont?: string; titleSize?: string; subtitleSize?: string; labelFont?: string; labelSize?: string; }
interface ServiceIcon { label: string; icon: string; href: string; enabled: boolean; }
interface NavLink { label: string; href: string; }
interface StatsCard { icon: string; title: string; description: string; imgSrc: string; }
interface WhyCard { icon: string; title: string; description: string; }
interface Testimonial { name: string; country: string; tour: string; text: string; rating: number; image?: string; }
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
  testimonials: Testimonial[]; partners: string[];
  ctaTitle: string; ctaDescription: string; ctaButtonLabel: string; ctaButtonHref: string;
  contact: ContactInfo; socialLinks: SocialLink[]; footerSections: FooterSection[];
  sectionLayouts?: Record<string, SectionLayout>;
  sectionRows?: Record<string, string[]>;
  heroImages?: Record<string, string>;
}

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
  id: "site-config", siteName: "𝐀𝟗 𝐆𝐥𝐨𝐛𝐚𝐥 𝐓𝐫𝐚𝐯𝐞𝐥𝐬 & 𝐓𝐨𝐮𝐫𝐬", logoUrl: "/logo.jpeg",
  metaTitle: "A9 Global Travel | Luxury Travel Myanmar", metaDescription: "Premium travel experiences in Myanmar.",
  footerCopyright: "© 2026 𝐀𝟗 𝐆𝐥𝐨𝐛𝐚𝐥 𝐓𝐫𝐚𝐯𝐞𝐥𝐬 & 𝐓𝐨𝐮𝐫𝐬.", footerRegNumbers: "Company Reg: 126395248 | IATA: 05301026",
  footerTagline: "Where every journey is a story waiting to be told!", footerCompanyInfo: "Your premier IATA-accredited travel partner.",
  faqs: defaultFaqs,
  terms: defaultTerms,
  privacy: defaultPrivacy,
  heroSlides: [{ image: "", label: "", title: "", subtitle: "", titleFont: "'Playfair Display', Georgia, serif", titleSize: "4rem", subtitleSize: "1.2rem", labelFont: "inherit", labelSize: "0.75rem" }], heroHeightMobile: 500, heroHeightDesktop: 680,
  serviceIcons: [], navLinks: [], statsCards: [], whyChooseCards: [], popularDestinations: [],
  testimonials: [
    { name: "John Smith", country: "Australia", tour: "Bagan Explorer", text: "Amazing experience! The hot air balloon ride was breathtaking. Professional team from start to finish.", rating: 5 },
    { name: "Sarah Chen", country: "Singapore", tour: "Inle Lake Discovery", text: "Beautiful lake, friendly people. A9 made everything seamless. Highly recommend!", rating: 5 },
    { name: "Marcus Weber", country: "Germany", tour: "Yangon City Tour", text: "Rich culture and history. Our guide was knowledgeable and spoke excellent English.", rating: 5 },
    { name: "Yuki Tanaka", country: "Japan", tour: "Ngapali Beach Escape", text: "Perfect beach vacation. The resort was stunning and transfers were on time.", rating: 5 },
  ],
  partners: [
    "Shangri-La", "Sedona Hotel", "Sule Palace", "Melia Hotel",
    "Myanmar Airways", "Thai Airways", "Singapore Airlines", "Emirates",
  ],
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
    about: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609797449_9f7un5-hero-about-t767UxVogi3ih6w9rwFArg4ilDGNdz.jpg",
    mingalar: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609798375_lnn6kp-hero-mingalar-iXSipAn6UMN12kyEIU3WiFiCMs20qc.jpg",
    blog: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609799332_6ebnns-hero-blog-mBap03GJD1400JSclYnUjYfHoo3frB.jpg",
    contact: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609800417_vhjn6x-hero-contact-QIxGEkpiOSIxCFvrw0ChbfhhUNYSuQ.jpg",
    faq: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609801256_ruke67-hero-faq-liRka2pU7EEzMQipE1RYv44rCD9zcw.jpg",
    terms: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609802402_52voor-hero-terms-pxoJKPcMuOinidhTKK5TA2zi6bpIA7.jpg",
    privacy: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609803553_cfdhsm-hero-privacy-z9rX6irIergZ5bw5fSN03qLOm0GeSB.jpg",
    bookNow: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609804673_59ylry-hero-bookNow-scMChIEz2tbilFW7dBtf1KcNU9UkED.jpg",
    flights: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609806040_dy0gyu-hero-flights-jzePjnnHhOTfVOY3GEhUKFBINa7n3f.jpg",
    cruises: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609807485_6pw8ew-hero-cruises-WIDq1Jve8AvJyNu5ZSaSijXmL0kZ1G.jpg",
    cars: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609808655_l403a3-hero-cars-fjXhGpEAeGzTuP9I9JwFkeq0G4sGsx.jpg",
    hotels: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609809532_sgh7un-hero-hotels-QYNI1doqQgUXvnUcIrBHuZfwDFssuK.jpg",
    tours: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609810919_004yzh-hero-tours-UsdmyqKcP581EhNqux4A5bBKwpudIx.jpg",
    insurance: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609811896_gmexob-hero-insurance-hgvtL1kVRATajwICoA0WvEjL0rQB2K.jpg",
    visas: "https://vydupdjfr38dxlzx.public.blob.vercel-storage.com/uploads/img_1784609812789_zgd7hq-hero-visas-CjTSUSqnTR16khrC4YxJ66jcyj106i.jpg",
  },
  sectionRows: {
    hotels: ["Featured Hotels", "Budget Friendly", "Popular Hotels", "Row 4", "Row 5"],
    tours: ["Featured Tours", "Popular Destinations", "Adventure", "Row 4", "Row 5"],
    cars: ["Popular Cars", "SUVs & Family", "Luxury & Sedans", "Row 4", "Row 5"],
  },
};

type Tab = "layout" | "rows" | "faq" | "terms" | "privacy" | "hero" | "heroImages" | "services" | "nav" | "stats" | "why" | "destinations" | "cta" | "contact" | "social" | "footer" | "meta" | "testimonials" | "partners" | "heroText" | "cardDims" | "moduleToggles";

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
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      const blob = data.uploads?.[0];
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
        <label className="block text-sm font-medium text-white/70 mb-1">{label}</label>
        <div
          onDrop={(e) => handleDrop(e, field, index)}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center cursor-pointer hover:border-[#D4AF37] transition-colors"
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
            <p className="text-sm text-white/40">Drag &amp; drop or click to upload</p>
          )}
          {uploading && <p className="text-xs text-[#D4AF37] mt-1">Uploading...</p>}
          {uploadError && <p className="text-xs text-red-400 mt-1">{uploadError}</p>}
          <p className="text-xs text-white/30 mt-1">Recommended: 1200x630px (JPEG, max 2MB)</p>
        </div>
        <input
          type="text"
          placeholder="Or paste image URL (https://...)"
          className="w-full px-3 py-2 rounded-lg border border-white/10 text-white text-sm mt-2" style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
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
    { key: "heroImages", label: "Hero Images" },
    { key: "heroText", label: "Hero Text" },
    { key: "cardDims", label: "Card & Hero Sizes" },
    { key: "moduleToggles", label: "Module Toggles" }, { key: "services", label: "Service Icons" },
    { key: "nav", label: "Nav Links" }, { key: "stats", label: "Stats Cards" },
    { key: "why", label: "Why Choose Us" }, { key: "destinations", label: "Destinations" },
    { key: "cta", label: "CTA Section" }, { key: "contact", label: "Contact Info" },
    { key: "social", label: "Social Links" }, { key: "footer", label: "Footer" },
    { key: "meta", label: "Meta & SEO" },
    { key: "testimonials", label: "Testimonials" },
    { key: "partners", label: "Partners" },
  ];

  const inputCls = "w-full px-3 py-2 rounded-lg border border-white/10 text-white text-sm";
  const labelCls = "block text-sm font-medium text-white/70 mb-1";

  return (
    <main className="min-h-screen bg-[#0A1628] text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Site Manager</h1>
            <p className="text-white/40 text-sm">Control every section of your website</p>
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
        <div className="flex flex-wrap gap-2 mb-6 bg-white/10 p-3 rounded-xl shadow-sm">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? "bg-[#0A1628] text-white" : "text-white/50 hover:bg-white/10"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white/10 rounded-xl shadow-sm p-6">
          {tab === "hero" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white">Hero Slides</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`labelCls inputCls`}>Mobile Height</label>
                </div>
                <div>
                  <label className={`labelCls inputCls`}>Desktop Height</label>
                </div>
              </div>
              {cfg.heroSlides.map((slide, i) => (
                <div key={i} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">Slide {i + 1}</h3>
                    <button onClick={() => set("heroSlides", cfg.heroSlides.filter((_, idx) => idx !== i))} className="text-red-400 text-sm">Delete</button>
                  </div>
                  <ImageZone field="heroSlides" index={i} label="Slide Image" />
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={`labelCls labelCls`}>Label</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={slide.label} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, label: e.target.value }; set("heroSlides", a); }} /></div>
                    <div><label className={labelCls}>Title</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={slide.title} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, title: e.target.value }; set("heroSlides", a); }} /></div>
                  </div>
                  <div><label className={labelCls}>Subtitle</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={slide.subtitle} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, subtitle: e.target.value }; set("heroSlides", a); }} /></div>

                  {/* Font & Size Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2">
                    <div>
                      <label className={labelCls}>Title Font</label>
                      <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={slide.titleFont || "'Playfair Display', Georgia, serif"} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, titleFont: e.target.value }; set("heroSlides", a); }}>
                        <option value="'Playfair Display', Georgia, serif">Playfair Display</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Montserrat, sans-serif">Montserrat</option>
                        <option value="inherit">Inherit</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Title Size</label>
                      <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={slide.titleSize || "4rem"} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, titleSize: e.target.value }; set("heroSlides", a); }}>
                        <option value="4rem">4rem</option>
                        <option value="3rem">3rem</option>
                        <option value="2.5rem">2.5rem</option>
                        <option value="2rem">2rem</option>
                        <option value="1.5rem">1.5rem</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Subtitle Size</label>
                      <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={slide.subtitleSize || "1.2rem"} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, subtitleSize: e.target.value }; set("heroSlides", a); }}>
                        <option value="1.5rem">1.5rem</option>
                        <option value="1.2rem">1.2rem</option>
                        <option value="1rem">1rem</option>
                        <option value="0.875rem">0.875rem</option>
                        <option value="0.75rem">0.75rem</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Label Font</label>
                      <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={slide.labelFont || "inherit"} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, labelFont: e.target.value }; set("heroSlides", a); }}>
                        <option value="inherit">Inherit</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="'Playfair Display', Georgia, serif">Playfair Display</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Montserrat, sans-serif">Montserrat</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className={labelCls}>Label Size</label>
                      <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={slide.labelSize || "0.75rem"} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, labelSize: e.target.value }; set("heroSlides", a); }}>
                        <option value="1rem">1rem</option>
                        <option value="0.875rem">0.875rem</option>
                        <option value="0.75rem">0.75rem</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => set("heroSlides", [...cfg.heroSlides, { image: "", label: "", title: "", subtitle: "", titleFont: "'Playfair Display', Georgia, serif", titleSize: "4rem", subtitleSize: "1.2rem", labelFont: "inherit", labelSize: "0.75rem" }])} className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium text-white/50 hover:bg-white/20">+ Add Slide</button>

            </div>
          )}

          {tab === "heroImages" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white">Hero Images (Per-Page Banners)</h2>
              <p className="text-sm text-white/40">Set the hero banner image for each public page. Used by About, Sky Lounge, Blog, Contact, FAQ, Terms, Privacy, Book Now, Flights, Cruises, Cars, Hotels, Tours, Insurance, and Visas.</p>
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
                  <div key={key} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                    <h3 className="font-medium text-white">{label}</h3>
                    {/* Simple image edit for heroImages */}
                    <div className="mb-3">
                      <div
                        className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center cursor-pointer hover:border-[#D4AF37] transition-colors"
                        onDrop={async (e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          if (!file) return;
                          setUploading(true); setUploadError("");
                          try {
                            const fd = new FormData();
                            fd.append('file', file);
                            const res = await fetch('/api/upload', { method: 'POST', body: fd });
                            const data = await res.json();
                            const blob = data.uploads?.[0];
                            setCfg(p => ({ ...p, heroImages: { ...(p.heroImages || {}), [key]: blob.url } }));
                            showToast("Image uploaded!");
                          } catch { setUploadError("Upload failed."); }
                          setUploading(false);
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => {
                          const ref = fileInputRefs.current[`heroImages_${key}`];
                          if (ref) ref.click();
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={(el) => { fileInputRefs.current[`heroImages_${key}`] = el; }}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploading(true); setUploadError("");
                            try {
                              const fd = new FormData();
                              fd.append('file', file);
                              const res = await fetch('/api/upload', { method: 'POST', body: fd });
                              const data = await res.json();
                              const blob = data.uploads?.[0];
                              setCfg(p => ({ ...p, heroImages: { ...(p.heroImages || {}), [key]: blob.url } }));
                              showToast("Image uploaded!");
                            } catch { setUploadError("Upload failed."); }
                            setUploading(false);
                          }}
                        />
                        {(cfg.heroImages && cfg.heroImages[key]) ? (
                          <img src={cfg.heroImages[key]} alt="Preview" className="mx-auto mt-2 w-full h-28 object-cover rounded" />
                        ) : (
                          <p className="text-sm text-white/40">Click to upload</p>
                        )}
                        {uploading && <p className="text-xs text-[#D4AF37] mt-1">Uploading...</p>}
                        <p className="text-xs text-white/30 mt-1">1200x630px JPEG max 2MB</p>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Or paste image URL"
                      className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
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
          {tab === "services" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Service Icons</h2>
              {cfg.serviceIcons.map((s, i) => (
                <div key={i} className="border border-white/10 bg-white/5 text-white rounded-lg p-3 grid grid-cols-4 gap-3 items-center">
                  <input className={`inputCls inputCls`} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="Icon (emoji)" value={s.icon} onChange={e => { const a = [...cfg.serviceIcons]; a[i] = { ...s, icon: e.target.value }; set("serviceIcons", a); }} />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={s.enabled} onChange={e => { const a = [...cfg.serviceIcons]; a[i] = { ...s, enabled: e.target.checked }; set("serviceIcons", a); }} />
                    <button onClick={() => set("serviceIcons", cfg.serviceIcons.filter((_, idx) => idx !== i))} className="text-red-400 text-sm">Delete</button>
                  </div>
                </div>
              ))}
              <button onClick={() => set("serviceIcons", [...cfg.serviceIcons, { label: "", icon: "", href: "/", enabled: true }])} className="px-4 py-2 bg-white/10 rounded-lg text-sm">+ Add</button>
            </div>
          )}

          {tab === "nav" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Navigation Links</h2>
              {cfg.navLinks.map((n, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input className={`inputCls inputCls`} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="Label" value={n.label} onChange={e => { const a = [...cfg.navLinks]; a[i] = { ...n, label: e.target.value }; set("navLinks", a); }} />
                  <button onClick={() => set("navLinks", cfg.navLinks.filter((_, idx) => idx !== i))} className="text-red-400 text-sm">Delete</button>
                </div>
              ))}
              <button onClick={() => set("navLinks", [...cfg.navLinks, { label: "", href: "/" }])} className="px-4 py-2 bg-white/10 rounded-lg text-sm">+ Add</button>
            </div>
          )}

          {tab === "stats" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Stats Cards</h2>
              {cfg.statsCards.map((s, i) => (
                <div key={i} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                  <div className="flex justify-between"><h3 className="font-medium">Card {i + 1}</h3><button onClick={() => set("statsCards", cfg.statsCards.filter((_, idx) => idx !== i))} className="text-red-400 text-sm">Delete</button></div>
                  <div className="grid grid-cols-3 gap-3">
                    <input className={`inputCls inputCls`} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="Icon" value={s.icon} onChange={e => { const a = [...cfg.statsCards]; a[i] = { ...s, icon: e.target.value }; set("statsCards", a); }} />
                  </div>
                  <ImageZone field="statsCards" index={i} label="Card Image" />
                </div>
              ))}
              <button onClick={() => set("statsCards", [...cfg.statsCards, { icon: "", title: "", description: "", imgSrc: "" }])} className="px-4 py-2 bg-white/10 rounded-lg text-sm">+ Add</button>
            </div>
          )}

          {tab === "why" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Why Choose Us Cards</h2>
              {cfg.whyChooseCards.map((w, i) => (
                <div key={i} className="border border-white/10 bg-white/5 text-white rounded-lg p-3 grid grid-cols-3 gap-3">
                  <input className={`inputCls inputCls`} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="Icon" value={w.icon} onChange={e => { const a = [...cfg.whyChooseCards]; a[i] = { ...w, icon: e.target.value }; set("whyChooseCards", a); }} />
                  <button onClick={() => set("whyChooseCards", cfg.whyChooseCards.filter((_, idx) => idx !== i))} className="text-red-400 text-sm col-span-3 text-right">Delete</button>
                </div>
              ))}
              <button onClick={() => set("whyChooseCards", [...cfg.whyChooseCards, { icon: "", title: "", description: "" }])} className="px-4 py-2 bg-white/10 rounded-lg text-sm">+ Add</button>
            </div>
          )}

          {tab === "destinations" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Popular Destinations</h2>
              {cfg.popularDestinations.map((d, i) => (
                <div key={i} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                  <div className="flex justify-between"><h3 className="font-medium">{d.city || `Destination ${i + 1}`}</h3><button onClick={() => set("popularDestinations", cfg.popularDestinations.filter((_, idx) => idx !== i))} className="text-red-400 text-sm">Delete</button></div>
                  <div className="grid grid-cols-3 gap-3">
                    <input className={`inputCls inputCls`} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="City" value={d.city} onChange={e => { const a = [...cfg.popularDestinations]; a[i] = { ...d, city: e.target.value }; set("popularDestinations", a); }} />
                  </div>
                  
              <div className="mt-4 border-t border-white/10 pt-4">
                <h3 className="text-sm font-semibold text-[#D4AF37] mb-3">Section Header Text</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div><label className={labelCls}>Title</label>
                    <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={(cfg.destinationsText?.title) || "Explore The World"}
                      onChange={e => setCfg(p => ({ ...p, destinationsText: { ...(p.destinationsText || {}), title: e.target.value } }))} /></div>
                  <div><label className={labelCls}>Subtitle</label>
                    <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={(cfg.destinationsText?.subtitle) || "Popular Destinations"}
                      onChange={e => setCfg(p => ({ ...p, destinationsText: { ...(p.destinationsText || {}), subtitle: e.target.value } }))} /></div>
                  <div><label className={labelCls}>Title Font</label>
                    <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={(cfg.destinationsText?.titleFont) || "'Playfair Display', Georgia, serif"}
                      onChange={e => setCfg(p => ({ ...p, destinationsText: { ...(p.destinationsText || {}), titleFont: e.target.value } }))}>
                      <option value="Georgia, serif">Georgia</option>
                      <option value="'Playfair Display', Georgia, serif">Playfair Display</option>
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="system-ui, sans-serif">System UI</option>
                    </select></div>
                  <div><label className={labelCls}>Title Size</label>
                    <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={(cfg.destinationsText?.titleSize) || "2.5rem"}
                      onChange={e => setCfg(p => ({ ...p, destinationsText: { ...(p.destinationsText || {}), titleSize: e.target.value } }))}>
                      <option value="1.5rem">1.5rem</option><option value="2rem">2rem</option><option value="2.5rem">2.5rem</option><option value="3rem">3rem</option></select></div>
                  <div><label className={labelCls}>Title Color</label>
                    <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} type="color"
                      value={(cfg.destinationsText?.titleColor) || "#0A1628"}
                      onChange={e => setCfg(p => ({ ...p, destinationsText: { ...(p.destinationsText || {}), titleColor: e.target.value } }))} /></div>
                </div>
                <h4 className="text-xs font-semibold text-white/50 mb-2">Card Title Style</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelCls}>Font</label>
                    <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={(cfg.destinationsText?.cardTitleFont) || "'Playfair Display', Georgia, serif"}
                      onChange={e => setCfg(p => ({ ...p, destinationsText: { ...(p.destinationsText || {}), cardTitleFont: e.target.value } }))}>
                      <option value="Georgia, serif">Georgia</option>
                      <option value="'Playfair Display', Georgia, serif">Playfair Display</option>
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="system-ui, sans-serif">System UI</option>
                    </select></div>
                  <div><label className={labelCls}>Size</label>
                    <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={(cfg.destinationsText?.cardTitleSize) || "1rem"}
                      onChange={e => setCfg(p => ({ ...p, destinationsText: { ...(p.destinationsText || {}), cardTitleSize: e.target.value } }))}>
                      <option value="0.875rem">0.875rem</option><option value="1rem">1rem</option><option value="1.125rem">1.125rem</option><option value="1.25rem">1.25rem</option></select></div>
                  <div><label className={labelCls}>Color</label>
                    <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} type="color"
                      value={(cfg.destinationsText?.cardTitleColor) || "#0A1628"}
                      onChange={e => setCfg(p => ({ ...p, destinationsText: { ...(p.destinationsText || {}), cardTitleColor: e.target.value } }))} /></div>
                </div>
              </div>
            <ImageZone field="popularDestinations" index={i} label="Destination Image" />
                </div>
              ))}
              <button onClick={() => set("popularDestinations", [...cfg.popularDestinations, { city: "", country: "", image: "", minPrice: "" }])} className="px-4 py-2 bg-white/10 rounded-lg text-sm">+ Add</button>
            </div>
          )}

          {tab === "cta" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Call-to-Action Section</h2>
              <div><label className={`labelCls labelCls`}>Title</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={cfg.ctaTitle} onChange={e => set("ctaTitle", e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={`labelCls labelCls`}>Button Label</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={cfg.ctaButtonLabel} onChange={e => set("ctaButtonLabel", e.target.value)} /></div>
              </div>
            </div>
          )}

          {tab === "contact" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Contact Information</h2>
              <p className="text-sm text-white/40">This controls phone/email/address shown on Contact page, Footer, and LiveChat widget.</p>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={`labelCls labelCls`}>Phone</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={cfg.contact.phone} onChange={e => set("contact", { ...cfg.contact, phone: e.target.value })} /></div>
              </div>
              <div><label className={labelCls}>Address</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={cfg.contact.address} onChange={e => set("contact", { ...cfg.contact, address: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={`labelCls labelCls`}>WhatsApp</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={cfg.contact.whatsapp} onChange={e => set("contact", { ...cfg.contact, whatsapp: e.target.value })} /></div>
              </div>
              
              <div className="mt-6 border-t border-white/10 pt-4">
                <h3 className="text-sm font-semibold text-[#D4AF37] mb-3">Department Phone Numbers</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelCls}>Ticket Department</label>
                    <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={(cfg.departmentPhones && cfg.departmentPhones.ticket) || ""}
                      onChange={e => setCfg(p => ({ ...p, departmentPhones: { ...(p.departmentPhones || {}), ticket: e.target.value } }))} />
                  </div>
                  <div><label className={labelCls}>Visa Department</label>
                    <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={(cfg.departmentPhones && cfg.departmentPhones.visa) || ""}
                      onChange={e => setCfg(p => ({ ...p, departmentPhones: { ...(p.departmentPhones || {}), visa: e.target.value } }))} />
                  </div>
                  <div><label className={labelCls}>Hotel Department</label>
                    <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={(cfg.departmentPhones && cfg.departmentPhones.hotel) || ""}
                      onChange={e => setCfg(p => ({ ...p, departmentPhones: { ...(p.departmentPhones || {}), hotel: e.target.value } }))} />
                  </div>
                  <div><label className={labelCls}>Outbound Department</label>
                    <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={(cfg.departmentPhones && cfg.departmentPhones.outbound) || ""}
                      onChange={e => setCfg(p => ({ ...p, departmentPhones: { ...(p.departmentPhones || {}), outbound: e.target.value } }))} />
                  </div>
                  <div><label className={labelCls}>Inbound Department</label>
                    <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={(cfg.departmentPhones && cfg.departmentPhones.inbound) || ""}
                      onChange={e => setCfg(p => ({ ...p, departmentPhones: { ...(p.departmentPhones || {}), inbound: e.target.value } }))} />
                  </div>
                </div>
              </div>
            <ImageZone field="logoUrl" label="Site Logo" />
            </div>
          )}

          {tab === "social" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Social Media Links</h2>
              {cfg.socialLinks.map((s, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input className={`inputCls inputCls`} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="Platform (Facebook, Instagram...)" value={s.platform} onChange={e => { const a = [...cfg.socialLinks]; a[i] = { ...s, platform: e.target.value }; set("socialLinks", a); }} />
                  <button onClick={() => set("socialLinks", cfg.socialLinks.filter((_, idx) => idx !== i))} className="text-red-400 text-sm">Delete</button>
                </div>
              ))}
              <button onClick={() => set("socialLinks", [...cfg.socialLinks, { platform: "", url: "" }])} className="px-4 py-2 bg-white/10 rounded-lg text-sm">+ Add</button>
            </div>
          )}

          {tab === "footer" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Footer Settings</h2>
              <div><label className={`labelCls labelCls`}>Copyright Text</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={cfg.footerCopyright} onChange={e => set("footerCopyright", e.target.value)} /></div>
              {cfg.footerSections.map((sec, i) => (
                <div key={i} className="border border-white/10 bg-white/5 text-white rounded-lg p-3 space-y-2">
                  <div className="flex justify-between">
                    <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="Section Title" value={sec.title} onChange={e => { const a = [...cfg.footerSections]; a[i] = { ...sec, title: e.target.value }; set("footerSections", a); }} />
                    <button onClick={() => set("footerSections", cfg.footerSections.filter((_, idx) => idx !== i))} className="text-red-400 text-sm ml-2">Delete</button>
                  </div>
                  {sec.links.map((link, j) => (
                    <div key={j} className="flex gap-2">
                      <input className={`inputCls inputCls`} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="Label" value={link.label} onChange={e => { const a = [...cfg.footerSections]; a[i].links[j] = { ...link, label: e.target.value }; set("footerSections", [...a]); }} />
                      <button onClick={() => { const a = [...cfg.footerSections]; a[i].links = a[i].links.filter((_, idx) => idx !== j); set("footerSections", a); }} className="text-red-400 text-sm">X</button>
                    </div>
                  ))}
                  <button onClick={() => { const a = [...cfg.footerSections]; a[i].links.push({ label: "", href: "" }); set("footerSections", a); }} className="text-sm text-[#D4AF37]">+ Add Link</button>
                </div>
              ))}
              <button onClick={() => set("footerSections", [...cfg.footerSections, { title: "", links: [] }])} className="px-4 py-2 bg-white/10 rounded-lg text-sm">+ Add Section</button>
            </div>
          )}

          {tab === "layout" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white">Section Layout — Items Per Row</h2>
              <p className="text-sm text-white/40">Control how many cards appear per row on each public section page, for desktop, tablet, and mobile viewports.</p>
              {sectionKeys.map(sk => {
                const sl = cfg.sectionLayouts?.[sk.key] || { desktop: 3, tablet: 2, mobile: 1 };
                return (
                  <div key={sk.key} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                    <h3 className="font-medium text-white">{sk.label}</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-white/40 mb-1">Desktop</label>
                        <select className="w-full px-3 py-2 rounded-lg border border-white/10 text-white text-sm" style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "white" }} value={sl.desktop} onChange={e => {
                          const v = parseInt(e.target.value);
                          setCfg(p => ({ ...p, sectionLayouts: { ...p.sectionLayouts, [sk.key]: { ...sl, desktop: v } } }));
                        }}>
                          {[3,4,5].map(n => <option key={n} value={n}>{n} columns</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/40 mb-1">Tablet</label>
                        <select className="w-full px-3 py-2 rounded-lg border border-white/10 text-white text-sm" style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "white" }} value={sl.tablet} onChange={e => {
                          const v = parseInt(e.target.value);
                          setCfg(p => ({ ...p, sectionLayouts: { ...p.sectionLayouts, [sk.key]: { ...sl, tablet: v } } }));
                        }}>
                          {[2,3].map(n => <option key={n} value={n}>{n} columns</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/40 mb-1">Mobile</label>
                        <select className="w-full px-3 py-2 rounded-lg border border-white/10 text-white text-sm" style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "white" }} value={sl.mobile} onChange={e => {
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
              <h2 className="text-lg font-bold text-white">Section Row Titles</h2>
              <p className="text-sm text-white/40">Set custom row titles for Hotels, Tours, and Cars section pages. Each row can have up to 6 cards with horizontal scrolling.</p>
              {rowSectionKeys.map(sk => {
                const titles = cfg.sectionRows?.[sk.key] || ["Row 1", "Row 2", "Row 3", "Row 4", "Row 5"];
                return (
                  <div key={sk.key} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                    <h3 className="font-medium text-white">{sk.label} Row Titles</h3>
                    {titles.map((title, i) => (
                      <div key={i}>
                        <label className="block text-xs font-medium text-white/40 mb-1">Row {i + 1}</label>
                        <input
                          className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                          value={title}
                          placeholder={`Row ${i + 1} title`}
                          onChange={e => {
                            const newTitles = [...titles];
                            newTitles[i] = e.target.value;
                            setCfg(p => ({
                              ...p,
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
              <h2 className="text-lg font-bold text-white">FAQ Management</h2>
              <p className="text-sm text-white/40">Manage frequently asked questions displayed on the FAQ page.</p>
              {cfg.faqs.map((faq, i) => (
                <div key={faq.id} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">FAQ #{i + 1}</h3>
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
                        className="text-red-400 text-sm"
                        title="Delete"
                      >&#128465;</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-1">Question</label>
                    <textarea style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "white" }}
                      id={`faq-question-${faq.id}`}
                      className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
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
                    <label className="block text-xs font-medium text-white/40 mb-1">Answer</label>
                    <textarea style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "white" }}
                      className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
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
                className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium text-white/50 hover:bg-white/20 transition-colors"
              >
                + Add FAQ
              </button>
            </div>
          )}

          {tab === "terms" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white">Terms and Conditions</h2>
              <p className="text-sm text-white/40">Manage terms and conditions displayed on the Terms page.</p>
              {cfg.terms.map((item, i) => (
                <div key={item.id} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{item.title || `Section ${i + 1}`}</h3>
                    <button
                      onClick={() => set("terms", cfg.terms.filter((_, idx) => idx !== i))}
                      className="text-red-400 text-sm"
                    >Delete</button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-1">Title</label>
                    <input
                      className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={item.title}
                      onChange={e => {
                        const a = [...cfg.terms];
                        a[i] = { ...item, title: e.target.value };
                        set("terms", a);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-1">Content</label>
                    <textarea style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "white" }}
                      className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
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
                className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium text-white/50 hover:bg-white/20 transition-colors"
              >
                + Add Section
              </button>
            </div>
          )}

          {tab === "privacy" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white">Privacy Policy</h2>
              <p className="text-sm text-white/40">Manage privacy policy sections displayed on the Privacy page.</p>
              {cfg.privacy.map((item, i) => (
                <div key={item.id} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{item.title || `Section ${i + 1}`}</h3>
                    <button
                      onClick={() => set("privacy", cfg.privacy.filter((_, idx) => idx !== i))}
                      className="text-red-400 text-sm"
                    >Delete</button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-1">Title</label>
                    <input
                      className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={item.title}
                      onChange={e => {
                        const a = [...cfg.privacy];
                        a[i] = { ...item, title: e.target.value };
                        set("privacy", a);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-1">Content</label>
                    <textarea style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "white" }}
                      className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
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
                className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium text-white/50 hover:bg-white/20 transition-colors"
              >
                + Add Section
              </button>
            </div>
          )}

                    {tab === "testimonials" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Testimonials</h2>
              <p className="text-sm text-white/40">Manage customer reviews shown on the homepage testimonial slider.</p>
              {cfg.testimonials.map((t, i) => (
                <div key={i} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Review {i + 1}</h3>
                    <button onClick={() => set("testimonials", cfg.testimonials.filter((_, idx) => idx !== i))} className="text-red-400 text-sm">Delete</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelCls}>Name</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={t.name} onChange={e => { const a = [...cfg.testimonials]; a[i] = { ...t, name: e.target.value }; set("testimonials", a); }} /></div>
                    <div><label className={labelCls}>Country</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={t.country} onChange={e => { const a = [...cfg.testimonials]; a[i] = { ...t, country: e.target.value }; set("testimonials", a); }} /></div>
                  </div>
                  <div><label className={labelCls}>Tour</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={t.tour} onChange={e => { const a = [...cfg.testimonials]; a[i] = { ...t, tour: e.target.value }; set("testimonials", a); }} /></div>
                  <div><label className={labelCls}>Text (Quote)</label><textarea className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} rows={3} value={t.text} onChange={e => { const a = [...cfg.testimonials]; a[i] = { ...t, text: e.target.value }; set("testimonials", a); }} /></div>
                  <div><label className={labelCls}>Rating (1-5)</label><input type="number" min="1" max="5" className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={t.rating} onChange={e => { const a = [...cfg.testimonials]; a[i] = { ...t, rating: parseInt(e.target.value) || 5 }; set("testimonials", a); }} /></div>
                  <div><label className={labelCls}>Photo URL (optional)</label><input type="text" placeholder="https://..." className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={t.image || ""} onChange={e => { const a = [...cfg.testimonials]; a[i] = { ...t, image: e.target.value }; set("testimonials", a); }} /></div>
                </div>
              ))}
              <button onClick={() => set("testimonials", [...cfg.testimonials, { name: "", country: "", tour: "", text: "", rating: 5, image: "" }])} className="px-4 py-2 bg-white/10 rounded-lg text-sm">+ Add Testimonial</button>
            </div>
          )}

          
          {tab === "heroText" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white">Hero Text Settings</h2>
              <p className="text-sm text-white/40">Customize hero title, subtitle, and font style for each public page.</p>
              {[
                { key: "tours", label: "Tours Page" },
                { key: "hotels", label: "Hotels Page" },
                { key: "cars", label: "Cars Page" },
                { key: "cruises", label: "Cruises Page" },
                { key: "visas", label: "Visas Page" },
                { key: "insurance", label: "Insurance Page" },
                { key: "mingalar", label: "Sky Lounge (Mingalar)" },
              ].map(({ key, label }) => {
                const ht = cfg.heroText?.[key] || { title: "", subtitle: "", titleFont: "Georgia, serif", titleSize: "3rem", subtitleSize: "1.2rem" };
                return (
                  <div key={key} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                    <h3 className="font-medium text-[#D4AF37]">{label}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Title</label>
                        <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="Hero title"
                          value={ht.title} onChange={e => setCfg(p => ({ ...p, heroText: { ...(p.heroText || {}), [key]: { ...ht, title: e.target.value } } }))} />
                      </div>
                      <div>
                        <label className={labelCls}>Subtitle</label>
                        <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="Hero subtitle"
                          value={ht.subtitle} onChange={e => setCfg(p => ({ ...p, heroText: { ...(p.heroText || {}), [key]: { ...ht, subtitle: e.target.value } } }))} />
                      </div>
                      <div>
                        <label className={labelCls}>Title Font</label>
                        <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                          value={ht.titleFont} onChange={e => setCfg(p => ({ ...p, heroText: { ...(p.heroText || {}), [key]: { ...ht, titleFont: e.target.value } } }))}>
                          <option value="Georgia, serif">Georgia</option>
                          <option value="Playfair Display, serif">Playfair Display</option>
                          <option value="Arial, sans-serif">Arial</option>
                          <option value="Helvetica, sans-serif">Helvetica</option>
                          <option value="system-ui, sans-serif">System UI</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Title Size</label>
                        <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                          value={ht.titleSize} onChange={e => setCfg(p => ({ ...p, heroText: { ...(p.heroText || {}), [key]: { ...ht, titleSize: e.target.value } } }))}>
                          <option value="2rem">2rem</option>
                          <option value="2.5rem">2.5rem</option>
                          <option value="3rem">3rem (Default)</option>
                          <option value="3.5rem">3.5rem</option>
                          <option value="4rem">4rem</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Subtitle Size</label>
                        <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                          value={ht.subtitleSize} onChange={e => setCfg(p => ({ ...p, heroText: { ...(p.heroText || {}), [key]: { ...ht, subtitleSize: e.target.value } } }))}>
                          <option value="0.9rem">0.9rem</option>
                          <option value="1rem">1rem</option>
                          <option value="1.2rem">1.2rem (Default)</option>
                          <option value="1.5rem">1.5rem</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          
          {tab === "cardDims" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white">Card &amp; Hero Image Dimensions</h2>
              <p className="text-sm text-white/40">Control card width/height and hero banner height for each section page. All values in pixels.</p>
              
              <h3 className="text-md font-semibold text-[#D4AF37] mt-4">Card Dimensions</h3>
              {[
                { key: "tours", label: "Tours" },
                { key: "hotels", label: "Hotels" },
                { key: "cars", label: "Cars" },
                { key: "cruises", label: "Cruises" },
                { key: "visas", label: "Visas" },
                { key: "insurance", label: "Insurance" },
                { key: "mingalar", label: "Sky Lounge" },
              ].map(({ key, label }) => {
                const cd = cfg.cardDimensions?.[key] || { width: 300, height: 420 };
                return (
                  <div key={key} className="border border-white/10 bg-white/5 text-white rounded-lg p-4">
                    <h4 className="font-medium mb-2">{label} Cards</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Width (px)</label>
                        <input type="number" className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                          value={cd.width} min={200} max={800} step={10}
                          onChange={e => setCfg(p => ({ ...p, cardDimensions: { ...(p.cardDimensions || {}), [key]: { ...cd, width: parseInt(e.target.value) || 300 } } }))} />
                      </div>
                      <div>
                        <label className={labelCls}>Height (px)</label>
                        <input type="number" className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                          value={cd.height} min={200} max={900} step={10}
                          onChange={e => setCfg(p => ({ ...p, cardDimensions: { ...(p.cardDimensions || {}), [key]: { ...cd, height: parseInt(e.target.value) || 420 } } }))} />
                      </div>
                    </div>
                  </div>
                );
              })}

              <h3 className="text-md font-semibold text-[#D4AF37] mt-6">Hero Banner Height</h3>
              {[
                { key: "tours", label: "Tours" },
                { key: "hotels", label: "Hotels" },
                { key: "cars", label: "Cars" },
                { key: "cruises", label: "Cruises" },
                { key: "visas", label: "Visas" },
                { key: "insurance", label: "Insurance" },
                { key: "mingalar", label: "Sky Lounge" },
                { key: "about", label: "About" },
                { key: "blog", label: "Blog" },
                { key: "contact", label: "Contact" },
                { key: "faq", label: "FAQ" },
                { key: "terms", label: "Terms" },
                { key: "privacy", label: "Privacy" },
              ].map(({ key, label }) => {
                const hd = cfg.heroDimensions?.[key] || { mobile: 300, desktop: 450 };
                return (
                  <div key={key} className="border border-white/10 bg-white/5 text-white rounded-lg p-4">
                    <h4 className="font-medium mb-2">{label} Hero</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Mobile Height (px)</label>
                        <input type="number" className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                          value={hd.mobile} min={150} max={600} step={10}
                          onChange={e => setCfg(p => ({ ...p, heroDimensions: { ...(p.heroDimensions || {}), [key]: { ...hd, mobile: parseInt(e.target.value) || 300 } } }))} />
                      </div>
                      <div>
                        <label className={labelCls}>Desktop Height (px)</label>
                        <input type="number" className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                          value={hd.desktop} min={200} max={800} step={10}
                          onChange={e => setCfg(p => ({ ...p, heroDimensions: { ...(p.heroDimensions || {}), [key]: { ...hd, desktop: parseInt(e.target.value) || 450 } } }))} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          
          {tab === "moduleToggles" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white">Module Toggles</h2>
              <p className="text-sm text-white/40">Turn entire website sections ON or OFF. When OFF, the module disappears from all public pages, navigation, and footer.</p>
              {[
                { key: "tours", label: "Tours", desc: "Tour packages, destinations, adventure trips" },
                { key: "hotels", label: "Hotels", desc: "Hotel listings and booking" },
                { key: "cars", label: "Cars", desc: "Car rental listings" },
                { key: "visas", label: "Visas", desc: "Visa services and information" },
                { key: "insurance", label: "Insurance", desc: "Travel insurance plans" },
                { key: "cruises", label: "Cruises", desc: "Cruise packages and river trips" },
                { key: "skyLounge", label: "Sky Lounge (Mingalar)", desc: "Airport lounge services" },
                { key: "blog", label: "Blog", desc: "Travel articles and news" },
              ].map(({ key, label, desc }) => {
                const active = cfg.moduleToggles?.[key] !== false;
                return (
                  <div key={key} className="border border-white/10 bg-white/5 text-white rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white text-sm">{label}</h3>
                        <p className="text-xs text-white/40 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => setCfg(p => ({ ...p, moduleToggles: { ...(p.moduleToggles || {}), [key]: !active } }))}
                        className={"relative inline-flex h-7 w-12 items-center rounded-full transition-colors " + (active ? "bg-[#27AE60]" : "bg-white/20")}
                        style={{ flexShrink: 0 }}
                      >
                        <span className={"inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform " + (active ? "translate-x-6" : "translate-x-1")} />
                      </button>
                    </div>
                    <div className="mt-2">
                      <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + (active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                        {active ? "ACTIVE" : "OFF"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "detailTabs" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white">Tour Detail Page — Tab Controls</h2>
              <p className="text-sm text-white/40">Toggle which tabs appear on the Tour detail page and set their order. Use the arrows to reorder.</p>
              {(cfg.detailPageTabs?.tours || []).map((tab: any, i: number) => (
                <div key={tab.key} className="border border-white/10 bg-white/5 text-white rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => {
                            if (i === 0) return;
                            const tabs = [...(cfg.detailPageTabs?.tours || [])];
                            [tabs[i-1], tabs[i]] = [tabs[i], tabs[i-1]];
                            setCfg((p: any) => ({ ...p, detailPageTabs: { ...p.detailPageTabs, tours: tabs } }));
                          }}
                          disabled={i === 0}
                          className="text-white/50 hover:text-white disabled:opacity-20 text-xs leading-none"
                          title="Move up"
                        >▲</button>
                        <button
                          onClick={() => {
                            const tabs = [...(cfg.detailPageTabs?.tours || [])];
                            if (i >= tabs.length - 1) return;
                            [tabs[i], tabs[i+1]] = [tabs[i+1], tabs[i]];
                            setCfg((p: any) => ({ ...p, detailPageTabs: { ...p.detailPageTabs, tours: tabs } }));
                          }}
                          disabled={i >= (cfg.detailPageTabs?.tours || []).length - 1}
                          className="text-white/50 hover:text-white disabled:opacity-20 text-xs leading-none"
                          title="Move down"
                        >▼</button>
                      </div>
                      <div>
                        <h3 className="font-medium text-white text-sm">{tab.label}</h3>
                        <p className="text-xs text-white/40">Key: {tab.key}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const tabs = (cfg.detailPageTabs?.tours || []).map((t: any, idx: number) =>
                          idx === i ? { ...t, visible: !t.visible } : t
                        );
                        setCfg((p: any) => ({ ...p, detailPageTabs: { ...p.detailPageTabs, tours: tabs } }));
                      }}
                      className={"relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0 " + (tab.visible ? "bg-[#27AE60]" : "bg-white/20")}
                    >
                      <span className={"inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform " + (tab.visible ? "translate-x-6" : "translate-x-1")} />
                    </button>
                  </div>
                  <div className="mt-2">
                    <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + (tab.visible ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                      {tab.visible ? "VISIBLE" : "HIDDEN"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "partners" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Partners</h2>
              <p className="text-sm text-white/40">Manage partner names shown on the homepage partners section.</p>
              {cfg.partners.map((p, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="Partner name" value={p} onChange={e => { const a = [...cfg.partners]; a[i] = e.target.value; set("partners", a); }} />
                  <button onClick={() => set("partners", cfg.partners.filter((_, idx) => idx !== i))} className="text-red-400 text-sm">Delete</button>
                </div>
              ))}
              <button onClick={() => set("partners", [...cfg.partners, ""])} className="px-4 py-2 bg-white/10 rounded-lg text-sm">+ Add Partner</button>
            </div>
          )}

          {tab === "meta" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Meta & SEO</h2>
              <div><label className={`labelCls labelCls`}>Site Name</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={cfg.siteName} onChange={e => set("siteName", e.target.value)} /></div>
              <ImageZone field="logoUrl" label="Site Logo" />
            </div>
          )}
        </div>

        {uploading && <div className="fixed bottom-4 right-4 bg-[#0A1628] text-white px-4 py-2 rounded-lg shadow-lg text-sm">Uploading image...</div>}
      </div>
    </main>
  );
}
