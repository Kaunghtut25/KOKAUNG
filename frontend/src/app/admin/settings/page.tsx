"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";
interface HeroImages {
  flights: string;
  cruises: string;
  home: string;
  tours: string;
  hotels: string;
  cars: string;
  visas: string;
  insurance: string;
}

interface Certification {
  title: string;
  code: string;
  image: string;
}

interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

interface SiteSettings {
  logo: string;
  siteTitle: string;
  tagline: string;
  footerText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: SocialLinks;
  heroImages: HeroImages;
  certifications: Certification[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

const defaultSettings: SiteSettings = {
  logo: "",
  siteTitle: "A9 Global Travel",
  tagline: "Your Journey, Our Passion",
  footerText: "© 2026 A9 Global Travel. All rights reserved.",
  contactEmail: "a9ticketing@a9globaltravel.com.mm",
  contactPhone: "959 781 617 111",
  contactAddress: "No-18, Ground Floor, Zayya Waddy Street, Baho Road, Sanchaung Tsp, Yangon, Myanmar",
  socialLinks: {
    facebook: "https://facebook.com/a9globaltravel",
    instagram: "https://instagram.com/a9globaltravel",
    twitter: "https://twitter.com/a9globaltravel",
    youtube: "https://youtube.com/@a9globaltravel",
  },
  heroImages: {
    home: "",
    tours: "",
    hotels: "",
    cars: "",
    visas: "",
    insurance: "",
    flights: "",
    cruises: "",
  },
  certifications: [
    { title: "IATA Accredited", code: "05301026", image: "/images_v2/iata-logo.png" },
    { title: "Licensed Tour Operator", code: "T/O(YGN)-0946", image: "/images_v2/license-tour-operator.png" },
    { title: "Company Registration", code: "126395248", image: "/images_v2/company-registration.png" },
  ],
};

const themeColors = [
  { name: "Deep Blue (Background)", color: "#0A1628" },
  { name: "Gold (Primary)", color: "#D4AF37" },
  { name: "Light Gold (Hover)", color: "#F0D060" },
  { name: "Deep Blue Dark", color: "#060E1A" },
  { name: "White (Text)", color: "#FFFFFF" },
];

const heroPageLabels: Record<keyof HeroImages, string> = {
  home: "Home Page",
  tours: "Tours Page",
  hotels: "Hotels Page",
  cars: "Cars Page",
  visas: "Visas Page",
  insurance: "Insurance Page",
  flights: "Flights",
  cruises: "Cruises",
};

export default function AdminSettingsPage() {
  const { t } = useI18n();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "hero" | "social" | "certs" | "theme" | "chat">("general");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [logoUrlInput, setLogoUrlInput] = useState("");
// Live Chat config tab state (admin-configured AI provider / keys / model)
  const [chatCfg, setChatCfg] = useState({
    provider: "auto" as "auto" | "openai" | "anthropic" | "ollama",
    openaiApiKey: "",
    openaiBaseUrl: "",
    openaiModel: "",
    anthropicApiKey: "",
    anthropicModel: "",
    ollamaBaseUrl: "",
    ollamaModel: "",
  });
  const [chatMeta, setChatMeta] = useState({
    openaiApiKeySet: false,
    openaiApiKeyPreview: "",
    anthropicApiKeySet: false,
    anthropicApiKeyPreview: "",
  });
  const [chatEnv, setChatEnv] = useState<{
    openaiBaseUrl: string;
    openaiModel: string;
    anthropicModel: string;
    ollamaBaseUrl: string;
    ollamaModel: string;
    openaiApiKeySet: boolean;
    anthropicApiKeySet: boolean;
  } | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSaving, setChatSaving] = useState(false);
  const [removeOpenaiKey, setRemoveOpenaiKey] = useState(false);
  const [removeAnthropicKey, setRemoveAnthropicKey] = useState(false);
  

  const [token, setToken] = useState("");
  useEffect(() => { setToken(localStorage.getItem("admin_token") || ""); }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Merge with defaults to ensure all keys exist
        const certsFromConfig = await fetch(`${API_BASE}/admin/site-config`).then(r => r.json()).catch(() => null);
        const configCerts = certsFromConfig && Array.isArray(certsFromConfig.certifications) && certsFromConfig.certifications.length ? certsFromConfig.certifications : null;
        setSettings({
          ...defaultSettings,
          ...data,
          socialLinks: { ...defaultSettings.socialLinks, ...(data.socialLinks || {}) },
          heroImages: { ...defaultSettings.heroImages, ...(data.heroImages || {}) },
          certifications: configCerts || (data.certifications != null ? data.certifications : defaultSettings.certifications),
        });
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const uploadFileToUrl = async (file: File): Promise<string> => {
    if (!file.type.startsWith("image/")) {
      showToast(t("admin.common.imgOnly"), "error");
      return "";
    }
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      const blob = data.uploads?.[0];
      return blob.url;
    } catch {
      showToast(t("admin.settings.uploadFailConn"), "error");
      return "";
    }
  };

  const uploadFile = async (file: File, target: "logo" | keyof HeroImages) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are accepted.");
      showToast(t("admin.common.imgOnly"), "error");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      const blob = data.uploads?.[0];
      const url = blob.url;
      if (target === "logo") {
        setSettings((prev) => ({ ...prev, logo: url }));
      } else {
        setSettings((prev) => ({
          ...prev,
          heroImages: { ...prev.heroImages, [target]: url },
        }));
      }
    } catch {
      setUploadError("Upload failed. Try URL paste instead.");
      showToast(t("admin.common.uploadFailPaste"), "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };

  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast(t("admin.settings.imgUnder5"), "error");
      return;
    }
    // Show local preview first
    const reader = new FileReader();
    reader.onload = () => {
      setSettings((prev) => ({ ...prev, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
    // Upload to server
    uploadFile(file, "logo");
  };

  const handleHeroDrop = (page: keyof HeroImages, e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast(t("admin.settings.imgUnder5"), "error");
      return;
    }
    // Show local preview first
    const reader = new FileReader();
    reader.onload = () => {
      setSettings((prev) => ({
        ...prev,
        heroImages: { ...prev.heroImages, [page]: reader.result as string },
      }));
    };
    reader.readAsDataURL(file);
    // Upload to server
    uploadFile(file, page);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        // Also save to localStorage for client-side access
        localStorage.setItem("site_settings", JSON.stringify(settings));
        // Persist certifications into site-config (the store the About page reads)
        try {
          const current = await fetch(`${API_BASE}/admin/site-config`).then(r => r.json()).catch(() => null);
          if (current) {
            await fetch(`${API_BASE}/admin/site-config`, {
              method: "PUT",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ ...current, certifications: settings.certifications }),
            });
          }
        } catch (err) { console.error("Certifications sync failed:", err); }
        showToast(t("admin.settings.savedOk"), "success");
      } else {
        showToast(t("admin.settings.saveFailed"), "error");
      }
    } catch (err) {
      console.error("Save failed:", err);
      showToast(t("admin.settings.saveFailed"), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast(t("admin.settings.imgUnder5"), "error");
      return;
    }
    // Show local preview first
    const reader = new FileReader();
    reader.onload = () => {
      setSettings((prev) => ({ ...prev, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
    // Upload to server
    await uploadFile(file, "logo");
  };

  const handleHeroImageChange = (page: keyof HeroImages, value: string) => {
    setSettings((prev) => ({
      ...prev,
      heroImages: { ...prev.heroImages, [page]: value },
    }));
  };

  const handleHeroImageUpload = async (page: keyof HeroImages, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast(t("admin.settings.imgUnder5"), "error");
      return;
    }
    // Show local preview first
    const reader = new FileReader();
    reader.onload = () => {
      setSettings((prev) => ({
        ...prev,
        heroImages: { ...prev.heroImages, [page]: reader.result as string },
      }));
    };
    reader.readAsDataURL(file);
    // Upload to server
    await uploadFile(file, page);
  };

  const fetchChatConfig = useCallback(async () => {
    setChatLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/chat-config`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const d = await res.json();
        setChatCfg((prev) => ({
          ...prev,
          provider: d.provider === "openai" || d.provider === "anthropic" || d.provider === "ollama" ? d.provider : "auto",
          openaiBaseUrl: d.openaiBaseUrl || "",
          openaiModel: d.openaiModel || "",
          anthropicModel: d.anthropicModel || "",
          ollamaBaseUrl: d.ollamaBaseUrl || "",
          ollamaModel: d.ollamaModel || "",
        }));
        setChatMeta({
          openaiApiKeySet: !!d.openaiApiKeySet,
          openaiApiKeyPreview: d.openaiApiKeyPreview || "",
          anthropicApiKeySet: !!d.anthropicApiKeySet,
          anthropicApiKeyPreview: d.anthropicApiKeyPreview || "",
        });
        setChatEnv(d.env || null);
        setRemoveOpenaiKey(false);
        setRemoveAnthropicKey(false);
      }
    } catch (err) {
      console.error("Failed to fetch chat config:", err);
    } finally {
      setChatLoading(false);
    }
  }, [token]);

  const handleChatSave = async () => {
    setChatSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/chat-config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...chatCfg,
          openaiApiKey: removeOpenaiKey ? "__CLEAR__" : chatCfg.openaiApiKey,
          anthropicApiKey: removeAnthropicKey ? "__CLEAR__" : chatCfg.anthropicApiKey,
        }),
      });
      if (res.ok) {
        showToast(t("admin.settings.chatSavedOk"), "success");
        setChatCfg((prev) => ({ ...prev, openaiApiKey: "", anthropicApiKey: "" }));
        await fetchChatConfig();
      } else {
        showToast(t("admin.settings.chatSaveFailed"), "error");
      }
    } catch (err) {
      console.error("Chat config save failed:", err);
      showToast(t("admin.settings.chatSaveFailed"), "error");
    } finally {
      setChatSaving(false);
    }
  };

  // Load chat config lazily when the tab is opened
  useEffect(() => {
    if (activeTab === "chat") fetchChatConfig();
  }, [activeTab, fetchChatConfig]);

  const renderGeneralTab = () => (
    <div className="space-y-6">
      {/* Logo Section */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gold mb-4">{t("admin.settings.siteLogo")}</h3>
        <div className="flex items-start gap-6">
          <div className="w-[180px] h-[80px] rounded-lg border border-white/20 bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0" onDragOver={handleDragOver} onDrop={handleLogoDrop}>
            {settings.logo ? (
              <Image alt="Logo" className="max-w-full max-h-full object-contain p-2" src={settings.logo} width={1600} height={900} sizes="100vw" />
            ) : (
              <div className="text-white/20 text-center">
                <span className="text-3xl block">🏷️</span>
                <span className="text-xs">{t("admin.settings.noLogo")}</span>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-white/50 text-sm">{t("admin.settings.logoHint")}</p>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              id="logo-upload"
            />
            <div className="flex gap-3">
              <label
                htmlFor="logo-upload"
                className="px-4 py-2 rounded-lg bg-gold/10 text-gold text-sm font-medium hover:bg-gold/20 transition-colors cursor-pointer"
              >
                📁 Upload Logo
              </label>
              <input
                type="text"
                value={logoUrlInput}
                onChange={(e) => {
                  setLogoUrlInput(e.target.value);
                  setSettings((prev) => ({ ...prev, logo: e.target.value }));
                }}
                placeholder="Or paste logo URL"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors"
              />
              {settings.logo && (
                <button
                  onClick={() => setSettings((prev) => ({ ...prev, logo: "" }))}
                  className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            {uploading && (
              <p className="text-white/60 text-xs flex items-center gap-2">
                <span className="animate-spin">⏳</span> Uploading...
              </p>
            )}
            {uploadError && (
              <p className="text-red-400 text-xs">{uploadError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Site Text */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gold mb-4">{t("admin.settings.siteText")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/60 text-sm mb-1">{t("admin.settings.siteTitle")}</label>
            <input
              type="text"
              value={settings.siteTitle}
              onChange={(e) => setSettings((prev) => ({ ...prev, siteTitle: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1">{t("admin.settings.tagline")}</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings((prev) => ({ ...prev, tagline: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-white/60 text-sm mb-1">{t("admin.settings.footerText")}</label>
          <input
            type="text"
            value={settings.footerText}
            onChange={(e) => setSettings((prev) => ({ ...prev, footerText: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gold mb-4">{t("admin.settings.contactInfo")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/60 text-sm mb-1">Email</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings((prev) => ({ ...prev, contactEmail: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1">Phone</label>
            <input
              type="text"
              value={settings.contactPhone}
              onChange={(e) => setSettings((prev) => ({ ...prev, contactPhone: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-white/60 text-sm mb-1">{t("admin.settings.address")}</label>
          <textarea
            value={settings.contactAddress}
            onChange={(e) => setSettings((prev) => ({ ...prev, contactAddress: e.target.value }))}
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );

  const renderHeroTab = () => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gold mb-4">{t("admin.settings.heroImages")}</h3>
      <p className="text-white/60 text-sm mb-6">
        Set hero background images for each page. Provide a URL or upload an image. Recommended: 1920×600px, max 5MB.
      </p>
      <div className="space-y-6">
        {(Object.keys(settings.heroImages) as (keyof HeroImages)[]).map((page) => (
          <div key={page} className="bg-white/[0.03] border border-white/5 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="w-[200px] h-[100px] rounded-lg border border-white/10 bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center" onDragOver={handleDragOver} onDrop={(e) => handleHeroDrop(page, e)}>
                {settings.heroImages[page] ? (
                  <Image alt={`${heroPageLabels[page]} hero`} className="w-full h-full object-cover" onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        const fb = parent.querySelector(".hero-fallback");
                        if (fb) (fb as HTMLElement).style.display = "flex";
                      }
                    }} src={settings.heroImages[page]} width={1600} height={900} sizes="100vw" />
                ) : null}
                <div className={`hero-fallback text-white/20 text-xs ${settings.heroImages[page] ? "hidden" : "flex"} items-center justify-center w-full h-full flex-col`}>
                  <span className="text-2xl">🖼️</span>
                  <span>{t("admin.settings.noImageSet")}</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <label className="block text-white/80 font-medium text-sm">
                  {heroPageLabels[page]}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.heroImages[page]}
                    onChange={(e) => handleHeroImageChange(page, e.target.value)}
                    placeholder="Or paste image URL"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleHeroImageUpload(page, e)}
                    className="hidden"
                    id={`hero-upload-${page}`}
                  />
                  <label
                    htmlFor={`hero-upload-${page}`}
                    className="px-4 py-2 rounded-lg bg-gold/10 text-gold text-sm font-medium hover:bg-gold/20 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    📁
                  </label>
                  {settings.heroImages[page] && (
                    <button
                      onClick={() => handleHeroImageChange(page, "")}
                      className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {uploading && (
                  <p className="text-white/60 text-xs flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Uploading...
                  </p>
                )}
                {uploadError && (
                  <p className="text-red-400 text-xs">{uploadError}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSocialTab = () => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gold mb-4">{t("admin.settings.socialLinks")}</h3>
      <p className="text-white/60 text-sm mb-6">
        {t("admin.settings.socialHint")}
      </p>
      <div className="space-y-4">
        {(
          [
            { key: "facebook" as keyof SocialLinks, label: "Facebook", icon: "📘" },
            { key: "instagram" as keyof SocialLinks, label: "Instagram", icon: "📷" },
            { key: "twitter" as keyof SocialLinks, label: "Twitter / X", icon: "🐦" },
            { key: "youtube" as keyof SocialLinks, label: "YouTube", icon: "▶️" },
          ]
        ).map(({ key, label, icon }) => (
          <div key={key}>
            <label className="block text-white/60 text-sm mb-1">
              {icon} {label}
            </label>
            <input
              type="url"
              value={settings.socialLinks[key] || ""}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, [key]: e.target.value },
                }))
              }
              placeholder={`https://${key}.com/a9global`}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderThemeTab = () => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gold mb-2">{t("admin.settings.themeColors")}</h3>
      <p className="text-white/60 text-sm mb-6">
        {t("admin.settings.themeHint")}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {themeColors.map((tc) => (
          <div
            key={tc.name}
            className="bg-white/[0.03] border border-white/10 rounded-lg p-4 text-center"
          >
            <div
              className="w-full h-12 rounded-lg border border-white/20 mb-3"
              style={{ backgroundColor: tc.color }}
            />
            <p className="text-white/70 text-xs font-medium">{tc.name}</p>
            <p className="text-white/50 text-xs font-mono mt-1">{tc.color}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCertificationsTab = () => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gold mb-2">{t("admin.settings.certs")}</h3>
      <p className="text-white/60 text-sm mb-6">
        {t("admin.settings.certsHint")}
      </p>
      <div className="space-y-4">
        {settings.certifications.length === 0 && (
          <p className="text-white/60 text-sm">{t("admin.settings.noCerts")}</p>
        )}
        {settings.certifications.map((cert, idx) => (
          <div key={idx} className="bg-white/[0.03] border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-xs font-medium">{t("admin.settings.certNum")} {idx + 1}</span>
              <button
                type="button"
                onClick={() => {
                  const updated = [...settings.certifications];
                  updated.splice(idx, 1);
                  setSettings((prev) => ({ ...prev, certifications: updated }));
                }}
                className="text-red-400 hover:text-red-300 text-xs font-medium px-2 py-1 rounded hover:bg-red-400/10 transition-colors"
              >
                {t("admin.settings.delete")}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-white/60 text-xs mb-1">{t("admin.settings.titleLbl")}</label>
                <input
                  type="text"
                  value={cert.title}
                  onChange={(e) => {
                    const updated = [...settings.certifications];
                    updated[idx] = { ...updated[idx], title: e.target.value };
                    setSettings((prev) => ({ ...prev, certifications: updated }));
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">{t("admin.settings.codeNumber")}</label>
                <input
                  type="text"
                  value={cert.code}
                  onChange={(e) => {
                    const updated = [...settings.certifications];
                    updated[idx] = { ...updated[idx], code: e.target.value };
                    setSettings((prev) => ({ ...prev, certifications: updated }));
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cert.image}
                    onChange={(e) => {
                      const updated = [...settings.certifications];
                      updated[idx] = { ...updated[idx], image: e.target.value };
                      setSettings((prev) => ({ ...prev, certifications: updated }));
                    }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="/images_v2/cert.png"
                  />
                  <input
                    ref={(el) => { fileInputRefs.current[idx] = el; }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = await uploadFileToUrl(file);
                      if (url) {
                        showToast(t("admin.settings.imgUploaded"), "success");
                        const updated = [...settings.certifications];
                        updated[idx] = { ...updated[idx], image: url };
                        setSettings((prev) => ({ ...prev, certifications: updated }));
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[idx]?.click()}
                    className="px-3 py-2 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-colors whitespace-nowrap"
                  >
                    {t("admin.settings.upload")}
                  </button>
                </div>
                {cert.image && (
                  <div className="mt-2 w-12 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                    <Image alt={cert.title} className="w-full h-full object-contain" src={cert.image} width={1600} height={900} sizes="100vw" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setSettings((prev) => ({ ...prev, certifications: [...prev.certifications, { title: "", code: "", image: "" }] }))}
          className="w-full py-2.5 rounded-lg border border-dashed border-gold/30 text-gold text-sm font-medium hover:bg-gold/10 transition-colors"
        >
          {t("admin.settings.addCert")}
        </button>
      </div>
    </div>
  );
const renderChatTab = () => (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gold mb-2">{t("admin.settings.chatTitle")}</h3>
        <p className="text-white/60 text-sm mb-6">{t("admin.settings.chatSubtitle")}</p>

        {chatLoading ? (
          <p className="text-gold/70 animate-pulse text-sm">{t("admin.settings.chatLoading")}</p>
        ) : (
          <>
            {/* Provider */}
            <div className="mb-6">
              <label className="block text-white/60 text-xs mb-1">{t("admin.settings.chatProvider")}</label>
              <select
                value={chatCfg.provider}
                onChange={(e) => setChatCfg((prev) => ({ ...prev, provider: e.target.value as typeof prev.provider }))}
                className="w-full md:w-80 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
              >
                <option value="auto" className="bg-deepblue">{t("admin.settings.chatProviderAuto")}</option>
                <option value="openai" className="bg-deepblue">{t("admin.settings.chatProviderOpenAI")}</option>
                <option value="anthropic" className="bg-deepblue">{t("admin.settings.chatProviderAnthropic")}</option>
                <option value="ollama" className="bg-deepblue">{t("admin.settings.chatProviderOllama")}</option>
              </select>
            </div>

            {/* OpenAI */}
            <div className="bg-white/[0.03] border border-white/10 rounded-lg p-4 mb-4 space-y-3">
              <h4 className="text-sm font-semibold text-white/80">{t("admin.settings.chatOpenaiSection")}</h4>
              <div>
                <label className="block text-white/60 text-xs mb-1">{t("admin.settings.chatOpenaiKey")}</label>
                <div className="flex gap-2 items-start">
                  <input
                    type="password"
                    value={chatCfg.openaiApiKey}
                    onChange={(e) => setChatCfg((prev) => ({ ...prev, openaiApiKey: e.target.value }))}
                    placeholder={chatMeta.openaiApiKeySet ? chatMeta.openaiApiKeyPreview : ""}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors"
                    autoComplete="off"
                  />
                  {chatMeta.openaiApiKeySet && (
                    <button
                      type="button"
                      onClick={() => setRemoveOpenaiKey((v) => !v)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        removeOpenaiKey ? "bg-red-500/20 text-red-300" : "bg-white/5 text-white/60 hover:text-white"
                      }`}
                    >
                      {removeOpenaiKey ? "✓" : "✕"} {t("admin.settings.chatRemoveKey")}
                    </button>
                  )}
                </div>
                <p className="text-white/40 text-xs mt-1">
                  {chatMeta.openaiApiKeySet
                    ? `${t("admin.settings.chatKeySet")} ${chatMeta.openaiApiKeyPreview}`
                    : t("admin.settings.chatKeyNotSet")}
                  {" · "}
                  {t("admin.settings.chatKeepKeyHint")}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 text-xs mb-1">{t("admin.settings.chatOpenaiBaseUrl")}</label>
                  <input
                    type="text"
                    value={chatCfg.openaiBaseUrl}
                    onChange={(e) => setChatCfg((prev) => ({ ...prev, openaiBaseUrl: e.target.value }))}
                    placeholder={chatEnv?.openaiBaseUrl || "https://api.openai.com/v1"}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">{t("admin.settings.chatOpenaiModel")}</label>
                  <input
                    type="text"
                    value={chatCfg.openaiModel}
                    onChange={(e) => setChatCfg((prev) => ({ ...prev, openaiModel: e.target.value }))}
                    placeholder={chatEnv?.openaiModel || "gpt-4o-mini"}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Anthropic */}
            <div className="bg-white/[0.03] border border-white/10 rounded-lg p-4 mb-4 space-y-3">
              <h4 className="text-sm font-semibold text-white/80">{t("admin.settings.chatAnthropicSection")}</h4>
              <div>
                <label className="block text-white/60 text-xs mb-1">{t("admin.settings.chatAnthropicKey")}</label>
                <div className="flex gap-2 items-start">
                  <input
                    type="password"
                    value={chatCfg.anthropicApiKey}
                    onChange={(e) => setChatCfg((prev) => ({ ...prev, anthropicApiKey: e.target.value }))}
                    placeholder={chatMeta.anthropicApiKeySet ? chatMeta.anthropicApiKeyPreview : ""}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors"
                    autoComplete="off"
                  />
                  {chatMeta.anthropicApiKeySet && (
                    <button
                      type="button"
                      onClick={() => setRemoveAnthropicKey((v) => !v)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        removeAnthropicKey ? "bg-red-500/20 text-red-300" : "bg-white/5 text-white/60 hover:text-white"
                      }`}
                    >
                      {removeAnthropicKey ? "✓" : "✕"} {t("admin.settings.chatRemoveKey")}
                    </button>
                  )}
                </div>
                <p className="text-white/40 text-xs mt-1">
                  {chatMeta.anthropicApiKeySet
                    ? `${t("admin.settings.chatKeySet")} ${chatMeta.anthropicApiKeyPreview}`
                    : t("admin.settings.chatKeyNotSet")}
                  {" · "}
                  {t("admin.settings.chatKeepKeyHint")}
                </p>
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">{t("admin.settings.chatAnthropicModel")}</label>
                <input
                  type="text"
                  value={chatCfg.anthropicModel}
                  onChange={(e) => setChatCfg((prev) => ({ ...prev, anthropicModel: e.target.value }))}
                  placeholder={chatEnv?.anthropicModel || "claude-3-5-sonnet-latest"}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
            </div>

            {/* Ollama (local) */}
            <div className="bg-white/[0.03] border border-white/10 rounded-lg p-4 mb-4 space-y-3">
              <h4 className="text-sm font-semibold text-white/80">{t("admin.settings.chatOllamaSection")}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 text-xs mb-1">{t("admin.settings.chatOllamaBaseUrl")}</label>
                  <input
                    type="text"
                    value={chatCfg.ollamaBaseUrl}
                    onChange={(e) => setChatCfg((prev) => ({ ...prev, ollamaBaseUrl: e.target.value }))}
                    placeholder={chatEnv?.ollamaBaseUrl || "http://localhost:11434/v1"}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">{t("admin.settings.chatOllamaModel")}</label>
                  <input
                    type="text"
                    value={chatCfg.ollamaModel}
                    onChange={(e) => setChatCfg((prev) => ({ ...prev, ollamaModel: e.target.value }))}
                    placeholder={chatEnv?.ollamaModel || "qwen2.5-coder:3b"}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <p className="text-white/40 text-xs mb-4">{t("admin.settings.chatKeyHint")}</p>

            <button
              onClick={handleChatSave}
              disabled={chatSaving}
              className="px-6 py-2.5 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {chatSaving ? (
                <>
                  <span className="animate-spin">⏳</span> {t("admin.common.saving")}
                </>
              ) : (
                <>
                  <span>💾</span> {t("admin.settings.chatSave")}
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gold/70 animate-pulse text-lg">{t("admin.settings.loading")}</div>
      </div>
    );
  }

  const tabs = [
    { key: "general", labelKey: "admin.settings.tabGeneral", icon: "⚙️" },
    // Hero Images moved to Site Manager (uses /api/admin/site-config)
    // { key: "hero", label: "🖼️ Hero Images", icon: "🖼️" },
    { key: "social", labelKey: "admin.settings.tabSocial", icon: "🔗" },
    { key: "certs", labelKey: "admin.settings.tabCerts", icon: "🏅" },
    { key: "theme", labelKey: "admin.settings.tabTheme", icon: "🎨" },
    { key: "chat", labelKey: "admin.settings.tabChat", icon: "🤖" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg text-sm font-medium shadow-lg transition-all ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-3xl md:text-4xl font-bold text-[#D4AF37]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {t("admin.siteSettings")}
          </h1>
          <p className="text-white/60 text-sm mt-1">
            {t("admin.settings.subtitle")}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {saving ? (
            <>
              <span className="animate-spin">⏳</span> {t("admin.common.saving")}
            </>
          ) : (
            <>
              <span>💾</span> {t("admin.users.saveChanges")}
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/10 w-fit flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-gold text-deepblue"
                : "text-white/50 hover:text-white"
            }`}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "general" && renderGeneralTab()}
      {activeTab === "hero" && renderHeroTab()}
      {activeTab === "social" && renderSocialTab()}
      {activeTab === "certs" && renderCertificationsTab()}
      {activeTab === "theme" && renderThemeTab()}
      {activeTab === "chat" && renderChatTab()}
    </div>
  );
}
