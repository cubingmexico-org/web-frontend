"use client";

import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group";
import { useRouter } from "next/navigation";

interface RankTypeSelectorProps {
  selectedEventId: string;
  selectedRankType: "single" | "average";
}

export function RankTypeSelector({ selectedEventId, selectedRankType }: RankTypeSelectorProps) {
  const router = useRouter();

  if (selectedEventId === "333mbf" && selectedRankType === "average") {
    router.push(`/rankings/${selectedEventId}/single`);
  }

  if (selectedEventId === "333mbf") return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="font-bold">Tipo</span>
      <div className="flex flex-wrap gap-2 text-muted-foreground">
        <ToggleGroup type="single" value={selectedRankType}>
          <ToggleGroupItem value="single" aria-label="" onClick={() => router.push(`/rankings/${selectedEventId}/single`)}>
            Single
          </ToggleGroupItem>
          <ToggleGroupItem value="average" aria-label="" onClick={() => router.push(`/rankings/${selectedEventId}/average`)}>
            Average
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
