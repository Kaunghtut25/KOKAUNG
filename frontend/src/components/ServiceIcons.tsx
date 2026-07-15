'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const defaultServices = [
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
  const [services, setServices] = useState(defaultServices);

  useEffect(() => {
    fetch('/api/admin/site-config').then(r => r.json()).then(d => {
      if (d?.serviceIcons?.length) {
        setServices(d.serviceIcons.filter((s: any) => s.enabled !== false));
      }
    }).catch(() => {});
  }, []);

  // Fixed bar always visible under navbar, plus a spacer to prevent content jump
  const iconBar = (
    <div className="w-full bg-transparent backdrop-blur-md border-b border-white/10 py-2 px-2">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-1 md:gap-2">
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
                  : 'border-transparent hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/40')
              }
            >
              <span className="text-sm group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span
                className={
                  'text-xs font-semibold transition-colors hidden sm:inline ' +
                  (isActive ? 'text-white' : 'text-white/80 group-hover:text-[#D4AF37]')
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

  return (
    <>
      {/* Fixed bar — always visible at top */}
      <div className="fixed top-20 left-0 right-0 z-50">
        {iconBar}
      </div>
      {/* Spacer — pushes content down so nothing is hidden behind the fixed bar */}
      <div className="h-[3.5rem]" aria-hidden="true" />
    </>
  );
}
