import type { Metadata } from "next";
import { getWcaCompetitionData } from "./_lib/queries";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const competitionData = await getWcaCompetitionData(id);

  return {
    title: `${competitionData?.name ?? "Competencia no encontrada"} | Cubing México`,
    description: competitionData
      ? `Resultados de ${competitionData.name}`
      : "La competencia no existe o no se encontró.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
