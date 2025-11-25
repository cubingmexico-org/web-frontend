import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizadores | Cubing México",
  description:
    "Encuentra el directorio de todos los organizadores mexicanos de la WCA. Filtra por estado, género y más.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grow container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-3xl font-bold">Organizadores</h1>
        <p>
          Directorio de todos los organizadores de competencias de la WCA en
          México.
        </p>
      </div>
      <div className="grid gap-6">{children}</div>
    </main>
  );
}
