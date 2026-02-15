import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MapPin, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { buttonVariants } from "@workspace/ui/components/button";
import { Competition } from "@/types/wca";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";

export function CompetitionCard({
  competition,
}: {
  competition: Competition;
}) {
  const startDate = new Date(`${competition.start_date}T00:00:00`);
  const endDate = new Date(`${competition.end_date}T00:00:00`);
  const isSameDay = startDate.toDateString() === endDate.toDateString();

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="line-clamp-2 text-xl">
          {competition.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {competition.city}, {competition.country_iso2}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {isSameDay
                ? format(startDate, "d 'de' MMMM 'de' yyyy", { locale: es })
                : `${format(startDate, "d 'de' MMM", { locale: es })} - ${format(endDate, "d 'de' MMM 'de' yyyy", { locale: es })}`}
            </span>
          </div>
          <div className="flex items-start gap-2">
            {competition.event_ids.map((event, index: number) => (
              <span className={`cubing-icon event-${event}`} key={index} />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Link
          className={cn("w-full", buttonVariants({ variant: "outline" }))}
          href={`/badges/${competition.id}`}
        >
          Administrar Gafetes
        </Link>
        <Link
          className={cn("w-full", buttonVariants({ variant: "outline" }))}
          href={`/certificates/${competition.id}`}
        >
          Administrar Certificados
        </Link>
      </CardFooter>
    </Card>
  );
}
