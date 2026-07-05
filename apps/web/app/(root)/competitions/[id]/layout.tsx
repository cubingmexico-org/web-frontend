import type { Metadata } from "next";
import { getWcaCompetitionData } from "./_lib/queries";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  console.log("layout-id", id);
  const competitionData = await getWcaCompetitionData(id);
  console.log("layout-competitionData", competitionData);

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
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
