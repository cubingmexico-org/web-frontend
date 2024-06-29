import { Badge } from "@repo/ui/badge";
import { redirect } from "next/navigation";
import DocumentSettings from "@/components/participation/document-settings"
import "@cubing/icons"
import { auth } from "@/auth";
import { fetchCompetition, retrieveLocation } from "@/app/[lang]/actions";
import { generateFakeResultsForEvent } from "@/lib/utils";
import type { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";

interface PageProps {
  params: {
    lang: Locale,
    competitionId: string
  },
}

export default async function Page({ params }: PageProps): Promise<JSX.Element> {
  const dictionary = await getDictionary(params.lang);
  
  const session = await auth()

  if (!session) {
    redirect('/')
  }

  const competition = await fetchCompetition(params.competitionId);
  competition.events = competition.events.map((event) => generateFakeResultsForEvent(event));
  const city = await retrieveLocation(params.competitionId);

  return (
    <div className="container flex flex-col gap-2 mx-auto py-10">
      <div className="flex gap-2">
        <h1 className="text-3xl">{dictionary.certificates.participation.title} {competition.name}</h1><Badge className="text-lg" variant='destructive'>{dictionary.certificates.participation.design}</Badge>
      </div>
      <DocumentSettings city={city} competition={competition} dictionary={dictionary.certificates.participation.document_settings} />
    </div>
  );
}
