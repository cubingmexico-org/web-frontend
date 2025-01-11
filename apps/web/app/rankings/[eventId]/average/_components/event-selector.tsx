import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import * as React from "react";

interface EventSelectorProps {
  events: {
    id: string;
    name: string;
  }[];
  selectedEventId: string;
}

export function EventSelector({ events, selectedEventId }: EventSelectorProps) {
  const eventName = events.find((event) => event.id === selectedEventId)?.name;

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold">
        Ranking nacional oficial de {eventName}
      </h1>
      <div className="flex flex-col gap-2">
        <span className="font-bold">Eventos</span>
        <div className="flex flex-wrap gap-2 text-muted-foreground">
          {events.map((event) => (
            <Link
              key={event.id}
              className={cn(
                `cubing-icon event-${event.id} text-2xl`,
                selectedEventId === event.id && "text-primary",
              )}
              href={`/rankings/${event.id}/average`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
