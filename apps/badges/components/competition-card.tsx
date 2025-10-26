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
import { Badge } from "@workspace/ui/components/badge";
import { buttonVariants } from "@workspace/ui/components/button";
import { Competition } from "@/types/wca";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";

export function CompetitionCard({
  competition,
  status,
}: {
  competition: Competition;
  status: "upcoming" | "ongoing" | "past";
}) {
  const startDate = new Date(`${competition.start_date}T00:00:00`);
  const endDate = new Date(`${competition.end_date}T00:00:00`);
  const isSameDay = startDate.toDateString() === endDate.toDateString();

  const statusText = {
    upcoming: "Próxima",
    ongoing: "En Curso",
    past: "Pasada",
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <Image
          src="/placeholder.svg?height=192&width=384"
          alt={competition.name}
          className="h-full w-full object-cover"
          width={384}
          height={192}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4">
          <Badge
            variant={
              status === "upcoming"
                ? "default"
                : status === "ongoing"
                  ? "destructive"
                  : "secondary"
            }
            className="text-xs font-medium"
          >
            {statusText[status]}
          </Badge>
        </div>
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="line-clamp-2 text-xl">
          {competition.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
            <span className="text-sm text-gray-700">
              {competition.city}, {competition.country_iso2}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
            <span className="text-sm text-gray-700">
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
      <CardFooter className="p-4 pt-0">
        <Link
          className={cn("w-full", buttonVariants({ variant: "outline" }))}
          href={`/certificates/${competition.id}`}
        >
          Ver Detalles
        </Link>
      </CardFooter>
    </Card>
  );
}
