import { BadgeManager } from "@/components/badge-manager";
import {
  getCompetitionById,
  getCompetitorStates,
  getStates,
  getTeams,
  getWCIFByCompetitionId,
} from "@/db/queries";

type Params = Promise<{ competitionId: string }>;

export default async function Page({
  params,
}: {
  params: Params;
}): Promise<React.JSX.Element> {
  const { competitionId } = await params;

  const competition = await getCompetitionById({
    id: competitionId,
  });

  if (!competition) {
    throw new Error("Competition not found");
  }

  const wcif = await getWCIFByCompetitionId({
    competitionId,
  });

  if (!wcif) {
    throw new Error("WCIF not found");
  }

  const states = await getStates();

  const teams = await getTeams();

  const competitorStates = await getCompetitorStates(competitionId);

  const persons = wcif.persons.filter((person) => person.registrantId !== null);

  const extendedPersons = persons.map((person) => {
    const state = competitorStates.find((state) => state.id === person.wcaId);

    return {
      ...person,
      stateId: state ? state.stateId : null,
    };
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <BadgeManager
        competition={competition}
        persons={extendedPersons}
        states={states}
        teams={teams}
      />
    </main>
  );
}
