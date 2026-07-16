"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";

/* ──────────────────────────────────────────────
   A9 Global — Site Manager (Every Section Editable)
   Latest version: fully dynamic, drag-drop images, card CRUD, toast notifications
────────────────────────────────────────────── */

// ── Types ──
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

interface SiteConfig {
  id: string;
  siteName: string; logoUrl: string;
  metaTitle: string; metaDescription: string;
  footerCopyright: string; footerRegNumbers?: string;
  footerTagline?: string; footerCompanyInfo?: string;
  heroSlides: HeroSlide[];
  heroHeightMobile: number; heroHeightDesktop: number;
  serviceIcons: ServiceIcon[];
  navLinks: NavLink[];
  statsCards: StatsCard[];
  whyChooseCards: WhyCard[];
  popularDestinations: PopularDestination[];
  ctaTitle: string; ctaDescription: string; ctaButtonLabel: string; ctaButtonHref: string;
  contact: ContactInfo; socialLinks: SocialLink[];
  footerSections: FooterSection[];
}

const API = "/api/admin/site-config";
const UPLOAD_API = "/api/upload";

const defaultCfg: SiteConfig = {
  id: "site-config", siteName: "A9 Global Travels & Tours", logoUrl: "/logo.jpeg",
  metaTitle: "A9 Global Travel | Luxury Travel Myanmar", metaDescription: "Premium travel experiences in Myanmar.",
  footerCopyright: "© 2026 𝐀𝟗 𝐆𝐥𝐨𝐛𝐚𝐥 Travels & Tours.", footerRegNumbers: "Company Reg: 126395248 | IATA: 05301026",
  footerTagline: "Where every journey is a story waiting to be told!", footerCompanyInfo: "Your premier IATA-accredited travel partner.",
  heroSlides: [{ image: "", label: "", title: "", subtitle: "" }], heroHeightMobile: 500, heroHeightDesktop: 680,
  serviceIcons: [], navLinks: [], statsCards: [], whyChooseCards: [], popularDestinations: [],
  ctaTitle: "", ctaDescription: "", ctaButtonLabel: "Book Now", ctaButtonHref: "/book-now",
  contact: { email: "", phone: "", address: "", whatsapp: "", messenger: "", viber: "", telegram: "" },
  socialLinks: [], footerSections: [],
};

type Tab = "hero"|"services"|"nav"|"stats"|"why"|"destinations"|"cta"|"contact"|"social"|"footer"|"meta"|"about";

