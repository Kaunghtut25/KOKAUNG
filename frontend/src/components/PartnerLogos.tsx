'use client';
import { useState, useEffect } from 'react';
import { useI18n } from "@/lib/i18n";

type Partner = string | { name: string; logo?: string };

// Accredited partners — ALWAYS shown with real logos (the section is about
// trust), merged with admin-managed partners below.
const ACCREDITATIONS: { name: string; logo: string }[] = [
  { name: "IATA", logo: "/images_v2/iata-logo-real.png" },
  { name: "UMTA", logo: "/images_v2/umta-logo-real.png" },
];

const KNOWN_LOGOS: Record<string, string> = Object.fromEntries(
  ACCREDITATIONS.map(a => [a.name.toLowerCase(), a.logo])
);

const FALLBACK_PARTNERS: Partner[] = [
  "Myanmar Airways International", "Thai Airways", "Singapore Airlines", "Emirates",
  "Myanmar National Airway", "Air Thanlwin", "Mann Yadanarpone airline",
];

// Brand colors used for colored logo tiles until a real logo is uploaded.
const BRAND_COLORS: Record<string, string> = {
  "iata": "#003A70",
  "umta": "#0F4C81",
  "myanmar airways international": "#C8102E",
  "thai airways": "#5B2D8E",
  "singapore airlines": "#003876",
  "emirates": "#D71920",
  "myanmar national airway": "#9E1B32",
  "air thanlwin": "#0F766E",
  "mann yadanarpone airline": "#7F1D1D",
};

const brandColor = (name: string): string => {
  const key = name.trim().toLowerCase();
  if (BRAND_COLORS[key]) return BRAND_COLORS[key];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return "hsl(" + h + ", 55%, 38%)";
};

const toPartner = (p: Partner): { name: string; logo?: string } => {
  if (typeof p === "string") {
    const key = p.trim().toLowerCase();
    return KNOWN_LOGOS[key] ? { name: p.trim(), logo: KNOWN_LOGOS[key] } : { name: p.trim() };
  }
  return { name: p.name, logo: p.logo };
};

// accreditations always first; then stored/fallback partners, deduped by name
const buildList = (raw: Partner[]): Partner[] => {
  const seen = new Set<string>();
  const out: Partner[] = [];
  for (const acc of ACCREDITATIONS) { seen.add(acc.name.toLowerCase()); out.push(acc); }
  for (const p of raw) {
    const np = toPartner(p);
    const key = (np.name || "").trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(np.logo ? np : (KNOWN_LOGOS[key] ? { name: np.name, logo: KNOWN_LOGOS[key] } : np));
  }
  return out;
};

export default function PartnerLogos() {
  const { t } = useI18n();
  const [partners, setPartners] = useState<Partner[]>(FALLBACK_PARTNERS);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then(r => r.json())
      .then(config => {
        if (config?.partners?.length > 0) {
          setPartners(config.partners);
        }
      })
      .catch(() => {});
  }, []);

  const list = buildList(partners);

  return (
    <div style={{ background: '#f8f9fa', padding: '32px 20px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: '#0A1628', marginBottom: 24 }}>{t("home.trustedPartners")}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
          {list.map((raw, i) => {
            const p = toPartner(raw);
            const color = brandColor(p.name);
            if (p.logo) {
              return (
                <div
                  key={p.name + "_" + i}
                  title={p.name}
                  className="flex items-center justify-center w-36 h-16 bg-white rounded-lg border border-gray-200 px-3 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <img
                    src={p.logo}
                    alt={p.name}
                    loading="lazy"
                    className="max-h-10 w-auto max-w-full object-contain transition-transform duration-200 hover:scale-105"
                  />
                </div>
              );
            }
            return (
              <div
                key={p.name + "_" + i}
                title={p.name}
                className="flex items-center justify-center w-36 h-16 rounded-lg px-3 shadow-sm transition-all duration-200 hover:shadow-md"
                style={{ background: "linear-gradient(135deg, " + color + ", " + color + "cc)", border: '1px solid rgba(255,255,255,0.25)' }}
              >
                <span className="text-white text-[13px] font-semibold text-center leading-tight">{p.name}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-4">{t("home.trustedPartnersHint")}</p>
      </div>
    </div>
  );
}
