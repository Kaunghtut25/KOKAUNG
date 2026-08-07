"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";
import Link from "next/link"
import { useState, useEffect } from "react";
import TrustBadges from '@/components/TrustBadges';
import WhyChooseUs from '@/components/WhyChooseUs';
import CompanyTimeline from '@/components/CompanyTimeline';
import PartnerLogos from '@/components/PartnerLogos';
import Newsletter from '@/components/Newsletter';
const FALLBACK_IMG = "/images_v2/about-hero-v2.jpg";

interface AboutConfig {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  whoWeAreText: string[];
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
  valuesTitle: string;
  values: { title: string; desc: string; icon: string }[];
  servicesTitle: string;
  services: string[];
  whyChooseUsTitle: string;
  whyChooseUs: string[];
  teamTitle: string;
  teamSubtitle: string;
  teamMembers: { name: string; role: string; image: string }[];
  commitmentTitle: string;
  commitmentText: string;
  commitmentSubtext: string;
  commitmentButtonLabel: string;
  commitmentButtonHref: string;
  certifications: { title: string; code: string; image: string }[];
  journeyTitle: string;
  journey: { year: string; title: string; desc: string }[];
}

const DEFAULT_JOURNEY = [
  { year: '2015', title: 'Founded', desc: 'A9 Global Travel & Tours established in Yangon' },
  { year: '2017', title: 'IATA Accreditation', desc: 'Official IATA certification received' },
  { year: '2019', title: 'Expansion', desc: 'Grew to 30+ tour packages across Myanmar' },
  { year: '2020', title: 'Digital Transformation', desc: 'Launched online booking platform' },
  { year: '2022', title: 'Sky Lounge', desc: 'Premium airport lounge service launched' },
  { year: '2024', title: '5000+ Travelers', desc: 'Milestone of 5000 happy customers reached' },
  { year: '2026', title: 'Premium Relaunch', desc: 'Next-generation travel platform' },
];

const defaultAbout: AboutConfig = {
  heroImage: "/images_v2/about-hero-v2.jpg",
  heroTitle: "Welcome to A9 Global Travel & Tours",
  heroSubtitle: "A professional travel management company based in Myanmar, providing comprehensive travel solutions for individuals, businesses, marine and organizations.",
  whoWeAreText: [
    "With extensive experience in the travel industry, we specialize in delivering reliable, efficient, and cost-effective travel services tailored to the needs of our customers. From flight reservations and hotel bookings to visa assistance and corporate travel management, we are committed to making every journey smooth and hassle-free.",
    "Our expertise extends beyond leisure travel to include corporate travel management, marine and offshore travel, MICE services, and customized travel programs designed to support businesses and travelers alike.",
    "We are a team of experienced travel professionals dedicated to providing exceptional service and personalized travel solutions. Our industry knowledge, global partnerships, and customer-focused approach allow us to deliver value and convenience to our clients.",
    "At A9 Global Travel & Tours, we believe that travel is more than simply moving from one destination to another — it is about creating opportunities, building connections, and supporting business growth.",
  ],
  missionTitle: "Our Mission",
  missionText: "To provide professional, reliable, and innovative travel solutions that exceed customer expectations and create long-term value for our clients and partners.",
  visionTitle: "Our Vision",
  visionText: "To become one of Myanmar's leading travel management companies, recognized for service excellence, innovation, and customer satisfaction across local and international markets.",
  valuesTitle: "Our Values",
  values: [
    { title: "Customer First", desc: "We place our customers at the center of everything we do and strive to deliver exceptional service experiences.", icon: "🎯" },
    { title: "Integrity", desc: "We conduct our business with honesty, transparency, and professionalism.", icon: "🤝" },
    { title: "Reliability", desc: "We provide dependable travel solutions and responsive support whenever our customers need us.", icon: "🛡️" },
    { title: "Innovation", desc: "We continuously improve our services and embrace new technologies to enhance customer experience.", icon: "💡" },
    { title: "Teamwork", desc: "We believe collaboration and partnership are the foundation of long-term success.", icon: "🤲" },
  ],
  servicesTitle: "Our Services",
  services: ["International Air Ticketing","Domestic Air Ticketing","Corporate Travel Management","Marine and Offshore Travel","Visa Assistance","Hotel Reservations","Tours and Holiday Packages","MICE Services","Airport Transfers and Ground Transportation"],
  whyChooseUsTitle: "Why Choose A9 Global?",
  whyChooseUs: ["Experienced travel professionals","Competitive pricing and corporate travel solutions","Dedicated account management","Fast response and personalized service","Flexible and customized travel programs","24/7 emergency support for urgent travel requirements","Strong partnerships with airlines, hotels, and travel suppliers worldwide"],
  teamTitle: "Our Expert Team",
  teamSubtitle: "Passionate professionals dedicated to crafting your perfect journey",
  teamMembers: [
    { name: "U Aung Kyaw", role: "Founder & CEO", image: "/images_v2/team-ceo-v2.jpg" },
    { name: "Daw Su Myat", role: "Operations Director", image: "/images_v2/team-ops-v2.jpg" },
    { name: "U Zaw Htun", role: "Head of Tours", image: "/images_v2/team-tours-v2.jpg" },
    { name: "Daw Hnin Si", role: "Customer Relations", image: "/images_v2/team-cr-v2.jpg" },
  ],
  commitmentTitle: "Our Commitment",
  commitmentText: "At A9 Global Travel & Tours, our commitment is simple: to deliver seamless travel experiences with professionalism, reliability, and care.",
  commitmentSubtext: "Whether you are planning a business trip, family holiday, corporate event, or marine crew movement, we are here to support your journey every step of the way.",
  commitmentButtonLabel: "Book Now",
  commitmentButtonHref: "/book-now",
  certifications: [
    { title: "IATA Accredited", code: "05301026", image: "/images_v2/iata-logo.png" },
    { title: "Licensed Tour Operator", code: "T/O(YGN)-0946", image: "/images_v2/license-tour-operator.png" },
    { title: "Company Registration", code: "126395248", image: "/images_v2/company-registration.png" },
  ],
  journeyTitle: "Our Journey",
  journey: DEFAULT_JOURNEY,
};


