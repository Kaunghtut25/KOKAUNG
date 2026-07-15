"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTelegramPlane } from "react-icons/fa";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Tours", href: "/tours" },
  { label: "Hotels", href: "/hotels" },
  { label: "Car Rentals", href: "/cars" },
  { label: "Visa Services", href: "/visas" },
  { label: "Travel Insurance", href: "/insurance" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-deepblue-dark border-t border-gold/20">
      {/* ── Main Footer Grid ──────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <h3 className="font-display text-2xl font-bold gold-text tracking-wider">
                𝐀𝟗 𝐆𝐋𝐎𝐁𝐀𝐋
              </h3>
            </Link>
            <p className="text-sm italic text-gold/60">
              Where every journey is a story waiting to be told!
            </p>
            <p className="text-sm text-white/60 leading-relaxed">
              Your premier IATA-accredited luxury travel partner in Myanmar.
              Since our founding, we have been dedicated to crafting
              extraordinary travel experiences — from curated tours and premium
              hotel stays to seamless visa processing and comprehensive travel
              insurance. At 𝐀𝟗 𝐆𝐥𝐨𝐛𝐚𝐥, every detail is designed with you in
              mind.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-deepblue-dark transition-all duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-deepblue-dark transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-deepblue-dark transition-all duration-300"
                aria-label="Telegram"
              >
                <FaTelegramPlane className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center">
            <h4 className="font-display text-lg font-semibold text-white mb-6 gold-underline inline-block">
              Quick Links
            </h4>
            <ul className="space-y-3 mt-6">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-6 gold-underline inline-block">
              Contact Info
            </h4>
            <div className="mt-6 space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-gold mt-0.5 flex-shrink-0">📍</span>
                <p className="text-sm text-white/60 leading-relaxed">
                  No-18, Ground Floor, Zayya Waddy Street,
                  <br />
                  Baho Road, Sanchaung Tsp,
                  <br />
                  Yangon, Myanmar, 11111
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-gold mt-0.5 flex-shrink-0">📞</span>
                <div className="text-sm text-white/60 space-y-1">
                  <a
                    href="tel:+959781617333"
                    className="block hover:text-gold transition-colors"
                  >
                    09 781 617333
                  </a>
                  <a
                    href="tel:+959694320111"
                    className="block hover:text-gold transition-colors"
                  >
                    09 694 320 111
                  </a>
                  <a
                    href="tel:+959694202333"
                    className="block hover:text-gold transition-colors"
                  >
                    09 694 202 333
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-gold mt-0.5 flex-shrink-0">✉️</span>
                <a
                  href="mailto:a9ticketing@a9globaltravel.com.mm"
                  className="text-sm text-white/60 hover:text-gold transition-colors"
                >
                  a9ticketing@a9globaltravel.com.mm
                </a>
              </div>
            </div>
          </div>

          
        </div>
      </div>

      {/* ── Bottom Bar ────────────────────────── */}
      <div className="border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-xs text-white/50">
            &copy; {currentYear} 𝐀𝟗 𝐆𝐥𝐨𝐛𝐚𝐥 Travels &amp; Tours. All rights
            reserved.
          </p>
          <p className="text-center text-[10px] text-white/30 mt-1.5 tracking-wide">
            Company Reg: 126395248 &nbsp;|&nbsp; IATA: 05301026 &nbsp;|&nbsp;
            T/I(YGN)-2889 &nbsp;|&nbsp; T/O(YGN)-0946
          </p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <img src="/images_v2/iata-logo.png" alt="IATA Accredited" className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            <img src="/images_v2/umta-logo.png" alt="UMTA Member" className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  );
}
