"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { FaPaperPlane, FaCheckCircle, FaUser, FaEnvelope, FaPhone } from "react-icons/fa";

interface FormData {
  fullName: string; email: string; phone: string; travelType: string;
  fromAirport: string; toAirport: string; departDate: string; returnDate: string;
  passengers: number; travelClass: string; specialRequests: string; contactPreference: string;
}

interface SearchSummary {
  type: string; from: string; to: string; departDate: string; returnDate: string;
  passengers: string; travelClass: string; legs?: { from: string; to: string; date: string }[];
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

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Read search params on mount
  useEffect(() => {
    const type = searchParams.get("type");
    if (!type) return;

    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const departDate = searchParams.get("depart") || "";
    const returnDate = searchParams.get("return") || "";
    const adults = searchParams.get("adults") || "1";
    const children = searchParams.get("children") || "0";
    const infants = searchParams.get("infants") || "0";
    const travelClass = searchParams.get("class") || "Economy";

    const totalPax = parseInt(adults) + parseInt(children) + parseInt(infants);
    const paxLabel = `${totalPax} Passenger${totalPax > 1 ? "s" : ""} (${adults} Adult${adults !== "1" ? "s" : ""}${children !== "0" ? `, ${children} Child${children !== "1" ? "ren" : ""}` : ""}${infants !== "0" ? `, ${infants} Infant${infants !== "1" ? "s" : ""}` : ""})`;

    let summary: SearchSummary = {
      type: type === "oneway" ? "One Way" : type === "roundtrip" ? "Round Trip" : "Multi-City",
      from, to, departDate, returnDate,
      passengers: paxLabel, travelClass,
    };

    if (type === "multicity") {
      const legs: { from: string; to: string; date: string }[] = [];
      const numLegs = parseInt(searchParams.get("legs") || "0");
      for (let i = 0; i < numLegs; i++) {
        legs.push({
          from: searchParams.get(`from${i}`) || "",
          to: searchParams.get(`to${i}`) || "",
          date: searchParams.get(`date${i}`) || "",
        });
      }
      summary.legs = legs;
      if (legs.length > 0) {
        summary.from = legs[0].from;
        summary.to = legs[legs.length - 1].to;
        summary.departDate = legs[0].date;
        summary.returnDate = "";
      }
    }

    setSearchSummary(summary);
    setFormData((prev) => ({
      ...prev,
      fromAirport: summary.from,
      toAirport: summary.to,
      departDate: summary.departDate,
      returnDate: type === "roundtrip" ? summary.returnDate : "",
      passengers: totalPax,
      travelClass: summary.travelClass,
      travelType: "flight",
    }));

    // Auto-scroll to message box after render
    setTimeout(() => {
      messageBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "passengers" ? parseInt(value) || 1 : value }));
  };

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!formData.fullName.trim()) errs.push("Full name is required");
    if (!formData.email.trim()) errs.push("Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.push("Enter a valid email address");
    if (!formData.phone.trim()) errs.push("Phone number is required");
    if (!formData.departDate && formData.travelType === "flight" && searchSummary) errs.push("Travel date is required");
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        travelType: formData.travelType,
        fromAirport: formData.fromAirport,
        toAirport: formData.toAirport,
        departDate: formData.departDate,
        returnDate: formData.returnDate,
        passengers: formData.passengers,
        travelClass: formData.travelClass,
        specialRequests: searchSummary
          ? `[Search: ${searchSummary.type} | ${searchSummary.from} → ${searchSummary.to} | ${searchSummary.departDate}${searchSummary.returnDate ? " - " + searchSummary.returnDate : ""} | ${searchSummary.passengers} | ${searchSummary.travelClass}]\n${formData.specialRequests}`
          : formData.specialRequests,
        contactPreference: formData.contactPreference,
      };
      const res = await fetch(`/api/booking-receiver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setReferenceNumber(data.referenceNumber);
        setSubmittedName(formData.fullName);
        setSuccessModal(true);
      } else {
        setErrors(data.errors || [data.message || "Failed to send. Please try again."]);
      }
    } catch {
      setErrors(["Network error. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all text-sm";
  const labelClass = "block text-gray-700 text-sm font-medium mb-1";

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* Hero Banner */}
      <div
        className="relative w-full h-48 md:h-64 mb-8 bg-cover bg-center rounded-b-3xl overflow-hidden"
        style={{ backgroundImage: 'url(/images_v2/hero-book-now-v2.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Book Your Journey
          </h1>
          <p className="text-white/70 text-xs md:text-sm">
            Fill in your details and our travel experts will get back to you within 24 hours.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">

        {/* Search Summary Message Box */}
        {searchSummary && (
          <div ref={messageBoxRef} className="bg-[#0A1628] text-white rounded-2xl p-6 mb-8 shadow-lg">
            <h2 className="text-lg font-bold text-[#D4AF37] mb-4 flex items-center gap-2">
              <FaPaperPlane className="text-sm" /> Your Search
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Trip Type</p>
                <p className="font-semibold text-white mt-1">{searchSummary.type}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Route</p>
                <p className="font-semibold text-white mt-1">{searchSummary.from} → {searchSummary.to}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Date</p>
                <p className="font-semibold text-white mt-1">{searchSummary.departDate}{searchSummary.returnDate ? ` - ${searchSummary.returnDate}` : ""}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Passengers</p>
                <p className="font-semibold text-white mt-1">{searchSummary.passengers} | {searchSummary.travelClass}</p>
              </div>
            </div>
            {searchSummary.legs && searchSummary.legs.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Multi-City Route</p>
                {searchSummary.legs.map((leg, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm mb-1">
                    <span className="text-[#D4AF37] font-bold">Flight {i + 1}:</span>
                    <span className="text-white">{leg.from} → {leg.to}</span>
                    <span className="text-gray-400">| {leg.date}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-gray-400 text-xs mt-4">Complete the form below and we&apos;ll email you a personalized quote. 👇</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 space-y-6">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm font-medium mb-1">Please fix the following:</p>
              <ul className="list-disc list-inside text-red-500 text-sm">
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}><FaUser className="inline mr-1 text-[#D4AF37]" /> Full Name *</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}><FaEnvelope className="inline mr-1 text-[#D4AF37]" /> Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}><FaPhone className="inline mr-1 text-[#D4AF37]" /> Phone *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+95 9 xxx xxx xxx" className={inputClass} />
            </div>
          </div>

          {/* Message / Note */}
          <div>
            <label className={labelClass}>Message / Note</label>
            <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows={4}
              placeholder="Any specific requirements, dietary needs, accessibility requests, etc."
              className={inputClass + " resize-none"} />
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">We&apos;ll email you a detailed quote within 24 hours. No payment required now.</p>
            <button type="submit" disabled={loading}
              className="bg-[#D4AF37] text-[#0A1628] font-bold px-10 py-3.5 rounded-lg hover:bg-[#C5A028] hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2">
              <FaPaperPlane /> {loading ? "Sending..." : "Send Booking Request"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <FaCheckCircle className="text-3xl text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
            <p className="text-gray-600 text-sm mb-2">
              Thank you <span className="font-semibold text-gray-900">{submittedName}</span>!
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Your reference: <span className="font-mono font-bold text-[#D4AF37] bg-gray-100 px-2 py-1 rounded">{referenceNumber}</span>
            </p>
            <p className="text-gray-400 text-xs mb-6">We will review your request and email you a personalized quote within 24 hours.</p>
            <button onClick={() => setSuccessModal(false)}
              className="bg-[#D4AF37] text-[#0A1628] font-bold px-8 py-3 rounded-lg hover:bg-[#C5A028] transition-all cursor-pointer">
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function BookNowPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-24 pb-16"><div className="text-center text-gray-500">Loading...</div></div>}>
      <BookNowContent />
    </Suspense>
  );
}
