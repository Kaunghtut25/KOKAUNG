'use client';
import { useState, useEffect } from 'react';
import { useI18n } from "@/lib/i18n";
import { mmTours, mmLookup } from "@/lib/mm-content";
import Image from "next/image";

interface Review {
  name: string;
  country: string;
  tour: string;
  text: string;
  rating: number;
  image?: string;
}

// FIX 2026-08-15: no hardcoded placeholder reviews — testimonials render ONLY from admin site-config.
export default function TestimonialSlider() {
  const { t, lang } = useI18n();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then(r => r.json())
      .then(config => {
        if (config?.testimonials?.length > 0) {
          setReviews(config.testimonials);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Autoplay only while the slider is actually visible (saves main-thread work)
    const el = document.getElementById('testimonial-slider');
    if (!el) return;
    let t: ReturnType<typeof setInterval> | null = null;
    const start = () => { if (!t) t = setInterval(() => setIdx(i => (i + 1) % reviews.length), 5000); };
    const stop = () => { if (t) { clearInterval(t); t = null; } };
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) start(); else stop(); }, { threshold: 0.15 });
    obs.observe(el);
    return () => { stop(); obs.disconnect(); };
  }, [reviews]);

  const mmTexts: Record<string, Partial<Review>> = {
    'Bagan Explorer': { text: 'အံ့မခန်းအတွေ့အကြုံ! မီးပုံးပျံစီးရတာ အသက်ရှူကျပ်လောက်အောင် လှပပါတယ်။ ကျွမ်းကျင်တဲ့အဖွဲ့၊ အစမှအဆုံး စနစ်ကျလှပါတယ်။', country: 'ဩစတြေးလျ' },
    'Inle Lake Discovery': { text: 'လှပတဲ့ကန်၊ ဖော်ရွေတဲ့လူတွေ။ A9 က အရာရာကို ချောမွေ့စေခဲ့တယ်။ အကြံပြုပါတယ်!', country: 'စင်ကာပူ' },
    'Yangon City Tour': { text: 'ကြွယ်ဝတဲ့ ယဉ်ကျေးမှုနဲ့ သမိုင်း။ ကျွန်တော်တို့ရဲ့ လမ်းညွှန်က ဗဟုသုတကြွယ်ဝပြီး အင်္ဂလိပ်လို ကောင်းကောင်းပြောတတ်ပါတယ်။', country: 'ဂျာမနီ' },
    'Ngapali Beach Escape': { text: 'ပြီးပြည့်စုံတဲ့ ကမ်းခြေအားလပ်ရက်။ အပန်းဖြေစခန်းက လှပပြီး ကြိုဆိုရေးတွေ အချိန်မှန်ပါတယ်။', country: 'ဂျပန်' },
    'Mrauk U Adventure': { text: 'လူသွားလူလာနည်းတဲ့ လမ်းကြောင်းအတွေ့အကြုံ။ A9 က မြန်မာကို အခြားအေဂျင်စီတွေထက် ပိုသိတယ်။', country: 'ယူကေ' },
    'Golden Rock Pilgrimage': { text: 'တစ်သက်တာမှာ တစ်ကြိမ်သာရတဲ့ ဝိညာဉ်ရေးခရီး။ အရာရာ စနစ်ကျပြီး လုံခြုံပါတယ်။', country: 'အမေရိက' },
  };
  if (reviews.length === 0) return null; // no testimonials configured — hide section entirely
  const current = reviews[idx] || reviews[0];
  const r = lang === "mm" && current ? { ...current, ...(mmTexts[current.tour] || {}) } : current;
  if (!r) return null;
  const tourMM = lang === "mm" ? (mmLookup(mmTours, { title: r.tour }).title || r.tour) : r.tour;

  return (
    <div style={{ background: 'linear-gradient(135deg,#0A1628,#0F2035)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: '#D4AF37', fontFamily: "'Playfair Display',serif", fontSize: 24, marginBottom: 24 }}>{t("home.travelersSay")}</h2>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
          <div style={{ color: '#D4AF37', fontSize: 18, marginBottom: 8 }}>{'★'.repeat(r.rating || 5)}</div>
          <p style={{ color: 'white', fontSize: 16, lineHeight: 1.6, fontStyle: 'italic', marginBottom: 16 }}>"{r.text}"</p>
          {r.image && <Image alt={r.name} style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', border: '2px solid #D4AF37' }} src={r.image} width={60} height={60} />}
          <div style={{ color: '#D4AF37', fontWeight: 600 }}>{r.name}</div>
          <div style={{ color: '#999', fontSize: 13 }}>{r.country} — {tourMM}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          {reviews.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={"Go to review " + (i + 1)} className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full transition-colors" style={{ margin: "0 2px" }}><span style={{ width: 14, height: 14, borderRadius: "50%", background: i === idx ? "#D4AF37" : "rgba(10,22,40,0.2)", transition: "all 0.3s" }} /></button>
          ))}
        </div>
      </div>
    </div>
  );
}
