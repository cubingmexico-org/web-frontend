import { CompetitionCard } from "@/components/competition-card";
import { Competition } from "@/types/wca";

export function CompetitionList({
  competitions,
  status,
}: {
  competitions: Competition[];
  status: "upcoming" | "ongoing" | "past";
}) {
  if (!competitions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-medium text-primary">
          No se encontraron competencias
        </h3>
        <p className="text-muted-foreground">
          No hay competencias{" "}
          {status === "upcoming"
            ? "próximas"
            : status === "ongoing"
              ? "en curso"
              : "pasadas"}{" "}
          que gestiones en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {competitions.map((competition) => (
        <CompetitionCard
          key={competition.id}
          competition={competition}
        />
      ))}
    </div>
  );
}
