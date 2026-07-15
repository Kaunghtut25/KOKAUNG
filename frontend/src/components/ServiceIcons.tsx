'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function ServiceIcons() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [visible, setVisible] = useState(false);
  const [services, setServices] = useState([
    { label: 'Flights', icon: '✈️', href: '/' },
    { label: 'Tours', icon: '🏔️', href: '/tours' },
    { label: 'Hotels', icon: '🏨', href: '/hotels' },
    { label: 'Cars', icon: '🚗', href: '/cars' },
    { label: 'Visas', icon: '🛂', href: '/visas' },
    { label: 'Insurance', icon: '🛡️', href: '/insurance' },
    { label: 'Cruises', icon: '🚢', href: '/cruises' },
    { label: 'Sky Lounge', icon: '✨', href: '/mingalar' },
  ]);

  useEffect(() => {
    fetch('/api/admin/site-config').then(r => r.json()).then(d => {
      if (d?.serviceIcons?.length) {
        setServices(d.serviceIcons.filter((s: any) => s.enabled !== false));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => {
      setVisible(window.scrollY > 120);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  // Homepage: no extra bar (already in hero + sticky below)
  if (isHome) return null;

  // All other pages: always-visible sticky bar under navbar
  return (
    <div className="sticky top-20 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-1 md:gap-2 py-2 px-2">
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
                  : 'border-transparent hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30')
              }
            >
              <span className="text-sm group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span
                className={
                  'text-xs font-semibold transition-colors hidden sm:inline ' +
                  (isActive ? 'text-white' : 'text-gray-600 group-hover:text-[#D4AF37]')
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
