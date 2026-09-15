import { NextRequest, NextResponse } from "next/server";

// FIX: 2026-09-14 — Amadeus self-service was decommissioned (2026-07-17), so live
// flight prices now come from Travelpayouts / Aviasales Data API (cache-based).
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
}

/** seconds -> ISO-8601 duration ("PT3H25M") */
function secondsToIso(seconds?: number): string {
  const s = Number(seconds) || 0;
  if (s <= 0) return "";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}` || "PT0M";
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin = (searchParams.get("origin") || "").toUpperCase().trim();
  const destination = (searchParams.get("destination") || "").toUpperCase().trim();
  const departDate = searchParams.get("departDate") || "";
  const returnDate = searchParams.get("returnDate") || "";
  const adults = searchParams.get("adults") || "1";

  const token = process.env.TRAVELPAYOUTS_API_TOKEN || "";
  const marker = process.env.TRAVELPAYOUTS_MARKER || "";

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

  const upstream = new URL(`${TP_BASE}/aviasales/v3/prices_for_dates`);
  // Travelpayouts accepts YYYY-MM or YYYY-MM-DD; we pass the exact departure date.
  upstream.searchParams.set("origin", origin);
  upstream.searchParams.set("destination", destination);
  upstream.searchParams.set("departure_at", departDate);
  if (returnDate) upstream.searchParams.set("return_at", returnDate);
  upstream.searchParams.set("one_way", returnDate ? "false" : "true");
  upstream.searchParams.set("sorting", "price");
  upstream.searchParams.set("direct", "false");
  upstream.searchParams.set("currency", "usd");
  upstream.searchParams.set("limit", "30");
  upstream.searchParams.set("page", "1");
  upstream.searchParams.set("token", token);

  try {
    const res = await fetch(upstream.toString(), {
      headers: { "X-Access-Token": token, Accept: "application/json" },
      // cached prices — a short cache keeps the free quota healthy
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Flight data provider error: ${res.status}` },
        { status: 502 }
      );
    }

    const json = await res.json();
    const rows: TpPriceRow[] = Array.isArray(json?.data) ? json.data : [];
    const currency = String(json?.currency || "usd").toUpperCase();

    const offers = rows
      .filter((r) => r && r.price && r.departure_at)
      .map((r, i) => {
        const carrier = r.airline || "";
        const fromCode = r.origin_airport || r.origin || origin;
        const toCode = r.destination_airport || r.destination || destination;
        const deepLink = r.link ? `https://www.aviasales.com${r.link}${marker ? `${r.link.includes("?") ? "&" : "?"}marker=${encodeURIComponent(marker)}` : ""}` : "";
        return {
          id: `${fromCode}-${toCode}-${carrier}${r.flight_number || ""}-${r.departure_at}-${i}`,
          price: { grandTotal: String(r.price), currency },
          transfers: typeof r.transfers === "number" ? r.transfers : 0,
          deepLink,
          itineraries: [
            {
              duration: secondsToIso(r.duration_to || r.duration),
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
      });

    return NextResponse.json({
      offers,
      carriers: AIRLINE_NAMES,
      currency,
      adults: Number(adults) || 1,
      source: "travelpayouts",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Flight search failed: ${message}` }, { status: 502 });
  }
}
