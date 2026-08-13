'use client';
import { useState, useEffect } from 'react';
import { useI18n } from "@/lib/i18n";

type Partner = string | { name: string; logo?: string };

// Bundled logos shipped with the site — shown even when the stored config
// only has plain names (e.g. pre-logo data). Admin can override per partner.
const KNOWN_LOGOS: Record<string, string> = {
  "iata": "/images_v2/iata-logo.png",
  "umta": "/images_v2/umta-logo.png",
};

const FALLBACK_PARTNERS: Partner[] = [
  { name: "IATA", logo: KNOWN_LOGOS["iata"] },
  { name: "UMTA", logo: KNOWN_LOGOS["umta"] },
  "Shangri-La", "Sedona Hotel", "Sule Palace", "Melia Hotel",
  "Myanmar Airways", "Thai Airways", "Singapore Airlines", "Emirates",
];

const toPartner = (p: Partner): { name: string; logo?: string } => {
  if (typeof p === "string") {
    const key = p.trim().toLowerCase();
    return KNOWN_LOGOS[key] ? { name: p.trim(), logo: KNOWN_LOGOS[key] } : { name: p.trim() };
  }
  return { name: p.name, logo: p.logo };
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

  return (
    <div style={{ background: '#f8f9fa', padding: '32px 20px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: '#0A1628', marginBottom: 24 }}>{t("home.trustedPartners")}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
          {partners.map((raw, i) => {
            const p = toPartner(raw);
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
                    className="max-h-10 w-auto max-w-full object-contain opacity-70 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0"
                  />
                </div>
              );
            }
            return (
              <div key={p.name + "_" + i} style={{ padding: '8px 18px', borderRadius: 20, border: '1px solid #D4AF37', background: 'white', fontSize: 13, color: '#0A1628', fontWeight: 500 }}>
                {p.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
