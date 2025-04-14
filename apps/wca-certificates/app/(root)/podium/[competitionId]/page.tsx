import DocumentSettings from "@/components/podium/document-settings";
import "@cubing/icons";
import {
  fetchCompetition,
  // fetchCompetitions,
  retrieveLocation,
} from "@/app/actions";

type Params = Promise<{ competitionId: string }>;

export default async function Page({
  params,
}: {
  params: Params;
}): Promise<JSX.Element> {
  const { competitionId } = await params;

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
      <h1 className="text-3xl mb-4">{competition.name}</h1>
      <DocumentSettings city={city} competition={competition} />
    </div>
  );
}
