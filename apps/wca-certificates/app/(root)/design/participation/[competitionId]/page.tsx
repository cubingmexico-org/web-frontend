import { Badge } from "@workspace/ui/components/badge";
import DocumentSettings from "@/components/participation/document-settings";
import "@cubing/icons";
import { auth } from "@/auth";
import {
  fetchCompetition,
  fetchCompetitions,
  retrieveLocation,
} from "@/app/actions";
import { generateFakeResultsForEvent } from "@/lib/utils";

type Params = Promise<{ competitionId: string }>;

export default async function Page({
  params,
}: {
  params: Params;
}): Promise<JSX.Element> {
  const { competitionId } = await params;

  const session = await auth();

  const competitions = await fetchCompetitions(session?.token || "");

  if (!competitions.some((competition) => competition.id === competitionId)) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl mb-4"></h1>
      </div>
    );
  }

  const competition = await fetchCompetition(competitionId);
  competition.events = competition.events.map((event) =>
    generateFakeResultsForEvent(event),
  );
  const city = await retrieveLocation(competitionId);

  return (
    <div className="container flex flex-col gap-2 mx-auto py-10">
      <div className="flex gap-2">
        <h1 className="text-3xl">{competition.name}</h1>
        <Badge className="text-lg" variant="destructive"></Badge>
      </div>
      <DocumentSettings city={city} competition={competition} />
    </div>
  );
}
