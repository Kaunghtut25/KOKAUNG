"use client";
import { useState, useEffect } from "react";

const FALLBACK_BADGES = [
  { icon: '✈️', label: 'IATA Accredited' },
  { icon: '🌏', label: 'ASEAN Travel Association' },
  { icon: '⭐', label: 'TripAdvisor 5-Star' },
  { icon: '🏛️', label: 'Myanmar Tourism Federation' },
  { icon: '🏆', label: 'Best Travel Agency 2024' },
];

export default function TrustBadges() {
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

  return (
    <div style={{ background: '#f8f9fa', padding: '16px 20px', borderBottom: '1px solid #eee' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
        {badges.map(b => (
          <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>{b.icon}</span>
            <span style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
