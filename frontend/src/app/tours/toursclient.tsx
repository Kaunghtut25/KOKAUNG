'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useI18n } from "@/lib/i18n";
import TourCard from '@/components/TourCard';
import CurrencyToggle from '@/components/CurrencyToggle';
import DealsBanner from '@/components/DealsBanner';
import FAQAccordion from '@/components/FAQAccordion';
import TestimonialSlider from '@/components/TestimonialSlider';
import RoutesMap from '@/components/RoutesMap';
import ScrollingRow from '@/components/ScrollingRow';

/** Myanmar destinations — auto-classified as Inbound */
const MYANMAR_CITIES = [
  'bagan', 'yangon', 'mandalay', 'inle', 'ngapali', 'mingun', 'sagaing',
  'pyin oo lwin', 'hsipaw', 'mrauk u', 'loikaw', 'kyaiktiyo', 'dawei',
  'myeik', 'kawthaung', 'putao', 'naypyidaw', 'taunggyi', 'kalaw',
  'pindaya', 'bago', 'popa', 'mount popa', 'thanlyin',
].flatMap(c => [c, `, ${c}`, `,${c}`]); // match partial too

export function detectTourType(tour: { destination?: string; tourType?: string }): 'inbound' | 'outbound' {
  // 1) explicit field
  if (tour.tourType === 'inbound' || tour.tourType === 'outbound') return tour.tourType as 'inbound' | 'outbound';
  // 2) inference from destination
  const dest = (tour.destination || '').toLowerCase();
  if (dest === 'myanmar' || dest.includes('myanmar')) return 'inbound';
  if (MYANMAR_CITIES.some(c => dest.includes(c))) return 'inbound';
  return 'outbound';
}

