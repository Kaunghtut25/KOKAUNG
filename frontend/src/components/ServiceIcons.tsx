'use client';

import { useSearchMode } from '@/providers/SearchModeContext';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const services = [
  { label: 'Flights', icon: '✈️', key: 'flights' as const },
  { label: 'Buses', icon: '🚌', key: 'buses' as const },
  { label: 'Tours', icon: '🏔️', href: '/tours' },
  { label: 'Hotels', icon: '🏨', href: '/hotels' },
  { label: 'Cars', icon: '🚗', href: '/cars' },
  { label: 'Visas', icon: '🛂', href: '/visas' },
  { label: 'Insurance', icon: '🛡️', href: '/insurance' },
  { label: 'Cruises', icon: '🚢', href: '/cruises' },
  { label: 'Sky Lounge', icon: '✨', href: '/mingalar' },
];

function ToggleButton({ label, icon, active, onToggle }: { label: string; icon: string; active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={
        active
          ? 'flex items-center gap-1.5 py-1.5 px-3 rounded-lg border bg-[#D4AF37] border-[#D4AF37] transition-all duration-200 cursor-pointer'
          : 'flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-transparent hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-200 group cursor-pointer'
      }
    >
      <span className="text-sm hover:scale-110 transition-transform">{icon}</span>
      <span className={'text-xs font-semibold hidden sm:inline ' + (active ? 'text-white' : 'text-gray-700 group-hover:text-[#D4AF37]')}>
        {label}
      </span>
    </button>
  );
}

function NavLink({ label, icon, href, active }: { label: string; icon: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={
        active
          ? 'flex items-center gap-1.5 py-1.5 px-3 rounded-lg border bg-[#D4AF37] border-[#D4AF37] transition-all duration-200 cursor-pointer'
          : 'flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-transparent hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-200 group cursor-pointer'
      }
    >
      <span className="text-sm group-hover:scale-110 transition-transform">{icon}</span>
      <span className={'text-xs font-semibold transition-colors hidden sm:inline ' + (active ? 'text-white' : 'text-gray-700 group-hover:text-[#D4AF37]')}>
        {label}
      </span>
    </Link>
  );
}

export default function ServiceIcons___FINALV5() {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, setMode } = useSearchMode();
  const isHomePage = pathname === "/";
  const [moduleToggles, setModuleToggles] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/admin/site-config')
      .then(r => r.json())
      .then(d => setModuleToggles(d.moduleToggles || {}))
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="fixed top-20 left-0 right-0 z-50">
        <div className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 py-2 px-2 shadow-sm">
          <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-1 md:gap-2">
            {services.filter(item => {
              if ('key' in item) {
                if (item.key === 'flights') return moduleToggles.flights !== false;
                if (item.key === 'buses') return moduleToggles.buses !== false;
              }
              return true;
            }).map((item) => {
              if ('key' in item) {
                const active = isHomePage && mode === item.key;
                return (
                  <ToggleButton
                    key={item.label}
                    label={item.label}
                    icon={item.icon}
                    active={active}
                    onToggle={() => {
                      setMode(item.key);
                      if (!isHomePage) {
                        router.push('/');
                      }
                      setTimeout(() => {
                        const el = document.getElementById('search-engine');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 100);
                    }}
                  />
                );
              }
              const active = item.href !== '/' && (pathname === item.href || pathname.startsWith(item.href + '/'));
              return <NavLink key={item.href} label={item.label} icon={item.icon} href={item.href} active={active} />;
            })}
          </div>
        </div>
      </div>
      <div className="h-[3.5rem]" aria-hidden="true" />
    </>
  );
}
