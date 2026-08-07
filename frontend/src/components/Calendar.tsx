"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useI18n } from "@/lib/i18n";

interface CalendarProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
  className?: string;
}

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}

function formatDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  return MONTH_NAMES[d.getMonth()].substring(0, 3) + " " + d.getDate() + ", " + d.getFullYear();
}

function isSameDay(a: string, b: Date): boolean {
  if (!a) return false;
  const da = new Date(a + "T00:00:00");
  return da.toDateString() === b.toDateString();
}

function isDateDisabled(dateStr: string, minDate?: string, maxDate?: string): boolean {
  const d = new Date(dateStr + "T00:00:00");
  if (minDate && new Date(minDate + "T00:00:00") > d) return true;
  if (maxDate && new Date(maxDate + "T00:00:00") < d) return true;
  return false;
}

export default function Calendar({
  value,
  onChange,
  label,
  minDate,
  maxDate,
  placeholder,
  className = "",
}: CalendarProps) {
  const { t } = useI18n();
  const labelText = label ?? t("calendar.selectDate");
  const placeholderText = placeholder ?? t("calendar.pickDate");
  const today = new Date();
  const initialY = value ? new Date(value + "T00:00:00").getFullYear() : today.getFullYear();
  const initialM = value ? new Date(value + "T00:00:00").getMonth() : today.getMonth();

  const [viewYear, setViewYear] = useState(initialY);
  const [viewMonth, setViewMonth] = useState(initialM);
  const [isOpen, setIsOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null as number | null);

  const todayStr = formatDate(today);

  // days grid
  const days = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const totalDays = daysInMonth(viewYear, viewMonth);
    const grid: { day: number | null; dateStr: string; disabled: boolean }[] = [];

    for (let i = 0; i < firstDay; i++) {
      grid.push({ day: null, dateStr: "", disabled: true });
    }

    for (let d = 1; d <= totalDays; d++) {
      const ds = viewYear + "-" + String(viewMonth + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
      grid.push({ day: d, dateStr: ds, disabled: isDateDisabled(ds, minDate, maxDate) });
    }

    return grid;
  }, [viewYear, viewMonth, minDate, maxDate]);

  const goPrev = useCallback(() => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else { setViewMonth(viewMonth - 1); }
  }, [viewYear, viewMonth]);

  const goNext = useCallback(() => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else { setViewMonth(viewMonth + 1); }
  }, [viewYear, viewMonth]);

  const selectDate = useCallback((dateStr: string) => {
    if (isDateDisabled(dateStr, minDate, maxDate)) return;
    onChange(dateStr);
    setIsOpen(false);
  }, [onChange, minDate, maxDate]);

  const handleTouchStart = (e: React.TouchEvent) => { setTouchStart(e.touches[0].clientX); };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) { if (diff > 0) goPrev(); else goNext(); }
    setTouchStart(null);
  };

  return (
    <div className={"relative " + className}>
      {labelText && <label className="text-gray-600 text-xs mb-1.5 block">{labelText}</label>}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-left text-sm flex items-center justify-between hover:border-[#D4AF37]/50 transition-colors focus:outline-none focus:border-[#D4AF37]"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value ? formatDisplay(value) : placeholderText}
        </span>
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="absolute z-50 mt-1 w-[300px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 border-b border-[#D4AF37]/10">
              <button type="button" onClick={goPrev} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#D4AF37]/10 transition-colors">
                <svg className="w-4 h-4 text-[#0A1628]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-sm font-semibold text-[#0A1628] tracking-wide">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </h3>
              <button type="button" onClick={goNext} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#D4AF37]/10 transition-colors">
                <svg className="w-4 h-4 text-[#0A1628]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 text-center py-2 px-3">
              {DAY_NAMES.map((d) => (
                <span key={d} className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5 px-3 pb-4">
              {days.map((cell, i) => (
                <div key={i} className="aspect-square flex items-center justify-center">
                  {cell.day !== null ? (
                    <button
                      type="button"
                      onClick={() => selectDate(cell.dateStr)}
                      disabled={cell.disabled}
                      className={"w-9 h-9 rounded-full text-sm font-medium transition-all duration-150 " +
                        (cell.disabled
                          ? "text-gray-300 cursor-not-allowed"
                          : isSameDay(value, new Date(viewYear, viewMonth, cell.day))
                            ? "bg-[#D4AF37] text-white shadow-md shadow-[#D4AF37]/20 scale-110"
                            : cell.dateStr === todayStr
                              ? "text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10"
                              : "text-[#0A1628] hover:bg-gray-100 active:bg-[#D4AF37]/10")
                      }
                    >
                      {cell.day}
                    </button>
                  ) : <span />}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-100">
              <button type="button" onClick={() => { onChange(""); setIsOpen(false); }}
                className="text-xs text-gray-500 hover:text-red-500 transition-colors">{t("calendar.clear")}</button>
              <button type="button" onClick={() => { onChange(todayStr); setIsOpen(false); }}
                disabled={isDateDisabled(todayStr, minDate, maxDate)}
                className={"text-xs px-3 py-1 rounded-full transition-colors " +
                  (isDateDisabled(todayStr, minDate, maxDate)
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-[#D4AF37] hover:bg-[#D4AF37]/10 font-semibold")}
              >{t("calendar.today")}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
