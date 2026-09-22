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

async function fetchTeam(): Promise<{ departments: TeamDepartment[]; members: TeamMember[] }> {
  try {
    const [departments, members] = await Promise.all([
      getAll("team_departments" as never),
      getAll("team_members" as never),
    ]);
    return {
      departments: (departments || []) as TeamDepartment[],
      members: (members || []) as TeamMember[],
    };
  } catch {
    return { departments: [], members: [] };
  }
}

export default async function TeamPage() {
  const { departments, members } = await fetchTeam();
  return <TeamClient departments={departments} members={members} />;
}