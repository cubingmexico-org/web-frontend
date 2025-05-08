import * as React from "react";
import { SearchParams } from "@/types";
import { searchParamsCache } from "./_lib/validations";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { KinchTable } from "./_components/kinch-table";
import {
  getKinch,
  getKinchGenderCounts,
  getKinchStateCounts,
} from "./_lib/queries";
import { getValidFilters } from "@/lib/data-table";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters);

  const promises = Promise.all([
    getKinch({
      ...search,
      filters: validFilters,
    }),
    getKinchStateCounts(),
    getKinchGenderCounts(),
  ]);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-3xl font-bold">Kinch Ranks nacionales</h1>
        <p>
          Los Kinch Ranks son un sistema de clasificación innovador diseñado
          para evaluar la habilidad de un cubero en los 17 eventos oficiales de
          la WCA. Este sistema utiliza un enfoque único para calcular la
          puntuación de cada competidor en función de sus resultados en cada
          evento. Cada evento se puntúa en una escala del 0 al 100, considerando
          tanto los{" "}
          <Link
            className="text-muted-foreground hover:underline"
            href="/records"
          >
            récords nacionales (NR)
          </Link>{" "}
          como los récords personales (PR) de los competidores. A través de este
          enfoque, se busca equilibrar la clasificación entre todos los eventos,
          eliminando las desventajas percibidas en sistemas tradicionales como
          el{" "}
          <Link
            className="text-muted-foreground hover:underline"
            href="/sor/single"
          >
            SOR
          </Link>{" "}
          y promoviendo una visión más integral de las habilidades en la
          resolución de rompecabezas.
        </p>
      </div>
      <div className="grid gap-6">
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={7}
              filterCount={2}
              cellWidths={[
                "10rem",
                "30rem",
                "10rem",
                "10rem",
                "6rem",
                "6rem",
                "6rem",
              ]}
              shrinkZero
            />
          }
        >
          <KinchTable promises={promises} />
        </React.Suspense>
      </div>
    </main>
  );
}
