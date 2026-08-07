'use client';
import { useState, useEffect } from 'react';
import { useI18n } from "@/lib/i18n";

const DEFAULT_DEALS = {
  enabled: true,
  badge: '⏰ LIMITED TIME OFFER',
  title: '30% OFF Bagan Explorer Tour',
  buttonLabel: 'Book Now',
  buttonHref: '/book-now',
  countdownDays: 30,
};

export default function DealsBanner() {
  const { t, lang } = useI18n();
  const [deals, setDeals] = useState(DEFAULT_DEALS);
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const dealsBanner = lang === "mm"
    ? { ...deals, badge: '⏰ အချိန်အကန့်အသတ်ဖြင့်', title: 'Bagan Explorer ခရီးစဉ် ၃၀% လျှော့ဈေး', buttonLabel: t("common.bookNow") }
    : deals;

  useEffect(() => {
    fetch('/api/admin/site-config')
      .then(r => r.json())
      .then(config => {
        if (config?.dealsBanner) setDeals({ ...DEFAULT_DEALS, ...config.dealsBanner });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!deals.enabled) return;
    const days = deals.countdownDays && deals.countdownDays > 0 ? deals.countdownDays : 30;
    const target = Date.now() + days * 24 * 60 * 60 * 1000;
    const t = setInterval(() => {
      const diff = target - Date.now();
      setTime({
        d: Math.floor(diff / 86400000), h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60, s: Math.floor(diff / 1000) % 60,
      });
    }, 1000);
    return () => clearInterval(t);
  }, [deals.enabled, deals.countdownDays]);

  if (!deals.enabled) return null;

  return (
    <div style={{ background: 'linear-gradient(135deg,#0A1628,#0F2035)', borderBottom: '3px solid #D4AF37', padding: '24px 20px', textAlign: 'center' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <span style={{ color: '#D4AF37', fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>{dealsBanner.badge}</span>
        <h2 style={{ color: 'white', fontSize: 24, fontWeight: 700, margin: '8px 0' }}>{dealsBanner.title}</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '12px 0' }}>
          {[{ l: t("common.days"), v: time.d }, { l: t("common.hours"), v: time.h }, { l: t("common.mins"), v: time.m }, { l: t("common.secs"), v: time.s }].map(t => (
            <div key={t.l} style={{ background: 'rgba(212,175,55,0.15)', borderRadius: 8, padding: '8px 12px', minWidth: 60 }}>
              <div style={{ color: '#D4AF37', fontSize: 22, fontWeight: 700 }}>{String(t.v).padStart(2, '0')}</div>
              <div style={{ color: '#999', fontSize: 10 }}>{t.l}</div>
            </div>
          ))}
        </div>
        <a href={deals.buttonHref} style={{ display: 'inline-block', background: '#D4AF37', color: '#0A1628', padding: '10px 28px', borderRadius: 24, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>{dealsBanner.buttonLabel}</a>
      </div>
    </div>
  );
}