export default function SiteManagerPage() {
  const [cfg, setCfg] = useState(defaultCfg);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("hero");
  const [toast, setToast] = useState<{msg:string; type:"success"|"error"}|null>(null);

  const showToast = (msg:string, type:"success"|"error" = "success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  // Fetch
  useEffect(() => {
    fetch(API).then(r=>r.json()).then(d=>{
      const merged = { ...defaultCfg, ...d };
      setCfg(merged);
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  // Upload helper
  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData(); fd.append("file", file);
    const r = await fetch(UPLOAD_API, { method:"POST", body:fd });
    const j = await r.json();
    return j.url || j.oss_url || "";
  };

  // Save
  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await fetch(API, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({...cfg, id: "site-config"}) });
      if (r.ok) showToast("✅ Changes saved successfully and live!");
      else showToast("Save failed", "error");
    } catch { showToast("Network error", "error"); }
    setSaving(false);
  };

  // ──── Generic field updater ────
  const set = <K extends keyof SiteConfig>(k: K, v: SiteConfig[K]) => setCfg(p=>({...p,[k]:v}));

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-gold/70 animate-pulse text-lg">Loading site configuration...</div></div>;

  const tabs: {key:Tab;label:string}[] = [
    {key:"hero",label:"🎠 Hero Slides"}, {key:"services",label:"🔧 Service Icons"}, {key:"nav",label:"🔗 Nav Links"},
    {key:"stats",label:"📊 Stats Cards"}, {key:"why",label:"⭐ Why Choose Us"}, {key:"destinations",label:"🌍 Destinations"},
    {key:"cta",label:"📢 CTA Section"}, {key:"contact",label:"📞 Contact Info"}, {key:"social",label:"🌐 Social Links"},
    {key:"footer",label:"📝 Footer"}, {key:"meta",label:"🔍 Meta & SEO"},
    {key:"about",label:"📄 About Us"},
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg text-sm font-medium shadow-lg ${toast.type==="success"?"bg-green-600 text-white":"bg-red-600 text-white"}`}>{toast.msg}</div>}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-3xl md:text-4xl font-bold text-[#D4AF37]" style={{fontFamily:"'Playfair Display', Georgia, serif"}}>Site Manager</h1><p className="text-white/40 text-sm mt-1">Control every element of your live website</p></div>
        <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 disabled:opacity-50 transition-all">{saving?"⏳ Saving...":"💾 Save & Publish"}</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/10 w-fit flex-wrap">
        {tabs.map(t=>(<button key={t.key} onClick={()=>setTab(t.key)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab===t.key?"bg-gold text-deepblue":"text-white/50 hover:text-white"}`}>{t.label}</button>))}
      </div>

      {/* ──── Tab Content Renderers ──── */}

      {tab==="hero" && (
        <SectionCard title="Hero Slides" desc="Carousel slides shown on the homepage header.">
          {cfg.heroSlides.map((s,i)=>(
            <SlideEditor key={i} index={i} slide={s} onChange={(v)=>{ const a=[...cfg.heroSlides]; a[i]=v; set("heroSlides",a); }} onRemove={()=>set("heroSlides",cfg.heroSlides.filter((_,j)=>j!==i))} onUpload={uploadFile} showToast={showToast} />
          ))}
          <button onClick={()=>set("heroSlides",[...cfg.heroSlides,{image:"",label:"",title:"",subtitle:""}])} className="text-gold text-sm font-medium hover:text-gold/80 transition-colors">+ Add Slide</button>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Field label="Hero Height Mobile (px)" value={String(cfg.heroHeightMobile)} onChange={v=>set("heroHeightMobile",Number(v))} type="number" />
            <Field label="Hero Height Desktop (px)" value={String(cfg.heroHeightDesktop)} onChange={v=>set("heroHeightDesktop",Number(v))} type="number" />
          </div>
        </SectionCard>
      )}

      {tab==="services" && (
        <SectionCard title="Service Icons" desc="The icon bar below the navbar. Toggle visibility and set links.">
          {cfg.serviceIcons.map((s,i)=>(
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-lg p-4 space-y-2">
              <div className="flex gap-3 items-end flex-wrap">
                <Field label="Label" value={s.label} onChange={v=>{const a=[...cfg.serviceIcons];a[i]={...a[i],label:v};set("serviceIcons",a)}} />
                <Field label="Icon (emoji)" value={s.icon} onChange={v=>{const a=[...cfg.serviceIcons];a[i]={...a[i],icon:v};set("serviceIcons",a)}} />
                <Field label="URL Link" value={s.href} onChange={v=>{const a=[...cfg.serviceIcons];a[i]={...a[i],href:v};set("serviceIcons",a)}} />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={s.enabled} onChange={e=>{const a=[...cfg.serviceIcons];a[i]={...a[i],enabled:e.target.checked};set("serviceIcons",a)}} className="accent-gold" />
                  <span className="text-white/60 text-sm">Enabled</span>
                </label>
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {tab==="nav" && (
        <SectionCard title="Nav Links" desc="Desktop and mobile navbar menu items.">
          {cfg.navLinks.map((s,i)=>(
            <div key={i} className="flex gap-3 items-end bg-white/[0.03] border border-white/10 rounded-lg p-3">
              <Field label="Label" value={s.label} onChange={v=>{const a=[...cfg.navLinks];a[i]={...a[i],label:v};set("navLinks",a)}} />
              <Field label="URL" value={s.href} onChange={v=>{const a=[...cfg.navLinks];a[i]={...a[i],href:v};set("navLinks",a)}} />
              <button onClick={()=>set("navLinks",cfg.navLinks.filter((_,j)=>j!==i))} className="text-red-400 text-xs hover:text-red-300 mb-1">Remove</button>
            </div>
          ))}
          <button onClick={()=>set("navLinks",[...cfg.navLinks,{label:"",href:""}])} className="text-gold text-sm font-medium">+ Add Link</button>
        </SectionCard>
      )}

      {tab==="stats" && (
        <SectionCard title="Stats / Why Us Cards" desc="Homepage statistics section with cards.">
          {cfg.statsCards.map((s,i)=>(
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-lg p-4 space-y-2">
              <div className="flex gap-3 items-end flex-wrap">
                <Field label="Icon" value={s.icon} onChange={v=>{const a=[...cfg.statsCards];a[i]={...a[i],icon:v};set("statsCards",a)}} />
                <Field label="Title" value={s.title} onChange={v=>{const a=[...cfg.statsCards];a[i]={...a[i],title:v};set("statsCards",a)}} />
                <Field label="Description" value={s.description} onChange={v=>{const a=[...cfg.statsCards];a[i]={...a[i],description:v};set("statsCards",a)}} cls="flex-1" />
              </div>
              <div className="flex gap-3 items-end flex-wrap">
                <Field label="Image URL (optional)" value={s.imgSrc} onChange={v=>{const a=[...cfg.statsCards];a[i]={...a[i],imgSrc:v};set("statsCards",a)}} cls="flex-1" />
                <ImageUploadBtn onUpload={async(f)=>{const url=await uploadFile(f);if(url){const a=[...cfg.statsCards];a[i]={...a[i],imgSrc:url};set("statsCards",a);showToast("Image uploaded!")}}} />
              </div>
              <button onClick={()=>set("statsCards",cfg.statsCards.filter((_,j)=>j!==i))} className="text-red-400 text-xs">Remove Card</button>
            </div>
          ))}
          <button onClick={()=>set("statsCards",[...cfg.statsCards,{icon:"",title:"",description:"",imgSrc:""}])} className="text-gold text-sm font-medium">+ Add Card</button>
        </SectionCard>
      )}

      {tab==="why" && (
        <SectionCard title="Why Choose Us" desc="Feature cards with icons.">
          {cfg.whyChooseCards.map((s,i)=>(
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-lg p-4 space-y-2">
              <div className="flex gap-3 items-end flex-wrap">
                <Field label="Icon" value={s.icon} onChange={v=>{const a=[...cfg.whyChooseCards];a[i]={...a[i],icon:v};set("whyChooseCards",a)}} />
                <Field label="Title" value={s.title} onChange={v=>{const a=[...cfg.whyChooseCards];a[i]={...a[i],title:v};set("whyChooseCards",a)}} />
                <Field label="Description" value={s.description} onChange={v=>{const a=[...cfg.whyChooseCards];a[i]={...a[i],description:v};set("whyChooseCards",a)}} cls="flex-1" />
              </div>
              <button onClick={()=>set("whyChooseCards",cfg.whyChooseCards.filter((_,j)=>j!==i))} className="text-red-400 text-xs">Remove Card</button>
            </div>
          ))}
          <button onClick={()=>set("whyChooseCards",[...cfg.whyChooseCards,{icon:"",title:"",description:""}])} className="text-gold text-sm font-medium">+ Add Card</button>
        </SectionCard>
      )}

      {tab==="destinations" && (
        <SectionCard title="Popular Destinations" desc="Featured destinations on the homepage.">
          {cfg.popularDestinations.map((s,i)=>(
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-lg p-4 space-y-2">
              <div className="flex gap-3 items-end flex-wrap">
                <Field label="City" value={s.city} onChange={v=>{const a=[...cfg.popularDestinations];a[i]={...a[i],city:v};set("popularDestinations",a)}} />
                <Field label="Country" value={s.country} onChange={v=>{const a=[...cfg.popularDestinations];a[i]={...a[i],country:v};set("popularDestinations",a)}} />
                <Field label="Min Price" value={s.minPrice} onChange={v=>{const a=[...cfg.popularDestinations];a[i]={...a[i],minPrice:v};set("popularDestinations",a)}} />
              </div>
              <div className="flex gap-3 items-end flex-wrap">
                <Field label="Image URL" value={s.image} onChange={v=>{const a=[...cfg.popularDestinations];a[i]={...a[i],image:v};set("popularDestinations",a)}} cls="flex-1" />
                <ImageUploadBtn onUpload={async(f)=>{const url=await uploadFile(f);if(url){const a=[...cfg.popularDestinations];a[i]={...a[i],image:url};set("popularDestinations",a);showToast("Uploaded!")}}} />
              </div>
              <button onClick={()=>set("popularDestinations",cfg.popularDestinations.filter((_,j)=>j!==i))} className="text-red-400 text-xs">Remove</button>
            </div>
          ))}
          <button onClick={()=>set("popularDestinations",[...cfg.popularDestinations,{city:"",country:"",image:"",minPrice:""}])} className="text-gold text-sm font-medium">+ Add Destination</button>
        </SectionCard>
      )}

      {tab==="cta" && (
        <SectionCard title="Call-to-Action Section" desc="The final CTA banner on the homepage.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="CTA Title" value={cfg.ctaTitle} onChange={v=>set("ctaTitle",v)} />
            <Field label="Button Label" value={cfg.ctaButtonLabel} onChange={v=>set("ctaButtonLabel",v)} />
            <Field label="Button URL" value={cfg.ctaButtonHref} onChange={v=>set("ctaButtonHref",v)} />
          </div>
          <Field label="CTA Description" value={cfg.ctaDescription} onChange={v=>set("ctaDescription",v)} cls="w-full" />
        </SectionCard>
      )}

      {tab==="contact" && (
        <SectionCard title="Contact Information" desc="Phone, email, address, and chat links.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Email" value={cfg.contact.email} onChange={v=>set("contact",{...cfg.contact,email:v})} />
            <Field label="Phone" value={cfg.contact.phone} onChange={v=>set("contact",{...cfg.contact,phone:v})} />
            <Field label="WhatsApp" value={cfg.contact.whatsapp} onChange={v=>set("contact",{...cfg.contact,whatsapp:v})} />
            <Field label="Messenger URL" value={cfg.contact.messenger} onChange={v=>set("contact",{...cfg.contact,messenger:v})} />
            <Field label="Viber" value={cfg.contact.viber} onChange={v=>set("contact",{...cfg.contact,viber:v})} />
            <Field label="Telegram URL" value={cfg.contact.telegram} onChange={v=>set("contact",{...cfg.contact,telegram:v})} />
          </div>
          <Field label="Address" value={cfg.contact.address} onChange={v=>set("contact",{...cfg.contact,address:v})} cls="w-full" />
        </SectionCard>
      )}

      {tab==="social" && (
        <SectionCard title="Social Links" desc="Footer social media icons.">
          {cfg.socialLinks.map((s,i)=>(
            <div key={i} className="flex gap-3 items-end bg-white/[0.03] border border-white/10 rounded-lg p-3">
              <Field label="Platform" value={s.platform} onChange={v=>{const a=[...cfg.socialLinks];a[i]={...a[i],platform:v};set("socialLinks",a)}} />
              <Field label="URL" value={s.url} onChange={v=>{const a=[...cfg.socialLinks];a[i]={...a[i],url:v};set("socialLinks",a)}} cls="flex-1" />
              <button onClick={()=>set("socialLinks",cfg.socialLinks.filter((_,j)=>j!==i))} className="text-red-400 text-xs">Remove</button>
            </div>
          ))}
          <button onClick={()=>set("socialLinks",[...cfg.socialLinks,{platform:"",url:""}])} className="text-gold text-sm font-medium">+ Add Social Link</button>
        </SectionCard>
      )}

      {tab==="footer" && (
        <SectionCard title="Footer" desc="Footer content, quick links, and legal text.">
          <Field label="Footer Copyright" value={cfg.footerCopyright} onChange={v=>set("footerCopyright",v)} />
          <Field label="Footer Tagline" value={cfg.footerTagline||""} onChange={v=>set("footerTagline",v)} />
          <Field label="Company Description" value={cfg.footerCompanyInfo||""} onChange={v=>set("footerCompanyInfo",v)} />
          <Field label="Registration Numbers" value={cfg.footerRegNumbers||""} onChange={v=>set("footerRegNumbers",v)} />
          <h4 className="text-white font-semibold mt-4 mb-2">Footer Link Sections:</h4>
          {cfg.footerSections.map((sec,si)=>(
            <div key={si} className="bg-white/[0.03] border border-white/10 rounded-lg p-4 space-y-2 mb-3">
              <Field label="Section Title" value={sec.title} onChange={v=>{const a=[...cfg.footerSections];a[si]={...a[si],title:v};set("footerSections",a)}} />
              {sec.links.map((l,li)=>(
                <div key={li} className="flex gap-3 items-end">
                  <Field label="Label" value={l.label} onChange={v=>{const a=[...cfg.footerSections];a[si].links[li]={...a[si].links[li],label:v};set("footerSections",[a[0]])}} />
                  <Field label="URL" value={l.href} onChange={v=>{const a=[...cfg.footerSections];a[si].links[li]={...a[si].links[li],href:v};set("footerSections",a)}} />
                  <button onClick={()=>{const a=[...cfg.footerSections];a[si].links=a[si].links.filter((_,j)=>j!==li);set("footerSections",a)}} className="text-red-400 text-xs mb-1">X</button>
                </div>
              ))}
              <button onClick={()=>{const a=[...cfg.footerSections];a[si].links.push({label:"",href:""});set("footerSections",a)}} className="text-gold text-xs">+ Add Link</button>
              <button onClick={()=>set("footerSections",cfg.footerSections.filter((_,j)=>j!==si))} className="text-red-400 text-xs ml-3">Remove Section</button>
            </div>
          ))}
          <button onClick={()=>set("footerSections",[...cfg.footerSections,{title:"",links:[]}])} className="text-gold text-sm font-medium">+ Add Footer Section</button>
        </SectionCard>
      )}

      {tab==="meta" && (
        <SectionCard title="Meta & SEO" desc="Site-wide metadata.">
          <Field label="Site Name" value={cfg.siteName} onChange={v=>set("siteName",v)} />
          <Field label="Logo URL" value={cfg.logoUrl} onChange={v=>set("logoUrl",v)} />
          <Field label="Meta Title" value={cfg.metaTitle} onChange={v=>set("metaTitle",v)} />
          <Field label="Meta Description" value={cfg.metaDescription} onChange={v=>set("metaDescription",v)} />
        </SectionCard>
      )}

      {tab==="about" && <AboutUsTab cfg={cfg} setCfg={setCfg} onUpload={uploadFile} showToast={showToast} />}

      {/* Bottom Save */}
      <div className="pt-4 border-t border-white/10">
        <button onClick={handleSave} disabled={saving} className="px-8 py-3 rounded-lg bg-gold text-deepblue-dark font-bold text-base hover:bg-gold/90 disabled:opacity-50 transition-all w-full sm:w-auto">{saving?"⏳ Saving...":"💾 Save All Changes & Publish Live"}</button>
      </div>
    </div>
  );
}

// ── Reusable Components ──────────────────────────────────

function SectionCard({ title, desc, children }: { title:string; desc:string; children:React.ReactNode }) {
  return <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
    <div><h3 className="text-lg font-semibold text-gold">{title}</h3><p className="text-white/40 text-sm">{desc}</p></div>
    {children}
  </div>;
}

function Field({ label, value, onChange, type="text", cls="" }: { label:string; value:string; onChange:(v:string)=>void; type?:string; cls?:string }) {
  return <div className={`${cls}`}>
    <label className="block text-white/60 text-xs mb-1">{label}</label>
    {type==="textarea" ? <textarea value={value} onChange={e=>onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors min-h-[80px]" /> :
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors" />}
  </div>;
}

function SlideEditor({ index, slide, onChange, onRemove, onUpload, showToast }: { index:number; slide:HeroSlide; onChange:(v:HeroSlide)=>void; onRemove:()=>void; onUpload:(f:File)=>Promise<string>; showToast:(m:string,t?:"success"|"error")=>void }) {
  const fRef = useRef<HTMLInputElement>(null);
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-lg p-4 space-y-3">
      <div className="text-white/40 text-xs font-semibold">Slide {index+1}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-white/60 text-xs mb-1">Image</label>
          <div className="flex gap-2">
            <input value={slide.image} onChange={e=>onChange({...slide,image:e.target.value})} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50" placeholder="/images_v2/hero.jpg" />
            <input ref={fRef} type="file" accept="image/*" className="hidden" onChange={async e=>{const f=e.target.files?.[0]; if(!f)return; const url=await onUpload(f); if(url){onChange({...slide,image:url});showToast("Image uploaded!")} else showToast("Upload failed","error")}} />
            <button onClick={()=>fRef.current?.click()} className="px-3 py-2 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 whitespace-nowrap">📎 Drag or Upload</button>
          </div>
        </div>
        <Field label="Label (tag)" value={slide.label} onChange={v=>onChange({...slide,label:v})} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Title" value={slide.title} onChange={v=>onChange({...slide,title:v})} />
        <Field label="Subtitle" value={slide.subtitle} onChange={v=>onChange({...slide,subtitle:v})} />
      </div>
      <button onClick={onRemove} className="text-red-400 text-xs hover:text-red-300">Remove Slide</button>
    </div>
  );
}

function ImageUploadBtn({ onUpload }: { onUpload:(f:File)=>Promise<void> }) {
  const ref = useRef<HTMLInputElement>(null);
  return <>
    <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)onUpload(f)}} />
    <button type="button" onClick={()=>ref.current?.click()} className="px-3 py-2 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 whitespace-nowrap">📎 Upload</button>
  </>;
}

/* ── About Us Tab ───────────────────────────────────── */
function AboutUsTab({ cfg, setCfg, onUpload, showToast }: { cfg: any; setCfg: (f: (p: any) => any) => void; onUpload: (f: File) => Promise<string>; showToast: (m: string, t?: "success" | "error") => void }) {
  const about = cfg.about || {};
  const updateAbout = (key: string, value: any) => {
    setCfg((prev: any) => ({ ...prev, about: { ...prev.about, [key]: value } }));
  };
  const whoWeAreText = about.whoWeAreText || [];
  const values = about.values || [];
  const services = about.services || [];
  const whyChooseUs = about.whyChooseUs || [];
  const team = about.teamMembers || [];

  return (
    <div className="space-y-6">
      <SectionCard title="About Us Page" desc="Every element of the About Us page.">
        <h4 className="text-white font-semibold">Hero Section</h4>
        <div className="flex gap-3 items-end flex-wrap">
          <Field label="Hero Image URL" value={about.heroImage || ""} onChange={v => updateAbout("heroImage", v)} cls="flex-1" />
          <ImageUploadBtn onUpload={async f => { const url = await onUpload(f); if (url) { updateAbout("heroImage", url); showToast("Uploaded!"); } }} />
        </div>
        <Field label="Hero Title" value={about.heroTitle || ""} onChange={v => updateAbout("heroTitle", v)} />
        <Field label="Hero Subtitle" value={about.heroSubtitle || ""} onChange={v => updateAbout("heroSubtitle", v)} />

        <h4 className="text-white font-semibold mt-4">Who We Are Text</h4>
        {whoWeAreText.map((p: string, i: number) => (
          <div key={i} className="flex gap-2">
            <Field label={`Paragraph ${i + 1}`} value={p} onChange={v => { const a = [...whoWeAreText]; a[i] = v; updateAbout("whoWeAreText", a); }} cls="flex-1" />
            <button onClick={() => updateAbout("whoWeAreText", whoWeAreText.filter((_: any, j: number) => j !== i))} className="text-red-400 text-xs mt-5">X</button>
          </div>
        ))}
        <button onClick={() => updateAbout("whoWeAreText", [...whoWeAreText, ""])} className="text-gold text-sm font-medium">+ Add Paragraph</button>
      </SectionCard>

      <SectionCard title="Mission & Vision" desc="">
        <Field label="Mission Title" value={about.missionTitle || ""} onChange={v => updateAbout("missionTitle", v)} />
        <Field label="Mission Text" value={about.missionText || ""} onChange={v => updateAbout("missionText", v)} />
        <Field label="Vision Title" value={about.visionTitle || ""} onChange={v => updateAbout("visionTitle", v)} />
        <Field label="Vision Text" value={about.visionText || ""} onChange={v => updateAbout("visionText", v)} />
      </SectionCard>

      <SectionCard title="Values" desc="">
        {values.map((v: any, i: number) => (
          <div key={i} className="flex gap-2 items-end flex-wrap bg-white/[0.03] border border-white/10 rounded-lg p-3">
            <Field label="Icon" value={v.icon||""} onChange={x => { const a = [...values]; a[i] = { ...a[i], icon: x }; updateAbout("values", a); }} />
            <Field label="Title" value={v.title||""} onChange={x => { const a = [...values]; a[i] = { ...a[i], title: x }; updateAbout("values", a); }} />
            <Field label="Description" value={v.desc||""} onChange={x => { const a = [...values]; a[i] = { ...a[i], desc: x }; updateAbout("values", a); }} cls="flex-1" />
            <button onClick={() => updateAbout("values", values.filter((_: any, j: number) => j !== i))} className="text-red-400 text-xs">Remove</button>
          </div>
        ))}
        <button onClick={() => updateAbout("values", [...values, { title: "", desc: "", icon: "" }])} className="text-gold text-sm">+ Add Value</button>
      </SectionCard>

      <SectionCard title="Services" desc="">
        {services.map((s: string, i: number) => (
          <div key={i} className="flex gap-2 items-end">
            <Field label="Service" value={s} onChange={v => { const a = [...services]; a[i] = v; updateAbout("services", a); }} cls="flex-1" />
            <button onClick={() => updateAbout("services", services.filter((_: any, j: number) => j !== i))} className="text-red-400 text-xs mb-1">X</button>
          </div>
        ))}
        <button onClick={() => updateAbout("services", [...services, ""])} className="text-gold text-sm">+ Add Service</button>
      </SectionCard>

      <SectionCard title="Why Choose Us" desc="">
        {whyChooseUs.map((s: string, i: number) => (
          <div key={i} className="flex gap-2 items-end"><Field label="Reason" value={s} onChange={v => { const a = [...whyChooseUs]; a[i] = v; updateAbout("whyChooseUs", a); }} cls="flex-1" /><button onClick={() => updateAbout("whyChooseUs", whyChooseUs.filter((_: any, j: number) => j !== i))} className="text-red-400 text-xs mb-1">X</button></div>
        ))}
        <button onClick={() => updateAbout("whyChooseUs", [...whyChooseUs, ""])} className="text-gold text-sm">+ Add Reason</button>
      </SectionCard>

      <SectionCard title="Team Members" desc="">
        {team.map((m: any, i: number) => (
          <div key={i} className="bg-white/[0.03] border border-white/10 rounded-lg p-3 space-y-2">
            <div className="flex gap-2 flex-wrap">
              <Field label="Name" value={m.name||""} onChange={v => { const a = [...team]; a[i] = { ...a[i], name: v }; updateAbout("teamMembers", a); }} />
              <Field label="Role" value={m.role||""} onChange={v => { const a = [...team]; a[i] = { ...a[i], role: v }; updateAbout("teamMembers", a); }} />
            </div>
            <div className="flex gap-2 items-end">
              <Field label="Image URL" value={m.image||""} onChange={v => { const a = [...team]; a[i] = { ...a[i], image: v }; updateAbout("teamMembers", a); }} cls="flex-1" />
              <ImageUploadBtn onUpload={async f => { const url = await onUpload(f); if (url) { const a = [...team]; a[i] = { ...a[i], image: url }; updateAbout("teamMembers", a); showToast("Uploaded!"); } }} />
            </div>
            <button onClick={() => updateAbout("teamMembers", team.filter((_: any, j: number) => j !== i))} className="text-red-400 text-xs">Remove Member</button>
          </div>
        ))}
        <button onClick={() => updateAbout("teamMembers", [...team, { name: "", role: "", image: "" }])} className="text-gold text-sm">+ Add Team Member</button>
      </SectionCard>

      <SectionCard title="Commitment / CTA" desc="">
        <Field label="Commitment Title" value={about.commitmentTitle||""} onChange={v => updateAbout("commitmentTitle", v)} />
        <Field label="Commitment Text" value={about.commitmentText||""} onChange={v => updateAbout("commitmentText", v)} />
        <Field label="Subtext" value={about.commitmentSubtext||""} onChange={v => updateAbout("commitmentSubtext", v)} />
        <Field label="Button Label" value={about.commitmentButtonLabel||""} onChange={v => updateAbout("commitmentButtonLabel", v)} />
        <Field label="Button URL" value={about.commitmentButtonHref||""} onChange={v => updateAbout("commitmentButtonHref", v)} />
      </SectionCard>
    </div>
  );
}
