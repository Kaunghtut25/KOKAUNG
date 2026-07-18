"use client";

import { useState } from "react";
import Link from "next/link";
import { HiSearch, HiArrowRight, HiCalendar, HiUser, HiGlobe, HiClock } from "react-icons/hi";

// ── types ──
interface FlightOffer {
  id: string;
  itineraries: {
    segments: {
      departure: { iataCode: string; at: string; terminal?: string };
      arrival: { iataCode: string; at: string; terminal?: string };
      carrierCode: string;
      number: string;
      duration: string;
      aircraft?: { code: string };
    }[];
  }[];
  price: { currency: string; total: string; grandTotal: string };
  travelerPricings?: { travelerType: string; fareDetailsBySegment: { cabin: string }[] }[];
  validatingAirlineCodes: string[];
  numberOfBookableSeats: number;
}

interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

interface Dictionaries {
  carriers?: Record<string, string>;
  aircraft?: Record<string, string>;
}

// ── helpers ──
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDuration(isoDuration: string) {
  const m = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const h = m?.[1] ? `${m[1]}h` : "";
  const min = m?.[2] ? `${m[2]}m` : "";
  return h + (h && min ? " " : "") + min;
}

function stopsText(count: number) {
  if (count === 0) return "Nonstop";
  if (count === 1) return "1 Stop";
  return `${count} Stops`;
}

const cabinLabels: Record<string, string> = {
  ECONOMY: "Economy",
  PREMIUM_ECONOMY: "Premium Economy",
  BUSINESS: "Business",
  FIRST: "First",
};

