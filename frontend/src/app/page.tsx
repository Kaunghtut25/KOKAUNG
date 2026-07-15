// A9 v3.0 — Fully Dynamic Homepage from Admin Site Manager
"use client";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PopularDestinations from "@/components/PopularDestinations";
import { Airport, airports } from '@/data/airports';
import Image from 'next/image';

type TabType = "oneway" | "roundtrip" | "multicity";

interface FlightLeg { from: string; to: string; date: string; }
interface PassengerCounts { adults: number; children: number; infants: number; }

// Site config interface (matches admin API)
interface SiteConfig {
  heroSlides: { image:string;label:string;title:string;subtitle:string }[];
  heroHeightMobile: number; heroHeightDesktop: number;
  serviceIcons: { label:string;icon:string;href:string;enabled:boolean }[];
  statsCards: { icon:string;title:string;description:string;imgSrc:string }[];
  whyChooseCards: { icon:string;title:string;description:string }[];
  ctaTitle: string; ctaDescription: string; ctaButtonLabel: string; ctaButtonHref: string;
  footerCopyright: string;
}

const defaultSlides = [
  { image: "/images_v2/hero-bagan-v2.jpg", label: "Golden Land", title: "Myanmar — Bagan Temples", subtitle: "Over 2,000 ancient pagodas across a mystical plain" },
  { image: "/images_v2/hero-singapore-v2.jpg", label: "Lion City", title: "Singapore — Marina Bay", subtitle: "Futuristic skyline meets lush garden city living" },
  { image: "/images_v2/hero-thailand-v2.jpg", label: "Land of Smiles", title: "Thailand — Grand Palace", subtitle: "Golden spires and ornate temples in Bangkok" },
];

const defaultServices = [
  { label: 'Flights', icon: '✈️', href: '/' },
  { label: 'Tours', icon: '🏔️', href: '/tours' },
  { label: 'Hotels', icon: '🏨', href: '/hotels' },
  { label: 'Cars', icon: '🚗', href: '/cars' },
  { label: 'Visas', icon: '🛂', href: '/visas' },
  { label: 'Insurance', icon: '🛡️', href: '/insurance' },
  { label: 'Cruises', icon: '🚢', href: '/cruises' },
  { label: 'Sky Lounge', icon: '✨', href: '/mingalar' },
];

