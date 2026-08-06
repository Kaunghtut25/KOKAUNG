"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const quickLinks = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.tours", href: "/tours" },
  { labelKey: "nav.hotels", href: "/hotels" },
  { labelKey: "footer.carRentals", href: "/cars" },
  { labelKey: "nav.buses", href: "/buses" },
  { labelKey: "footer.visaServices", href: "/visas" },
  { labelKey: "footer.travelInsurance", href: "/insurance" },
  { labelKey: "nav.cruises", href: "/cruises" },
  { labelKey: "nav.skyLounge", href: "/mingalar" },
  { labelKey: "nav.blog", href: "/blog" },
  { labelKey: "nav.about", href: "/about" },
  { labelKey: "nav.contact", href: "/contact" },
  { labelKey: "nav.bookNow", href: "/book-now" },
];

const supportLinks = [
  { labelKey: "nav.about", href: "/about" },
  { labelKey: "nav.tours", href: "/tours" },
  { labelKey: "nav.hotels", href: "/hotels" },
  { labelKey: "nav.contact", href: "/contact" },
  { labelKey: "nav.faq", href: "/faq" },
  { labelKey: "footer.privacy", href: "/privacy" },
  { labelKey: "footer.terms", href: "/terms" },
];

const DEPT_LABELS: Record<string, string> = {
  ticket: "footer.deptTicket",
  visa: "footer.deptVisa",
  hotel: "footer.deptHotel",
  outbound: "footer.deptOutbound",
  inbound: "footer.deptInbound",
};

