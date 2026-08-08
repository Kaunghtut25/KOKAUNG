"use client";

import React, { useEffect, useState, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";

interface HeroSlide { image: string; label: string; title: string; subtitle: string; titleFont?: string; titleSize?: string; subtitleSize?: string; labelFont?: string; labelSize?: string; }
interface ServiceIcon { label: string; icon: string; href: string; enabled: boolean; }
interface NavLink { label: string; href: string; }
interface StatsCard { icon: string; title: string; description: string; imgSrc: string; }
interface WhyCard { icon: string; title: string; description: string; image?: string; }
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
  whyChooseTitle?: string; whyChooseTagline?: string; whyChooseCardWidth?: number;
  popularDestinations: PopularDestination[];
  testimonials: Testimonial[]; partners: string[];
  ctaTitle: string; ctaDescription: string; ctaButtonLabel: string; ctaButtonHref: string; ctaImage?: string; ctaImage?: string;
  dealsBanner?: { enabled: boolean; badge: string; title: string; buttonLabel: string; buttonHref: string; countdownDays: number };
  contact: ContactInfo; socialLinks: SocialLink[]; footerSections: FooterSection[];
  socialFeed?: { enabled: boolean; instagram: string; photos: string[] };
  sectionLayouts?: Record<string, SectionLayout>;
  relatedItems?: { maxItems: number; crossSections: Record<string, { enabled: boolean; maxItems: number }> };
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
  whyChooseTitle: "Why Choose A9 Global Travel?", whyChooseTagline: "Your trusted travel partner in Myanmar since 2015", whyChooseCardWidth: 280,
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
  ctaTitle: "", ctaDescription: "", ctaButtonLabel: "Book Now", ctaButtonHref: "/book-now", ctaImage: "", ctaImage: "",
  dealsBanner: { enabled: true, badge: "⏰ LIMITED TIME OFFER", title: "30% OFF Bagan Explorer Tour", buttonLabel: "Book Now", buttonHref: "/book-now", countdownDays: 30 },
  contact: { email: "", phone: "", address: "", whatsapp: "", messenger: "", viber: "", telegram: "" },
  socialLinks: [
    { platform: "facebook", url: "https://facebook.com/a9global" },
    { platform: "instagram", url: "https://instagram.com/a9global" },
    { platform: "telegram", url: "https://t.me/a9globaltravel" },
  ], footerSections: [],
  socialFeed: { enabled: true, instagram: "https://instagram.com/a9global", photos: [] },
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

type Tab = "layout" | "rows" | "faq" | "terms" | "privacy" | "hero" | "heroImages" | "services" | "nav" | "stats" | "why" | "destinations" | "cta" | "contact" | "social" | "socialFeed" | "footer" | "meta" | "testimonials" | "partners" | "heroText" | "cardDims" | "moduleToggles" | "relatedItems" | "deals";

export default function SiteManagerPage() {
  const { t } = useI18n();
  const [cfg, setCfg] = useState(defaultCfg);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("hero");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [uploadingKey, setUploadingKey] = useState("");
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [imageUrlInput, setImageUrlInput] = useState("");
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  useEffect(() => {
    fetch(API).then(r => r.json()).then(d => {
      const social = Array.isArray(d.socialLinks) ? d.socialLinks : Object.values(d.socialLinks || {});
      setCfg({ ...defaultCfg, ...d, socialLinks: social.length ? social : defaultCfg.socialLinks });
    }).catch(() => { }).finally(() => setLoading(false));
  }, []);

  const uploadFile = async (file: File, field: string, index?: number, valueField: string = "image") => {
    const zoneKey = field + "_" + (index ?? "");
    if (!file.type.startsWith("image/")) { setUploadErrors(prev => ({ ...prev, [zoneKey]: t("admin.sm.errImageOnly") })); return; }
    setUploadingKey(zoneKey);
    setUploadErrors(prev => { const n = { ...prev }; delete n[zoneKey]; return n; });
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: "Bearer " + token }, body: fd });
      const data = await res.json();
      if (!res.ok) { setUploadErrors(prev => ({ ...prev, [zoneKey]: data.error || t("admin.sm.errUploadPaste") })); return; }
      const blob = data.uploads?.[0];
      const url = blob.url;
      if (index !== undefined) {
        const arr = [...(cfg as any)[field]];
        arr[index] = { ...arr[index], [valueField]: url };
        setCfg(p => ({ ...p, [field]: arr }));
      } else {
        setCfg(p => ({ ...p, [field]: url }));
      }
      showToast(t("admin.sm.imgUploaded"));
    } catch (err: any) {
      setUploadErrors(prev => ({ ...prev, [zoneKey]: t("admin.sm.errUploadPaste") }));
    } finally { setUploadingKey(""); }
  };

  const uploadSocialPhoto = async (file: File, index: number) => {
    const zoneKey = "socialFeed_" + index;
    if (!file.type.startsWith("image/")) { setUploadErrors(prev => ({ ...prev, [zoneKey]: t("admin.sm.errImageOnly") })); return; }
    setUploadingKey(zoneKey);
    setUploadErrors(prev => { const n = { ...prev }; delete n[zoneKey]; return n; });
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: "Bearer " + token }, body: fd });
      const data = await res.json();
      const url = data.uploads?.[0]?.url;
      if (!res.ok) { setUploadErrors(prev => ({ ...prev, [zoneKey]: data.error || t("admin.sm.errUploadPaste") })); return; }
      if (url) {
        const photos = [...(cfg.socialFeed?.photos || [])];
        photos[index] = url;
        setCfg(p => ({ ...p, socialFeed: { enabled: true, instagram: p.socialFeed?.instagram || "https://instagram.com/a9global", photos } }));
        showToast(t("admin.sm.imgUploaded"));
      }
    } catch (err: any) {
      setUploadErrors(prev => ({ ...prev, [zoneKey]: t("admin.sm.errUploadPaste") }));
    } finally { setUploadingKey(""); }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number, valueField: string = "image") => {
    const file = e.target.files?.[0]; if (!file) return;
    await uploadFile(file, field, index, valueField);
  };

  const handleDrop = (e: React.DragEvent, field: string, index?: number, valueField: string = "image") => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0]; if (!file) return;
    handleFileChange({ target: { files: [file] } } as any, field, index, valueField);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await fetch(API, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }, body: JSON.stringify({ ...cfg, id: "site-config" }) });
      if (r.ok) showToast(t("admin.sm.savedLive")); else showToast(t("admin.sm.saveFailed"), "error");
    } catch { showToast(t("admin.sm.netErr"), "error"); }
    setSaving(false);
  };

  const set = <K extends keyof SiteConfig>(k: K, v: SiteConfig[K]) => setCfg(p => ({ ...p, [k]: v }));

  // Image upload zone component
  const ImageZone = ({ field, index, label, valueField = "image" }: { field: string; index?: number; label: string; valueField?: string }) => {
    const currentVal = index !== undefined ? (cfg as any)[field]?.[index]?.[valueField] : (cfg as any)[field];
    return (
      <div className="mb-3">
        <label className="block text-sm font-medium text-white/70 mb-1">{label}</label>
        <div
          onDrop={(e) => handleDrop(e, field, index, valueField)}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center cursor-pointer hover:border-[#D4AF37] transition-colors"
          onClick={() => fileInputRefs.current[field + "_" + (index ?? "")]?.click()}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={(el) => { fileInputRefs.current[field + "_" + (index ?? "")] = el; }}
            onChange={(e) => handleFileChange(e, field, index, valueField)}
          />
          {currentVal ? (
            <Image alt={t("admin.sm.preview")} className="mx-auto mt-2 w-full h-28 object-cover rounded" src={currentVal} width={1600} height={900} sizes="100vw" />
          ) : (
            <p className="text-sm text-white/60">{t("admin.sm.dragDrop")}</p>
          )}
          {uploadingKey === field + "_" + (index ?? "") && <p className="text-xs text-[#D4AF37] mt-1">{t("admin.form.uploading")}</p>}
          {uploadErrors[field + "_" + (index ?? "")] && <p className="text-xs text-red-400 mt-1">{uploadErrors[field + "_" + (index ?? "")]}</p>}
          <p className="text-xs text-white/50 mt-1">{t("admin.sm.rec2mb")}</p>
        </div>
        <input
          type="text"
          placeholder={t("admin.sm.pasteUrl")}
          className="w-full px-3 py-2 rounded-lg border border-white/10 text-white text-sm mt-2" style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
          value={imageUrlInput || currentVal || ""}
          onChange={(e) => {
            setImageUrlInput(e.target.value);
            if (index !== undefined) {
              const arr = [...(cfg as any)[field]];
              arr[index] = { ...arr[index], [valueField]: e.target.value };
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
  { key: "hotels", label: t("admin.sm.section.hotels") },
  { key: "tours", label: t("admin.sm.section.tours") },
  { key: "cars", label: t("admin.sm.section.cars") },
  { key: "cruises", label: t("admin.sm.section.cruises") },
  { key: "visas", label: t("admin.sm.section.visas") },
  { key: "insurance", label: t("admin.sm.section.insurance") },
  { key: "skyLounge", label: t("admin.sm.section.skyLounge") },
];

const rowSectionKeys: { key: string; label: string }[] = [
  { key: "hotels", label: t("admin.sm.section.hotels") },
  { key: "tours", label: t("admin.sm.section.tours") },
  { key: "cars", label: t("admin.sm.section.cars") },
];

const tabs: { key: Tab; label: string }[] = [
  { key: "layout", label: t("admin.sm.tab.layout") },
  { key: "rows", label: t("admin.sm.tab.rows") },
  { key: "faq", label: t("admin.sm.section.faq") },
  { key: "terms", label: t("admin.sm.section.terms") },
  { key: "privacy", label: t("admin.sm.section.privacy") },
    { key: "hero", label: t("admin.sm.heroSlides") },
    { key: "heroImages", label: t("admin.sm.tab.heroImages") },
    { key: "heroText", label: t("admin.sm.tab.heroText") },
    { key: "cardDims", label: t("admin.sm.tab.cardDims") },
    { key: "moduleToggles", label: t("admin.sm.moduleToggles") },
    { key: "relatedItems", label: t("admin.sm.tab.relatedItems") }, { key: "services", label: t("admin.sm.serviceIcons") },
    { key: "nav", label: t("admin.sm.tab.nav") }, { key: "stats", label: t("admin.sm.statsCards") },
    { key: "why", label: t("admin.sm.tab.why") }, { key: "destinations", label: t("admin.sm.tab.destinations") },
    { key: "cta", label: t("admin.sm.tab.cta") }, { key: "deals", label: t("admin.sm.tab.deals") }, { key: "contact", label: t("admin.sm.tab.contact") },
    { key: "social", label: t("admin.sm.tab.social") }, { key: "socialFeed", label: t("admin.sm.tab.socialFeed") }, { key: "footer", label: t("admin.sm.tab.footer") },
    { key: "meta", label: t("admin.sm.tab.meta") },
    { key: "testimonials", label: t("admin.sm.testimonials") },
    { key: "partners", label: t("admin.sm.partners") },
  ];

  const inputCls = "w-full px-3 py-2 rounded-lg border border-white/10 text-white text-sm";
  const labelCls = "block text-sm font-medium text-white/70 mb-1";

  return (
    <main className="min-h-screen bg-[#0A1628] text-white p-4 md:p-8">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{t("admin.sm.title")}</h1>
            <p className="text-white/60 text-sm">{t("admin.sm.subtitle")}</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !!uploadingKey}
            className="px-6 py-2.5 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#B8941F] disabled:opacity-50 transition-colors"
          >
            {saving ? t("admin.common.saving") : t("admin.sm.saveAll")}
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
              <h2 className="text-lg font-bold text-white">{t("admin.sm.heroSlides")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`labelCls inputCls`}>{t("admin.sm.mobileHeight")}</label>
                </div>
                <div>
                  <label className={`labelCls inputCls`}>{t("admin.sm.desktopHeight")}</label>
                </div>
              </div>
              {cfg.heroSlides.map((slide, i) => (
                <div key={i} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{t("admin.sm.slideNum")} {i + 1}</h3>
                    <button onClick={() => set("heroSlides", cfg.heroSlides.filter((_, idx) => idx !== i))} className="text-red-400 text-sm">{t("admin.common.delete")}</button>
                  </div>
                  <ImageZone field="heroSlides" index={i} label={t("admin.sm.slideImage")} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><label className={`labelCls labelCls`}>{t("admin.sm.label")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={slide.label} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, label: e.target.value }; set("heroSlides", a); }} /></div>
                    <div><label className={labelCls}>{t("admin.sm.title")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={slide.title} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, title: e.target.value }; set("heroSlides", a); }} /></div>
                  </div>
                  <div><label className={labelCls}>{t("admin.sm.subtitle")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={slide.subtitle} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, subtitle: e.target.value }; set("heroSlides", a); }} /></div>

                  {/* Font & Size Controls */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mt-2">
                    <div>
                      <label className={labelCls}>{t("admin.sm.titleFont")}</label>
                      <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={slide.titleFont || "'Playfair Display', Georgia, serif"} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, titleFont: e.target.value }; set("heroSlides", a); }}>
                        <option value="'Playfair Display', Georgia, serif">{t("admin.sm.playfair")}</option>
                        <option value="Georgia, serif">{t("admin.sm.georgia")}</option>
                        <option value="Arial, sans-serif">{t("admin.sm.arial")}</option>
                        <option value="Montserrat, sans-serif">{t("admin.sm.montserrat")}</option>
                        <option value="inherit">{t("admin.sm.inherit")}</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>{t("admin.sm.titleSize")}</label>
                      <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={slide.titleSize || "4rem"} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, titleSize: e.target.value }; set("heroSlides", a); }}>
                        <option value="4rem">4rem</option>
                        <option value="3rem">3rem</option>
                        <option value="2.5rem">2.5rem</option>
                        <option value="2rem">2rem</option>
                        <option value="1.5rem">1.5rem</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>{t("admin.sm.subtitleSize")}</label>
                      <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={slide.subtitleSize || "1.2rem"} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, subtitleSize: e.target.value }; set("heroSlides", a); }}>
                        <option value="1.5rem">1.5rem</option>
                        <option value="1.2rem">1.2rem</option>
                        <option value="1rem">1rem</option>
                        <option value="0.875rem">0.875rem</option>
                        <option value="0.75rem">0.75rem</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>{t("admin.sm.labelFont")}</label>
                      <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={slide.labelFont || "inherit"} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, labelFont: e.target.value }; set("heroSlides", a); }}>
                        <option value="inherit">{t("admin.sm.inherit")}</option>
                        <option value="Georgia, serif">{t("admin.sm.georgia")}</option>
                        <option value="'Playfair Display', Georgia, serif">{t("admin.sm.playfair")}</option>
                        <option value="Arial, sans-serif">{t("admin.sm.arial")}</option>
                        <option value="Montserrat, sans-serif">{t("admin.sm.montserrat")}</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div>
                      <label className={labelCls}>{t("admin.sm.labelSize")}</label>
                      <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={slide.labelSize || "0.75rem"} onChange={e => { const a = [...cfg.heroSlides]; a[i] = { ...slide, labelSize: e.target.value }; set("heroSlides", a); }}>
                        <option value="1rem">1rem</option>
                        <option value="0.875rem">0.875rem</option>
                        <option value="0.75rem">0.75rem</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => set("heroSlides", [...cfg.heroSlides, { image: "", label: "", title: "", subtitle: "", titleFont: "'Playfair Display', Georgia, serif", titleSize: "4rem", subtitleSize: "1.2rem", labelFont: "inherit", labelSize: "0.75rem" }])} className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium text-white/50 hover:bg-white/20">{t("admin.sm.addSlide")}</button>

            </div>
          )}

          {tab === "heroImages" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.heroImages")}</h2>
              <p className="text-sm text-white/60">{t("admin.sm.heroImgHint")}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "about", label: "About Page" },
                  { key: "mingalar", label: t("admin.sm.section.skyLoungeMingalar") },
                  { key: "blog", label: t("admin.sm.section.blog") },
                  { key: "contact", label: t("admin.sm.section.contact") },
                  { key: "faq", label: t("admin.sm.section.faq") },
                  { key: "terms", label: "Terms & Conditions" },
                  { key: "privacy", label: t("admin.sm.privacy") },
                  { key: "bookNow", label: t("common.bookNow") },
                  { key: "flights", label: t("admin.sm.section.flights") },
                  { key: "cruises", label: t("admin.sm.section.cruises") },
                  { key: "cars", label: t("admin.sm.section.cars") },
                  { key: "hotels", label: t("admin.sm.section.hotels") },
                  { key: "tours", label: t("admin.sm.section.tours") },
                  { key: "insurance", label: t("admin.sm.section.insurance") },
                  { key: "visas", label: t("admin.sm.section.visas") },
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
                          const zoneKey = "heroImages_" + key;
                          setUploadingKey(zoneKey);
                          setUploadErrors(prev => { const n = { ...prev }; delete n[zoneKey]; return n; });
                          try {
                            const fd = new FormData();
                            fd.append('file', file);
                            const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: "Bearer " + token }, body: fd });
                            const data = await res.json();
                            if (!res.ok) { setUploadErrors(prev => ({ ...prev, [zoneKey]: data.error || t("admin.sm.errUploadFail") })); return; }
                            const blob = data.uploads?.[0];
                            setCfg(p => ({ ...p, heroImages: { ...(p.heroImages || {}), [key]: blob.url } }));
                            showToast(t("admin.sm.imgUploaded"));
                          } catch { setUploadErrors(prev => ({ ...prev, [zoneKey]: t("admin.sm.errUploadFail") })); }
                          setUploadingKey("");
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
                            const zoneKey = "heroImages_" + key;
                            setUploadingKey(zoneKey);
                            setUploadErrors(prev => { const n = { ...prev }; delete n[zoneKey]; return n; });
                            try {
                              const fd = new FormData();
                              fd.append('file', file);
                              const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: "Bearer " + token }, body: fd });
                              const data = await res.json();
                              if (!res.ok) { setUploadErrors(prev => ({ ...prev, [zoneKey]: data.error || t("admin.sm.errUploadFail") })); return; }
                              const blob = data.uploads?.[0];
                              setCfg(p => ({ ...p, heroImages: { ...(p.heroImages || {}), [key]: blob.url } }));
                              showToast(t("admin.sm.imgUploaded"));
                            } catch { setUploadErrors(prev => ({ ...prev, [zoneKey]: t("admin.sm.errUploadFail") })); }
                            setUploadingKey("");
                          }}
                        />
                        {(cfg.heroImages && cfg.heroImages[key]) ? (
                          <Image alt={t("admin.sm.preview")} className="mx-auto mt-2 w-full h-28 object-cover rounded" src={cfg.heroImages[key]} width={1600} height={900} sizes="100vw" />
                        ) : (
                          <p className="text-sm text-white/60">{t("admin.sm.clickUpload")}</p>
                        )}
                        {uploadingKey === "heroImages_" + key && <p className="text-xs text-[#D4AF37] mt-1">{t("admin.form.uploading")}</p>}
                        {uploadErrors["heroImages_" + key] && <p className="text-xs text-red-400 mt-1">{uploadErrors["heroImages_" + key]}</p>}
                        <p className="text-xs text-white/50 mt-1">1200x630px JPEG max 2MB</p>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder={t("admin.sm.pasteUrlShort")}
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
                      <Image alt={`${label} preview`} className="w-full h-32 object-cover rounded-lg" onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }} src={cfg.heroImages[key]} width={1600} height={900} sizes="100vw" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "services" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.serviceIcons")}</h2>
              {cfg.serviceIcons.map((s, i) => (
                <div key={i} className="border border-white/10 bg-white/5 text-white rounded-lg p-3 grid grid-cols-2 lg:grid-cols-4 gap-3 items-center">
                  <input className={`inputCls inputCls`} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder={t("admin.sm.iconEmoji")} value={s.icon} onChange={e => { const a = [...cfg.serviceIcons]; a[i] = { ...s, icon: e.target.value }; set("serviceIcons", a); }} />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={s.enabled} onChange={e => { const a = [...cfg.serviceIcons]; a[i] = { ...s, enabled: e.target.checked }; set("serviceIcons", a); }} />
                    <button onClick={() => set("serviceIcons", cfg.serviceIcons.filter((_, idx) => idx !== i))} className="text-red-400 text-sm">{t("admin.common.delete")}</button>
                  </div>
                </div>
              ))}
              <button onClick={() => set("serviceIcons", [...cfg.serviceIcons, { label: "", icon: "", href: "/", enabled: true }])} className="px-4 py-2 bg-white/10 rounded-lg text-sm">{t("admin.sm.addGeneric")}</button>
            </div>
          )}

          {tab === "nav" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.navLinks")}</h2>
              {cfg.navLinks.map((n, i) => (
                <div key={i} className="flex flex-col lg:flex-row lg:items-center gap-3">
                  <input className={`inputCls inputCls`} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder={t("admin.sm.label")} value={n.label} onChange={e => { const a = [...cfg.navLinks]; a[i] = { ...n, label: e.target.value }; set("navLinks", a); }} />
                  <button onClick={() => set("navLinks", cfg.navLinks.filter((_, idx) => idx !== i))} className="text-red-400 text-sm">{t("admin.common.delete")}</button>
                </div>
              ))}
              <button onClick={() => set("navLinks", [...cfg.navLinks, { label: "", href: "/" }])} className="px-4 py-2 bg-white/10 rounded-lg text-sm">{t("admin.sm.addGeneric")}</button>
            </div>
          )}

          {tab === "stats" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.statsCards")}</h2>
              {cfg.statsCards.map((s, i) => (
                <div key={i} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                  <div className="flex justify-between"><h3 className="font-medium">{t("admin.sm.cardNum")} {i + 1}</h3><button onClick={() => set("statsCards", cfg.statsCards.filter((_, idx) => idx !== i))} className="text-red-400 text-sm">{t("admin.common.delete")}</button></div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div><label className={labelCls}>{t("admin.sm.icon")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="⭐" value={s.icon || ""} onChange={e => { const a = [...cfg.statsCards]; a[i] = { ...s, icon: e.target.value }; set("statsCards", a); }} /></div>
                    <div><label className={labelCls}>Title (e.g. 5,000+ Happy Travelers)</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="5,000+ Happy Travelers" value={s.title || ""} onChange={e => { const a = [...cfg.statsCards]; a[i] = { ...s, title: e.target.value }; set("statsCards", a); }} /></div>
                    <div><label className={labelCls}>{t("admin.sm.description")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="Trusted by thousands of customers" value={s.description || ""} onChange={e => { const a = [...cfg.statsCards]; a[i] = { ...s, description: e.target.value }; set("statsCards", a); }} /></div>
                  </div>
                  <ImageZone field="statsCards" index={i} label={t("admin.sm.cardImage")} valueField="imgSrc" />
                </div>
              ))}
              <button onClick={() => set("statsCards", [...cfg.statsCards, { icon: "", title: "", description: "", imgSrc: "" }])} className="px-4 py-2 bg-white/10 rounded-lg text-sm">{t("admin.sm.addGeneric")}</button>
            </div>
          )}

          {tab === "why" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.whyChooseUs")}</h2>
              <p className="text-sm text-white/60">{t("admin.sm.whyHint")}</p>
              <div className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-[#D4AF37] mb-3">{t("admin.sm.sectionHeader")}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div><label className={labelCls}>{t("admin.sm.sectionTitle")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="Why Choose A9 Global Travel?" value={cfg.whyChooseTitle || ""} onChange={e => set("whyChooseTitle", e.target.value)} /></div>
                  <div className="col-span-2"><label className={labelCls}>{t("admin.sm.tagline")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="Your trusted travel partner in Myanmar since 2015" value={cfg.whyChooseTagline || ""} onChange={e => set("whyChooseTagline", e.target.value)} /></div>
                </div>
                <div><label className={labelCls}>{t("admin.sm.cardWidth")}</label><input type="number" min={200} max={600} className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="280" value={cfg.whyChooseCardWidth || 280} onChange={e => set("whyChooseCardWidth", parseInt(e.target.value) || 280)} /></div>
              </div>
              {cfg.whyChooseCards.map((w, i) => (
                <div key={i} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                  <div className="flex justify-between"><h3 className="font-medium">{t("admin.sm.cardNum")} {i + 1}</h3><button onClick={() => set("whyChooseCards", cfg.whyChooseCards.filter((_, idx) => idx !== i))} className="text-red-400 text-sm">{t("admin.common.delete")}</button></div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div><label className={labelCls}>{t("admin.sm.iconEmoji")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="🤝" value={w.icon || ""} onChange={e => { const a = [...cfg.whyChooseCards]; a[i] = { ...w, icon: e.target.value }; set("whyChooseCards", a); }} /></div>
                    <div className="col-span-2"><label className={labelCls}>{t("admin.sm.title")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="Card title" value={w.title || ""} onChange={e => { const a = [...cfg.whyChooseCards]; a[i] = { ...w, title: e.target.value }; set("whyChooseCards", a); }} /></div>
                  </div>
                  <div><label className={labelCls}>{t("admin.sm.description")}</label><textarea className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} rows={2} placeholder="Card description" value={w.description || ""} onChange={e => { const a = [...cfg.whyChooseCards]; a[i] = { ...w, description: e.target.value }; set("whyChooseCards", a); }} /></div>
                  <ImageZone field="whyChooseCards" index={i} label={t("admin.sm.cardImageOpt")} />
                </div>
              ))}
              <button onClick={() => set("whyChooseCards", [...cfg.whyChooseCards, { icon: "", title: "", description: "", image: "" }])} className="px-4 py-2 bg-white/10 rounded-lg text-sm">{t("admin.sm.addGeneric")}</button>
            </div>
          )}

          {tab === "destinations" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.popularDest")}</h2>
              {cfg.popularDestinations.map((d, i) => (
                <div key={i} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                  <div className="flex justify-between"><h3 className="font-medium">{d.city || `${t("admin.sm.destNum")} ${i + 1}`}</h3><button onClick={() => set("popularDestinations", cfg.popularDestinations.filter((_, idx) => idx !== i))} className="text-red-400 text-sm">{t("admin.common.delete")}</button></div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <input className={`inputCls inputCls`} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder={t("admin.sm.city")} value={d.city} onChange={e => { const a = [...cfg.popularDestinations]; a[i] = { ...d, city: e.target.value }; set("popularDestinations", a); }} />
                  </div>
                  
              <div className="mt-4 border-t border-white/10 pt-4">
                <h3 className="text-sm font-semibold text-[#D4AF37] mb-3">{t("admin.sm.sectionHeaderText")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div><label className={labelCls}>{t("admin.sm.title")}</label>
                    <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={(cfg.destinationsText?.title) || "Explore The World"}
                      onChange={e => setCfg(p => ({ ...p, destinationsText: { ...(p.destinationsText || {}), title: e.target.value } }))} /></div>
                  <div><label className={labelCls}>{t("admin.sm.subtitle")}</label>
                    <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={(cfg.destinationsText?.subtitle) || "Popular Destinations"}
                      onChange={e => setCfg(p => ({ ...p, destinationsText: { ...(p.destinationsText || {}), subtitle: e.target.value } }))} /></div>
                  <div><label className={labelCls}>{t("admin.sm.titleFont")}</label>
                    <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={(cfg.destinationsText?.titleFont) || "'Playfair Display', Georgia, serif"}
                      onChange={e => setCfg(p => ({ ...p, destinationsText: { ...(p.destinationsText || {}), titleFont: e.target.value } }))}>
                      <option value="Georgia, serif">{t("admin.sm.georgia")}</option>
                      <option value="'Playfair Display', Georgia, serif">{t("admin.sm.playfair")}</option>
                      <option value="Arial, sans-serif">{t("admin.sm.arial")}</option>
                      <option value="system-ui, sans-serif">{t("admin.sm.systemUI")}</option>
                    </select></div>
                  <div><label className={labelCls}>{t("admin.sm.titleSize")}</label>
                    <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={(cfg.destinationsText?.titleSize) || "2.5rem"}
                      onChange={e => setCfg(p => ({ ...p, destinationsText: { ...(p.destinationsText || {}), titleSize: e.target.value } }))}>
                      <option value="1.5rem">1.5rem</option><option value="2rem">2rem</option><option value="2.5rem">2.5rem</option><option value="3rem">3rem</option></select></div>
                  <div><label className={labelCls}>{t("admin.sm.titleColor")}</label>
                    <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} type="color"
                      value={(cfg.destinationsText?.titleColor) || "#0A1628"}
                      onChange={e => setCfg(p => ({ ...p, destinationsText: { ...(p.destinationsText || {}), titleColor: e.target.value } }))} /></div>
                </div>
                <h4 className="text-xs font-semibold text-white/50 mb-2">{t("admin.sm.cardTitleStyle")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className={labelCls}>{t("admin.sm.font")}</label>
                    <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={(cfg.destinationsText?.cardTitleFont) || "'Playfair Display', Georgia, serif"}
                      onChange={e => setCfg(p => ({ ...p, destinationsText: { ...(p.destinationsText || {}), cardTitleFont: e.target.value } }))}>
                      <option value="Georgia, serif">{t("admin.sm.georgia")}</option>
                      <option value="'Playfair Display', Georgia, serif">{t("admin.sm.playfair")}</option>
                      <option value="Arial, sans-serif">{t("admin.sm.arial")}</option>
                      <option value="system-ui, sans-serif">{t("admin.sm.systemUI")}</option>
                    </select></div>
                  <div><label className={labelCls}>{t("admin.sm.size")}</label>
                    <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                      value={(cfg.destinationsText?.cardTitleSize) || "1rem"}
                      onChange={e => setCfg(p => ({ ...p, destinationsText: { ...(p.destinationsText || {}), cardTitleSize: e.target.value } }))}>
                      <option value="0.875rem">0.875rem</option><option value="1rem">1rem</option><option value="1.125rem">1.125rem</option><option value="1.25rem">1.25rem</option></select></div>
                  <div><label className={labelCls}>{t("admin.sm.color")}</label>
                    <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} type="color"
                      value={(cfg.destinationsText?.cardTitleColor) || "#0A1628"}
                      onChange={e => setCfg(p => ({ ...p, destinationsText: { ...(p.destinationsText || {}), cardTitleColor: e.target.value } }))} /></div>
                </div>
              </div>
            <ImageZone field="popularDestinations" index={i} label={t("admin.sm.destImage")} />
                </div>
              ))}
              <button onClick={() => set("popularDestinations", [...cfg.popularDestinations, { city: "", country: "", image: "", minPrice: "" }])} className="px-4 py-2 bg-white/10 rounded-lg text-sm">{t("admin.sm.addGeneric")}</button>
            </div>
          )}

          {tab === "deals" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.dealsBanner")}</h2>
              <p className="text-sm text-white/60">{t("admin.sm.dealsHint")}</p>
              <div><label className={labelCls}>{t("admin.sm.showBanner")}</label><label className="flex items-center gap-2 text-sm text-white/70"><input type="checkbox" checked={!!(cfg.dealsBanner && cfg.dealsBanner.enabled)} onChange={e => set("dealsBanner", { ...(cfg.dealsBanner || { enabled: true, badge: "", title: "", buttonLabel: "Book Now", buttonHref: "/book-now", countdownDays: 30 }), enabled: e.target.checked })} /> {t("admin.sm.enabled")}</label></div>
              <div><label className={labelCls}>{t("admin.sm.badgeText")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={(cfg.dealsBanner && cfg.dealsBanner.badge) || ""} onChange={e => set("dealsBanner", { ...(cfg.dealsBanner || {}), badge: e.target.value })} /></div>
              <div><label className={labelCls}>{t("admin.sm.title")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder="30% OFF Bagan Explorer Tour" value={(cfg.dealsBanner && cfg.dealsBanner.title) || ""} onChange={e => set("dealsBanner", { ...(cfg.dealsBanner || {}), title: e.target.value })} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={labelCls}>{t("admin.sm.buttonLabel")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={(cfg.dealsBanner && cfg.dealsBanner.buttonLabel) || ""} onChange={e => set("dealsBanner", { ...(cfg.dealsBanner || {}), buttonLabel: e.target.value })} /></div>
                <div><label className={labelCls}>{t("admin.sm.buttonLink")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={(cfg.dealsBanner && cfg.dealsBanner.buttonHref) || ""} onChange={e => set("dealsBanner", { ...(cfg.dealsBanner || {}), buttonHref: e.target.value })} /></div>
              </div>
              <div><label className={labelCls}>{t("admin.sm.countdownDays")}</label><input className={inputCls} type="number" min={1} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={(cfg.dealsBanner && cfg.dealsBanner.countdownDays) || 30} onChange={e => set("dealsBanner", { ...(cfg.dealsBanner || {}), countdownDays: parseInt(e.target.value) || 30 })} /></div>
            </div>
          )}

          {tab === "cta" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.ctaSection")}</h2>
              <p className="text-sm text-white/60">{t("admin.sm.ctaHint")}</p>
              <div><label className={labelCls}>{t("admin.sm.title")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={cfg.ctaTitle} onChange={e => set("ctaTitle", e.target.value)} /></div>
              <div><label className={labelCls}>{t("admin.sm.description")}</label><textarea className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} rows={2} value={cfg.ctaDescription} onChange={e => set("ctaDescription", e.target.value)} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={labelCls}>{t("admin.sm.buttonLabel")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={cfg.ctaButtonLabel} onChange={e => set("ctaButtonLabel", e.target.value)} /></div>
                <div><label className={labelCls}>{t("admin.sm.buttonLink")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={cfg.ctaButtonHref} onChange={e => set("ctaButtonHref", e.target.value)} /></div>
              </div>
              <ImageZone field="ctaImage" label={t("admin.sm.bgImage")} />
            </div>
          )}

          {tab === "contact" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.contactInfo")}</h2>
              <p className="text-sm text-white/60">{t("admin.sm.contactHint")}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={`labelCls labelCls`}>{t("admin.sm.phone")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={cfg.contact.phone} onChange={e => set("contact", { ...cfg.contact, phone: e.target.value })} /></div>
                <div><label className={labelCls}>{t("admin.sm.email")}</label><input className={inputCls} type="email" style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={cfg.contact.email || ""} onChange={e => set("contact", { ...cfg.contact, email: e.target.value })} /></div>
              </div>
              <div><label className={labelCls}>{t("admin.sm.address")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={cfg.contact.address} onChange={e => set("contact", { ...cfg.contact, address: e.target.value })} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={`labelCls labelCls`}>{t("admin.sm.whatsapp")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={cfg.contact.whatsapp} onChange={e => set("contact", { ...cfg.contact, whatsapp: e.target.value })} /></div>
              </div>
              
              <div className="mt-6 border-t border-white/10 pt-4">
                <h3 className="text-sm font-semibold text-[#D4AF37] mb-3">{t("admin.sm.deptPhones")}</h3>
<p className="text-xs text-white/60 mb-3">{t("admin.sm.deptHint")}</p>
<div className="space-y-2 mb-3">
{(cfg.departmentPhones && typeof cfg.departmentPhones === "object"
  ? Object.entries(cfg.departmentPhones).filter(([k]: [string, any]) => k !== "__proto__" && typeof k === "string")
  : []).map(([dept, phone]: [string, any]) => (
<div key={dept} className="flex items-center gap-2">
<input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white", width: "30%" }} placeholder={t("admin.sm.department")}
  value={dept}
  onChange={e => {
    const newName = e.target.value;
    const phones = { ...(cfg.departmentPhones || {}) };
    const oldVal = phones[dept];
    delete phones[dept];
    if (newName) phones[newName] = oldVal;
    setCfg((p: any) => ({ ...p, departmentPhones: phones }));
  }} />
<input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white", flex: 1 }} placeholder={t("admin.sm.phone")}
  value={typeof phone === "string" ? phone : ""}
  onChange={e => setCfg((p: any) => ({ ...p, departmentPhones: { ...(p.departmentPhones || {}), [dept]: e.target.value } }))} />
<button onClick={() => {
  const phones = { ...(cfg.departmentPhones || {}) };
  delete phones[dept];
  setCfg((p: any) => ({ ...p, departmentPhones: phones }));
}} className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10" title={t("admin.sm.remove")}>&times;</button>
</div>
))}
</div>
<button onClick={() => {
  const name = prompt(t("admin.sm.deptPrompt"));
  if (name && name.trim()) {
    setCfg((p: any) => ({ ...p, departmentPhones: { ...(p.departmentPhones || {}), [name.trim()]: "" } }));
  }
}} className="text-xs text-[#D4AF37] hover:text-[#C19B2F] border border-[#D4AF37]/30 rounded px-3 py-1.5 hover:bg-[#D4AF37]/10 transition-colors">{t("admin.sm.addDeptPhone")}</button>
            </div>
            <ImageZone field="logoUrl" label={t("admin.sm.siteLogo")} />
            </div>
          )}

          {tab === "social" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.socialLinks")}</h2>
              <p className="text-sm text-white/60">{t("admin.sm.socialHint")}</p>
              {cfg.socialLinks.map((s, i) => (
                <div key={i} className="border border-white/10 bg-white/5 text-white rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white", width: "30%" }} placeholder={t("admin.sm.platform")} value={s.platform || ""} onChange={e => { const a = [...cfg.socialLinks]; a[i] = { ...s, platform: e.target.value }; set("socialLinks", a); }} />
                    <button onClick={() => set("socialLinks", cfg.socialLinks.filter((_, idx) => idx !== i))} className="text-red-400 text-sm ml-auto">{t("admin.common.delete")}</button>
                  </div>
                  <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder={t("admin.sm.url")} value={s.url || ""} onChange={e => { const a = [...cfg.socialLinks]; a[i] = { ...s, url: e.target.value }; set("socialLinks", a); }} />
                </div>
              ))}
              <button onClick={() => set("socialLinks", [...cfg.socialLinks, { platform: "", url: "" }])} className="px-4 py-2 bg-white/10 rounded-lg text-sm">{t("admin.sm.addGeneric")}</button>
            </div>
          )}

          {tab === "socialFeed" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.socialFeed")}</h2>
              <p className="text-white/60 text-sm">{t("admin.sm.feedHint")}</p>

              {/* Enable toggle */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
                <span className="text-sm text-white/70">{t("admin.sm.showHomepage")}</span>
                <button
                  type="button"
                  onClick={() => setCfg(p => ({ ...p, socialFeed: { enabled: !(p.socialFeed?.enabled ?? true), instagram: p.socialFeed?.instagram || "https://instagram.com/a9global", photos: p.socialFeed?.photos || [] } }))}
                  className={"relative w-12 h-6 rounded-full transition-colors " + ((cfg.socialFeed?.enabled ?? true) ? "bg-[#D4AF37]" : "bg-white/20")}
                  aria-label="Toggle social feed"
                >
                  <span className={"absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all " + ((cfg.socialFeed?.enabled ?? true) ? "left-6" : "left-0.5")} />
                </button>
              </div>

              {/* Instagram URL */}
              <div>
                <label className={labelCls}>{t("admin.sm.instagramUrl")}</label>
                <input
                  className={inputCls}
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                  placeholder="https://instagram.com/a9global"
                  value={cfg.socialFeed?.instagram || ""}
                  onChange={e => setCfg(p => ({ ...p, socialFeed: { enabled: p.socialFeed?.enabled ?? true, instagram: e.target.value, photos: p.socialFeed?.photos || [] } }))}
                />
                <p className="text-xs text-white/50 mt-1">{t("admin.sm.urlHandle")}</p>
              </div>

              {/* 6 photo slots */}
              <div>
                <label className={labelCls}>{t("admin.sm.photos")}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[0, 1, 2, 3, 4, 5].map(i => {
                    const photo = (cfg.socialFeed?.photos || [])[i] || "";
                    return (
                      <div key={i} className="border border-white/10 rounded-lg p-2 bg-white/5">
                        <div
                          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) uploadSocialPhoto(f, i); }}
                          onDragOver={e => e.preventDefault()}
                          onClick={() => fileInputRefs.current['socialFeed_' + i]?.click()}
                          className="border-2 border-dashed border-white/20 rounded-md p-2 text-center cursor-pointer hover:border-[#D4AF37] transition-colors"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={el => { fileInputRefs.current['socialFeed_' + i] = el; }}
                            onChange={e => { const f = e.target.files?.[0]; if (f) uploadSocialPhoto(f, i); }}
                          />
                          {photo ? (
                            <Image alt={t("admin.sm.photo") + " " + (i + 1)} className="w-full h-20 object-cover rounded" src={photo} width={1600} height={900} sizes="100vw" />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-20 text-white/50 text-xs">
                              <span className="text-xl mb-1">📷</span>
                              <span>{t("admin.sm.photo")} {i + 1}</span>
                              <span className="text-white/20">{t("admin.sm.dragClickUrl")}</span>
                            </div>
                          )}
                          {uploadingKey === "socialFeed_" + i && <p className="text-[10px] text-[#D4AF37] mt-1">{t("admin.form.uploading")}</p>}
                          {uploadErrors["socialFeed_" + i] && <p className="text-[10px] text-red-400 mt-1">{uploadErrors["socialFeed_" + i]}</p>}
                        </div>
                        <input
                          type="text"
                          placeholder={t("admin.sm.pasteUrlShort")}
                          className="w-full px-2 py-1.5 rounded border border-white/10 text-white text-xs mt-1.5"
                          style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                          value={photo}
                          onChange={e => {
                            const photos = [...(cfg.socialFeed?.photos || [])];
                            photos[i] = e.target.value;
                            setCfg(p => ({ ...p, socialFeed: { enabled: p.socialFeed?.enabled ?? true, instagram: p.socialFeed?.instagram || "", photos } }));
                          }}
                        />
                        {photo && (
                          <button onClick={() => {
                            const photos = [...(cfg.socialFeed?.photos || [])];
                            photos[i] = "";
                            setCfg(p => ({ ...p, socialFeed: { enabled: p.socialFeed?.enabled ?? true, instagram: p.socialFeed?.instagram || "", photos } }));
                          }} className="text-[10px] text-red-400 mt-1 hover:text-red-300">{t("admin.sm.remove")}</button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === "footer" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.footerSettings")}</h2>
              <div><label className={`labelCls labelCls`}>{t("admin.sm.copyrightText")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={cfg.footerCopyright} onChange={e => set("footerCopyright", e.target.value)} /></div>
              {cfg.footerSections.map((sec, i) => (
                <div key={i} className="border border-white/10 bg-white/5 text-white rounded-lg p-3 space-y-2">
                  <div className="flex justify-between">
                    <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder={t("admin.sm.sectionTitle")} value={sec.title} onChange={e => { const a = [...cfg.footerSections]; a[i] = { ...sec, title: e.target.value }; set("footerSections", a); }} />
                    <button onClick={() => set("footerSections", cfg.footerSections.filter((_, idx) => idx !== i))} className="text-red-400 text-sm ml-2">{t("admin.common.delete")}</button>
                  </div>
                  {sec.links.map((link, j) => (
                    <div key={j} className="flex flex-col lg:flex-row gap-2">
                      <input className={`inputCls inputCls`} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder={t("admin.sm.label")} value={link.label} onChange={e => { const a = [...cfg.footerSections]; a[i].links[j] = { ...link, label: e.target.value }; set("footerSections", [...a]); }} />
                      <button onClick={() => { const a = [...cfg.footerSections]; a[i].links = a[i].links.filter((_, idx) => idx !== j); set("footerSections", a); }} className="text-red-400 text-sm">X</button>
                    </div>
                  ))}
                  <button onClick={() => { const a = [...cfg.footerSections]; a[i].links.push({ label: "", href: "" }); set("footerSections", a); }} className="text-sm text-[#D4AF37]">{t("admin.sm.addLink")}</button>
                </div>
              ))}
              <button onClick={() => set("footerSections", [...cfg.footerSections, { title: "", links: [] }])} className="px-4 py-2 bg-white/10 rounded-lg text-sm">{t("admin.sm.addSection")}</button>
            </div>
          )}

          {tab === "layout" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.sectionLayout")}</h2>
              <p className="text-sm text-white/60">{t("admin.sm.layoutHint")}</p>
              {sectionKeys.map(sk => {
                const sl = cfg.sectionLayouts?.[sk.key] || { desktop: 3, tablet: 2, mobile: 1 };
                return (
                  <div key={sk.key} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                    <h3 className="font-medium text-white">{sk.label}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-1">{t("admin.sm.desktop")}</label>
                        <select className="w-full px-3 py-2 rounded-lg border border-white/10 text-white text-sm" style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "white" }} value={sl.desktop} onChange={e => {
                          const v = parseInt(e.target.value);
                          setCfg(p => ({ ...p, sectionLayouts: { ...p.sectionLayouts, [sk.key]: { ...sl, desktop: v } } }));
                        }}>
                          {[3,4,5].map(n => <option key={n} value={n}>{n} columns</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-1">{t("admin.sm.tablet")}</label>
                        <select className="w-full px-3 py-2 rounded-lg border border-white/10 text-white text-sm" style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "white" }} value={sl.tablet} onChange={e => {
                          const v = parseInt(e.target.value);
                          setCfg(p => ({ ...p, sectionLayouts: { ...p.sectionLayouts, [sk.key]: { ...sl, tablet: v } } }));
                        }}>
                          {[2,3].map(n => <option key={n} value={n}>{n} columns</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-1">{t("admin.sm.mobile")}</label>
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
              <h3 className="text-md font-semibold text-[#D4AF37] mt-6 mb-3">{t("admin.sm.cardsPerRow")}</h3>
              {sectionKeys.map(sk => {
                const val = cfg.sectionLayouts?.[sk.key]?.cardsPerRow || 6;
                return (
                  <div key={"cpr-"+sk.key} className="flex items-center gap-3 mb-2">
                    <span className="text-white/70 text-sm w-24 capitalize">{sk.label}</span>
                    <select
                      value={val}
                      onChange={e => setCfg((p: any) => ({
                        ...p,
                        sectionLayouts: {
                          ...p.sectionLayouts,
                          [sk.key]: { ...(p.sectionLayouts?.[sk.key] || {}), cardsPerRow: parseInt(e.target.value) }
                        }
                      }))}
                      className="bg-white/10 border border-white/20 text-white rounded px-2 py-1 text-sm"
                    >
                      {[2,3,4,5,6].map(n => <option key={n} value={n}>{n} {t("admin.sm.perRow")}</option>)}
                    </select>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "rows" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.sectionRowTitles")}</h2>
              <p className="text-sm text-white/60">{t("admin.sm.rowTitlesHint")}</p>
              {rowSectionKeys.map(sk => {
                const titles = cfg.sectionRows?.[sk.key] || ["Row 1", "Row 2", "Row 3", "Row 4", "Row 5"];
                return (
                  <div key={sk.key} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                    <h3 className="font-medium text-white">{sk.label} {t("admin.sm.rowTitles")}</h3>
                    {titles.map((title, i) => (
                      <div key={i}>
                        <label className="block text-xs font-medium text-white/60 mb-1">{t("admin.sm.rowNum")} {i + 1}</label>
                        <input
                          className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                          value={title}
                          placeholder={`${t("admin.sm.rowTitlePh")} ${i + 1}`}
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
              <h2 className="text-lg font-bold text-white">{t("admin.sm.faqMgmt")}</h2>
              <p className="text-sm text-white/60">{t("admin.sm.faqHint")}</p>
              {cfg.faqs.map((faq, i) => (
                <div key={faq.id} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{t("admin.sm.faqNum")}{i + 1}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const el = document.getElementById(`faq-question-${faq.id}`) as HTMLTextAreaElement;
                          if (el) el.focus();
                        }}
                        className="text-[#D4AF37] hover:text-[#B8941F] text-sm"
                        title={t("admin.common.edit")}
                      >&#9998;</button>
                      <button
                        onClick={() => set("faqs", cfg.faqs.filter((_, idx) => idx !== i))}
                        className="text-red-400 text-sm"
                        title={t("admin.common.delete")}
                      >&#128465;</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">{t("admin.sm.question")}</label>
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
                    <label className="block text-xs font-medium text-white/60 mb-1">{t("admin.sm.answer")}</label>
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
                {t("admin.sm.addFaq")}
              </button>
            </div>
          )}

          {tab === "terms" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.terms")}</h2>
              <p className="text-sm text-white/60">{t("admin.sm.termsHint")}</p>
              {cfg.terms.map((item, i) => (
                <div key={item.id} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{item.title || `${t("admin.sm.sectionNum")} ${i + 1}`}</h3>
                    <button
                      onClick={() => set("terms", cfg.terms.filter((_, idx) => idx !== i))}
                      className="text-red-400 text-sm"
                    >{t("admin.common.delete")}</button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">{t("admin.sm.title")}</label>
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
                    <label className="block text-xs font-medium text-white/60 mb-1">{t("admin.sm.content")}</label>
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
                {t("admin.sm.addSection")}
              </button>
            </div>
          )}

          {tab === "privacy" && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.privacy")}</h2>
              <p className="text-sm text-white/60">{t("admin.sm.privacyHint")}</p>
              {cfg.privacy.map((item, i) => (
                <div key={item.id} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{item.title || `${t("admin.sm.sectionNum")} ${i + 1}`}</h3>
                    <button
                      onClick={() => set("privacy", cfg.privacy.filter((_, idx) => idx !== i))}
                      className="text-red-400 text-sm"
                    >{t("admin.common.delete")}</button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">{t("admin.sm.title")}</label>
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
                    <label className="block text-xs font-medium text-white/60 mb-1">{t("admin.sm.content")}</label>
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
                {t("admin.sm.addSection")}
              </button>
            </div>
          )}

                    {tab === "testimonials" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.testimonials")}</h2>
              <p className="text-sm text-white/60">{t("admin.sm.testHint")}</p>
              {cfg.testimonials.map((tm, i) => (
                <div key={i} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{t("admin.sm.reviewNum")} {i + 1}</h3>
                    <button onClick={() => set("testimonials", cfg.testimonials.filter((_, idx) => idx !== i))} className="text-red-400 text-sm">{t("admin.common.delete")}</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><label className={labelCls}>{t("admin.sm.name")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={tm.name} onChange={e => { const a = [...cfg.testimonials]; a[i] = { ...t, name: e.target.value }; set("testimonials", a); }} /></div>
                    <div><label className={labelCls}>{t("admin.sm.country")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={tm.country} onChange={e => { const a = [...cfg.testimonials]; a[i] = { ...t, country: e.target.value }; set("testimonials", a); }} /></div>
                  </div>
                  <div><label className={labelCls}>{t("admin.sm.tour")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={tm.tour} onChange={e => { const a = [...cfg.testimonials]; a[i] = { ...t, tour: e.target.value }; set("testimonials", a); }} /></div>
                  <div><label className={labelCls}>{t("admin.sm.textQuote")}</label><textarea className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} rows={3} value={tm.text} onChange={e => { const a = [...cfg.testimonials]; a[i] = { ...t, text: e.target.value }; set("testimonials", a); }} /></div>
                  <div><label className={labelCls}>{t("admin.sm.rating")}</label><input type="number" min="1" max="5" className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={tm.rating} onChange={e => { const a = [...cfg.testimonials]; a[i] = { ...t, rating: parseInt(e.target.value) || 5 }; set("testimonials", a); }} /></div>
                  <div><label className={labelCls}>{t("admin.sm.photoUrl")}</label><input type="text" placeholder="https://..." className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={tm.image || ""} onChange={e => { const a = [...cfg.testimonials]; a[i] = { ...t, image: e.target.value }; set("testimonials", a); }} /></div>
                </div>
              ))}
              <button onClick={() => set("testimonials", [...cfg.testimonials, { name: "", country: "", tour: "", text: "", rating: 5, image: "" }])} className="px-4 py-2 bg-white/10 rounded-lg text-sm">{t("admin.sm.addTestimonial")}</button>
            </div>
          )}

          
          {tab === "heroText" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.heroTextSettings")}</h2>
              <p className="text-sm text-white/60">{t("admin.sm.heroTextHint")}</p>
              {[
                { key: "tours", label: t("admin.sm.heroPage.tours") },
                { key: "hotels", label: t("admin.sm.heroPage.hotels") },
                { key: "cars", label: t("admin.sm.heroPage.cars") },
                { key: "cruises", label: t("admin.sm.heroPage.cruises") },
                { key: "visas", label: t("admin.sm.heroPage.visas") },
                { key: "insurance", label: t("admin.sm.heroPage.insurance") },
                { key: "mingalar", label: t("admin.sm.section.skyLoungeMingalar") },
              ].map(({ key, label }) => {
                const ht = cfg.heroText?.[key] || { title: "", subtitle: "", titleFont: "Georgia, serif", titleSize: "3rem", subtitleSize: "1.2rem" };
                return (
                  <div key={key} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 space-y-3">
                    <h3 className="font-medium text-[#D4AF37]">{label}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>{t("admin.sm.title")}</label>
                        <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder={t("admin.sm.heroTitlePh")}
                          value={ht.title} onChange={e => setCfg(p => ({ ...p, heroText: { ...(p.heroText || {}), [key]: { ...ht, title: e.target.value } } }))} />
                      </div>
                      <div>
                        <label className={labelCls}>{t("admin.sm.subtitle")}</label>
                        <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder={t("admin.sm.heroSubtitlePh")}
                          value={ht.subtitle} onChange={e => setCfg(p => ({ ...p, heroText: { ...(p.heroText || {}), [key]: { ...ht, subtitle: e.target.value } } }))} />
                      </div>
                      <div>
                        <label className={labelCls}>{t("admin.sm.titleFont")}</label>
                        <select className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                          value={ht.titleFont} onChange={e => setCfg(p => ({ ...p, heroText: { ...(p.heroText || {}), [key]: { ...ht, titleFont: e.target.value } } }))}>
                          <option value="Georgia, serif">{t("admin.sm.georgia")}</option>
                          <option value="Playfair Display, serif">{t("admin.sm.playfair")}</option>
                          <option value="Arial, sans-serif">{t("admin.sm.arial")}</option>
                          <option value="Helvetica, sans-serif">{t("admin.sm.helvetica")}</option>
                          <option value="system-ui, sans-serif">{t("admin.sm.systemUI")}</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>{t("admin.sm.titleSize")}</label>
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
                        <label className={labelCls}>{t("admin.sm.subtitleSize")}</label>
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
              <h2 className="text-lg font-bold text-white">{t("admin.sm.cardDims")}</h2>
              <p className="text-sm text-white/60">{t("admin.sm.cardDimsHint")}</p>
              
              <h3 className="text-md font-semibold text-[#D4AF37] mt-4">{t("admin.sm.cardDimensions")}</h3>
              {[
                { key: "tours", label: t("admin.sm.section.tours") },
                { key: "hotels", label: t("admin.sm.section.hotels") },
                { key: "cars", label: t("admin.sm.section.cars") },
                { key: "cruises", label: t("admin.sm.section.cruises") },
                { key: "visas", label: t("admin.sm.section.visas") },
                { key: "insurance", label: t("admin.sm.section.insurance") },
                { key: "mingalar", label: t("admin.sm.section.skyLounge") },
              ].map(({ key, label }) => {
                const cd = cfg.cardDimensions?.[key] || { width: 300, height: 420 };
                return (
                  <div key={key} className="border border-white/10 bg-white/5 text-white rounded-lg p-4">
                    <h4 className="font-medium mb-2">{label} {t("admin.sm.cards")}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>{t("admin.sm.widthPx")}</label>
                        <input type="number" className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                          value={cd.width} min={200} max={800} step={10}
                          onChange={e => setCfg(p => ({ ...p, cardDimensions: { ...(p.cardDimensions || {}), [key]: { ...cd, width: parseInt(e.target.value) || 300 } } }))} />
                      </div>
                      <div>
                        <label className={labelCls}>{t("admin.sm.heightPx")}</label>
                        <input type="number" className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                          value={cd.height} min={200} max={900} step={10}
                          onChange={e => setCfg(p => ({ ...p, cardDimensions: { ...(p.cardDimensions || {}), [key]: { ...cd, height: parseInt(e.target.value) || 420 } } }))} />
                      </div>
                    </div>
                  </div>
                );
              })}

              <h3 className="text-md font-semibold text-[#D4AF37] mt-6">{t("admin.sm.heroBannerHeight")}</h3>
              {[
                { key: "tours", label: t("admin.sm.section.tours") },
                { key: "hotels", label: t("admin.sm.section.hotels") },
                { key: "cars", label: t("admin.sm.section.cars") },
                { key: "cruises", label: t("admin.sm.section.cruises") },
                { key: "visas", label: t("admin.sm.section.visas") },
                { key: "insurance", label: t("admin.sm.section.insurance") },
                { key: "mingalar", label: t("admin.sm.section.skyLounge") },
                { key: "about", label: t("admin.sm.section.about") },
                { key: "blog", label: t("admin.sm.section.blog") },
                { key: "contact", label: t("admin.sm.section.contact") },
                { key: "faq", label: t("admin.sm.section.faq") },
                { key: "terms", label: t("admin.sm.section.terms") },
                { key: "privacy", label: t("admin.sm.section.privacy") },
              ].map(({ key, label }) => {
                const hd = cfg.heroDimensions?.[key] || { mobile: 300, desktop: 450 };
                return (
                  <div key={key} className="border border-white/10 bg-white/5 text-white rounded-lg p-4">
                    <h4 className="font-medium mb-2">{label} {t("admin.sm.hero")}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>{t("admin.sm.mobileHeightPx")}</label>
                        <input type="number" className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }}
                          value={hd.mobile} min={150} max={600} step={10}
                          onChange={e => setCfg(p => ({ ...p, heroDimensions: { ...(p.heroDimensions || {}), [key]: { ...hd, mobile: parseInt(e.target.value) || 300 } } }))} />
                      </div>
                      <div>
                        <label className={labelCls}>{t("admin.sm.desktopHeightPx")}</label>
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
              <h2 className="text-lg font-bold text-white">{t("admin.sm.moduleToggles")}</h2>
              <p className="text-sm text-white/60">{t("admin.sm.moduleHint")}</p>
              {[
                { key: "flights", label: t("admin.sm.section.flights"), desc: t("admin.sm.mod.flights") },
                { key: "buses", label: t("admin.sm.section.buses"), desc: t("admin.sm.mod.buses") },
                { key: "tours", label: t("admin.sm.section.tours"), desc: t("admin.sm.mod.tours") },
                { key: "hotels", label: t("admin.sm.section.hotels"), desc: t("admin.sm.mod.hotels") },
                { key: "cars", label: t("admin.sm.section.cars"), desc: t("admin.sm.mod.cars") },
                { key: "visas", label: t("admin.sm.section.visas"), desc: t("admin.sm.mod.visas") },
                { key: "insurance", label: t("admin.sm.section.insurance"), desc: t("admin.sm.mod.insurance") },
                { key: "cruises", label: t("admin.sm.section.cruises"), desc: t("admin.sm.mod.cruises") },
                { key: "skyLounge", label: t("admin.sm.section.skyLoungeMingalar"), desc: t("admin.sm.mod.skyLounge") },
                { key: "blog", label: t("admin.sm.section.blog"), desc: t("admin.sm.mod.blog") },
              ].map(({ key, label, desc }) => {
                const active = cfg.moduleToggles?.[key] !== false;
                return (
                  <div key={key} className="border border-white/10 bg-white/5 text-white rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white text-sm">{label}</h3>
                        <p className="text-xs text-white/60 mt-0.5">{desc}</p>
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
                        {active ? t("admin.sm.active") : t("admin.sm.off")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "relatedItems" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.relatedItems")}</h2>
              <p className="text-sm text-white/60 mb-4">{t("admin.sm.relatedHint")}</p>
              
              <div className="border border-white/10 bg-white/5 text-white rounded-lg p-4 mb-4">
                <h3 className="font-medium text-white text-sm mb-3">{t("admin.sm.sameSection")}</h3>
                <p className="text-xs text-white/60 mb-2">{t("admin.sm.sameSectionHint")}</p>
                <div className="flex items-center gap-3">
                  <span className="text-white/70 text-sm">{t("admin.sm.maxItems")}</span>
                  <select
                    value={cfg.relatedItems?.maxItems ?? 6}
                    onChange={e => setCfg(p => ({ ...p, relatedItems: { ...(p.relatedItems || { maxItems: 6, crossSections: {} }), maxItems: parseInt(e.target.value) } }))}
                    className="bg-white/10 border border-white/20 text-white rounded px-2 py-1 text-sm"
                  >
                    {[2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {t("admin.sm.items")}</option>)}
                  </select>
                </div>
              </div>

              <h3 className="font-semibold text-[#D4AF37] mb-3">{t("admin.sm.crossSection")}</h3>
              <p className="text-xs text-white/60 mb-4">{t("admin.sm.crossHint")}</p>
              {[
                { key: "tours", label: t("admin.sm.section.tours") },
                { key: "hotels", label: t("admin.sm.section.hotels") },
                { key: "cars", label: t("admin.sm.section.cars") },
                { key: "visas", label: t("admin.sm.section.visas") },
                { key: "cruises", label: t("admin.sm.section.cruises") },
                { key: "insurance", label: t("admin.sm.section.insurance") },
                { key: "mingalar", label: t("admin.sm.section.skyLounge") },
              ].map(({ key, label }) => {
                const cs = cfg.relatedItems?.crossSections?.[key] ?? { enabled: true, maxItems: 4 };
                return (
                  <div key={key} className="border border-white/10 bg-white/5 text-white rounded-lg p-4 mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-white text-sm">{label}</h4>
                      <button
                        onClick={() => setCfg(p => ({
                          ...p,
                          relatedItems: {
                            ...(p.relatedItems || { maxItems: 6, crossSections: {} }),
                            crossSections: {
                              ...(p.relatedItems?.crossSections || {}),
                              [key]: { ...cs, enabled: !cs.enabled }
                            }
                          }
                        }))}
                        className={"relative inline-flex h-7 w-12 items-center rounded-full transition-colors " + (cs.enabled ? "bg-[#27AE60]" : "bg-white/20")}
                        style={{ flexShrink: 0 }}
                      >
                        <span className={"inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform " + (cs.enabled ? "translate-x-6" : "translate-x-1")} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + (cs.enabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                        {cs.enabled ? t("admin.sm.shown") : t("admin.sm.hidden")}
                      </span>
                      {cs.enabled && (
                        <div className="flex items-center gap-2">
                          <span className="text-white/50 text-xs">{t("admin.sm.maxItems")}</span>
                          <select
                            value={cs.maxItems}
                            onChange={e => setCfg(p => ({
                              ...p,
                              relatedItems: {
                                ...(p.relatedItems || { maxItems: 6, crossSections: {} }),
                                crossSections: {
                                  ...(p.relatedItems?.crossSections || {}),
                                  [key]: { ...cs, maxItems: parseInt(e.target.value) }
                                }
                              }
                            }))}
                            className="bg-white/10 border border-white/20 text-white rounded px-2 py-1 text-xs"
                          >
                            {[2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "detailTabs" && (

            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.tourTabs")}</h2>
              <p className="text-sm text-white/60">{t("admin.sm.tourTabsHint")}</p>
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
                          title={t("admin.sm.moveUp")}
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
                          title={t("admin.sm.moveDown")}
                        >▼</button>
                      </div>
                      <div>
                        <h3 className="font-medium text-white text-sm">{tab.label}</h3>
                        <p className="text-xs text-white/60">{t("admin.sm.key")} {tab.key}</p>
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
                      {tab.visible ? t("admin.sm.visible") : t("admin.sm.hidden")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "partners" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.partners")}</h2>
              <p className="text-sm text-white/60">{t("admin.sm.partnersHint")}</p>
              {cfg.partners.map((p, i) => (
                <div key={i} className="flex flex-col lg:flex-row lg:items-center gap-3">
                  <input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} placeholder={t("admin.sm.partnerName")} value={p} onChange={e => { const a = [...cfg.partners]; a[i] = e.target.value; set("partners", a); }} />
                  <button onClick={() => set("partners", cfg.partners.filter((_, idx) => idx !== i))} className="text-red-400 text-sm">{t("admin.common.delete")}</button>
                </div>
              ))}
              <button onClick={() => set("partners", [...cfg.partners, ""])} className="px-4 py-2 bg-white/10 rounded-lg text-sm">{t("admin.sm.addPartner")}</button>
            </div>
          )}

          {tab === "meta" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">{t("admin.sm.metaSeo")}</h2>
              <div><label className={`labelCls labelCls`}>{t("admin.sm.siteName")}</label><input className={inputCls} style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "white" }} value={cfg.siteName} onChange={e => set("siteName", e.target.value)} /></div>
              <ImageZone field="logoUrl" label={t("admin.sm.siteLogo")} />
            </div>
          )}
        </div>

        {uploadingKey && <div className="fixed bottom-4 right-4 bg-[#0A1628] text-white px-4 py-2 rounded-lg shadow-lg text-sm">{t("admin.sm.uploadingImg")}</div>}
      </div>
    </main>
  );
}
