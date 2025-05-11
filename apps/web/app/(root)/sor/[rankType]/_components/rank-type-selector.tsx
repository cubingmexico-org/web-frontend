"use client";

import * as React from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";
import { useRouter } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";
import {
  createSerializer,
  parseAsArrayOf,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { person } from "@/db/schema";
import { z } from "zod";

const searchParams = {
  name: parseAsString.withDefault(""),
  state: parseAsArrayOf(parseAsString).withDefault([]),
  gender: parseAsArrayOf(z.enum(person.gender.enumValues)).withDefault([]),
};
const serialize = createSerializer(searchParams);

interface RankTypeSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedRankType: "single" | "average";
  className?: string;
}

export function RankTypeSelector({
  selectedRankType,
  className,
  ...props
}: RankTypeSelectorProps) {
  const router = useRouter();
  const [{ name, state, gender }] = useQueryStates(searchParams);
  const hrefSingle = serialize(`/sor/single`, {
    name,
    state,
    gender,
  });
  const hrefAverage = serialize(`/sor/average`, {
    name,
    state,
    gender,
  });

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <span className="font-bold">Tipo</span>
      <div className="flex flex-wrap gap-2 text-muted-foreground">
        <ToggleGroup type="single" value={selectedRankType}>
          <ToggleGroupItem
            value="single"
            aria-label="single"
            onClick={() => router.push(hrefSingle)}
          >
            Single
          </ToggleGroupItem>
          <ToggleGroupItem
            value="average"
            aria-label="average"
            onClick={() => router.push(hrefAverage)}
          >
            Average
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
