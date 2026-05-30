import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

interface ResultsHeaderProps {
  competitionId: string;
  competitionName: string;
  competitionCity: string;
  defaultEventId: string;
}

export function ResultsHeader({
  competitionId,
  competitionName,
  competitionCity,
  defaultEventId,
}: ResultsHeaderProps) {
  return (
    <Card className="border-primary/10 bg-muted/20">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl">Resultados</CardTitle>
            <CardDescription>
              {competitionName}
              {competitionCity ? ` · ${competitionCity}` : ""}
            </CardDescription>
          </div>
          <Link
            href={`/competitions/${competitionId}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <ArrowLeft className="size-4" />
            Volver a la competencia
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Link
          href={`/competitions/${competitionId}/results/podiums`}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Podios
        </Link>
        <Link
          href={`/competitions/${competitionId}/results/all?eventId=${defaultEventId}`}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Todos
        </Link>
        <Link
          href={`/competitions/${competitionId}/results/py_person`}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Por persona
        </Link>
      </CardContent>
    </Card>
  );
}
