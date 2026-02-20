import { getWCIFByCompetitionId } from "@/db/queries";
import type { Event, Person, PodiumData, Result } from "@/types/wcif";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const competitionId = searchParams.get("competitionId");
  const filterByCountry = searchParams.get("filterByCountry") === "true";
  const country = searchParams.get("country");
  const wcif = await getWCIFByCompetitionId({
    competitionId: competitionId!,
  });
  const events = wcif?.events || [];
  const persons = wcif?.persons || [];

  const personsWithRegistrantId = persons.filter(
    (person) =>
      person.registrantId !== null &&
      (!filterByCountry || person.countryIso2 === country),
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

    const isBestOnlyEvent =
      event.id === "333bf" ||
      event.id === "444bf" ||
      event.id === "555bf" ||
      event.id === "333mbf";

    const results = finalRound.results
      .filter(
        (result: Result) =>
          result.ranking !== null &&
          result.best !== -1 &&
          result.best !== -2 &&
          (isBestOnlyEvent || result.average !== -1) && // Only check average for non-best-only events
          personIdToName[result.personId] !== undefined, // Only include filtered people
      )
      .sort((a, b) => {
        const aResult = isBestOnlyEvent
            ? a.best
            : a.average;
        const bResult = isBestOnlyEvent
            ? b.best
            : b.average;
        return aResult - bResult;
      })
      .slice(0, 3)
      .map((person) => ({
        personName: personIdToName[person.personId],
        result:
          isBestOnlyEvent
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
