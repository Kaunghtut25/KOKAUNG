import type { Metadata } from "next";
import { getAll } from "@/lib/persistentStore";
import TeamClient, { TeamDepartment, TeamMember } from "./teamclient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the A9 Global Travel & Tours team — the travel professionals behind every journey, from ticketing and visas to tours, hotels and corporate travel.",
  alternates: { canonical: "/team" },
};

async function fetchTeam(): Promise<{
  departments: TeamDepartment[];
  members: TeamMember[];
  bgColor?: string;
  heroImage?: string;
  heroTitleEn?: string;
  heroTitleMm?: string;
  heroSubtitleEn?: string;
  heroSubtitleMm?: string;
}> {
  try {
    const [departments, members, siteCfg] = await Promise.all([
      getAll("team_departments" as never),
      getAll("team_members" as never),
      getAll("site-config" as never),
    ]);
    const cfg = (siteCfg?.[0] || {}) as Record<string, unknown>;
    return {
      departments: (departments || []) as TeamDepartment[],
      members: (members || []) as TeamMember[],
      bgColor: typeof cfg.teamBg === "string" ? cfg.teamBg : undefined,
      heroImage: typeof cfg.teamHeroImage === "string" && cfg.teamHeroImage ? cfg.teamHeroImage : "/images_v2/about-hero-v2.jpg",
      heroTitleEn: typeof cfg.teamHeroTitleEn === "string" ? cfg.teamHeroTitleEn : "",
      heroTitleMm: typeof cfg.teamHeroTitleMm === "string" ? cfg.teamHeroTitleMm : "",
      heroSubtitleEn: typeof cfg.teamHeroSubtitleEn === "string" ? cfg.teamHeroSubtitleEn : "",
      heroSubtitleMm: typeof cfg.teamHeroSubtitleMm === "string" ? cfg.teamHeroSubtitleMm : "",
    };
  } catch {
    return { departments: [], members: [], heroImage: "/images_v2/about-hero-v2.jpg", heroTitleEn: "", heroTitleMm: "", heroSubtitleEn: "", heroSubtitleMm: "" };
  }
}

export default async function TeamPage() {
  const { departments, members, bgColor, heroImage, heroTitleEn, heroTitleMm, heroSubtitleEn, heroSubtitleMm } = await fetchTeam();
  return <TeamClient departments={departments} members={members} bgColor={bgColor} heroImage={heroImage} heroTitleEn={heroTitleEn} heroTitleMm={heroTitleMm} heroSubtitleEn={heroSubtitleEn} heroSubtitleMm={heroSubtitleMm} />;
}