import type { Metadata } from "next";
import { getWcaCompetitionData } from "./_lib/queries";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const competitionData = await getWcaCompetitionData(id);

  if (!competitionData) {
    return {
      title: "Competencia no encontrada | Cubing México",
      description: "La competencia solicitada no existe.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${competitionData.name} | Cubing México`,
    description: `Resultados de ${competitionData.name}`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
