'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const STEP = 320;
const AUTOPLAY_MS = 4000;

interface ScrollingRowProps {
  children: React.ReactNode;
  visible?: boolean;
}

export default function ScrollingRow({ children, visible = true }: ScrollingRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current; if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current; if (!el) return;
    el.scrollTo({ left: direction === 'left' ? el.scrollLeft - STEP : el.scrollLeft + STEP, behavior: 'smooth' });
  }, []);

  const autoScroll = useCallback(() => {
    const el = scrollRef.current; if (!el) return;
    if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 4) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      scroll('right');
    }
  }, [scroll]);

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(autoScroll, AUTOPLAY_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, autoScroll]);

  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    return () => el.removeEventListener('scroll', updateArrows);
  }, [updateArrows]);

  if (!visible) return null;

  return (
    <div className="relative group/row" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      {/* Left Arrow */}
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#D4AF37]/90 shadow-lg flex items-center justify-center transition-all duration-300 ${
          canScrollLeft ? 'opacity-100 hover:bg-[#D4AF37] hover:scale-110' : 'opacity-0 pointer-events-none'
        }`}
        style={{ marginLeft: -16 }}
      >
        <ChevronLeft className="w-5 h-5 text-gray-900" />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#D4AF37]/90 shadow-lg flex items-center justify-center transition-all duration-300 ${
          canScrollRight ? 'opacity-100 hover:bg-[#D4AF37] hover:scale-110' : 'opacity-0 pointer-events-none'
        }`}
        style={{ marginRight: -16 }}
      >
        <ChevronRight className="w-5 h-5 text-gray-900" />
      </button>
    </div>
  );
}
