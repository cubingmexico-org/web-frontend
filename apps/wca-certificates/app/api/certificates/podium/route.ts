import { getWCIFByCompetitionId } from "@/db/queries";
import { Event, Person, PodiumData, Result } from "@/types/wcif";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const competitionId = searchParams.get("competitionId");
  const wcif = await getWCIFByCompetitionId({
    competitionId: competitionId!,
  });
  const events = wcif?.events || [];
  const persons = wcif?.persons || [];

  const personsWithRegistrantId = persons.filter(
    (person) => person.registrantId !== null,
  );

  const personIdToName: Record<string, string> = {};
  personsWithRegistrantId.forEach((person: Person) => {
    personIdToName[person.registrantId] = person.name;
  });

  function getEventData(event: Event) {
    const finalRound = event.rounds[event.rounds.length - 1];
    if (!finalRound) {
      return undefined;
    }

    const missingResults = finalRound.results.find(
      (result: Result) => result.ranking === null,
    );

    if (missingResults) {
      return undefined;
    }

    const results = finalRound.results
      .filter(
        (result: Result) =>
          result.ranking !== null &&
          result.best !== -1 &&
          result.best !== -2 &&
          result.ranking >= 1 &&
          result.ranking <= 3,
      )
      .sort((a, b) => a.ranking! - b.ranking!)
      .map((person) => ({
        personName: personIdToName[person.personId],
        result:
          event.id === "333bf" ||
          event.id === "444bf" ||
          event.id === "555bf" ||
          event.id === "333mbf"
            ? person.best
            : person.average,
      }));

    return results;
  }

  const podiums: PodiumData[] = [];

  events.map((event) => {
    const results = getEventData(event);
    if (!results) {
      // Skip if event is incomplete
      return;
    }
    results.map((result, index: number) => {
      podiums.push({
        name: result.personName!,
        place: index + 1,
        event: event.id,
        result: result.result,
      });
    });
  });

  return Response.json(podiums);
}
