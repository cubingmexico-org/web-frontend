import { Badge } from "@repo/ui/badge";
import { redirect } from "next/navigation";
import DocumentSettings from "@/components/podium/document-settings"
import "@cubing/icons"
import { auth } from "@/auth";
import { fetchCompetition, retrieveLocation } from "@/app/[lang]/actions";
import { generateFakeResultsForEvent } from "@/lib/utils";

export default async function Page({ params }: { params: { competitionId: string } }): Promise<JSX.Element> {
  const session = await auth()

  if (!session) {
    redirect('/')
  }

  const competition = await fetchCompetition(params.competitionId);
  competition.events = competition.events.map((event) => generateFakeResultsForEvent(event));
  const { city, state } = await retrieveLocation(competition.schedule.venues[0].latitudeMicrodegrees/1000000, competition.schedule.venues[0].longitudeMicrodegrees/1000000);

  return (
    <div className="container flex flex-col gap-2 mx-auto py-10">
      <div className="flex gap-2">
        <h1 className="text-3xl">Certificados de podio para el {competition.name}</h1><Badge className="text-lg" variant='destructive'>Diseño</Badge>
      </div>
      <DocumentSettings city={city} competition={competition} state={state} />
    </div>
  );
}
