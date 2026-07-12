"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";

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
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

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
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "hero" | "social" | "theme">("general");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Merge with defaults to ensure all keys exist
        setSettings({
          ...defaultSettings,
          ...data,
          socialLinks: { ...defaultSettings.socialLinks, ...(data.socialLinks || {}) },
          heroImages: { ...defaultSettings.heroImages, ...(data.heroImages || {}) },
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
        showToast("Settings saved successfully!", "success");
      } else {
        showToast("Failed to save settings", "error");
      }
    } catch (err) {
      console.error("Save failed:", err);
      showToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be under 5MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSettings((prev) => ({ ...prev, logo: reader.result as string }));
    };
    reader.onerror = () => showToast("Failed to read image", "error");
    reader.readAsDataURL(file);
  };

  const handleHeroImageChange = (page: keyof HeroImages, value: string) => {
    setSettings((prev) => ({
      ...prev,
      heroImages: { ...prev.heroImages, [page]: value },
    }));
  };

  const handleHeroImageUpload = (page: keyof HeroImages, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be under 5MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      handleHeroImageChange(page, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      {/* Logo Section */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gold mb-4">Site Logo</h3>
        <div className="flex items-start gap-6">
          <div className="w-[180px] h-[80px] rounded-lg border border-white/20 bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
            {settings.logo ? (
              <img src={settings.logo} alt="Logo" className="max-w-full max-h-full object-contain p-2" />
            ) : (
              <div className="text-white/20 text-center">
                <span className="text-3xl block">🏷️</span>
                <span className="text-xs">No logo</span>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-white/50 text-sm">Upload a logo for your site. Recommended size: 200×80px, max 5MB.</p>
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
              {settings.logo && (
                <button
                  onClick={() => setSettings((prev) => ({ ...prev, logo: "" }))}
                  className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Site Text */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gold mb-4">Site Text</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/60 text-sm mb-1">Site Title</label>
            <input
              type="text"
              value={settings.siteTitle}
              onChange={(e) => setSettings((prev) => ({ ...prev, siteTitle: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1">Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings((prev) => ({ ...prev, tagline: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-white/60 text-sm mb-1">Footer Text</label>
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
        <h3 className="text-lg font-semibold text-gold mb-4">Contact Information</h3>
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
          <label className="block text-white/60 text-sm mb-1">Address</label>
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
      <h3 className="text-lg font-semibold text-gold mb-4">Hero Section Images</h3>
      <p className="text-white/40 text-sm mb-6">
        Set hero background images for each page. Provide a URL or upload an image (max 5MB).
      </p>
      <div className="space-y-6">
        {(Object.keys(settings.heroImages) as (keyof HeroImages)[]).map((page) => (
          <div key={page} className="bg-white/[0.03] border border-white/5 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="w-[200px] h-[100px] rounded-lg border border-white/10 bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {settings.heroImages[page] ? (
                  <img
                    src={settings.heroImages[page]}
                    alt={`${heroPageLabels[page]} hero`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        const fb = parent.querySelector(".hero-fallback");
                        if (fb) (fb as HTMLElement).style.display = "flex";
                      }
                    }}
                  />
                ) : null}
                <div className={`hero-fallback text-white/20 text-xs ${settings.heroImages[page] ? "hidden" : "flex"} items-center justify-center w-full h-full flex-col`}>
                  <span className="text-2xl">🖼️</span>
                  <span>No image set</span>
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
                    placeholder="https://... or pick a file below"
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSocialTab = () => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gold mb-4">Social Media Links</h3>
      <p className="text-white/40 text-sm mb-6">
        Add links to your social media profiles. Leave empty to hide from the footer.
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
      <h3 className="text-lg font-semibold text-gold mb-2">Theme Colors</h3>
      <p className="text-white/40 text-sm mb-6">
        Current theme colors are read-only. Changes to theme require developer access.
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
            <p className="text-white/30 text-xs font-mono mt-1">{tc.color}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gold/70 animate-pulse text-lg">Loading settings...</div>
      </div>
    );
  }

  const tabs = [
    { key: "general", label: "🏷️ General", icon: "⚙️" },
    { key: "hero", label: "🖼️ Hero Images", icon: "🖼️" },
    { key: "social", label: "🌐 Social Links", icon: "🔗" },
    { key: "theme", label: "🎨 Theme Colors", icon: "🎨" },
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
            Site Settings
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Control your website appearance and content
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {saving ? (
            <>
              <span className="animate-spin">⏳</span> Saving...
            </>
          ) : (
            <>
              <span>💾</span> Save Changes
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
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "general" && renderGeneralTab()}
      {activeTab === "hero" && renderHeroTab()}
      {activeTab === "social" && renderSocialTab()}
      {activeTab === "theme" && renderThemeTab()}
    </div>
  );
}
