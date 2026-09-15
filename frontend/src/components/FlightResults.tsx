"use client";
// FlightResults — live flight offers from the existing /api/amadeus backend
// FIX: 2026-09-14 wired the (previously unused) Amadeus API into the home search
// Zoom-stable: in-flow section only — no fixed overlays, no transform/scale animations
import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  adults: number;
  travelClass: string;
  rawQuery: string; // exact query string for the /book-now fallback
}

interface FlightSegment {
  carrierCode: string;
  number: string;
  departure: { iataCode: string; at: string };
  arrival: { iataCode: string; at: string };
  duration?: string;
}

interface FlightOffer {
  id: string;
  price?: { grandTotal?: string; currency?: string };
  itineraries: { duration?: string; segments: FlightSegment[] }[];
  // Travelpayouts extras (optional — Amadeus shape has neither)
  transfers?: number;
  deepLink?: string;
}

type ResultsState =
  | { kind: "loading" }
  | { kind: "notConfigured" }
  | { kind: "error"; message?: string }
  | { kind: "empty" }
  | { kind: "success"; offers: FlightOffer[]; carriers: Record<string, string> };

/** "PT2H30M" -> "2h 30m" */
function formatDuration(iso?: string): string {
  if (!iso) return "—";
  const m = iso.match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?$/);
  if (!m) return iso;
  const parts: string[] = [];
  if (m[1]) parts.push(`${m[1]}d`);
  if (m[2]) parts.push(`${m[2]}h`);
  if (m[3]) parts.push(`${m[3]}m`);
  return parts.length ? parts.join(" ") : iso;
}

/** "2026-09-28T07:15:00" -> "07:15" */
function formatTime(iso?: string): string {
  if (!iso || iso.length < 16) return "—";
  return iso.substring(11, 16);
}

/** "First Class" -> "FIRST", "Premium Economy" -> "PREMIUM_ECONOMY" (Amadeus class codes) */
function normalizeClass(cls?: string): string {
  const c = (cls || "ECONOMY").toUpperCase().trim();
  if (c.startsWith("FIRST")) return "FIRST";
  if (c.startsWith("PREMIUM")) return "PREMIUM_ECONOMY";
  if (c.startsWith("BUSINESS")) return "BUSINESS";
  return "ECONOMY";
}

