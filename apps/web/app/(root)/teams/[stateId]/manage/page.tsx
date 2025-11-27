import { ManageTeam } from "./_components/manage-team";
import { auth } from "@/auth";
import { getValidFilters } from "@/lib/data-table";
import { SearchParams } from "@/types";
import { searchParamsCache } from "../_lib/validations";
import {
  getMembers,
  getMembersGenderCounts,
  getTeamInfo,
  getIsTeamAdmin,
} from "../_lib/queries";
import { getTeam } from "@/db/queries";
import { Metadata } from "next";
import { notFound, unauthorized } from "next/navigation";

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

  if (!session) {
    unauthorized();
  }

  const stateId = (await props.params).stateId;

  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const isAdmin = await getIsTeamAdmin(stateId, session.user?.id!);

  if (!isAdmin) {
    unauthorized();
  }

  const team = await getTeamInfo(stateId);

  if (!team) {
    notFound();
  }

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

  return <ManageTeam stateId={stateId} teamData={team} promises={promises} />;
}
