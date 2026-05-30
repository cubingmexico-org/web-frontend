import { notFound } from "next/navigation";
import { getCompetitions } from "@/db/queries";
import { getCompetitionResults, getWcaCompetitionData } from "../../_lib/queries";
import { buildCompetitionResultsViewData } from "../../_lib/results";
import { ResultsHeader } from "../_components/results-header";
import { ResultsAllView } from "../_components/results-views";

export async function generateStaticParams() {
  const competitions = await getCompetitions();
  return competitions.map((competition) => ({ id: competition.id }));
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ eventId?: string | string[] }>;
}) {
  const [{ id }, searchParamsValue] = await Promise.all([params, searchParams]);

  const [competitionData, competitionResults] = await Promise.all([
    getWcaCompetitionData(id),
    getCompetitionResults(id),
  ]);

  if (!competitionData) {
    notFound();
  }

  const defaultEventId =
    competitionData.main_event_id ?? competitionData.event_ids[0] ?? "";
  const searchEventId = Array.isArray(searchParamsValue.eventId)
    ? searchParamsValue.eventId[0]
    : searchParamsValue.eventId;
  const selectedEventId =
    competitionData.event_ids.find((eventId) => eventId === searchEventId) ??
    defaultEventId;

  const { groupedResultsByEvent } = buildCompetitionResultsViewData(
    competitionResults,
    competitionData.main_event_id,
  );

  return (
    <main className="grow container mx-auto px-4 py-8 space-y-6">
      <ResultsHeader
        competitionId={competitionData.id}
        competitionName={competitionData.name}
        competitionCity={competitionData.city}
        defaultEventId={selectedEventId}
      />
      <ResultsAllView
        competitionId={competitionData.id}
        competitionData={competitionData}
        groupedResultsByEvent={groupedResultsByEvent}
        selectedEventId={selectedEventId}
      />
    </main>
  );
}
