"use client";

import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import * as React from "react";
import { RankTypeSelector } from "./rank-type-selector";
import { person } from "@/db/schema";
import {
  parseAsString,
  parseAsArrayOf,
  createSerializer,
  useQueryStates,
} from "nuqs";
import { z } from "zod";

const searchParams = {
  name: parseAsString.withDefault(""),
  state: parseAsArrayOf(parseAsString).withDefault([]),
  gender: parseAsArrayOf(z.enum(person.gender.enumValues)).withDefault([]),
};
const serialize = createSerializer(searchParams);

interface EventSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  events: {
    id: string;
    name: string;
  }[];
  selectedEventId: string;
  selectedRankType: "single" | "average";
  className?: string;
}

export function EventSelector({
  events,
  selectedEventId,
  selectedRankType,
  className,
  ...props
}: EventSelectorProps) {
  const eventName = events.find((event) => event.id === selectedEventId)?.name;

  const [{ name, state, gender }] = useQueryStates(searchParams);

  const hrefSingle = serialize(`/rankings/${selectedEventId}/single`, {
    name,
    state,
    gender,
  });
  const hrefAverage = serialize(`/rankings/${selectedEventId}/average`, {
    name,
    state,
    gender,
  });

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <h1 className="text-3xl font-bold">
        Ranking nacional oficial de {eventName} (
        {selectedRankType === "single" ? "Single" : "Average"})
      </h1>
      <div className="flex flex-col gap-2">
        <span className="font-bold">Eventos</span>
        <div className="flex flex-wrap gap-2 text-muted-foreground">
          {events.map((event) => {
            const href = serialize(
              `/rankings/${event.id}/${selectedRankType}`,
              {
                name,
                state,
                gender,
              },
            );

            return (
              <Link
                key={event.id}
                className={cn(
                  `cubing-icon event-${event.id} text-2xl`,
                  selectedEventId === event.id && "text-primary",
                )}
                href={href}
              />
            );
          })}
        </div>
      </div>
      <RankTypeSelector
        hrefSingle={hrefSingle}
        hrefAverage={hrefAverage}
        selectedEventId={selectedEventId}
        selectedRankType={selectedRankType}
      />
    </div>
  );
}