function StatsCard({ icon, title, description, imgSrc }: { icon: string; title: string; description: string; imgSrc?: string }) {
  return (
    <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {imgSrc ? (
        <div className="w-full h-32 mx-auto mb-4 relative rounded-lg overflow-hidden bg-gray-50">
          <img src={imgSrc} alt={title} className="w-full h-full object-contain" loading="lazy" />
        </div>
      ) : (
        <div className="text-[#D4AF37] text-4xl mb-3">{icon}</div>
      )}
      <h3 className="text-lg font-bold text-[#0A1628] mb-1">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}

function WhyChooseCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFFDF5] flex items-center justify-center text-[#D4AF37] text-3xl">{icon}</div>
      <h3 className="text-xl font-bold text-[#0A1628] mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function AirportInput({ label, value, onChange, placeholder, icon }: { label: string; value: string; onChange: (val: string) => void; placeholder: string; icon: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const priorityCities = ["RGN","MDL","BKK","KUL","SIN"];
  const priorityAirports = airports.filter(a => priorityCities.includes(a.code));
  const filtered = (() => {
    const q = query.toLowerCase().trim();
    if (!q) return priorityAirports;
    return airports.filter((a) => a.code.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.country.toLowerCase().includes(q)).slice(0, 50);
  })();
  useEffect(() => {
    function handleClick(e: MouseEvent) { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  return (
    <div ref={wrapperRef} className="relative flex-1 min-w-[160px] w-full sm:flex-1">
      <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">{icon}{label}</label>
      <input type="text" value={isOpen ? query : value ? `${value} - ${airports.find(a=>a.code===value)?.city || value}` : ""}
        onFocus={() => { setIsOpen(true); setQuery(""); }}
        onChange={(e) => { setQuery(e.target.value.replace(/\\s*-.*$/,'')); setIsOpen(true); }}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder={placeholder}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-[#D4AF37] transition-all duration-200" />
      {isOpen && filtered.length > 0 && <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-xl max-h-[280px] overflow-y-auto mt-1"><div className="px-3 py-1.5 text-xs text-gray-400 font-semibold uppercase border-b bg-gray-50 sticky top-0">Select Airport</div>{filtered.map(a=><div key={a.code} onMouseDown={()=>{onChange(a.code);setIsOpen(false);}} className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex justify-between items-center"><div><span className="font-semibold text-gray-900">{a.code}</span><span className="text-gray-500 ml-2">{a.city}</span></div><span className="text-xs text-gray-400">{a.country}</span></div>)}</div>}
    </div>
  );
}

function PassengerSelector({ passengers, onChange }: { passengers: PassengerCounts; onChange: (p: PassengerCounts) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const update = (k: keyof PassengerCounts, delta: number) => {
    const next = { ...passengers, [k]: Math.max(k==="adults"?1:0, passengers[k]+delta) };
    onChange(next);
  };

  const total = passengers.adults + passengers.children + passengers.infants;
  const summary = `${total} ${total === 1 ? 'Passenger' : 'Passengers'}`;

  return (
    <div ref={ref} className="flex-1 min-w-[140px] relative">
      <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1"><span className="text-[#D4AF37]">👥</span> Passengers</label>
      <button type="button" onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-left text-gray-900 outline-none focus:border-[#D4AF37] transition-all duration-200 flex items-center justify-between">
        <span className="text-sm">{summary}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 p-3">
          {(["adults","children","infants"] as const).map(k=><div key={k} className="flex items-center justify-between py-1.5"><span className="text-sm text-gray-700 capitalize">{k}</span><div className="flex items-center gap-2"><button type="button" onClick={()=>update(k,-1)} className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${passengers[k] <= (k==="adults"?1:0) ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`} disabled={passengers[k] <= (k==="adults"?1:0)}>−</button><span className="w-6 text-center text-gray-900 font-semibold text-sm">{passengers[k]}</span><button type="button" onClick={()=>update(k,1)} className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-300 flex items-center justify-center transition-colors">+</button></div></div>)}
          <button type="button" onClick={() => setIsOpen(false)} className="w-full mt-2 py-1.5 rounded-lg bg-[#D4AF37] text-white text-xs font-semibold hover:bg-[#C5A028] transition-colors">Done</button>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>("oneway");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [multiCityLegs, setMultiCityLegs] = useState<FlightLeg[]>([{ from: "", to: "", date: "" }, { from: "", to: "", date: "" }]);
  const [passengers, setPassengers] = useState<PassengerCounts>({ adults: 1, children: 0, infants: 0 });
  const [travelClass, setTravelClass] = useState("Economy");
  const [clientType, setClientType] = useState<'local' | 'foreigner'>('local');

  // Fetch dynamic site config
  useEffect(() => {
    fetch('/api/admin/site-config').then(r=>r.json()).then(d=>{
      if (d && d.heroSlides) setSiteConfig(d);
    }).catch(()=>{});
  }, []);

  const slides = siteConfig?.heroSlides?.length ? siteConfig.heroSlides : defaultSlides;
  const services = siteConfig?.serviceIcons?.length ? siteConfig.serviceIcons.filter((s:any)=>s.enabled!==false) : defaultServices;

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlideHandler = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (i: number) => setCurrentSlide(i);

  const swapAirports = () => { const tmp = from; setFrom(to); setTo(tmp); };
  const updateMultiCityLeg = (idx:number, f:"from"|"to"|"date", v:string) => { const legs=[...multiCityLegs]; legs[idx]={...legs[idx],[f]:v}; setMultiCityLegs(legs); };
  const handleAddLeg = () => setMultiCityLegs([...multiCityLegs, { from:"", to:"", date:"" }]);
  const handleRemoveLeg = (idx:number) => setMultiCityLegs(multiCityLegs.filter((_,i)=>i!==idx));
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); toast.success("Searching flights..."); };

  const heroHeight = siteConfig?.heroHeightDesktop || 460;
  const heroHeightMobile = siteConfig?.heroHeightMobile || 340;
  const statsCards = siteConfig?.statsCards?.length ? siteConfig.statsCards : [];
  const whyCards = siteConfig?.whyChooseCards?.length ? siteConfig.whyChooseCards : [];

  return (
    <main className="min-h-screen bg-white">
      {/* ========== Hero Section ========== */}
      <section className="relative w-full overflow-hidden" style={{ height: `${siteConfig?.heroHeightDesktop || 460}px`, maxHeight: "100vh" }}>
        {/* Gradient overlay */}
        <div className="absolute inset-0 overflow-hidden">
          {slides.map((slide:any, index:number) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}>
              <img src={slide.image || defaultSlides[0].image} alt={slide.title || "A9 Global"} className="w-full h-full object-cover" loading={index===0?"eager":"lazy"} />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/70 via-[#0A1628]/40 to-transparent" />
        </div>

        {/* Slide content — moved up */}
        <div className="relative z-10 flex flex-col items-center px-4 text-center pt-16">
          {slides.map((slide:any, index:number) => (
            <div key={index} className={`transition-all duration-700 ${index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 absolute pointer-events-none"}`}>
              {slide.label && <span className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#D4AF37]/30">{slide.label}</span>}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 text-white drop-shadow-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{slide.title || "A9 Global Travels & Tours"}</h1>
              {slide.subtitle && <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto drop-shadow">{slide.subtitle}</p>}
            </div>
          ))}
        </div>

        {/* Nav arrows */}
        <button onClick={prevSlideHandler} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {slides.map((_:any, index:number) => (
            <button key={index} onClick={() => goToSlide(index)}
              className={"w-3 h-3 rounded-full transition-all duration-300 cursor-pointer " + (index === currentSlide ? "bg-[#D4AF37] scale-125 shadow-lg shadow-[#D4AF37]/50" : "bg-white/40 hover:bg-white/70")}
              aria-label={"Go to slide " + (index + 1)} />
          ))}
        </div>

      </section>

      {/* ========== Search Engine ========== */}
      <div className="relative -mt-12 md:-mt-16 z-40 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-[#D4AF37]/30 shadow-xl p-5 md:p-7 overflow-visible">
            <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1 w-fit">
              {(["oneway","roundtrip","multicity"] as TabType[]).map((tab)=><button key={tab} onClick={()=>{setActiveTab(tab);if(tab!=="roundtrip")setReturnDate("");if(tab==="multicity")setMultiCityLegs([{from:"",to:"",date:""},{from:"",to:"",date:""}]);}} className={"px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer "+(activeTab===tab?"bg-[#D4AF37] text-white shadow-md":"text-gray-500 hover:text-gray-900 hover:bg-gray-200")}>{tab==="oneway"?"✈ One Way":tab==="roundtrip"?"🔄 Round Trip":"🌐 Multi-City"}</button>)}
            </div>
            <form onSubmit={handleSearch} className="space-y-3">
              {activeTab==="multicity" ? (<>
                <div className="space-y-4">
                  {multiCityLegs.map((leg,index)=><div key={index} className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                    <AirportInput label="" value={leg.from} onChange={(val)=>updateMultiCityLeg(index,"from",val)} placeholder="From city" icon={<svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>} />
                    <AirportInput label="" value={leg.to} onChange={(val)=>updateMultiCityLeg(index,"to",val)} placeholder="To city" icon={<svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>} />
                    <div className="flex-1 min-w-[140px]"><input type="date" value={leg.date} onChange={e=>updateMultiCityLeg(index,"date",e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-[#D4AF37] transition-all" /></div>
                    {multiCityLegs.length>2&&<button type="button" onClick={()=>handleRemoveLeg(index)} className="flex items-center justify-center w-7 h-7 mt-3 rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all flex-shrink-0 text-sm">✕</button>}
                  </div>)}
                </div>
                {multiCityLegs.length<6&&<div className="flex items-start gap-2"><div className="w-10 flex-shrink-0"/><div className="flex-1"><button type="button" onClick={handleAddLeg} className="flex items-center gap-2 text-[#D4AF37] hover:text-[#C5A028] text-sm font-medium transition-colors cursor-pointer py-1"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>Add Another Flight</button></div></div>}
                <div className="flex flex-col md:flex-row gap-3 items-end flex-wrap">
                  <PassengerSelector passengers={passengers} onChange={setPassengers} />
                  <div className="w-full md:w-[180px]"><label className="block text-gray-500 text-xs uppercase tracking-wider mb-1"><span className="text-[#D4AF37]">💺</span> Class</label><select value={travelClass} onChange={e=>setTravelClass(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-900 outline-none focus:border-[#D4AF37] transition-all cursor-pointer"><option value="Economy">Economy</option><option value="Premium Economy">Premium Economy</option><option value="Business">Business</option><option value="First">First Class</option></select></div>
                  <div className="w-full md:w-[180px]"><label className="block text-gray-500 text-xs uppercase tracking-wider mb-1"><span className="text-[#D4AF37]">🛂</span> Client</label><div className="flex bg-gray-50 border border-gray-200 rounded-lg p-1"><button type="button" onClick={()=>setClientType('local')} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${clientType==='local'?'bg-[#D4AF37] text-white shadow-sm':'text-gray-500 hover:text-gray-900'}`}>🇲🇲 Local</button><button type="button" onClick={()=>setClientType('foreigner')} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${clientType==='foreigner'?'bg-[#D4AF37] text-white shadow-sm':'text-gray-500 hover:text-gray-900'}`}>🌏 Foreigner</button></div></div>
                  <button type="submit" className="w-full md:w-auto bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-white font-bold px-8 py-3 rounded-lg hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">🔍 Search Flights</button>
                </div>
              </>) : (<>
                <div className="grid grid-cols-1 md:flex md:flex-row gap-3">
                  <AirportInput label='From' value={from} onChange={setFrom} placeholder="Departure city" icon={<svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>} />
                  <button type="button" onClick={swapAirports} className="hidden md:flex items-center justify-center w-10 h-10 mt-6 rounded-full bg-gray-100 border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-[#D4AF37]/50 transition-all cursor-pointer flex-shrink-0" title="Swap airports">⇄</button>
                  <AirportInput label="To" value={to} onChange={setTo} placeholder="Arrival city" icon={<svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>} />
                  <div className="flex-1 min-w-[140px] w-full sm:flex-1"><label className="block text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><span className="text-[#D4AF37]">📅</span>Departure</label><input type="date" value={departDate} onChange={e=>setDepartDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-[#D4AF37] transition-all" /></div>
                  {activeTab==="roundtrip"&&<div className="flex-1 min-w-[140px] w-full sm:flex-1"><label className="block text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><span className="text-[#D4AF37]">📅</span>Return</label><input type="date" value={returnDate} onChange={e=>setReturnDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-[#D4AF37] transition-all" /></div>}
                </div>
                <div className="flex flex-col md:flex-row gap-3 items-end flex-wrap">
                  <PassengerSelector passengers={passengers} onChange={setPassengers} />
                  <div className="w-full md:w-[180px]"><label className="block text-gray-500 text-xs uppercase tracking-wider mb-1"><span className="text-[#D4AF37]">💺</span> Class</label><select value={travelClass} onChange={e=>setTravelClass(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-900 outline-none focus:border-[#D4AF37] transition-all cursor-pointer"><option value="Economy">Economy</option><option value="Premium Economy">Premium Economy</option><option value="Business">Business</option><option value="First">First Class</option></select></div>
                  <div className="w-full md:w-[180px]"><label className="block text-gray-500 text-xs uppercase tracking-wider mb-1"><span className="text-[#D4AF37]">🛂</span> Client</label><div className="flex bg-gray-50 border border-gray-200 rounded-lg p-1"><button type="button" onClick={()=>setClientType('local')} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${clientType==='local'?'bg-[#D4AF37] text-white shadow-sm':'text-gray-500 hover:text-gray-900'}`}>🇲🇲 Local</button><button type="button" onClick={()=>setClientType('foreigner')} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${clientType==='foreigner'?'bg-[#D4AF37] text-white shadow-sm':'text-gray-500 hover:text-gray-900'}`}>🌏 Foreigner</button></div></div>
                  <button type="submit" className="w-full md:w-auto bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-white font-bold px-8 py-3 rounded-lg hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">🔍 Search Flights</button>
                </div>
              </>)}
            </form>
          </div>
        </div>
      </div>

      {/* ========== Popular Destinations ========== */}
      <PopularDestinations />

      {/* ========== Stats Section (Dynamic) ========== */}
      {statsCards.length > 0 && (
        <section className="py-16 bg-[#FFFDF5]">
          <div className="max-w-6xl mx-auto px-4">
            <div className={`grid grid-cols-2 md:grid-cols-${statsCards.length > 3 ? 4 : statsCards.length} gap-6`}>
              {statsCards.map((s:any,i:number) => <StatsCard key={i} {...s} />)}
            </div>
          </div>
        </section>
      )}

      {/* ========== Why Choose Us (Dynamic) ========== */}
      {whyCards.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm font-medium mb-3">Why Choose Us</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A1628]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Your Journey, Our Priority</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyCards.map((s:any,i:number) => <WhyChooseCard key={i} {...s} />)}
            </div>
          </div>
        </section>
      )}

      {/* ========== CTA Section ========== */}
      <section className="py-24 bg-[#0A1628] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: "url(/images_v2/cta-bg-v2.jpg)" }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white font-['Playfair_Display',serif] mb-6">{siteConfig?.ctaTitle || "Ready to Start Your Journey?"}</h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">{siteConfig?.ctaDescription || "Let us craft your perfect getaway."}</p>
          <Link href={siteConfig?.ctaButtonHref || "/book-now"} className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] font-bold px-10 py-4 rounded-full text-lg hover:shadow-xl hover:shadow-[#D4AF37]/40 transition-all duration-300 transform hover:scale-105 cursor-pointer inline-block">{siteConfig?.ctaButtonLabel || "Book Now"}</Link>
        </div>
      </section>

      <footer className="bg-gray-50 border-t border-gray-200 py-10">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>{siteConfig?.footerCopyright || `© ${new Date().getFullYear()} A9 Global Travels & Tours. All rights reserved.`}</p>
        </div>
      </footer>
    </main>
  );
}
