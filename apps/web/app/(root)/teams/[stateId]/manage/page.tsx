import { db } from "@/db";
import { person, state, team, teamMember } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { ManageTeam } from "./_components/manage-team";
import { auth } from "@/auth";
import { getValidFilters } from "@/lib/data-table";
import { SearchParams } from "@/types";
import { searchParamsCache } from "../_lib/validations";
import { getMembers, getMembersGenderCounts } from "../_lib/queries";
import { getTeam } from "@/db/queries";
import { Metadata } from "next";
import { unauthorized } from "next/navigation";

type Props = {
  params: Promise<{ stateId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const stateId = (await params).stateId;

  const team = await getTeam(stateId);

  return {
    title: `${team?.name} | Cubing México`,
    description: `${team?.name} es un equipo de ${team?.state} que compite en competencias de la World Cube Association.`,
  };
}

export default async function Page(props: {
  params: Promise<{ stateId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();

  const stateId = (await props.params).stateId;

  const admins = await db
    .select({
      id: person.id,
    })
    .from(person)
    .leftJoin(teamMember, eq(person.id, teamMember.personId))
    .where(and(eq(person.stateId, stateId), eq(teamMember.isAdmin, true)));

  const currentUserIsAdmin = admins.some((admin) => {
    return admin.id === session?.user?.id;
  });

  if (!currentUserIsAdmin) {
    unauthorized();
  }

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

  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters);

  const promises = Promise.all([
    getMembers(
      {
        ...search,
        filters: validFilters,
      },
      stateId,
    ),
    getMembersGenderCounts(stateId),
  ]);

  return (
    <ManageTeam
      stateId={stateId}
      teamData={teamsData[0]!}
      promises={promises}
    />
  );
}