export default function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch site config");
        return res.json();
      })
      .then((data) => setConfig(data))
      .catch(() => {
        // silently use fallbacks
      });
  }, []);

  // ── Dynamic values with hardcoded fallbacks ──
  const phone = config?.contact?.phone || "";
  const email = config?.contact?.email || "";
  const address = config?.contact?.address || "No-18, Ground Floor, Zayya Waddy Street, Baho Road, Sanchaung Tsp, Yangon, Myanmar";
  const workingHours = config?.contact?.workingHours || "Mon-Sat: 9:00 AM - 6:00 PM";
  const moduleToggles = (config as any)?.moduleToggles || {};
  const MODULE_BY_HREF: Record<string, string> = {
    "/tours": "tours", "/hotels": "hotels", "/cars": "cars", "/buses": "buses",
    "/visas": "visas", "/insurance": "insurance", "/cruises": "cruises",
    "/mingalar": "skyLounge", "/blog": "blog",
  };
  const quickLinksFiltered = quickLinks.filter(l => { const k = MODULE_BY_HREF[l.href]; return !k || moduleToggles[k] !== false; });
  const supportLinksFiltered = supportLinks.filter(l => { const k = MODULE_BY_HREF[l.href]; return !k || moduleToggles[k] !== false; });
  const socialArr = Array.isArray(config?.socialLinks) ? config.socialLinks : Object.values((config?.socialLinks as any) || {});
  const socialMap: Record<string, string> = {};
  socialArr.forEach((s: any) => { if (s && s.platform) socialMap[String(s.platform).toLowerCase()] = s.url; });
  const fbLink = socialMap.facebook || (config?.socialLinks as any)?.facebook || "https://facebook.com";
  const igLink = socialMap.instagram || (config?.socialLinks as any)?.instagram || "https://instagram.com";
  const tgLink = socialMap.telegram || (config?.socialLinks as any)?.telegram || "https://t.me";

  return (
    <footer className="bg-[#0a0e1a] border-t border-[#D4AF37]/20">
      {/* ── Main Footer Grid ──────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <h3 className="font-display text-2xl font-bold text-[#D4AF37] tracking-wider">
                A9 GLOBAL
              </h3>
              <p className="text-xs text-[#D4AF37]/70 tracking-[0.3em] mt-0.5">
                TRAVELS & TOURS
              </p>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              {t("footer.about")}
            </p>
            <p className="text-sm italic text-[#D4AF37]/50">
              {t("footer.tagline")}
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={fbLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0a0e1a] transition-all duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href={igLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0a0e1a] transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href={tgLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0a0e1a] transition-all duration-300"
                aria-label="Telegram"
              >
                <FaTelegramPlane className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-[#D4AF37] mb-6 pb-2 border-b border-[#D4AF37]/20">
              {t("footer.explore")}
            </h4>
            <ul className="space-y-3">
              {quickLinksFiltered.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-[#D4AF37] transition-colors duration-200 flex items-center group"
                  >
                    <span className="mr-2 text-[#D4AF37]/0 group-hover:text-[#D4AF37]/70 transition-all duration-200 text-[10px]">►</span>
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-[#D4AF37] mb-6 pb-2 border-b border-[#D4AF37]/20">
              {t("footer.services")}
            </h4>
            <ul className="space-y-3">
              {supportLinksFiltered.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-[#D4AF37] transition-colors duration-200 flex items-center group"
                  >
                    <span className="mr-2 text-[#D4AF37]/0 group-hover:text-[#D4AF37]/70 transition-all duration-200 text-[10px]">►</span>
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="font-display text-lg font-semibold text-[#D4AF37] mb-6 pb-2 border-b border-[#D4AF37]/20">
              {t("footer.contact")}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-[#D4AF37] mt-1 flex-shrink-0 text-sm" />
                <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">
                  {address}
                </p>
              </div>
              {phone && (
                <div className="flex items-start space-x-3">
                  <FaPhoneAlt className="text-[#D4AF37] mt-1 flex-shrink-0 text-sm" />
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="text-sm text-white/60 hover:text-[#D4AF37] transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              )}
              {email && (
                <div className="flex items-start space-x-3">
                  <FaEnvelope className="text-[#D4AF37] mt-1 flex-shrink-0 text-sm" />
                  <a
                    href={`mailto:${email}`}
                    className="text-sm text-white/60 hover:text-[#D4AF37] transition-colors break-all"
                  >
                    {email}
                  </a>
                </div>
              )}
              <div className="flex items-start space-x-3">
                <FaClock className="text-[#D4AF37] mt-1 flex-shrink-0 text-sm" />
                <p className="text-sm text-white/60">
                  {workingHours}
                </p>
              </div>
              {/* Department Phone Numbers — shown when any exist in Admin */}
              {config?.departmentPhones && typeof config.departmentPhones === "object" &&
                Object.entries(config.departmentPhones)
                  .filter(([k, v]: [string, any]) => k !== "__proto__" && v)
                  .map(([dept, phoneNum]: [string, any]) => (
                    <div key={dept} className="flex items-start space-x-3">
                      <FaPhoneAlt className="text-[#D4AF37] mt-1 flex-shrink-0 text-xs" />
                      <div className="leading-tight">
                        <span className="text-[10px] text-white/30 uppercase tracking-wider block">{t(DEPT_LABELS[dept] || dept)}</span>
                        <a href={`tel:${String(phoneNum).replace(/\s/g, "")}`} className="text-sm text-white/60 hover:text-[#D4AF37] transition-colors">{phoneNum}</a>
                      </div>
                    </div>
                  ))}
              

            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ────────────────────────── */}
      <div className="border-t border-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-center text-xs text-white/50">
              &copy; {currentYear} A9 Global Travels &amp; Tours. {t("footer.rights")}
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-xs text-white/40 hover:text-[#D4AF37] transition-colors">
                {t("footer.privacy")}
              </Link>
              <Link href="/terms" className="text-xs text-white/40 hover:text-[#D4AF37] transition-colors">
                {t("footer.terms")}
              </Link>
              <Link href="/faq" className="text-xs text-white/40 hover:text-[#D4AF37] transition-colors">
                {t("nav.faq")}
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
          <p className="text-center text-[10px] text-white/30 mt-3 tracking-wide">
            Company Reg: 126395248 &nbsp;|&nbsp; IATA: 05301026 &nbsp;|&nbsp;
            T/I(YGN)-2889 &nbsp;|&nbsp; T/O(YGN)-0946
          </p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="bg-white rounded-lg p-3">
              <img src="/images_v2/iata-logo-real.png" alt="IATA Accredited" className="h-12 w-auto" />
            </div>
            <div className="bg-white rounded-lg p-3">
              <img src="/images_v2/umta-logo-real.png" alt="UMTA Member" className="h-12 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
