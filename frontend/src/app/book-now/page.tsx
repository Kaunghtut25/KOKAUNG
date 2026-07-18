"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { FaPaperPlane, FaCheckCircle, FaUser, FaEnvelope, FaPhone, FaExclamationTriangle } from "react-icons/fa";

interface FormData {
  fullName: string; email: string; phone: string; travelType: string;
  fromAirport: string; toAirport: string; departDate: string; returnDate: string;
  passengers: number; travelClass: string; specialRequests: string; contactPreference: string;
}

interface SearchSummary {
  type: string; from: string; to: string; departDate: string; returnDate: string;
  passengers: string; travelClass: string; legs?: { from: string; to: string; date: string }[];
  // raw data for API submission
  itemName?: string; amount?: number; currency?: string;
}

function BookNowContent() {
  const searchParams = useSearchParams();
  const messageBoxRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: "", email: "", phone: "", travelType: "flight",
    fromAirport: "", toAirport: "", departDate: "", returnDate: "",
    passengers: 1, travelClass: "Economy", specialRequests: "", contactPreference: "email",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successModal, setSuccessModal] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [searchSummary, setSearchSummary] = useState<SearchSummary | null>(null);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const type = searchParams.get("type");
    if (!type) return;

    const bookingTypes: Record<string, string> = {
      tour: "Tour Package", hotel: "Hotel Booking", car: "Car Rental",
      visa: "Visa Service", insurance: "Insurance", cruise: "Cruise", lounge: "Sky Lounge", blog: "Blog Inquiry",
    };
    if (type in bookingTypes) {
      const title = searchParams.get("title") || searchParams.get("name") || searchParams.get("plan") || searchParams.get("country") || "";
      const dest = searchParams.get("destination") || searchParams.get("location") || "";
      const dur = searchParams.get("duration") || searchParams.get("processingTime") || "";
      const price = searchParams.get("price") || searchParams.get("priceMMK") || "";
      const date = searchParams.get("date") || "";
      const travelers = searchParams.get("travelers") || "1";
      const requests = searchParams.get("requests") || "";
      const cur = searchParams.get("currency") || "MMK";
      const priceUSD = searchParams.get("priceUSD") || "";
      const coverage = searchParams.get("coverage") || "";
      const feeMMK = searchParams.get("feeMMK") || "";
      const feeUSD = searchParams.get("feeUSD") || "";

      let priceDisplay = "";
      const amt = parseInt(price || feeMMK) || 0;
      const amtUSD = parseInt(priceUSD || searchParams.get("priceUSD") || searchParams.get("feeUSD") || "0") || 0;
      if (amt) {
        priceDisplay = "Ks " + amt.toLocaleString();
        if (amtUSD) {
          priceDisplay += " / $" + amtUSD.toLocaleString();
        }
      }

      setSearchSummary({
        type: bookingTypes[type],
        from: title,
        to: dest + (dur ? " \u2022 " + dur : "") + (coverage ? " \u2022 " + coverage : ""),
        departDate: date || "Flexible",
        returnDate: priceDisplay,
        passengers: travelers + " Traveler(s)",
        travelClass: "",
        itemName: title,
        amount: amt,
        currency: cur,
      });
      setFormData((prev) => ({
        ...prev,
        travelType: type,
        specialRequests: requests || "Booking: " + title + (dest ? " | " + dest : ""),
        departDate: date,
        passengers: parseInt(travelers) || 1,
      }));
      setTimeout(() => { messageBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 300);
      return;
    }

    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const fromCity = searchParams.get("fromCity") || "";
    const toCity = searchParams.get("toCity") || "";
    const fromCountry = searchParams.get("fromCountry") || "";
    const toCountry = searchParams.get("toCountry") || "";
    const departDate = searchParams.get("depart") || "";
    const returnDate = searchParams.get("return") || "";
    const adults = searchParams.get("adults") || "1";
    const children = searchParams.get("children") || "0";
    const infants = searchParams.get("infants") || "0";
    const travelClass = searchParams.get("class") || "Economy";
    const totalPax = parseInt(adults) + parseInt(children) + parseInt(infants);
    const paxLabel = totalPax + " Passenger" + (totalPax > 1 ? "s" : "");
    const clientType = searchParams.get("clientType") || "local";
    const tripType = searchParams.get("tripType") || "oneway";
    const legsJson = searchParams.get("legs") || "";

    // Flight result data (from flights results page)
    const airline = searchParams.get("airline") || "";
    const airlineCode = searchParams.get("airlineCode") || "";
    const flightNo = searchParams.get("flightNo") || "";
    const price = searchParams.get("price") || "";
    const currency = searchParams.get("currency") || "USD";
    const departTime = searchParams.get("departTime") || "";
    const arriveTime = searchParams.get("arriveTime") || "";
    const stops = searchParams.get("stops") || "0";
    const offerId = searchParams.get("offerId") || "";

    const isFlightSearch = type === "flight" && from && to;

    const tripTypeLabel = tripType === "roundtrip" ? "Round Trip Flight" : tripType === "multicity" ? "Multi-City Flight" : "One Way Flight";
    const typeLabel = isFlightSearch ? tripTypeLabel : type === "oneway" ? "One Way" : type === "roundtrip" ? "Round Trip" : "Multi-City";

    const fromLabel = isFlightSearch && fromCity ? fromCity + " (" + from + ")" + (fromCountry ? ", " + fromCountry : "") : from;
    const toLabel = isFlightSearch && toCity ? toCity + " (" + to + ")" + (toCountry ? ", " + toCountry : "") : to;

    const classLabel = travelClass === "ECONOMY" ? "Economy" : travelClass === "PREMIUM_ECONOMY" ? "Premium Economy" : travelClass === "BUSINESS" ? "Business" : travelClass === "FIRST" ? "First" : travelClass;
    const clientLabel = clientType === "foreigner" ? "Foreigner" : "Local (Myanmar)";

    // Build rich summary for flight search
    let summary: SearchSummary = {
      type: typeLabel,
      from: fromLabel,
      to: toLabel,
      departDate: departDate || "Flexible",
      returnDate: returnDate || "",
      passengers: paxLabel,
      travelClass: classLabel,
    };

    // Add flight-specific details
    if (isFlightSearch) {
      const flightInfo = [
        airline ? airline + " (" + flightNo + ")" : "",
        departTime ? "Depart: " + departTime : "",
        arriveTime ? "Arrive: " + arriveTime : "",
        stops === "0" ? "Nonstop" : stops + " stop" + (stops !== "1" ? "s" : ""),
        price ? currency + " " + parseFloat(price).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "",
      ].filter(Boolean).join(" | ");
      summary.to = toLabel + (flightInfo ? " - " + flightInfo : "");
      summary.itemName = "Flight " + from + " to " + to + (airline ? " | " + airline + " " + flightNo : "");
      summary.amount = parseFloat(price) || 0;
      summary.currency = currency;

      // Multi-city legs
      let legsDisplay = "";
      if (legsJson) {
        try {
          const legs = JSON.parse(legsJson);
          legsDisplay = legs.map((l: any, i: number) => "Leg " + (i+1) + ": " + (l.from || "?") + " to " + (l.to || "?") + " on " + (l.date || "?")).join(" | ");
        } catch {}
      }

      setSearchSummary(summary);
      setFormData((prev) => ({
        ...prev,
        travelType: "flight",
        fromAirport: from,
        toAirport: to,
        departDate: departDate,
        returnDate: returnDate,
        passengers: totalPax,
        travelClass: classLabel,
        specialRequests: "Flight Booking: " + tripTypeLabel + " | " + from + " to " + to + " | Depart: " + (departDate || "TBD") + (returnDate ? " | Return: " + returnDate : "") + " | " + paxLabel + " (" + adults + " adults, " + children + " children, " + infants + " infants)" + " | Class: " + classLabel + " | Client: " + clientLabel + (airline ? " | Airline: " + airline + " " + flightNo : "") + (price ? " | Price: " + currency + " " + price : "") + (offerId ? " | Offer ID: " + offerId : "") + (legsDisplay ? " | Multi-city: " + legsDisplay : ""),
      }));
    } else {
      setSearchSummary(summary);
      setFormData((prev) => ({
        ...prev,
        travelType: type || "flight",
        fromAirport: from,
        toAirport: to,
        departDate: departDate,
        returnDate: returnDate,
        passengers: totalPax,
        travelClass: classLabel,
      }));
    }
    setTimeout(() => { messageBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 300);
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!formData.fullName.trim()) errs.push("Full name is required");
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errs.push("Valid email is required");
    if (!formData.phone.trim()) errs.push("Phone number is required");
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        // Include search summary data for richer booking records
        itemName: searchSummary?.itemName || searchSummary?.from || "",
        amount: searchSummary?.amount || 0,
        currency: searchSummary?.currency || "MMK",
      };

      const res = await fetch("/api/booking-receiver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        const msg = json.message || "Failed to submit booking";
        const errs = json.errors || [msg];
        setErrors(errs);
        setApiError(msg);
        setLoading(false);
        return;
      }

      // Success — use real reference number from API
      setReferenceNumber(json.referenceNumber);
      setSubmittedName(formData.fullName);
      setSuccessModal(true);
    } catch (err: any) {
      console.error("Booking submission error:", err);
      setApiError("Network error. Please check your connection and try again.");
      setErrors(["Network error. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <section style={{ position: "relative", height: 300, overflow: "hidden" }}>
        <img src="/images_v2/hero-book-now-v2.jpg" alt="Book Now" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,22,40,0.9), rgba(10,22,40,0.3))" }} />
        <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, textAlign: "center", padding: "0 20px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, color: "white", marginBottom: 8 }}>Book Now</h1>
          <p style={{ color: "#D4AF37", fontSize: 18 }}>Complete your reservation</p>
        </div>
      </section>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
        {searchSummary && (
          <div ref={messageBoxRef} style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderLeft: "4px solid #D4AF37" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#0A1628", marginBottom: 8 }}>
              {searchSummary.type}
            </h2>
            {searchSummary.from && <p style={{ fontSize: 16, fontWeight: 600, color: "#0A1628" }}>{searchSummary.from}</p>}
            {searchSummary.to && <p style={{ fontSize: 14, color: "#666", marginTop: 4 }}>{searchSummary.to}</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
              {searchSummary.departDate && searchSummary.departDate !== "Flexible" && (
                <span style={{ fontSize: 13, color: "#555", background: "#f0f0f0", padding: "4px 10px", borderRadius: 6 }}>📅 {searchSummary.departDate}</span>
              )}
              {searchSummary.returnDate && (
                <span style={{ fontSize: 13, color: "#555", background: "#f0f0f0", padding: "4px 10px", borderRadius: 6 }}>↩ {searchSummary.returnDate}</span>
              )}
              {searchSummary.passengers && (
                <span style={{ fontSize: 13, color: "#555", background: "#f0f0f0", padding: "4px 10px", borderRadius: 6 }}>👥 {searchSummary.passengers}</span>
              )}
              {searchSummary.travelClass && (
                <span style={{ fontSize: 13, color: "#555", background: "#f0f0f0", padding: "4px 10px", borderRadius: 6 }}>💼 {searchSummary.travelClass}</span>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div><label style={{ fontSize: 14, color: "#555", marginBottom: 4, display: "block" }}>Full Name</label><div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 10, padding: "8px 12px" }}><FaUser style={{ color: "#999", marginRight: 8 }} /><input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" style={{ border: "none", outline: "none", width: "100%", fontSize: 14 }} /></div></div>
            <div><label style={{ fontSize: 14, color: "#555", marginBottom: 4, display: "block" }}>Email</label><div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 10, padding: "8px 12px" }}><FaEnvelope style={{ color: "#999", marginRight: 8 }} /><input name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" type="email" style={{ border: "none", outline: "none", width: "100%", fontSize: 14 }} /></div></div>
            <div><label style={{ fontSize: 14, color: "#555", marginBottom: 4, display: "block" }}>Phone</label><div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 10, padding: "8px 12px" }}><FaPhone style={{ color: "#999", marginRight: 8 }} /><input name="phone" value={formData.phone} onChange={handleChange} placeholder="+95 9xxxxxxxxx" type="tel" style={{ border: "none", outline: "none", width: "100%", fontSize: 14 }} /></div></div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={{ fontSize: 14, color: "#555", marginBottom: 4, display: "block" }}>Special Requests</label>
            <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows={3} placeholder="Any special requirements..." style={{ width: "100%", border: "1px solid #ddd", borderRadius: 10, padding: "8px 12px", fontSize: 14, resize: "vertical" }} />
          </div>

          {/* API Error Banner */}
          {apiError && (
            <div style={{ marginTop: 12, background: "#FFF3F3", padding: 12, borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <FaExclamationTriangle style={{ color: "#D32F2F", flexShrink: 0 }} />
              <p style={{ color: "#D32F2F", fontSize: 13, margin: 0 }}>{apiError}</p>
            </div>
          )}

          {/* Validation Errors */}
          {errors.length > 0 && !apiError && (
            <div style={{ marginTop: 12, background: "#FFF3F3", padding: 12, borderRadius: 8 }}>{errors.map((err, i) => <p key={i} style={{ color: "#D32F2F", fontSize: 13 }}>{err}</p>)}</div>
          )}

          <button type="submit" disabled={loading} style={{ marginTop: 20, width: "100%", padding: "14px", borderRadius: 12, background: loading ? "#999" : "linear-gradient(to right, #D4AF37, #F5A623)", color: "#0A1628", fontWeight: "bold", fontSize: 16, border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? (
              <>⏳ Submitting...</>
            ) : (
              <><FaPaperPlane /> Submit Booking</>
            )}
          </button>
        </form>
      </section>

      {/* Success Modal — uses real API data */}
      {successModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: 20, padding: 40, textAlign: "center", maxWidth: 420, margin: "0 20px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <FaCheckCircle style={{ color: "#4CAF50", fontSize: 64, marginBottom: 16 }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#0A1628" }}>Booking Submitted!</h2>
            <p style={{ color: "#666", marginTop: 8 }}>Thank you, {submittedName}!</p>
            <p style={{ color: "#888", fontSize: 13, marginTop: 4 }}>A confirmation email has been sent to your inbox.</p>
            <div style={{ background: "#f0f0f0", padding: "12px 16px", borderRadius: 10, marginTop: 16, border: "1px dashed #D4AF37" }}>
              <span style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>REFERENCE NUMBER</span>
              <span style={{ fontSize: 18, fontFamily: "monospace", fontWeight: "bold", color: "#D4AF37", letterSpacing: 1 }}>{referenceNumber}</span>
            </div>
            <p style={{ color: "#aaa", fontSize: 12, marginTop: 12 }}>We'll contact you within 24 hours</p>
            <button onClick={() => setSuccessModal(false)} style={{ marginTop: 20, padding: "12px 36px", borderRadius: 10, background: "#0A1628", color: "#D4AF37", border: "none", fontWeight: "bold", fontSize: 15, cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function BookNowPage() {
  return <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}><p>Loading...</p></div>}><BookNowContent /></Suspense>;
}
