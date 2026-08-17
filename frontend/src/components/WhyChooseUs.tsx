'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useI18n } from "@/lib/i18n";

// FIX: 2026-08-07 Burmese override (MM mode)
const MM_WHY_TITLE = "ဘာကြောင့် A9 Global Travel ကို ရွေးချယ်သင့်သလဲ?";
const MM_WHY_TAGLINE = "၂၀၁၅ ခုနှစ်မှစ၍ မြန်မာနိုင်ငံတွင် သင့်အတွက် ယုံကြည်စိတ်ချရသော ခရီးသွားမိတ်ဖက်";
const MM_FEATURES: Record<string, { title: string; desc: string }> = {
  "24/7 Customer Support": { title: "၂၄/၇ ဖောက်သည် အကူအညီ", desc: "သင်လိုအပ်ချိန်တိုင်း တစ်ရက်လုံး အကူအညီပေးခြင်း" },
  "IATA Certified": { title: "IATA အသိအမှတ်ပြု", desc: "၂၀၁၅ ခုနှစ်မှစ၍ တရားဝင် အသိအမှတ်ပြုခံရ" },
  "Best Price Guarantee": { title: "အကောင်းဆုံးဈေးနှုန်း အာမခံ", desc: "ဝန်ဆောင်မှုအားလုံးတွင် မယှဉ်နိုင်သော ဈေးနှုန်းများ" },
  "Local Expertise": { title: "ဒေသဆိုင်ရာ ကျွမ်းကျင်မှု", desc: "မြန်မာနိုင်ငံ ခရီးသွားလုပ်ငန်းတွင် အတွေ့အကြုံ ၁၀+ နှစ်" },
  "Travel Insurance": { title: "ခရီးသွားအာမခံ", desc: "စိတ်အေးချမ်းမှုအတွက် ပြည့်စုံသော အကာအကွယ်" },
  "5000+ Happy Travelers": { title: "ပျော်ရွှင်သော ခရီးသွား ၅၀၀၀+", desc: "ဖောက်သည် စိတ်ကျေနပ်မှု ၉၈%" },
  "Trusted Partner": { title: "ယုံကြည်စိတ်ချရသော မိတ်ဖက်", desc: "ဆယ်စုနှစ်တစ်ခုကျော် လုပ်ငန်းအတွေ့အကြုံဖြင့် IATA အသိအမှတ်ပြု" },
  "Tailored Itineraries": { title: "စိတ်ကြိုက် ခရီးစဉ်များ", desc: "ခရီးတိုင်းကို သင့်စိတ်ကြိုက် ရွေးချယ်မှုများနှင့် အံဝင်ခွင်ကျ ဒီဇိုင်းပြုလုပ်ပေးခြင်း" },
  "Secure Payments": { title: "လုံခြုံသော ငွေပေးချေမှု", desc: "သင့်ငွေပေးငွေယူအားလုံးကို ဘဏ်အဆင့် ကုဒ်ဝှက်စနစ်ဖြင့် ကာကွယ်ပေးခြင်း" },
};

// v79: fully configurable — title, tagline, card width, and card images come from site-config
const DEFAULT_WHY = {
  title: 'Why Choose A9 Global Travel?',
  tagline: 'Your trusted travel partner in Myanmar since 2015',
  cardWidth: 280,
};

const FALLBACK_FEATURES: { icon: string; title: string; desc: string; image?: string }[] = []; // FIX 2026-08-15: config-only — no hardcoded claims

export default function WhyChooseUs() {
  const { lang } = useI18n();
  const [features, setFeatures] = useState<{ icon: string; title: string; desc: string; image?: string }[]>(FALLBACK_FEATURES);
  const [title, setTitle] = useState(DEFAULT_WHY.title);
  const [tagline, setTagline] = useState(DEFAULT_WHY.tagline);
  const [cardWidth, setCardWidth] = useState(DEFAULT_WHY.cardWidth);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then(r => r.json())
      .then(config => {
        if (config?.whyChooseCards?.length > 0) {
          setFeatures(config.whyChooseCards.map((c: any) => ({
            icon: c.icon || '⭐',
            title: c.title || '',
            desc: c.description || '',
            image: c.image || '',
          })));
        }
        if (config?.whyChooseTitle) setTitle(config.whyChooseTitle);
        if (config?.whyChooseTagline) setTagline(config.whyChooseTagline);
        if (config?.whyChooseCardWidth) setCardWidth(Number(config.whyChooseCardWidth) || DEFAULT_WHY.cardWidth);
      })
      .catch(() => {});
  }, []);

    if (features.length === 0) return null; // FIX 2026-08-15: hide until admin config provides real cards

return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      <h2 style={{ textAlign: 'center', fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#0A1628', marginBottom: 8 }}>{lang === "mm" ? MM_WHY_TITLE : title}</h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: 15, marginBottom: 32 }}>{lang === "mm" ? MM_WHY_TAGLINE : tagline}</p>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(${cardWidth}px,1fr))`, gap: 20 }}>
        {features.map(f => (
          <div key={f.title} style={{ background: 'white', borderRadius: 12, padding: 24, textAlign: 'center', border: '1px solid #eee', transition: 'all 0.3s', cursor: 'default' }}
            onMouseEnter={(e: any)=>{e.currentTarget.style.borderColor='#D4AF37';e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)';}}
            onMouseLeave={(e: any)=>{e.currentTarget.style.borderColor='#eee';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
            {f.image ? (
              <div style={{ width: 72, height: 72, margin: '0 auto 12px', borderRadius: '50%', overflow: 'hidden', background: '#FFFDF5', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image src={f.image} alt={f.title} width={144} height={144} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
            )}
            <h3 style={{ fontSize: 16, color: '#0A1628', fontWeight: 600, marginBottom: 6 }}>{lang === "mm" ? (MM_FEATURES[f.title]?.title || f.title) : f.title}</h3>
            <p style={{ fontSize: 13, color: '#666' }}>{lang === "mm" ? (MM_FEATURES[f.title]?.desc || f.desc) : f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