export default function ToursClient(props: any) {
  const { t } = useI18n();
  const heroImage = props.siteConfig?.heroImages?.tours || "/images_v2/hero-tours-v2.jpg";
  const [heroImgOk, setHeroImgOk] = useState(true);
  const toursText = props.siteConfig?.heroText?.tours || {};
  const toursTitle = toursText.title || "";
  const toursSubtitle = toursText.subtitle || "";
  const toursTitleFont = toursText.titleFont || "'Playfair Display', Georgia, serif";
  const toursTitleSize = toursText.titleSize || "3rem";
  const toursSubtitleSize = toursText.subtitleSize || "1.2rem";
  const { initialTours, preloadMap } = props;
  const apiTours = initialTours;
  const [currency, setCurrency] = useState<"MMK" | "USD">("MMK");
  const layout = props.siteConfig?.sectionLayouts?.tours || { desktop: 3, tablet: 2, mobile: 1 };
  const rowTitles = props.siteConfig?.sectionRows?.tours || ["Featured Tours", "More Tours", "Additional Tours"];

  const cardWidth = props.siteConfig?.cardDimensions?.tours?.width || 300;
  const cardHeight = props.siteConfig?.cardDimensions?.tours?.height || 420;
  const cardInfo = { width: cardWidth, height: cardHeight, containerWidth: 6 * (cardWidth + 16) };

  // ── Tab ──
  type TourTab = 'all' | 'inbound' | 'outbound';
  const [activeTab, setActiveTab] = useState<TourTab>('all');

  // ── Filters ──
  const [destination, setDestination] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [sort, setSort] = useState('');

  const filteredTours = apiTours.filter((t: any) => {
    // tab filter
    if (activeTab !== 'all' && detectTourType(t) !== activeTab) return false;
    const q = destination.toLowerCase();
    if (q && !String(t.destination).toLowerCase().includes(q) && !String(t.title).toLowerCase().includes(q)) return false;
    if (minPrice && t.priceMMK < Number(minPrice)) return false;
    if (maxPrice && t.priceMMK > Number(maxPrice)) return false;
    if (durationFilter) {
      const dayMatch = String(t.duration).match(/(\d+)/);
      const days = dayMatch ? parseInt(dayMatch[1]) : 0;
      if (durationFilter === '1-3' && days > 3) return false;
      if (durationFilter === '4-7' && (days < 4 || days > 7)) return false;
      if (durationFilter === '8-14' && (days < 8 || days > 14)) return false;
      if (durationFilter === '15+' && days < 15) return false;
    }
    return true;
  });

  const sortedTours = [...filteredTours].sort((a, b) => {
    if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sort === 'price_asc') return (a.priceMMK || 0) - (b.priceMMK || 0);
    if (sort === 'price_desc') return (b.priceMMK || 0) - (a.priceMMK || 0);
    if (sort === 'duration') {
      const aMatch = String(a.duration).match(/(\d+)/);
      const bMatch = String(b.duration).match(/(\d+)/);
      const aDays = aMatch ? parseInt(aMatch[1]) : 0;
      const bDays = bMatch ? parseInt(bMatch[1]) : 0;
      return aDays - bDays;
    }
    return 0;
  });
  const pool = [...sortedTours];
  const rowMap = new Map<number, typeof pool>();
  pool.forEach(t => {
    const r = (t as any).row || 1;
    if (!rowMap.has(r)) rowMap.set(r, []);
    rowMap.get(r)!.push(t);
  });
  const tourRows = [...rowMap.entries()]
    .sort(([a],[b]) => a - b)
    .map(([,items]) => items.slice(0, 6));

  // counts for tab badges
  const countInbound = apiTours.filter((t: any) => detectTourType(t) === 'inbound').length;
  const countOutbound = apiTours.filter((t: any) => detectTourType(t) === 'outbound').length;


  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero (same for all tabs) ── */}
      <section className="relative pt-24 pb-12 px-4 overflow-hidden" style={{ height: (props.siteConfig?.heroDimensions?.["tours"]?.desktop || 480) + "px" }}>
        <div className="absolute inset-0">
          {heroImgOk ? (
            <Image src={heroImage} alt="A9 Global Tours" fill sizes="100vw" className="object-cover" onError={() => setHeroImgOk(false)} />
          ) : (
            <Image src="/images_v2/hero-tours-v2.jpg" alt="A9 Global Tours" fill sizes="100vw" className="object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/80 via-[#0A1628]/40 to-[#0A1628]/60" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="font-bold text-white mb-3" style={{ fontFamily: toursTitleFont, fontSize: toursTitleSize }}>
            {toursTitle}
          </h1>
          {toursSubtitle ? <p className="text-gray-300 text-lg" style={{ fontSize: toursSubtitleSize }}>{toursSubtitle}</p> : null}
        </div>
      </section>

      {/* ── Inbound / Outbound tabs + Filters ── */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab bar — premium pill-style with underline accent */}
        <div className="flex flex-col items-center mb-8">
          <div className="inline-flex bg-gray-100 rounded-2xl p-1.5 gap-1 shadow-inner border border-[#D4AF37]/30">
            <button
              onClick={() => setActiveTab('all')}
              className={`relative px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'all'
                  ? 'bg-white text-[#0A1628] shadow-lg shadow-black/10'
                  : 'text-gray-600 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10'
              }`}
            >
              All Tours
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeTab === 'all' ? 'bg-[#D4AF37]/15 text-[#7A5F08]' : 'bg-gray-200 text-gray-600'}`}>
                {apiTours.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('inbound')}
              className={`relative px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'inbound'
                  ? 'bg-white text-[#0A1628] shadow-lg shadow-black/10'
                  : 'text-gray-600 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10'
              }`}
            >
              🏔️ Inbound
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeTab === 'inbound' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                {countInbound}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('outbound')}
              className={`relative px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'outbound'
                  ? 'bg-white text-[#0A1628] shadow-lg shadow-black/10'
                  : 'text-gray-600 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10'
              }`}
            >
              🌏 Outbound
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeTab === 'outbound' ? 'bg-sky-100 text-sky-700' : 'bg-gray-200 text-gray-600'}`}>
                {countOutbound}
              </span>
            </button>
          </div>

          {/* Section header — premium per-tab */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="text-[#8A6C0B] text-xs font-semibold uppercase tracking-[0.25em]">
                {activeTab === 'all' ? 'Curated Journeys' : activeTab === 'inbound' ? 'Golden Land' : 'Beyond Borders'}
              </span>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
            <h2
              className="mt-2 text-3xl md:text-4xl font-bold text-[#0A1628]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {activeTab === 'all' ? 'Explore Our Tours' : activeTab === 'inbound' ? 'Inbound Tours' : 'Outbound Tours'}
            </h2>
          </div>
          <p className="text-center text-gray-500 text-sm mt-3 max-w-xl leading-relaxed">
            {activeTab === 'all' && (
              <>Explore our complete collection of premium tours — from Myanmar's ancient temples to Southeast Asia's vibrant cities.</>
            )}
            {activeTab === 'inbound' && (
              <>Discover the Golden Land — guided journeys through Bagan's temples, Inle's floating gardens, Yangon's colonial charm, and Mandalay's royal heritage.</>
            )}
            {activeTab === 'outbound' && (
              <>Venture beyond Myanmar — curated international tours to Thailand, Vietnam, Bali, Singapore, Japan, and more. Visas handled by our team.</>
            )}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder={t("list.destination")} className="px-4 py-2 rounded-xl border border-gray-200 text-sm" />
          <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder={t("list.minPrice")} type="number" className="px-4 py-2 rounded-xl border border-gray-200 text-sm w-28" />
          <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder={t("list.maxPrice")} type="number" className="px-4 py-2 rounded-xl border border-gray-200 text-sm w-28" />
          <select value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)} aria-label={t("list.filterDuration")} className="px-4 py-2 rounded-xl border border-gray-200 text-sm">
            <option value="">{t("list.anyDuration")}</option>
            <option value="1-3">1-3 Days</option>
            <option value="4-7">4-7 Days</option>
            <option value="8-14">8-14 Days</option>
            <option value="15+">15+ Days</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label={t("list.sortTours")} className="px-4 py-2 rounded-xl border border-gray-200 text-sm">
            <option value="">{t("list.sortBy")}</option>
            <option value="rating">{t("list.ratingHighLow")}</option>
            <option value="price_asc">{t("list.priceLowHigh")}</option>
            <option value="price_desc">{t("list.priceHighLow")}</option>
            <option value="duration">{t("list.durationShortLong")}</option>
          </select>
          <CurrencyToggle activeCurrency={currency} onToggle={setCurrency} />
        </div>
      </section>

      {/* Tour Rows */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        {sortedTours.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">{t("list.noToursFound")}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {tourRows.map((row, rowIdx) => (
              <div key={rowIdx}>
                <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {rowTitles[rowIdx] || `Row ${rowIdx + 1}`}
                </h2>
                <ScrollingRow containerWidth={cardInfo.containerWidth}>
                  {row.map((item, i) => (
                    <div key={item._id || i} className="flex-shrink-0 snap-start" style={{ width: cardInfo.width }}>
                      <TourCard tour={item} currency={currency} preloadedImage={preloadMap?.[item._id]} cardWidth={cardInfo.width} cardHeight={cardInfo.height} />
                    </div>
                  ))}
                </ScrollingRow>
              </div>
            ))}
          </div>
        )}
      </section>
      <DealsBanner />
      <FAQAccordion section="tours" />
      <TestimonialSlider />
      <RoutesMap />
    </main>
  );
}
