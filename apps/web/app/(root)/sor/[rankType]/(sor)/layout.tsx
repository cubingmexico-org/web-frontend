import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sum Of Ranks | Cubing México",
  description:
    "Encuentra el ranking de los mejores cuberos de México en cada evento de la WCA. Filtra por estado, género y más.",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="grow container mx-auto px-4 py-8">{children}</main>;
}
