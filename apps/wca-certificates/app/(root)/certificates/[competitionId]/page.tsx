import { CertificateManager } from "@/components/certificate-manager";
import { getCompetitionById, getWCIFByCompetitionId } from "@/db/queries";
import Link from "next/link";

import { notFound } from "next/navigation";

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
    notFound();
  }

  const wcif = await getWCIFByCompetitionId({
    competitionId: competitionId!,
  });

  if (!wcif) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">
            WCIF no disponible
          </h2>
          <div className="space-y-4">
            <p className="leading-relaxed">
              No se pudo encontrar el WCIF para esta competencia. Por favor, asegúrate
              de que el WCIF esté disponible antes de intentar generar certificados.
            </p>
            <p className="leading-relaxed">
              Si eres el organizador de esta competencia, entra a{" "}
              <Link
                href="https://live.worldcubeassociation.org/my-competitions"
                className="underline font-medium transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                WCA Live
              </Link>{" "}
              e importa la competencia para que el WCIF esté disponible.
            </p>
          </div>
        </div>
      </main>
    )
  }

  const persons = wcif.persons.filter((person) => person.registrantId !== null);

  return (
    <main className="container mx-auto px-4 py-8">
      <CertificateManager competition={competition} persons={persons} />
    </main>
  );
}
