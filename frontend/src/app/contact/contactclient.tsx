"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import Newsletter from '@/components/Newsletter';
const subjectOptions = [
  "General Inquiry",
  "Tour Booking",
  "Hotel Booking",
  "Car Rental",
  "Visa Service",
  "Insurance",
];

export default function ContactClient({ siteConfig }: { siteConfig: any }) {
  const [heroImage, setHeroImage] = useState(siteConfig?.heroImages?.contact || "/images_v2/contact-bg-v2.jpg");
  const [contactData, setContactData] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/site-config").then(r => r.json()).then(d => {
      if (d?.heroImages?.contact) setHeroImage(d.heroImages.contact);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then((res) => res.json())
      .then((data) => setContactData(data))
      .catch(() => {});
  }, []);

  const phone = siteConfig?.contact?.phone || "959 694 320 111";
  const email = siteConfig?.contact?.email || "a9ticketing@a9globaltravel.com.mm";
  const address = siteConfig?.contact?.address || "Yangon, Myanmar";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/contact", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
      });
      toast.success("Message sent successfully! We'll get back to you soon.");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
      });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ========== HERO ========== */}
<section className="relative py-20 sm:py-28 px-4 text-center overflow-hidden" style={{ height: (siteConfig?.heroDimensions?.["contact"]?.desktop || 400) + "px" }}>
        {/* Hero background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(/images_v2/contact-bg-v2.jpg)`,
          }}
        />
        <div className="absolute inset-0 bg-[#0A1628]/80" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[#D4AF37] text-sm uppercase tracking-widest mb-4 font-semibold">
            Contact Us
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5A623] bg-clip-text text-transparent">
              Get in Touch
            </span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Have a question or ready to plan your next adventure? We&rsquo;d
            love to hear from you. Reach out and let&rsquo;s start planning.
          </p>
        </div>
      </section>
{/* ========== 2-COLUMN LAYOUT ========== */}
<section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT: Contact Form */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <h2
                className="text-2xl font-bold mb-6 text-[#0A1628]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 text-sm font-medium mb-1.5"
                  >
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400
                               focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50
                               transition-colors duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 text-sm font-medium mb-1.5"
                    >
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400
                                 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50
                                 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-gray-700 text-sm font-medium mb-1.5"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="09 123 456 789"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400
                                 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50
                                 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-gray-700 text-sm font-medium mb-1.5"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900
                               focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50
                               transition-colors duration-200 appearance-none
                               bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22%23D4AF37%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')]
                               bg-[length:12px] bg-[right_16px_center] bg-no-repeat"
                  >
                    {subjectOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-white text-gray-900">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-gray-700 text-sm font-medium mb-1.5"
                  >
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us about your travel plans or questions..."
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400
                               focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50
                               transition-colors duration-200 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-semibold text-white
                             bg-gradient-to-r from-[#D4AF37] to-[#F5A623]
                             hover:from-[#C4A037] hover:to-[#E59620]
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-200 shadow-lg shadow-[#D4AF37]/20"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Contact Info */}
          <div className="space-y-5">
            <h2
              className="text-2xl font-bold text-[#0A1628]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Contact Information
            </h2>

            {/* Address */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex gap-4 items-start hover:border-[#D4AF37]/30 transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-[#D4AF37]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[#0A1628] font-semibold text-sm mb-1">📍 Address</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  No-18, Ground Floor, Zayya Waddy Street, Baho Road,
                  <br />
                  Sanchaung Township, Yangon, Myanmar 11111
                </p>
              </div>
            </div>

            {/* Phone - Department Numbers */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex gap-4 items-start hover:border-[#D4AF37]/30 transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
              </div>
              <div className="flex-1">
                <p className="text-[#0A1628] font-semibold text-sm mb-2">📞 Contact Numbers</p>
                <div className="space-y-1.5 text-sm">
                  {[
                    {label:"Ticket Department",phone:"959 694 320 111"},
                    {label:"Visa Department",phone:"959 694 320 111"},
                    {label:"Hotel Department",phone:"959 694 320 111"},
                    {label:"Outbound Department",phone:"959 694 320 111"},
                    {label:"Inbound Department",phone:"959 694 320 111"},
                  ].map(d=><div key={d.label} className="flex justify-between items-center"><span className="text-gray-500 text-xs">{d.label}</span><a href={`tel:+959694320111`} className="text-gray-700 font-medium hover:text-[#D4AF37] transition-colors">{d.phone}</a></div>)}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex gap-4 items-start hover:border-[#D4AF37]/30 transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-[#D4AF37]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[#0A1628] font-semibold text-sm mb-1">✉️ Email</p>
                <a
                  href={`mailto:${email}`}
                  className="text-[#D4AF37] text-sm hover:text-[#F5A623] transition-colors"
                >
                  {email}
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex gap-4 items-start hover:border-[#D4AF37]/30 transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-[#D4AF37]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[#0A1628] font-semibold text-sm mb-1">🕐 Working Hours</p>
                <div className="text-gray-600 text-sm space-y-0.5">
                  <p>
                    <span className="text-gray-400">Mon – Fri:</span> 9:00 AM – 5:00 PM
                  </p>
                  <p>
                    <span className="text-gray-400">Saturday:</span> 9:00 AM – 12:00 PM
                  </p>
                  <p className="text-red-500/70">
                    Sunday &amp; Public Holidays — Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="w-full h-56 rounded-xl overflow-hidden">
                <img
                  src="/images_v2/contact-info-v2.jpg"
                  alt="World map travel concept"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-3">
                <p className="text-[#0A1628] font-semibold">📍 A9 Global Office</p>
                <p className="text-gray-500 text-sm">Sanchaung, Yangon</p>
              </div>
            </div>
          </div>
        </div>
      </section>
{/* ========== LICENSE INFO BAR ========== */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
          <div className="flex flex-wrap gap-x-8 gap-y-3 justify-center text-center text-gray-500 text-xs sm:text-sm">
            <span>
              Company Reg:{" "}
              <span className="text-[#D4AF37]/70 font-mono">126395248</span>
            </span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>
              IATA:{" "}
              <span className="text-[#D4AF37]/70 font-mono">05301026</span>
            </span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>
              T/I(YGN):{" "}
              <span className="text-[#D4AF37]/70 font-mono">2889</span>
            </span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>
              T/O(YGN):{" "}
              <span className="text-[#D4AF37]/70 font-mono">0946</span>
            </span>
          </div>
        </div>
      </section>
    
      {/* Business Hours + Map */}
      <section style={{ maxWidth: 800, margin: "40px auto 0", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#0A1628", marginBottom: 12 }}>Business Hours</h2>
            <p style={{ color: "#555", padding: "4px 0" }}>Monday - Friday: 9:00 AM - 5:00 PM</p>
            <p style={{ color: "#555", padding: "4px 0" }}>Saturday: 9:00 AM - 12:00 PM</p>
            <p style={{ color: "#555", padding: "4px 0" }}>Sunday: Closed</p>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #eee" }}>
              <p style={{ color: "#555" }}>&#9742; {phone}</p>
              <p style={{ color: "#555" }}>&#9993; {email}</p>
              <p style={{ color: "#555" }}>&#9873; {address}</p>
            </div>
          </div>
          <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15276.78203238526!2d96.195!3d16.8409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30c194d3cb9fffff%3A0x0!2sYangon!5e0!3m2!1sen!2smm!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 250 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>
      <Newsletter />
</div>
  );
}