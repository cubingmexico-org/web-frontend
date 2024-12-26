import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DocumentSettings from "@/components/podium/document-settings";
import "@cubing/icons";
import {
  fetchCompetition,
  // fetchCompetitions,
  retrieveLocation,
} from "@/app/[lang]/actions";
import type { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";

type Params = Promise<{ lang: Locale; competitionId: string }>;

export default async function Page({
  params,
}: {
  params: Params;
}): Promise<JSX.Element> {
  const { lang, competitionId } = await params;
  const dictionary = await getDictionary(lang);

  const session = await auth();

  if (!session) {
    redirect("/");
  }

  // const competitions = await fetchCompetitions(session.token || "");

  // if (
  //   !competitions.some((competition) => competition.id === competitionId)
  // ) {
  //   return (
  //     <div className="container mx-auto py-10">
  //       <h1 className="text-3xl mb-4">
  //         {dictionary.certificates.noPermissions}
  //       </h1>
  //     </div>
  //   );
  // }

  const competition = await fetchCompetition(competitionId);
  const city = await retrieveLocation(competitionId);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl mb-4">
        {dictionary.certificates.podium.title} {competition.name}
      </h1>
      <DocumentSettings
        city={city}
        competition={competition}
        dictionary={dictionary.certificates.podium.document_settings}
      />
    </div>
  );
}