// ── component ──
export default function FlightsPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [travelClass, setTravelClass] = useState("ECONOMY");

  const [originAirports, setOriginAirports] = useState<Airport[]>([]);
  const [destAirports, setDestAirports] = useState<Airport[]>([]);
  const [originSelected, setOriginSelected] = useState<Airport | null>(null);
  const [destSelected, setDestSelected] = useState<Airport | null>(null);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [dictionaries, setDictionaries] = useState<Dictionaries>({});
  const [searched, setSearched] = useState(false);

  const [typingTimer, setTypingTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // ── airport search ──
  async function searchAirports(keyword: string, setter: (a: Airport[]) => void) {
    if (keyword.length < 2) { setter([]); return; }
    try {
      const res = await fetch(`/api/amadeus?action=airports&keyword=${encodeURIComponent(keyword)}`);
      const data = await res.json();
      setter(data.airports || []);
    } catch {
      setter([]);
    }
  }

  function handleOriginInput(val: string) {
    setOrigin(val);
    setOriginSelected(null);
    setShowOriginDropdown(true);
    if (typingTimer) clearTimeout(typingTimer);
    setTypingTimer(setTimeout(() => searchAirports(val, setOriginAirports), 350));
  }

  function handleDestInput(val: string) {
    setDestination(val);
    setDestSelected(null);
    setShowDestDropdown(true);
    if (typingTimer) clearTimeout(typingTimer);
    setTypingTimer(setTimeout(() => searchAirports(val, setDestAirports), 350));
  }

  function selectOrigin(airport: Airport) {
    setOrigin(`${airport.city || airport.name} (${airport.code})`);
    setOriginSelected(airport);
    setOriginAirports([]);
    setShowOriginDropdown(false);
  }

  function selectDest(airport: Airport) {
    setDestination(`${airport.city || airport.name} (${airport.code})`);
    setDestSelected(airport);
    setDestAirports([]);
    setShowDestDropdown(false);
  }

  // ── search flights ──
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const originCode = originSelected?.code || origin.toUpperCase().split(" ").pop()?.replace(/[()]/g, "");
    const destCode = destSelected?.code || destination.toUpperCase().split(" ").pop()?.replace(/[()]/g, "");

    if (!originCode || !destCode || !departDate) {
      setError("Please fill in origin, destination, and departure date.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const params = new URLSearchParams({
        action: "search",
        origin: originCode,
        destination: destCode,
        departDate,
        adults: String(adults),
        travelClass,
      });
      if (returnDate) params.set("returnDate", returnDate);

      const res = await fetch(`/api/amadeus?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || `API error: ${res.status}`);
        setOffers([]);
      } else {
        setOffers(data.offers || []);
        setDictionaries(data.dictionaries || {});
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── render ──
  return (
    <main className="min-h-screen bg-[#0A1628]">
      {/* ── Hero ── */}
      <section className="relative h-[55vh] min-h-[420px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images_v2/hero-flights-v2.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/70 via-[#0A1628]/50 to-[#0A1628]" />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="font-['Playfair_Display',serif] text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Fly the World
          </h1>
          <p className="text-[#D4AF37] text-lg md:text-xl font-light max-w-2xl mx-auto">
            Search and book flights from Myanmar to worldwide destinations at the best fares
          </p>
        </div>
      </section>

      {/* ── Search Form ── */}
      <section className="max-w-6xl mx-auto -mt-16 relative z-20 px-4">
        <form
          onSubmit={handleSearch}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 border border-[#D4AF37]/30"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* From */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">From</label>
              <input
                type="text"
                placeholder="City or Airport"
                value={origin}
                onChange={(e) => handleOriginInput(e.target.value)}
                onFocus={() => originAirports.length > 0 && setShowOriginDropdown(true)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
              {showOriginDropdown && originAirports.length > 0 && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto">
                  {originAirports.map((a) => (
                    <button
                      key={a.code}
                      type="button"
                      onClick={() => selectOrigin(a)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#D4AF37]/10 hover:text-[#0A1628] transition-colors border-b last:border-b-0 border-gray-100"
                    >
                      <span className="font-semibold">{a.code}</span> — {a.city || a.name}, {a.country}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* To */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">To</label>
              <input
                type="text"
                placeholder="City or Airport"
                value={destination}
                onChange={(e) => handleDestInput(e.target.value)}
                onFocus={() => destAirports.length > 0 && setShowDestDropdown(true)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
              {showDestDropdown && destAirports.length > 0 && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto">
                  {destAirports.map((a) => (
                    <button
                      key={a.code}
                      type="button"
                      onClick={() => selectDest(a)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#D4AF37]/10 hover:text-[#0A1628] transition-colors border-b last:border-b-0 border-gray-100"
                    >
                      <span className="font-semibold">{a.code}</span> — {a.city || a.name}, {a.country}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Depart Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Depart</label>
              <input
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
            </div>

            {/* Return Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Return</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
            </div>

            {/* Search Button + Options */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="flex-1 px-2 py-3 border border-gray-200 rounded-xl text-xs text-gray-700 font-medium focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? "Adult" : "Adults"}</option>
                  ))}
                </select>
                <select
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value)}
                  className="flex-1 px-2 py-3 border border-gray-200 rounded-xl text-xs text-gray-700 font-medium focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="PREMIUM_ECONOMY">Prem. Econ</option>
                  <option value="BUSINESS">Business</option>
                  <option value="FIRST">First</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D4AF37] text-[#0A1628] font-bold rounded-xl py-3 text-sm hover:bg-[#C5A028] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-[#0A1628] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <HiSearch className="w-4 h-4" />
                )}
                {loading ? "Searching..." : "Search Flights"}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* ── Results ── */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
            <p className="text-red-600 font-semibold">{error}</p>
            <p className="text-red-500 text-sm mt-1">Please check your inputs and try again.</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center py-20">
            <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-[#D4AF37] font-medium">Searching for the best flights...</p>
          </div>
        )}

        {searched && !loading && !error && offers.length === 0 && (
          <div className="text-center py-20">
            <HiGlobe className="w-16 h-16 mx-auto text-gray-500 mb-4" />
            <h3 className="text-2xl font-['Playfair_Display',serif] text-white mb-2">No Flights Found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              We couldn&apos;t find any flights matching your search criteria. Try different dates or destinations.
            </p>
          </div>
        )}

        {offers.length > 0 && (
          <div>
            <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-white mb-2">
              {offers.length} Flight{offers.length !== 1 ? "s" : ""} Found
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              {originSelected?.code || origin} → {destSelected?.code || destination}
              {departDate && ` · ${formatDate(departDate)}`}
            </p>

            <div className="space-y-4">
              {offers.map((offer) => {
                const itin = offer.itineraries[0];
                const firstSeg = itin.segments[0];
                const lastSeg = itin.segments[itin.segments.length - 1];
                const airlineCode = offer.validatingAirlineCodes?.[0] || firstSeg.carrierCode;
                const airlineName = dictionaries.carriers?.[airlineCode] || airlineCode;
                const cabin = offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || travelClass;

                return (
                  <div
                    key={offer.id}
                    className="bg-white/5 backdrop-blur-sm border border-[#D4AF37]/10 rounded-2xl p-5 md:p-6 hover:border-[#D4AF37]/30 hover:bg-white/[0.07] transition-all group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Airline + Route */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-bold text-sm">
                            {airlineCode}
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">{airlineName}</p>
                            <p className="text-gray-400 text-xs">
                              {firstSeg.carrierCode}{firstSeg.number} · {cabinLabels[cabin] || cabin}
                            </p>
                          </div>
                        </div>

                        {/* Time + Route */}
                        <div className="flex items-center gap-3 md:gap-6 flex-wrap">
                          <div className="text-center">
                            <p className="text-white text-xl md:text-2xl font-bold">{formatTime(firstSeg.departure.at)}</p>
                            <p className="text-gray-400 text-xs">{firstSeg.departure.iataCode}</p>
                          </div>

                          <div className="flex-1 flex flex-col items-center min-w-[100px]">
                            <p className="text-gray-500 text-xs mb-1">{formatDuration(itin.segments.reduce((acc: number, s: any) => {
                              const m = s.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
                              const mins = (parseInt(m?.[1] || '0') * 60) + parseInt(m?.[2] || '0');
                              return acc + mins;
                            }, 0) + 'M')}</p>
                            <div className="w-full flex items-center gap-1">
                              <div className="flex-1 h-px bg-gray-600" />
                              <HiArrowRight className="w-3 h-3 text-gray-500" />
                              <div className="flex-1 h-px bg-gray-600" />
                            </div>
                            <p className="text-gray-500 text-xs mt-1">{stopsText(itin.segments.length - 1)}</p>
                          </div>

                          <div className="text-center">
                            <p className="text-white text-xl md:text-2xl font-bold">{formatTime(lastSeg.arrival.at)}</p>
                            <p className="text-gray-400 text-xs">{lastSeg.arrival.iataCode}</p>
                          </div>
                        </div>
                      </div>

                      {/* Price + CTA */}
                      <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:gap-3 lg:min-w-[180px]">
                        <div className="text-right">
                          <p className="text-gray-400 text-xs">{offer.price.currency}</p>
                          <p className="text-[#D4AF37] text-2xl md:text-3xl font-bold font-['Playfair_Display',serif]">
                            {parseFloat(offer.price.grandTotal).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                          <p className="text-gray-500 text-xs">per adult</p>
                        </div>
                        <Link
                          href={`/book-now?type=flight&from=${originSelected?.code || origin}&to=${destSelected?.code || destination}&fromCity=${encodeURIComponent(originSelected?.city || origin)}&toCity=${encodeURIComponent(destSelected?.city || destination)}&depart=${departDate}${returnDate ? `&return=${returnDate}` : ""}&adults=${adults}&class=${travelClass}&airline=${encodeURIComponent(airlineName)}&airlineCode=${airlineCode}&flightNo=${firstSeg.carrierCode}${firstSeg.number}&price=${offer.price.total}&currency=${offer.price.currency}&departTime=${formatTime(firstSeg.departure.at)}&arriveTime=${formatTime(lastSeg.arrival.at)}&stops=${itin.segments.length - 1}&offerId=${offer.id}`}
                          className="bg-[#D4AF37] text-[#0A1628] font-bold rounded-xl px-6 py-3 text-sm hover:bg-[#C5A028] transition-all shadow-md hover:shadow-lg whitespace-nowrap flex items-center gap-1.5"
                        >
                          Book Now <HiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>

                    {/* Expandable segments detail (optional: subtle) */}
                    {itin.segments.length > 1 && (
                      <details className="mt-4 pt-4 border-t border-[#D4AF37]/10">
                        <summary className="text-[#D4AF37] text-xs cursor-pointer hover:text-[#F5A623] transition-colors inline-block">
                          View {itin.segments.length} segments details
                        </summary>
                        <div className="mt-3 space-y-2">
                          {itin.segments.map((seg: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 text-xs text-gray-400">
                              <HiClock className="w-3 h-3 flex-shrink-0" />
                              <span className="font-semibold text-white">{seg.departure.iataCode}</span>
                              <span>{formatTime(seg.departure.at)}</span>
                              <HiArrowRight className="w-3 h-3" />
                              <span className="font-semibold text-white">{seg.arrival.iataCode}</span>
                              <span>{formatTime(seg.arrival.at)}</span>
                              <span className="text-gray-500">({formatDuration(seg.duration)})</span>
                              <span className="text-gray-600">{seg.carrierCode}{seg.number}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
