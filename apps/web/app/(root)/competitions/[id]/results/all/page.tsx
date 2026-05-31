import { notFound } from "next/navigation";
import { getCompetitions } from "@/db/queries";
import { getWcaCompetitionData } from "../../_lib/queries";
import { getCompetitionResultsGroupedByEvent } from "./_lib/queries";
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
  searchParams: Promise<{ event?: string | string[] }>;
}) {
  const [{ id }, searchParamsValue] = await Promise.all([params, searchParams]);

  const [competitionData, groupedResultsByEvent] = await Promise.all([
    getWcaCompetitionData(id),
    getCompetitionResultsGroupedByEvent(id),
  ]);

  if (!competitionData) {
    notFound();
  }

  const defaultEventId =
    competitionData.main_event_id ?? competitionData.event_ids[0] ?? "";
  const searchEventId = Array.isArray(searchParamsValue.event)
    ? searchParamsValue.event[0]
    : searchParamsValue.event;

  const selectedEventId =
    competitionData.event_ids.find((eventId) => eventId === searchEventId) ??
    defaultEventId;

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
