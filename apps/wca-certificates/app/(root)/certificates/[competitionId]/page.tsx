import { CertificateManager } from "@/components/certificate-manager";
import { getCompetitionById, getWCIFByCompetitionId } from "@/db/queries";

type Params = Promise<{ competitionId: string }>;

export default async function Page({
  params,
}: {
  params: Params;
}): Promise<React.JSX.Element> {
  const { competitionId } = await params;

  const competition = await getCompetitionById({
    id: competitionId!,
  });

  if (!competition) {
    throw new Error("Competition not found");
  }

  const wcif = await getWCIFByCompetitionId({
    competitionId: competitionId!,
  });

  if (!wcif) {
    throw new Error("WCIF not found");
  }

  const persons = wcif.persons.filter((person) => person.registrantId !== null);

  return (
    <main className="container mx-auto px-4 py-8">
      <CertificateManager competition={competition} persons={persons} />
    </main>
  );
}
