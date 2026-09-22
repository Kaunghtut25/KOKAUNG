"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

/**
 * Team page client — departments as pill tabs + anchor sections,
 * member cards in a 2-column (phone) / 3-column (tablet) grid.
 * Wave pattern inspired by Flymya's team page, recolored to the A9 palette.
 * Zoom-stable: colour transitions only, no transform/scale effects.
 */

export interface TeamDepartment {
  id?: string; _id?: string;
  nameEn?: string; nameMm?: string;
  sortOrder?: number;
}

export interface TeamMember {
  id?: string; _id?: string;
  departmentId?: string;
  nameEn?: string; nameMm?: string;
  positionEn?: string; positionMm?: string;
  photoUrl?: string;
  linkedinUrl?: string;
  sortOrder?: number;
  active?: boolean;
}

interface Props {
  departments: TeamDepartment[];
  members: TeamMember[];
}

/* Pastel card tints (rotating) — A9-tinted, low opacity so text stays readable */
const CARD_TINTS = [
  "rgba(212, 175, 55, 0.16)",
  "rgba(27, 42, 74, 0.08)",
  "rgba(0, 183, 240, 0.12)",
];

const slug = (s: string) =>
  (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const initials = (name: string) =>
  (name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export default function TeamClient({ departments, members }: Props) {
  const { t, lang } = useI18n();
  const [activeId, setActiveId] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const deptName = (d: TeamDepartment) =>
    (lang === "mm" ? d.nameMm || d.nameEn : d.nameEn || d.nameMm) || "";

  const sorted = useMemo(
    () => [...(departments || [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    [departments]
  );

  const membersOf = (deptId: string) =>
    (members || [])
      .filter((m) => m.departmentId === deptId && m.active !== false)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const goTo = (d: TeamDepartment) => {
    const id = d.id || d._id || "";
    setActiveId(id);
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeMembers = (members || []).filter((m) => m.active !== false);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Hero ─── */}
      <section className="bg-[#0A1628] pt-28 pb-14 md:pt-32 md:pb-16">
        <div className="max-w-[1100px] mx-auto px-5 text-center">
          <p className="text-[#D4AF37] text-xs md:text-sm font-semibold tracking-[0.25em] uppercase mb-3">
            {t("team.kicker")}
          </p>
          <h1
            className="text-white text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {t("team.title")}
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {t("team.subtitle")}
          </p>
          {activeMembers.length > 0 && (
            <p className="text-[#D4AF37] text-sm mt-5">
              {activeMembers.length} {t("team.membersLabel")} · {sorted.length} {t("team.departmentsLabel")}
            </p>
          )}
        </div>
      </section>

      {sorted.length === 0 ? (
        /* ─── Empty state ─── */
        <section className="max-w-[1100px] mx-auto px-5 py-20 text-center">
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-[#0A1628] text-xl font-semibold mb-2">{t("team.emptyTitle")}</h2>
          <p className="text-slate-500 text-sm">{t("team.emptyBody")}</p>
        </section>
      ) : (
        <>
          {/* ─── Department tabs (sticky) ─── */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
            <div className="max-w-[1100px] mx-auto px-3 py-3 flex gap-2 overflow-x-auto">
              {sorted.map((d) => {
                const id = d.id || d._id || "";
                const isActive = activeId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => goTo(d)}
                    className={
                      "shrink-0 px-4 py-2 rounded-full text-[13px] font-medium border transition-colors " +
                      (isActive
                        ? "bg-[#D4AF37] border-[#D4AF37] text-[#0A1628]"
                        : "bg-white border-[#0A1628]/20 text-[#0A1628] hover:border-[#D4AF37]")
                    }
                  >
                    {deptName(d)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── Sections ─── */}
          <div className="max-w-[1100px] mx-auto px-5 py-10 md:py-14">
            {sorted.map((d, di) => {
              const id = d.id || d._id || "";
              const list = membersOf(id);
              return (
                <section
                  key={id}
                  id={slug(deptName(d)) || "dept-" + di}
                  ref={(el) => { sectionRefs.current[id] = el; }}
                  className="mb-14 md:mb-16 scroll-mt-28"
                >
                  {/* Pill heading */}
                  <div className="flex justify-center mb-6 md:mb-8">
                    <h2 className="bg-[#D4AF37] text-[#0A1628] text-[15px] md:text-base font-semibold rounded-full px-5 py-1.5">
                      {deptName(d)}
                    </h2>
                  </div>

                  {list.length === 0 ? (
                    <p className="text-center text-slate-400 text-sm">{t("team.deptEmpty")}</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-14 md:gap-x-6">
                      {list.map((m, mi) => {
                        const name = (lang === "mm" ? m.nameMm || m.nameEn : m.nameEn || m.nameMm) || "";
                        const role = (lang === "mm" ? m.positionMm || m.positionEn : m.positionEn || m.positionMm) || "";
                        const tint = CARD_TINTS[mi % CARD_TINTS.length];
                        return (
                          <div key={m.id || m._id || mi} className="text-center">
                            {/* Tinted card with the portrait overlapping out of its top edge */}
                            <div
                              className="relative rounded-2xl h-[150px] md:h-[175px] mt-12"
                              style={{ backgroundColor: tint }}
                            >
                              <div className="absolute left-0 right-0 -top-11 md:-top-12 mx-auto w-[120px] h-[120px] md:w-[140px] md:h-[140px] overflow-hidden rounded-xl bg-white ring-1 ring-black/5">
                                {m.photoUrl ? (
                                  <Image
                                    src={m.photoUrl}
                                    alt={name}
                                    width={320}
                                    height={320}
                                    sizes="(max-width: 768px) 120px, 140px"
                                    className="w-full h-full object-cover object-top"
                                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-[#0A1628] text-[#D4AF37] text-2xl font-semibold">
                                    {initials(name)}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Name + role below the card (same pattern as Flymya) */}
                            <p className="text-[#0A1628] text-[13px] md:text-sm font-semibold uppercase leading-tight mt-3">
                              {name}
                            </p>
                            {role && (
                              <p className="text-[#8a6d1f] text-[11px] md:text-xs mt-1 leading-snug">{role}</p>
                            )}
                            {m.linkedinUrl && (
                              <a
                                href={m.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-1.5 text-[11px] text-[#0A1628]/60 hover:text-[#D4AF37] underline"
                              >
                                {t("team.linkedin")}
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}