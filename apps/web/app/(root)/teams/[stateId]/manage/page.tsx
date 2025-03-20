import { db } from "@/db";
import { state, team } from "@/db/schema";
import { eq } from "drizzle-orm";
import SaveTeamForm from "./_components/save-team-form";

export default async function Page(props: {
  params: Promise<{ stateId: string }>;
}) {
  const stateId = (await props.params).stateId;

  const teamsData = await db
    .select({
      name: team.name,
      description: team.description,
      image: team.image,
      coverImage: team.coverImage,
      state: state.name,
      founded: team.founded,
      socialLinks: team.socialLinks,
      isActive: team.isActive,
    })
    .from(team)
    .innerJoin(state, eq(team.stateId, state.id))
    .where(eq(team.stateId, stateId));

  return <SaveTeamForm stateId={stateId} teamData={teamsData[0]!} />;
}
