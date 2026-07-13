"use client";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PopularDestinations from "@/components/PopularDestinations";
import { Airport, airports } from '@/data/airports';
import { useNearestAirport } from '@/hooks/useNearestAirport';
import Image from 'next/image';

type TabType = "oneway" | "roundtrip" | "multicity";

interface FlightLeg { from: string; to: string; date: string; }
interface PassengerCounts { adults: number; children: number; infants: number; }

const slides = [
  { image: "https://images.unsplash.com/photo-1570168007203-1c4a712df7ab?w=1920&q=80", label: "Golden Land", title: "Myanmar — Bagan Temples", subtitle: "Over 2,000 ancient pagodas across a mystical plain" },
  { image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1920&q=80", label: "Lion City", title: "Singapore — Marina Bay", subtitle: "Futuristic skyline meets lush garden city living" },
  { image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1920&q=80", label: "Land of Smiles", title: "Thailand — Grand Palace", subtitle: "Golden spires and ornate temples in Bangkok" },
  { image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1920&q=80", label: "Truly Asia", title: "Malaysia — Petronas Towers", subtitle: "Iconic twin towers rising above Kuala Lumpur" },
  { image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80", label: "Timeless Charm", title: "Vietnam — Ha Long Bay", subtitle: "Emerald waters dotted with limestone islands" },
  { image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1920&q=80", label: "Ancient Empire", title: "China — The Great Wall", subtitle: "A wonder stretching across mountain peaks" },
  { image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1920&q=80", label: "Pearl of the Orient", title: "Philippines — Palawan", subtitle: "Crystal-clear lagoons and dramatic limestone cliffs" },
  { image: "https://images.unsplash.com/photo-1537996194471-e657f9e13fba?w=1920&q=80", label: "Emerald Isles", title: "Indonesia — Bali Temples", subtitle: "Sacred shrines perched on volcanic shores" },
  { image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1920&q=80", label: "Hidden Gem", title: "Laos — Luang Prabang", subtitle: "Golden temples along the Mekong River" },
  { image: "https://images.unsplash.com/photo-1570610153147-5b6b6ca68701?w=1920&q=80", label: "Kingdom of Wonder", title: "Cambodia — Angkor Wat", subtitle: "The world's largest religious monument at dawn" },
];

function StatsCard({ icon, title, description, imgSrc }: { icon: string; title: string; description: string; imgSrc?: string }) {
  return (
    <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {imgSrc ? (
        <div className="w-16 h-16 mx-auto mb-3 relative">
          <Image src={imgSrc} alt={title} width={64} height={64} className="object-contain" />
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
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = airports.filter((a) => {
    const q = query.toLowerCase().trim();
    if (!q) return airports.slice(0, 8);
    return a.code.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.country.toLowerCase().includes(q);
  });

  useEffect(() => {
    function handleClick(e: MouseEvent) { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => { if (!isOpen) setQuery(value); }, [value, isOpen]);

  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const items = listRef.current.children;
      if (items[highlightIndex]) (items[highlightIndex] as HTMLElement).scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex]);

  const selectAirport = (airport: Airport) => {
    const display = airport.code + " - " + airport.city + ", " + airport.country;
    onChange(display); setQuery(display); setIsOpen(false); setHighlightIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) { if (e.key === "ArrowDown" || e.key === "ArrowUp") { setIsOpen(true); e.preventDefault(); } return; }
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); setHighlightIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0)); break;
      case "ArrowUp": e.preventDefault(); setHighlightIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1)); break;
      case "Enter": e.preventDefault(); if (highlightIndex >= 0 && highlightIndex < filtered.length) selectAirport(filtered[highlightIndex]); else if (filtered.length === 1) selectAirport(filtered[0]); break;
      case "Escape": setIsOpen(false); setHighlightIndex(-1); break;
      case "Tab": setIsOpen(false); break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex-1 min-w-[140px]">
      {label && (
      <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
        <span className="text-[#D4AF37]">{icon}</span>{label}
      </label>
      )}
      <input ref={inputRef} type="text" value={isOpen ? query : value}
        onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setIsOpen(true); setHighlightIndex(-1); }}
        onFocus={(e) => { setIsOpen(true); setQuery(value); e.target.select(); }}
        onKeyDown={handleKeyDown} placeholder={placeholder}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-[#D4AF37] transition-all duration-200" />
      {isOpen && filtered.length > 0 && (
        <div ref={listRef} className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl max-h-60 overflow-y-auto z-[100] shadow-xl">
          {filtered.slice(0, 50).map((airport, idx) => (
            <button key={airport.code} type="button" onClick={() => selectAirport(airport)} onMouseEnter={() => setHighlightIndex(idx)}
              className={"w-full text-left px-4 py-3 flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer " + (idx === highlightIndex ? "bg-[#D4AF37]/10 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")}>
              <span className="inline-flex items-center justify-center w-10 h-7 rounded bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold flex-shrink-0 border border-[#D4AF37]/30">{airport.code}</span>
              <div className="min-w-0"><div className="text-sm font-medium leading-tight truncate">{airport.city}</div><div className="text-xs text-gray-400 leading-tight">{airport.country}</div></div>
            </button>
          ))}
        </div>
      )}
      {isOpen && query.trim() && filtered.length === 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl z-[100] shadow-xl">
          <div className="px-4 py-6 text-center text-gray-400 text-sm">No airports found for &ldquo;{query}&rdquo;</div>
        </div>
      )}
    </div>
  );
}

function PassengerSelector({ passengers, onChange }: { passengers: PassengerCounts; onChange: (p: PassengerCounts) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const total = passengers.adults + passengers.children + passengers.infants;
  const maxPassengers = 9;

  useEffect(() => {
    function handleClick(e: MouseEvent) { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const update = (key: keyof PassengerCounts, delta: number) => {
    const newVal = passengers[key] + delta;
    if (newVal < 0 || newVal > 9) return;
    const newTotal = total - passengers[key] + newVal;
    if (newTotal > maxPassengers) return;
    if (key === 'adults' && newVal < 1) return;
    onChange({ ...passengers, [key]: newVal });
  };

  const summary = (total === passengers.adults && passengers.children === 0 && passengers.infants === 0)
    ? `${passengers.adults} Adult${passengers.adults !== 1 ? 's' : ''}`
    : [`${passengers.adults} Adult${passengers.adults !== 1 ? 's' : ''}`, passengers.children > 0 ? `${passengers.children} Child${passengers.children !== 1 ? 'ren' : ''}` : '', passengers.infants > 0 ? `${passengers.infants} Infant${passengers.infants !== 1 ? 's' : ''}` : ''].filter(Boolean).join(', ');

  const rows = [
    { key: 'adults' as const, label: 'Adults', sub: '12+ years' },
    { key: 'children' as const, label: 'Children', sub: '2–11 years' },
    { key: 'infants' as const, label: 'Infants', sub: 'Under 2 years' },
  ];

  return (
    <div ref={wrapperRef} className="relative w-full md:w-[200px]">
      <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1"><span className="text-[#D4AF37]">👥</span> Passengers</label>
      <button type="button" onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-900 text-left outline-none focus:border-[#D4AF37] transition-all duration-200 cursor-pointer">
        <span className="text-sm">{summary}</span>
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 w-72 bg-white border border-gray-200 rounded-xl z-[100] shadow-xl p-4">
          {rows.map((row) => (
            <div key={row.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div><div className="text-gray-900 text-sm font-medium">{row.label}</div><div className="text-gray-400 text-xs">{row.sub}</div></div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => update(row.key, -1)}
                  disabled={row.key === 'adults' ? passengers.adults <= 1 : passengers[row.key] <= 0}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">−</button>
                <span className="text-gray-900 w-6 text-center font-medium">{passengers[row.key]}</span>
                <button type="button" onClick={() => update(row.key, 1)}
                  disabled={total >= maxPassengers || passengers[row.key] >= 9}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">+</button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
            <span className="text-gray-400 text-xs">Max 9 passengers total</span>
            <button type="button" onClick={() => setIsOpen(false)} className="text-[#D4AF37] text-sm font-medium hover:text-[#C5A028] transition-colors cursor-pointer">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("oneway");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState<PassengerCounts>({ adults: 1, children: 0, infants: 0 });
  const [travelClass, setTravelClass] = useState("Economy");
  const [multiCityLegs, setMultiCityLegs] = useState<FlightLeg[]>([{ from: "", to: "", date: "" }, { from: "", to: "", date: "" }]);
  const [clientType, setClientType] = useState<'local' | 'foreigner'>('local');

  // Auto-detect nearest airport for departure
  const { nearest } = useNearestAirport(airports);
  const [fromAutoSet, setFromAutoSet] = useState(false);

  useEffect(() => {
    if (nearest && !fromAutoSet) {
      setFrom(`${nearest.code} - ${nearest.city}, ${nearest.country}`);
      setFromAutoSet(true);
    }
  }, [nearest, fromAutoSet]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true); setPrevSlide(currentSlide); setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [currentSlide, isTransitioning]);

  const nextSlide = useCallback(() => { goToSlide((currentSlide + 1) % slides.length); }, [currentSlide, goToSlide]);
  const prevSlideHandler = useCallback(() => { goToSlide((currentSlide - 1 + slides.length) % slides.length); }, [currentSlide, goToSlide]);

  useEffect(() => { const interval = setInterval(nextSlide, 4000); return () => clearInterval(interval); }, [nextSlide]);

  // Toast notification on client type change
  useEffect(() => {
    if (clientType === 'local') {
      toast.success('🇲🇲 Local rates apply (MMK)', { duration: 3000, style: { background: '#0A1628', color: '#D4AF37', border: '1px solid #D4AF37' } });
    } else {
      toast.success('🌏 Foreigner rates apply (USD)', { duration: 3000, style: { background: '#0A1628', color: '#D4AF37', border: '1px solid #D4AF37' } });
    }
  }, [clientType]);

  const handleAddLeg = () => { if (multiCityLegs.length < 6) setMultiCityLegs([...multiCityLegs, { from: "", to: "", date: "" }]); };
  const handleRemoveLeg = (index: number) => { if (multiCityLegs.length > 2) setMultiCityLegs(multiCityLegs.filter((_, i) => i !== index)); };
  const updateMultiCityLeg = (index: number, field: keyof FlightLeg, value: string) => {
    const updated = [...multiCityLegs]; updated[index] = { ...updated[index], [field]: value }; setMultiCityLegs(updated);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "multicity") {
      for (let i = 0; i < multiCityLegs.length; i++) {
        const leg = multiCityLegs[i];
        if (!leg.from.trim()) { toast.error("Please select a departure airport for Flight " + (i + 1)); return; }
        if (!leg.to.trim()) { toast.error("Please select an arrival airport for Flight " + (i + 1)); return; }
        if (!leg.date) { toast.error("Please select a date for Flight " + (i + 1)); return; }
      }
      const params = new URLSearchParams();
      params.set("type", "multicity"); params.set("legs", String(multiCityLegs.length));
      multiCityLegs.forEach((leg, i) => { params.set("from" + i, leg.from); params.set("to" + i, leg.to); params.set("date" + i, leg.date); });
      params.set("adults", String(passengers.adults)); params.set("children", String(passengers.children));
      params.set("infants", String(passengers.infants)); params.set("class", travelClass);
      params.set("dest", multiCityLegs[0].from); params.set("q", multiCityLegs[0].to);
      router.push("/book-now?" + params.toString()); return;
    }
    if (!from.trim()) { toast.error("Please select a departure airport"); return; }
    if (!to.trim()) { toast.error("Please select an arrival airport"); return; }
    if (!departDate) { toast.error("Please select a departure date"); return; }
    if (activeTab === "roundtrip" && !returnDate) { toast.error("Please select a return date"); return; }
    const params = new URLSearchParams();
    params.set("type", activeTab); params.set("from", from); params.set("to", to); params.set("depart", departDate);
    if (activeTab === "roundtrip") params.set("return", returnDate);
    params.set("adults", String(passengers.adults)); params.set("children", String(passengers.children));
    params.set("infants", String(passengers.infants)); params.set("class", travelClass);
    router.push("/book-now?" + params.toString());
  };

  const swapAirports = () => { const tmp = from; setFrom(to); setTo(tmp); };

  return (
    <main className="min-h-screen bg-[#FFFDF5]">
      {/* ========== Hero (slides only) ========== */}
      <section className="relative min-h-[450px] md:min-h-[500px] w-full overflow-visible">
        {slides.map((slide, index) => (
          <div key={index}
            className={"absolute inset-0 transition-all duration-700 ease-in-out " + (index === currentSlide ? "opacity-100 z-10" : index === prevSlide ? "opacity-0 z-0" : "opacity-0 z-0")}>
            <div className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
            <div className="absolute top-14 md:top-18 left-0 right-0 text-center px-4">
              <span className="text-[#D4AF37] text-xs md:text-sm uppercase tracking-[0.3em] font-semibold">{slide.label}</span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mt-2 mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{slide.title}</h2>
              <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto">{slide.subtitle}</p>
            </div>
          </div>
        ))}
        <button onClick={prevSlideHandler} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {slides.map((_, index) => (
            <button key={index} onClick={() => goToSlide(index)}
              className={"w-3 h-3 rounded-full transition-all duration-300 cursor-pointer " + (index === currentSlide ? "bg-[#D4AF37] scale-125 shadow-lg shadow-[#D4AF37]/50" : "bg-white/40 hover:bg-white/70")}
              aria-label={"Go to slide " + (index + 1)} />
          ))}
        </div>

        {/* ========== Service Navigation Icons (hero middle, below slide text) ========== */}
        <div className="absolute left-0 right-0 top-[46%] md:top-[48%] z-20 px-1">
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-1 md:gap-2">
            {[
              { label: 'Flights', icon: '✈️', href: '/' },
              { label: 'Tours', icon: '🏔️', href: '/tours' },
              { label: 'Hotels', icon: '🏨', href: '/hotels' },
              { label: 'Cars', icon: '🚗', href: '/cars' },
              { label: 'Visas', icon: '🛂', href: '/visas' },
              { label: 'Insurance', icon: '🛡️', href: '/insurance' },
              { label: 'Cruises', icon: '🚢', href: '/cruises' },
              { label: 'Sky Lounge', icon: '✨', href: '/mingalar' },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className="flex flex-col items-center py-1 px-1.5 rounded-md bg-white/85 backdrop-blur-sm border border-white/20 hover:border-[#D4AF37] hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer text-center min-w-[52px]"
              >
                <span className="text-sm md:text-base group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="text-[9px] md:text-[10px] font-semibold text-gray-800 group-hover:text-[#D4AF37] transition-colors mt-0.5">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

              </section>

{/* ========== Search Engine (straddling hero/body, below icons) ========== */}
        <div className="relative -mt-40 md:-mt-48 z-30 px-4">
          <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-[#2563EB] shadow-xl p-5 md:p-7">
            <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1 w-fit">
              {(["oneway", "roundtrip", "multicity"] as TabType[]).map((tab) => (
                <button key={tab} onClick={() => { setActiveTab(tab); if (tab !== "roundtrip") setReturnDate(""); if (tab === "multicity") setMultiCityLegs([{ from: "", to: "", date: "" }, { from: "", to: "", date: "" }]); }}
                  className={"px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer " +
                    (activeTab === tab ? "bg-[#D4AF37] text-white shadow-md" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200")}>
                  {tab === "oneway" ? "✈ One Way" : tab === "roundtrip" ? "🔄 Round Trip" : "🌐 Multi-City"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} className="space-y-3">
              {activeTab === "multicity" ? (<>
                <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                  {multiCityLegs.map((leg, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <AirportInput label="" value={leg.from} onChange={(val) => updateMultiCityLeg(index, "from", val)} placeholder="From city"
                        icon={<svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>} />
                      <AirportInput label="" value={leg.to} onChange={(val) => updateMultiCityLeg(index, "to", val)} placeholder="To city"
                        icon={<svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>} />
                      <div className="flex-1 min-w-[110px]">
                        <label className="block text-gray-500 text-xs mb-1 sr-only">Date</label>
                        <input type="date" value={leg.date} onChange={(e) => updateMultiCityLeg(index, "date", e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-3 text-gray-900 text-sm outline-none focus:border-[#D4AF37] transition-all" />
                      </div>
                      {multiCityLegs.length > 2 && (
                        <button type="button" onClick={() => handleRemoveLeg(index)}
                          className="flex items-center justify-center w-7 h-7 mt-3 rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all cursor-pointer flex-shrink-0 text-sm">✕</button>
                      )}
                    </div>
                  ))}
                </div>
                  {multiCityLegs.length < 6 && (
                    <div className="flex items-start gap-2">
                      <div className="w-10 flex-shrink-0" />
                      <div className="flex-1 min-w-[140px]">
                        <button type="button" onClick={handleAddLeg}
                          className="flex items-center gap-2 text-[#D4AF37] hover:text-[#C5A028] text-sm font-medium transition-colors cursor-pointer py-1">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          Add Another Flight
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row gap-3 items-end flex-wrap">
                    <PassengerSelector passengers={passengers} onChange={setPassengers} />
                    <div className="w-full md:w-[180px]">
                      <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1"><span className="text-[#D4AF37]">💺</span> Class</label>
                      <select value={travelClass} onChange={(e) => setTravelClass(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-900 outline-none focus:border-[#D4AF37] transition-all duration-200 appearance-none cursor-pointer">
                        <option value="Economy">Economy</option>
                        <option value="Premium Economy">Premium Economy</option>
                        <option value="Business">Business</option>
                        <option value="First">First Class</option>
                      </select>
                    </div>
                    <div className="w-full md:w-[180px]">
                      <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1"><span className="text-[#D4AF37]">🛂</span> Client</label>
                      <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-1">
                        <button type="button" onClick={() => setClientType('local')}
                          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${clientType === 'local' ? 'bg-[#D4AF37] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                          🇲🇲 Local
                        </button>
                        <button type="button" onClick={() => setClientType('foreigner')}
                          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${clientType === 'foreigner' ? 'bg-[#D4AF37] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                          🌏 Foreigner
                        </button>
                      </div>
                    </div>
                    <button type="submit"
                      className="w-full md:w-auto bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-white font-bold px-8 py-3 rounded-lg hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap cursor-pointer">
                      🔍 Search Flights
                    </button>
                  </div>
              </>) : (
                <>
                  <div className="flex flex-col md:flex-row gap-3 flex-wrap">
                    <AirportInput label={nearest ? `📍 From ${fromAutoSet ? '· Auto-detected' : ''}` : 'From'} value={from} onChange={setFrom} placeholder="Departure city"
                      icon={<svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>} />
                    <button type="button" onClick={swapAirports}
                      className="hidden md:flex items-center justify-center w-10 h-10 mt-6 rounded-full bg-gray-100 border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-[#D4AF37]/50 transition-all duration-200 cursor-pointer flex-shrink-0"
                      title="Swap airports">⇄</button>
                    <AirportInput label="To" value={to} onChange={setTo} placeholder="Arrival city"
                      icon={<svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
                    <div className="flex-1 min-w-[140px]">
                      <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1"><span className="text-[#D4AF37]">📅</span> Departure</label>
                      <input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-[#D4AF37] transition-all duration-200" />
                    </div>
                    {activeTab === "roundtrip" && (
                      <div className="flex-1 min-w-[140px]">
                        <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1"><span className="text-[#D4AF37]">📅</span> Return</label>
                        <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)}
                          min={departDate || new Date().toISOString().split("T")[0]}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-[#D4AF37] transition-all duration-200" />
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab !== "multicity" && (
              <div className="flex flex-col md:flex-row gap-3 items-end flex-wrap">
                <PassengerSelector passengers={passengers} onChange={setPassengers} />
                <div className="w-full md:w-[180px]">
                  <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1"><span className="text-[#D4AF37]">💺</span> Class</label>
                  <select value={travelClass} onChange={(e) => setTravelClass(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-900 outline-none focus:border-[#D4AF37] transition-all duration-200 appearance-none cursor-pointer">
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First Class</option>
                  </select>
                </div>
                <div className="w-full md:w-[180px]">
                  <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1"><span className="text-[#D4AF37]">🛂</span> Client</label>
                  <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-1">
                    <button type="button" onClick={() => setClientType('local')}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${clientType === 'local' ? 'bg-[#D4AF37] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                      🇲🇲 Local
                    </button>
                    <button type="button" onClick={() => setClientType('foreigner')}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${clientType === 'foreigner' ? 'bg-[#D4AF37] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                      🌏 Foreigner
                    </button>
                  </div>
                </div>
                <button type="submit"
                  className="w-full md:w-auto bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-white font-bold px-8 py-3 rounded-lg hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap cursor-pointer">
                  🔍 Search Flights
                </button>
              </div>
              )}
            </form>
          </div>
        </div>
        </div>


      {/* ========== Popular Destinations ========== */}
      <PopularDestinations />

      <section className="py-16 bg-[#FFFDF5]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatsCard icon="✈️" title="IATA Accredited" description="Fully licensed and certified travel agency" imgSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/IATA_logo.svg/512px-IATA_logo.svg.png" />
          <StatsCard icon="🏆" title="10+ Years Exp" description="A decade of trusted travel expertise" imgSrc="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=128&h=128&fit=crop&crop=center" />
          <StatsCard icon="😊" title="500+ Happy Travelers" description="Satisfied customers across the globe" imgSrc="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=128&h=128&fit=crop&crop=center" />
          <StatsCard icon="🕐" title="24/7 Support" description="Round-the-clock assistance anytime" imgSrc="https://images.unsplash.com/photo-1560264280-88b68371db39?w=128&h=128&fit=crop&crop=center" />
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm font-medium mb-3">Why Choose Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A1628]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Your Journey, Our Priority</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <WhyChooseCard icon="💎" title="Best Prices" description="We negotiate directly with airlines and hotels to bring you unbeatable deals on every booking." />
            <WhyChooseCard icon="🧭" title="Expert Guides" description="Our travel specialists have firsthand knowledge of every destination we offer." />
            <WhyChooseCard icon="🔄" title="Flexible Booking" description="Change your plans without stress. Free cancellations and easy rescheduling available." />
            <WhyChooseCard icon="🛡️" title="24/7 Support" description="Our dedicated team is available around the clock, wherever your journey takes you." />
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0A1628] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80)" }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white font-['Playfair_Display',serif] mb-6">Ready to Start Your Journey?</h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">Let us craft your perfect getaway. From flights to hotels, we handle every detail.</p>
          <Link href="/book-now" className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] font-bold px-10 py-4 rounded-full text-lg hover:shadow-xl hover:shadow-[#D4AF37]/40 transition-all duration-300 transform hover:scale-105 cursor-pointer inline-block">Book Now</Link>
        </div>
      </section>

      <footer className="bg-gray-50 border-t border-gray-200 py-10">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} A9 Global Travels &amp; Tours. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
