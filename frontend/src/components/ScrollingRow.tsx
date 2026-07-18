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

  // Touch/drag gesture refs
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStartX = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const momentumFrame = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

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

  // ── Touch handlers ──

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const el = scrollRef.current; if (!el) return;
    setIsPaused(true);
    if (momentumFrame.current) cancelAnimationFrame(momentumFrame.current);
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    scrollStartX.current = el.scrollLeft;
    lastX.current = e.touches[0].clientX;
    lastTime.current = Date.now();
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const el = scrollRef.current; if (!el) return;
    const x = e.touches[0].clientX;
    const dx = startX.current - x;
    el.scrollLeft = scrollStartX.current + dx;

    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      velocity.current = (lastX.current - x) / dt;
    }
    lastX.current = x;
    lastTime.current = now;
  }, []);

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;

    const absVel = Math.abs(velocity.current);
    if (absVel > 0.05) {
      const el = scrollRef.current;
      if (!el) { setIsPaused(false); return; }

      const friction = 0.95;
      const minVelocity = 0.05;

      const applyMomentum = () => {
        const el = scrollRef.current;
        if (!el || isDragging.current) return;

        velocity.current *= friction;
        el.scrollLeft += velocity.current * 16;

        if (Math.abs(velocity.current) > minVelocity) {
          momentumFrame.current = requestAnimationFrame(applyMomentum);
        } else {
          velocity.current = 0;
        }
      };

      momentumFrame.current = requestAnimationFrame(applyMomentum);
    }

    setTimeout(() => {
      if (!isDragging.current) setIsPaused(false);
    }, 500);
  }, []);

  // ── Auto-scroll timer ──

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
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          touchAction: 'pan-y',
          WebkitOverflowScrolling: 'touch',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
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
