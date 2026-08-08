"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────────
   Manage About Us — full text/image control for /about page
   Saves via PUT /api/admin/site-config (merged with existing)
   ───────────────────────────────────────────────────────────── */

interface ValueItem { title: string; desc: string; icon: string; }
interface CertItem { title: string; code: string; image: string; }
interface JourneyItem { year: string; title: string; desc: string; }

interface AboutConfig {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  whoWeAreText: string[];
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
  valuesTitle: string;
  values: ValueItem[];
  servicesTitle: string;
  services: string[];
  whyChooseUsTitle: string;
  whyChooseUs: string[];
  commitmentTitle: string;
  commitmentText: string;
  commitmentSubtext: string;
  commitmentButtonLabel: string;
  commitmentButtonHref: string;
  certifications: CertItem[];
  journeyTitle: string;
  journey: JourneyItem[];
}

const defaultAbout: AboutConfig = {
  heroImage: "/images_v2/about-hero-v2.jpg",
  heroTitle: "Welcome to A9 Global Travel & Tours",
  heroSubtitle: "A professional travel management company based in Myanmar, providing comprehensive travel solutions for individuals, businesses, marine and organizations.",
  whoWeAreText: [
    "With extensive experience in the travel industry, we specialize in delivering reliable, efficient, and cost-effective travel services.",
    "Our expertise extends beyond leisure travel to include corporate travel management, marine and offshore travel, MICE services.",
    "We are a team of experienced travel professionals dedicated to providing exceptional service and personalized travel solutions.",
  ],
  missionTitle: "Our Mission",
  missionText: "To provide professional, reliable, and innovative travel solutions that exceed customer expectations.",
  visionTitle: "Our Vision",
  visionText: "To become one of Myanmar's leading travel management companies, recognized for service excellence.",
  valuesTitle: "Our Values",
  values: [
    { title: "Customer First", desc: "We place our customers at the center of everything we do.", icon: "🎯" },
    { title: "Integrity", desc: "We conduct our business with honesty and transparency.", icon: "🤝" },
    { title: "Reliability", desc: "We provide dependable travel solutions and responsive support.", icon: "🛡️" },
  ],
  servicesTitle: "Our Services",
  services: ["International Air Ticketing", "Domestic Air Ticketing", "Corporate Travel Management", "Marine and Offshore Travel", "Visa Assistance"],
  whyChooseUsTitle: "Why Choose A9 Global?",
  whyChooseUs: ["Experienced travel professionals", "Competitive pricing and corporate travel solutions", "Dedicated account management", "Fast response and personalized service"],
  commitmentTitle: "Our Commitment",
  commitmentText: "At A9 Global Travel & Tours, our commitment is simple: to deliver seamless travel experiences with professionalism, reliability, and care.",
  commitmentSubtext: "Whether you are planning a business trip, family holiday, corporate event, or marine crew movement, we are here to support your journey.",
  commitmentButtonLabel: "Book Now",
  commitmentButtonHref: "/book-now",
  certifications: [
    { title: "IATA Accredited", code: "05301026", image: "/images_v2/iata-logo.png" },
    { title: "Licensed Tour Operator", code: "T/O(YGN)-0946", image: "/images_v2/license-tour-operator.png" },
    { title: "Company Registration", code: "126395248", image: "/images_v2/company-registration.png" },
  ],
  journeyTitle: "Our Journey",
  journey: [
    { year: "2015", title: "Founded", desc: "A9 Global Travel & Tours established in Yangon" },
    { year: "2017", title: "IATA Accreditation", desc: "Official IATA certification received" },
    { year: "2019", title: "Expansion", desc: "Grew to 30+ tour packages across Myanmar" },
    { year: "2020", title: "Digital Transformation", desc: "Launched online booking platform" },
    { year: "2022", title: "Sky Lounge", desc: "Premium airport lounge service launched" },
    { year: "2024", title: "5000+ Travelers", desc: "Milestone of 5000 happy customers reached" },
    { year: "2026", title: "Premium Relaunch", desc: "Next-generation travel platform" },
  ],
};

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors";
const labelCls = "block text-white/60 text-xs font-medium mb-1 uppercase tracking-wider";
const cardCls = "bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6";
const btnGold =
  "px-4 py-2 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 transition-all";
