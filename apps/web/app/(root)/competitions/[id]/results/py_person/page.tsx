import { notFound } from "next/navigation";
import { getCompetitions } from "@/db/queries";
import { getCompetitionResults, getWcaCompetitionData } from "../../_lib/queries";
import { buildCompetitionResultsViewData } from "../../_lib/results";
import { ResultsHeader } from "../_components/results-header";
import { ResultsByPersonView } from "../_components/results-views";

export async function generateStaticParams() {
  const competitions = await getCompetitions();
  return competitions.map((competition) => ({ id: competition.id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const [competitionData, competitionResults] = await Promise.all([
    getWcaCompetitionData(id),
    getCompetitionResults(id),
  ]);

  if (!competitionData) {
    notFound();
  }

  const { groupedByPerson } = buildCompetitionResultsViewData(
    competitionResults,
    competitionData.main_event_id,
  );
  const defaultEventId =
    competitionData.main_event_id ?? competitionData.event_ids[0] ?? "";

  return (
    <main className="grow container mx-auto px-4 py-8 space-y-6">
      <ResultsHeader
        competitionId={competitionData.id}
        competitionName={competitionData.name}
        competitionCity={competitionData.city}
        defaultEventId={defaultEventId}
      />
      <ResultsByPersonView groupedByPerson={groupedByPerson} />
    </main>
  );
}