// FIX: 2026-08-07 Burmese content override for About page (MM mode)
const ABOUT_MM = {
  heroTitle: "A9 Global Travel & Tours မှ ကြိုဆိုပါသည်",
  heroSubtitle: "မြန်မာနိုင်ငံအခြေစိုက် ကျွမ်းကျင်သော ခရီးသွားစီမံခန့်ခွဲမှုကုမ္ပဏီတစ်ခုဖြစ်ပြီး တစ်ဦးချင်း၊ စီးပွားရေးလုပ်ငန်းများနှင့် အဏ္ဏဝါဆိုင်ရာ အဖွဲ့အစည်းများအတွက် ပြည့်စုံသော ခရီးသွားဖြေရှင်းချက်များကို ဆောင်ရွက်ပေးပါသည်။",
  whoWeAreText: [
    "ခရီးသွားလုပ်ငန်းတွင် နှစ်ပေါင်းများစွာ အတွေ့အကြုံရှိသော ကျွန်ုပ်တို့သည် ဖောက်သည်များ၏ လိုအပ်ချက်များနှင့် အံဝင်ခွင်ကျဖြစ်သော ယုံကြည်စိတ်ချရပြီး ထိရောက်၍ ကုန်ကျစရိတ်သက်သာသော ခရီးသွားဝန်ဆောင်မှုများကို ပေးအပ်ရာတွင် အထူးပြုပါသည်။ လေယာဉ်လက်မှတ်ကြိုတင်မှာယူခြင်း၊ ဟိုတယ်ကြိုတင်မှာယူခြင်းမှ ဗီဇာအကူအညီနှင့် စီးပွားရေးခရီးသွားစီမံခန့်ခွဲမှုအထိ ခရီးတိုင်း ချောမွေ့ပြီး အဆင်ပြေစေရန် ကတိပြုပါသည်။",
    "ကျွန်ုပ်တို့၏ ကျွမ်းကျင်မှုသည် အပန်းဖြေခရီးသွားလာမှုထက် ကျော်လွန်၍ စီးပွားရေးခရီးသွားစီမံခန့်ခွဲမှု၊ အဏ္ဏဝါနှင့် ကမ်းလွန်ခရီးသွားလာမှု၊ MICE ဝန်ဆောင်မှုများနှင့် စီးပွားရေးလုပ်ငန်းများနှင့် ခရီးသွားများကို ပံ့ပိုးရန် ဒီဇိုင်းပြုလုပ်ထားသော စိတ်ကြိုက်ခရီးအစီအစဉ်များလည်း ပါဝင်ပါသည်။",
    "ကျွန်ုပ်တို့သည် ထူးခြားသောဝန်ဆောင်မှုနှင့် တစ်ဦးချင်းပြုပြင်ထားသော ခရီးသွားဖြေရှင်းချက်များ ပေးအပ်ရန် ဆက်ကပ်ထားသော အတွေ့အကြုံရင့် ခရီးသွားကျွမ်းကျင်သူအဖွဲ့တစ်ဖွဲ့ ဖြစ်ပါသည်။ ကျွန်ုပ်တို့၏ လုပ်ငန်းဗဟုသုတ၊ ကမ္ဘာတစ်ဝှမ်း မိတ်ဖက်ဆက်ဆံရေးများနှင့် ဖောက်သည်ဗဟိုပြုချဉ်းကပ်မှုတို့သည် ဖောက်သည်များအား တန်ဖိုးနှင့် အဆင်ပြေမှု ပေးစွမ်းနိုင်စေပါသည်။",
    "A9 Global Travel & Tours တွင် ကျွန်ုပ်တို့ ယုံကြည်သည်မှာ ခရီးသွားခြင်းသည် နေရာတစ်ခုမှ တစ်ခုသို့ ရွေ့လျားခြင်းသက်သက် မဟုတ်ဘဲ — အခွင့်အလမ်းများ ဖန်တီးခြင်း၊ ဆက်သွယ်မှုများ တည်ဆောက်ခြင်းနှင့် စီးပွားရေးတိုးတက်မှုကို ပံ့ပိုးပေးခြင်း ဖြစ်သည်။",
  ],
  missionTitle: "ကျွန်ုပ်တို့၏ ရည်ရွယ်ချက်",
  missionText: "ဖောက်သည်များ၏ မျှော်လင့်ချက်များကို ကျော်လွန်စေသော ကျွမ်းကျင်၊ ယုံကြည်စိတ်ချရပြီး ဆန်းသစ်သော ခရီးသွားဖြေရှင်းချက်များ ပံ့ပိုးပေးရန်",
  visionTitle: "ကျွန်ုပ်တို့၏ မျှော်မှန်းချက်",
  visionText: "ဝန်ဆောင်မှုအရည်အသွေး၊ ဆန်းသစ်တီထွင်မှုနှင့် ဖောက်သည်စိတ်ကျေနပ်မှုတို့ဖြင့် အသိအမှတ်ပြုခံရသော မြန်မာနိုင်ငံ၏ ထိပ်တန်း ခရီးသွားစီမံခန့်ခွဲမှုကုမ္ပဏီများထဲမှ တစ်ခု ဖြစ်လာရန်",
  valuesTitle: "ကျွန်ုပ်တို့၏ တန်ဖိုးများ",
  values: [
    { title: "ဖောက်သည် ဦးစားပေး", desc: "ကျွန်ုပ်တို့သည် ဖောက်သည်များကို လုပ်ဆောင်မှုအားလုံး၏ ဗဟိုတွင်ထားပြီး ထူးခြားသော ဝန်ဆောင်မှုအတွေ့အကြုံများ ပေးအပ်ရန် ကြိုးပမ်းပါသည်။", icon: "🎯" },
    { title: "ရိုးသားမှု", desc: "ကျွန်ုပ်တို့သည် လုပ်ငန်းများကို ရိုးသားမှု၊ ပွင့်လင်းမှုနှင့် ကျွမ်းကျင်မှုတို့ဖြင့် ဆောင်ရွက်ပါသည်။", icon: "🤝" },
    { title: "ယုံကြည်စိတ်ချရမှု", desc: "ဖောက်သည်များ လိုအပ်ချိန်တိုင်း ယုံကြည်စိတ်ချရသော ခရီးသွားဖြေရှင်းချက်များနှင့် လျင်မြန်သော ပံ့ပိုးမှုများကို ပေးအပ်ပါသည်။", icon: "🛡️" },
    { title: "ဆန်းသစ်တီထွင်မှု", desc: "ကျွန်ုပ်တို့သည် ဝန်ဆောင်မှုများကို စဉ်ဆက်မပြတ် တိုးတက်စေပြီး ဖောက်သည်အတွေ့အကြုံ မြှင့်တင်ရန် နည်းပညာသစ်များကို လက်ခံကျင့်သုံးပါသည်။", icon: "💡" },
    { title: "အဖွဲ့လိုက်လုပ်ဆောင်မှု", desc: "ပူးပေါင်းဆောင်ရွက်မှုနှင့် မိတ်ဖက်ဆက်ဆံရေးသည် ရေရှည်အောင်မြင်မှု၏ အခြေခံအုတ်မြစ်ဖြစ်သည်ဟု ကျွန်ုပ်တို့ ယုံကြည်ပါသည်။", icon: "🤲" },
  ],
  servicesTitle: "ကျွန်ုပ်တို့၏ ဝန်ဆောင်မှုများ",
  services: [
    "နိုင်ငံတကာ လေကြောင်းလက်မှတ်",
    "ပြည်တွင်း လေကြောင်းလက်မှတ်",
    "စီးပွားရေးလုပ်ငန်း ခရီးသွားစီမံခန့်ခွဲမှု",
    "အဏ္ဏဝါနှင့် ကမ်းလွန် ခရီးသွားလာမှု",
    "ဗီဇာ အကူအညီ",
    "ဟိုတယ် ကြိုတင်မှာယူမှု",
    "ခရီးစဉ်နှင့် အားလပ်ရက် အစီအစဉ်များ",
    "MICE ဝန်ဆောင်မှုများ",
    "လေဆိပ်ပို့ဆောင်မှုနှင့် မြေပြင်သယ်ယူပို့ဆောင်ရေး",
  ],
  whyChooseUsTitle: "ဘာကြောင့် A9 Global ကို ရွေးချယ်သင့်သလဲ?",
  whyChooseUs: [
    "အတွေ့အကြုံရင့် ခရီးသွားကျွမ်းကျင်သူများ",
    "အပြိုင်အဆိုင် ဈေးနှုန်းများနှင့် စီးပွားရေးခရီးသွား ဖြေရှင်းချက်များ",
    "သီးသန့် အကောင့်စီမံခန့်ခွဲမှု",
    "လျင်မြန်သော တုံ့ပြန်မှုနှင့် တစ်ဦးချင်းပြုပြင်ထားသော ဝန်ဆောင်မှု",
    "လိုက်လျောညီထွေရှိပြီး စိတ်ကြိုက်ပြင်ဆင်ထားသော ခရီးအစီအစဉ်များ",
    "အရေးပေါ် ခရီးသွားလိုအပ်ချက်များအတွက် ၂၄/၇ အရေးပေါ်အကူအညီ",
    "ကမ္ဘာတစ်ဝှမ်းရှိ လေကြောင်းလိုင်းများ၊ ဟိုတယ်များနှင့် ခရီးသွားဝန်ဆောင်မှုပေးသူများနှင့် ခိုင်မာသော မိတ်ဖက်ဆက်ဆံရေး",
  ],
  teamTitle: "ကျွန်ုပ်တို့၏ ကျွမ်းကျင်အဖွဲ့",
  teamSubtitle: "သင့်အတွက် ပြီးပြည့်စုံသော ခရီးစဉ်များ ဖန်တီးပေးရန် ဇောက်ချလုပ်ဆောင်နေသော ကျွမ်းကျင်ပညာရှင်များ",
  teamMembers: [
    { name: "U Aung Kyaw", role: "တည်ထောင်သူနှင့် CEO", image: "/images_v2/team-ceo-v2.jpg" },
    { name: "Daw Su Myat", role: "လုပ်ငန်းဆောင်ရွက်ရေး ဒါရိုက်တာ", image: "/images_v2/team-ops-v2.jpg" },
    { name: "U Zaw Htun", role: "ခရီးစဉ်ဌာန အကြီးအကဲ", image: "/images_v2/team-tours-v2.jpg" },
    { name: "Daw Hnin Si", role: "ဖောက်သည်ဆက်ဆံရေး", image: "/images_v2/team-cr-v2.jpg" },
  ],
  commitmentTitle: "ကျွန်ုပ်တို့၏ ကတိကဝတ်",
  commitmentText: "A9 Global Travel & Tours တွင် ကျွန်ုပ်တို့၏ ကတိကဝတ်မှာ ရိုးရှင်းပါသည် — ကျွမ်းကျင်မှု၊ ယုံကြည်စိတ်ချရမှုနှင့် ဂရုစိုက်မှုတို့ဖြင့် ချောမွေ့သော ခရီးသွားအတွေ့အကြုံများကို ပေးအပ်ရန် ဖြစ်သည်။",
  commitmentSubtext: "လုပ်ငန်းခရီး၊ မိသားစုအားလပ်ရက်၊ ကော်ပိုရိတ်ပွဲအစီအစဉ် သို့မဟုတ် အဏ္ဏဝါအဖွဲ့သား ရွေ့ပြောင်းမှုကို စီစဉ်နေပါစေ — သင့်ခရီး၏ ခြေလှမ်းတိုင်းတွင် ကျွန်ုပ်တို့ အကူအညီပေးရန် အသင့်ရှိပါသည်။",
  commitmentButtonLabel: "ယခုစာရင်းသွင်းရန်",
  certifications: [
    { title: "IATA အသိအမှတ်ပြု", code: "05301026", image: "/images_v2/iata-logo.png" },
    { title: "လိုင်စင်ရ ခရီးစဉ်လည်ပတ်သူ", code: "T/O(YGN)-0946", image: "/images_v2/license-tour-operator.png" },
    { title: "ကုမ္ပဏီမှတ်ပုံတင်", code: "126395248", image: "/images_v2/company-registration.png" },
  ],
  journeyTitle: "ကျွန်ုပ်တို့၏ ခရီးလမ်း",
  journey: [
    { year: "2015", title: "စတင်တည်ထောင်ခြင်း", desc: "ရန်ကုန်တွင် A9 Global Travel & Tours စတင်တည်ထောင်ခဲ့သည်" },
    { year: "2017", title: "IATA အသိအမှတ်ပြု", desc: "တရားဝင် IATA အသိအမှတ်ပြုလက်မှတ် ရရှိခဲ့သည်" },
    { year: "2019", title: "တိုးချဲ့ခြင်း", desc: "မြန်မာနိုင်ငံတစ်ဝှမ်း ခရီးစဉ် ၃၀+ အထိ တိုးချဲ့ခဲ့သည်" },
    { year: "2020", title: "ဒစ်ဂျစ်တယ် အသွင်ကူးပြောင်းမှု", desc: "အွန်လိုင်း ကြိုတင်မှာယူမှုပလက်ဖောင်း စတင်ခဲ့သည်" },
    { year: "2022", title: "Sky Lounge", desc: "ပရီမီယံ လေဆိပ်စောင့်ဆိုင်းခန်း ဝန်ဆောင်မှု စတင်ခဲ့သည်" },
    { year: "2024", title: "ခရီးသွား ၅၀၀၀+", desc: "ပျော်ရွှင်သော ဖောက်သည် ၅၀၀၀ ပြည့်မြောက်သည့် မှတ်တိုင်" },
    { year: "2026", title: "ပရီမီယံ ပြန်လည်စတင်ခြင်း", desc: "မျိုးဆက်သစ် ခရီးသွားပလက်ဖောင်း" },
  ],
};

