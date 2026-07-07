"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const navLinks = [
  { label: "Tours", href: "/tours" },
  { label: "Hotels", href: "/hotels" },
  { label: "Cars", href: "/cars" },
  { label: "Visas", href: "/visas" },
  { label: "Insurance", href: "/insurance" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 20); };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#0A1628] backdrop-blur-xl shadow-lg border-b-2 border-[#D4AF37]/40"
                 : "bg-[#0A1628] border-b-2 border-[#D4AF37]/20"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex-shrink-0 group flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] flex-shrink-0 shadow-md shadow-[#D4AF37]/20 group-hover:shadow-lg group-hover:shadow-[#D4AF37]/30 transition-all">
                <Image src="/logo.jpeg" alt="A9 Global Travels & Tours" width={48} height={48} className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-display text-lg md:text-xl font-bold text-white tracking-wide leading-tight">
                  A9 Global Travels & Tours
                </h1>
                <p className="text-[10px] md:text-xs italic text-[#D4AF37] tracking-wide group-hover:text-[#F5A623] transition-colors">
                  Where every journey is a story waiting to be told!
                </p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link key={link.href} href={link.href}
                    className={`px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-lg [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] ${
                      active ? "bg-[#D4AF37] text-[#0A1628] [text-shadow:none] shadow-sm"
                             : "text-white hover:text-[#D4AF37] hover:bg-white/10"
                    }`}>
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center space-x-3">
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-white hover:text-[#D4AF37] transition-colors px-3 py-2 rounded-lg hover:bg-white/10">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Account
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-gray-200 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/auth/login" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] rounded-t-xl transition-colors">Login</Link>
                  <Link href="/auth/register" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] rounded-b-xl border-t border-gray-100 transition-colors">Sign Up</Link>
                </div>
              </div>
              <div className="relative group">
                <button className={`font-bold rounded-full px-5 py-2.5 text-sm transition-all whitespace-nowrap ${
                  isActive("/book-now") || isActive("/contact") ? "bg-[#C5A028] text-[#0A1628] shadow-md"
                  : "bg-[#D4AF37] text-[#0A1628] hover:bg-[#C5A028] hover:shadow-lg"
                }`}>
                  Contact & Book
                  <svg className="w-3 h-3 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-gray-200 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/book-now" className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] rounded-t-xl transition-colors">📋 Book Now</Link>
                  <Link href="/contact" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D4AF37] rounded-b-xl border-t border-gray-100 transition-colors">📞 Contact Us</Link>
                </div>
              </div>
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-white hover:text-[#D4AF37] transition-colors" aria-label="Toggle menu">
              {mobileOpen ? <HiX className="w-7 h-7" /> : <HiMenuAlt3 className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${
        mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)} />

      <div className={`fixed top-0 right-0 z-50 h-full w-72 bg-[#0A1628] border-l border-[#D4AF37]/20 shadow-2xl transform transition-transform duration-500 ease-in-out lg:hidden ${
        mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full pt-6">
          <div className="px-6 pb-6 border-b border-[#D4AF37]/20">
            <button onClick={() => setMobileOpen(false)}
              className="ml-auto block p-2 text-[#D4AF37] hover:text-[#F5A623] transition-colors" aria-label="Close menu">
              <HiX className="w-6 h-6" />
            </button>
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#D4AF37] flex-shrink-0">
                <Image src="/logo.jpeg" alt="A9 Global" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-white tracking-wide">A9 Global Travels & Tours</h2>
                <p className="text-[10px] italic text-[#D4AF37]/70">Where every journey is a story waiting to be told!</p>
              </div>
            </Link>
          </div>

          <div className="flex-1 px-6 py-6 space-y-1 overflow-y-auto">
            {navLinks.map((link, i) => {
              const active = isActive(link.href);
              return (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className={`block py-3 px-4 text-base font-medium rounded-lg transition-all duration-200 ${
                    active ? "bg-[#D4AF37] text-[#0A1628]" : "text-white hover:text-[#D4AF37] hover:bg-white/10"
                  }`} style={{ animationDelay: `${i * 50}ms` }}>
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="px-6 py-6 border-t border-[#D4AF37]/20 space-y-3">
            <Link href="/book-now" onClick={() => setMobileOpen(false)}
              className="block text-center w-full bg-[#D4AF37] text-[#0A1628] font-bold rounded-full py-3 text-sm hover:bg-[#C5A028] hover:shadow-lg transition-all whitespace-nowrap">📋 Book Now</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)}
              className="block text-center w-full border-2 border-[#D4AF37]/40 text-[#D4AF37] font-semibold rounded-full py-3 text-sm hover:bg-[#D4AF37]/10 transition-all">📞 Contact Us</Link>
          </div>
        </div>
      </div>
    </>
  );
}
