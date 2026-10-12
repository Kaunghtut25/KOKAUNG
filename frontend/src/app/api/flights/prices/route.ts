import { NextRequest, NextResponse } from "next/server";

// FIX: 2026-10-12 — show ALL available schedules for the requested date plus
// nearby dates (±7 days) instead of only the single cheapest cached price.
// Data source: Travelpayouts / Aviasales Data API (cache-based).
// Set TRAVELPAYOUTS_API_TOKEN (free signup) to enable; optional TRAVELPAYOUTS_MARKER
// adds your affiliate marker to the booking deep links.
const TP_BASE = process.env.TRAVELPAYOUTS_BASE_URL || "https://api.travelpayouts.com";

// Common carriers on Myanmar / Asia routes — used for readable airline names.
const AIRLINE_NAMES: Record<string, string> = {
  UB: "Myanmar Airways International",
  "8M": "Myanmar National Airlines",
  TG: "Thai Airways",
  PG: "Bangkok Airways",
  FD: "Thai AirAsia",
  SL: "Thai Lion Air",
  DD: "Nok Air",
  VJ: "VietJet Air",
  VN: "Vietnam Airlines",
  K6: "Cambodia Angkor Air",
  SQ: "Singapore Airlines",
  MH: "Malaysia Airlines",
  AK: "AirAsia",
  TR: "Scoot",
  CZ: "China Southern",
  MU: "China Eastern",
  CA: "Air China",
  CI: "China Airlines",
  BR: "EVA Air",
  KE: "Korean Air",
  OZ: "Asiana Airlines",
  JL: "Japan Airlines",
  NH: "All Nippon Airways",
  EK: "Emirates",
  QR: "Qatar Airways",
  TK: "Turkish Airlines",
  EY: "Etihad Airways",
  AI: "Air India",
  "6E": "IndiGo",
  "3K": "Jetstar Asia",
  BX: "Air Busan",
  "9C": "Spring Airlines",
};

interface TpPriceRow {
  origin?: string;
  destination?: string;
  origin_airport?: string;
  destination_airport?: string;
  price?: number;
  airline?: string;
  flight_number?: string;
  departure_at?: string;
  return_at?: string;
  transfers?: number;
  return_transfers?: number;
  duration?: number;
  duration_to?: number;
  duration_back?: number;
  link?: string;
  gate?: string;
}

/** Travelpayouts duration is MINUTES -> ISO-8601 duration ("PT1H20M") */
function minutesToIso(minutes?: number): string {
  const m = Math.round(Number(minutes) || 0);
  if (m <= 0) return "";
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `PT${h ? `${h}H` : ""}${mm ? `${mm}M` : ""}` || "PT0M";
}

/** minimal sanitizer: strips BOM + whitespace (env values piped by shells may carry U+FEFF) */
function cleanEnv(v?: string): string {
  return (v || "").replace(/\uFEFF/g, "").trim();
}

function ymd(d: Date): string {
  return d.toISOString().substring(0, 10);
}

