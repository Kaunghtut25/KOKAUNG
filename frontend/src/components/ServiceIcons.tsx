'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const services = [
  { label: 'Flights', icon: '✈️', href: '/' },
  { label: 'Tours', icon: '🏔️', href: '/tours' },
  { label: 'Hotels', icon: '🏨', href: '/hotels' },
  { label: 'Cars', icon: '🚗', href: '/cars' },
  { label: 'Visas', icon: '🛂', href: '/visas' },
  { label: 'Insurance', icon: '🛡️', href: '/insurance' },
  { label: 'Cruises', icon: '🚢', href: '/cruises' },
  { label: 'Sky Lounge', icon: '✨', href: '/mingalar' },
];

export default function ServiceIcons() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show bar as soon as hero icons scroll out of view (~150px)
      setVisible(window.scrollY > 120);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Homepage: sticky bar that slides in on scroll, sits below navbar
  // Other pages: static bar below navbar (already pushed by pt-20)
  if (isHome) {
    return (
      <div
        className={
          'fixed top-20 left-0 right-0 z-40 w-full bg-[#0A1628] border-b border-[#D4AF37]/20 shadow-lg shadow-black/30 transition-all duration-300 ' +
          (visible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none')
        }
      >
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-1 md:gap-2 py-2.5 px-2">
          {services.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-transparent bg-white/5 hover:bg-white/10 hover:border-[#D4AF37]/40 transition-all duration-200 group cursor-pointer"
              >
                <span className="text-sm group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="text-xs font-semibold text-white/80 group-hover:text-[#D4AF37] transition-colors hidden sm:inline">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Non-home pages: always visible static bar
  return (
    <div className="pt-20 w-full bg-[#0A1628] border-b border-[#D4AF37]/20">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-1 md:gap-2 py-2.5 px-2">
        {services.map((item) => {
          const isActive = item.href !== '/' && (pathname === item.href || pathname.startsWith(item.href + '/'));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                'flex items-center gap-1.5 py-1.5 px-3 rounded-lg border transition-all duration-200 group cursor-pointer ' +
                (isActive
                  ? 'bg-[#D4AF37] border-[#D4AF37]'
                  : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-[#D4AF37]/40')
              }
            >
              <span className="text-sm group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span
                className={
                  'text-xs font-semibold transition-colors hidden sm:inline ' +
                  (isActive ? 'text-[#0A1628]' : 'text-white/80 group-hover:text-[#D4AF37]')
                }
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
