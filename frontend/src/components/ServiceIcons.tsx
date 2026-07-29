'use client';

import { useSearchMode } from '@/providers/SearchModeContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const defaultServices = [
  { label: 'Flights', icon: '✈️', href: '/' },
  { label: 'Buses', icon: '🚌', href: '/' },
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
  const { mode, setMode } = useSearchMode();

  return (
    <>
      <div className="fixed top-20 left-0 right-0 z-50">
        <div className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 py-2 px-2 shadow-sm">
          <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-1 md:gap-2">
            {defaultServices.map((item) => {
              const isToggle = item.label === 'Flights' || item.label === 'Buses';
              const isFlightsActive = item.label === 'Flights' && mode === 'flights';
              const isBusesActive = item.label === 'Buses' && mode === 'buses';

              if (isToggle) {
                const isActive = isFlightsActive || isBusesActive;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.label === 'Flights') setMode('flights');
                      else setMode('buses');
                      setTimeout(() => {
                        const el = document.getElementById('search-engine');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 50);
                    }}
                    type="button"
                    aria-pressed={isActive}
                    className={'flex items-center gap-1.5 py-1.5 px-3 rounded-lg border transition-all duration-200 cursor-pointer ' +
                      (isActive
                        ? 'bg-[#D4AF37] border-[#D4AF37] shadow-sm'
                        : 'border-gray-200 hover:bg-gray-100 hover:border-gray-300')}
                  >
                    <span className="text-sm group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span className={'text-xs font-semibold transition-colors hidden sm:inline ' +
                      (isActive ? 'text-white' : 'text-gray-600')}>
                      {item.label}
                    </span>
                  </button>
                );
              }

              // Other services: use gold hover
              const isActive = item.href !== '/' && (pathname === item.href || pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={'flex items-center gap-1.5 py-1.5 px-3 rounded-lg border transition-all duration-200 group cursor-pointer ' +
                    (isActive
                      ? 'bg-[#D4AF37] border-[#D4AF37]'
                      : 'border-transparent hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/40')}
                >
                  <span className="text-sm group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className={'text-xs font-semibold transition-colors hidden sm:inline ' +
                    (isActive ? 'text-white' : 'text-gray-700 group-hover:text-[#D4AF37]')}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div className="h-[3.5rem]" aria-hidden="true" />
    </>
  );
}