const btnGhost =
  "px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm hover:border-white/25 transition-all";

export default function AdminAboutPage() {
  const { t } = useI18n();
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  const [about, setAbout] = useState<AboutConfig>(defaultAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [pendingUploadTarget, setPendingUploadTarget] = useState<string | null>(null);

  const set = useCallback((key: keyof AboutConfig, value: any) => {
    setAbout((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ── Load existing config ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/site-config", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = await res.json();
        if (d?.about) {
          setAbout((prev) => ({
            ...prev,
            ...d.about,
            values: Array.isArray(d.about.values) && d.about.values.length ? d.about.values : prev.values,
            services: Array.isArray(d.about.services) && d.about.services.length ? d.about.services : prev.services,
            whoWeAreText: Array.isArray(d.about.whoWeAreText) && d.about.whoWeAreText.length ? d.about.whoWeAreText : prev.whoWeAreText,
            whyChooseUs: Array.isArray(d.about.whyChooseUs) && d.about.whyChooseUs.length ? d.about.whyChooseUs : prev.whyChooseUs,
            certifications: Array.isArray(d.about.certifications) && d.about.certifications.length ? d.about.certifications : prev.certifications,
            journey: Array.isArray(d.about.journey) && d.about.journey.length ? d.about.journey : prev.journey,
            journeyTitle: d.about.journeyTitle || prev.journeyTitle,
          }));
        }
        if (d?.heroImages?.about) set("heroImage", d.heroImages.about);
      } catch { /* keep defaults */ }
      setLoading(false);
    })();
  }, []);

  // ── Upload ──
  const uploadFile = async (file: File, target: string) => {
    if (!file.type.startsWith("image/")) {
      setUploadError(t("admin.common.imgOnly"));
      return;
    }
    setUploadingKey(target);
    setUploadError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.uploads?.[0]) {
        const newUrl = `/api/upload?id=${data.uploads[0].id}`;
        if (target === "heroImage") {
          set("heroImage", newUrl);
        } else if (target.startsWith("cert:")) {
          const idx = Number(target.split(":")[1]);
          setAbout((prev) => {
            const certs = [...prev.certifications];
            certs[idx] = { ...certs[idx], image: newUrl };
            return { ...prev, certifications: certs };
          });
        }
      } else {
        setUploadError(data.error || t("admin.about.uploadFailTry"));
      }
    } catch {
      setUploadError(t("admin.about.uploadFailConn"));
    } finally {
      setUploadingKey(null);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && pendingUploadTarget) uploadFile(file, pendingUploadTarget);
    e.target.value = "";
    setPendingUploadTarget(null);
  };

  const openUploader = (target: string) => {
    setPendingUploadTarget(target);
    fileInputRef.current?.click();
  };

  // ── List helpers ──
  const addStringItem = (key: "services" | "whyChooseUs" | "whoWeAreText") =>
    set(key, [...about[key], ""]);
  const updateStringItem = (key: "services" | "whyChooseUs" | "whoWeAreText", idx: number, v: string) => {
    const arr = [...about[key]];
    arr[idx] = v;
    set(key, arr);
  };
  const removeStringItem = (key: "services" | "whyChooseUs" | "whoWeAreText", idx: number) =>
    set(key, about[key].filter((_, i) => i !== idx));

  const addValue = () => set("values", [...about.values, { title: "", desc: "", icon: "✨" }]);
  const updateValue = (idx: number, patch: Partial<ValueItem>) => {
    const arr = [...about.values];
    arr[idx] = { ...arr[idx], ...patch };
    set("values", arr);
  };
  const removeValue = (idx: number) => set("values", about.values.filter((_, i) => i !== idx));

  const addJourney = () => set("journey", [...about.journey, { year: "", title: "", desc: "" }]);
  const updateJourney = (idx: number, patch: Partial<JourneyItem>) => {
    const arr = [...about.journey];
    arr[idx] = { ...arr[idx], ...patch };
    set("journey", arr);
  };
  const removeJourney = (idx: number) => set("journey", about.journey.filter((_, i) => i !== idx));

  const addCert = () => set("certifications", [...about.certifications, { title: "", code: "", image: "" }]);
  const updateCert = (idx: number, patch: Partial<CertItem>) => {
    const arr = [...about.certifications];
    arr[idx] = { ...arr[idx], ...patch };
    set("certifications", arr);
  };
  const removeCert = (idx: number) => set("certifications", about.certifications.filter((_, i) => i !== idx));

  // ── Save (merge into existing site-config) ──
  const save = async () => {
    setSaving(true);
    setSavedMsg("");
    try {
      const res = await fetch("/api/admin/site-config", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const existing = await res.json();
      const payload = {
        ...existing,
        about: { ...about, heroImage: undefined },
        heroImages: { ...(existing.heroImages || {}), about: about.heroImage },
        certifications: about.certifications,
      };
      delete payload.about.heroImage;
      const put = await fetch("/api/admin/site-config", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await put.json();
      setSavedMsg(data.success ? t("admin.about.saved") : data.message || t("admin.about.saveFail"));
    } catch {
      setSavedMsg(t("admin.about.saveFailConn"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gold/70 animate-pulse text-lg">{t("admin.about.loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {t("admin.about.title")}
          </h1>
          <p className="text-white/60 text-sm mt-1">{t("admin.about.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && <span className="text-sm text-emerald-400">{savedMsg}</span>}
          <button onClick={save} disabled={saving} className={btnGold}>
            {saving ? t("admin.common.saving") : t("admin.about.saveBtn")}
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2">
          {uploadError}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* ─── Hero ─── */}
      <div className={cardCls}>
        <h2 className="text-lg font-bold text-white mb-4">{t("admin.about.heroSection")}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className={labelCls}>{t("admin.about.heroTitle")}</label>
              <input className={inputCls} value={about.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>{t("admin.about.heroSubtitle")}</label>
              <textarea className={inputCls} rows={3} value={about.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>{t("admin.about.heroImage")}</label>
            <div className="relative rounded-xl overflow-hidden border border-white/10 h-48 bg-white/5">
              {about.heroImage ? (
                <Image alt="Hero" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} src={about.heroImage} width={1600} height={900} sizes="100vw" />
              ) : (
                <div className="flex items-center justify-center h-full text-white/50 text-sm">{t("admin.about.noImage")}</div>
              )}
            </div>
            <button onClick={() => openUploader("heroImage")} disabled={uploadingKey === "heroImage"} className={`${btnGhost} mt-2 w-full`}>
              {uploadingKey === "heroImage" ? t("admin.form.uploading") : t("admin.about.uploadHero")}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Who We Are ─── */}
      <div className={cardCls}>
        <h2 className="text-lg font-bold text-white mb-4">{t("admin.about.whoWeAre")}</h2>
        <div className="space-y-3">
          {about.whoWeAreText.map((p, i) => (
            <div key={i} className="flex flex-col md:flex-row items-stretch md:items-start gap-2">
              <textarea className={inputCls} rows={2} value={p} onChange={(e) => updateStringItem("whoWeAreText", i, e.target.value)} />
              <button onClick={() => removeStringItem("whoWeAreText", i)} className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors flex-shrink-0">
                🗑️
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => addStringItem("whoWeAreText")} className={`${btnGhost} mt-3`}>{t("admin.about.addParagraph")}</button>
      </div>

      {/* ─── Mission & Vision ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cardCls}>
          <h2 className="text-lg font-bold text-white mb-4">{t("admin.about.mission")}</h2>
          <div className="space-y-3">
            <div><label className={labelCls}>{t("admin.about.title")}</label><input className={inputCls} value={about.missionTitle} onChange={(e) => set("missionTitle", e.target.value)} /></div>
            <div><label className={labelCls}>{t("admin.about.text")}</label><textarea className={inputCls} rows={4} value={about.missionText} onChange={(e) => set("missionText", e.target.value)} /></div>
          </div>
        </div>
        <div className={cardCls}>
          <h2 className="text-lg font-bold text-white mb-4">{t("admin.about.vision")}</h2>
          <div className="space-y-3">
            <div><label className={labelCls}>{t("admin.about.title")}</label><input className={inputCls} value={about.visionTitle} onChange={(e) => set("visionTitle", e.target.value)} /></div>
            <div><label className={labelCls}>{t("admin.about.text")}</label><textarea className={inputCls} rows={4} value={about.visionText} onChange={(e) => set("visionText", e.target.value)} /></div>
          </div>
        </div>
      </div>

      {/* ─── Values ─── */}
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">{t("admin.about.values")}</h2>
          <button onClick={addValue} className={btnGhost}>{t("admin.about.addValue")}</button>
        </div>
        <div className="mb-3"><label className={labelCls}>{t("admin.about.valuesSectionTitle")}</label><input className={inputCls} value={about.valuesTitle} onChange={(e) => set("valuesTitle", e.target.value)} /></div>
        <div className="space-y-3">
          {about.values.map((v, i) => (
            <div key={i} className="flex flex-col md:flex-row items-stretch md:items-start gap-2">
              <input className={`${inputCls} md:w-16 flex-shrink-0 text-center`} value={v.icon} onChange={(e) => updateValue(i, { icon: e.target.value })} title="Icon (emoji)" />
              <input className={inputCls} placeholder="Title" value={v.title} onChange={(e) => updateValue(i, { title: e.target.value })} />
              <input className={inputCls} placeholder="Description" value={v.desc} onChange={(e) => updateValue(i, { desc: e.target.value })} />
              <button onClick={() => removeValue(i)} className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors flex-shrink-0">🗑️</button>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Services ─── */}
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">{t("admin.about.services")}</h2>
          <button onClick={() => addStringItem("services")} className={btnGhost}>{t("admin.about.addService")}</button>
        </div>
        <div className="mb-3"><label className={labelCls}>{t("admin.about.servicesSectionTitle")}</label><input className={inputCls} value={about.servicesTitle} onChange={(e) => set("servicesTitle", e.target.value)} /></div>
        <div className="space-y-2">
          {about.services.map((s, i) => (
            <div key={i} className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
              <input className={inputCls} value={s} onChange={(e) => updateStringItem("services", i, e.target.value)} />
              <button onClick={() => removeStringItem("services", i)} className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors flex-shrink-0">🗑️</button>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Why Choose Us ─── */}
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">{t("admin.about.whyChooseUs")}</h2>
          <button onClick={() => addStringItem("whyChooseUs")} className={btnGhost}>{t("admin.about.addItem")}</button>
        </div>
        <div className="mb-3"><label className={labelCls}>{t("admin.about.sectionTitle")}</label><input className={inputCls} value={about.whyChooseUsTitle} onChange={(e) => set("whyChooseUsTitle", e.target.value)} /></div>
        <div className="space-y-2">
          {about.whyChooseUs.map((w, i) => (
            <div key={i} className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
              <input className={inputCls} value={w} onChange={(e) => updateStringItem("whyChooseUs", i, e.target.value)} />
              <button onClick={() => removeStringItem("whyChooseUs", i)} className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors flex-shrink-0">🗑️</button>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Our Journey ─── */}
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">{t("admin.about.journey")}</h2>
          <button onClick={addJourney} className={btnGhost}>{t("admin.about.addMilestone")}</button>
        </div>
        <div className="mb-3">
          <label className={labelCls}>{t("admin.about.journeySectionTitle")}</label>
          <input className={inputCls} value={about.journeyTitle} onChange={(e) => set("journeyTitle", e.target.value)} />
        </div>
        <div className="space-y-3">
          {about.journey.map((m, i) => (
            <div key={i} className="flex flex-col md:flex-row items-stretch md:items-start gap-2 bg-white/[0.03] border border-white/10 rounded-xl p-3">
              <input className={`${inputCls} md:w-24 flex-shrink-0`} placeholder="Year (e.g. 2015)" value={m.year} onChange={(e) => updateJourney(i, { year: e.target.value })} />
              <input className={inputCls} placeholder="Title (e.g. Founded)" value={m.title} onChange={(e) => updateJourney(i, { title: e.target.value })} />
              <input className={inputCls} placeholder="Description" value={m.desc} onChange={(e) => updateJourney(i, { desc: e.target.value })} />
              <button onClick={() => removeJourney(i)} className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors flex-shrink-0">🗑️</button>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Commitment ─── */}
      <div className={cardCls}>
        <h2 className="text-lg font-bold text-white mb-4">{t("admin.about.commitment")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><label className={labelCls}>{t("admin.about.title")}</label><input className={inputCls} value={about.commitmentTitle} onChange={(e) => set("commitmentTitle", e.target.value)} /></div>
          <div><label className={labelCls}>{t("admin.about.buttonLabel")}</label><input className={inputCls} value={about.commitmentButtonLabel} onChange={(e) => set("commitmentButtonLabel", e.target.value)} /></div>
          <div className="md:col-span-2"><label className={labelCls}>{t("admin.about.text")}</label><textarea className={inputCls} rows={2} value={about.commitmentText} onChange={(e) => set("commitmentText", e.target.value)} /></div>
          <div className="md:col-span-2"><label className={labelCls}>{t("admin.about.subtext")}</label><textarea className={inputCls} rows={2} value={about.commitmentSubtext} onChange={(e) => set("commitmentSubtext", e.target.value)} /></div>
          <div className="md:col-span-2"><label className={labelCls}>{t("admin.about.buttonHref")}</label><input className={inputCls} value={about.commitmentButtonHref} onChange={(e) => set("commitmentButtonHref", e.target.value)} /></div>
        </div>
      </div>

      {/* ─── Certifications ─── */}
      <div className={cardCls}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">{t("admin.about.certs")}</h2>
          <button onClick={addCert} className={btnGhost}>{t("admin.about.addCert")}</button>
        </div>
        <div className="space-y-3">
          {about.certifications.map((c, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 bg-white/[0.03] border border-white/10 rounded-xl p-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex-shrink-0 flex items-center justify-center">
                {c.image ? (
                  <Image alt={c.title} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} src={c.image} width={1600} height={900} sizes="100vw" />
                ) : (
                  <span className="text-white/20 text-lg">🏅</span>
                )}
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                <input className={inputCls} placeholder={t("admin.about.phCertTitle")} value={c.title} onChange={(e) => updateCert(i, { title: e.target.value })} />
                <input className={inputCls} placeholder={t("admin.about.phCertCode")} value={c.code} onChange={(e) => updateCert(i, { code: e.target.value })} />
              </div>
              <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0">
                <button onClick={() => openUploader(`cert:${i}`)} disabled={uploadingKey === `cert:${i}`} className={`${btnGhost} text-xs px-3 py-1.5`}>
                  {uploadingKey === `cert:${i}` ? "..." : "📤"}
                </button>
                <button onClick={() => removeCert(i)} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Sticky Save Bar ─── */}
      <div className="sticky bottom-4 flex items-center justify-end gap-3 bg-[#0A1628]/90 backdrop-blur border border-white/10 rounded-xl px-5 py-3">
        {savedMsg && <span className="text-sm text-emerald-400 flex-1">{savedMsg}</span>}
        <button onClick={save} disabled={saving} className={btnGold}>
          {saving ? t("admin.common.saving") : t("admin.about.saveBtn")}
        </button>
      </div>
    </div>
  );
}
