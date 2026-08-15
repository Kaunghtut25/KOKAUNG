"use client";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";

// FIX: 2026-08-07 Burmese labels for badges (MM mode)
const MM_BADGE_LABELS: Record<string, string> = {
  "IATA Accredited": "IATA အသိအမှတ်ပြု",
  "ASEAN Travel Association": "အာဆီယံ ခရီးသွားအသင်း",
  "TripAdvisor 5-Star": "TripAdvisor ၅-ကြယ်",
  "Myanmar Tourism Federation": "မြန်မာနိုင်ငံ ခရီးသွားလုပ်ငန်း အဖွဲ့ချုပ်",
  "Best Travel Agency 2024": "၂၀၂၄ အကောင်းဆုံး ခရီးသွားအေဂျင်စီ",
  "5,000+ Happy Travelers": "ပျော်ရွှင်သော ခရီးသွား ၅,၀၀၀+",
  "50+ Destinations": "ခရီးစဉ်နေရာ ၅၀+",
  "24/7 Support": "၂၄/၇ အကူအညီ",
};

const FALLBACK_BADGES: { icon: string; label: string }[] = []; // FIX 2026-08-15: config-only — no hardcoded claims

export default function TrustBadges() {
  const { lang } = useI18n();
  const [badges, setBadges] = useState<{ icon: string; label: string }[]>(FALLBACK_BADGES);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then(r => r.json())
      .then(config => {
        if (config?.statsCards?.length > 0) {
          setBadges(config.statsCards.map((c: any) => ({
            icon: c.icon || '⭐',
            label: c.title || c.description || '',
          })));
        }
      })
      .catch(() => {});
  }, []);

    if (badges.length === 0) return null; // FIX 2026-08-15: hide until admin config provides real badges

return (
    <div style={{ background: '#f8f9fa', padding: '16px 20px', borderBottom: '1px solid #eee' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
        {badges.map(b => (
          <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>{b.icon}</span>
            <span style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>{lang === "mm" ? (MM_BADGE_LABELS[b.label] || b.label) : b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