export default function FlightResults({ params, onClose }: { params: FlightSearchParams; onClose: () => void }) {
  const { t, lang } = useI18n();
  const [state, setState] = useState<ResultsState>({ kind: "loading" });

  const runSearch = useCallback(() => {
    setState({ kind: "loading" });
    // FIX: 2026-09-14 data source = Travelpayouts/Aviasales (Amadeus self-service is decommissioned)
    const qs = new URLSearchParams({
      origin: params.origin,
      destination: params.destination,
      departDate: params.departDate,
      adults: String(params.adults || 1),
      travelClass: normalizeClass(params.travelClass),
    });
    if (params.returnDate) qs.set("returnDate", params.returnDate);
    fetch(`/api/flights/prices?${qs.toString()}`)
      .then(async (r) => {
        if (r.status === 503) return { status: 503, data: null };
        const data = await r.json().catch(() => null);
        return { status: r.status, data };
      })
      .then(({ status, data }) => {
        if (status === 503) { setState({ kind: "notConfigured" }); return; }
        if (status !== 200 || !data) { setState({ kind: "error" }); return; }
        const offers: FlightOffer[] = Array.isArray(data.offers) ? data.offers : [];
        const carriers: Record<string, string> = data.dictionaries?.carriers || {};
        if (offers.length === 0) { setState({ kind: "empty" }); return; }
        offers.sort((a, b) => (parseFloat(a.price?.grandTotal || "0") || 0) - (parseFloat(b.price?.grandTotal || "0") || 0));
        setState({ kind: "success", offers: offers.slice(0, 10), carriers });
      })
      .catch(() => setState({ kind: "error" }));
  }, [params]);

  useEffect(() => { runSearch(); }, [runSearch]);

  const fallbackHref = `/book-now?${params.rawQuery}`;
  const bookHref = (carrier: string, price: string) => `/book-now?${params.rawQuery}&airline=${encodeURIComponent(carrier)}&price=${encodeURIComponent(price)}`;

  return (
    <div id="flight-results" className="mt-5 rounded-2xl border-2 border-[#D4AF37]/30 bg-[#FFFDF5] p-4 md:p-5" role="region" aria-label={t("home.flightResults.title")}>
      <div className="flex items-center justify-between mb-3 gap-2">
        <h3 className="text-base md:text-lg font-bold text-[#0A1628]">
          ✈ {t("home.flightResults.title")} <span className="text-xs font-medium text-gray-500">({params.origin} → {params.destination} · {params.departDate})</span>
        </h3>
        <button type="button" onClick={onClose} aria-label={t("home.flightResults.close")} className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-[#D4AF37]/50 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0">✕</button>
      </div>

      {state.kind === "loading" && (
        <div className="space-y-3" aria-live="polite">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl bg-white border border-gray-100 p-4 animate-pulse">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-1/4" />
                <div className="h-6 bg-gray-100 rounded w-20 sm:ml-auto" />
              </div>
            </div>
          ))}
          <p className="text-center text-xs text-gray-400">{t("home.flightResults.loading")}</p>
        </div>
      )}

      {state.kind === "notConfigured" && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 mb-4">{t("home.flightResults.notConfigured")}</p>
          <a href={fallbackHref} className="inline-block bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] font-bold px-6 py-3 rounded-lg hover:shadow-lg transition-shadow cursor-pointer">{t("home.flightResults.requestBooking")}</a>
        </div>
      )}

      {state.kind === "error" && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 mb-3">{state.message ? `${t("home.flightResults.error")}: ${state.message}` : t("home.flightResults.error")}</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button type="button" onClick={runSearch} className="px-5 py-2.5 rounded-lg border-2 border-[#D4AF37] text-[#0A1628] text-sm font-semibold hover:bg-[#D4AF37]/10 transition-colors cursor-pointer">{t("home.flightResults.retry")}</button>
            <a href={fallbackHref} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] text-sm font-bold hover:shadow-lg transition-shadow cursor-pointer inline-flex items-center justify-center">{t("home.flightResults.requestBooking")}</a>
          </div>
        </div>
      )}

      {state.kind === "empty" && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 mb-4">{t("home.flightResults.noResults")}</p>
          <a href={fallbackHref} className="inline-block bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] font-bold px-6 py-3 rounded-lg hover:shadow-lg transition-shadow cursor-pointer">{t("home.flightResults.requestBooking")}</a>
        </div>
      )}

      {state.kind === "success" && (
        <ul className="space-y-3">
          {state.offers.map((offer) => {
            const itinerary = offer.itineraries?.[0];
            const segments = itinerary?.segments || [];
            const first = segments[0];
            const last = segments[segments.length - 1];
            if (!first) return null;
            const carrier = first.carrierCode;
            const airline = state.carriers[carrier] || carrier;
            const stops = typeof offer.transfers === "number" ? offer.transfers : segments.length - 1;
            const price = offer.price?.grandTotal || "—";
            const currency = offer.price?.currency || "USD";
            const arrivalTime = formatTime(last.arrival.at);
            const bookLink = offer.deepLink || bookHref(carrier, price);
            const isExternal = Boolean(offer.deepLink);
            return (
              <li key={offer.id} className="rounded-xl bg-white border border-[#D4AF37]/20 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="sm:w-40 flex-shrink-0">
                    <p className="font-semibold text-[#0A1628] text-sm">{airline}</p>
                    <p className="text-xs text-gray-400">{carrier} {first.number}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0A1628] font-medium">
                      {first.departure.iataCode} {formatTime(first.departure.at)} → {last.arrival.iataCode}{arrivalTime !== "—" ? ` ${arrivalTime}` : ""}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDuration(itinerary?.duration)} · {stops === 0 ? t("home.flightResults.direct") : lang === "mm" ? t("home.flightResults.stops", { n: stops }) : stops === 1 ? t("home.flightResults.stops", { n: stops }) : t("home.flightResults.stops_plural", { n: stops })}
                    </p>
                  </div>
                  <div className="sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 flex-shrink-0">
                    <p className="text-lg font-bold text-[#0A1628]">{currency} {price}</p>
                    <a href={bookLink} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="inline-block bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] text-xs font-bold px-4 py-2.5 rounded-lg hover:shadow-md transition-shadow cursor-pointer">{t("home.flightResults.bookThis")}</a>
                  </div>
                </div>
              </li>
            );
          })}
          <li className="text-center">
            <a href={fallbackHref} className="text-xs text-gray-500 underline hover:text-[#0A1628] transition-colors cursor-pointer">{t("home.flightResults.requestBooking")}</a>
          </li>
        </ul>
      )}
    </div>
  );
}
