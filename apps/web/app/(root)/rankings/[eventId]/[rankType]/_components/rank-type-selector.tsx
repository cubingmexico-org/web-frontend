"use client";

import * as React from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";
import { useRouter } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";

interface RankTypeSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedEventId: string;
  selectedRankType: "single" | "average";
  hrefSingle: string;
  hrefAverage: string;
  className?: string;
}

export function RankTypeSelector({
  selectedEventId,
  selectedRankType,
  hrefSingle,
  hrefAverage,
  className,
  ...props
}: RankTypeSelectorProps) {
  const router = useRouter();

  if (selectedEventId === "333mbf") return null;

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