async function fetchRows(
  url: string,
  token: string,
  revalidate = 600
): Promise<TpPriceRow[]> {
  const res = await fetch(url, {
    headers: { "X-Access-Token": token, Accept: "application/json" },
    // cached prices — a short cache keeps the free quota healthy
    next: { revalidate },
  });
  if (!res.ok) return [];
  const json = await res.json().catch(() => null);
  return Array.isArray(json?.data) ? json.data : [];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin = (searchParams.get("origin") || "").toUpperCase().trim();
  const destination = (searchParams.get("destination") || "").toUpperCase().trim();
  const departDate = searchParams.get("departDate") || "";
  const returnDate = searchParams.get("returnDate") || "";
  const adults = searchParams.get("adults") || "1";

  const token = cleanEnv(process.env.TRAVELPAYOUTS_API_TOKEN);
  const marker = cleanEnv(process.env.TRAVELPAYOUTS_MARKER);

  if (!origin || !destination || !departDate) {
    return NextResponse.json(
      { error: "Missing required parameters.", message: "origin, destination and departDate are required." },
      { status: 400 }
    );
  }

  if (!token) {
    return NextResponse.json(
      {
        error: "Live flight prices are not configured yet.",
        message: "Set TRAVELPAYOUTS_API_TOKEN to enable live flight prices.",
        help: "Create a free account at https://www.travelpayouts.com and copy the API token from your profile.",
      },
      { status: 503 }
    );
  }

  try {
    const all: Array<TpPriceRow & { _isExact: boolean }> = [];

    // 1) Exact requested date (highest priority)
    const exactUrl = new URL(`${TP_BASE}/aviasales/v3/prices_for_dates`);
    exactUrl.searchParams.set("origin", origin);
    exactUrl.searchParams.set("destination", destination);
    exactUrl.searchParams.set("departure_at", departDate);
    if (returnDate) exactUrl.searchParams.set("return_at", returnDate);
    exactUrl.searchParams.set("one_way", returnDate ? "false" : "true");
    exactUrl.searchParams.set("sorting", "price");
    exactUrl.searchParams.set("direct", "false");
    exactUrl.searchParams.set("currency", "usd");
    exactUrl.searchParams.set("limit", "30");
    exactUrl.searchParams.set("page", "1");
    exactUrl.searchParams.set("token", token);

    const exactRows = await fetchRows(exactUrl.toString(), token);
    for (const r of exactRows) if (r && r.price && r.departure_at) all.push({ ...r, _isExact: true });

    // 2) Nearby dates (±7 days) — the cached Data API often only returns the
    //    cheapest option per date, so a month view gives users the full
    //    schedule picture; we then keep only entries within ±7 days.
    if (all.length === 0) {
      const base = new Date(`${departDate}T00:00:00Z`);
      if (!Number.isNaN(base.getTime())) {
        const from = new Date(base.getTime() - 7 * 86400000);
        const to = new Date(base.getTime() + 7 * 86400000);

        const monthUrl = new URL(`${TP_BASE}/aviasales/v3/prices_for_dates`);
        monthUrl.searchParams.set("origin", origin);
        monthUrl.searchParams.set("destination", destination);
        monthUrl.searchParams.set("departure_at", departDate.substring(0, 7)); // YYYY-MM
        if (returnDate) monthUrl.searchParams.set("return_at", returnDate);
        monthUrl.searchParams.set("one_way", returnDate ? "false" : "true");
        monthUrl.searchParams.set("sorting", "price");
        monthUrl.searchParams.set("direct", "false");
        monthUrl.searchParams.set("currency", "usd");
        monthUrl.searchParams.set("limit", "50");
        monthUrl.searchParams.set("page", "1");
        monthUrl.searchParams.set("token", token);

        const monthRows = await fetchRows(monthUrl.toString(), token);
        for (const r of monthRows) {
          if (!r || !r.price || !r.departure_at) continue;
          const day = r.departure_at.substring(0, 10);
          if (day >= ymd(from) && day <= ymd(to)) all.push({ ...r, _isExact: false });
        }
      }
    }

    const currency = "USD";
    const offers = all
      .map((r, i) => {
        const carrier = r.airline || "";
        const fromCode = r.origin_airport || r.origin || origin;
        const toCode = r.destination_airport || r.destination || destination;
        const deepLink = r.link ? `https://www.aviasales.com${r.link}${marker ? `${r.link.includes("?") ? "&" : "?"}marker=${encodeURIComponent(marker)}` : ""}` : "";
        return {
          id: `${fromCode}-${toCode}-${carrier}${r.flight_number || ""}-${r.departure_at}-${r.price}-${i}`,
          price: { grandTotal: String(r.price), currency },
          transfers: typeof r.transfers === "number" ? r.transfers : 0,
          gate: r.gate || "",
          isExactDate: r._isExact === true,
          date: (r.departure_at || "").substring(0, 10),
          deepLink,
          itineraries: [
            {
              duration: minutesToIso(r.duration_to || r.duration),
              segments: [
                {
                  carrierCode: carrier,
                  number: r.flight_number || "",
                  departure: { iataCode: fromCode, at: r.departure_at || "" },
                  arrival: { iataCode: toCode, at: r.return_at || "" },
                },
              ],
            },
          ],
        };
      })
      // cheapest first, but keep exact-date entries on top
      .sort((a, b) => {
        if (a.isExactDate !== b.isExactDate) return a.isExactDate ? -1 : 1;
        return (parseFloat(a.price.grandTotal) || 0) - (parseFloat(b.price.grandTotal) || 0);
      })
      .slice(0, 30);

    return NextResponse.json({
      offers,
      carriers: AIRLINE_NAMES,
      currency,
      adults: Number(adults) || 1,
      requestedDate: departDate,
      hasExactDate: offers.some((o) => o.isExactDate),
      source: "travelpayouts",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Flight search failed: ${message}` }, { status: 502 });
  }
}
