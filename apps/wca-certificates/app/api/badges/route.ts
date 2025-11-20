import { getCompetitorStates, getWCIFByCompetitionId } from "@/db/queries";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const competitionId = searchParams.get("competitionId");

  if (!competitionId) {
    return Response.json(
      { error: "competitionId is required" },
      { status: 400 },
    );
  }

  const wcif = await getWCIFByCompetitionId({
    competitionId,
  });

  const persons = wcif?.persons || [];

  const personsWithRegistrantId = persons.filter(
    (person) => person.registrantId !== null,
  );

  const competitorStates = await getCompetitorStates(competitionId);

  const extendedPersons = personsWithRegistrantId.map((person) => {
    const state = competitorStates.find((state) => state.id === person.wcaId);

    return {
      ...person,
      stateId: state ? state.stateId : null,
    };
  });

  return Response.json(extendedPersons);
}
