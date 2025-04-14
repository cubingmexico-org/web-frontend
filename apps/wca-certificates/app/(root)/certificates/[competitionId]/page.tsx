import { CertificateManager } from "@/components/certificate-manager";
import { getCompetitionById, getWCIFByCompetitionId } from "@/db/queries";

type Params = Promise<{ competitionId: string }>;

export default async function Page({
  params,
}: {
  params: Params;
}): Promise<JSX.Element> {
  const { competitionId } = await params;

  const competition = await getCompetitionById({
    id: competitionId!,
  });

  const wcif = await getWCIFByCompetitionId({
    competitionId: competitionId!,
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <CertificateManager competition={competition} persons={wcif.persons} />
    </main>
  );
}