export default function AboutClient({ siteConfig }: { siteConfig: any }) {
  const { t, lang } = useI18n();
  const [config, setConfig] = useState<AboutConfig>(() => ({
    ...defaultAbout,
    ...(siteConfig?.about || {}),
    heroImage: siteConfig?.heroImages?.about || defaultAbout.heroImage,
  }));

  useEffect(() => {
    fetch("/api/admin/site-config").then(r => r.json()).then(d => {
      const baseConfig = d?.about ? { ...defaultAbout, ...d.about } : defaultAbout;
      if (d?.heroImages?.about) baseConfig.heroImage = d.heroImages.about;
      if (Array.isArray(d?.certifications) && d.certifications.length) baseConfig.certifications = d.certifications;
      if (Array.isArray(d?.about?.journey) && d.about.journey.length) baseConfig.journey = d.about.journey;
      if (d?.about?.journeyTitle) baseConfig.journeyTitle = d.about.journeyTitle;
      setConfig(baseConfig);
    }).catch(() => setConfig(defaultAbout));
  }, []);

  const cfg = lang === "mm" ? { ...config, ...ABOUT_MM } : config;
  const { heroImage, heroTitle, heroSubtitle, whoWeAreText, missionTitle, missionText, visionTitle, visionText, valuesTitle, values, servicesTitle, services, whyChooseUsTitle, whyChooseUs, teamTitle, teamSubtitle, teamMembers, commitmentTitle, commitmentText, commitmentSubtext, commitmentButtonLabel, commitmentButtonHref, journeyTitle, journey } = cfg;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="relative pt-28 pb-20 sm:pb-24 px-4 overflow-hidden" style={{ height: (siteConfig?.heroDimensions?.["about"]?.desktop || 450) + "px" }}>
        <div className="absolute inset-0">
          <img src={heroImage || FALLBACK_IMG} alt="A9 Global" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/85 via-[#0A1628]/70 to-[#0A1628]/85" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-[#D4AF37] text-sm uppercase tracking-widest mb-4 font-semibold">{lang === "mm" ? "ကျွန်ုပ်တို့အကြောင်း" : "About Us"}</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">{heroTitle.split("A9 Global")[0] || "Welcome to"}</span>
            <br /><span className="text-white">A9 Global Travel &amp; Tours</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">{heroSubtitle}</p>
        </div>
      </section>

      {/* ========== Trust Badges ========== */}
{/* WHO WE ARE */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#0A1628]" style={{ fontFamily: "'Playfair Display', serif" }}>{lang === "mm" ? "ကျွန်ုပ်တို့ ဘယ်သူတွေလဲ" : "Who We Are"}</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              {whoWeAreText.map((p,i) => <p key={i} className={i===whoWeAreText.length-1?"text-[#B8960F] italic font-medium":""}>{p}</p>)}
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-80 sm:h-96 rounded-2xl border-2 border-[#D4AF37]/30 overflow-hidden shadow-lg">
              <img src={heroImage || FALLBACK_IMG} alt="A9 Global" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/60 to-transparent" />
              <div className="absolute bottom-6 left-6"><p className="text-[#D4AF37] font-semibold text-lg">A9 Global</p><p className="text-white/80 text-sm">{lang === "mm" ? "မြန်မာနိုင်ငံကို ကမ္ဘာနှင့် ချိတ်ဆက်ပေးခြင်း" : "Connecting Myanmar to the World"}</p></div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl border border-[#D4AF37]/20 -z-10" />
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(() => {
            const items = [
              { title: missionTitle, text: missionText, svg: (<path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />) },
              { title: visionTitle, text: visionText, svg: (<><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>) },
            ];
            return items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 hover:border-[#D4AF37]/40 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 mb-5 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
                <svg className="w-8 h-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{item.svg}</svg>
              </div>
              <h3 className="text-2xl font-bold text-[#0A1628] mb-4" style={{fontFamily:"'Playfair Display',serif"}}>{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.text}</p>
            </div>
          ))})()}
        </div>
      </section>

      {/* VALUES */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 sm:pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-[#0A1628]" style={{fontFamily:"'Playfair Display',serif"}}>Our <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">Values</span></h2>
          <p className="text-gray-500">{lang === "mm" ? "ကျွန်ုပ်တို့ လုပ်ဆောင်သမျှကို လမ်းညွှန်ပေးသော အခြေခံမူများ" : "The principles that guide everything we do"}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {values.map((v,i)=><div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:border-[#D4AF37]/40 hover:shadow-md transition-all duration-300 group"><div className="text-3xl mb-3">{v.icon}</div><h4 className="text-[#0A1628] font-semibold mb-2">{v.title}</h4><p className="text-gray-500 text-xs leading-relaxed">{v.desc}</p></div>)}
        </div>
      </section>

      {/* SERVICES */}
      {services.length>0 && <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 sm:pb-20">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm">
          <div className="text-center mb-8"><h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628]" style={{fontFamily:"'Playfair Display',serif"}}>Our <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">Services</span></h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{services.map((s,i)=><div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all duration-200"><div className="w-2 h-2 rounded-full bg-[#D4AF37] flex-shrink-0"/><span className="text-[#0A1628] text-sm font-medium">{s}</span></div>)}</div>
        </div>
      </section>}

      {/* WHY CHOOSE US */}
      {whyChooseUs.length>0 && <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 sm:pb-20">
        <div className="text-center mb-10"><h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628]" style={{fontFamily:"'Playfair Display',serif"}}>Why Choose <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">A9 Global?</span></h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">{whyChooseUs.map((item,i)=><div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-200 hover:border-[#D4AF37]/30 hover:shadow-sm transition-all"><svg className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span className="text-gray-700 text-sm">{item}</span></div>)}</div>
      </section>}

      {/* ========== Why Choose Us (Feature Cards) ========== */}
{/* CREDENTIALS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 sm:pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3 text-[#0A1628]" style={{fontFamily:"'Playfair Display',serif"}}><span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">{lang === "mm" ? "အသိအမှတ်ပြုလက်မှတ်များနှင့် လိုင်စင်များ" : "Accreditations & Licenses"}</span></h2>
          <p className="text-gray-500">{lang === "mm" ? "တရားဝင် အသိအမှတ်ပြုပြီး လိုင်စင်အပြည့်အစုံ ရရှိထားသည်" : "Officially recognized and fully licensed"}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {(config.certifications && config.certifications.length ? config.certifications : []).map((item,i)=>
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:border-[#D4AF37]/40 hover:shadow-md transition-all"><div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center"><img src={item.image} alt={item.title} className="w-full h-full object-contain"/></div><h4 className="text-[#0A1628] font-semibold mb-1">{item.title}</h4><p className="text-[#D4AF37] text-sm font-mono font-medium">{item.code}</p></div>
          )}
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-gray-100 bg-[#0A1628]">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[["10+", lang === "mm" ? "နှစ် အတွေ့အကြုံ" : "Years of Experience"],["5,000+", lang === "mm" ? "ပျော်ရွှင်သော ခရီးသွားများ" : "Happy Travelers"],["50+", lang === "mm" ? "ခရီးစဉ်နေရာများ" : "Destinations"],["24/7", lang === "mm" ? "အကူအညီ" : "Support"]].map(([n,l])=><div key={l}><div className="text-4xl sm:text-5xl font-bold text-[#D4AF37] mb-2" style={{fontFamily:"'Playfair Display',serif"}}>{n}</div><p className="text-white/50 text-sm uppercase tracking-wider">{l}</p></div>)}
          </div>
        </div>
      </section>

      {/* COMMITMENT */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 sm:pb-20">
        <div className="bg-[#0A1628] rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0"><div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl"/><div className="absolute bottom-0 left-0 w-72 h-72 bg-[#F5A623]/5 rounded-full blur-3xl"/></div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white" style={{fontFamily:"'Playfair Display',serif"}}>{commitmentTitle}</h2>
            <p className="text-white/60 mb-6 max-w-2xl mx-auto leading-relaxed">{commitmentText}</p>
            <p className="text-white/50 mb-8 max-w-2xl mx-auto leading-relaxed">{commitmentSubtext}</p>
            <Link href={commitmentButtonHref} className="inline-block px-8 py-3.5 rounded-xl font-semibold text-[#0A1628] bg-gradient-to-r from-[#D4AF37] to-[#F5A623] hover:from-[#C4A037] hover:to-[#E59620] transition-all duration-200 shadow-lg shadow-[#D4AF37]/20">{commitmentButtonLabel}</Link>
          </div>
        </div>
      </section>      {/* ========== Newsletter Signup ========== */}
      <TrustBadges />
      <WhyChooseUs />
      <CompanyTimeline milestones={journey} title={journeyTitle} />
      <PartnerLogos />
      <Newsletter />
</div>
  );
}
