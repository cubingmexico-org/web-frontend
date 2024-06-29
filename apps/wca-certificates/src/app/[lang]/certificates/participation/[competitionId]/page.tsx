import { redirect } from "next/navigation"
import { auth } from "@/auth"
import DocumentSettings from "@/components/participation/document-settings"
import "@cubing/icons"
import { fetchCompetition, retrieveLocation } from "@/app/[lang]/actions"
import type { Locale } from "@/i18n-config"
import { getDictionary } from "@/get-dictionary"

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
  const { city, state } = await retrieveLocation(competition.schedule.venues[0].latitudeMicrodegrees/1000000, competition.schedule.venues[0].longitudeMicrodegrees/1000000);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl mb-4">{dictionary.certificates.participation.title} {competition.name}</h1>
      <DocumentSettings city={city} competition={competition} dictionary={dictionary.certificates.participation.document_settings} state={state} />
    </div>
  );
}
