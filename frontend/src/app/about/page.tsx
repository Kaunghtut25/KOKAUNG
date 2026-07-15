"use client";

import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";

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
}

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
};

export default function AboutPage() {
  const [config, setConfig] = useState<AboutConfig | null>(null);

  useEffect(() => {
    fetch("/api/admin/site-config").then(r => r.json()).then(d => {
      if (d?.about) setConfig({ ...defaultAbout, ...d.about });
      else setConfig(defaultAbout);
    }).catch(() => setConfig(defaultAbout));
  }, []);

  if (!config) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-400 animate-pulse">Loading...</div></div>;

  const { heroImage, heroTitle, heroSubtitle, whoWeAreText, missionTitle, missionText, visionTitle, visionText, valuesTitle, values, servicesTitle, services, whyChooseUsTitle, whyChooseUs, teamTitle, teamSubtitle, teamMembers, commitmentTitle, commitmentText, commitmentSubtext, commitmentButtonLabel, commitmentButtonHref } = config;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="relative pt-28 pb-20 sm:pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage || FALLBACK_IMG} alt="A9 Global" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/85 via-[#0A1628]/70 to-[#0A1628]/85" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-[#D4AF37] text-sm uppercase tracking-widest mb-4 font-semibold">About Us</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">{heroTitle.split("A9 Global")[0] || "Welcome to"}</span>
            <br /><span className="text-white">A9 Global Travel &amp; Tours</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">{heroSubtitle}</p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#0A1628]" style={{ fontFamily: "'Playfair Display', serif" }}>Who <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">We Are</span></h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              {whoWeAreText.map((p,i) => <p key={i} className={i===whoWeAreText.length-1?"text-[#B8960F] italic font-medium":""}>{p}</p>)}
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-80 sm:h-96 rounded-2xl border-2 border-[#D4AF37]/30 overflow-hidden shadow-lg">
              <img src={heroImage || FALLBACK_IMG} alt="A9 Global" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/60 to-transparent" />
              <div className="absolute bottom-6 left-6"><p className="text-[#D4AF37] font-semibold text-lg">A9 Global</p><p className="text-white/80 text-sm">Connecting Myanmar to the World</p></div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl border border-[#D4AF37]/20 -z-10" />
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[{title:missionTitle,text:missionText,svg:<path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/>},
           {title:visionTitle,text:visionText,svg:<path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>}].map((item,i)=>
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 hover:border-[#D4AF37]/40 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 mb-5 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
                <svg className="w-8 h-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{item.svg}</svg>
              </div>
              <h3 className="text-2xl font-bold text-[#0A1628] mb-4" style={{fontFamily:"'Playfair Display',serif"}}>{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.text}</p>
            </div>
          )}
        </div>
      </section>

      {/* VALUES */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 sm:pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-[#0A1628]" style={{fontFamily:"'Playfair Display',serif"}}>Our <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">Values</span></h2>
          <p className="text-gray-500">The principles that guide everything we do</p>
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

      {/* CREDENTIALS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 sm:pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3 text-[#0A1628]" style={{fontFamily:"'Playfair Display',serif"}}><span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">Accreditations &amp; Licenses</span></h2>
          <p className="text-gray-500">Officially recognized and fully licensed</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[{title:"IATA Accredited",code:"05301026",img:"/images_v2/iata-logo.png"},{title:"Licensed Tour Operator",code:"T/O(YGN)-0946",img:"/images_v2/license-tour-operator.png"},{title:"Company Registration",code:"126395248",img:"/images_v2/company-registration.png"}].map((item,i)=>
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:border-[#D4AF37]/40 hover:shadow-md transition-all"><div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center"><img src={item.img} alt={item.title} className="w-full h-full object-contain"/></div><h4 className="text-[#0A1628] font-semibold mb-1">{item.title}</h4><p className="text-[#D4AF37] text-sm font-mono font-medium">{item.code}</p></div>
          )}
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-gray-100 bg-[#0A1628]">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[["10+","Years of Experience"],["5,000+","Happy Travelers"],["50+","Destinations"],["24/7","Support"]].map(([n,l])=><div key={l}><div className="text-4xl sm:text-5xl font-bold text-[#D4AF37] mb-2" style={{fontFamily:"'Playfair Display',serif"}}>{n}</div><p className="text-white/50 text-sm uppercase tracking-wider">{l}</p></div>)}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16 sm:py-20">
        <div className="text-center mb-12"><h2 className="text-3xl sm:text-4xl font-bold mb-3 text-[#0A1628]" style={{fontFamily:"'Playfair Display',serif"}}>Our <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">Expert Team</span></h2><p className="text-gray-500 max-w-xl mx-auto">{teamSubtitle}</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((m,i)=><div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:border-[#D4AF37]/40 hover:shadow-lg transition-all duration-300 group"><div className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-gray-200 group-hover:border-[#D4AF37]/40 transition-colors overflow-hidden"><img src={m.image||FALLBACK_IMG} alt={m.name} className="w-24 h-24 rounded-full object-cover" onError={e=>{(e.target as HTMLImageElement).src=FALLBACK_IMG}}/></div><h4 className="text-[#0A1628] font-semibold text-lg mb-1">{m.name}</h4><p className="text-[#D4AF37] text-sm font-medium">{m.role}</p></div>)}
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
      </section>
    </div>
  );
}
