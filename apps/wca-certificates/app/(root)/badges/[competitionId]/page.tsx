import { BadgeManager } from "@/components/badge-manager";
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

  return (
    <main className="container mx-auto px-4 py-8">
      <BadgeManager competition={competition} persons={wcif.persons} />
    </main>
  );
}
