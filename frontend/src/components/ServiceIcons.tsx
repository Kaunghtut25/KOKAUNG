'use client';

import { useSearchMode } from '@/providers/SearchModeContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useState, useEffect } from 'react';
import { useI18n } from "@/lib/i18n";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

// FIX: 2026-08-07 Burmese labels for category bar (MM mode)
const MM_LABELS: Record<string, string> = {
  Flights: "လေယာဉ်",
  Buses: "ဘတ်စ်ကားများ",
  Tours: "ခရီးစဉ်များ",
  Hotels: "ဟိုတယ်များ",
  Cars: "ကားများ",
  Visas: "ဗီဇာများ",
  Insurance: "အာမခံ",
  Cruises: "အပျော်စီးသင်္ဘောများ",
  "Sky Lounge": "စကိုင်းလောင်ဂျီ",
};

const services = [
  { label: 'Flights', icon: '✈️', key: 'flights' as const },
  { label: 'Buses', icon: '🚌', key: 'buses' as const },
  { label: 'Tours', icon: '🏔️', key: 'tours' as const, href: '/tours' },
  { label: 'Hotels', icon: '🏨', key: 'hotels' as const, href: '/hotels' },
  { label: 'Cars', icon: '🚗', key: 'cars' as const, href: '/cars' },
  { label: 'Visas', icon: '🛂', key: 'visas' as const, href: '/visas' },
  { label: 'Insurance', icon: '🛡️', key: 'insurance' as const, href: '/insurance' },
  { label: 'Cruises', icon: '🚢', key: 'cruises' as const, href: '/cruises' },
  { label: 'Sky Lounge', icon: '✨', key: 'skyLounge' as const, href: '/mingalar' },
];

function ToggleButton({ label, icon, active, onToggle }: { label: string; icon: string; active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={
        active
          ? 'flex items-center gap-1.5 py-1.5 px-3 min-h-[48px] rounded-lg border bg-[#D4AF37] border-[#D4AF37] transition-all duration-200 cursor-pointer'
          : 'flex items-center gap-1.5 py-1.5 px-3 min-h-[48px] rounded-lg border border-transparent hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-200 group cursor-pointer'
      }
    >
      <span className="text-sm hover:scale-110 transition-transform">{icon}</span>
      <span className={'text-xs font-semibold hidden sm:inline ' + (active ? 'text-[#0A1628]' : 'text-gray-700 group-hover:text-[#D4AF37]')}>
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
          ? 'flex items-center gap-1.5 py-1.5 px-3 min-h-[48px] rounded-lg border bg-[#D4AF37] border-[#D4AF37] transition-all duration-200 cursor-pointer'
          : 'flex items-center gap-1.5 py-1.5 px-3 min-h-[48px] rounded-lg border border-transparent hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-200 group cursor-pointer'
      }
    >
      <span className="text-sm group-hover:scale-110 transition-transform">{icon}</span>
      <span className={'text-xs font-semibold transition-colors hidden sm:inline ' + (active ? 'text-[#0A1628]' : 'text-gray-700 group-hover:text-[#D4AF37]')}>
        {label}
      </span>
    </Link>
  );
}

export default function ServiceIcons___FINALV5() {
  const { lang } = useI18n();
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
          <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-2">
            {services.filter(item => moduleToggles[item.key] !== false).map((item) => {
              if ('href' in item) {
                const active = item.href !== '/' && (pathname === item.href || pathname.startsWith(item.href + '/'));
                return <NavLink key={item.href} label={lang === "mm" ? (MM_LABELS[item.label] || item.label) : item.label} icon={item.icon} href={item.href} active={active} />;
              }
              const active = isHomePage && mode === item.key;
              return (
                <ToggleButton
                  key={item.label}
                  label={lang === "mm" ? (MM_LABELS[item.label] || item.label) : item.label}
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
            })}
            <div className="flex items-center pl-1 md:pl-2 ml-1 md:ml-2 border-l border-gray-200">
              <LanguageSwitcher dark={false} />
            </div>
          </div>
        </div>
      </div>
      <div className="h-[3.5rem]" aria-hidden="true" />
    </>
  );
}
