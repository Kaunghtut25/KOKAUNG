"use client";

import React, { useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

/**
 * Team page — layout replicated 1:1 from flymya.com/en/team:
 *   • 60px full-width cyan title bar (bg #00afef, 22px white bold)
 *   • pill tab row (rounded-[20px], border #00b7f0, active bg #b2e4f5)
 *   • sections max-w-[1100px], pill headings (bg #00b7f0, white 16px)
 *   • member cells: 2 per row phone / 4 per row ≥sm, pb-[40px]
 *   • cards: h-160/210, rotating pastel tints, photo overlaps -60px
 *     above the card, full-size (h-auto, uncropped)
 *   • name directly below the card (uppercase)
 * No hero section. Background color stays admin-configurable
 * (site-config.teamBg, defaults to FlyMya's white).
 * Zoom-stable: no transform/scale effects anywhere.
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
  bgColor?: string;
}

/* FlyMya's exact pastel card tints: #6fc0ff4f, #ff9a0026, #a9a6a342 */
const CARD_TINTS = [
  "rgba(111, 192, 255, 0.31)",
  "rgba(255, 154, 0, 0.15)",
  "rgba(169, 166, 163, 0.26)",
];

const DEFAULT_BG = "#FFFFFF";

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim());
  if (!m) return [255, 255, 255];
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function isDarkBg(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.55;
}

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

export default function TeamClient({ departments, members, bgColor }: Props) {
  const { t, lang } = useI18n();
  const [activeId, setActiveId] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const bg = bgColor && /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(bgColor) ? (bgColor.startsWith("#") ? bgColor : "#" + bgColor) : DEFAULT_BG;
  const dark = isDarkBg(bg);
  const fg = dark ? "#F8FAFC" : "#000000";
  const fgSub = dark ? "rgba(248,250,252,0.7)" : "rgba(0,0,0,0.55)";

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
    <div className="min-h-screen" style={{ backgroundColor: bg, color: fg }}>
      {/* ─── Title bar (FlyMya: bg #00afef, h-60, 22px white bold) ─── */}
      <div className="bg-[#00afef] h-[60px] flex items-center justify-center px-4">
        <span className="text-white text-[20px] md:text-[22px] font-bold text-center leading-tight">
          {t("team.title")}
        </span>
      </div>

      {/* ─── Department pill tabs (FlyMya: rounded-[20px], border #00b7f0, active #b2e4f5) ─── */}
      <div className="max-w-[1100px] mx-auto pt-[5px] px-2 flex flex-wrap justify-center">
        {sorted.map((d) => {
          const id = d.id || d._id || "";
          const isActive = activeId === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => goTo(d)}
              className={
                "rounded-[20px] m-[5px] border border-solid border-[#00b7f0] text-[#000000] px-4 py-[6px] text-[13px] md:text-sm font-medium transition-colors " +
                (isActive ? "bg-[#b2e4f5]" : "hover:bg-[#b2e4f5]/40")
              }
              style={{ color: dark ? "#0A1628" : undefined }}
            >
              {deptName(d)}
            </button>
          );
        })}
      </div>

      {sorted.length === 0 ? (
        /* ─── Empty state ─── */
        <section className="max-w-[1100px] mx-auto px-5 py-20 text-center">
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: fg }}>{t("team.emptyTitle")}</h2>
          <p className="text-sm" style={{ color: fgSub }}>{t("team.emptyBody")}</p>
        </section>
      ) : (
        /* ─── Department sections (FlyMya: max-w-[1100px], py-[20px]) ─── */
        <div className="max-w-[1100px] mx-auto py-[20px] px-3">
          {sorted.map((d, di) => {
            const id = d.id || d._id || "";
            const list = membersOf(id);
            return (
              <section
                key={id}
                id={slug(deptName(d)) || "dept-" + di}
                ref={(el) => { sectionRefs.current[id] = el; }}
                className={"scroll-mt-4 " + (di === 0 ? "pt-[40px] md:pt-[60px]" : "")}
              >
                {/* Pill heading (FlyMya: bg #00b7f0, rounded-[20px], white 16px, pb-[60px]) */}
                <div className="text-center pb-[60px]">
                  <h3 className="bg-[#00b7f0] rounded-[20px] py-[5px] px-[10px] w-max m-auto text-[#fff] text-[16px]">
                    {deptName(d)}
                  </h3>
                </div>

                {list.length === 0 ? (
                  <p className="text-center text-sm pb-[40px]" style={{ color: fgSub }}>{t("team.deptEmpty")}</p>
                ) : (
                  /* Cells: 2 per row phone (xs-6) / 4 per row ≥sm (sm-3), pb-[40px] */
                  <div className="grid grid-cols-2 sm:grid-cols-4">
                    {list.map((m, mi) => {
                      const name = (lang === "mm" ? m.nameMm || m.nameEn : m.nameEn || m.nameMm) || "";
                      const role = (lang === "mm" ? m.positionMm || m.positionEn : m.positionEn || m.positionMm) || "";
                      const tint = CARD_TINTS[mi % CARD_TINTS.length];
                      return (
                        <div key={m.id || m._id || mi} className="text-center pb-[40px]">
                          {/* Card (FlyMya: h-160/210, mt-[40px] mr-[30px] mb-[5px], pastel tint) */}
                          <div
                            className="h-[160px] md:h-[210px] mt-[40px] mr-[15px] md:mr-[30px] mb-[5px] ml-[10px] md:ml-[20px]"
                            style={{ backgroundColor: tint }}
                          >
                            {m.photoUrl ? (
                              /* Full photo, uncropped, overlapping 60px above the card */
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={m.photoUrl}
                                alt="employee"
                                className="inline-block max-w-[240px] h-auto max-h-[210px] object-contain mx-auto -mt-[60px]"
                                onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
                              />
                            ) : (
                              /* Initials avatar when no photo (stands on the card like a portrait) */
                              <div className="inline-block w-[110px] h-[140px] md:w-[130px] md:h-[170px] bg-[#0A1628] -mt-[60px] relative top-0">
                                <div className="w-full h-full flex items-center justify-center text-[#00afef] text-3xl font-semibold">
                                  {initials(name)}
                                </div>
                              </div>
                            )}
                          </div>
                          {/* Name directly below the card (FlyMya: plain uppercase span) */}
                          <div className="mt-[6px] px-1">
                            <span className="uppercase text-[14px] md:text-base leading-snug" style={{ color: fg }}>
                              {name}
                            </span>
                            {role && (
                              <span className="block text-[12px] md:text-[13px] mt-[2px]" style={{ color: fgSub }}>
                                {role}
                              </span>
                            )}
                            {m.linkedinUrl && (
                              <a
                                href={m.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-[2px] text-[11px] text-[#00afef] hover:underline"
                              >
                                {t("team.linkedin")}
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
          {activeMembers.length > 0 && (
            <p className="text-center text-[13px] pb-[30px]" style={{ color: fgSub }}>
              {activeMembers.length} {t("team.membersLabel")} · {sorted.length} {t("team.departmentsLabel")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}